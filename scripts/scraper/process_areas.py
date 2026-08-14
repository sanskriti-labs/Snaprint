#!/usr/bin/env python3
"""
Transform Google Maps scraped xerox shop data into LiveLocation entries and
(re)generate the TypeScript area blocks in content/pseo/areas.ts.

Generalized from the original Bengaluru-only process_77areas.py: per-city
AREA_KW / queries file / data paths now live in scripts/scraper/cities/<slug>.py,
and this script only replaces that one city's block in areas.ts — other
cities' blocks are left untouched.

Usage: python scripts/scraper/process_areas.py <city_slug>
       python scripts/scraper/process_areas.py bengaluru
"""
import argparse
import importlib
import json
import math
import re
import statistics
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUT_FILE = REPO_ROOT / "content/pseo/areas.ts"

CITY_DISPLAY_NAMES = {
    "bengaluru": "Bangalore",
}

# Query-file suffixes to strip when building a slug, for cities where the
# queries span multiple sub-city names (e.g. Delhi NCR queries end in
# "Delhi", "Gurugram", or "Noida" — no single CITY_DISPLAY_NAMES value
# covers all of them). Falls back to [CITY_DISPLAY_NAMES/city slug] when a
# city isn't listed here.
#
# "Noida" is deliberately excluded here: unlike the Delhi/Gurugram entries,
# every Noida AREA_KW slug in cities/delhi_ncr.py keeps "-noida" as part of
# the slug itself (sector-18-noida, atta-market-noida, sector-62-noida), so
# stripping "Noida" from the query text would break the slug match instead
# of fixing it.
CITY_QUERY_SUFFIXES = {
    "delhi_ncr": ["Delhi", "Gurugram"],
}


def load_city_config(slug):
    mod = importlib.import_module(f"cities.{slug}")
    assert mod.CITY_SLUG == slug, f"cities/{slug}.py declares CITY_SLUG={mod.CITY_SLUG!r}"
    return mod


def load_data(cfg):
    """Load shop records, preferring clean_shops.py output over the raw scrape."""
    clean_file = cfg.CLEAN_FILE
    if clean_file.exists():
        cleaned = []
        with clean_file.open() as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                rec = json.loads(line)
                cleaned.append({
                    "title":      rec.get("name", ""),
                    "address":    rec.get("address", ""),
                    "latitude":   rec.get("lat"),
                    "longitude":  rec.get("lng"),
                    "phone":      rec.get("phone", ""),
                    "review_rating": rec.get("rating"),
                    "review_count":  rec.get("reviews", 0),
                    "place_id":   rec.get("placeId"),
                    "category":   rec.get("category"),
                })
        return cleaned
    with open(cfg.RAW_DATA_FILE) as f:
        return [json.loads(l) for l in f if l.strip()]


def load_queries(cfg):
    """Load area slugs from the city's queries file by parsing query names.
    Preserves order; drops duplicate slugs, keeping first occurrence only."""
    seen = set()
    slugs = []
    with open(cfg.QUERIES_FILE) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            q = line
            if q.lower().startswith("xerox shops in "):
                q = q[len("xerox shops in "):]
            suffixes = CITY_QUERY_SUFFIXES.get(
                cfg.CITY_SLUG, [CITY_DISPLAY_NAMES.get(cfg.CITY_SLUG, cfg.CITY_SLUG)]
            )
            for suffix in suffixes:
                new_q = re.sub(rf'\s+{re.escape(suffix)}\s*$', '', q, flags=re.IGNORECASE).strip()
                if new_q != q:
                    q = new_q
                    break
            # Strip punctuation (periods, etc.) before slugifying — "T. Nagar"
            # must slugify to "t-nagar" to match the AREA_KW key, not "t.-nagar".
            q = re.sub(r'[^\w\s-]', '', q)
            slug = re.sub(r'\s+', '-', q.strip()).lower()
            if slug not in seen:
                seen.add(slug)
                slugs.append(slug)
    return slugs


def normalize_phone(raw):
    if not raw:
        return ""
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 10:
        digits = "91" + digits
    if len(digits) == 12 and digits.startswith("91"):
        return f"+91-{digits[2:7]} {digits[7:]}"
    return raw


def clean_title(raw, city_display):
    if not raw:
        return "Xerox Shop"
    raw = re.sub(rf"\s*[-|]\s*({re.escape(city_display)}|Print shop|Copy shop|Stationery.*)$", "", raw, flags=re.I)
    return raw.strip()[:80] or "Xerox Shop"


def _norm_locality(s):
    """Collapse Indian place-name spelling variants to a comparable form."""
    s = (s or "").lower()
    s = re.sub(r"[.\-_/,]", " ", s)
    s = re.sub(r"\bsh\b|sh", "s", s)
    s = s.replace("th", "t")
    s = re.sub(r"[aeiou]", "", s)
    s = re.sub(r"\s+", "", s)
    return s


def get_area_slug(address, title, area_kw):
    combined = (address + " " + title).lower()
    norm_combined = _norm_locality(combined)
    for slug, (kws, _, _) in area_kw.items():
        for kw in kws:
            if kw in combined:
                return slug
    for slug, (kws, _, _) in sorted(
        area_kw.items(), key=lambda kv: -max(len(k) for k in kv[1][0])
    ):
        for kw in sorted(kws, key=len, reverse=True):
            nk = _norm_locality(kw)
            if len(nk) >= 6 and nk in norm_combined:
                return slug
    return None


def to_live_location(entry, city_display):
    lat = entry.get("latitude") or 0
    lng = entry.get("longitude") or entry.get("longtitude") or 0
    return {
        "name":     clean_title(entry.get("title", ""), city_display),
        "address":  entry.get("address", "")[:200],
        "lat":      round(float(lat), 6),
        "lng":      round(float(lng), 6),
        "phone":    normalize_phone(entry.get("phone", "")),
        "rating":   entry.get("review_rating"),
        "reviews":  entry.get("review_count") or 0,
        "placeId":  entry.get("place_id") or None,
    }


def make_intro(n, display_name, city_display, shops=(), pin_codes=()):
    if n == 0:
        return (f"Xerox and print shops in {display_name}, {city_display}. "
                f"Compare B&W and colour printing, spiral and soft binding, "
                f"lamination and scanning near you.")

    rated = [s for s in shops if s.get("rating")]
    reviewed = [s for s in shops if (s.get("reviews") or 0) >= 10]
    with_phone = [s for s in shops if s.get("phone")]
    pin_txt = f" ({', '.join(pin_codes[:2])})" if pin_codes else ""

    lead = (f"1 verified xerox and print shop in {display_name}, {city_display}{pin_txt}."
            if n == 1 else
            f"{n} verified xerox and print shops in {display_name}, {city_display}{pin_txt}.")

    if rated:
        best = max(rated, key=lambda s: (s.get("rating") or 0, s.get("reviews") or 0))
        best_name = (best.get("name") or "").strip()
        avg = sum(s["rating"] for s in rated) / len(rated)
        detail = (f" Top-rated is {best_name} at {best['rating']}★"
                  f", and the area averages {avg:.1f}★ across {len(rated)} rated shops.")
    elif reviewed:
        detail = f" {len(reviewed)} of them carry 10+ Google reviews."
    elif with_phone:
        detail = f" {len(with_phone)} list a phone number you can call ahead."
    else:
        detail = " Addresses and map links for each are listed below."

    tail = " Services include B&W and colour prints, spiral binding, lamination, and scanning."
    return lead + detail + tail


def make_keywords(display_name, city_display, n):
    base = [
        f"xerox shop in {display_name}",
        f"print shop {display_name}",
        f"photocopy near {display_name}",
        f"colour printing {display_name} {city_display}",
    ]
    if n >= 5:
        base.append(f"cheap xerox {display_name}")
    base.append(f"document binding {display_name}")
    return base[:6]


def render_city_block(cfg, city_display, lines_out):
    """Emit this city's area entries (no wrapping array/import) into lines_out."""
    area_kw = cfg.AREA_KW
    slugs = load_queries(cfg)
    print(f"[{cfg.CITY_SLUG}] Loaded {len(slugs)} area queries")

    extra = [s for s in area_kw if s not in slugs]
    if extra:
        slugs = slugs + extra
        print(f"[{cfg.CITY_SLUG}] Added {len(extra)} areas present in AREA_KW but not in the queries file")

    data = load_data(cfg)
    print(f"[{cfg.CITY_SLUG}] Loaded {len(data)} scraped entries")

    area_shops = defaultdict(list)
    for entry in data:
        slug = get_area_slug(entry.get("address", ""), entry.get("title", ""), area_kw)
        if slug:
            area_shops[slug].append(entry)

    MAX_AREA_RADIUS_KM = 6.0
    evicted = []
    for slug, entries in list(area_shops.items()):
        pts = [(e.get("latitude"), e.get("longitude")) for e in entries]
        pts = [(a, b) for a, b in pts if a and b]
        if len(pts) < 2:
            continue
        med_lat = statistics.median([a for a, _ in pts])
        med_lng = statistics.median([b for _, b in pts])
        kept = []
        for e in entries:
            lat, lng = e.get("latitude"), e.get("longitude")
            if not lat or not lng:
                continue
            dkm = math.hypot((lat - med_lat) * 111.0, (lng - med_lng) * 108.0)
            if dkm <= MAX_AREA_RADIUS_KM:
                kept.append((dkm, e))
            else:
                evicted.append(e)
        kept.sort(key=lambda pair: pair[0])
        area_shops[slug] = [e for _, e in kept]
    print(f"[{cfg.CITY_SLUG}] Geographic guard: evicted {len(evicted)} shops >{MAX_AREA_RADIUS_KM}km from their area centre")

    NEAREST_MAX_KM = 2.5
    centres = {}
    for slug, entries in area_shops.items():
        pts = [(e.get("latitude"), e.get("longitude")) for e in entries]
        pts = [(a, b) for a, b in pts if a and b]
        if len(pts) >= 2:
            centres[slug] = (
                statistics.median([a for a, _ in pts]),
                statistics.median([b for _, b in pts]),
            )

    matched_ids = {id(e) for v in area_shops.values() for e in v}
    pending = [e for e in data if id(e) not in matched_ids]
    rescued = 0
    for e in pending:
        lat, lng = e.get("latitude"), e.get("longitude")
        if not lat or not lng:
            continue
        best, best_d = None, float("inf")
        for slug, (cl, cg) in centres.items():
            d = math.hypot((lat - cl) * 111.0, (lng - cg) * 108.0)
            if d < best_d:
                best, best_d = slug, d
        if best and best_d <= NEAREST_MAX_KM:
            area_shops[best].append(e)
            rescued += 1
    print(f"[{cfg.CITY_SLUG}] Geographic fallback: matched {rescued} shops to nearest area centre (<= {NEAREST_MAX_KM}km)")

    for slug, entries in area_shops.items():
        if slug not in centres:
            continue
        cl, cg = centres[slug]
        entries.sort(key=lambda e: math.hypot(
            ((e.get("latitude") or cl) - cl) * 111.0,
            ((e.get("longitude") or cg) - cg) * 108.0,
        ))

    print(f"\n[{cfg.CITY_SLUG}] === Shops per area ===")
    for slug in sorted(area_shops.keys()):
        print(f"  {slug:<30} : {len(area_shops[slug])} shops")

    total_shops = sum(len(v) for v in area_shops.values())
    unmatched = len(data) - total_shops
    print(f"  Unmatched: {unmatched}")

    live_count = 0
    planned_count = 0
    today = __import__("datetime").date.today().isoformat()

    for slug in slugs:
        shops = area_shops.get(slug, [])
        display_name = area_kw.get(slug, (None, slug.replace("-", " ").title(), []))[1]
        pin_codes = area_kw.get(slug, (None, None, []))[2]
        presence = "live" if shops else "planned"
        emitted = [to_live_location(s, city_display) for s in shops[:20]]
        intro = make_intro(len(emitted), display_name, city_display, emitted, pin_codes)
        keywords = make_keywords(display_name, city_display, len(emitted))

        if shops:
            live_count += 1
        else:
            planned_count += 1

        lines_out.append("  {")
        lines_out.append(f'    slug: "{slug}",')
        lines_out.append(f'    name: "{display_name}",')
        lines_out.append(f'    city: "{cfg.CITY_SLUG}",')
        lines_out.append(f"    pinCodes: {json.dumps(pin_codes)},")
        lines_out.append(f'    intro: {json.dumps(intro, ensure_ascii=False)},')
        lines_out.append(f"    keywords: {json.dumps(keywords, ensure_ascii=False)},")
        lines_out.append(f'    presence: "{presence}",')

        if shops:
            lines_out.append("    liveLocations: [")
            for shop in shops[:20]:
                loc = to_live_location(shop, city_display)
                lines_out.append("      {")
                lines_out.append(f'        name: {json.dumps(loc["name"], ensure_ascii=False)},')
                lines_out.append(f'        address: {json.dumps(loc["address"], ensure_ascii=False)},')
                lines_out.append(f"        lat: {loc['lat']},")
                lines_out.append(f"        lng: {loc['lng']},")
                if loc["phone"]:
                    lines_out.append(f'        phone: {json.dumps(loc["phone"], ensure_ascii=False)},')
                if loc["rating"]:
                    lines_out.append(f"        rating: {loc['rating']},")
                if loc["reviews"]:
                    lines_out.append(f"        reviews: {loc['reviews']},")
                if loc["placeId"]:
                    lines_out.append(f'        placeId: {json.dumps(loc["placeId"], ensure_ascii=False)},')
                lines_out.append("      },")
            lines_out.append("    ],")

        lines_out.append(f'    lastReviewed: "{today}",')
        lines_out.append("  },")
        lines_out.append("")

    print(f"\n[{cfg.CITY_SLUG}] === Summary ===")
    print(f"  Areas with shops (live):   {live_count}")
    print(f"  Areas with no shops (planned): {planned_count}")
    print(f"  Total areas:               {len(slugs)}")
    print(f"  Total shops assigned:      {total_shops}")
    print(f"  Unmatched entries:         {unmatched}")

    no_shop_areas = [s for s in slugs if not area_shops.get(s)]
    if no_shop_areas:
        print(f"\n  Areas with no matches ({len(no_shop_areas)}):")
        for s in no_shop_areas:
            print(f"    - {s}")


# ---------------------------------------------------------------------------
# areas.ts merge: replace only the target city's entries, keep every other
# city's block byte-for-byte. Entries are split on the top-level `city:`
# field since that's the one property every entry is guaranteed to carry.
#
# The closing `\},\n` is followed by EITHER a blank line (another entry
# follows) OR the end of `body` itself — split_existing_entries() slices
# the `];` closer OUT before this regex ever runs, so the last entry has
# nothing after its trailing `\n` to look ahead to. Requiring `\n\n`
# unconditionally silently dropped whichever entry happened to be last
# in the file on every single run, regardless of city — caught when a
# Bengaluru area vanished after a Hyderabad merge.
# ---------------------------------------------------------------------------
ENTRY_RE = re.compile(r"  \{\n(?:.*\n)*?    city: \"(?P<city>[a-z-]+)\",\n(?:.*\n)*?  \},\n(?:\n|\Z)", re.M)


def split_existing_entries(ts_source):
    """Return (preamble_lines_before_array, list of raw entry blocks, city_of_each)."""
    start = ts_source.index("const areas: Area[] = [\n") + len("const areas: Area[] = [\n")
    end = ts_source.rindex("];\n")
    body = ts_source[start:end]
    entries = []
    for m in ENTRY_RE.finditer(body):
        entries.append((m.group("city"), m.group(0)))
    return entries


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("city", help="City slug, matching scripts/scraper/cities/<slug>.py")
    args = ap.parse_args()

    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    cfg = load_city_config(args.city)
    city_display = CITY_DISPLAY_NAMES.get(args.city, args.city.title())

    new_lines = []
    render_city_block(cfg, city_display, new_lines)
    new_block = "\n".join(new_lines) + "\n"

    if OUTPUT_FILE.exists():
        existing = OUTPUT_FILE.read_text()
        # Normalize every block to end with a blank-line separator before
        # rejoining — a block that used to be last in the file (matched
        # via the no-trailing-blank-line branch above) won't necessarily
        # still be last after filtering out the target city's entries.
        other_entries = [
            block if block.endswith("\n\n") else block.rstrip("\n") + "\n\n"
            for city, block in split_existing_entries(existing) if city != args.city
        ]
    else:
        other_entries = []

    all_blocks = "".join(other_entries) + new_block

    out = [
        'import type { Area } from "./types";',
        "",
        "/**",
        " * Auto-generated from Google Maps scrapes (scripts/scraper/process_areas.py).",
        " * Only `presence: \"live\"` entries generate static pages.",
        " * Regenerate one city at a time: python scripts/scraper/process_areas.py <city>",
        " */",
        "const areas: Area[] = [",
        all_blocks.rstrip("\n"),
        "];",
        "",
        "export default areas;",
        "",
    ]
    OUTPUT_FILE.write_text("\n".join(out))
    print(f"\nWritten to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
