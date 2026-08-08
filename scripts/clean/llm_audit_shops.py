#!/usr/bin/env python3
"""
LLM audit pass on the cleaned shop dataset.

Heuristic cleaning (clean_shops.py) gets us from ~1573 -> ~1138 by
removing obvious non-xerox shops (malls, banks, hotels, bus stops).
The remaining 1138 include some borderline cases: "Xerox & Gift Shop",
"Click Corner", "Max Cyber Cafe" (filtered), "DJ Enterprises" etc.
that the heuristic can't reliably classify.

This script asks an LLM to make a binary call on each entry: is this
a real xerox/print shop a customer could walk into and get a document
printed? Outputs shops-llm-verified.jsonl with only the YES entries.

Reads from: scripts/scraper/data/shops-clean.jsonl
Writes to:  scripts/clean/data/shops-llm-verified.jsonl
Cache:      scripts/clean/data/llm-audit-cache.json (so re-runs skip
            already-judged entries when shops-clean.jsonl changes)

Concurrency: 16 parallel requests. 1138 entries * ~0.4s each -> ~30s
              total wall clock. Cost: ~$0.10 with M2.5-highspeed.

Usage:
  python scripts/clean/llm_audit_shops.py            # full run
  python scripts/clean/llm_audit_shops.py --limit 50  # smoke test
  python scripts/clean/llm_audit_shops.py --concurrency 4
  python scripts/clean/llm_audit_shops.py --report    # summarise cache
"""
import argparse
import asyncio
import json
import os
import sys
import time
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PARENT_DIR = SCRIPT_DIR.parent.parent
IN_SHOP = PARENT_DIR / "scripts" / "scraper" / "data" / "shops-clean.jsonl"
OUT_VERIFIED = SCRIPT_DIR / "data" / "shops-llm-verified.jsonl"
CACHE_FILE = SCRIPT_DIR / "data" / "llm-audit-cache.json"

# Anthropic-compatible endpoint. The default values match ZAI's settings
# (api.minimax.io/anthropic -> Proxied Anthropic API). Override via
# env if you proxy elsewhere.
API_BASE = os.environ.get("ANTHROPIC_BASE_URL", "https://api.minimax.io/anthropic").rstrip("/")
API_KEY = os.environ.get("ANTHROPIC_AUTH_TOKEN") or os.environ.get("ANTHROPIC_API_KEY")
MODEL = os.environ.get("LLM_AUDIT_MODEL", "MiniMax-M3")

# Conservative prompt: only flag NO if it's clearly not a xerox shop.
# YES-by-default for any shop where xerox/print is plausibly offered.
PROMPT_TEMPLATE = """You are auditing Google Maps listings for a Bangalore xerox/print shop directory. We have already filtered out obvious non-shops (malls, banks, hotels, bus stops, etc.). Your job is to make a binary call on borderline cases.

Listing:
  Name: {name}
  Category: {category}
  Address: {address}

Question: Is this a real xerox / print / photocopy shop where a customer could walk in and get a document printed (B&W, colour, binding, lamination, scanning, etc.)?

Answer YES if the shop plausibly offers xerox/print services, even if it also sells other things (stationery, gifts, mobile recharge, internet, etc.).

Answer NO only if the shop is clearly something else entirely (e.g. a restaurant, salon, hardware store, mobile-only shop, gift shop, etc.) with no plausible xerox/print service.

Respond with exactly two lines:
  YES|NO
  one-sentence reason
"""


async def classify_one(rec: dict, sem: asyncio.Semaphore, session) -> tuple[bool, str]:
    """Returns (keep, reason). keep=True if YES."""
    prompt = PROMPT_TEMPLATE.format(
        name=rec.get("name", ""),
        category=rec.get("category") or "(uncategorised)",
        address=rec.get("address", ""),
    )
    async with sem:
        try:
            async with session.post(
                f"{API_BASE}/v1/messages",
                headers={
                    "x-api-key": API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": MODEL,
                    # 500, not 100: models that emit a `thinking` block before
                    # the answer were getting cut off before the YES/NO line
                    # ever appeared, which silently defaulted every entry to
                    # "keep" (see PROMPT_ERROR fallback below) — a 0-reject
                    # audit that looked like it ran cleanly.
                    "max_tokens": 500,
                    "temperature": 0,
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=30,
            ) as resp:
                if resp.status != 200:
                    text = await resp.text()
                    return None, f"http {resp.status}: {text[:120]}"
                data = await resp.json()
                answer = ""
                for block in data.get("content", []):
                    if block.get("type") == "text":
                        answer += block.get("text", "")
                answer = answer.strip()
                first_line = answer.splitlines()[0].strip().upper() if answer else ""
                if first_line.startswith("NO"):
                    return False, answer.split("\n", 1)[1].strip() if "\n" in answer else "no"
                if first_line.startswith("YES"):
                    return True, answer.split("\n", 1)[1].strip() if "\n" in answer else "yes"
                # Neither YES nor NO on the first line (truncated / malformed
                # response) is a judging failure, not a verdict — surfaced as
                # an explicit error entry rather than silently kept.
                return None, f"unparseable response: {answer[:150]!r}"
        except Exception as e:
            return None, f"error: {e}"


def load_cache() -> dict:
    if CACHE_FILE.exists():
        try:
            return json.loads(CACHE_FILE.read_text())
        except Exception:
            pass
    return {}


def save_cache(cache: dict) -> None:
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False, indent=2))


async def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--limit", type=int, default=0, help="Process only N entries (smoke test)")
    ap.add_argument("--concurrency", type=int, default=16)
    ap.add_argument("--report", action="store_true", help="Summarise cache and exit")
    ap.add_argument("--rebuild", action="store_true", help="Ignore cache, re-classify all")
    args = ap.parse_args()

    if not API_KEY:
        print("ERROR: ANTHROPIC_AUTH_TOKEN or ANTHROPIC_API_KEY not set", file=sys.stderr)
        sys.exit(1)
    if not IN_SHOP.exists():
        print(f"ERROR: run scripts/clean/clean_shops.py first to produce {IN_SHOP}", file=sys.stderr)
        sys.exit(1)

    if args.report:
        cache = load_cache()
        if not cache:
            print("(no cached judgments)")
            return 0
        yes = sum(1 for v in cache.values() if v["keep"])
        no = sum(1 for v in cache.values() if not v["keep"])
        print(f"Cache: {len(cache)} judgments ({yes} YES, {no} NO)")
        return 0

    # Load shop records
    records = []
    with IN_SHOP.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            records.append(json.loads(line))
    if args.limit:
        records = records[: args.limit]
    print(f"Loaded {len(records)} records from {IN_SHOP.name}", file=sys.stderr)

    cache = {} if args.rebuild else load_cache()
    pending = [r for r in records if str(r.get("placeId")) not in cache]
    print(f"Cache hits: {len(records) - len(pending)}; new entries to judge: {len(pending)}", file=sys.stderr)

    if pending:
        try:
            import aiohttp
        except ImportError:
            print("ERROR: aiohttp not installed. Run: pip install aiohttp", file=sys.stderr)
            sys.exit(1)

        sem = asyncio.Semaphore(args.concurrency)
        async with aiohttp.ClientSession() as session:
            start = time.time()
            tasks = [classify_one(r, sem, session) for r in pending]
            results = await asyncio.gather(*tasks)
            errored = 0
            for r, (keep, reason) in zip(pending, results):
                if keep is None:
                    # Judging failed (truncated/malformed response, HTTP
                    # error, exception) — do NOT cache. An uncached entry
                    # is retried on the next run instead of silently
                    # shipping as a false YES.
                    errored += 1
                    continue
                cache[str(r.get("placeId"))] = {"keep": keep, "reason": reason}
            save_cache(cache)
            elapsed = time.time() - start
            print(f"  {len(pending)} judged in {elapsed:.1f}s ({len(pending)/max(elapsed,0.1):.1f}/s)", file=sys.stderr)
            if errored:
                print(f"  WARNING: {errored} entries failed to judge and were NOT cached (will retry next run)", file=sys.stderr)

    # Build verified output
    verified = []
    rejected = 0
    unjudged = 0
    for r in records:
        v = cache.get(str(r.get("placeId")))
        if v is None:
            unjudged += 1
        elif v["keep"]:
            verified.append(r)
        else:
            rejected += 1
    OUT_VERIFIED.parent.mkdir(parents=True, exist_ok=True)
    with OUT_VERIFIED.open("w") as f:
        for r in verified:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"\nWritten {len(verified)} verified shops to {OUT_VERIFIED.name}")
    print(f"  rejected: {rejected}")
    if unjudged:
        print(f"  UNJUDGED (not in output, re-run to retry): {unjudged}")
    if rejected == 0 and len(records) > 20:
        print(f"  WARNING: 0 rejections across {len(records)} records — audit may not be discriminating. "
              f"Spot-check with --limit before trusting this output.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
