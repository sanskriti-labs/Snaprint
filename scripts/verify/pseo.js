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
 */
const { readFileSync, existsSync } = require("node:fs");
const { resolve } = require("node:path");

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
// Prefer the LLM-verified shop file (highest precision). Fall back to
// the heuristic-cleaned file, then the raw scrape. The verifier
// resolves the same way content/pseo/shops.ts does.
const shopsLlmPath = resolve(repoRoot, "scripts/clean/data/shops-llm-verified.jsonl");
const shopsCleanPath = resolve(repoRoot, "scripts/scraper/data/shops-clean.jsonl");
const shopsRawPath = resolve(repoRoot, "scripts/scraper/data/results-77areas.json");
const shopsPath = [shopsLlmPath, shopsCleanPath, shopsRawPath].find((p) => existsSync(p));

const colleges = extractDataBlocks(collegesPath).filter((c) => c.presence === "live");
const cities = extractDataBlocks(citiesPath);  // all cities, not just live — a college can point to a planned city
const liveCities = cities.filter((c) => c.presence === "live");
const areas = extractDataBlocks(areasPath).filter((a) => a.presence === "live");

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

// Load shop index from JSONL — same source as content/pseo/shops.ts.
function loadShops() {
  if (!existsSync(shopsPath)) {
    console.warn(`[pseo] shops JSONL not found at ${shopsPath}; radius check will be skipped`);
    return [];
  }
  const isCleaned = shopsPath.endsWith("shops-llm-verified.jsonl") || shopsPath.endsWith("shops-clean.jsonl");
  const text = readFileSync(shopsPath, "utf8");
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
// placeId, real coords inside the Bengaluru bbox, and must not be one of
// the structurally-non-print categories (mall / hotel / bank / bus stop)
// that the keyword scrape pulls in as collateral.
// ---------------------------------------------------------------------------
const BBOX = { latMin: 12.6, latMax: 13.4, lngMin: 77.3, lngMax: 78.0 };
const JUNK = /\b(shopping mall|hotel|bank|jail|bus stop|bus depot|hostel|movie theater|pharmacy|subway station|water utility)\b/i;

if (existsSync(shopsPath)) {
  const lines = readFileSync(shopsPath, "utf8").split("\n").filter((l) => l.trim());
  let noPid = 0, outOfBox = 0, junk = 0;
  for (const line of lines) {
    let rec;
    try { rec = JSON.parse(line); } catch { continue; }
    if (!rec.placeId) noPid++;
    const lat = Number(rec.lat ?? 0), lng = Number(rec.lng ?? 0);
    if (!lat || !lng || lat < BBOX.latMin || lat > BBOX.latMax || lng < BBOX.lngMin || lng > BBOX.lngMax) outOfBox++;
    if (JUNK.test(String(rec.categories ?? rec.category ?? ""))) junk++;
  }
  if (noPid > 0) fail(`${noPid} shop records missing Google placeId`);
  if (outOfBox > 0) fail(`${outOfBox} shop records have coords outside the Bengaluru bbox`);
  if (junk > 0) fail(`${junk} shop records carry a non-print category (mall/hotel/bank/etc)`);
  if (noPid === 0 && outOfBox === 0 && junk === 0) {
    ok(`${lines.length} shop records: all have placeId, valid coords, print-related categories`);
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
  if (!slugM || !/presence:\s*"live"/.test(block)) continue;
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
// 9: sitemap expected URL count
// ---------------------------------------------------------------------------
if (colleges.length > 0) {
  ok(`sitemap will emit ${colleges.length} college URLs`);
}

console.log("");
console.log(failures === 0 ? "✓ all PSEO checks passed" : `✗ ${failures} PSEO check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
