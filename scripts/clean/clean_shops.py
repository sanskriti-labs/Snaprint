#!/usr/bin/env python3
"""
Clean the raw Google Maps scrape into a deduplicated, xerox-only shop
dataset. Output: data/shops-clean.jsonl — one normalized record per
real xerox shop, used by both the area pipelines and the college
geo-radius selector.

Pipeline:
  1. Drop records with missing or zero lat/lng.
  2. Drop records whose category is a hard-negative (Shopping mall,
     Hotel, Bank, Bus stop, etc.) — these are never xerox shops.
  3. Keep records whose title contains any xerox/print/copy/lamination
     keyword, regardless of category (real xerox shops are often
     mis-categorised as Pen store, Internet cafe, Computer store).
  4. Keep records whose category is xerox-related even if the title
     doesn't have a keyword (e.g. "Lamination service" or "Offset
     Printer" may not say "xerox").
  5. Drop records whose title matches a negative pattern (bakery,
     salon, vehicle, etc.) AND lacks a xerox keyword.
  6. Dedup by `cid` (canonical place id); keep the record with the most
     populated fields.
  7. Dedup by ~111m coord grid (latitude/longitude rounded to 3 dp),
     again keeping the most-populated record.

Usage:
  python scripts/clean/clean_shops.py                # default in/out
  python scripts/clean/clean_shops.py --in <path>    # custom input
  python scripts/clean/clean_shops.py --out <path>   # custom output
  python scripts/clean/clean_shops.py --report       # print summary

The output is JSONL, one record per line. Each record mirrors the
to_live_location() shape used by process_77areas.py so it can be
consumed by the same downstream code (areas.ts and content/pseo/shops.ts).
"""
import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
DEFAULT_IN = REPO_ROOT / "scripts/scraper/data/results-77areas.json"
DEFAULT_OUT = REPO_ROOT / "scripts/scraper/data/shops-clean.jsonl"

# ---------------------------------------------------------------------------
# Filter rules
# ---------------------------------------------------------------------------

# Title keywords that mean "this is a xerox shop" — checked first (case-insensitive).
KEEP_TITLE = [
    "xerox", "print", "copy", "copier", "copiers",
    "lamination", "laminating", "laminator",
    "stationery", "stationary",
    "binding", "spiral", "comb bind", "wire bind",
    "photocopy", "photocopies", "photocopying",
    "digital print", "type print", "document print",
    "offset print", "screen print",
    "flex print", "banner", "flex",
    "visiting card", "business card", "card print",
    "flyer", "brochure", "pamphlet",
    "id card", "id lamination",
    "thesis", "project print",
    "colour print", "color print",
    "b&w", "black & white",
    "scanning", "scan",
    "photo print", "photo studio",
]

# Categories that are NEVER xerox shops, even if the title matches.
# Conservative: only places that are structurally incompatible with printing
# — a mall, hospital, or hotel building is not itself a walk-in print
# counter, no matter what else Google also tagged it as.
HARD_NEG_CATS = {
    "Shopping mall", "Building", "Movie theater",
    "Hotel", "Lodging", "Hostel", "Backpacker hostel",
    "Hospital", "Pharmacy", "Medical clinic", "Doctor",
    "Government office", "Municipal administration office",
    "Bank", "ATM",
    "Salon", "Hair salon", "Beauty salon", "Spa", "Barber",
    "Restaurant", "Cafe", "Bar & grill", "Bakery", "Sweet shop",
    "Gym", "Fitness center",
    "Shoe store", "Jewelry store",
    "Supermarket", "Department store",
    "Tourist attraction",
    "Auto repair", "Car repair", "Car dealer",
    "Pet store", "Veterinary",
    "Preschool", "Park", "Museum",
    "Bus stop", "Bus depot", "Train station", "Subway station",
    "Water utility company", "Library", "Apartment",
    "Volkswagen dealer", "Motorcycle dealer",
    "Indoor cycling", "Convention center",
    "Coworking space",
}

# Categories that describe a SERVICE a shop can also offer alongside
# xerox/printing at the same small storefront — extremely common for
# Indian neighborhood shops (a xerox counter that also does travel
# bookings, insurance, or money transfer as a side business). Unlike
# HARD_NEG_CATS, these only reject a record when nothing else — no
# print keyword in the title, no print-related category alongside them
# — corroborates that it's ALSO a print shop. Real examples this fixes:
# "MAHABOOB ENTERPRISES XEROX AND PRINTOUTS" (also tagged Insurance
# agency), "RS Xerox" (also tagged Travel agency) — both explicitly
# name xerox/print in the title and carry a real print category, but
# were being killed outright because HARD_NEG_CATS used to fire on ANY
# assigned category regardless of corroborating evidence.
SOFT_NEG_CATS = {
    "Travel agency", "Insurance agency", "Real estate agency",
    "Corporate office",
}

# Xerox-related categories — keep when the title doesn't have a keyword
# but the category is aligned with what the shop does.
#
# Deliberately excludes adjacent-but-not-print categories that used to
# live here and leaked non-print shops into production: "Internet shop"
# (net cafes), "Stamp shop" / "Rubber stamp store" (stamp makers),
# "Smart shop". Those are kept ONLY when the title itself carries a
# print keyword, which the has_keep_kw branch already handles.
XEROX_CATS = {
    "Copy shop", "Print shop", "Copying supply store", "Stationery store",
    "Digital printing service", "Digital printer", "Lamination service",
    "Commercial printer", "Offset Printer", "Office supply store",
    "Office services",
    "Printing equipment supplier", "Stationery wholesaler",
    "Paper store", "Photo shop", "Photography studio",
}

# Title patterns that mark a non-xerox shop. Only drop if no KEEP_TITLE
# keyword matches (e.g. "salon" prefix doesn't kill a "Salon Xerox").
NEG_TITLE = [
    "tea stall", "chai",
    "bakery", "confection", "sweet", "cake",
    "restaurant", "dhaba", "biryani", "dosa", "hotel food",
    "salon", "parlour", "parlor", "beauty", "spa",
    "kirana", "general store", "provisions",
    "boutique", "tailor", "clothing", "garments",
    "jeweller", "jewelry", "optical", "watch",
    "furniture", "sofa", "mattress",
    "mobile phone", "mobile repair", "phone repair",
    "tuition", "coaching", "academy", "training institute",
    "insurance", "loan", "finance", "chit fund",
    "real estate", "property dealer", "broker",
    "pet ", "aquarium", "fish",
    "tent house", "mandap", "wedding", "event management",
    "car ", "bike ", "auto ", "vehicle ",
    "driving school",
    "water purifier", "ro water",
    "gas agency", "lpg",
    "milk booth", "dairy",
    "ayurvedic", "homeopathy",
    "pizza", "burger", "food court",
    "cyber cafe", "cyber joint",  # pure net cafes named "Cyber Cafe" / "Cyber Joint"
]

# Supply-side terms: the business SELLS printers/cartridges rather than
# offering printing as a service. These contain "print", so they are
# checked before the keep-keyword or they would match as xerox shops.
SUPPLY_SIDE = [
    "printer dealer", "printer repair", "peripherals dealer",
    "it peripherals", "cartridge", "toner refill", "printer service",
    "photocopier dealer", "printer sales", "printer & it",
    "machine for rent", "machine on rent", "machine rental",
]


def _normalize(raw: str) -> str:
    """Trim and cap at 80 chars the same way process_77areas.clean_title does."""
    import re
    if not raw:
        return "Xerox Shop"
    # City names stripped from shop titles across all scraped cities, not
    # just the one currently live — this list grows as new cities are added.
    cleaned = re.sub(
        r"\s*[-|]\s*(Bengaluru|Bangalore|Hyderabad|Pune|Chennai|Mumbai|Delhi|"
        r"Print shop|Copy shop|Stationery.*)$",
        "", raw, flags=re.I,
    )
    return cleaned.strip()[:80] or "Xerox Shop"


def _normalize_phone(raw: str) -> str:
    import re
    if not raw:
        return ""
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 10:
        digits = "91" + digits
    if len(digits) == 12 and digits.startswith("91"):
        return f"+91-{digits[2:7]} {digits[7:]}"
    return raw


def all_categories(d: dict) -> list[str]:
    """Every category Google assigned, primary first.

    The scrape carries BOTH a singular `category` and a `categories`
    array. Filtering on `category` alone was mis-classifying shops whose
    primary label is generic ("Store") but which Google also tags as
    "Print shop". Always consider the union.
    """
    cats: list[str] = []
    primary = d.get("category")
    if isinstance(primary, str) and primary.strip():
        cats.append(primary.strip())
    extra = d.get("categories")
    if isinstance(extra, list):
        cats.extend(c.strip() for c in extra if isinstance(c, str) and c.strip())
    elif isinstance(extra, str) and extra.strip():
        cats.append(extra.strip())
    seen: set[str] = set()
    return [c for c in cats if not (c in seen or seen.add(c))]


# Categories that do NOT by themselves imply a xerox machine on site.
# A stationery/pen/book shop sells paper; it may or may not print. These
# are kept only when independent evidence says printing happens there —
# a print keyword in the title, a print-related sibling category, or
# customers mentioning it in reviews.
AMBIGUOUS_CATS = {
    "Stationery store", "Stationery wholesaler", "Pen store",
    "Book store", "Office supply store", "Paper store",
    "Photography studio", "Photo shop", "Store",
}

# Evidence of actual printing, searched in review text / about / description.
PRINT_EVIDENCE = re.compile(
    r"xerox|photocopy|photo copy|print|printout|print out|copies|"
    r"lamination|laminate|binding|spiral|scan",
    re.I,
)

# Category strings that positively indicate printing happens on site.
PRINT_CAT_RE = re.compile(r"print|copy|xerox|lamination|bind|graphic|dtp|offset", re.I)


def has_print_evidence(d: dict) -> bool:
    """True when Google's own content shows this place actually prints.

    Looks at user reviews, the `about` block, and the description —
    written by customers and the owner, not inferred from a shop name.
    """
    blob = " ".join(
        json.dumps(d.get(k), ensure_ascii=False) if isinstance(d.get(k), (list, dict))
        else str(d.get(k) or "")
        for k in ("user_reviews", "user_reviews_extended", "about", "description")
    )
    return bool(PRINT_EVIDENCE.search(blob))


def keep_record(d: dict) -> tuple[bool, str]:
    """Return (keep, reason). Reason is a short tag for reporting."""
    lat = d.get("latitude") or 0
    lng = d.get("longitude") or 0
    if not lat or not lng:
        return False, "no coords"
    title = (d.get("title") or "").strip()
    title_lower = title.lower()
    cats = all_categories(d)
    has_keep_kw = any(kw in title_lower for kw in KEEP_TITLE)
    has_neg_kw = any(kw in title_lower for kw in NEG_TITLE)

    # A hard-negative on ANY assigned category kills the record — UNLESS
    # the title says "xerox" outright. "Xerox" in India is a brand name
    # used almost exclusively for photocopy shops (never genuinely
    # ambiguous the way "print" or "copy" can be), and HARD_NEG_CATS is
    # frequently a Google mis-tag on a small combo shop, not a second
    # real business — e.g. "Xerox and fancy store" tagged Shoe store,
    # "Nirmal Xerox, Photography..." tagged Shopping mall. A mall that
    # ALSO carries "Print shop" with no "xerox" in the title is still a
    # mall; a shop literally named "... Xerox ..." is not.
    hard_neg = next((c for c in cats if c in HARD_NEG_CATS), None)
    if hard_neg and "xerox" not in title_lower:
        return False, f"hard-neg cat={hard_neg}"

    # A soft-negative (travel/insurance/real-estate agency, corporate
    # office) only kills the record when NOTHING corroborates a print
    # service alongside it — a strong title keyword or a print-related
    # sibling category. Small Indian shops routinely combine xerox with
    # a side business like travel booking or insurance; killing on the
    # side-business tag alone was dropping real, self-declared xerox
    # shops (e.g. a listing titled "... XEROX AND PRINTOUTS" that also
    # carries "Insurance agency").
    soft_neg = next((c for c in cats if c in SOFT_NEG_CATS), None)
    if soft_neg:
        has_keep_kw_early = any(kw in title_lower for kw in KEEP_TITLE)
        has_print_cat = any(PRINT_CAT_RE.search(c) for c in cats)
        if not has_keep_kw_early and not has_print_cat:
            return False, f"soft-neg cat={soft_neg}, no print corroboration"

    # Permanently closed per Google — never publish.
    if str(d.get("status") or "").strip().upper() in {"CLOSED", "PERMANENTLY_CLOSED", "CLOSED_PERMANENTLY"}:
        return False, "closed"

    # "Stationery"/"stationary" in a title proves the shop sells paper, not
    # that it has a xerox machine. Treat it as a keep-keyword only when
    # something else corroborates printing.
    # "photo studio" is a portrait studio, not a document printer, and
    # bare "scan"/"banner"/"flex" appear in unrelated shop names. These
    # need corroboration like the stationery keywords do.
    # "Stationery"/"stationary" in a title proves the shop sells paper, not
    # that it has a xerox machine. Bare "scan"/"banner"/"flex" appear in
    # unrelated shop names. We still acknowledge these as keep-keywords
    # (they pass the `has_keep_kw` check below) so that a shop named
    # "Auto Stationery" or "Cars Banner Print" is kept — the downstream
    # XEROX_CATS / PRINT_CAT_RE check then decides whether the record has
    # enough corroboration to publish.
    # WEAK_KW = {"stationery", "stationary", "photo studio", "scan", "scanning",
    #            "banner", "flex", "thesis"}  # no longer gates the early exit
    # Supply-side terms ("Printer & IT Peripherals Dealers", "toner
    # refilling") describe selling hardware, not offering printing, and
    # they contain "print" — so they must be checked BEFORE the keep
    # keyword. Only these override; the general NEG_TITLE list still runs
    # after, so "PRINT OUT AND XEROX SPACE" is not killed by "space".
    if any(kw in title_lower for kw in SUPPLY_SIDE):
        return False, "sells printers, not printing"
    if has_keep_kw:
        # A xerox-related keyword anywhere in the title wins over NEG_TITLE
        # patterns like "car ", "auto ", "vehicle ". Real xerox shops
        # routinely have an "Auto" or "Bike" prefix in the brand name
        # ("Sriya Auto Xerox", "Cars Photocopy Centre") — keep these.
        # Previously the WEAK_KW branch (stationery / banner / flex etc.)
        # excluded them from a "strong" keep and let the neg-title reject
        # fire, silently dropping shops whose name was "Auto Stationery"
        # or "Cars Banner Print". SUPPLY_SIDE above still catches the
        # genuine printer-dealer case.
        return True, "xerox kw"
    if has_neg_kw:
        return False, "neg title"

    # No positively print-related category anywhere? Then "stationery" in
    # the title or an ambiguous category label is the only thing arguing
    # for this record — require independent proof that printing happens.
    # A stationery/pen/book/gift shop sells paper; that is not a xerox
    # machine. Sibling categories like "Gift shop" or "Art supply store"
    # do not count as print evidence.
    has_print_cat = any(PRINT_CAT_RE.search(c) for c in cats)
    if not has_print_cat:
        if has_print_evidence(d):
            return True, "ambiguous cat + review evidence"
        label = cats[0] if cats else "no category"
        return False, f"ambiguous cat, no print evidence ({label})"

    if has_keep_kw:
        return True, "stationery kw + print cat"
    xerox_cat = next((c for c in cats if c in XEROX_CATS), None)
    if xerox_cat:
        return True, f"xerox cat={xerox_cat}"
    return False, "no signal"


def to_clean_record(d: dict) -> dict:
    """Mirror to_live_location()'s output but with a fixed-up title."""
    lat = d.get("latitude") or 0
    lng = d.get("longitude") or 0
    return {
        "name":     _normalize(d.get("title", "")),
        "address":  (d.get("address", "") or "")[:200],
        "lat":      round(float(lat), 6),
        "lng":      round(float(lng), 6),
        "phone":    _normalize_phone(d.get("phone", "")),
        "rating":   d.get("review_rating"),
        "reviews":  d.get("review_count") or 0,
        "placeId":  d.get("place_id") or None,
        "cid":      d.get("cid"),
        "category": d.get("category"),
        "categories": all_categories(d),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--in", dest="inp", default=str(DEFAULT_IN),
                    help="Path to raw JSONL")
    ap.add_argument("--out", dest="out", default=str(DEFAULT_OUT),
                    help="Path to cleaned JSONL output")
    ap.add_argument("--report", action="store_true",
                    help="Print before/after counts and drop reasons")
    args = ap.parse_args()

    inp = Path(args.inp)
    out = Path(args.out)
    if not inp.exists():
        print(f"clean_shops: input not found: {inp}", file=sys.stderr)
        return 1

    raw = []
    with inp.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            raw.append(json.loads(line))

    # Stage 1: filter
    reasons = Counter()
    kept = []
    for r in raw:
        keep, reason = keep_record(r)
        reasons[reason] += 1
        if keep:
            kept.append(r)

    # Stage 2: dedup by cid — keep the most-populated record
    by_cid: dict = {}
    for r in kept:
        cid = r.get("cid")
        if not cid:
            continue
        if cid not in by_cid or sum(1 for v in r.values() if v) > sum(1 for v in by_cid[cid].values() if v):
            by_cid[cid] = r

    # Stage 3: dedup by ~111m coord grid — handle cases where the same
    # physical shop got a different cid across multiple area queries.
    by_grid: dict = {}
    for cid, r in by_cid.items():
        lat = round(r.get("latitude", 0) * 1000) / 1000
        lng = round(r.get("longitude", 0) * 1000) / 1000
        key = (lat, lng)
        if key not in by_grid or sum(1 for v in r.values() if v) > sum(1 for v in by_grid[key].values() if v):
            by_grid[key] = r

    final = sorted(by_grid.values(), key=lambda r: r.get("title", "").lower())

    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w") as f:
        for r in final:
            f.write(json.dumps(to_clean_record(r), ensure_ascii=False) + "\n")

    if args.report:
        print(f"raw records:        {len(raw)}")
        print(f"after filter:       {len(kept)}")
        print(f"after cid dedup:    {len(by_cid)}")
        print(f"after coord dedup:  {len(final)}")
        print(f"written to:         {out}")
        print()
        print("filter reasons:")
        for reason, count in reasons.most_common():
            print(f"  {count:>4} {reason}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
