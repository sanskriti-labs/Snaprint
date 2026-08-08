export type Faq = { q: string; a: string };

// ---------------------------------------------------------------------------
// Shared — appears on every city / college / area page
// ---------------------------------------------------------------------------

export const sharedFaqs: Faq[] = [
  {
    q: "Does the Snaprint kiosk work with my existing printer?",
    a:
      "Yes. The Snaprint S1 works with any printer brand — Canon, HP, Epson, Brother — so the host shop does not need to replace their current equipment.",
  },
  {
    q: "Can I print from my phone without installing an app?",
    a:
      "Yes. You scan the QR code on the kiosk screen with any phone camera, select your file, and pay via any UPI app. No app download, no account creation, no USB cable needed.",
  },
  {
    q: "What file formats are supported?",
    a:
      "PDF, DOCX, DOC, JPG, PNG, and WEBP. The system handles multi-page documents, single or double-sided, colour or black & white.",
  },
  {
    q: "How fast can I get my print?",
    a:
      "Most print jobs are ready in under 60 seconds from scan to paper in hand. Larger files (50+ pages) may take slightly longer.",
  },
  {
    q: "Is my document safe?",
    a:
      "Files are end-to-end encrypted and automatically deleted from the kiosk immediately after your print job is complete. No document is stored on the device.",
  },
  {
    q: "What are the typical print rates?",
    a:
      "The host shop owner sets their own per-page rates. You see the exact cost on screen before you confirm payment — no hidden charges.",
  },
];

// ---------------------------------------------------------------------------
// City-specific — augment sharedFaqs with a per-city tail
// ---------------------------------------------------------------------------

export function getCityFaqs(citySlug: string): Faq[] {
  const tails: Record<string, Faq[]> = {
    bengaluru: [
      {
        q: "Is there a Snaprint kiosk near my college in Bengaluru?",
        a:
          "We are actively expanding across Bengaluru. If there isn't a kiosk near your college yet, you can still find a Snaprint-enabled shop near Koramangala, Indiranagar, or Whitefield today.",
      },
    ],
  };
  return [...sharedFaqs, ...(tails[citySlug] ?? [])];
}

// ---------------------------------------------------------------------------
// Location-specific (college / area) — augment sharedFaqs with a local tail
// ---------------------------------------------------------------------------

export function getLocationFaqs(
  entitySlug: string,
  parentCity: string
): Faq[] {
  const tails: Record<string, Faq[]> = {
    "iisc-bangalore": [
      {
        q: "Is there a Snaprint kiosk near IISc?",
        a:
          "We are deploying kiosks near IISc on CV Raman Avenue. Enter your print details on the kiosk screen to get started — no app needed.",
      },
    ],
    "rvce-bengaluru": [
      {
        q: "Is there a Snaprint kiosk near RVCE on Mysore Road?",
        a:
          "We are expanding near RVCE on Mysore Road. Kiosks accept prints paid via UPI — GPay, PhonePe, Paytm, or any app.",
      },
    ],
    "pes-university-ec-campus": [
      {
        q: "Is there a Snaprint kiosk near PES University Electronic City?",
        a:
          "Kiosk deployment near PESU Electronic City is underway. You will find Snaprint-enabled shops in the Electronic City campus area.",
      },
    ],
    "christ-university-central-campus": [
      {
        q: "Is there a Snaprint kiosk near Christ University?",
        a:
          "We are expanding near Christ University on Hosur Road. Until a kiosk is near your campus, the nearest Snaprint-enabled shop is in the Koramangala or Bannimantha area.",
      },
    ],
    "nitte-meenakshi-bangalore": [
      {
        q: "Is there a Snaprint kiosk near NMIT Yelahanka?",
        a:
          "Kiosk deployment near NMIT in Yelahanka is in progress. You can find a Snaprint-enabled shop in the Yelahanka locality while we expand.",
      },
    ],
    koramangala: [
      {
        q: "Where is the nearest Snaprint kiosk in Koramangala?",
        a:
          "Snaprint kiosks are being deployed across Koramangala. Check back soon — use the kiosk locator or contact us at snaprints@sanskritilabs.in for the nearest live location.",
      },
    ],
    indiranagar: [
      {
        q: "Where is the nearest Snaprint kiosk in Indiranagar?",
        a:
          "We are actively deploying kiosks in Indiranagar. The nearest live Snaprint-enabled shop is in the Koramangala area while we expand.",
      },
    ],
    whitefield: [
      {
        q: "Is there a Snaprint kiosk near Whitefield / ITPL?",
        a:
          "Snaprint kiosks are coming to Whitefield and the ITPL corridor. Contact snaprints@sanskritilabs.in for the nearest live location today.",
      },
    ],
    "hsr-layout": [
      {
        q: "Is there a Snaprint kiosk in HSR Layout?",
        a:
          "We are expanding into HSR Layout. Until a kiosk is live nearby, the nearest Snaprint-enabled shop is in Electronic City or Koramangala.",
      },
    ],
    "electronic-city": [
      {
        q: "Is there a Snaprint kiosk in Electronic City?",
        a:
          "Snaprint kiosks are coming to Electronic City Phase 1 and Phase 2. For the nearest live location, reach out to snaprints@sanskritilabs.in.",
      },
    ],
  };
  return [...sharedFaqs, ...(tails[entitySlug] ?? [])];
}
