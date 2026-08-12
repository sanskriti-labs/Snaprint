import { faqTails } from "./faq-tails";

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
// City-specific — augment sharedFaqs with a per-city tail. Tails live in
// content/pseo/faq-tails/city-{slug}.json, compiled to faq-tails.ts by
// scripts/build-faq-tails-ts.mjs — see that script for the source-of-truth
// convention (mirrors content/pseo/bodies/*.md → bodies.ts).
// ---------------------------------------------------------------------------

export function getCityFaqs(citySlug: string): Faq[] {
  return [...sharedFaqs, ...(faqTails[`city-${citySlug}`] ?? [])];
}

// ---------------------------------------------------------------------------
// Location-specific (college / area) — augment sharedFaqs with a local tail.
// Tails live in content/pseo/faq-tails/{kind}-{slug}.json; kind is required
// so an area and a college that happen to share a slug never merge tails.
// ---------------------------------------------------------------------------

export function getLocationFaqs(
  kind: "area" | "college",
  entitySlug: string
): Faq[] {
  return [...sharedFaqs, ...(faqTails[`${kind}-${entitySlug}`] ?? [])];
}
