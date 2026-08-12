// City-wide shop index, loaded once at module init from the same JSONL
// the Python pipeline (scripts/scraper/process_77areas.py) consumes.
// Adds a haversine-based "shops near college" selector that complements
// the area-keyword match used by Area.liveLocations.
//
// Field normalisation mirrors process_77areas.py:to_live_location —
// latitude/longitude → lat/lng, title → name, place_id → placeId.
//
// IMPORTANT: this module is server-only. The build / SSR path resolves
// it; client components must not import it.

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { haversineKm } from "./_geo";
import type { LiveLocation, Slug } from "./types";

// ---------------------------------------------------------------------------
// Shop index — lazily loaded and cached on first access. The JSONL files
// live outside the Next.js app tree, so we resolve relative to repo root.
//
// Loads every scripts/scraper/data/shops-clean*.jsonl file (one per city:
// shops-clean.jsonl for Bengaluru, shops-clean-hyderabad.jsonl, etc.) —
// college radius matching is city-agnostic by campus coordinates, so it
// must see every city's shops, not just one. Falls back to the raw
// Bengaluru scrape for builds run before the cleaner has been executed.
// ---------------------------------------------------------------------------

let _shops: LiveLocation[] | null = null;

function findDataDir(): string | null {
  const candidates = [
    resolve(process.cwd(), "scripts/scraper/data"),
    resolve(__dirname, "../../../scripts/scraper/data"),
    resolve(__dirname, "../../scripts/scraper/data"),
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

function parseShopLine(trimmed: string): LiveLocation | null {
  try {
    const rec = JSON.parse(trimmed);
    // Detect the shape from the record itself rather than the filename.
    // Cleaned records use lat/lng; the raw scrape uses latitude/longitude.
    // `longtitude` is a misspelled duplicate of `longitude` in the raw
    // scrape — a longitude fallback only, never a latitude one.
    const lat = Number(rec.lat ?? rec.latitude ?? 0);
    const lng = Number(rec.lng ?? rec.longitude ?? rec.longtitude ?? 0);
    if (!lat || !lng) return null;
    const name =
      typeof (rec.name ?? rec.title) === "string" && (rec.name ?? rec.title).trim()
        ? (rec.name ?? rec.title).trim().slice(0, 80)
        : "Xerox Shop";
    return {
      name,
      address: typeof rec.address === "string" ? rec.address.slice(0, 200) : "",
      lat: Math.round(lat * 1e6) / 1e6,
      lng: Math.round(lng * 1e6) / 1e6,
      phone: rec.phone || undefined,
      rating: typeof rec.rating === "number" ? rec.rating : undefined,
      reviews: typeof rec.reviews === "number" ? rec.reviews : 0,
      placeId: rec.placeId || undefined,
    };
  } catch {
    return null;
  }
}

function loadShops(): LiveLocation[] {
  if (_shops) return _shops;

  const dataDir = findDataDir();
  // shops-llm-verified.jsonl is deliberately NOT consulted. That audit
  // returned keep:true for all 1138 records, so it filtered nothing.
  const cleanFiles = dataDir
    ? readdirSync(dataDir).filter((f) => /^shops-clean.*\.jsonl$/.test(f))
    : [];

  const paths = cleanFiles.length > 0
    ? cleanFiles.map((f) => resolve(dataDir!, f))
    : // Raw scrape (fallback) — builds run before the cleaner has been executed.
      [
        resolve(process.cwd(), "scripts/scraper/data/results-77areas.json"),
        resolve(__dirname, "../../../scripts/scraper/data/results-77areas.json"),
        resolve(__dirname, "../../scripts/scraper/data/results-77areas.json"),
      ].filter((p) => existsSync(p)).slice(0, 1);

  if (paths.length === 0) {
    // Build/test runs without the scraper data should not crash —
    // selectors simply return []. Log a single warning.
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        "[pseo/shops] shop data not found; college radius selector will return []."
      );
    }
    _shops = [];
    return _shops;
  }

  const out: LiveLocation[] = [];
  for (const path of paths) {
    const text = readFileSync(path, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const shop = parseShopLine(trimmed);
      if (shop) out.push(shop);
    }
  }
  _shops = out;
  return _shops;
}

// ---------------------------------------------------------------------------
// Selector
// ---------------------------------------------------------------------------

import collegesData from "./colleges";
import areasData from "./areas";

/**
 * Returns all xerox shops within `radiusKm` of the college's campus
 * location, sorted by distance ascending. Returns [] if the college
 * has no lat/lng or is not in the data set.
 */
export function getShopsNearCollege(
  collegeSlug: Slug,
  radiusKm = 1.5
): LiveLocation[] {
  const college = collegesData.find((c) => c.slug === collegeSlug);
  if (!college || college.lat == null || college.lng == null) return [];

  const origin = { lat: college.lat, lng: college.lng };
  const shops = loadShops();
  const out: Array<LiveLocation & { __d: number }> = [];
  for (const s of shops) {
    if (s.lat == null || s.lng == null) continue;
    const d = haversineKm(origin, { lat: s.lat, lng: s.lng });
    if (d <= radiusKm) out.push(Object.assign({}, s, { __d: d }));
  }
  out.sort((a, b) => a.__d - b.__d);
  // Strip the ephemeral __d field before returning so callers see the
  // typed LiveLocation shape.
  return out.map(({ __d, ...rest }) => rest);
}

/**
 * Rolls up shops for a city page from its published areas' liveLocations —
 * the same per-area data the scraper pipeline (process_areas.py) already
 * populates, so a new city gets Maps links for free as soon as its areas
 * do, no separate city-level scrape needed. Deduped by placeId (falls back
 * to name+address for records without one), sorted by rating desc, capped
 * so the city page doesn't render hundreds of cards.
 */
export function getShopsInCity(citySlug: Slug, limit = 24): LiveLocation[] {
  const areas = areasData.filter(
    (a) =>
      a.city === citySlug &&
      (a.presence === "live" || a.presence === "served")
  );
  const seen = new Set<string>();
  const out: LiveLocation[] = [];
  for (const area of areas) {
    for (const shop of area.liveLocations ?? []) {
      const key = shop.placeId ?? `${shop.name}|${shop.address}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(shop);
    }
  }
  out.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return out.slice(0, limit);
}

/**
 * Test-only helper: clears the module-level shop cache so a fresh
 * load happens on next access. Intentionally not exported in the
 * public barrel.
 */
export function __resetShopsForTests(): void {
  _shops = null;
}
