import type { College } from "./types";

/**
 * Phase 1 — validation slice. Expand during Phase 2.
 * Only `presence: "live"` entries generate real pages.
 */
const colleges: College[] = [
  {
    slug: "iisc-bangalore",
    name: "Indian Institute of Science",
    shortName: "IISc",
    city: "bengaluru",
    area: "bannerghatta",
    address: "CV Raman Avenue, Bengaluru, Karnataka 560012",
    lat: 13.0219,
    lng: 77.5673,
    intro:
      "IISc students and researchers can now print assignments, theses, and papers directly from their phone — no app, no USB, no queue at the nearest photocopy shop.",
    keywords: [
      "print near iisc bangalore",
      "thesis printing near iisc",
      "document print cv raman avenue",
      "assignment print jigni",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
  {
    slug: "rvce-bengaluru",
    name: "RV College of Engineering",
    shortName: "RVCE",
    city: "bengaluru",
    area: "mysore-road",
    address: "RV Vidyaniketan Post, Mysore Road, Bengaluru, Karnataka 560059",
    lat: 12.9357,
    lng: 77.5015,
    intro:
      "RVCE students printing project reports, seminar papers, or placement resumes no longer need to wait for a xerox shop to open — a Snaprint kiosk handles it in under 60 seconds.",
    keywords: [
      "print near rvce",
      "project report printing rv college",
      "resume print mysore road",
      "xerox shop mysore road bangalore",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
  {
    slug: "pes-university-bangalore",
    name: "PES University",
    shortName: "PESU",
    city: "bengaluru",
    area: "banashankari",
    address: "Electronic City, Hosur Road, Bengaluru, Karnataka 560100",
    lat: 12.9139,
    lng: 77.6604,
    intro:
      "PESU students in Electronic City can walk up to a Snaprint kiosk, scan a QR, and print from their phone — assignments, placement resumes, and lab reports, day or night.",
    keywords: [
      "print near pes university electronic city",
      "resume printing pesu",
      "assignment print electronic city bangalore",
      "xerox shop electronic city",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
  {
    slug: "christ-university-bangalore",
    name: "Christ University",
    shortName: "Christ",
    city: "bengaluru",
    area: "bannimantha",
    address: "Dharmaram College Post, Hosur Road, Bengaluru, Karnataka 560029",
    lat: 12.9352,
    lng: 77.6045,
    intro:
      "Christ University students can print from their phone at a nearby Snaprint kiosk — whether it's an exam form the night before or a last-minute placement CV the morning of an interview.",
    keywords: [
      "print near christ university bangalore",
      "exam form printing christ university",
      "cv print hosur road",
      "xerox shop bannimantha",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
  {
    slug: "nitte-meenakshi-bangalore",
    name: "Nitte Meenakshi Institute of Technology",
    shortName: "NMIT",
    city: "bengaluru",
    area: "yelahanka",
    address: "Govindpura, Yelahanka, Bengaluru, Karnataka 560064",
    lat: 13.0827,
    lng: 77.5765,
    intro:
      "NMIT students living near Yelahanka can use a Snaprint kiosk to print assignments and project documents from their phone, skipping the walk to the nearest xerox shop entirely.",
    keywords: [
      "print near nmit yelahanka",
      "assignment printing nmit",
      "xerox shop yelahanka bangalore",
      "document print govindpura",
    ],
    presence: "planned",
    lastReviewed: "2026-08-03",
  },
];

export default colleges;
