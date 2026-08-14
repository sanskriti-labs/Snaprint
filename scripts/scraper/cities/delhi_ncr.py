"""Delhi NCR area-keyword map. Created 2026-08-13.

Delhi NCR is treated as one logical unit (slug delhi_ncr) even though it
spans Delhi, Gurugram, and Noida queries. Pin codes corrected 2026-08-13
against real scraped shop addresses in
scripts/scraper/data/raw-pulls/results-delhi-ncr-2026-08-13.json, the
way Bengaluru's and Hyderabad's lists were corrected.
"""
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent

CITY_SLUG = "delhi_ncr"
QUERIES_FILE = SCRIPT_DIR / "delhi-ncr-xeroxshops.txt"
CLEAN_FILE = SCRIPT_DIR / "data" / "shops-clean-delhi-ncr.jsonl"
RAW_DATA_FILE = SCRIPT_DIR / "data" / "results-delhi-ncr.json"

AREA_KW = {
    # Delhi
    "kamla-nagar":       (["kamla nagar"],                                              "Kamla Nagar",         ["110007"]),
    "satya-niketan":     (["satya niketan"],                                            "Satya Niketan",       ["110021"]),
    "connaught-place":   (["connaught place", "cp", "rajiv chowk"],                     "Connaught Place",     ["110001"]),
    "karol-bagh":        (["karol bagh", "karolbagh"],                                  "Karol Bagh",          ["110005", "110060"]),
    "chandni-chowk":     (["chandni chowk", "nai sarak"],                               "Chandni Chowk",       ["110006", "110002"]),
    "nehru-place":       (["nehru place", "nehru enclave"],                             "Nehru Place",         ["110019"]),

    # Gurugram
    "cyber-hub":         (["cyber hub", "dlf cyber city"],                              "Cyber Hub",           ["122002", "122015"]),
    "sector-14-gurgaon": (["sector 14", "sector 14 market"],                            "Sector 14 Market",    ["122001", "122007"]),
    "galleria-market":   (["galleria market", "dlf phase 4"],                           "Galleria Market",     ["122009"]),

    # Noida
    "sector-18-noida":   (["sector 18", "sector 18 noida", "atta market"],              "Sector 18",           ["201301"]),
    "atta-market-noida": (["atta market", "sector 27"],                                 "Atta Market",         ["201301"]),
    "sector-62-noida":   (["sector 62", "sector 62 noida"],                             "Sector 62",           ["201309", "201020"]),
}
