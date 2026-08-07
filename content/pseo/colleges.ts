import type { College } from "./types";

/**
 * Bangalore college directory — Phase 1.
 *
 * Promotion policy (intentional friction):
 *   1. Run `python scripts/match/colleges_radius.py <slug>` to confirm
 *      ≥ 1 real xerox shop exists within 1.5 km of campus coords.
 *   2. Verify 2–3 of those shops in Google Maps manually.
 *   3. Flip `presence: "live"` and set `verifiedAt: "<today>"`.
 *   4. Swap the (still factual, but branching) intro to a present-tense
 *      version that names the live kiosk tier explicitly.
 *   5. Bump `lastReviewed`. CI runs the verify:pseo gate which fails
 *      if a live college has zero shops in radius.
 *
 * Until promoted, every intro on this page is intentionally
 * "see nearby shops" wording — no claim of a kiosk existing.
 */
const colleges: College[] = [
  // ---------------------------------------------------------------------
  // EXISTING 5 — intros rewritten to remove kiosk-existence claims.
  // ---------------------------------------------------------------------
  {
    slug: "iisc-bangalore",
    name: "Indian Institute of Science",
    shortName: "IISc",
    city: "bengaluru",
    address: "CV Raman Avenue, Bengaluru, Karnataka 560012",
    lat: 13.0219,
    lng: 77.5673,
    intro:
      "IISc students and researchers looking for nearby print shops often need thesis printing, late-night assignments, and last-minute research papers — see verified xerox shops within 1.5 km of the IISc campus.",
    keywords: [
      "print near iisc bangalore",
      "thesis printing near iisc",
      "document print cv raman avenue",
      "assignment print jigni",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "rvce-bengaluru",
    name: "RV College of Engineering",
    shortName: "RVCE",
    city: "bengaluru",
    address: "RV Vidyaniketan Post, Mysore Road, Bengaluru, Karnataka 560059",
    lat: 12.9357,
    lng: 77.5015,
    intro:
      "RVCE students printing project reports, seminar papers, and placement resumes frequently compare xerox shops along Mysore Road — see verified print shops near the RVCE campus.",
    keywords: [
      "print near rvce",
      "project report printing rv college",
      "resume print mysore road",
      "xerox shop mysore road bangalore",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "pes-university-bangalore",
    name: "PES University",
    shortName: "PESU",
    city: "bengaluru",
    address: "Electronic City, Hosur Road, Bengaluru, Karnataka 560100",
    lat: 12.9139,
    lng: 77.6604,
    intro:
      "PESU students in Electronic City often need assignment print, placement CV print, and lab report print on short notice — see verified xerox shops near PES University's Electronic City campus.",
    keywords: [
      "print near pes university electronic city",
      "resume printing pesu",
      "assignment print electronic city bangalore",
      "xerox shop electronic city",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "christ-university-bangalore",
    name: "Christ University",
    shortName: "Christ",
    city: "bengaluru",
    address: "Dharmaram College Post, Hosur Road, Bengaluru, Karnataka 560029",
    lat: 12.9352,
    lng: 77.6045,
    intro:
      "Christ University students often search for exam-form printing, last-minute CV print for placement drives, and assignment print near campus — see verified xerox shops near Christ University on Hosur Road.",
    keywords: [
      "print near christ university bangalore",
      "exam form printing christ university",
      "cv print hosur road",
      "xerox shop bannimantha",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "nitte-meenakshi-bangalore",
    name: "Nitte Meenakshi Institute of Technology",
    shortName: "NMIT",
    city: "bengaluru",
    address: "Govindpura, Yelahanka, Bengaluru, Karnataka 560064",
    lat: 13.0827,
    lng: 77.5765,
    intro:
      "NMIT students living near Yelahanka often need assignment print, project report print, and document print on the same day — see verified xerox shops near NMIT campus.",
    keywords: [
      "print near nmit yelahanka",
      "assignment printing nmit",
      "xerox shop yelahanka bangalore",
      "document print govindpura",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },

  // ---------------------------------------------------------------------
  // NEW ENTRIES — 10 additional Bangalore colleges.
  // Coords verified against Google Maps campus pin; intros factual,
  // no kiosk-existence claims. `area` field dropped where the
  // existing areas.ts slug did not match — geo radius is the
  // primary match path now.
  // ---------------------------------------------------------------------
  {
    slug: "bms-college-of-engineering",
    name: "BMS College of Engineering",
    shortName: "BMSCE",
    city: "bengaluru",
    address: "Bull Temple Road, Basavanagudi, Bengaluru, Karnataka 560019",
    lat: 12.9416,
    lng: 77.5664,
    intro:
      "BMS College of Engineering students on Bull Temple Road often need project report print, IEEE paper print, and placement CV print — see verified xerox shops near BMSCE campus.",
    keywords: [
      "print near bmsce",
      "bms college project report printing",
      "xerox shop basavanagudi",
      "placement cv print bull temple road",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "ms-ramaiah-institute-of-technology",
    name: "M.S. Ramaiah Institute of Technology",
    shortName: "MSRIT",
    city: "bengaluru",
    address: "MSR Nagar, MSRIT Post, Bengaluru, Karnataka 560054",
    lat: 13.0298,
    lng: 77.5645,
    intro:
      "MSRIT students in MSR Nagar often look for same-day assignment print, lab manual print, and placement CV print — see verified xerox shops near the MSRIT campus.",
    keywords: [
      "print near msrit",
      "ms ramaiah assignment printing",
      "xerox shop msr nagar",
      "lab manual print mathikere",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "jain-deemed-to-be-university",
    name: "Jain (Deemed-to-be University)",
    shortName: "Jain",
    city: "bengaluru",
    address: "Jain Global Campus, Kanakapura Road, Bengaluru, Karnataka 562112",
    lat: 12.7692,
    lng: 77.4333,
    intro:
      "Jain University students on Kanakapura Road often need assignment print, project report print, and conference paper print — see verified xerox shops near the Jain campus.",
    keywords: [
      "print near jain university",
      "jain assignment printing kanakapura",
      "xerox shop kanakapura road",
      "project report print jain global campus",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "presidency-university-bangalore",
    name: "Presidency University",
    shortName: "Presidency",
    city: "bengaluru",
    address: "Itgalpur, Rajanukunte, Yelahanka, Bengaluru, Karnataka 560064",
    lat: 13.1306,
    lng: 77.5847,
    intro:
      "Presidency University students near Yelahanka frequently need assignment print, exam form print, and placement CV print — see verified xerox shops near the Presidency campus.",
    keywords: [
      "print near presidency university",
      "presidency assignment print yelahanka",
      "xerox shop rajanukunte",
      "exam form print presidency",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "acharya-institute-of-technology",
    name: "Acharya Institute of Technology",
    shortName: "AIT",
    city: "bengaluru",
    address: "Acharya Dr. Sarvepalli Radhakrishnan Road, Soldevanahalli, Bengaluru, Karnataka 560107",
    lat: 13.0658,
    lng: 77.4649,
    intro:
      "Acharya Institute of Technology students near Soldevanahalli often need project report print, assignment print, and placement CV print — see verified xerox shops near the AIT campus.",
    keywords: [
      "print near acharya institute",
      "acharya project report print",
      "xerox shop soldevanahalli",
      "placement cv print acharya",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "reva-university",
    name: "REVA University",
    shortName: "REVA",
    city: "bengaluru",
    address: "Rukmini Knowledge Park, Kattigenahalli, Yelahanka, Bengaluru, Karnataka 560064",
    lat: 13.1208,
    lng: 77.5723,
    intro:
      "REVA University students at Rukmini Knowledge Park frequently need assignment print, lab report print, and thesis print — see verified xerox shops near the REVA campus.",
    keywords: [
      "print near reva university",
      "reva assignment print yelahanka",
      "xerox shop kattigenahalli",
      "thesis print reva",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "dayananda-sagar-college-of-engineering",
    name: "Dayananda Sagar College of Engineering",
    shortName: "DSCE",
    city: "bengaluru",
    address: "Shavige Malleshwara Hills, Kumaraswamy Layout, Bengaluru, Karnataka 560078",
    lat: 12.9089,
    lng: 77.5638,
    intro:
      "DSCE students in Kumaraswamy Layout often need project report print, placement CV print, and assignment print — see verified xerox shops near the DSCE campus.",
    keywords: [
      "print near dsce",
      "dayananda sagar assignment printing",
      "xerox shop kumaraswamy layout",
      "placement cv print dsce",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "st-josephs-college-of-commerce",
    name: "St. Joseph's College of Commerce",
    shortName: "SJCC",
    city: "bengaluru",
    address: "163 Brigade Road, Bengaluru, Karnataka 560025",
    lat: 12.9684,
    lng: 77.6083,
    intro:
      "St. Joseph's College of Commerce students on Brigade Road frequently need assignment print, internship application print, and resume print — see verified xerox shops near the SJCC campus.",
    keywords: [
      "print near sjcc",
      "st josephs commerce assignment printing",
      "xerox shop brigade road",
      "resume print brigade road",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "st-josephs-college",
    name: "St. Joseph's College",
    shortName: "SJC",
    city: "bengaluru",
    address: "36 Lalbagh Road, Bengaluru, Karnataka 560027",
    lat: 12.9563,
    lng: 77.5841,
    intro:
      "St. Joseph's College students on Lalbagh Road often need assignment print, project paper print, and exam form print — see verified xerox shops near the SJC campus.",
    keywords: [
      "print near sjc bangalore",
      "st josephs college assignment printing",
      "xerox shop lalbagh road",
      "exam form print lalbagh",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "mount-carmel-college",
    name: "Mount Carmel College",
    shortName: "MCC",
    city: "bengaluru",
    address: "58 Palace Road, Vasanth Nagar, Bengaluru, Karnataka 560052",
    lat: 12.9891,
    lng: 77.5921,
    intro:
      "Mount Carmel College students on Palace Road frequently need assignment print, internship application print, and CV print — see verified xerox shops near the MCC campus.",
    keywords: [
      "print near mount carmel college",
      "mcc assignment printing vasanth nagar",
      "xerox shop palace road",
      "cv print palace road",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "jyoti-nivas-college",
    name: "Jyoti Nivas College",
    shortName: "JNC",
    city: "bengaluru",
    address: "8th Block, Koramangala, Bengaluru, Karnataka 560095",
    lat: 12.9354,
    lng: 77.6221,
    intro:
      "Jyoti Nivas College students in Koramangala often need assignment print, project report print, and placement CV print — see verified xerox shops near the JNC campus.",
    keywords: [
      "print near jyoti nivas college",
      "jnc assignment printing koramangala",
      "xerox shop koramangala 8th block",
      "placement cv print jnc",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "vijaya-college",
    name: "Vijaya College",
    shortName: "Vijaya",
    city: "bengaluru",
    address: "Basavanagudi, Bengaluru, Karnataka 560004",
    lat: 12.9408,
    lng: 77.5651,
    intro:
      "Vijaya College students in Basavanagudi frequently need assignment print, exam form print, and project report print — see verified xerox shops near the Vijaya campus.",
    keywords: [
      "print near vijaya college",
      "vijaya college assignment printing",
      "xerox shop basavanagudi",
      "exam form print basavanagudi",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "kristu-jayanti-college",
    name: "Kristu Jayanti College",
    shortName: "KJC",
    city: "bengaluru",
    address: "K. Narayanapura, Kothanur, Bengaluru, Karnataka 560077",
    lat: 13.0543,
    lng: 77.6407,
    intro:
      "Kristu Jayanti College students near Kothanur often need assignment print, project report print, and placement CV print — see verified xerox shops near the KJC campus.",
    keywords: [
      "print near kristu jayanti",
      "kjc assignment printing kothanur",
      "xerox shop k narayanapura",
      "placement cv print kjc",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "east-point-college",
    name: "East Point College of Engineering and Technology",
    shortName: "EPCET",
    city: "bengaluru",
    address: "Bidarahalli, Bengaluru, Karnataka 560049",
    lat: 13.0259,
    lng: 77.7081,
    intro:
      "East Point College students near Bidarahalli frequently need assignment print, lab report print, and project report print — see verified xerox shops near the EPCET campus.",
    keywords: [
      "print near east point college",
      "epcet assignment printing bidarahalli",
      "xerox shop bidarahalli",
      "lab report print east point",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
  {
    slug: "cmrit-bangalore",
    name: "CMR Institute of Technology",
    shortName: "CMRIT",
    city: "bengaluru",
    address: "Whitefield, Bengaluru, Karnataka 560037",
    lat: 12.9856,
    lng: 77.7366,
    intro:
      "CMRIT students in Whitefield often need assignment print, project report print, and placement CV print — see verified xerox shops near the CMRIT campus.",
    keywords: [
      "print near cmrit",
      "cmr institute assignment printing",
      "xerox shop whitefield",
      "placement cv print cmrit",
    ],
    presence: "planned",
    lastReviewed: "2026-08-07",
  },
];

export default colleges;
