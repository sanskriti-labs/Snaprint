"""Hyderabad area-keyword map and clean-data source for process_areas.py.

Batch 1 — 12 well-known areas, matching the "small scrape first" plan.
Batch 2 — 20 more areas added 2026-08-12, pin codes derived from real
scraped shop addresses (scripts/scraper/data/raw-pulls/
shops-clean-hyderabad-batch2.jsonl), the way Bengaluru's list was
corrected.
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

    # Batch 2 — added 2026-08-12
    "banjara-hills":       (["banjara hills"],                             "Banjara Hills",       ["500034", "500028"]),
    "jubilee-hills":       (["jubilee hills"],                             "Jubilee Hills",       ["500033", "500096"]),
    "miyapur":             (["miyapur"],                                   "Miyapur",             ["500049", "502033"]),
    "kompally":            (["kompally"],                                  "Kompally",            ["500100", "500010"]),
    "tarnaka":             (["tarnaka"],                                   "Tarnaka",             ["500017", "500007"]),
    "habsiguda":           (["habsiguda"],                                 "Habsiguda",           ["500007", "500013"]),
    "nallakunta":          (["nallakunta"],                                "Nallakunta",          ["500044", "500020"]),
    "abids":               (["abids"],                                    "Abids",               ["500001"]),
    "koti":                (["koti"],                                     "Koti",                ["500001", "500027"]),
    "himayatnagar":        (["himayatnagar", "himayath nagar"],           "Himayatnagar",        ["500029", "500020"]),
    "chikkadpally":        (["chikkadpally", "chikkadapally"],            "Chikkadpally",        ["500020", "500044"]),
    "ashok-nagar":         (["ashok nagar"],                               "Ashok Nagar",         ["500020", "500080"]),
    "vanasthalipuram":     (["vanasthalipuram", "vanasthali puram"],       "Vanasthalipuram",     ["500070", "500001"]),
    "nagole":              (["nagole"],                                   "Nagole",              ["500068", "500102"]),
    "attapur":             (["attapur"],                                  "Attapur",             ["500048", "500006"]),
    "manikonda":           (["manikonda"],                                "Manikonda",           ["500089", "500104"]),
    "kothapet":            (["kothapet"],                                 "Kothapet",            ["500102", "500035"]),
    "ecil":                (["ecil"],                                     "ECIL",                ["500062"]),
    "nizampet":            (["nizampet"],                                 "Nizampet",            ["500090", "500085"]),
    "alwal":               (["alwal"],                                    "Alwal",               ["500010", "500015"]),
}
