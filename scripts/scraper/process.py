#!/usr/bin/env python3
"""
Transform Google Maps scraped xerox shop data into LiveLocation entries
and generate TypeScript data for content/pseo/areas.ts

Usage: python scripts/scraper/process.py
"""
import json
import re
from collections import defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
DATA_FILE = SCRIPT_DIR / "data" / "results.json"
OUTPUT_FILE = Path("/Users/abhishekrajpurohit/projects/snaprint/content/pseo/areas.ts")

# Area slug (must match content/pseo/areas.ts slugs) → (search keywords, display name, pin codes)
AREA_KW = {
    "koramangala":     (["koramangala"],                                     "Koramangala",     ["560034", "560095"]),
    "indiranagar":     (["indiranagar"],                                     "Indiranagar",     ["560038", "560008"]),
    "whitefield":      (["whitefield"],                                      "Whitefield",      ["560066", "560048"]),
    "hsr-layout":      (["hsr layout", "haralur"],                          "HSR Layout",      ["560102", "560107"]),
    "electronic-city":  (["electronic city"],                                  "Electronic City",  ["560100", "560101"]),
    "mg-road":         (["mg road", "m.g.road", "sivanchetti", "yellappa garden", "dickenson rd"], "MG Road", ["560042", "560001"]),
    "jayanagar":       (["jayanagar", "jp nagar", "j p nagar"],            "Jayanagar",       ["560041", "560011", "560078"]),
    "btm-layout":      (["btm layout", "btm", "bannerghatta road"],         "BTM Layout",      ["560029", "560076"]),
    "marathahalli":    (["marathahalli", "maruthi nagar"],                  "Marathahalli",    ["560037", "560008"]),
    "frazer-town":     (["frazer town", "fraser town", "coxs town", "cox town"], "Frazer Town", ["560005"]),
    "shivajinagar":    (["shivajinagar", "shivaji nagar", "sulthangunta"], "Shivajinagar",   ["560051", "560001"]),
}

INTROS = {
    "koramangala":    "Koramangala residents and office workers can print documents at local xerox shops — many open until late with B&W, colour, and binding services.",
    "indiranagar":    "Indiranagar's cafe culture and co-working spaces draw a crowd that prints constantly — local shops offer quick turnaround on documents and presentations.",
    "whitefield":     "Whitefield's tech park workforce and residential community generate constant demand for print — local xerox shops handle it on-demand.",
    "hsr-layout":     "HSR Layout's mix of students, freelancers, and startups creates a high-need print corridor with several well-reviewed xerox shops.",
    "electronic-city":"Electronic City employees printing presentations and reports can rely on area xerox shops — many open early and close late.",
    "mg-road":        "MG Road and Sivanchetti Gardens have several established xerox and stationery shops serving the CBD crowd.",
    "jayanagar":      "Jayanagar is home to numerous copy shops and stationers serving everyone from students to businesses.",
    "btm-layout":     "BTM Layout's student population keeps area xerox shops busy — reliable options for assignments, reports, and thesis printing.",
    "marathahalli":   "Marathahalli and the surrounding residential areas have multiple xerox shops serving the local community.",
    "frazer-town":    "Frazer Town and Cox Town have several established stationery and copy shops serving the neighbourhood.",
    "shivajinagar":   "Shivajinagar and the Civil Station area have multiple xerox shops serving government offices and the public.",
}

KEYWORDS = {
    "koramangala":    ["print near koramangala", "xerox shop koramangala", "document printing koramangala 6th block", "instant print koramangala"],
    "indiranagar":    ["print near indiranagar", "xerox shop indiranagar", "cv printing 100 feet road", "document print indiranagar 2nd stage"],
    "whitefield":     ["print near whitefield", "xerox shop whitefield", "document printing itpl", "resume print outer ring road whitefield"],
    "hsr-layout":    ["print near hsr layout", "xerox shop hsr", "assignment printing sector 2 hsr", "document print hsr 17th cross"],
    "electronic-city":["print near electronic city", "xerox shop electronic city", "presentation printing ec phase 1", "document print electronic city phase 2"],
    "mg-road":       ["print near mg road bangalore", "xerox shop mg road", "document print sivanchetti gardens", "copy shop dickenson road"],
    "jayanagar":     ["print near jayanagar", "xerox shop jayanagar", "document printing jayanagar 4th t block", "cv print jayanagar"],
    "btm-layout":    ["print near btm layout", "xerox shop btm", "assignment printing btm", "document print bannerghatta road"],
    "marathahalli":  ["print near marathahalli", "xerox shop marathahalli", "document print marathahalli", "colour print marathahalli"],
    "frazer-town":   ["print near frazer town", "xerox shop frazer town", "document print coxs town", "copy shop frazer town"],
    "shivajinagar":  ["print near shivajinagar", "xerox shop shivajinagar", "document print civil station bangalore"],
}


def load_data():
    with open(DATA_FILE) as f:
        return [json.loads(l) for l in f if l.strip()]


def normalize_phone(raw):
    if not raw:
        return ""
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 10:
        digits = "91" + digits
    if len(digits) == 12 and digits.startswith("91"):
        return f"+91-{digits[2:7]} {digits[7:]}"
    return raw


def clean_title(raw):
    if not raw:
        return "Xerox Shop"
    raw = re.sub(r"\s*[-|]\s*(Bengaluru|Bangalore|Print shop|Copy shop|Stationery.*)$", "", raw, flags=re.I)
    return raw.strip()[:80] or "Xerox Shop"


def get_area_slug(address, title):
    combined = (address + " " + title).lower()
    for slug, (kws, _, _) in AREA_KW.items():
        for kw in kws:
            if kw in combined:
                return slug
    return None


def to_live_location(entry):
    lat = entry.get("latitude") or entry.get("longtitude") or 0
    lng = entry.get("longitude") or entry.get("longtitude") or 0
    return {
        "name":     clean_title(entry.get("title", "")),
        "address":  entry.get("address", "")[:200],
        "lat":      round(float(lat), 6),
        "lng":      round(float(lng), 6),
        "phone":    normalize_phone(entry.get("phone", "")),
        "rating":   entry.get("review_rating"),
        "reviews":  entry.get("review_count") or 0,
        "placeId":  entry.get("place_id") or None,
    }


def main():
    data = load_data()
    print(f"Loaded {len(data)} scraped entries")

    area_shops = defaultdict(list)
    for entry in data:
        slug = get_area_slug(entry.get("address", ""), entry.get("title", ""))
        if slug:
            area_shops[slug].append(entry)

    print("\n=== Shops per area ===")
    for slug in sorted(area_shops.keys()):
        print(f"  {slug:<25} : {len(area_shops[slug])} shops")

    unmatched = len(data) - sum(len(v) for v in area_shops.values())
    print(f"  Unmatched: {unmatched}")

    lines = [
        'import type { Area } from "./types";',
        "",
        "/**",
        " * Auto-generated from Google Maps scrape (scripts/scraper/process.py).",
        " * Only `presence: \"live\"` entries generate static pages.",
        " */",
        "const areas: Area[] = [",
    ]

    for slug in sorted(AREA_KW.keys()):
        shops = area_shops.get(slug, [])
        display_name = AREA_KW[slug][1]
        pin_codes = AREA_KW[slug][2]
        presence = "live" if shops else "planned"
        intro = INTROS.get(slug, f"{display_name} has {len(shops)} local xerox and print shops.")
        keywords = KEYWORDS.get(slug, [])

        lines.append("  {")
        lines.append(f'    slug: "{slug}",')
        lines.append(f'    name: "{display_name}",')
        lines.append('    city: "bengaluru",')
        lines.append(f"    pinCodes: {json.dumps(pin_codes)},")
        lines.append(f'    intro: "{intro.replace(chr(34), chr(92)+chr(34))}",')
        lines.append(f"    keywords: {json.dumps(keywords)},")
        lines.append(f'    presence: "{presence}",')

        if shops:
            lines.append("    liveLocations: [")
            for shop in shops[:20]:   # cap at 20 per area
                loc = to_live_location(shop)
                lines.append("      {")
                lines.append(f'        name: "{loc["name"].replace(chr(34), chr(92)+chr(34))}",')
                lines.append(f'        address: "{loc["address"].replace(chr(34), chr(92)+chr(34))}",')
                lines.append(f"        lat: {loc['lat']},")
                lines.append(f"        lng: {loc['lng']},")
                if loc["phone"]:
                    lines.append(f'        phone: "{loc["phone"]}",')
                if loc["rating"]:
                    lines.append(f"        rating: {loc['rating']},")
                if loc["reviews"]:
                    lines.append(f"        reviews: {loc['reviews']},")
                if loc["placeId"]:
                    lines.append(f'        placeId: "{loc["placeId"]}",')
                lines.append("      },")
            lines.append("    ],")

        lines.append('    lastReviewed: "2026-08-07",')
        lines.append("  },")
        lines.append("")

    lines.append("];")
    lines.append("")
    lines.append("export default areas;")

    OUTPUT_FILE.write_text("\n".join(lines) + "\n")
    print(f"\n✅ Written to {OUTPUT_FILE}")

    total_areas_live = sum(1 for s in area_shops.values() if s)
    total_shops = sum(len(v) for v in area_shops.values())
    print(f"\n=== Summary ===")
    print(f"  Areas with shops (→ live): {total_areas_live}")
    print(f"  Total shops assigned:       {total_shops}")
    print(f"  Unmatched entries:         {unmatched}")


if __name__ == "__main__":
    main()
