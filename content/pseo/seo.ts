import citiesData from "./cities";
import collegesData from "./colleges";
import areasData from "./areas";
import type { City, College, Area, Slug, Presence } from "./types";
import { getCityFaqs, getLocationFaqs } from "./faqs";
import type { Faq } from "./faqs";
import { getShopsNearCollege, getShopsInCity } from "./shops";

export type { City, College, Area };
export { getCityFaqs, getLocationFaqs };
export type { Faq };

// Re-exported so the page render path can import everything from "@/content/pseo/seo".
export { getShopsNearCollege, getShopsInCity } from "./shops";

// ---------------------------------------------------------------------------
// Published selectors (used by sitemap, generateStaticParams)
//
// "live" = kiosk physically present. "served" = no kiosk yet, but we publish
// the page anyway on the strength of aggregated GMaps shop data (the pSEO
// directory-first strategy — build topical authority now, the kiosk follows
// later). Both are published; "planned" is not. Kiosk-specific rendering
// (JSON-LD hasOfferCatalog/geo/telephone) stays gated on liveLocations
// directly, not on presence.
// ---------------------------------------------------------------------------

function isPublished(presence: Presence): boolean {
  return presence === "live" || presence === "served";
}

// ---------------------------------------------------------------------------
// Shared keyword tail — appended to every entity's hand-picked keywords.
// Covers high-intent directory searches ("open now", "A4 printout") that
// aren't worth hand-writing per entity. Kiosk/self-service terms stay out
// until kiosks are actually live in that entity — see the "directory-first"
// note above.
// ---------------------------------------------------------------------------

const sharedKeywordTail = [
  "xerox near me open now",
  "A4 printout near me",
  "PDF printing near me",
];

export function withSharedKeywords(keywords: string[]): string[] {
  return [...keywords, ...sharedKeywordTail];
}

export function getAllCitySlugs(): Slug[] {
  return citiesData
    .filter((c) => isPublished(c.presence))
    .map((c) => c.slug);
}

export function getAllCollegeSlugs(): Slug[] {
  return collegesData
    .filter((c) => isPublished(c.presence))
    .map((c) => c.slug);
}

export function getAllAreaSlugs(): Slug[] {
  return areasData
    .filter((a) => isPublished(a.presence))
    .map((a) => a.slug);
}

// ---------------------------------------------------------------------------
// Getters — throws if slug not found; returns null if presence gates apply
// ---------------------------------------------------------------------------

export function getCity(slug: Slug): City | null {
  const c = citiesData.find((c) => c.slug === slug);
  if (!c) return null;
  if (!isPublished(c.presence)) return null;
  // Guard rail: a published city should have shops rolled up from at least
  // one of its areas (see getShopsInCity). Warn, don't throw: the operator
  // may be launching the city hub ahead of the area pages going live.
  if (getShopsInCity(c.slug).length === 0) {
    console.warn(
      `[pseo] city "${c.slug}" is published but has 0 shops across its areas. ` +
        `Verify area data or set presence: "planned".`
    );
  }
  return c;
}

/**
 * Display name for a city slug, regardless of presence.
 *
 * getCity() gates on presence: "live", so it returns null for a city that
 * is still planned — which is every city today. Page titles and JSON-LD
 * still need to render "Bengaluru", not the raw slug "bengaluru", so this
 * resolves the name independently of launch status. Falls back to
 * title-casing the slug for a city not yet in cities.ts.
 */
export function getCityName(slug: Slug): string {
  const c = citiesData.find((c) => c.slug === slug);
  if (c) return c.name;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** State/region for a city slug, regardless of presence. Falls back to "" for an unknown slug. */
export function getCityState(slug: Slug): string {
  const c = citiesData.find((c) => c.slug === slug);
  return c?.state ?? "";
}

export function getCollege(slug: Slug): College | null {
  const c = collegesData.find((c) => c.slug === slug);
  if (!c) return null;
  if (!isPublished(c.presence)) return null;
  // Guard rail: a live college must have at least one shop in 1.5 km radius
  // (city-wide shop index — not the area-keyword match). Warn, don't throw:
  // the operator may be flipping presence in advance of a launch announcement.
  if (c.lat != null && c.lng != null) {
    const nearby = getShopsNearCollege(c.slug);
    if (nearby.length === 0) {
      console.warn(
        `[pseo] college "${c.slug}" is live but has 0 shops within 1.5 km radius. ` +
          `Verify shop data or set presence: "planned".`
      );
    }
  }
  return c;
}

export function getArea(slug: Slug): Area | null {
  const a = areasData.find((a) => a.slug === slug);
  if (!a) return null;
  if (isPublished(a.presence)) return a;
  return null;
}

// ---------------------------------------------------------------------------
// Cross-link helpers
// ---------------------------------------------------------------------------

export function getCollegesInCity(citySlug: Slug): College[] {
  return collegesData.filter(
    (c) => c.city === citySlug && isPublished(c.presence)
  );
}

export function getAreasInCity(citySlug: Slug): Area[] {
  return areasData.filter(
    (a) => a.city === citySlug && isPublished(a.presence)
  );
}

export function getCollegesNearArea(areaSlug: Slug): College[] {
  return collegesData.filter(
    (c) => c.area === areaSlug && isPublished(c.presence)
  );
}

export function getNeighborCities(citySlug: Slug): City[] {
  const city = citiesData.find((c) => c.slug === citySlug);
  if (!city?.neighbors) return [];
  return citiesData.filter(
    (c) => city.neighbors!.includes(c.slug) && isPublished(c.presence)
  );
}

// ---------------------------------------------------------------------------
// Structured data — BreadcrumbList
// ---------------------------------------------------------------------------

type BreadcrumbHub = { name: string; path: string };

/**
 * Builds a schema.org BreadcrumbList for an entity page. Inserts the parent
 * city as its own crumb only when that city actually resolves via getCity()
 * (i.e. is itself published) — a college/area under a still-`planned` city
 * (Bengaluru today) keeps the shorter Home > Hub > Entity trail instead of
 * linking to a page that would 404. Once that city ships, every one of its
 * entity pages picks up the extra crumb automatically, no per-page edits.
 */
export function buildBreadcrumbList(
  siteUrl: string,
  hub: BreadcrumbHub,
  entity: { name: string; path: string },
  parentCitySlug?: Slug
) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: hub.name, item: `${siteUrl}${hub.path}` },
  ];
  const parentCity = parentCitySlug ? getCity(parentCitySlug) : null;
  if (parentCity) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: parentCity.name,
      item: `${siteUrl}/instant-print/${parentCity.slug}`,
    });
  }
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: entity.name,
    item: `${siteUrl}${entity.path}`,
  });
  return { "@type": "BreadcrumbList", itemListElement: items };
}

// ---------------------------------------------------------------------------
// All published entities (used by Phase 2 index pages)
// ---------------------------------------------------------------------------

export function getAllLiveCities(): City[] {
  return citiesData.filter((c) => isPublished(c.presence));
}

export function getAllLiveColleges(): College[] {
  return collegesData.filter((c) => isPublished(c.presence));
}

export function getAllLiveAreas(): Area[] {
  return areasData.filter((a) => isPublished(a.presence));
}
