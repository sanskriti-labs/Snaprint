#!/usr/bin/env node
/**
 * Sync the "### <City> neighbourhoods" sections of public/llms.txt with the
 * current content/pseo/areas.ts.
 *
 * Why this exists: those lines carry a per-area shop count ("— 20 shops").
 * Every `python scripts/scraper/process_areas.py <city>` run can change both
 * which areas are published and how many shops each holds, so the counts
 * drift silently. `verify:pseo` only checks URL parity, so a stale *count*
 * passes CI while telling crawlers something untrue. The 2026-08-17 area
 * reassignment fix moved 35 shops between areas and promoted 3 areas from
 * planned to live, which is what surfaced this.
 *
 * Run after regenerating areas.ts:
 *   node scripts/seo/sync-llms-txt.mjs           # rewrite in place
 *   node scripts/seo/sync-llms-txt.mjs --check   # exit 1 if out of date
 *
 * Only the neighbourhood sections are touched. College sections, core pages,
 * blog, legal and contact are left exactly as they are — those aren't derived
 * from areas.ts and are hand-maintained.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const AREAS_PATH = resolve(REPO_ROOT, "content/pseo/areas.ts");
const LLMS_PATH = resolve(REPO_ROOT, "public/llms.txt");
const SITE = "https://snaprints.com";

// City slug → the display name used in both the section header and the link
// text. Must match the "### <name> neighbourhoods" headers already in the file.
const CITY_DISPLAY = {
  bengaluru: "Bengaluru",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
  mumbai: "Mumbai",
  pune: "Pune",
  "delhi-ncr": "Delhi NCR",
};

const isPublished = (p) => p === "live" || p === "served";

/**
 * Parse areas.ts into {slug, name, city, shops}. Deliberately regex-based
 * rather than importing the TS module: this script must run without a TS
 * runner, exactly like scripts/verify/pseo.js. Shop count is the number of
 * `address:` keys inside the block, which is one per liveLocations entry.
 */
function parseAreas() {
  const text = readFileSync(AREAS_PATH, "utf8");
  const out = [];
  for (const chunk of text.split("\n  {").slice(1)) {
    const end = chunk.search(/\n  },?/);
    if (end === -1) continue;
    const body = chunk.slice(0, end);
    const slug = body.match(/slug:\s*"([^"]+)"/)?.[1];
    const name = body.match(/name:\s*"([^"]+)"/)?.[1];
    const city = body.match(/city:\s*"([^"]+)"/)?.[1];
    const presence = body.match(/presence:\s*"([^"]+)"/)?.[1];
    if (!slug || !isPublished(presence)) continue;
    out.push({ slug, name, city, shops: (body.match(/address:\s*"/g) || []).length });
  }
  return out;
}

function renderLine(area, cityDisplay) {
  const noun = area.shops === 1 ? "shop" : "shops";
  return `- [Print near ${area.name}, ${cityDisplay}](${SITE}/print-near/${area.slug}) — ${area.shops} ${noun}`;
}

function sync(original, areas) {
  const lines = original.split("\n");
  const byCity = new Map();
  for (const a of areas) {
    if (!byCity.has(a.city)) byCity.set(a.city, []);
    byCity.get(a.city).push(a);
  }
  // Preserve each section's existing order, appending newly-published areas
  // at the end. Reordering would produce a needlessly large diff and the
  // order carries editorial intent (busiest areas first).
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const header = lines[i].match(/^### (.+) neighbourhoods\s*$/);
    if (!header) {
      out.push(lines[i++]);
      continue;
    }
    const citySlug = Object.keys(CITY_DISPLAY).find((k) => CITY_DISPLAY[k] === header[1]);
    if (!citySlug) {
      out.push(lines[i++]);
      continue;
    }
    out.push(lines[i++]); // the header itself

    // Consume the section body up to the next header (or EOF).
    const body = [];
    while (i < lines.length && !/^#{2,3} /.test(lines[i])) body.push(lines[i++]);

    const areasHere = byCity.get(citySlug) ?? [];
    const bySlug = new Map(areasHere.map((a) => [a.slug, a]));
    const emitted = new Set();
    const rebuilt = [];
    for (const line of body) {
      const m = line.match(/\]\(.*\/print-near\/([a-z0-9-]+)\)/);
      if (!m) {
        rebuilt.push(line); // blank lines, prose
        continue;
      }
      const area = bySlug.get(m[1]);
      if (!area) continue; // no longer published — drop the line
      rebuilt.push(renderLine(area, CITY_DISPLAY[citySlug]));
      emitted.add(m[1]);
    }
    // Newly published areas go after the last existing link line.
    const additions = areasHere
      .filter((a) => !emitted.has(a.slug))
      .map((a) => renderLine(a, CITY_DISPLAY[citySlug]));
    if (additions.length) {
      let last = rebuilt.length - 1;
      while (last >= 0 && rebuilt[last].trim() === "") last--;
      rebuilt.splice(last + 1, 0, ...additions);
    }
    out.push(...rebuilt);
  }
  return out.join("\n");
}

const original = readFileSync(LLMS_PATH, "utf8");
const updated = sync(original, parseAreas());

if (process.argv.includes("--check")) {
  if (original !== updated) {
    console.error("[sync-llms-txt] public/llms.txt is out of date — run: node scripts/seo/sync-llms-txt.mjs");
    process.exit(1);
  }
  console.log("[sync-llms-txt] public/llms.txt is up to date");
} else if (original === updated) {
  console.log("[sync-llms-txt] already up to date, no changes written");
} else {
  writeFileSync(LLMS_PATH, updated);
  const countLines = (s) => (s.match(/\/print-near\/[a-z0-9-]+\)/g) || []).length;
  console.log(`[sync-llms-txt] updated public/llms.txt (${countLines(original)} → ${countLines(updated)} area links)`);
}
