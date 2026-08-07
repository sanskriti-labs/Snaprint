#!/usr/bin/env python3
"""
Generate a per-area spot-check report for the operator.

Reads from scripts/clean/data/shops-llm-verified.jsonl and groups by
the area whose keywords appear in the shop's address/title. Outputs
a CSV listing only "borderline" entries — ones whose category is not
in the core xerox list. The operator opens 2-3 of these per area in
Google Maps to verify they're real xerox shops before the data
goes live.

Output columns: area, name, category, address, lat, lng, google_maps_url,
is_recommend_check. The 'is_recommend_check' flag is True for entries
that are statistically more likely to be mis-classified (Stationery
store, Digital printing service, Internet cafe, generic Store — i.e.
not the canonical Copy shop / Print shop / Copying supply store).

Usage:
  python scripts/clean/spot_check_report.py
  python scripts/clean/spot_check_report.py --out /tmp/spot-check.csv
  python scripts/clean/spot_check_report.py --only btm-layout
"""
import argparse
import csv
import json
import sys
import urllib.parse
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
LLM_FILE = PROJECT_ROOT / "scripts" / "clean" / "data" / "shops-llm-verified.jsonl"
QUERIES_FILE = PROJECT_ROOT / "scripts" / "scraper" / "bangalore-xeroxshops.txt"

# Categories that are unambiguously xerox shops — no spot-check needed.
CORE_CATS = {
    "Copy shop", "Print shop", "Copying supply store",
    "Offset Printer", "Digital printing service", "Commercial printer",
}

# Categories where the LLM passed the shop but operator should
# spot-check 2-3 examples.
BORDERLINE_CATS = {
    "Stationery store", "Digital printer", "Lamination service",
    "Office supply store", "Office services",
    "Printing equipment supplier", "Stationery wholesaler",
    "Paper store", "Photo shop", "Photography studio",
}


def load_area_keywords():
    """Mirror the keyword map from process_77areas.py:AREA_KW."""
    text = QUERIES_FILE.read_text()
    out = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        # Strip "xerox shops in " prefix and " Bangalore" suffix
        q = line
        if q.lower().startswith("xerox shops in "):
            q = q[len("xerox shops in "):]
        if q.lower().endswith(" bangalore"):
            q = q[: -len(" bangalore")]
        slug = q.lower().replace(" ", "-")
        keywords = [q.lower()]
        out[slug] = keywords
    return out


def assign_area(rec, area_keywords):
    """Best-effort match: returns the area slug whose keyword appears
    in the address/title, or None. Mirrors process_77areas.get_area_slug
    but applies to LLM-verified LiveLocation shape."""
    haystack = (
        (rec.get("name") or "") + " " + (rec.get("address") or "")
    ).lower()
    for slug, kws in area_keywords.items():
        for kw in kws:
            if kw in haystack:
                return slug
    return None


def maps_url(rec):
    """Build a Google Maps search URL for the place."""
    lat = rec.get("lat")
    lng = rec.get("lng")
    if lat and lng:
        return f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"
    addr = rec.get("address") or rec.get("name") or ""
    return f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(addr)}"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", default=str(SCRIPT_DIR / "data" / "spot-check-report.csv"))
    ap.add_argument("--only", help="Limit to one area slug (e.g. btm-layout)")
    args = ap.parse_args()

    if not LLM_FILE.exists():
        print(f"ERROR: {LLM_FILE} not found. Run llm_audit_shops.py first.", file=sys.stderr)
        return 1

    area_keywords = load_area_keywords()
    records = []
    with LLM_FILE.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            records.append(json.loads(line))

    # Group by area
    by_area: dict = {}
    for rec in records:
        area = assign_area(rec, area_keywords)
        if area is None:
            continue
        by_area.setdefault(area, []).append(rec)

    rows = []
    for area, recs in sorted(by_area.items()):
        for rec in recs:
            cat = rec.get("category") or ""
            is_borderline = cat in BORDERLINE_CATS or cat not in CORE_CATS
            rows.append({
                "area": area,
                "name": rec.get("name", ""),
                "category": cat,
                "address": rec.get("address", ""),
                "lat": rec.get("lat", ""),
                "lng": rec.get("lng", ""),
                "google_maps_url": maps_url(rec),
                "is_recommend_check": "yes" if is_borderline else "no",
            })

    if args.only:
        rows = [r for r in rows if r["area"] == args.only]

    # Sort: borderline first within each area, then by name
    rows.sort(key=lambda r: (r["area"], r["is_recommend_check"] == "no", r["name"].lower()))

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else [
            "area", "name", "category", "address", "lat", "lng",
            "google_maps_url", "is_recommend_check",
        ])
        writer.writeheader()
        writer.writerows(rows)

    # Summary
    total_areas = len(by_area)
    borderline_total = sum(1 for r in rows if r["is_recommend_check"] == "yes")
    print(f"Spot-check report: {out_path}")
    print(f"  Areas: {total_areas}")
    print(f"  Total shops: {len(rows)}")
    print(f"  Borderline (recommend spot-check): {borderline_total}")
    print(f"  Per-area breakdown:")
    for area, recs in sorted(by_area.items()):
        b = sum(1 for r in recs if (r.get("category") or "") in BORDERLINE_CATS or (r.get("category") or "") not in CORE_CATS)
        print(f"    {area:<24} {len(recs):>3} shops, {b} borderline")
    return 0


if __name__ == "__main__":
    sys.exit(main())
