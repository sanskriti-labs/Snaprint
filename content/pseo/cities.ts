import type { City } from "./types";

/**
 * Phase 1 — validation slice.
 * Only `presence: "live"` entries generate real pages and appear in sitemap + llms.txt.
 * `planned` entries render a "coming soon" page without a real address.
 * `served` entries do not generate a URL.
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
    // presence is "live" once a real kiosk address is verified.
    // Set to "planned" until the first deployment address is confirmed.
    presence: "planned",
    liveLocations: [],
    lastReviewed: "2026-08-03",
  },
];

export default cities;
