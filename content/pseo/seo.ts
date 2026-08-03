import citiesData from "./cities";
import collegesData from "./colleges";
import areasData from "./areas";
import type { City, College, Area, Slug } from "./types";
import { getCityFaqs, getLocationFaqs } from "./faqs";
import type { Faq } from "./faqs";

export type { City, College, Area };
export { getCityFaqs, getLocationFaqs };
export type { Faq };

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

export function getCollege(slug: Slug): College | null {
  const c = collegesData.find((c) => c.slug === slug);
  if (!c) return null;
  if (c.presence === "live") return c;
  return null;
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
