#!/usr/bin/env node
/**
 * Deterministic generator for pseo body files.
 *
 * Reads content/pseo/{cities,areas,colleges}.ts as text and extracts the
 * top-level object blocks via regex — the same approach scripts/verify/pseo.js
 * uses, so this script does not require a TS runtime.
 *
 * For each live/served entity it computes `shopCount`:
 *   - cities:  count of liveLocations declared on the city
 *   - areas:   count of liveLocations declared on the area
 *   - colleges: count of xerox shops within 1.5 km of the campus coords,
 *               using the same JSONL the existing shops.ts selector reads
 *
 * Classification:
 *   - shopCount <= 3 → "priority"   (placeholder, marked needsLLM: true)
 *   - shopCount  > 3 → "stub"       (deterministic intro verbatim)
 *
 * Idempotent: if a body file already exists and contains the
 * "## About this place" heading (heuristic for hand-written prose), it
 * is skipped — never overwritten.
 *
 * Usage:
 *   pnpm run generate:bodies
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const REPO_ROOT = process.cwd();
const PSEO_DIR = resolve(REPO_ROOT, "content/pseo");
const CITIES_PATH = join(PSEO_DIR, "cities.ts");
const AREAS_PATH = join(PSEO_DIR, "areas.ts");
const COLLEGES_PATH = join(PSEO_DIR, "colleges.ts");
const BODIES_DIR = join(PSEO_DIR, "bodies");
const SHOP_RADIUS_KM = 1.5;

// Same resolution order as content/pseo/shops.ts
const SHOP_FILE_CANDIDATES = [
  resolve(REPO_ROOT, "scripts/scraper/data/shops-clean.jsonl"),
  resolve(REPO_ROOT, "scripts/scraper/data/shops-llm-verified.jsonl"),
  resolve(REPO_ROOT, "scripts/scraper/data/results-77areas.json"),
];

const TODAY = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// Haversine — mirrors content/pseo/_geo.ts
// ---------------------------------------------------------------------------
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ---------------------------------------------------------------------------
// TS data extractor — handles top-level { ... } blocks where liveLocations
// is a nested array. Mirrors the block-walking approach in pseo.js but also
// extracts the liveLocations array (which pseo.js does not need).
//
// For each top-level block, returns:
//   { slug, name, city, presence, intro, pinCodes, keywords, lat, lng,
//     liveLocations: [{ name, address, lat, lng, phone, rating, reviews, placeId }, ...] }
//
// Arrays of objects (e.g. keywords) are emitted as JSON-like strings that
// the caller post-processes.
// ---------------------------------------------------------------------------
function extractEntities(filePath) {
  if (!existsSync(filePath)) return [];
  const text = readFileSync(filePath, "utf8");
  // Each top-level entity begins with "  {" at 2-space indent and ends with
  // "  }," or "  }" at the same indent. We split on "\n  {" so each chunk
  // contains the body of one entity up to (but not including) the opening
  // brace of the next entity — so the chunk still contains its own
  // closing "  }" line near the end. We then take the FIRST "\n  }" as
  // the block boundary.
  const blocks = text.split(/\n  \{/);
  const out = [];
  for (let i = 1; i < blocks.length; i++) {
    const block = "  {" + blocks[i];
    const endIdx = block.indexOf("\n  }");
    if (endIdx === -1) continue;
    const body = block.slice(0, endIdx);

    // ---- scalars ----
    const slug = readString(body, "slug");
    if (!slug) continue;
    const name = readString(body, "name");
    const city = readString(body, "city");
    const presence = readString(body, "presence");
    const intro = readString(body, "intro");
    const lat = readNumber(body, "lat");
    const lng = readNumber(body, "lng");
    const keywords = readStringArray(body, "keywords");
    const pinCodes = readStringArray(body, "pinCodes");

    // ---- liveLocations (nested array) ----
    const liveLocations = readLiveLocations(body);

    out.push({
      slug,
      name,
      city,
      presence,
      intro,
      lat,
      lng,
      keywords,
      pinCodes,
      liveLocations,
    });
  }
  return out;
}

function readString(body, key) {
  // Matches: key: "value" or key: 'value' (single-line).
  const re = new RegExp(`\\b${key}:\\s*(?:"((?:[^"\\\\]|\\\\.)*)"|'([^']*)')`);
  const m = body.match(re);
  if (!m) return undefined;
  return unescapeString(m[1] ?? m[2] ?? "");
}

function readNumber(body, key) {
  const re = new RegExp(`\\b${key}:\\s*([-+]?\\d+(?:\\.\\d+)?)`);
  const m = body.match(re);
  if (!m) return undefined;
  return Number(m[1]);
}

function readStringArray(body, key) {
  // Matches: key: ["a", "b", "c"] — single line, comma-separated strings.
  const re = new RegExp(`\\b${key}:\\s*\\[([^\\]]*)\\]`);
  const m = body.match(re);
  if (!m) return [];
  const inner = m[1];
  const items = [];
  const itemRe = /"((?:[^"\\]|\\.)*)"|'([^']*)'/g;
  let mm;
  while ((mm = itemRe.exec(inner)) !== null) {
    items.push(unescapeString(mm[1] ?? mm[2] ?? ""));
  }
  return items;
}

function readLiveLocations(body) {
  // Match liveLocations: [ ... ] where ... may contain nested objects.
  // We walk brackets to find the matching ].
  const start = body.indexOf("liveLocations:");
  if (start === -1) return [];
  const lb = body.indexOf("[", start);
  if (lb === -1) return [];
  let depth = 0;
  let end = -1;
  for (let i = lb; i < body.length; i++) {
    const ch = body[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return [];
  const inner = body.slice(lb + 1, end);

  // Split inner by objects starting with "{"
  const out = [];
  const objRe = /\{([^{}]*)\}/g;
  let om;
  while ((om = objRe.exec(inner)) !== null) {
    const ob = om[1];
    const oName = readString(ob, "name");
    const oAddress = readString(ob, "address") ?? "";
    const oLat = readNumber(ob, "lat") ?? readNumber(ob, "latitude") ?? 0;
    const oLng = readNumber(ob, "lng") ?? readNumber(ob, "longitude") ?? readNumber(ob, "longtitude") ?? 0;
    if (!oLat || !oLng) continue;
    const oPhone = readString(ob, "phone");
    const oRating = readNumber(ob, "rating");
    const oReviews = readNumber(ob, "reviews");
    const oPlaceId = readString(ob, "placeId");
    out.push({
      name: oName ?? "Xerox Shop",
      address: oAddress,
      lat: Math.round(oLat * 1e6) / 1e6,
      lng: Math.round(oLng * 1e6) / 1e6,
      phone: oPhone,
      rating: oRating,
      reviews: oReviews,
      placeId: oPlaceId,
    });
  }
  return out;
}

function unescapeString(s) {
  return s
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\")
    .replace(/\\n/g, "\n");
}

// ---------------------------------------------------------------------------
// Shop index loader — same logic as content/pseo/shops.ts
// ---------------------------------------------------------------------------
let _shops = null;
function loadShops() {
  if (_shops) return _shops;
  const found = SHOP_FILE_CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    console.warn(
      "[generate-bodies] shop JSONL not found; college shopCount will be 0."
    );
    _shops = [];
    return _shops;
  }
  const text = readFileSync(found, "utf8");
  const out = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const rec = JSON.parse(trimmed);
      const lat = Number(rec.lat ?? rec.latitude ?? 0);
      const lng = Number(rec.lng ?? rec.longitude ?? rec.longtitude ?? 0);
      if (!lat || !lng) continue;
      out.push({
        name:
          typeof (rec.name ?? rec.title) === "string" && (rec.name ?? rec.title).trim()
            ? (rec.name ?? rec.title).trim().slice(0, 80)
            : "Xerox Shop",
        lat: Math.round(lat * 1e6) / 1e6,
        lng: Math.round(lng * 1e6) / 1e6,
        rating: typeof rec.rating === "number" ? rec.rating : undefined,
      });
    } catch {
      // skip malformed lines
    }
  }
  _shops = out;
  return _shops;
}

function shopsNearCollege(college) {
  if (college.lat == null || college.lng == null) return 0;
  const origin = { lat: college.lat, lng: college.lng };
  let n = 0;
  for (const s of loadShops()) {
    if (s.lat == null || s.lng == null) continue;
    if (haversineKm(origin, { lat: s.lat, lng: s.lng }) <= SHOP_RADIUS_KM) n++;
  }
  return n;
}

// ---------------------------------------------------------------------------
// Body file writer
// ---------------------------------------------------------------------------
function pickTopShop(entities, kind, slug) {
  // Look for the entity's own liveLocations first (areas/cities).
  if (kind === "area" || kind === "city") {
    const ent = entities.find((e) => e.slug === slug);
    if (ent && ent.liveLocations && ent.liveLocations.length > 0) {
      const rated = ent.liveLocations.filter((l) => l.rating != null);
      const top = rated.length > 0 ? rated.reduce((a, b) => (a.rating >= b.rating ? a : b)) : ent.liveLocations[0];
      return { name: top.name, rating: top.rating };
    }
    return { name: "—", rating: "—" };
  }
  // For colleges: use the JSONL-indexed shop nearest to campus coords.
  if (kind === "college") {
    const ent = entities.find((e) => e.slug === slug);
    if (!ent || ent.lat == null || ent.lng == null) return { name: "—", rating: "—" };
    const origin = { lat: ent.lat, lng: ent.lng };
    const shops = loadShops();
    let best = null;
    let bestD = Infinity;
    for (const s of shops) {
      if (s.lat == null || s.lng == null) continue;
      const d = haversineKm(origin, { lat: s.lat, lng: s.lng });
      if (d <= SHOP_RADIUS_KM && d < bestD) {
        bestD = d;
        best = s;
      }
    }
    if (!best) return { name: "—", rating: "—" };
    return { name: best.name, rating: best.rating ?? "—" };
  }
  return { name: "—", rating: "—" };
}

function makeFrontmatter({ kind, slug, name, city, priority, wordCount, needsLLM }) {
  const lines = [
    "---",
    `kind: "${kind}"`,
    `slug: "${slug}"`,
    `name: "${name}"`,
    `city: "${city ?? ""}"`,
    `priority: ${priority}`,
    `lastReviewed: "${TODAY}"`,
    `wordCount: ${wordCount}`,
  ];
  if (needsLLM) lines.push("needsLLM: true");
  lines.push("---", "");
  return lines.join("\n");
}

function hasHandWrittenProse(filePath) {
  if (!existsSync(filePath)) return false;
  const text = readFileSync(filePath, "utf8");
  return text.includes("## About this place");
}

function bodyFilePath(kind, slug) {
  return join(BODIES_DIR, `${kind}-${slug}.md`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  if (!existsSync(BODIES_DIR)) mkdirSync(BODIES_DIR, { recursive: true });

  const cities = extractEntities(CITIES_PATH);
  const areas = extractEntities(AREAS_PATH);
  const colleges = extractEntities(COLLEGES_PATH);

  const isLive = (e) => e.presence === "live" || e.presence === "served";

  // Compute shopCount for every live entity
  function classify(e, kind) {
    if (kind === "area" || kind === "city") {
      const n = (e.liveLocations || []).length;
      return n;
    }
    // college: count shops within 1.5 km
    return shopsNearCollege(e);
  }

  // Stats
  const stats = {
    area: { total: 0, live: 0, written: 0, skipped: 0, priority: 0, stub: 0 },
    college: { total: 0, live: 0, written: 0, skipped: 0, priority: 0, stub: 0 },
    city: { total: 0, live: 0, written: 0, skipped: 0, priority: 0, stub: 0 },
  };

  // Process in order: areas, colleges, cities
  const process = (entities, kind) => {
    for (const e of entities) {
      stats[kind].total++;
      if (!isLive(e)) continue;
      stats[kind].live++;

      const shopCount = classify(e, kind);
      const isPriority = shopCount <= 3;

      if (isPriority) stats[kind].priority++;
      else stats[kind].stub++;

      const filePath = bodyFilePath(kind, e.slug);
      const hasProse = hasHandWrittenProse(filePath);
      if (hasProse) {
        console.log(`skipping ${kind}-${e.slug}: existing prose detected`);
        stats[kind].skipped++;
        continue;
      }
      if (existsSync(filePath)) {
        console.log(`skipping ${kind}-${e.slug}: existing file detected`);
        stats[kind].skipped++;
        continue;
      }

      const topShop = pickTopShop(entities, kind, e.slug);

      if (isPriority) {
        const front = makeFrontmatter({
          kind,
          slug: e.slug,
          name: e.name,
          city: e.city,
          priority: true,
          wordCount: 0,
          needsLLM: true,
        });
        const body =
          `<!-- This page has thin data (shopCount: ${shopCount}). Run \`pnpm run generate:priority\` to generate unique prose via Claude API. -->\n`;
        writeFileSync(filePath, front + body);
      } else {
        // STUB — use the existing intro verbatim, count words.
        const intro = e.intro ?? "";
        const wordCount = intro.trim().split(/\s+/).filter(Boolean).length;
        const front = makeFrontmatter({
          kind,
          slug: e.slug,
          name: e.name,
          city: e.city,
          priority: false,
          wordCount,
          needsLLM: false,
        });
        const body = `${intro.trim()}\n`;
        writeFileSync(filePath, front + body);
      }
      stats[kind].written++;
    }
  };

  process(areas, "area");
  process(colleges, "college");
  process(cities, "city");

  // Summary
  console.log("\n--- generate:bodies summary ---");
  const total = { written: 0, skipped: 0, priority: 0, stub: 0 };
  for (const kind of ["area", "college", "city"]) {
    const s = stats[kind];
    total.written += s.written;
    total.skipped += s.skipped;
    total.priority += s.priority;
    total.stub += s.stub;
    console.log(
      `${kind.padEnd(9)} total=${s.total} live=${s.live} written=${s.written} skipped=${s.skipped} priority=${s.priority} stub=${s.stub}`
    );
  }
  console.log(
    `TOTAL     written=${total.written} skipped=${total.skipped} priority=${total.priority} stub=${total.stub}`
  );

  // Also report existing body files (to make "skipped: 145" visible).
  const existing = existsSync(BODIES_DIR)
    ? readdirSync(BODIES_DIR).filter((f) => f.endsWith(".md"))
    : [];
  console.log(`Bodies dir contains ${existing.length} .md files (existing + new).`);
}

main();
