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

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { haversineKm } from "./_geo";
import type { LiveLocation, Slug } from "./types";

// ---------------------------------------------------------------------------
// Shop index — lazily loaded and cached on first access. The JSONL file
// lives outside the Next.js app tree, so we resolve relative to repo root.
//
// Prefers scripts/scraper/data/shops-clean.jsonl (output of
// scripts/clean/clean_shops.py — xerox-only, deduped). Falls back to
// the raw scrape for builds run before the cleaner has been executed.
// ---------------------------------------------------------------------------

let _shops: LiveLocation[] | null = null;

function loadShops(): LiveLocation[] {
  if (_shops) return _shops;
  // Walk up from this file until we find the repo root that contains the
  // scripts/ directory. process.cwd() works for `next dev` / `next build`
  // when invoked from the project root, which is the documented workflow.
  // Resolution order: heuristic-cleaned > raw.
  //
  // shops-llm-verified.jsonl is deliberately NOT consulted. That audit
  // returned keep:true for all 1138 records, so it filtered nothing, and
  // because the `isCleaned` branch below keys off the "shops-clean.jsonl"
  // filename, loading it parsed cleaned records with raw field names —
  // every row failed the lat/lng check and the selector silently returned
  // []. clean_shops.py output is the single source of truth here, matching
  // scripts/scraper/process_77areas.py.
  const candidates = [
    // Heuristic-cleaned
    resolve(process.cwd(), "scripts/scraper/data/shops-clean.jsonl"),
    resolve(__dirname, "../../../scripts/scraper/data/shops-clean.jsonl"),
    resolve(__dirname, "../../scripts/scraper/data/shops-clean.jsonl"),
    // Raw scrape (fallback)
    resolve(process.cwd(), "scripts/scraper/data/results-77areas.json"),
    resolve(__dirname, "../../../scripts/scraper/data/results-77areas.json"),
    resolve(__dirname, "../../scripts/scraper/data/results-77areas.json"),
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
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

  const text = readFileSync(found, "utf8");
  const out: LiveLocation[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const rec = JSON.parse(trimmed);
      // Detect the shape from the record itself rather than the filename.
      // Cleaned records use lat/lng; the raw scrape uses latitude/longitude.
      // A filename check silently mis-parsed any cleaned file that wasn't
      // literally named shops-clean.jsonl, yielding zero shops.
      // `longtitude` is a misspelled duplicate of `longitude` in the raw
      // scrape — a longitude fallback only, never a latitude one.
      const lat = Number(rec.lat ?? rec.latitude ?? 0);
      const lng = Number(rec.lng ?? rec.longitude ?? rec.longtitude ?? 0);
      if (!lat || !lng) continue;
      const name =
        typeof (rec.name ?? rec.title) === "string" && (rec.name ?? rec.title).trim()
          ? (rec.name ?? rec.title).trim().slice(0, 80)
          : "Xerox Shop";
      out.push({
        name,
        address: typeof rec.address === "string" ? rec.address.slice(0, 200) : "",
        lat: Math.round(lat * 1e6) / 1e6,
        lng: Math.round(lng * 1e6) / 1e6,
        phone: rec.phone || undefined,
        rating: typeof rec.rating === "number" ? rec.rating : undefined,
        reviews: typeof rec.reviews === "number" ? rec.reviews : 0,
        placeId: rec.placeId || undefined,
      });
    } catch {
      // skip malformed lines
    }
  }
  _shops = out;
  return _shops;
}

// ---------------------------------------------------------------------------
// Selector
// ---------------------------------------------------------------------------

import collegesData from "./colleges";

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
 * Test-only helper: clears the module-level shop cache so a fresh
 * load happens on next access. Intentionally not exported in the
 * public barrel.
 */
export function __resetShopsForTests(): void {
  _shops = null;
}
