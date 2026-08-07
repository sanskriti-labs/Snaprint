import citiesData from "./cities";
import collegesData from "./colleges";
import areasData from "./areas";
import type { City, College, Area, Slug } from "./types";
import { getCityFaqs, getLocationFaqs } from "./faqs";
import type { Faq } from "./faqs";
import { getShopsNearCollege } from "./shops";

export type { City, College, Area };
export { getCityFaqs, getLocationFaqs };
export type { Faq };

// Re-exported so the page render path can import everything from "@/content/pseo/seo".
export { getShopsNearCollege } from "./shops";

// ---------------------------------------------------------------------------
// Live-only selectors (used by sitemap, generateStaticParams)
// ---------------------------------------------------------------------------

export function getAllCitySlugs(): Slug[] {
  return citiesData
    .filter((c) => c.presence === "live")
    .map((c) => c.slug);
}

export function getAllCollegeSlugs(): Slug[] {
  return collegesData
    .filter((c) => c.presence === "live")
    .map((c) => c.slug);
}

export function getAllAreaSlugs(): Slug[] {
  return areasData
    .filter((a) => a.presence === "live")
    .map((a) => a.slug);
}

// ---------------------------------------------------------------------------
// Getters — throws if slug not found; returns null if presence gates apply
// ---------------------------------------------------------------------------

export function getCity(slug: Slug): City | null {
  const c = citiesData.find((c) => c.slug === slug);
  if (!c) return null;
  if (c.presence === "live") return c;
  return null;
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

export function getCollege(slug: Slug): College | null {
  const c = collegesData.find((c) => c.slug === slug);
  if (!c) return null;
  if (c.presence !== "live") return null;
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
  if (a.presence === "live") return a;
  return null;
}

// ---------------------------------------------------------------------------
// Cross-link helpers
// ---------------------------------------------------------------------------

export function getCollegesInCity(citySlug: Slug): College[] {
  return collegesData.filter(
    (c) => c.city === citySlug && c.presence === "live"
  );
}

export function getAreasInCity(citySlug: Slug): Area[] {
  return areasData.filter(
    (a) => a.city === citySlug && a.presence === "live"
  );
}

/** Returns ALL areas in a city regardless of presence — used by hub pages */
export function getAllAreasInCity(citySlug: Slug): Area[] {
  return areasData.filter((a) => a.city === citySlug);
}

export function getCollegesNearArea(areaSlug: Slug): College[] {
  return collegesData.filter(
    (c) => c.area === areaSlug && c.presence === "live"
  );
}

export function getNeighborCities(citySlug: Slug): City[] {
  const city = citiesData.find((c) => c.slug === citySlug);
  if (!city?.neighbors) return [];
  return citiesData.filter(
    (c) => city.neighbors!.includes(c.slug) && c.presence === "live"
  );
}

// ---------------------------------------------------------------------------
// All live entities (used by Phase 2 index pages)
// ---------------------------------------------------------------------------

export function getAllLiveCities(): City[] {
  return citiesData.filter((c) => c.presence === "live");
}

export function getAllLiveColleges(): College[] {
  return collegesData.filter((c) => c.presence === "live");
}

export function getAllLiveAreas(): Area[] {
  return areasData.filter((a) => a.presence === "live");
}
