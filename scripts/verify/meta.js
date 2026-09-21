#!/usr/bin/env node
/**
 * Meta title/description length + sanity checker  --  runs against the
 * built HTML output, not source strings, so it catches the real
 * rendered value for every page including computed PSEO descriptions
 * (count + name + city interpolated per entity) and title-template
 * duplication bugs.
 *
 * Run via `pnpm verify:meta`. Requires a prior `next build` (reads
 * .next/server/app/**\/*.html). Exits non-zero on any failure.
 *
 * Bounds follow standard SERP truncation limits:
 *   title:       10-70 chars   (Google's cutoff is pixel-width, ~600px;
 *                               70 chars is the common char-count proxy)
 *   description: 50-165 chars  (Google truncates ~155-160 chars typically,
 *                               occasionally holds to ~165 on desktop)
 *
 * Also flags a duplicated "· Snaprint" suffix  --  the root layout's
 * title template already appends it, so any generateMetadata that
 * includes the literal suffix itself ships a doubled brand tag
 * ("... · Snaprint · Snaprint").
 */
const { readdirSync, readFileSync, statSync } = require("node:fs");
const { join } = require("node:path");

const APP_DIR = join(process.cwd(), ".next/server/app");
const TITLE_MIN = 10;
const TITLE_MAX = 70;
const DESC_MIN = 50;
const DESC_MAX = 165;

let failures = 0;
const fail = (msg) => { console.error(`[FAIL] ${msg}`); failures++; };
const ok = (msg) => { console.log(`[ OK ] ${msg}`); };

function walkHtmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkHtmlFiles(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

if (!statSync(APP_DIR, { throwIfNoEntry: false })) {
  fail(`${APP_DIR} not found  --  run "next build" before "verify:meta"`);
  process.exit(1);
}

const decodeEntities = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const files = walkHtmlFiles(APP_DIR);
let checked = 0;

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const route = "/" + file.slice(APP_DIR.length + 1).replace(/\.html$/, "").replace(/\/index$/, "");
  checked++;

  const titleM = html.match(/<title>([^<]*)<\/title>/);
  const title = titleM ? decodeEntities(titleM[1]) : null;
  if (!title) {
    fail(`${route}: no <title> tag`);
  } else {
    if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
      fail(`${route}: title length ${title.length} outside ${TITLE_MIN}-${TITLE_MAX} chars: "${title}"`);
    }
    const suffixCount = (title.match(/·\s*Snaprint/g) || []).length;
    if (suffixCount > 1) {
      fail(`${route}: title has "· Snaprint" repeated ${suffixCount}x (title-template + literal suffix both applied): "${title}"`);
    }
  }

  const descM = html.match(/<meta name="description" content="([^"]*)"/);
  const desc = descM ? decodeEntities(descM[1]) : null;
  if (!desc) {
    fail(`${route}: no <meta name="description">`);
  } else if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
    fail(`${route}: description length ${desc.length} outside ${DESC_MIN}-${DESC_MAX} chars: "${desc}"`);
  }
}

ok(`checked title + description on ${checked} built pages`);
console.log("");
console.log(failures === 0 ? "✓ all meta checks passed" : `✗ ${failures} meta check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
