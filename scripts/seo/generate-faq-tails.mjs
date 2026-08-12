#!/usr/bin/env node
/**
 * Calls the Claude API to write a local FAQ tail for every live/served
 * entity that doesn't have one yet.
 *
 *   pnpm run generate:faq-tails
 *
 * Reads content/pseo/{cities,areas,colleges}.ts as text, filters to
 * live/served entities, skips any that already have a file at
 * content/pseo/faq-tails/{kind}-{slug}.json, and asks Claude to write the
 * ANSWER only for one fixed local question per remaining entity, using
 * scripts/seo/prompts/faq-tail.md.
 *
 * The question text is templated in code (buildQuestion below), not
 * written by the model. Earlier versions let the model write both q and
 * a, and across two different models (MiniMax-M2.7 and M3) it
 * consistently named the top-rated nearby shop as the subject of the
 * question instead of the area/college/city itself ("Is there a kiosk
 * near Amith Xerox Center in Shivajinagar?" instead of "...near
 * Shivajinagar?"). Templating the question removes that failure mode
 * structurally instead of relying on a prompt instruction the model
 * wasn't reliably following.
 *
 * Idempotent by construction: re-running only fills gaps, never
 * overwrites a file that already exists (hand-edited or previously
 * generated). Requests run SEQUENTIALLY to avoid rate limits.
 *
 * After running, regenerate the compiled map:
 *   node scripts/build-faq-tails-ts.mjs   (or `pnpm run build:bodies`,
 *   which already chains it)
 *
 * Requires: ANTHROPIC_API_KEY (or ANTHROPIC_AUTH_TOKEN, for proxy setups
 * like a Minimax/zai gateway) in the environment. ANTHROPIC_BASE_URL and
 * FAQ_TAIL_MODEL / ANTHROPIC_DEFAULT_SONNET_MODEL redirect to a compatible
 * proxy instead of the direct Anthropic API — see API_URL/MODEL below.
 *
 * Implementation note: entity extraction here duplicates the regex
 * parser in scripts/seo/run-priority-api.mjs and scripts/verify/pseo.js
 * rather than importing a shared module, matching this repo's existing
 * convention of small per-script parsers over the same .ts source files
 * (see the note atop scripts/verify/pseo.js).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const REPO_ROOT = process.cwd();
const PSEO_DIR = resolve(REPO_ROOT, "content/pseo");
const CITIES_PATH = join(PSEO_DIR, "cities.ts");
const AREAS_PATH = join(PSEO_DIR, "areas.ts");
const COLLEGES_PATH = join(PSEO_DIR, "colleges.ts");
const TAILS_DIR = join(PSEO_DIR, "faq-tails");
const PROMPT_PATH = resolve(REPO_ROOT, "scripts/seo/prompts/faq-tail.md");

// Override via env to point at an Anthropic-compatible proxy (e.g. a
// Minimax/zai gateway) instead of the direct Anthropic API. The request/
// response shape (Messages API, x-api-key auth) is assumed compatible;
// reasoning models on the other end may emit an extra "thinking" content
// block, which callClaude() below skips when extracting the answer.
const API_URL = `${(process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com").replace(/\/$/, "")}/v1/messages`;
const MODEL = process.env.FAQ_TAIL_MODEL ?? process.env.ANTHROPIC_DEFAULT_SONNET_MODEL ?? "claude-opus-5";
// Generous budget: reasoning-model "thinking" blocks (when the backend
// enables them) consume max_tokens before the actual JSON answer, and the
// thinking length is inconsistent per-request — observed truncation
// (stop_reason "max_tokens") at both 1200 and 3000 on different entities
// against the same model. 6000 gives real margin; a truncated response
// still fails loudly (see callClaude's stop_reason check) rather than
// writing bad data, so a generous ceiling only costs tokens, not safety.
const MAX_TOKENS = 6000;

const SHOP_FILE_CANDIDATES = [
  resolve(REPO_ROOT, "scripts/scraper/data/shops-clean.jsonl"),
  resolve(REPO_ROOT, "scripts/scraper/data/shops-llm-verified.jsonl"),
  resolve(REPO_ROOT, "scripts/scraper/data/results-77areas.json"),
];

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
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ---------------------------------------------------------------------------
// Lightweight TS data extractor — loosely follows scripts/verify/pseo.js's
// approach, with one deliberate difference: field scanning stops at the
// first nested collection (liveLocations: [ ... ]) instead of running over
// the whole block. pseo.js's version (and run-priority-api.mjs's) scans the
// entire block body with a global regex, so on any entity that HAS a
// liveLocations array, `name:`/`lat:`/`lng:` etc. inside those nested shop
// objects overwrite the entity's own same-named top-level fields — the
// last match wins. Confirmed here: obj.name for area "malleswaram" (which
// has 19 liveLocations) resolved to the LAST shop's name, not "Malleswaram".
// Scoping to pre-liveLocations text avoids that entirely for the fields
// this script actually needs (slug, name, city, presence, lat, lng).
// ---------------------------------------------------------------------------
function extractDataBlocks(filePath) {
  if (!existsSync(filePath)) return [];
  const text = readFileSync(filePath, "utf8");
  const blocks = text.split("\n  {");
  const out = [];
  for (const block of blocks.slice(1)) {
    const end = block.search(/\n  },?/);
    if (end === -1) continue;
    let body = block.slice(0, end);
    // Stop before any nested array of objects (liveLocations, etc.) so its
    // inner fields can never shadow this entity's own top-level fields.
    const nestedStart = body.search(/\w+:\s*\[\s*\n\s*\{/);
    if (nestedStart !== -1) body = body.slice(0, nestedStart);
    const obj = {};
    const re = /(\w+):\s*(?:"((?:[^"\\]|\\.)*)"|'([^']*)'|([\d.]+)|true|false)/g;
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

const isLive = (presence) => presence === "live" || presence === "served";

// ---------------------------------------------------------------------------
// Shop index + nearest-shop lookup (colleges only; areas carry their own
// liveLocations count directly in the .ts data)
// ---------------------------------------------------------------------------
let _shops = null;
function loadShops() {
  if (_shops) return _shops;
  const found = SHOP_FILE_CANDIDATES.find((p) => existsSync(p));
  if (!found) { _shops = []; return _shops; }
  const text = readFileSync(found, "utf8");
  const out = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const rec = JSON.parse(trimmed);
      const lat = Number(rec.lat ?? rec.latitude ?? 0);
      const lng = Number(rec.lng ?? rec.longitude ?? 0);
      if (!lat || !lng) continue;
      out.push({
        name: (rec.name ?? rec.title ?? "Xerox Shop").toString().slice(0, 80),
        lat: Math.round(lat * 1e6) / 1e6,
        lng: Math.round(lng * 1e6) / 1e6,
        rating: typeof rec.rating === "number" ? rec.rating : undefined,
      });
    } catch {}
  }
  _shops = out;
  return _shops;
}

function nearestShopCount(lat, lng) {
  if (lat == null || lng == null) return 0;
  const origin = { lat, lng };
  return loadShops().filter((s) => haversineKm(origin, s) <= 1.5).length;
}

// ---------------------------------------------------------------------------
// Build the FAQ-relevant data record for one live entity
// ---------------------------------------------------------------------------
function cityName(citySlug, cities) {
  return cities.find((c) => c.slug === citySlug)?.name ?? citySlug;
}

// The question is fixed, not model-written — see the header comment for why.
function buildQuestion(name) {
  return `Is there a Snaprint kiosk near ${name}?`;
}

function buildQueue() {
  const cities = extractDataBlocks(CITIES_PATH);
  const areas = extractDataBlocks(AREAS_PATH).filter((a) => isLive(a.presence));
  const colleges = extractDataBlocks(COLLEGES_PATH).filter((c) => isLive(c.presence));
  const liveCities = cities.filter((c) => isLive(c.presence));

  const queue = [];

  for (const c of liveCities) {
    queue.push({
      kind: "city",
      slug: c.slug,
      name: c.name,
      cityName: c.name,
      // City-level shop count isn't tracked directly in cities.ts; areas
      // rolling up under it are the real signal, but for the FAQ prompt a
      // rough "many" proxy (count of live areas in this city) is enough.
      shopCount: String(areas.filter((a) => a.city === c.slug).length),
    });
  }

  for (const a of areas) {
    const locCount = (readFileSync(AREAS_PATH, "utf8").match(
      new RegExp(`slug:\\s*"${a.slug}"[\\s\\S]*?liveLocations:\\s*\\[([\\s\\S]*?)\\n {4}\\]`)
    ) || [, ""])[1];
    const shopCount = (locCount.match(/\n {6}\{\n {8}name:/g) || []).length;
    queue.push({
      kind: "area",
      slug: a.slug,
      name: a.name,
      cityName: cityName(a.city, cities),
      shopCount: String(shopCount),
    });
  }

  for (const c of colleges) {
    const lat = Number(c.lat);
    const lng = Number(c.lng);
    const shopCount = lat && lng ? nearestShopCount(lat, lng) : 0;
    queue.push({
      kind: "college",
      slug: c.slug,
      name: c.shortName || c.name,
      cityName: cityName(c.city, cities),
      shopCount: String(shopCount),
    });
  }

  const missing = queue.filter((item) => !existsSync(join(TAILS_DIR, `${item.kind}-${item.slug}.json`)));

  // Optional allowlist for a targeted/sample run: FAQ_TAIL_ONLY=slug1,slug2
  const only = process.env.FAQ_TAIL_ONLY;
  if (only) {
    const wanted = new Set(only.split(",").map((s) => s.trim()).filter(Boolean));
    return missing.filter((item) => wanted.has(item.slug));
  }
  return missing;
}

// ---------------------------------------------------------------------------
// Prompt + API call
// ---------------------------------------------------------------------------
function renderPrompt(template, item, question) {
  return template
    .replace(/\{\{question\}\}/g, question)
    .replace(/\{\{kind\}\}/g, item.kind)
    .replace(/\{\{name\}\}/g, item.name)
    .replace(/\{\{cityName\}\}/g, item.cityName)
    .replace(/\{\{slug\}\}/g, item.slug)
    .replace(/\{\{shopCount\}\}/g, item.shopCount);
}

async function callClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_AUTH_TOKEN;
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
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
  if (json.stop_reason === "max_tokens") {
    throw new Error(`response was truncated at max_tokens (${MAX_TOKENS}) — raise MAX_TOKENS or shorten the prompt`);
  }
  // Find the first "text" block, not content[0] — reasoning models on some
  // backends (e.g. Minimax) prepend a "thinking" block before the answer.
  const block = (json?.content ?? []).find((b) => b.type === "text");
  if (!block) {
    throw new Error(`No text block in response: ${JSON.stringify(json).slice(0, 200)}`);
  }
  return block.text;
}

function cleanAnswer(raw, label) {
  // Strip accidental quoting/fences even though the prompt says not to
  // include them — cheap defensive parse, model output is not a trust
  // boundary but is not 100% deterministic either.
  let a = raw.trim()
    .replace(/^```\s*/i, "").replace(/```\s*$/i, "")
    .replace(/^"(.*)"$/s, "$1")
    .trim();
  if (!a) {
    throw new Error(`${label}: model returned an empty answer`);
  }
  const wordCount = a.split(/\s+/).filter(Boolean).length;
  if (wordCount < 8 || wordCount > 70) {
    throw new Error(`${label}: answer word count ${wordCount} looks wrong (expected ~20-40): "${a.slice(0, 120)}"`);
  }
  if (/^yes[,.]?\s/i.test(a)) {
    throw new Error(`${label}: answer opens with an affirmative "Yes" — violates the no-false-kiosk-claim rule: "${a.slice(0, 120)}"`);
  }
  // Snaprint has zero kiosks installed anywhere as of writing this script.
  // "Expanding" / "rolling out" / "deploying" / "underway" all imply
  // deployment has started, which is false. If that ground truth changes
  // (first kiosk actually launches), update this list AND the prompt's
  // ground-truth line together — don't just loosen one side.
  const deploymentClaim = /\b(expand(?:ing|s)?|roll(?:ing)?\s*out|deploy(?:ing|ed)?|underway|being\s+installed)\b/i;
  if (deploymentClaim.test(a)) {
    throw new Error(`${label}: answer implies kiosk deployment is active/underway, but zero kiosks are live anywhere: "${a.slice(0, 120)}"`);
  }
  return a;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    console.error("[FATAL] Neither ANTHROPIC_API_KEY nor ANTHROPIC_AUTH_TOKEN is set.\n        export ANTHROPIC_API_KEY=sk-ant-...   then re-run.");
    process.exit(1);
  }
  if (!existsSync(PROMPT_PATH)) {
    console.error(`[FATAL] prompt template not found at ${PROMPT_PATH}`);
    process.exit(1);
  }
  if (!existsSync(TAILS_DIR)) {
    console.error(`[FATAL] ${TAILS_DIR} not found — create it first (or run once by hand).`);
    process.exit(1);
  }

  const template = readFileSync(PROMPT_PATH, "utf8");
  const queue = buildQueue();

  if (queue.length === 0) {
    console.log("Every live entity already has a faq-tails file. Nothing to do.");
    return;
  }
  console.log(`${queue.length} live entit${queue.length === 1 ? "y" : "ies"} missing a local FAQ tail.`);

  let ok = 0;
  let failed = 0;
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const label = `${item.kind}-${item.slug}`;
    console.log(`[${i + 1}/${queue.length}] generating ${label}...`);
    const question = buildQuestion(item.name);
    const prompt = renderPrompt(template, item, question);
    try {
      const raw = await callClaude(prompt);
      const answer = cleanAnswer(raw, label);
      const faqs = [{ q: question, a: answer }];
      writeFileSync(join(TAILS_DIR, `${label}.json`), JSON.stringify(faqs, null, 2) + "\n");
      ok++;
    } catch (err) {
      console.error(`  [fail] ${label}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n--- generate:faq-tails summary ---`);
  console.log(`ok=${ok} failed=${failed} total=${queue.length}`);
  console.log(`Run \`pnpm run build:bodies\` (or \`node scripts/build-faq-tails-ts.mjs\`) to compile the new files.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
