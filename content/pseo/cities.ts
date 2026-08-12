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
      "92 neighbourhoods in Bengaluru with verified xerox and print shops — compare B&W and colour printing, binding, lamination and scanning near you.",
    keywords: [
      "instant print bangalore",
      "print shop bengaluru",
      "xerox shop bangalore",
      "print near me bangalore",
      "document printing bangalore",
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
      "12 neighbourhoods in Hyderabad with verified xerox and print shops — compare B&W and colour printing, binding, lamination and scanning near you.",
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
];

export default cities;
