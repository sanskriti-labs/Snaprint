"""Mumbai area-keyword map. Created 2026-08-13.

Pin codes corrected 2026-08-13 against real scraped shop addresses in
scripts/scraper/data/raw-pulls/results-mumbai-2026-08-13.json, the way
Bengaluru's and Hyderabad's lists were corrected.

Note: the original "cst" keyword bare-matched inside "CST Road" in
unrelated Kalina/Santacruz East addresses (CST Road runs through
Kalina), polluting CST's derived pin codes with Kalina's 400098. Kept
only "chhatrapati shivaji" / "c.s.t." — real CST Terminus (Fort) area
addresses all resolve to 400001.
"""
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent

CITY_SLUG = "mumbai"
QUERIES_FILE = SCRIPT_DIR / "mumbai-xeroxshops.txt"
CLEAN_FILE = SCRIPT_DIR / "data" / "shops-clean-mumbai.jsonl"
RAW_DATA_FILE = SCRIPT_DIR / "data" / "results-mumbai.json"

AREA_KW = {
    "churchgate":       (["churchgate"],                                  "Churchgate",       ["400020"]),
    "cst":              (["c.s.t.", "chhatrapati shivaji"],                "CST",              ["400001"]),
    "dadar":            (["dadar"],                                       "Dadar",            ["400028", "400019"]),
    "andheri":          (["andheri"],                                     "Andheri",          ["400069", "400058", "400059"]),
    "borivali":         (["borivali"],                                    "Borivali",         ["400066", "400092"]),
    "thane":            (["thane"],                                       "Thane",            ["400602", "400603"]),
    "kurla":            (["kurla"],                                       "Kurla",            ["400070", "400024"]),
    "ghatkopar":        (["ghatkopar"],                                   "Ghatkopar",        ["400077", "400075"]),
    "matunga":          (["matunga"],                                     "Matunga",          ["400019", "400016"]),
    "powai":            (["powai", "hiranandani"],                        "Powai",            ["400076", "400072"]),
    "kalina":           (["kalina", "santacruz east"],                    "Kalina",           ["400098", "400055"]),
    "crawford-market":  (["crawford market", "kalbadevi", "lohar chawk", "mangaldas"], "Crawford Market", ["400002", "400003"]),
}
