import { faqTails } from "./faq-tails";
import type { Presence } from "./types";

export type Faq = { q: string; a: string };

// ---------------------------------------------------------------------------
// Directory FAQs — true today on every published page, live kiosk or not.
// Snaprint's current product is a directory of listed third-party xerox
// shops; these answers describe that, not a kiosk that may not exist yet
// at this entity.
// ---------------------------------------------------------------------------

const directoryFaqs: Faq[] = [
  {
    q: "How does Snaprint decide which shops to list?",
    a:
      "Each listing is checked against Google Maps data — address, phone number, ratings, and reported hours — so you're not walking to a shop that's closed or no longer there.",
  },
  {
    q: "What file formats can these shops print?",
    a:
      "Most listed shops accept PDF, DOCX, DOC, JPG, PNG, and WEBP, either from a USB drive, email, or WhatsApp. Formats vary by shop — call ahead to confirm for unusual file types.",
  },
  {
    q: "What are the typical print rates?",
    a:
      "Rates vary by shop and city, but B&W prints commonly start around ₹2–3 per page, with colour prints priced higher. Each shop sets its own rates.",
  },
  {
    q: "Are these shops open now?",
    a:
      "Listed hours are sourced from Google Maps and can change without notice — call ahead if you're relying on a specific shop being open, especially late at night or on holidays.",
  },
];

// ---------------------------------------------------------------------------
// Kiosk FAQs — only true where a Snaprint kiosk is physically live. Gated
// on presence === "live" so a directory-only page never claims a kiosk
// (QR scan, on-device file deletion, etc.) that isn't actually there.
// ---------------------------------------------------------------------------

const kioskFaqs: Faq[] = [
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
    q: "How fast can I get my print?",
    a:
      "Most print jobs are ready in under 60 seconds from scan to paper in hand. Larger files (50+ pages) may take slightly longer.",
  },
  {
    q: "Is my document safe?",
    a:
      "Files are end-to-end encrypted and automatically deleted from the kiosk immediately after your print job is complete. No document is stored on the device.",
  },
];

function isLive(presence: Presence): boolean {
  return presence === "live";
}

// ---------------------------------------------------------------------------
// City-specific — augment the base FAQ set with a per-city tail. Tails live
// in content/pseo/faq-tails/city-{slug}.json, compiled to faq-tails.ts by
// scripts/build-faq-tails-ts.mjs — see that script for the source-of-truth
// convention (mirrors content/pseo/bodies/*.md → bodies.ts).
// ---------------------------------------------------------------------------

export function getCityFaqs(citySlug: string, presence: Presence): Faq[] {
  return [
    ...directoryFaqs,
    ...(isLive(presence) ? kioskFaqs : []),
    ...(faqTails[`city-${citySlug}`] ?? []),
  ];
}

// ---------------------------------------------------------------------------
// Location-specific (college / area) — augment the base FAQ set with a
// local tail. Tails live in content/pseo/faq-tails/{kind}-{slug}.json; kind
// is required so an area and a college that happen to share a slug never
// merge tails.
// ---------------------------------------------------------------------------

export function getLocationFaqs(
  kind: "area" | "college",
  entitySlug: string,
  presence: Presence
): Faq[] {
  return [
    ...directoryFaqs,
    ...(isLive(presence) ? kioskFaqs : []),
    ...(faqTails[`${kind}-${entitySlug}`] ?? []),
  ];
}

// sharedFaqs kept as an alias to directoryFaqs — some callers only need a
// length baseline for non-live entities (see baseFaqCount for the
// presence-aware version, needed once kioskFaqs are added conditionally).
export const sharedFaqs = directoryFaqs;

// Boilerplate FAQ count for a given presence — the JSON-LD "does this page
// have a unique local tail beyond boilerplate" gate compares against this,
// not the flat sharedFaqs.length, since live entities also get kioskFaqs.
export function baseFaqCount(presence: Presence): number {
  return directoryFaqs.length + (isLive(presence) ? kioskFaqs.length : 0);
}
