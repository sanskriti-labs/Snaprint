#!/usr/bin/env python3
"""
Convert the gosom/google-maps-scraper CSV output into the JSONL format
the rest of the snaprint pipeline expects (matches the shape of
results-77areas.json).

Field mapping notes:
  - CSV 'longitude' → JSONL 'longtitude' (the typo in the existing
    data, kept for compat with process_77areas.py to_live_location)
  - CSV 'website' → JSONL 'web_site'
  - CSV 'descriptions' → JSONL 'description'
  - CSV 'category' (single) → JSONL 'categories' (list) + 'category'
  - Numeric strings parsed back to numbers where safe
  - JSON-typed columns (open_hours, popular_times, etc.) parsed from
    CSV strings; fall back to source string if parsing fails

Usage:
  python scripts/clean/csv_to_jsonl.py <input.csv> <output.jsonl>
"""
import csv
import json
import sys
from pathlib import Path


def _try_parse_json(s):
    if not s:
        return None
    try:
        return json.loads(s)
    except (json.JSONDecodeError, TypeError):
        return s


def _try_int(s):
    if not s:
        return None
    try:
        return int(s)
    except (ValueError, TypeError):
        return None


def _try_float(s):
    if not s:
        return None
    try:
        return float(s)
    except (ValueError, TypeError):
        return None


def csv_to_jsonl(csv_path: Path, jsonl_path: Path) -> tuple[int, int]:
    """Returns (rows_read, rows_written)."""
    rows_written = 0
    with csv_path.open(newline="", encoding="utf-8") as fin, \
         jsonl_path.open("w", encoding="utf-8") as fout:
        reader = csv.DictReader(fin)
        for row in reader:
            # Bail on rows with no lat/lng
            lat = _try_float(row.get("latitude"))
            lng = _try_float(row.get("longitude"))
            if lat is None or lng is None:
                continue

            record = {
                "input_id": row.get("input_id", ""),
                "link": row.get("link", ""),
                "cid": row.get("cid", ""),
                "title": row.get("title", ""),
                "categories": [row["category"]] if row.get("category") else [],
                "category": row.get("category", ""),
                "address": row.get("address", ""),
                "open_hours": _try_parse_json(row.get("open_hours", "")),
                "popular_times": _try_parse_json(row.get("popular_times", "")),
                "web_site": row.get("website", ""),
                "phone": row.get("phone", ""),
                "plus_code": row.get("plus_code", ""),
                "review_count": _try_int(row.get("review_count")) or 0,
                "review_rating": _try_float(row.get("review_rating")),
                "reviews_per_rating": _try_parse_json(row.get("reviews_per_rating", "")),
                "latitude": lat,
                "longtitude": lng,  # ← typo preserved for compat
                "status": row.get("status", ""),
                "description": row.get("descriptions", ""),
                "reviews_link": row.get("reviews_link", ""),
                "thumbnail": row.get("thumbnail", ""),
                "timezone": row.get("timezone", ""),
                "price_range": row.get("price_range", ""),
                "data_id": row.get("data_id", ""),
                "street_view_url": row.get("street_view_url", ""),
                "place_id": row.get("place_id", ""),
                "images": _try_parse_json(row.get("images", "")),
                "reservations": _try_parse_json(row.get("reservations", "")),
                "order_online": _try_parse_json(row.get("order_online", "")),
                "menu": _try_parse_json(row.get("menu", "")),
                "owner": _try_parse_json(row.get("owner", "")),
                "complete_address": _try_parse_json(row.get("complete_address", "")),
                "credit_cards_accepted": _try_parse_json(row.get("credit_cards_accepted", "")),
                "about": _try_parse_json(row.get("about", "")),
                "user_reviews": _try_parse_json(row.get("user_reviews", "")),
                "user_reviews_extended": _try_parse_json(row.get("user_reviews_extended", "")),
                "emails": _try_parse_json(row.get("emails", "")),
            }
            fout.write(json.dumps(record, ensure_ascii=False) + "\n")
            rows_written += 1
    return (rows_written, rows_written)


def main():
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <input.csv> <output.jsonl>", file=sys.stderr)
        return 1
    csv_path = Path(sys.argv[1])
    jsonl_path = Path(sys.argv[2])
    if not csv_path.exists():
        print(f"ERROR: {csv_path} not found", file=sys.stderr)
        return 1
    rows_written, _ = csv_to_jsonl(csv_path, jsonl_path)
    print(f"Converted {rows_written} rows from {csv_path.name} → {jsonl_path.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
