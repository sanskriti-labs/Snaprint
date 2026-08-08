"""Hyderabad area-keyword map and clean-data source for process_areas.py.

Starter batch — 12 well-known areas, matching the "small scrape first"
plan. Pin codes are representative; cross-check against real scrape
addresses once data lands, the way Bengaluru's list was corrected.
"""
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent

CITY_SLUG = "hyderabad"
QUERIES_FILE = SCRIPT_DIR / "hyderabad-xeroxshops.txt"
CLEAN_FILE = SCRIPT_DIR / "data" / "shops-clean-hyderabad.jsonl"
RAW_DATA_FILE = SCRIPT_DIR / "data" / "results-hyderabad.json"

AREA_KW = {
    "ameerpet":       (["ameerpet"],                         "Ameerpet",       ["500016", "500038"]),
    "kukatpally":     (["kukatpally", "kphb"],                "Kukatpally",     ["500072", "500085"]),
    "dilsukhnagar":   (["dilsukhnagar", "dilsukh nagar"],     "Dilsukhnagar",   ["500036", "500060"]),
    "secunderabad":   (["secunderabad"],                      "Secunderabad",   ["500003", "500009"]),
    "begumpet":       (["begumpet"],                          "Begumpet",       ["500016", "500003"]),
    "madhapur":       (["madhapur"],                          "Madhapur",       ["500081", "500033"]),
    "gachibowli":     (["gachibowli"],                        "Gachibowli",     ["500032", "500019"]),
    "uppal":          (["uppal"],                             "Uppal",          ["500039"]),
    "kondapur":       (["kondapur"],                          "Kondapur",       ["500084", "500032"]),
    "mehdipatnam":    (["mehdipatnam", "mehandipatnam"],      "Mehdipatnam",    ["500028"]),
    "malakpet":       (["malakpet"],                          "Malakpet",       ["500036", "500024"]),
    "lb-nagar":       (["lb nagar", "l b nagar", "lbnagar"],  "LB Nagar",       ["500074", "500035"]),
}
