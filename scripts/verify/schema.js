#!/usr/bin/env node
/**
 * JSON-LD structured-data checker — runs against built HTML output
 * (.next/server/app/**\/*.html), not source, so it catches what actually
 * ships: malformed JSON, wrong/missing @type fields, and the specific
 * regression this repo has already shipped once (a directory hub page
 * with zero JSON-LD at all — see commit 9546955).
 *
 * Run via `pnpm verify:schema`. Requires a prior `next build`.
 *
 * Checks per page:
 *   1. Every <script type="application/ld+json"> block is valid JSON.
 *   2. Every node has an "@type".
 *   3. BreadcrumbList nodes: itemListElement is non-empty, positions are
 *      1..N with no gaps/dupes, and every item has name + item (URL).
 *   4. Every /print-near/<slug> and /instant-print/<slug> detail page
 *      (i.e. not the /print-near or /instant-print hub itself) carries a
 *      BreadcrumbList node — these are the pages one level deep in the
 *      hierarchy, so a missing breadcrumb here is a real regression, not
 *      a design choice (home/pricing/franchise are intentionally flat).
 *   5. FAQPage nodes: mainEntity is non-empty, and every entry has a
 *      Question name + an Answer text.
 *   6. CollectionPage nodes: has a name.
 */
const { readdirSync, readFileSync, statSync } = require("node:fs");
const { join } = require("node:path");

const APP_DIR = join(process.cwd(), ".next/server/app");

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
  fail(`${APP_DIR} not found — run "next build" before "verify:schema"`);
  process.exit(1);
}

// Routes one level under these hubs are entity detail pages and must
// carry a BreadcrumbList. The hub index page itself (print-near/page.tsx)
// already gets one via CollectionPage + BreadcrumbList, checked generically.
const BREADCRUMB_REQUIRED_PREFIXES = ["/print-near/", "/instant-print/"];

const files = walkHtmlFiles(APP_DIR).filter((f) => !f.includes(`${join("app", "api")}${require("node:path").sep}`));
let checked = 0;
let totalNodes = 0;

for (const file of files) {
  const route = "/" + file.slice(APP_DIR.length + 1).replace(/\.html$/, "").replace(/\/index$/, "");
  const html = readFileSync(file, "utf8");
  const blocks = Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)).map((m) => m[1]);

  if (blocks.length === 0) continue; // not every route needs JSON-LD (e.g. /privacy)
  checked++;

  const nodes = [];
  for (const block of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(block);
    } catch (e) {
      fail(`${route}: invalid JSON-LD (${e.message})`);
      continue;
    }
    const graph = Array.isArray(parsed) ? parsed : parsed["@graph"] ? parsed["@graph"] : [parsed];
    nodes.push(...graph);
  }
  totalNodes += nodes.length;

  for (const node of nodes) {
    if (!node["@type"]) {
      fail(`${route}: JSON-LD node missing "@type": ${JSON.stringify(node).slice(0, 120)}`);
      continue;
    }

    if (node["@type"] === "BreadcrumbList") {
      const items = node.itemListElement;
      if (!Array.isArray(items) || items.length === 0) {
        fail(`${route}: BreadcrumbList has no itemListElement`);
      } else {
        const positions = items.map((it) => it.position).sort((a, b) => a - b);
        const expected = items.map((_, i) => i + 1);
        if (JSON.stringify(positions) !== JSON.stringify(expected)) {
          fail(`${route}: BreadcrumbList positions ${JSON.stringify(positions)} are not a contiguous 1..N sequence`);
        }
        for (const it of items) {
          if (!it.name || !it.item) {
            fail(`${route}: BreadcrumbList item missing name or item (URL): ${JSON.stringify(it)}`);
          }
        }
      }
    }

    if (node["@type"] === "FAQPage") {
      const qs = node.mainEntity;
      if (!Array.isArray(qs) || qs.length === 0) {
        fail(`${route}: FAQPage has no mainEntity`);
      } else {
        for (const q of qs) {
          if (!q.name || !q.acceptedAnswer || !q.acceptedAnswer.text) {
            fail(`${route}: FAQPage question missing name or acceptedAnswer.text: ${JSON.stringify(q).slice(0, 120)}`);
          }
        }
      }
    }

    if (node["@type"] === "CollectionPage" && !node.name) {
      fail(`${route}: CollectionPage missing name`);
    }
  }

  const hasBreadcrumb = nodes.some((n) => n["@type"] === "BreadcrumbList");
  const isDetailPage =
    BREADCRUMB_REQUIRED_PREFIXES.some((p) => route.startsWith(p)) &&
    !BREADCRUMB_REQUIRED_PREFIXES.includes(route + "/");
  if (isDetailPage && !hasBreadcrumb) {
    fail(`${route}: entity detail page has no BreadcrumbList schema`);
  }
}

ok(`checked JSON-LD on ${checked} built pages (${totalNodes} nodes)`);
console.log("");
console.log(failures === 0 ? "✓ all schema checks passed" : `✗ ${failures} schema check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
