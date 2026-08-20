import type { City } from "./types";

/**
 * Phase 1 — validation slice.
 * `live` and `served` entries generate real pages and appear in sitemap + llms.txt.
 * `live` = kiosk physically present. `served` = pSEO directory only, no kiosk yet.
 * `planned` entries generate no page (404) and are not linked from anywhere.
 */
const cities: City[] = [
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    pinCodes: [
      "560001", "560002", "560003", "560004", "560005",
      "560029", "560034", "560047", "560066", "560076",
      "560085", "560095", "560100", "560103",
    ],
    intro:
      "92 neighbourhoods in Bengaluru with listed xerox and print shops — compare B&W and colour printing, binding, lamination and scanning near you.",
    keywords: [
      "instant print bangalore",
      "print shop bangalore",
      "xerox shop bengaluru",
      "print near me bangalore",
      "document printing bangalore",
      "photocopy shop bengaluru",
    ],
    neighbors: ["hyderabad"],
    // "live" once a real kiosk address is verified in this city; "served"
    // means the directory (area/college pages with verified shop data) is
    // ready to publish ahead of a kiosk. No kiosk is live anywhere yet, so
    // every city here is "served" at best — see hyderabad below.
    presence: "served",
    liveLocations: [],
    lastReviewed: "2026-08-12",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    lat: 17.385,
    lng: 78.4867,
    pinCodes: [
      "500016", "500038", "500036", "500003", "500081",
      "500032", "500039", "500084", "500028", "500074",
    ],
    intro:
      "12 neighbourhoods in Hyderabad with listed xerox and print shops — compare B&W and colour printing, binding, lamination and scanning near you.",
    keywords: [
      "print shop hyderabad",
      "xerox shop hyderabad",
      "print near me hyderabad",
      "document printing hyderabad",
    ],
    neighbors: ["bengaluru"],
    presence: "served",
    liveLocations: [],
    lastReviewed: "2026-08-08",
  },
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    pinCodes: [
      "600001", "600002", "600003", "600006", "600008", "600015", "600017",
      "600020", "600032", "600034", "600040", "600041", "600042", "600044",
      "600045", "600064", "600072", "600090", "600100", "600101", "600119",
    ],
    intro:
      "12 neighbourhoods in Chennai with listed xerox and print shops — compare B&W and colour printing, binding, lamination and scanning near you.",
    keywords: [
      "print shop chennai",
      "xerox shop chennai",
      "print near me chennai",
      "document printing chennai",
    ],
    neighbors: ["mumbai"],
    presence: "served",
    liveLocations: [],
    lastReviewed: "2026-08-14",
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    lat: 19.076,
    lng: 72.8777,
    pinCodes: [
      "400001", "400002", "400003", "400016", "400019", "400020", "400024",
      "400028", "400055", "400058", "400059", "400066", "400069", "400070",
      "400072", "400075", "400076", "400077", "400092", "400098", "400602",
      "400603",
    ],
    intro:
      "12 neighbourhoods in Mumbai with listed xerox and print shops — compare B&W and colour printing, binding, lamination and scanning near you.",
    keywords: [
      "print shop mumbai",
      "xerox shop mumbai",
      "print near me mumbai",
      "document printing mumbai",
    ],
    neighbors: ["pune", "chennai"],
    presence: "served",
    liveLocations: [],
    lastReviewed: "2026-08-14",
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    pinCodes: [
      "411001", "411002", "411004", "411005", "411007", "411013", "411014",
      "411028", "411033", "411038", "411045", "411052", "411057", "411067",
      "411069",
    ],
    intro:
      "12 neighbourhoods in Pune with listed xerox and print shops — compare B&W and colour printing, binding, lamination and scanning near you.",
    keywords: [
      "print shop pune",
      "xerox shop pune",
      "print near me pune",
      "document printing pune",
    ],
    neighbors: ["mumbai"],
    presence: "served",
    liveLocations: [],
    lastReviewed: "2026-08-14",
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    state: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    pinCodes: [
      "110001", "110002", "110005", "110006", "110007", "110019", "110021",
      "110060", "122001", "122002", "122007", "122009", "122015", "201020",
      "201301", "201309",
    ],
    intro:
      "12 neighbourhoods across Delhi, Gurugram and Noida with listed xerox and print shops — compare B&W and colour printing, binding, lamination and scanning near you.",
    keywords: [
      "print shop delhi",
      "xerox shop gurgaon",
      "print near me noida",
      "document printing delhi ncr",
    ],
    presence: "served",
    liveLocations: [],
    lastReviewed: "2026-08-14",
  },
];

export default cities;
