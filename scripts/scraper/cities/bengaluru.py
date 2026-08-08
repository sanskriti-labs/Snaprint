"""Bengaluru area-keyword map and clean-data source for process_areas.py.

Extracted unchanged from the original Bengaluru-only process_77areas.py
so the historical matching behaviour (keyword lists, pin codes, comments
explaining edge cases) is preserved exactly.
"""
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent

CITY_SLUG = "bengaluru"
QUERIES_FILE = SCRIPT_DIR / "bangalore-xeroxshops.txt"
CLEAN_FILE = SCRIPT_DIR / "data" / "shops-clean.jsonl"
RAW_DATA_FILE = SCRIPT_DIR / "data" / "results-77areas.json"

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
    # Bare "kalyan" is dropped: it matches "kalyana mantapa" (wedding
    # hall), which appears in addresses all over the city.
    "kalyan-nagar":          (["kalyan nagar", "kalyanagar"],                             "Kalyan Nagar",             ["560043", "560001"]),

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
    "jp-nagar":              (["jp nagar", "j p nagar", "j. p. nagar", "j.p. nagar", "jpnagar", "jp nagar phase"],    "JP Nagar",                 ["560078", "560069", "560041"]),
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

    # Added from mining raw-scrape addresses for locality names not yet in
    # AREA_KW (scripts/scraper/process_areas.py address-mining pass,
    # 2026-08-08): each had shops in the scrape with zero or partial
    # existing-area match, so real shops were going unmatched/mismatched.
    "ejipura":               (["ejipura"],                                                "Ejipura",                  ["560047"]),
    "raghuvanahalli":        (["raghuvanahalli"],                                          "Raghuvanahalli",           ["560109"]),
    # Distinct from Yelahanka proper — a REVA University-anchored pocket
    # that addresses tag as both "Kattigenahalli" and "Yelahanka"; kept
    # separate since it has its own concentration of student xerox shops.
    "kattigenahalli":        (["kattigenahalli"],                                          "Kattigenahalli",           ["560064"]),
}
