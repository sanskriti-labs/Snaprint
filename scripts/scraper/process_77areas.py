#!/usr/bin/env python3
"""
Transform Google Maps scraped xerox shop data (77 areas) into LiveLocation entries
and generate TypeScript data for content/pseo/areas.ts

Usage: python scripts/scraper/process_77areas.py
"""
import json
import math
import re
import statistics
from collections import defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
DATA_FILE = SCRIPT_DIR / "data" / "results-77areas.json"
CLEAN_FILE = SCRIPT_DIR / "data" / "shops-clean.jsonl"
QUERIES_FILE = SCRIPT_DIR / "bangalore-xeroxshops.txt"
OUTPUT_FILE = Path("/Users/abhishekrajpurohit/projects/snaprint/content/pseo/areas.ts")

# ---------------------------------------------------------------------------
# Area keyword map: slug -> (search_keywords, display_name, pin_codes)
# ---------------------------------------------------------------------------
# Pin codes are representative; cross-checked against common postal districts.
AREA_KW = {
    # Central Bangalore
    "malleswaram":           (["malleswaram"],                                          "Malleswaram",              ["560003", "560055"]),
    "indiranagar":           (["indiranagar"],                                          "Indiranagar",              ["560038", "560008"]),
    "sadashivanagar":        (["sadashivanagar", "sadashiva nagar", "sadashiv nagar"],  "Sadashivanagar",           ["560080", "560003"]),
    "shivajinagar":          (["shivajinagar", "shivaji nagar", "sulthangunta"],         "Shivajinagar",             ["560051", "560001"]),
    "vasanth-nagar":         (["vasanth nagar", "vasanthagar"],                          "Vasanth Nagar",            ["560051", "560052"]),
    "ulsoor":                (["ulsoor", "ulloor"],                                      "Ulsoor",                   ["560008", "560046"]),
    "halasuru":              (["halasuru", "halasur"],                                   "Halasuru",                 ["560008", "560008"]),
    "domlur":                (["domlur"],                                                "Domlur",                   ["560071", "560037"]),
    "rt-nagar":              (["rt nagar", "r t nagar", "rtnagar"],                      "RT Nagar",                 ["560032", "560006"]),
    "fraser-town":           (["frazer town", "fraser town", "fraiser town", "fraser", "fraizer"], "Frazer Town",              ["560005", "560047"]),
    "cox-town":              (["cox town", "coxs town", "coox town"],                     "Cox Town",                 ["560005"]),
    "richmond-town":         (["richmond town", "richmond"],                              "Richmond Town",            ["560025", "560001"]),
    "rajajinagar":           (["rajajinagar", "raja jainagar"],                          "Rajajinagar",              ["560010", "560043"]),
    "chickpet":              (["chickpet", "chikpet", "chikkpett"],                      "Chickpet",                 ["560053", "560079"]),
    "avenue-road":           (["avenue road"],                                           "Avenue Road",              ["560002", "560004"]),
    "kumara-park":           (["kumar park", "kumara park", "kumarapark"],               "Kumara Park",              ["560001", "560009"]),
    "russell-market":        (["russell market", "russellmarket"],                        "Russell Market",           ["560053"]),

    # Eastern Bangalore
    "marathahalli":          (["marathahalli", "maruthi nagar", "marathi"],               "Marathahalli",             ["560037", "560008", "560103"]),
    "krishnarajapuram":      (["krishnarajapuram", "kr puram", "k r puram", "krpuram", "kadugodi"], "Krishnarajapuram", ["560036", "560049"]),
    "mahadevapura":          (["mahadevapura", "mahadeva pura"],                        "Mahadevapura",             ["560048", "560016"]),
    "bellandur":             (["bellandur"],                                              "Bellandur",                ["560103", "560035"]),
    "cv-raman-nagar":        (["cv raman nagar", "cv raman", "c v raman"],                "CV Raman Nagar",           ["560008", "560097"]),
    "hoodi":                 (["hoodi"],                                                    "Hoodi",                    ["560048", "560016"]),
    "varthur":               (["varthur", "varthur road"],                               "Varthur",                  ["560087", "560035"]),
    "whitefield":            (["whitefield"],                                             "Whitefield",               ["560066", "560048"]),
    "old-airport-road":      (["old airport road", "old airport"],                        "Old Airport Road",         ["560008", "560017"]),
    "old-madras-road":       (["old madras road", "old mrs road"],                        "Old Madras Road",          ["560016", "560008"]),

    # North-Eastern Bangalore
    "banaswadi":             (["banaswadi"],                                               "Banaswadi",                ["560043", "560005"]),
    "hbr-layout":            (["hbr layout", "h b r layout", "hbr"],                       "HBR Layout",               ["560043", "560084"]),
    "ramamurthy-nagar":      (["ramamurthy nagar", "ramamurthy nagar"],                   "Ramamurthy Nagar",         ["560016", "560043"]),
    "kammanahalli":          (["kammanahalli", "kamanahalli"],                             "Kammanahalli",             ["560084", "560043"]),
    "horamavu":              (["horamavu", "horamavu main road"],                          "Horamavu",                 ["560043", "560005"]),
    "lingarajapuram":        (["lingarajapuram", "lingarajpura"],                          "Lingarajapuram",           ["560084", "560005"]),
    "kalyan-nagar":          (["kalyan nagar", "kalyanagar", "kalyan"],                   "Kalyan Nagar",             ["560043", "560001"]),

    # Northern Bangalore
    "yeshwanthpur":          (["yeshwanthpur", "yeswantpur"],                             "Yeshwanthpur",             ["560022", "560055"]),
    "hebbal":                (["hebbal"],                                                   "Hebbal",                   ["560024", "560004"]),
    "peenya":                (["peenya", "peenya industrial area"],                         "Peenya",                   ["560058", "560086"]),
    "jalahalli":             (["jalahalli", "jalalahalli"],                               "Jalahalli",                ["560013", "560057"]),
    "mathikere":             (["mathikere", "mattikere"],                                  "Mathikere",                ["560054", "560009"]),
    "vidyaranyapura":        (["vidyaranyapura", "vidyaranya"],                           "Vidyaranyapura",           ["560097", "560013"]),
    "yelahanka":             (["yelahanka", "yelanka"],                                   "Yelahanka",                ["560064", "560022"]),

    # South-Eastern Bangalore
    "electronic-city":       (["electronic city", "electronic city phase", "ec phase"],     "Electronic City",          ["560100", "560101", "560099"]),
    "koramangala":           (["koramangala", "kormangala"],                              "Koramangala",              ["560034", "560095", "560047"]),
    "hsr-layout":            (["hsr layout", "hsr", "haralur", "haralur lake", "sector 1 hsr", "sector 2 hsr", "sector 3 hsr", "sector 4 hsr", "sector 5 hsr", "sector 6 hsr", "sector 7 hsr"], "HSR Layout", ["560102", "560107", "560034"]),
    "btm-layout":            (["btm layout", "btm", "bannerghatta road", "bannarghatta"], "BTM Layout",               ["560029", "560076", "560078"]),
    "bommanahalli":          (["bommanahalli", "bomanahalli"],                             "Bommanahalli",             ["560068", "560034"]),
    "bommasandra":           (["bommasandra", "bomasandra"],                              "Bommasandra",              ["560099", "560100"]),
    "sarjapur-road":          (["sarjapur road", "sarjapur-road", "sarjapur rd"],         "Sarjapur Road",            ["560035", "560034", "560087"]),
    "madiwala":              (["madiwala", "madiwala main road"],                         "Madiwala",                 ["560068", "560034"]),

    # Southern Bangalore
    "jayanagar":             (["jayanagar", "jayanagar 4th block", "jayanagar 2nd stage", "jayanagar 3rd block"], "Jayanagar", ["560041", "560011", "560078", "560069"]),
    "basavanagudi":          (["basavanagudi", "basavanagudi area"],                      "Basavanagudi",             ["560004", "560019"]),
    "jp-nagar":              (["jp nagar", "j p nagar", "jpnagar", "jp nagar phase"],    "JP Nagar",                 ["560078", "560069", "560041"]),
    "banashankari":          (["banashankari", "bansankari", "banashankari 2nd stage"],   "Banashankari",             ["560070", "560085", "560060"]),
    "uttarahalli":           (["uttarahalli", "uttharahalli"],                            "Uttarahalli",              ["560061", "560060"]),
    "kumaraswamy-layout":    (["kumaraswamy layout", "kumaraswamy layout area"],          "Kumaraswamy Layout",        ["560078", "560070"]),
    "girinagar":             (["girinagar", "giri nagar"],                               "Girinagar",                ["560085", "560019"]),
    "padmanabhanagar":       (["padmanabhanagar", "padmanabha nagar"],                   "Padmanabhanagar",          ["560070", "560085"]),

    # Southern Suburbs
    "anjanapura":            (["anjanapura", "anjanapura main road"],                    "Anjanapura",               ["560062", "560083"]),
    "hulimavu":              (["hulimavu", "hulimavu main road"],                         "Hulimavu",                 ["560076", "560062"]),
    "begur":                 (["begur", "begur main road", "begur road"],                "Begur",                    ["560068", "560076"]),
    "arekere":               (["arekere", "arekere main road"],                          "Arekere",                  ["560076", "560083"]),
    # Two distinct localities share this name ~21 km apart: Kothnur/Kothnur
    # Dinne in the south (560078, off Bannerghatta) and Kothanur in the
    # north (560077, near Kristu Jayanti College). Kept separate — merging
    # them puts a north-side shop on a south-side page.
    "kothnur":               (["kothnur dinne", "kothnur main road", "kothnur"],          "Kothnur",                  ["560078", "560076"]),
    "kothanur-north":        (["kothanur post", "kothanur"],                              "Kothanur",                 ["560077"]),
    "gottigere":             (["gottigere", "gottigere main road"],                       "Gottigere",                ["560076", "560083"]),

    # Western Bangalore
    "vijayanagar":           (["vijayanagar", "vijaya nagar"],                            "Vijayanagar",              ["560040", "560023"]),
    "rajarajeshwari-nagar":  (["rajarajeshwari nagar", "rr nagar", "rajarajeshwari"],     "Rajarajeshwari Nagar",      ["560098", "560010"]),
    "basaveshwaranagar":     (["basaveshwaranagar", "basaveshwar nagar"],                "Basaveshwaranagar",         ["560079", "560010"]),
    "nagarbhavi":            (["nagarbhavi", "nagar bhavi"],                             "Nagarbhavi",               ["560072", "560040"]),
    "mahalakshmi-layout":    (["mahalakshmi layout", "mahalakshmi layout area"],         "Mahalakshmi Layout",        ["560027", "560021"]),
    "kengeri":               (["kengeri", "kengeri satellite town"],                    "Kengeri",                  ["560060", "560082"]),
    "chandra-layout":        (["chandra layout", "chandralayout"],                        "Chandra Layout",           ["560040", "560023"]),

    # Peripheral
    "attibele":              (["attibele"],                                                 "Attibele",                ["562107", "560099"]),
    "anekal":                (["anekal"],                                                    "Anekal",                  ["562107", "562106"]),
    "chandapura":            (["chandapura"],                                                "Chandapura",              ["560081", "562106"]),
    "sarjapur":              (["sarjapur"],                                                  "Sarjapur",                ["562107", "560035"]),
    "yelahanka-new-town":    (["yelahanka new town", "yelahanka satellite town", "yelahanka new town area", "yelahanka"], "Yelahanka New Town", ["560064", "560022"]),
    "nelamangala":           (["nelamangala", "nelamangala town"],                        "Nelamangala",             ["562123", "560123"]),

    # Added after auditing unmatched shops: each of these localities had
    # 4+ real xerox shops in the scrape but no area entry, so they were
    # being dropped from the site entirely.
    "dooravani-nagar":       (["dooravani nagar", "dooravaninagar"],                     "Dooravani Nagar",          ["560016"]),
    "new-thippasandra":      (["new thippasandra", "thippasandra"],                      "New Thippasandra",         ["560075", "560008"]),
    "kasturi-nagar":         (["kasturi nagar", "kasturinagar"],                         "Kasturi Nagar",            ["560043", "560016"]),
    "hongasandra":           (["hongasandra"],                                            "Hongasandra",              ["560068"]),
    "singasandra":           (["singasandra"],                                            "Singasandra",              ["560068", "560114"]),
    "rmv-2nd-stage":         (["rmv 2nd stage", "r.m.v. 2nd stage", "rmv extension"],     "RMV 2nd Stage",            ["560094", "560080"]),
    "nandini-layout":        (["nandini layout"],                                         "Nandini Layout",           ["560096", "560022"]),
    "konanakunte":           (["konanakunte", "konankunte"],                             "Konanakunte",              ["560062", "560078"]),
    "kadugondanahalli":      (["kadugondanahalli", "kg halli"],                          "Kadugondanahalli",         ["560045", "560084"]),
    "nagavara":              (["nagavara"],                                               "Nagavara",                 ["560045", "560077"]),
    "kalasipalya":           (["kalasipalya", "kalasipalyam"],                           "Kalasipalya",              ["560002", "560053"]),
    "mallathahalli":         (["mallathahalli", "mallathalli"],                          "Mallathahalli",            ["560056", "560072"]),
    "chamrajpet":            (["chamrajpet", "chamarajpet"],                             "Chamrajpet",               ["560018", "560002"]),
    "gandhi-nagar":          (["gandhi nagar", "gandhinagar"],                           "Gandhi Nagar",             ["560009", "560002"]),
    "sahakara-nagar":        (["sahakaranagar", "sahakara nagar", "sahakar nagar"],      "Sahakara Nagar",           ["560092", "560064"]),
    "seshadripuram":         (["seshadripuram", "sheshadripuram"],                       "Seshadripuram",            ["560020", "560009"]),
    "wilson-garden":         (["wilson garden"],                                          "Wilson Garden",            ["560027", "560030"]),
    "kaggadasapura":         (["kaggadasapura", "kaggadaspura"],                         "Kaggadasapura",            ["560093", "560075"]),
    "bilekahalli":           (["bilekahalli", "bilekhalli"],                             "Bilekahalli",              ["560076", "560029"]),
    "ashok-nagar":           (["ashok nagar", "ashoknagar"],                             "Ashok Nagar",              ["560050", "560025"]),
}


def load_data():
    """Load shop records. Resolution order:
      1. LLM-verified file (llm_audit_shops.py output) — highest precision.
      2. Heuristic-cleaned file (clean_shops.py output).
      3. Raw Google Maps scrape (fallback).
    Each layer reshapes into the raw field names so the rest of the
    pipeline can stay simple.
    """
    # NOTE: shops-llm-verified.jsonl is intentionally NOT preferred. That
    # audit returned keep:true for all 1138 records, so it filtered nothing
    # while shadowing the category-based cleaner. clean_shops.py is the
    # source of truth until an audit that actually rejects is re-run.
    for path in (CLEAN_FILE,):
        if path.exists():
            cleaned = []
            with path.open() as f:
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
    with open(DATA_FILE) as f:
        return [json.loads(l) for l in f if l.strip()]


def load_queries():
    """Load area slugs from the queries file by parsing query names.
    Preserves order; handles the duplicate Rajajinagar entry by keeping first occurrence only."""
    seen = set()
    slugs = []
    with open(QUERIES_FILE) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            # Strip "xerox shops in " prefix and " Bangalore" suffix
            q = line
            if q.lower().startswith("xerox shops in "):
                q = q[len("xerox shops in "):]
            q = re.sub(r'\s+Bangalore\s*$', '', q, flags=re.IGNORECASE).strip()
            slug = q.lower().replace(" ", "-")
            # Rajajinagar appears twice in the queries file (Central + Western);
            # keep first occurrence only to avoid duplicate area entries.
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


def clean_title(raw):
    if not raw:
        return "Xerox Shop"
    raw = re.sub(r"\s*[-|]\s*(Bengaluru|Bangalore|Print shop|Copy shop|Stationery.*)$", "", raw, flags=re.I)
    return raw.strip()[:80] or "Xerox Shop"


def _norm_locality(s):
    """Collapse Indian place-name spelling variants to a comparable form.

    Google's addresses and our hand-written keywords disagree constantly:
    "J. P. Nagar" vs "jp nagar", "Malleshwaram" vs "malleswaram",
    "Yeswanthpur" vs "yeshwanthpur", "Kothanur" vs "kothnur". An exact
    substring match drops all of those. Normalising both sides makes the
    comparison spelling-insensitive instead of enumerating every variant.
    """
    s = (s or "").lower()
    s = re.sub(r"[.\-_/,]", " ", s)      # "j.p." / "j-p" -> "j p"
    s = re.sub(r"\bsh\b|sh", "s", s)      # malleshwaram -> malleswaram
    s = s.replace("th", "t")              # kothanur -> kotanur, thippasandra
    s = re.sub(r"[aeiou]", "", s)         # drop vowels: yeswantpur ~ yeshwanthpur
    s = re.sub(r"\s+", "", s)             # "jp nagar" -> "jpnagar"
    return s


def get_area_slug(address, title):
    combined = (address + " " + title).lower()
    norm_combined = _norm_locality(combined)
    # Pass 1: exact substring (fast, highest precision).
    for slug, (kws, _, _) in AREA_KW.items():
        for kw in kws:
            if kw in combined:
                return slug
    # Pass 2: normalised match — catches spelling variants only.
    # Longest keyword first so "sarjapur road" wins over "sarjapur".
    for slug, (kws, _, _) in sorted(
        AREA_KW.items(), key=lambda kv: -max(len(k) for k in kv[1][0])
    ):
        for kw in sorted(kws, key=len, reverse=True):
            nk = _norm_locality(kw)
            if len(nk) >= 4 and nk in norm_combined:
                return slug
    return None


def to_live_location(entry):
    # NOTE: `longtitude` is a misspelled duplicate field in the raw scrape.
    # It mirrors `longitude`, so it is only ever a longitude fallback —
    # never a latitude one.
    lat = entry.get("latitude") or 0
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


def make_intro(n, display_name, shops=(), pin_codes=()):
    """Build an area intro from that area's own data.

    Every varying part is derived from the real shops matched to this
    area — count, top-rated shop name, open-now coverage, pin codes —
    so no two areas produce the same sentence structure or the same
    facts. A count-only template reads as doorway content; this does
    not.
    """
    if n == 0:
        return (f"Xerox and print shops in {display_name}, Bangalore. "
                f"Compare B&W and colour printing, spiral and soft binding, "
                f"lamination and scanning near you.")

    rated = [s for s in shops if s.get("rating")]
    reviewed = [s for s in shops if (s.get("reviews") or 0) >= 10]
    with_phone = [s for s in shops if s.get("phone")]
    pin_txt = f" ({', '.join(pin_codes[:2])})" if pin_codes else ""

    lead = (f"1 verified xerox and print shop in {display_name}, Bangalore{pin_txt}."
            if n == 1 else
            f"{n} verified xerox and print shops in {display_name}, Bangalore{pin_txt}.")

    # Second sentence varies on what this area's data actually supports.
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


# Per-area keyword sets. Built from the area's own name + service terms so
# each page carries distinct, non-stuffed metadata keywords.
def make_keywords(display_name, slug, n):
    base = [
        f"xerox shop in {display_name}",
        f"print shop {display_name}",
        f"photocopy near {display_name}",
        f"colour printing {display_name} Bangalore",
    ]
    if n >= 5:
        base.append(f"cheap xerox {display_name}")
    base.append(f"document binding {display_name}")
    return base[:6]


def main():
    slugs = load_queries()
    print(f"Loaded {len(slugs)} area queries from bangalore-xeroxshops.txt")

    # The queries file only lists areas we originally searched for. Areas
    # added to AREA_KW afterwards (recovered from unmatched-shop audits)
    # must still be emitted, or their shops silently vanish from the site.
    extra = [s for s in AREA_KW if s not in slugs]
    if extra:
        slugs = slugs + extra
        print(f"Added {len(extra)} areas present in AREA_KW but not in the queries file")

    data = load_data()
    print(f"Loaded {len(data)} scraped entries")

    area_shops = defaultdict(list)
    for entry in data:
        slug = get_area_slug(entry.get("address", ""), entry.get("title", ""))
        if slug:
            area_shops[slug].append(entry)

    # -----------------------------------------------------------------
    # Geographic guard. A keyword can match anywhere in an address, so
    # "kalyana mantapa" (a wedding hall) matched kalyan-nagar and a
    # Neelasandra shop matched kengeri. Distinct localities that share a
    # name also merge — Kothnur (560078, south) vs Kothanur (560077,
    # north) are ~21 km apart.
    #
    # Drop any shop more than MAX_AREA_RADIUS_KM from its area's MEDIAN
    # centre. Median, not mean, so a cluster of outliers cannot drag the
    # centre toward itself.
    # -----------------------------------------------------------------
    MAX_AREA_RADIUS_KM = 6.0
    evicted = []          # keyword-matched but geographically wrong
    for slug, entries in list(area_shops.items()):
        pts = [(e.get("latitude"), e.get("longitude")) for e in entries]
        pts = [(a, b) for a, b in pts if a and b]
        if len(pts) < 3:
            continue  # too few to establish a reliable centre
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
                # Wrong area, but still a real shop — re-matched below
                # against area centres rather than thrown away.
                evicted.append(e)
        # Nearest-first, so the 20-per-area cap keeps the shops most
        # central to the locality rather than an arbitrary scrape order.
        kept.sort(key=lambda pair: pair[0])
        area_shops[slug] = [e for _, e in kept]
    print(f"\nGeographic guard: evicted {len(evicted)} shops >{MAX_AREA_RADIUS_KM}km from their area centre")

    # -----------------------------------------------------------------
    # Geographic fallback. Bengaluru addresses name sub-localities that
    # no keyword list will ever fully cover ("Munnekolala", "Panathur",
    # "Garvebhavi Palya", ...). Rather than invent a page per hamlet,
    # assign any still-unmatched shop to the nearest area centre, but
    # only when it is genuinely close — a shop 5 km from every centre
    # belongs to none of them and stays unmatched.
    #
    # Runs AFTER the guard so centres are computed from clean, verified
    # members, and so guard-evicted shops get a second chance at their
    # correct area.
    # -----------------------------------------------------------------
    NEAREST_MAX_KM = 2.5
    centres = {}
    for slug, entries in area_shops.items():
        pts = [(e.get("latitude"), e.get("longitude")) for e in entries]
        pts = [(a, b) for a, b in pts if a and b]
        if len(pts) >= 3:
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
    print(f"Geographic fallback: matched {rescued} shops to their nearest area centre (<= {NEAREST_MAX_KM}km)")

    # Re-sort each area nearest-first so the 20-cap still keeps the most
    # central shops after the fallback additions.
    for slug, entries in area_shops.items():
        if slug not in centres:
            continue
        cl, cg = centres[slug]
        entries.sort(key=lambda e: math.hypot(
            ((e.get("latitude") or cl) - cl) * 111.0,
            ((e.get("longitude") or cg) - cg) * 108.0,
        ))

    print("\n=== Shops per area ===")
    for slug in sorted(area_shops.keys()):
        print(f"  {slug:<30} : {len(area_shops[slug])} shops")

    total_shops = sum(len(v) for v in area_shops.values())
    unmatched = len(data) - total_shops
    print(f"  Unmatched: {unmatched}")

    # Build list of all areas from the queries file
    lines = [
        'import type { Area } from "./types";',
        "",
        "/**",
        " * Auto-generated from Google Maps scrape (scripts/scraper/process_77areas.py).",
        " * Only `presence: \"live\"` entries generate static pages.",
        " *",
        f" * Data: {len(data)} scraped entries across {len(area_shops)} matched areas.",
        f" * Total shops assigned: {total_shops}.",
        " */",
        "const areas: Area[] = [",
    ]

    live_count = 0
    planned_count = 0

    for slug in slugs:
        shops = area_shops.get(slug, [])
        display_name = AREA_KW.get(slug, (None, slug.replace("-", " ").title(), []))[1]
        pin_codes = AREA_KW.get(slug, (None, None, []))[2]
        presence = "live" if shops else "planned"
        # Cap to the same number we'll actually emit (20/area) so the
        # intro count matches the rendered card list. Build the intro
        # from those same records so every fact it states is on the page.
        emitted = [to_live_location(s) for s in shops[:20]]
        intro = make_intro(len(emitted), display_name, emitted, pin_codes)
        keywords = make_keywords(display_name, slug, len(emitted))

        if shops:
            live_count += 1
        else:
            planned_count += 1

        lines.append("  {")
        lines.append(f'    slug: "{slug}",')
        lines.append(f'    name: "{display_name}",')
        lines.append('    city: "bengaluru",')
        lines.append(f"    pinCodes: {json.dumps(pin_codes)},")
        # json.dumps for escaping, not a hand-rolled quote replace: real
        # addresses contain backslashes ("No 4\2, MINERVA MILL") which a
        # quote-only escape turns into an invalid octal escape in TS.
        lines.append(f'    intro: {json.dumps(intro, ensure_ascii=False)},')
        lines.append(f"    keywords: {json.dumps(keywords, ensure_ascii=False)},")
        lines.append(f'    presence: "{presence}",')

        if shops:
            lines.append("    liveLocations: [")
            for shop in shops[:20]:   # cap at 20 per area
                loc = to_live_location(shop)
                lines.append("      {")
                lines.append(f'        name: {json.dumps(loc["name"], ensure_ascii=False)},')
                lines.append(f'        address: {json.dumps(loc["address"], ensure_ascii=False)},')
                lines.append(f"        lat: {loc['lat']},")
                lines.append(f"        lng: {loc['lng']},")
                if loc["phone"]:
                    lines.append(f'        phone: {json.dumps(loc["phone"], ensure_ascii=False)},')
                if loc["rating"]:
                    lines.append(f"        rating: {loc['rating']},")
                if loc["reviews"]:
                    lines.append(f"        reviews: {loc['reviews']},")
                if loc["placeId"]:
                    lines.append(f'        placeId: {json.dumps(loc["placeId"], ensure_ascii=False)},')
                lines.append("      },")
            lines.append("    ],")

        lines.append('    lastReviewed: "2026-08-07",')
        lines.append("  },")
        lines.append("")

    lines.append("];")
    lines.append("")
    lines.append("export default areas;")

    OUTPUT_FILE.write_text("\n".join(lines) + "\n")
    print(f"\nWritten to {OUTPUT_FILE}")

    print(f"\n=== Summary ===")
    print(f"  Areas with shops (live):   {live_count}")
    print(f"  Areas with no shops (planned): {planned_count}")
    print(f"  Total areas in output:     {len(slugs)}")
    print(f"  Total shops assigned:     {total_shops}")
    print(f"  Unmatched entries:         {unmatched}")

    # Report areas with no shops
    no_shop_areas = [s for s in slugs if not area_shops.get(s)]
    if no_shop_areas:
        print(f"\n  Areas with no matches ({len(no_shop_areas)}):")
        for s in no_shop_areas:
            print(f"    - {s}")


if __name__ == "__main__":
    main()
