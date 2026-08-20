"""Pune area-keyword map. Created 2026-08-13.

Pin codes corrected 2026-08-13 against real scraped shop addresses in
scripts/scraper/data/raw-pulls/results-pune-2026-08-13.json, the way
Bengaluru's and Hyderabad's lists were corrected.

Note: Kothrud and Karve Nagar are geographically adjacent. The keyword
matcher relies on precise spelling — "karve nagar" must stay distinct
from "kothrud" or the transform will collapse them. Also, the bare
"camp" keyword substring-matches unrelated addresses (e.g. "...opp.
polly hub, campus..." in Vadgaon Budruk) — real Camp-area addresses
still confirm 411001/411002.
"""
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent

CITY_SLUG = "pune"
QUERIES_FILE = SCRIPT_DIR / "pune-xeroxshops.txt"
CLEAN_FILE = SCRIPT_DIR / "data" / "shops-clean-pune.jsonl"
RAW_DATA_FILE = SCRIPT_DIR / "data" / "results-pune.json"

AREA_KW = {
    "shivajinagar-pune": (["shivajinagar", "shivaji nagar"],             "Shivajinagar",   ["411005", "411004"]),
    "deccan":         (["deccan", "fergusson", "bmcc", "fc road"],       "Deccan",         ["411004", "411001"]),
    "kothrud":        (["kothrud", "kothrud depot"],                     "Kothrud",        ["411038", "411052"]),
    "karve-nagar":    (["karve nagar", "law college road"],              "Karve Nagar",    ["411052"]),
    "aundh":          (["aundh"],                                        "Aundh",          ["411067", "411007"]),
    "baner":          (["baner", "baner pashan link road"],               "Baner",          ["411069", "411045"]),
    "wakad":          (["wakad"],                                        "Wakad",          ["411057", "411033"]),
    "hinjewadi":      (["hinjewadi", "rajiv gandhi infotech park"],      "Hinjewadi",      ["411057"]),
    "kharadi":        (["kharadi", "eon it park", "wtc pune"],           "Kharadi",        ["411014", "411013"]),
    "magarpatta":     (["magarpatta", "magarpatta city"],                "Magarpatta",     ["411013", "411028"]),
    "camp":           (["camp", "mg road pune", "east street", "hong kong lane"], "Camp",  ["411001", "411002"]),
    "swargate":       (["swargate", "satara road"],                      "Swargate",       ["411002"]),
}
