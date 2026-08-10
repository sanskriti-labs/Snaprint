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
      "Snaprint has kiosks across Bengaluru — students, job seekers, and commuters can print documents instantly without waiting in queue or hunting for an open shop.",
    keywords: [
      "instant print bangalore",
      "print kiosk bengaluru",
      "xerox shop bangalore",
      "print near me bangalore",
      "document printing bangalore",
    ],
    neighbors: [],
    // "live" once a real kiosk address is verified; "served" once area/college
    // pages here have enough verified shop data to publish without a kiosk.
    presence: "planned",
    liveLocations: [],
    lastReviewed: "2026-08-03",
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
    neighbors: [],
    presence: "served",
    liveLocations: [],
    lastReviewed: "2026-08-08",
  },
];

export default cities;
