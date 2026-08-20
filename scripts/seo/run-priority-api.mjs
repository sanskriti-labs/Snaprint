#!/usr/bin/env node
/**
 * Calls the Claude API for each priority pseo body and writes the result.
 *
 *   pnpm run generate:priority
 *
 * Reads body files at content/pseo/bodies/*.md, filters to those flagged
 * `needsLLM: true` in their frontmatter, builds a prompt by filling
 * `scripts/seo/prompts/priority-body.md` with the entity's data, and POSTs
 * to the Anthropic Messages API. The response is written back to the
 * placeholder file, replacing the `<!-- needsLLM -->` comment, and the
 * `wordCount` and `needsLLM` fields are updated in the frontmatter.
 *
 * Requests are run SEQUENTIALLY so we never hit rate limits and the
 * output is deterministic.
 *
 * Requires: ANTHROPIC_API_KEY in the environment (Anthropic direct), or
 * ANTHROPIC_AUTH_TOKEN + ANTHROPIC_BASE_URL for an Anthropic-compatible
 * provider (e.g. MiniMax's Claude-compatible endpoint).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const REPO_ROOT = process.cwd();
const PSEO_DIR = resolve(REPO_ROOT, "content/pseo");
const CITIES_PATH = join(PSEO_DIR, "cities.ts");
const AREAS_PATH = join(PSEO_DIR, "areas.ts");
const COLLEGES_PATH = join(PSEO_DIR, "colleges.ts");
const BODIES_DIR = join(PSEO_DIR, "bodies");
const PROMPT_PATH = resolve(
  REPO_ROOT,
  "scripts/seo/prompts/priority-body.md"
);

// ANTHROPIC_BASE_URL + ANTHROPIC_AUTH_TOKEN switches to any
// Anthropic-compatible provider (e.g. MiniMax); otherwise defaults to
// Anthropic direct with ANTHROPIC_API_KEY.
const API_URL = `${(process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/$/, "")}/v1/messages`;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";
// Some providers (e.g. MiniMax) emit a "thinking" block that counts
// against max_tokens before the actual text block — a real run against
// MiniMax-M2.7 used ~1000 thinking + ~1550 output tokens for one page,
// so give real headroom beyond the ~600 tokens the 400-500 word body
// itself needs.
const MAX_TOKENS = Number(process.env.ANTHROPIC_MAX_TOKENS) || 16000;

// Shop JSONL resolution — loads every city's cleaned file (shops-clean.jsonl
// for Bengaluru, shops-clean-hyderabad.jsonl, etc.), same as content/pseo/
// shops.ts and scripts/verify/pseo.js. A single hardcoded path here would
// silently return wrong "top shop" / shop-count data for every other city.
const SHOP_DATA_DIR = resolve(REPO_ROOT, "scripts/scraper/data");
const SHOP_RAW_FALLBACK = resolve(REPO_ROOT, "scripts/scraper/data/results-77areas.json");

// ---------------------------------------------------------------------------
// Haversine
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
// Lightweight TS data extractor — same approach as generate-bodies.mjs
// ---------------------------------------------------------------------------
function readString(body, key) {
  const re = new RegExp(`\\b${key}:\\s*(?:"((?:[^"\\\\]|\\\\.)*)"|'([^']*)')`);
  const m = body.match(re);
  if (!m) return undefined;
  return (m[1] ?? m[2] ?? "")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\")
    .replace(/\\n/g, "\n");
}
function readNumber(body, key) {
  const re = new RegExp(`\\b${key}:\\s*([-+]?\\d+(?:\\.\\d+)?)`);
  const m = body.match(re);
  if (!m) return undefined;
  return Number(m[1]);
}
function readStringArray(body, key) {
  const re = new RegExp(`\\b${key}:\\s*\\[([^\\]]*)\\]`);
  const m = body.match(re);
  if (!m) return [];
  const items = [];
  const itemRe = /"((?:[^"\\]|\\.)*)"|'([^']*)'/g;
  let mm;
  while ((mm = itemRe.exec(m[1])) !== null) {
    items.push((mm[1] ?? mm[2] ?? "")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, "\\")
      .replace(/\\n/g, "\n"));
  }
  return items;
}
function readLiveLocations(body) {
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
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) return [];
  const inner = body.slice(lb + 1, end);
  const out = [];
  const objRe = /\{([^{}]*)\}/g;
  let om;
  while ((om = objRe.exec(inner)) !== null) {
    const ob = om[1];
    const oLat = readNumber(ob, "lat") ?? readNumber(ob, "latitude") ?? 0;
    const oLng = readNumber(ob, "lng") ?? readNumber(ob, "longitude") ?? readNumber(ob, "longtitude") ?? 0;
    if (!oLat || !oLng) continue;
    out.push({
      name: readString(ob, "name") ?? "Xerox Shop",
      rating: readNumber(ob, "rating"),
    });
  }
  return out;
}
function extractEntities(filePath) {
  if (!existsSync(filePath)) return [];
  const text = readFileSync(filePath, "utf8");
  const blocks = text.split(/\n  \{/);
  const out = [];
  for (let i = 1; i < blocks.length; i++) {
    const block = "  {" + blocks[i];
    const endIdx = block.indexOf("\n  }");
    if (endIdx === -1) continue;
    const body = block.slice(0, endIdx);
    const slug = readString(body, "slug");
    if (!slug) continue;
    out.push({
      slug,
      name: readString(body, "name"),
      city: readString(body, "city"),
      presence: readString(body, "presence"),
      intro: readString(body, "intro"),
      lat: readNumber(body, "lat"),
      lng: readNumber(body, "lng"),
      pinCodes: readStringArray(body, "pinCodes"),
      liveLocations: readLiveLocations(body),
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Shop index loader
// ---------------------------------------------------------------------------
let _shops = null;
function loadShopsFromFile(filePath) {
  const text = readFileSync(filePath, "utf8");
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
        name: (rec.name ?? rec.title ?? "Xerox Shop").toString().slice(0, 80),
        lat: Math.round(lat * 1e6) / 1e6,
        lng: Math.round(lng * 1e6) / 1e6,
        rating: typeof rec.rating === "number" ? rec.rating : undefined,
      });
    } catch {}
  }
  return out;
}
function loadShops() {
  if (_shops) return _shops;
  const cleanFiles = existsSync(SHOP_DATA_DIR)
    ? readdirSync(SHOP_DATA_DIR).filter((f) => /^shops-clean.*\.jsonl$/.test(f))
    : [];
  if (cleanFiles.length > 0) {
    _shops = cleanFiles.flatMap((f) => loadShopsFromFile(join(SHOP_DATA_DIR, f)));
  } else if (existsSync(SHOP_RAW_FALLBACK)) {
    _shops = loadShopsFromFile(SHOP_RAW_FALLBACK);
  } else {
    _shops = [];
  }
  return _shops;
}

function shopsNearCount(lat, lng) {
  if (lat == null || lng == null) return 0;
  const origin = { lat, lng };
  let n = 0;
  for (const s of loadShops()) {
    if (s.lat == null || s.lng == null) continue;
    if (haversineKm(origin, { lat: s.lat, lng: s.lng }) <= 1.5) n++;
  }
  return n;
}

// ---------------------------------------------------------------------------
// Build the data record for one entity, by kind
// ---------------------------------------------------------------------------
function buildEntityData(kind, slug) {
  let ent;
  if (kind === "area") {
    ent = extractEntities(AREAS_PATH).find((e) => e.slug === slug);
    if (!ent) return null;
    const shopCount = (ent.liveLocations || []).length;
    const top = pickTopShopArea(ent);
    return {
      kind,
      name: ent.name,
      cityName: lookupCityName(ent.city),
      slug: ent.slug,
      pinCodes: (ent.pinCodes || []).join(", "),
      shopCount: String(shopCount),
      topShopName: top.name,
      topShopRating: top.rating,
      intro: ent.intro ?? "",
    };
  }
  if (kind === "college") {
    ent = extractEntities(COLLEGES_PATH).find((e) => e.slug === slug);
    if (!ent) return null;
    const shopCount = shopsNearCount(ent.lat, ent.lng);
    const top = pickTopShopCollege(ent);
    return {
      kind,
      name: ent.name,
      cityName: lookupCityName(ent.city),
      slug: ent.slug,
      pinCodes: "", // colleges don't carry pin codes
      shopCount: String(shopCount),
      topShopName: top.name,
      topShopRating: top.rating,
      intro: ent.intro ?? "",
    };
  }
  if (kind === "city") {
    ent = extractEntities(CITIES_PATH).find((e) => e.slug === slug);
    if (!ent) return null;
    const shopCount = (ent.liveLocations || []).length;
    const top = pickTopShopArea(ent);
    return {
      kind,
      name: ent.name,
      cityName: ent.name, // a city is its own parent
      slug: ent.slug,
      pinCodes: (ent.pinCodes || []).join(", "),
      shopCount: String(shopCount),
      topShopName: top.name,
      topShopRating: top.rating,
      intro: ent.intro ?? "",
    };
  }
  return null;
}

function lookupCityName(citySlug) {
  if (!citySlug) return "";
  const c = extractEntities(CITIES_PATH).find((e) => e.slug === citySlug);
  return c?.name ?? citySlug;
}

function pickTopShopArea(ent) {
  const locs = ent.liveLocations || [];
  if (locs.length === 0) return { name: "—", rating: "—" };
  const rated = locs.filter((l) => l.rating != null);
  const top = rated.length > 0
    ? rated.reduce((a, b) => (a.rating >= b.rating ? a : b))
    : locs[0];
  return { name: top.name, rating: top.rating ?? "—" };
}

function pickTopShopCollege(ent) {
  if (ent.lat == null || ent.lng == null) return { name: "—", rating: "—" };
  const origin = { lat: ent.lat, lng: ent.lng };
  let best = null;
  let bestD = Infinity;
  for (const s of loadShops()) {
    if (s.lat == null || s.lng == null) continue;
    const d = haversineKm(origin, { lat: s.lat, lng: s.lng });
    if (d <= 1.5 && d < bestD) { bestD = d; best = s; }
  }
  if (!best) return { name: "—", rating: "—" };
  return { name: best.name, rating: best.rating ?? "—" };
}

// ---------------------------------------------------------------------------
// Prompt rendering
// ---------------------------------------------------------------------------
function renderPrompt(template, data) {
  return template
    .replace(/\{\{kind\}\}/g, data.kind)
    .replace(/\{\{name\}\}/g, data.name ?? "")
    .replace(/\{\{cityName\}\}/g, data.cityName ?? "")
    .replace(/\{\{slug\}\}/g, data.slug ?? "")
    .replace(/\{\{pinCodes\}\}/g, data.pinCodes ?? "")
    .replace(/\{\{shopCount\}\}/g, data.shopCount ?? "")
    .replace(/\{\{topShopName\}\}/g, data.topShopName ?? "")
    .replace(/\{\{topShopRating\}\}/g, data.topShopRating ?? "")
    .replace(/\{\{intro\}\}/g, data.intro ?? "");
}

// ---------------------------------------------------------------------------
// API call
// ---------------------------------------------------------------------------
async function callClaude(prompt) {
  // ANTHROPIC_AUTH_TOKEN (Bearer) for compatible providers like MiniMax;
  // ANTHROPIC_API_KEY (x-api-key) for Anthropic direct.
  const authToken = process.env.ANTHROPIC_AUTH_TOKEN;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!authToken && !apiKey) {
    throw new Error(
      "Neither ANTHROPIC_AUTH_TOKEN nor ANTHROPIC_API_KEY is set. " +
        "Set one before running `pnpm run generate:priority`."
    );
  }
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      ...(authToken
        ? { Authorization: `Bearer ${authToken}` }
        : { "x-api-key": apiKey }),
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Claude API ${res.status}: ${text}`);
  }
  const json = await res.json();
  // Some Anthropic-compatible providers (e.g. MiniMax) prepend a
  // "thinking" content block before the actual "text" block — find the
  // text block rather than assuming content[0] is it.
  const block = (json?.content ?? []).find((b) => b.type === "text");
  if (!block) {
    throw new Error(`No text block in response: ${JSON.stringify(json).slice(0, 300)}`);
  }
  if (json.stop_reason === "max_tokens") {
    throw new Error(`Response truncated by max_tokens (${MAX_TOKENS}) before finishing.`);
  }
  return block.text;
}

// ---------------------------------------------------------------------------
// Body file update — replace needsLLM comment with generated prose
// ---------------------------------------------------------------------------
function updateBodyFile(filePath, prose) {
  const raw = readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const wordCount = prose.trim().split(/\s+/).filter(Boolean).length;
  // Remove the existing needsLLM: true and the HTML comment.
  delete parsed.data.needsLLM;
  parsed.data.wordCount = wordCount;
  const newBody = prose.endsWith("\n") ? prose : prose + "\n";
  const out = matter.stringify(newBody, parsed.data);
  writeFileSync(filePath, out);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!process.env.ANTHROPIC_AUTH_TOKEN && !process.env.ANTHROPIC_API_KEY) {
    console.error(
      "[FATAL] Neither ANTHROPIC_AUTH_TOKEN nor ANTHROPIC_API_KEY is set.\n" +
        "        export ANTHROPIC_API_KEY=sk-ant-...   then re-run,\n" +
        "        or export ANTHROPIC_AUTH_TOKEN + ANTHROPIC_BASE_URL for a compatible provider."
    );
    process.exit(1);
  }
  if (!existsSync(BODIES_DIR)) {
    console.error(`[FATAL] bodies directory not found at ${BODIES_DIR}`);
    process.exit(1);
  }
  if (!existsSync(PROMPT_PATH)) {
    console.error(`[FATAL] prompt template not found at ${PROMPT_PATH}`);
    process.exit(1);
  }

  const template = readFileSync(PROMPT_PATH, "utf8");
  const files = readdirSync(BODIES_DIR).filter((f) => f.endsWith(".md"));
  const queue = [];
  for (const f of files) {
    const fp = join(BODIES_DIR, f);
    const raw = readFileSync(fp, "utf8");
    const parsed = matter(raw);
    if (parsed.data?.needsLLM === true) {
      // Filename is `{kind}-{slug}.md`
      const m = f.match(/^([^-]+)-(.+)\.md$/);
      if (!m) continue;
      queue.push({ kind: m[1], slug: m[2], filePath: fp });
    }
  }

  if (queue.length === 0) {
    console.log("No needsLLM placeholders found. Run `pnpm run generate:bodies` first.");
    return;
  }
  console.log(`Found ${queue.length} priority page(s) to generate.`);

  let ok = 0;
  let failed = 0;
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const label = `${item.kind}-${item.slug}`;
    console.log(`[${i + 1}/${queue.length}] generating ${label}...`);
    const data = buildEntityData(item.kind, item.slug);
    if (!data) {
      console.error(`  [skip] no data found for ${label} in pseo .ts files`);
      failed++;
      continue;
    }
    const prompt = renderPrompt(template, data);
    try {
      const prose = await callClaude(prompt);
      updateBodyFile(item.filePath, prose);
      ok++;
    } catch (err) {
      console.error(`  [fail] ${label}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n--- generate:priority summary ---`);
  console.log(`ok=${ok} failed=${failed} total=${queue.length}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
