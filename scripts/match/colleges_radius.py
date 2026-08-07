#!/usr/bin/env python3
"""
Operator-facing helper: compute per-college xerox shop counts within a
configurable radius (default 1.5 km) using the same Google Maps scrape
that drives the Bangalore area directory.

Reuses process_77areas.py:load_data() and to_live_location() so the
field normalisation matches the live page exactly. Re-implements
haversine to avoid pulling in any geo dependency.

Usage:
  python scripts/match/colleges_radius.py                # all colleges, 1.5 km
  python scripts/match/colleges_radius.py iisc-bangalore # one college
  python scripts/match/colleges_radius.py --radius 2.0  # custom radius
  python scripts/match/colleges_radius.py --csv          # CSV instead of table

Output: a per-college report with shop count, nearest shop name, and
distance. The operator reads the report, opens 2–3 of the matched
shops in Google Maps to verify they are real xerox shops, then flips
presence: "live" and verifiedAt: "<today>" in content/pseo/colleges.ts.
"""
import argparse
import csv
import json
import math
import re
import sys
from pathlib import Path

# Reuse the same loader + normalizer the area pipeline uses, so the
# radius computation matches the live page semantically.
PARENT_DIR = Path(__file__).resolve().parent.parent / "scraper"
sys.path.insert(0, str(PARENT_DIR))
from process_77areas import load_data, to_live_location  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
COLLEGES_FILE = REPO_ROOT / "content" / "pseo" / "colleges.ts"
LLM_SHOPS_FILE = REPO_ROOT / "scripts" / "clean" / "data" / "shops-llm-verified.jsonl"
CLEAN_SHOPS_FILE = REPO_ROOT / "scripts" / "scraper" / "data" / "shops-clean.jsonl"
DEFAULT_RADIUS_KM = 1.5


def haversine_km(lat1, lng1, lat2, lng2):
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def parse_colleges(path: Path):
    """Lightweight extractor for the colleges.ts entries we need.
    Avoids a TS parser dependency by matching the literal object shape.
    """
    text = path.read_text()
    entries = []
    # Each entry block starts with "  {" and ends with "  }," at the
    # same indent. We split on those markers and parse each block.
    blocks = re.split(r"\n  \{\n", "\n" + text)
    for block in blocks[1:]:
        end = block.find("\n  },")
        if end == -1:
            continue
        body = block[:end]
        slug = re.search(r'slug:\s*"([^"]+)"', body)
        name = re.search(r'name:\s*"([^"]+)"', body)
        short = re.search(r'shortName:\s*"([^"]+)"', body)
        lat = re.search(r"lat:\s*([\-\d.]+)", body)
        lng = re.search(r"lng:\s*([\-\d.]+)", body)
        presence = re.search(r'presence:\s*"([^"]+)"', body)
        if not (slug and name and lat and lng):
            continue
        try:
            lat_f, lng_f = float(lat.group(1)), float(lng.group(1))
        except ValueError:
            continue
        entries.append({
            "slug": slug.group(1),
            "name": name.group(1),
            "shortName": short.group(1) if short else None,
            "lat": lat_f,
            "lng": lng_f,
            "presence": presence.group(1) if presence else "planned",
        })
    return entries


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("slug", nargs="?", help="If set, only print this college")
    ap.add_argument("--radius", type=float, default=DEFAULT_RADIUS_KM,
                    help=f"Radius in km (default {DEFAULT_RADIUS_KM})")
    ap.add_argument("--csv", action="store_true", help="Emit CSV instead of a table")
    ap.add_argument("--include-planned", action="store_true",
                    help="Include planned colleges (default: only live)")
    args = ap.parse_args()

    data = load_data()
    shops = []
    if LLM_SHOPS_FILE.exists():
        with LLM_SHOPS_FILE.open() as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                rec = json.loads(line)
                if rec.get("lat") and rec.get("lng"):
                    shops.append(rec)
        print(f"[colleges_radius] using LLM-verified file: {LLM_SHOPS_FILE.name}", file=sys.stderr)
    elif CLEAN_SHOPS_FILE.exists():
        with CLEAN_SHOPS_FILE.open() as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                rec = json.loads(line)
                if rec.get("lat") and rec.get("lng"):
                    shops.append(rec)
        print(f"[colleges_radius] using cleaned file: {CLEAN_SHOPS_FILE.name}", file=sys.stderr)
    else:
        for entry in data:
            loc = to_live_location(entry)
            if loc["lat"] and loc["lng"]:
                shops.append(loc)
        print(f"[colleges_radius] using raw scrape (no cleaner output)", file=sys.stderr)
    print(f"[colleges_radius] loaded {len(shops)} shops with coords", file=sys.stderr)

    colleges = parse_colleges(COLLEGES_FILE)
    if not args.include_planned:
        colleges = [c for c in colleges if c["presence"] == "live"]
    if args.slug:
        colleges = [c for c in colleges if c["slug"] == args.slug]
    if not colleges:
        print("[colleges_radius] no colleges to process", file=sys.stderr)
        return 0

    rows = []
    for c in colleges:
        matched = []
        for s in shops:
            d = haversine_km(c["lat"], c["lng"], s["lat"], s["lng"])
            if d <= args.radius:
                matched.append((d, s))
        matched.sort(key=lambda x: x[0])
        nearest = matched[0][1] if matched else None
        nearest_d = matched[0][0] if matched else None
        rows.append({
            "slug": c["slug"],
            "name": c["name"],
            "presence": c["presence"],
            "shop_count": len(matched),
            "nearest_shop": nearest["name"] if nearest else "",
            "nearest_km": f"{nearest_d:.3f}" if nearest_d is not None else "",
        })

    if args.csv:
        writer = csv.DictWriter(sys.stdout, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    else:
        header = f"{'slug':<32} {'name':<32} {'presence':<8} {'shops':>5} {'nearest':<32} {'km':>6}"
        print(header)
        print("-" * len(header))
        for r in rows:
            print(
                f"{r['slug']:<32} {r['name'][:32]:<32} {r['presence']:<8} "
                f"{r['shop_count']:>5} {r['nearest_shop'][:32]:<32} {r['nearest_km']:>6}"
            )

    return 0


if __name__ == "__main__":
    sys.exit(main())
