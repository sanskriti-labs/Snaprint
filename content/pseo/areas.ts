import type { Area } from "./types";

/**
 * Phase 1 — validation slice. Expand during Phase 2.
 * Only `presence: "live"` entries generate real pages.
 * Hand-written intros are required — no template fill.
 */
const areas: Area[] = [
  {
    slug: "koramangala",
    name: "Koramangala",
    city: "bengaluru",
    pinCodes: ["560034", "560095"],
    intro:
      "Koramangala residents and office workers can print documents at a Snaprint kiosk nearby — upload from your phone, pay via UPI, collect in under 60 seconds.",
    keywords: [
      "print near koramangala",
      "xerox shop koramangala",
      "document printing koramangala 6th block",
      "instant print koramangala",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
  {
    slug: "indiranagar",
    name: "Indiranagar",
    city: "bengaluru",
    pinCodes: ["560038", "560008"],
    intro:
      "Indiranagar's cafe culture and co-working spaces draw a crowd that prints constantly — Snaprint brings the same 24/7 self-service kiosk to your neighbourhood.",
    keywords: [
      "print near indiranagar",
      "xerox shop indiranagar",
      "cv printing 100 feet road",
      "document print indiranagar 2nd stage",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
  {
    slug: "whitefield",
    name: "Whitefield",
    city: "bengaluru",
    pinCodes: ["560066", "560048"],
    intro:
      "Whitefield's tech park workforce and residential community generate constant demand for print — Snaprint's kiosks handle it on-demand, without a staffed counter.",
    keywords: [
      "print near whitefield",
      "xerox shop whitefield",
      "document printing itpl",
      "resume print outer ring road whitefield",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
  {
    slug: "hsr-layout",
    name: "HSR Layout",
    city: "bengaluru",
    pinCodes: ["560102", "560107"],
    intro:
      "HSR Layout's mix of students, freelancers, and startups creates a high-need print corridor. A Snaprint kiosk in your neighbourhood means no more closed shops when deadlines hit.",
    keywords: [
      "print near hsr layout",
      "xerox shop hsr",
      "assignment printing sector 2 hsr",
      "document print hsr 17th cross",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
  {
    slug: "electronic-city",
    name: "Electronic City",
    city: "bengaluru",
    pinCodes: ["560100", "560101"],
    intro:
      "Electronic City employees printing presentations and reports can use a Snaprint kiosk on-demand — no detours to a xerox shop, no waiting in line during lunch hour.",
    keywords: [
      "print near electronic city",
      "xerox shop electronic city",
      "presentation printing ec phase 1",
      "document print electronic city phase 2",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
];

export default areas;
