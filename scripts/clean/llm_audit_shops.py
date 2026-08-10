#!/usr/bin/env python3
"""
LLM audit pass on the cleaned shop dataset.

Heuristic cleaning (clean_shops.py) gets us from ~1573 -> ~1158 by
removing obvious non-xerox shops (malls, banks, hotels, bus stops) via
title-keyword and category rules. This script goes further: it reads
each listing's FULL category list and real customer review text (not
just name + one category) and asks an LLM to make a genuine judgment
call rather than a rule match. It catches what keyword/category rules
structurally cannot — e.g. a generically-named shop ("Sri Enterprises")
whose reviews describe getting documents printed there, or a
print-keyword title that reviews reveal is actually unrelated (a
t-shirt printing shop, not a document/xerox shop).

Policy: lean permissive. Default to YES unless something actively
contradicts a print service (reviews/category clearly describe an
unrelated business with no print signal anywhere). The heuristic
cleaner already removed the structurally-impossible cases; this pass
exists to catch genuine misclassifications, not to re-litigate every
borderline case the heuristic already let through for good reason
(see clean_shops.py's SOFT_NEG_CATS — small shops legitimately
combine xerox with side businesses).

Reads from: scripts/scraper/data/results-<city>.json (raw scrape —
            needed for review text, which shops-clean.jsonl doesn't
            carry) joined against shops-clean.jsonl by place_id/cid so
            only heuristic-approved records reach the LLM pass.
Writes to:  scripts/clean/data/shops-llm-verified.jsonl
Cache:      scripts/clean/data/llm-audit-cache.json (so re-runs skip
            already-judged entries when shops-clean.jsonl changes)

Usage:
  python scripts/clean/llm_audit_shops.py                      # Bengaluru, full run
  python scripts/clean/llm_audit_shops.py --city hyderabad      # another city
  python scripts/clean/llm_audit_shops.py --limit 50            # smoke test
  python scripts/clean/llm_audit_shops.py --concurrency 4
  python scripts/clean/llm_audit_shops.py --report              # summarise cache
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
SCRAPER_DATA = PARENT_DIR / "scripts" / "scraper" / "data"
CLEAN_FILE_DEFAULT = SCRAPER_DATA / "shops-clean.jsonl"
OUT_VERIFIED = SCRIPT_DIR / "data" / "shops-llm-verified.jsonl"
CACHE_FILE = SCRIPT_DIR / "data" / "llm-audit-cache.json"

# City slug -> raw scrape file, clean file. Mirrors scripts/scraper/cities/.
CITY_FILES = {
    "bengaluru": (SCRAPER_DATA / "results-77areas.json", SCRAPER_DATA / "shops-clean.jsonl"),
    "hyderabad": (SCRAPER_DATA / "results-hyderabad.json", SCRAPER_DATA / "shops-clean-hyderabad.jsonl"),
}

# Anthropic-compatible endpoint. The default values match ZAI's settings
# (api.minimax.io/anthropic -> Proxied Anthropic API). Override via
# env if you proxy elsewhere.
API_BASE = os.environ.get("ANTHROPIC_BASE_URL", "https://api.minimax.io/anthropic").rstrip("/")
API_KEY = os.environ.get("ANTHROPIC_AUTH_TOKEN") or os.environ.get("ANTHROPIC_API_KEY")
# M2.7, not M3: M3 emits a `thinking` block before answering, which burned
# through the old max_tokens budget before ever reaching YES/NO — the root
# cause of a prior 0-reject run that looked clean but never actually judged
# anything (see max_tokens comment in classify_one). M2.7 answers directly.
MODEL = os.environ.get("LLM_AUDIT_MODEL", "MiniMax-M2.7")

PROMPT_TEMPLATE = """You are auditing Google Maps listings for a xerox/print shop directory. A heuristic filter already removed obvious non-shops (malls, banks, hotels, bus stops, pure travel/insurance agencies with no print signal). Your job is to catch what that keyword-and-category filter cannot: read the actual review text and make a genuine judgment call.

Listing:
  Name: {name}
  Categories (all, as tagged by Google): {categories}
  Address: {address}
  Customer review excerpts (if any): {reviews}

Question: Is this a real xerox / print / photocopy shop where a customer could walk in and get a document printed (B&W, colour, binding, lamination, scanning, etc.)?

Lean permissive: default to YES if the shop plausibly offers xerox/print services, even alongside other things (stationery, gifts, mobile recharge, courier, travel booking, insurance, etc. — small shops routinely combine several services). A generic name with no obvious print category is still YES if reviews mention printing/xerox/photocopy/binding/scanning.

Answer NO only when something actively CONTRADICTS a print service — reviews or categories clearly describe an unrelated business (e.g. reviews are all about haircuts, food, or vehicle repair) with no print signal anywhere in the listing.

Respond with exactly two lines:
  YES|NO
  one-sentence reason citing what you saw (or didn't see) in the reviews/categories
"""


def extract_review_snippets(raw: dict, max_reviews: int = 3, max_chars: int = 120) -> str:
    """Pull a few short review excerpts from the raw scrape record.

    Google Maps scrapes carry review text under `user_reviews` (list of
    dicts with a `Description` field). Truncated per-review and capped
    in count to keep the prompt small — this is a classification signal,
    not a full review dump.
    """
    reviews = raw.get("user_reviews") or []
    if not isinstance(reviews, list):
        return "(none)"
    snippets = []
    for r in reviews[:max_reviews]:
        if not isinstance(r, dict):
            continue
        text = (r.get("Description") or "").strip()
        if text:
            snippets.append(text[:max_chars])
    if not snippets:
        about = raw.get("about")
        if about:
            return json.dumps(about, ensure_ascii=False)[:300]
        return "(none)"
    return " | ".join(snippets)


async def classify_one(rec: dict, raw: dict, sem: asyncio.Semaphore, session) -> tuple[bool, str]:
    """Returns (keep, reason). keep=True if YES.

    rec is the heuristic-cleaned record (normalised field names); raw is
    the matching raw scrape record, used only for review text/categories
    the cleaned record doesn't carry.
    """
    categories = rec.get("categories") or ([rec["category"]] if rec.get("category") else [])
    prompt = PROMPT_TEMPLATE.format(
        name=rec.get("name", ""),
        categories=", ".join(c for c in categories if c) or "(uncategorised)",
        address=rec.get("address", ""),
        reviews=extract_review_snippets(raw),
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


def load_raw_by_id(raw_file: Path) -> dict:
    """Index raw scrape records by place_id (falls back to cid) for the
    review-text join. Records without either key can't be joined and are
    skipped — classify_one() degrades to empty reviews for those."""
    by_id = {}
    if not raw_file.exists():
        return by_id
    with raw_file.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            r = json.loads(line)
            key = r.get("place_id") or r.get("cid")
            if key:
                by_id[str(key)] = r
    return by_id


async def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--city", default="bengaluru", choices=sorted(CITY_FILES),
                     help="Which city's scrape/clean files to audit")
    ap.add_argument("--limit", type=int, default=0, help="Process only N entries (smoke test)")
    ap.add_argument("--concurrency", type=int, default=4,
                     help="Live testing showed ~30%% empty-response flakiness even at low "
                          "concurrency on this API; kept modest by default, not for throughput.")
    ap.add_argument("--report", action="store_true", help="Summarise cache and exit")
    ap.add_argument("--rebuild", action="store_true", help="Ignore cache, re-classify all")
    args = ap.parse_args()

    raw_file, clean_file = CITY_FILES[args.city]

    if args.report:
        cache = load_cache()
        if not cache:
            print("(no cached judgments)")
            return 0
        yes = sum(1 for v in cache.values() if v["keep"])
        no = sum(1 for v in cache.values() if not v["keep"])
        print(f"Cache: {len(cache)} judgments ({yes} YES, {no} NO)")
        return 0

    if not API_KEY:
        print("ERROR: ANTHROPIC_AUTH_TOKEN or ANTHROPIC_API_KEY not set", file=sys.stderr)
        sys.exit(1)
    if not clean_file.exists():
        print(f"ERROR: run scripts/clean/clean_shops.py first to produce {clean_file}", file=sys.stderr)
        sys.exit(1)

    # Load shop records
    records = []
    with clean_file.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            records.append(json.loads(line))
    if args.limit:
        records = records[: args.limit]
    print(f"Loaded {len(records)} records from {clean_file.name}", file=sys.stderr)

    raw_by_id = load_raw_by_id(raw_file)
    print(f"Loaded {len(raw_by_id)} raw records from {raw_file.name} for review-text join", file=sys.stderr)

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
            tasks = [
                classify_one(r, raw_by_id.get(str(r.get("placeId"))) or raw_by_id.get(str(r.get("cid"))) or {}, sem, session)
                for r in pending
            ]
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
