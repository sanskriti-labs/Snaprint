"""Chennai area-keyword map. Created 2026-08-13.

Pin codes corrected 2026-08-13 against real scraped shop addresses in
scripts/scraper/data/raw-pulls/results-chennai-2026-08-13.json, the way
Bengaluru's and Hyderabad's lists were corrected.
"""
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent

CITY_SLUG = "chennai"
QUERIES_FILE = SCRIPT_DIR / "chennai-xeroxshops.txt"
CLEAN_FILE = SCRIPT_DIR / "data" / "shops-clean-chennai.jsonl"
RAW_DATA_FILE = SCRIPT_DIR / "data" / "results-chennai.json"

AREA_KW = {
    "t-nagar":      (["t nagar", "t.nagar", "thyagaraya road", "panagal park"], "T. Nagar",      ["600017", "600090"]),
    "guindy":       (["guindy"],                                                  "Guindy",       ["600032", "600015"]),
    "anna-nagar":   (["anna nagar"],                                              "Anna Nagar",   ["600040", "600101"]),
    "velachery":    (["velachery"],                                               "Velachery",    ["600042", "600032"]),
    "tambaram":     (["tambaram"],                                                 "Tambaram",     ["600044", "600045"]),
    "egmore":       (["egmore"],                                                   "Egmore",       ["600008", "600002"]),
    "saidapet":     (["saidapet"],                                                 "Saidapet",     ["600015", "600072"]),
    "adyar":        (["adyar"],                                                    "Adyar",        ["600020", "600041"]),
    "nungambakkam": (["nungambakkam"],                                            "Nungambakkam", ["600034", "600006"]),
    "chromepet":    (["chromepet", "chrome pet"],                                  "Chromepet",    ["600044", "600064"]),
    "george-town":  (["george town", "mannady", "nsc bose road"],                  "George Town",  ["600001", "600003"]),
    "sholinganallur":(["sholinganallur"],                                          "Sholinganallur",["600119", "600100"]),
}
