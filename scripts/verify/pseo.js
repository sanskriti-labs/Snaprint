#!/usr/bin/env node
/**
 * PSEO verifier — sanity gate before merge.
 *
 * Run via `pnpm verify:pseo`. Exits non-zero on any failure.
 *
 * Implementation note: this script is plain JS so it can run without
 * a TS runner. It re-implements the haversine + JSONL parse so it
 * doesn't import the typed modules. The trade-off is duplicate logic
 * with content/pseo/shops.ts — both must agree on field normalisation.
 *
 * "Live" throughout this file means published — presence "live" (real
 * kiosk) or "served" (pSEO directory only, no kiosk yet). Both generate
 * real pages; only "planned" 404s. See content/pseo/types.ts.
 *
 * Checks:
 *   1. Every live college has lat & lng.
 *   2. Every live college has ≥ 1 shop within 1.5 km radius.
 *   3. Every live college's intro is ≥ 80 chars.
 *   4. Every live college has ≥ 3 keywords.
 *   5. Every live college's `area` (if set) resolves to a real areas.ts slug.
 *   6. Every live college's `city` resolves to a real cities.ts slug.
 *   7. Total live entities (city + college + area) is non-zero.
 *   8. llms.txt URLs match live college URLs.
 *   9. Sitemap emits the expected college URL count.
 *   10. Every live area's intro-stated shop count matches its actual
 *       liveLocations length (guards against the count/render mismatch
 *       that shipped "30 xerox shops" pages showing 20 listings).
 *   13. No live/served college or area names a city that is itself not
 *       published — that city's cross-links would point back at a hub
 *       that 404s (this is how instant-print/bengaluru linking to
 *       planned areas shipped: the source list wasn't presence-filtered).
 *   17. No live/served college or area names a city slug that has no
 *       matching entry in cities.ts at all (distinct from #13, which only
 *       catches a city that exists but is unpublished).
 *   18. No two live/served areas/colleges share a slug across different
 *       cities — /print-near/[entity] resolves by bare slug (first match
 *       wins), so a collision silently shadows one city's page entirely.
 *   14. layout.tsx's sitewide JSON-LD carries no price/offers field —
 *       that schema renders on every page including PSEO pages, and a
 *       price there leaks into search snippets for unrelated pages
 *       (shipped once: the S1 kiosk price showed up in a snippet for a
 *       "shops near Atria IT" page). Price schema belongs on the page
 *       it's actually about (home), not sitewide.
 */
const { readFileSync, existsSync, readdirSync } = require("node:fs");
const { resolve, join } = require("node:path");

const SITE_URL = "https://snaprints.com";
const INTRO_MIN = 80;
const KEYWORDS_MIN = 3;
const RADIUS_KM = 1.5;

let failures = 0;
const fail = (msg) => { console.error(`[FAIL] ${msg}`); failures++; };
const ok = (msg) => { console.log(`[ OK ] ${msg}`); };

// ---------------------------------------------------------------------------
// Lightweight TS-data extractor. Parses the colleges.ts file by regex
// rather than depending on a TS compiler. Same approach is used in
// scripts/match/colleges_radius.py for symmetry.
// ---------------------------------------------------------------------------
function extractDataBlocks(filePath, key) {
  if (!existsSync(filePath)) return [];
  const text = readFileSync(filePath, "utf8");
  const blocks = text.split("\n  {");
  const out = [];
  for (const block of blocks.slice(1)) {
    const end = block.search(/\n  },?/);
    if (end === -1) continue;
    const body = block.slice(0, end);
    const obj = {};
    const re = /(\w+):\s*(?:"([^"]*)"|'([^']*)'|([\d.]+)|true|false)/g;
    let m;
    while ((m = re.exec(body)) !== null) {
      const k = m[1];
      const v = m[2] ?? m[3] ?? m[4] ?? (m[0].includes("true") ? true : false);
      obj[k] = v;
    }
    if (obj.slug) out.push(obj);
  }
  return out;
}

const repoRoot = process.cwd();
const collegesPath = resolve(repoRoot, "content/pseo/colleges.ts");
const citiesPath = resolve(repoRoot, "content/pseo/cities.ts");
const areasPath = resolve(repoRoot, "content/pseo/areas.ts");
const llmsPath = resolve(repoRoot, "public/llms.txt");
// Prefer the LLM-verified shop file (highest precision) when present.
// Otherwise load every scripts/scraper/data/shops-clean*.jsonl file (one
// per city), falling back to the raw Bengaluru scrape. The verifier
// resolves the same way content/pseo/shops.ts does.
const shopsLlmPath = resolve(repoRoot, "scripts/clean/data/shops-llm-verified.jsonl");
const shopsDataDir = resolve(repoRoot, "scripts/scraper/data");
const shopsRawPath = resolve(repoRoot, "scripts/scraper/data/results-77areas.json");

// "live" or "served" — both are published; only "planned" 404s.
const isLive = (presence) => presence === "live" || presence === "served";

const colleges = extractDataBlocks(collegesPath).filter((c) => isLive(c.presence));
const cities = extractDataBlocks(citiesPath);  // all cities, not just live — a college can point to a planned city
const liveCities = cities.filter((c) => isLive(c.presence));
const areas = extractDataBlocks(areasPath).filter((a) => isLive(a.presence));

// ---------------------------------------------------------------------------
// Geographic distance (haversine). Mirrors content/pseo/_geo.ts formula.
// ---------------------------------------------------------------------------
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Load shop index from JSONL — same source(s) as content/pseo/shops.ts.
function loadShopsFromFile(path, isCleaned) {
  const text = readFileSync(path, "utf8");
  const out = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const rec = JSON.parse(trimmed);
      const lat = isCleaned ? Number(rec.lat ?? 0) : Number(rec.latitude ?? 0);
      const lng = isCleaned ? Number(rec.lng ?? 0) : Number(rec.longitude ?? 0);
      if (!lat || !lng) continue;
      out.push({ lat: Math.round(lat * 1e6) / 1e6, lng: Math.round(lng * 1e6) / 1e6 });
    } catch {}
  }
  return out;
}

function loadShops() {
  // shops-llm-verified.jsonl only ever covered Bengaluru (1134 records,
  // lat 12.7-13.1) — using it exclusively silently dropped every other
  // city's shops from radius checks the moment a second city's colleges
  // went live. Prefer it for Bengaluru specifically, since it's a
  // stricter audit than the heuristic cleaner, but still load every
  // other city's shops-clean*.jsonl alongside it.
  const cleanFiles = existsSync(shopsDataDir)
    ? readdirSync(shopsDataDir).filter((f) => /^shops-clean.*\.jsonl$/.test(f))
    : [];
  const otherCityFiles = cleanFiles.filter((f) => f !== "shops-clean.jsonl");

  if (existsSync(shopsLlmPath)) {
    return [
      ...loadShopsFromFile(shopsLlmPath, true),
      ...otherCityFiles.flatMap((f) => loadShopsFromFile(resolve(shopsDataDir, f), true)),
    ];
  }
  if (cleanFiles.length > 0) {
    return cleanFiles.flatMap((f) => loadShopsFromFile(resolve(shopsDataDir, f), true));
  }
  if (existsSync(shopsRawPath)) {
    return loadShopsFromFile(shopsRawPath, false);
  }
  console.warn(`[pseo] no shop JSONL found under ${shopsDataDir}; radius check will be skipped`);
  return [];
}

const shops = loadShops();
ok(`loaded ${shops.length} shops with coords from JSONL`);

// ---------------------------------------------------------------------------
// 1-2: live colleges have coords + shops in radius
// ---------------------------------------------------------------------------
if (colleges.length === 0) {
  ok("no live colleges yet — promoting any college requires manual review");
} else {
  for (const c of colleges) {
    const lat = Number(c.lat);
    const lng = Number(c.lng);
    if (!lat || !lng) {
      fail(`live college "${c.slug}" missing lat/lng`);
      continue;
    }
    const origin = { lat, lng };
    const matched = shops.filter((s) => haversineKm(origin, s) <= RADIUS_KM);
    if (matched.length === 0) {
      fail(`live college "${c.slug}" has 0 shops within ${RADIUS_KM} km`);
    } else {
      ok(`live college "${c.slug}" has ${matched.length} shops within ${RADIUS_KM} km`);
    }
  }
}

// ---------------------------------------------------------------------------
// 3-4: content quality
// ---------------------------------------------------------------------------
for (const c of colleges) {
  const intro = typeof c.intro === "string" ? c.intro : "";
  if (intro.length < INTRO_MIN) {
    fail(`live college "${c.slug}" intro < ${INTRO_MIN} chars (${intro.length})`);
  }
  // keywords is an array literal — fall back to length extraction.
  const blockMatch = readFileSync(collegesPath, "utf8").match(new RegExp(`slug:\\s*"${c.slug}"[\\s\\S]*?keywords:\\s*\\[([^\\]]+)\\]`));
  const kwCount = blockMatch ? blockMatch[1].split(",").length : 0;
  if (kwCount < KEYWORDS_MIN) {
    fail(`live college "${c.slug}" has < ${KEYWORDS_MIN} keywords (${kwCount})`);
  }
}

// ---------------------------------------------------------------------------
// 5-6: cross-slug validation
// ---------------------------------------------------------------------------
const citySlugs = new Set(cities.map((c) => c.slug));
const areaSlugs = new Set(areas.map((a) => a.slug));
for (const c of colleges) {
  if (!citySlugs.has(c.city)) {
    fail(`live college "${c.slug}" city "${c.city}" not in cities.ts`);
  }
  if (c.area && !areaSlugs.has(c.area)) {
    fail(`live college "${c.slug}" area "${c.area}" not in areas.ts`);
  }
  if (!c.verifiedAt) {
    fail(`live college "${c.slug}" missing verifiedAt field`);
  }
}
ok("cross-slug validation complete");

// ---------------------------------------------------------------------------
// 13: every getter in content/pseo/seo.ts that feeds a cross-link component
// (PseoCrossLinks / instant-print hub) must presence-filter its output.
//
// Regression this guards: instant-print/[city] once called
// getAllAreasInCity(), which returned areas "regardless of presence" (its
// own doc comment said so) — so the city hub linked to planned, zero-shop
// areas that 404 (e.g. /print-near/avenue-road). The fix was routing it
// through the already-filtered getAreasInCity(). This check greps seo.ts's
// cross-link helpers (used by PseoCrossLinks / hub pages) and fails if any
// of them filters on a wider condition than isLive, or doesn't filter by
// presence at all.
// ---------------------------------------------------------------------------
const seoTsPath = resolve(repoRoot, "content/pseo/seo.ts");
const CROSS_LINK_GETTERS = ["getCollegesInCity", "getAreasInCity", "getCollegesNearArea", "getNeighborCities"];
if (existsSync(seoTsPath)) {
  const seoTs = readFileSync(seoTsPath, "utf8");
  let unfiltered = 0;
  for (const name of CROSS_LINK_GETTERS) {
    const m = seoTs.match(new RegExp(`export function ${name}\\([^)]*\\)[^{]*\\{([\\s\\S]*?)\\n\\}`));
    if (!m) {
      fail(`cross-link getter "${name}" not found in seo.ts — was it renamed? Update this check too.`);
      unfiltered++;
      continue;
    }
    if (!/isPublished\(/.test(m[1])) {
      fail(`cross-link getter "${name}" in seo.ts doesn't call isPublished() — it may leak links to planned (404) pages`);
      unfiltered++;
    }
  }
  // Any *other* exported getter whose name suggests "all X" and takes no
  // presence filter is a landmine for the next hub page that calls it.
  const suspicious = Array.from(seoTs.matchAll(/export function (getAll\w*In\w+)\(/g)).map((m) => m[1]);
  for (const name of suspicious) {
    fail(`seo.ts exports "${name}" — an unfiltered "all entities in X" getter is how the dead-link bug shipped before (getAllAreasInCity). Route callers through the presence-filtered getter instead, and delete this one.`);
    unfiltered++;
  }
  if (unfiltered === 0) {
    ok(`all ${CROSS_LINK_GETTERS.length} cross-link getters in seo.ts are presence-filtered, no unfiltered "getAll*In*" getters present`);
  }
} else {
  fail("content/pseo/seo.ts not found");
}

// ---------------------------------------------------------------------------
// 17: every live/served area/college's `city` slug must have a matching
// entry in cities.ts — not just a *published* one (that's #13's job), but
// *any* entry at all.
//
// Regression this guards: the scraper (scripts/scraper/process_areas.py)
// writes `city: "${cfg.CITY_SLUG}"` into every area it generates, driven by
// CITY_SLUG in scripts/scraper/cities/<city>.py — it never touches
// cities.ts. On 2026-08-14 this shipped 48 live/served areas across 4 new
// cities (Chennai, Mumbai, Pune, Delhi NCR) whose city slug had no matching
// cities.ts entry at all. Every existing check passed: #6/#13 only check
// colleges and only catch a city that's *present but unpublished* —
// getCity(slug) returning undefined is a different failure and fails
// silently, not loudly. Practical effect: buildBreadcrumbList() in
// content/pseo/seo.ts drops the city crumb (getCity() lookup just misses),
// there's no /instant-print/<city> hub, and the areas are orphaned from
// the internal-linking graph despite rendering fine.
// ---------------------------------------------------------------------------
let missingCityRefs = 0;
for (const a of areas) {
  if (a.city && !citySlugs.has(a.city)) {
    fail(`live area "${a.slug}" references city "${a.city}" which has no entry in cities.ts at all (not just unpublished — entirely absent)`);
    missingCityRefs++;
  }
}
for (const c of colleges) {
  if (c.city && !citySlugs.has(c.city)) {
    fail(`live college "${c.slug}" references city "${c.city}" which has no entry in cities.ts at all (not just unpublished — entirely absent)`);
    missingCityRefs++;
  }
}
if (missingCityRefs === 0) {
  ok(`all live areas/colleges reference a city slug that exists in cities.ts (${citySlugs.size} city entries)`);
}

// ---------------------------------------------------------------------------
// 18: no two live/served entities share a slug across different cities.
// /print-near/[entity] resolves via getArea()/getCollege(), both a plain
// Array.find() over the full areas.ts/colleges.ts list — first match wins,
// full stop. There is nothing city-scoped about the URL or the lookup.
//
// Regression this guards: areas.ts independently generated "ashok-nagar"
// for both Bengaluru and Hyderabad, and "shivajinagar" for both Bengaluru
// and Pune — each city's scraper run is correctly isolated (a run only
// ever loads its own AREA_KW dict and its own shop file, so no shop data
// crosses city lines), but nothing stopped two different cities from
// independently picking the same area slug. Found by hand on 2026-08-14:
// Hyderabad's Ashok Nagar and Pune's Shivajinagar were both completely
// unreachable — Bengaluru's entry won every lookup, so a whole city's
// area page silently vanished from the live site despite existing in the
// data, passing every other check, and even being listed (wrongly) in
// llms.txt pointing at the winning city's URL. Fixed by suffixing the
// losing slugs with their city (ashok-nagar-hyderabad, shivajinagar-pune),
// matching the convention already used for inherently ambiguous names
// (sector-14-gurgaon, atta-market-noida). This check makes sure the next
// scraper run for a new city can't reintroduce the same silent collision.
// ---------------------------------------------------------------------------
{
  const bySlug = new Map();
  for (const a of areas) {
    if (!bySlug.has(a.slug)) bySlug.set(a.slug, []);
    bySlug.get(a.slug).push(`area "${a.slug}" (city: ${a.city})`);
  }
  for (const c of colleges) {
    if (!bySlug.has(c.slug)) bySlug.set(c.slug, []);
    bySlug.get(c.slug).push(`college "${c.slug}" (city: ${c.city})`);
  }
  let slugCollisions = 0;
  for (const [slug, owners] of bySlug) {
    if (owners.length > 1) {
      fail(`slug "${slug}" is used by ${owners.length} live/served entities across different cities — only the first is reachable at /print-near/${slug}, the rest 404 or are silently shadowed: ${owners.join("; ")}`);
      slugCollisions++;
    }
  }
  if (slugCollisions === 0) {
    ok(`no slug collisions across ${bySlug.size} live areas/colleges — every /print-near/[entity] URL resolves to exactly one entity`);
  }
}

// ---------------------------------------------------------------------------
// 14: app/layout.tsx's sitewide JSON-LD carries no price/offer field.
//
// Regression this guards: the root layout injected Product/AggregateOffer
// (the S1 kiosk price) into every page's <head>, including every
// print-near/* and instant-print/* PSEO page. Google surfaced the kiosk
// price in a search snippet for "Print and xerox shops near Atria IT" — a
// page with nothing to do with kiosk pricing. Price/offer schema now lives
// in app/page.tsx (the only page actually about the S1). If it creeps back
// into the root layout, this fails.
// ---------------------------------------------------------------------------
const layoutPath = resolve(repoRoot, "app/layout.tsx");
if (existsSync(layoutPath)) {
  const layoutText = readFileSync(layoutPath, "utf8");
  const jsonLdM = layoutText.match(/const jsonLd = \{([\s\S]*?)\n\};/);
  if (jsonLdM) {
    const priceHit = /\b(?:lowPrice|highPrice|"price"|offers\s*:)/.test(jsonLdM[1]);
    if (priceHit) {
      fail(`app/layout.tsx's sitewide JSON-LD contains a price/offers field — this renders on every PSEO page. Move it to app/page.tsx instead.`);
    } else {
      ok("app/layout.tsx's sitewide JSON-LD carries no price/offers field");
    }
  } else {
    ok("app/layout.tsx has no top-level jsonLd const (nothing to check)");
  }
} else {
  fail("app/layout.tsx not found");
}

// ---------------------------------------------------------------------------
// 3b-4b: AREA content quality.
//
// These pages are the ones actually shipping. Previously every content
// check was scoped to colleges, so with zero live colleges the whole
// suite passed while 68 area pages went out with empty keywords and
// templated intros. Areas are checked on the same bar as colleges.
// ---------------------------------------------------------------------------
const areasText = existsSync(areasPath) ? readFileSync(areasPath, "utf8") : "";
let areaIntroShort = 0;
let areaNoKeywords = 0;
const introSeen = new Map();

for (const a of areas) {
  const intro = typeof a.intro === "string" ? a.intro : "";
  if (intro.length < INTRO_MIN) {
    fail(`live area "${a.slug}" intro < ${INTRO_MIN} chars (${intro.length})`);
    areaIntroShort++;
  }
  introSeen.set(intro, [...(introSeen.get(intro) || []), a.slug]);

  const kwMatch = areasText.match(
    new RegExp(`slug:\\s*"${a.slug}"[\\s\\S]*?keywords:\\s*\\[([^\\]]*)\\]`)
  );
  const kwBody = kwMatch ? kwMatch[1].trim() : "";
  const kwCount = kwBody ? kwBody.split(",").filter((s) => s.trim()).length : 0;
  if (kwCount < KEYWORDS_MIN) {
    fail(`live area "${a.slug}" has < ${KEYWORDS_MIN} keywords (${kwCount})`);
    areaNoKeywords++;
  }
}
if (areaIntroShort === 0 && areaNoKeywords === 0) {
  ok(`all ${areas.length} live areas have intro >= ${INTRO_MIN} chars and >= ${KEYWORDS_MIN} keywords`);
}

// Duplicate intros across areas = thin/doorway content.
const dupIntros = [...introSeen.entries()].filter(([, v]) => v.length > 1);
if (dupIntros.length > 0) {
  for (const [, slugs] of dupIntros.slice(0, 5)) {
    fail(`live areas share an identical intro: ${slugs.join(", ")}`);
  }
} else {
  ok("no duplicate area intros");
}

// ---------------------------------------------------------------------------
// 7: at least one live entity exists
// ---------------------------------------------------------------------------
const totalLive = liveCities.length + colleges.length + areas.length;
if (totalLive === 0) {
  fail("no live entities anywhere — sitemap will be empty");
} else {
  ok(`total live entities: ${totalLive} (${liveCities.length} cities, ${colleges.length} colleges, ${areas.length} areas)`);
}

// ---------------------------------------------------------------------------
// 15: every live/served city has >= 1 shop rolled up from its areas
// (content/pseo/shops.ts:getShopsInCity). A city with none renders its
// pSEO page with no shop cards and no Google Maps links — this is how
// instant-print/[city] shipped with zero Maps links even after hundreds
// were added at the area level: the city page never read area data at all.
// ---------------------------------------------------------------------------
for (const c of liveCities) {
  const cityAreas = areas.filter((a) => a.city === c.slug);
  if (cityAreas.length === 0) {
    fail(`live city "${c.slug}" has 0 published areas — its page will show 0 shops and no Maps links`);
  } else {
    ok(`live city "${c.slug}" has ${cityAreas.length} published areas feeding its shops list`);
  }
}

// ---------------------------------------------------------------------------
// 8: llms.txt URL parity
// ---------------------------------------------------------------------------
if (!existsSync(llmsPath)) {
  fail("public/llms.txt not found");
} else {
  const text = readFileSync(llmsPath, "utf8");
  const llmsUrls = new Set(Array.from(text.matchAll(/\/print-near\/([a-z0-9-]+)/g)).map((m) => m[1]));
  for (const c of colleges) {
    if (!llmsUrls.has(c.slug)) {
      fail(`llms.txt is missing live college "/print-near/${c.slug}"`);
    }
  }

  // Parity must hold in BOTH directions. Missing entries lose AI-crawler
  // coverage; extra entries advertise URLs that 404 (this is how
  // /print-near/mg-road and the misspelled /print-near/frazer-town
  // shipped as dead links).
  const liveSlugs = new Set([...colleges.map((c) => c.slug), ...areas.map((a) => a.slug)]);
  const hubSlugs = new Set(["print-near"]); // the hub URL itself, not an entity

  for (const a of areas) {
    if (!llmsUrls.has(a.slug)) {
      fail(`llms.txt is missing live area "/print-near/${a.slug}"`);
    }
  }
  for (const slug of llmsUrls) {
    if (!liveSlugs.has(slug) && !hubSlugs.has(slug)) {
      fail(`llms.txt advertises "/print-near/${slug}" which is not live — this URL 404s`);
    }
  }
  ok(`llms.txt parity checked in both directions (${llmsUrls.size} URLs vs ${liveSlugs.size} live entities)`);
}

// ---------------------------------------------------------------------------
// 10: shop-data authenticity. Every published shop must carry a Google
// placeId, real coords inside a known city's bbox (catches mis-scraped
// results from a different city bleeding into a city's clean file — see
// the 18 Bengaluru-coordinate records found in shops-clean-hyderabad.jsonl
// on 2026-08-12), and must not be one of the structurally-non-print
// categories (mall / hotel / bank / bus stop) that the keyword scrape
// pulls in as collateral.
// ---------------------------------------------------------------------------
const CITY_BBOXES = [
  { name: "Bengaluru", latMin: 12.6, latMax: 13.4, lngMin: 77.3, lngMax: 78.0 },
  { name: "Hyderabad", latMin: 17.1, latMax: 17.7, lngMin: 78.1, lngMax: 78.7 },
  { name: "Chennai", latMin: 12.7, latMax: 13.3, lngMin: 80.0, lngMax: 80.4 },
  { name: "Mumbai", latMin: 18.8, latMax: 19.3, lngMin: 72.7, lngMax: 73.1 },
  { name: "Pune", latMin: 18.3, latMax: 18.8, lngMin: 73.6, lngMax: 74.0 },
  { name: "Delhi NCR", latMin: 28.3, latMax: 28.9, lngMin: 76.8, lngMax: 77.5 },
];
const JUNK = /\b(shopping mall|hotel|bank|jail|bus stop|bus depot|hostel|movie theater|pharmacy|subway station|water utility)\b/i;

{
  const cleanFiles = existsSync(shopsDataDir)
    ? readdirSync(shopsDataDir).filter((f) => /^shops-clean.*\.jsonl$/.test(f))
    : [];
  const allLines = cleanFiles.flatMap((f) =>
    readFileSync(resolve(shopsDataDir, f), "utf8").split("\n").filter((l) => l.trim())
  );
  let noPid = 0, outOfBox = 0, junk = 0;
  for (const line of allLines) {
    let rec;
    try { rec = JSON.parse(line); } catch { continue; }
    if (!rec.placeId) noPid++;
    const lat = Number(rec.lat ?? 0), lng = Number(rec.lng ?? 0);
    const inAnyBbox = CITY_BBOXES.some(
      (b) => lat >= b.latMin && lat <= b.latMax && lng >= b.lngMin && lng <= b.lngMax
    );
    if (!lat || !lng || !inAnyBbox) outOfBox++;
    // "xerox" in the name overrides a junk category — see clean_shops.py's
    // matching hard-neg override: Google routinely mis-tags a small combo
    // shop (xerox counter run out of a pharmacy/general store) with the
    // building/anchor-tenant category instead of the shop's own service.
    const isXeroxNamed = /\bxerox\b/i.test(String(rec.name ?? ""));
    if (!isXeroxNamed && JUNK.test(String(rec.categories ?? rec.category ?? ""))) junk++;
  }
  if (noPid > 0) fail(`${noPid} shop records missing Google placeId`);
  if (outOfBox > 0) fail(`${outOfBox} shop records have coords outside every known city bbox`);
  if (junk > 0) fail(`${junk} shop records carry a non-print category (mall/hotel/bank/etc)`);
  if (allLines.length > 0 && noPid === 0 && outOfBox === 0 && junk === 0) {
    ok(`${allLines.length} shop records: all have placeId, valid coords, print-related categories`);
  }
}

// ---------------------------------------------------------------------------
// 11: per-area geographic coherence. Keyword matching on free-text
// addresses silently mis-assigns shops (a "kalyana mantapa" wedding hall
// matched kalyan-nagar; Kothnur 560078 and Kothanur 560077 are 21 km
// apart but share a name). Every shop must sit near its area's MEDIAN
// centre — median so a cluster of outliers cannot drag the centre.
// ---------------------------------------------------------------------------
const MAX_SPREAD_KM = 7;
const areaBlocks = areasText.split("\n  {").slice(1);
let spreadFails = 0;
for (const block of areaBlocks) {
  const slugM = block.match(/slug:\s*"([a-z0-9-]+)"/);
  if (!slugM || !/presence:\s*"(?:live|served)"/.test(block)) continue;
  const lats = Array.from(block.matchAll(/lat:\s*([\d.]+)/g)).map((m) => Number(m[1]));
  const lngs = Array.from(block.matchAll(/lng:\s*([\d.]+)/g)).map((m) => Number(m[1]));
  if (lats.length < 3) continue;
  const med = (v) => { const s = [...v].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
  const cLat = med(lats), cLng = med(lngs);
  const far = lats.filter((la, i) =>
    Math.hypot((la - cLat) * 111, (lngs[i] - cLng) * 108) > MAX_SPREAD_KM);
  if (far.length > 0) {
    fail(`area "${slugM[1]}" has ${far.length}/${lats.length} shops >${MAX_SPREAD_KM}km from its centre — likely mis-assigned`);
    spreadFails++;
  }
}
if (spreadFails === 0) {
  ok(`all live areas geographically coherent (no shop >${MAX_SPREAD_KM}km from area centre)`);
}

// ---------------------------------------------------------------------------
// 12: intro-stated shop count must match rendered liveLocations count.
// The generator once computed the intro from the uncapped shop list while
// rendering a 20-per-area cap, so a page could say "30 xerox and print
// shops" while only listing 20 — caught only by a human noticing the page.
// ---------------------------------------------------------------------------
let countMismatches = 0;
for (const block of areaBlocks) {
  const slugM = block.match(/slug:\s*"([a-z0-9-]+)"/);
  if (!slugM || !/presence:\s*"(?:live|served)"/.test(block)) continue;
  const introM = block.match(/intro:\s*"((?:[^"\\]|\\.)*)"/);
  if (!introM) continue;
  const countM = introM[1].match(/^(\d+) listed xerox and print shops?\b/);
  if (!countM) continue; // intro doesn't lead with a count (e.g. the n===0 template) — nothing to check
  const statedCount = Number(countM[1]);
  const renderedCount = (block.match(/\n {6}\{\n {8}name:/g) || []).length;
  if (statedCount !== renderedCount) {
    fail(`area "${slugM[1]}" intro says ${statedCount} shops but liveLocations has ${renderedCount}`);
    countMismatches++;
  }
}
if (countMismatches === 0) {
  ok("all live area intros' stated shop count matches rendered liveLocations count");
}

// ---------------------------------------------------------------------------
// 9: sitemap expected URL count
// ---------------------------------------------------------------------------
if (colleges.length > 0) {
  ok(`sitemap will emit ${colleges.length} college URLs`);
}

// ---------------------------------------------------------------------------
// 16: every live/served entity has a local FAQ tail file. A missing tail
// isn't a page break — getLocationFaqs/getCityFaqs fall back to sharedFaqs
// only — but it means that page never clears the faqs.length >
// sharedFaqs.length gate, so it never emits FAQPage structured data. This
// is how one commit shipped tails for only 10 of 145 entities and nothing
// caught the other 135 silently rendering boilerplate-only pages.
// ---------------------------------------------------------------------------
const faqTailsDir = resolve(repoRoot, "content/pseo/faq-tails");
let missingTails = 0;
for (const c of liveCities) {
  if (!existsSync(join(faqTailsDir, `city-${c.slug}.json`))) {
    fail(`live city "${c.slug}" has no faq-tails/city-${c.slug}.json — page will only show shared boilerplate FAQs`);
    missingTails++;
  }
}
for (const c of colleges) {
  if (!existsSync(join(faqTailsDir, `college-${c.slug}.json`))) {
    fail(`live college "${c.slug}" has no faq-tails/college-${c.slug}.json`);
    missingTails++;
  }
}
for (const a of areas) {
  if (!existsSync(join(faqTailsDir, `area-${a.slug}.json`))) {
    fail(`live area "${a.slug}" has no faq-tails/area-${a.slug}.json`);
    missingTails++;
  }
}
if (missingTails === 0) {
  ok(`all ${totalLive} live entities have a local FAQ tail file`);
}

console.log("");
console.log(failures === 0 ? "✓ all PSEO checks passed" : `✗ ${failures} PSEO check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
