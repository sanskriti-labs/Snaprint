#!/usr/bin/env node
/**
 * Canonical / robots / social-tag checker — runs against built HTML
 * output (.next/server/app/**\/*.html), same convention as verify:meta
 * and verify:schema. Requires a prior `next build`.
 *
 * Checks per page:
 *   1. Exactly one <link rel="canonical"> tag, self-referencing (its
 *      href path matches the page's own route) and absolute https URL
 *      on the production domain. A canonical pointing at a *different*
 *      page silently tells Google to ignore this one; a relative or
 *      wrong-host canonical is either ignored or points at the wrong
 *      site entirely.
 *   2. <meta name="robots"> either absent (defaults to index,follow) or
 *      explicitly "index, follow" — catches an accidental noindex
 *      shipping on a page that should rank (this is how a whole
 *      directory can vanish from search with no build error).
 *   3. og:title/description are present, and twitter:title/description
 *      are present AND non-empty — this repo shipped 194 PSEO pages
 *      with a real per-page og:title but the generic sitewide
 *      twitter:title (Next.js doesn't cascade openGraph -> twitter),
 *      so every one of those pages showed the wrong preview on X/Twitter
 *      shares. This check catches the same class of drift again.
 *   4. Exactly one <h1> per page — zero confuses SEO tools about the
 *      page's topic, more than one dilutes it and is usually a markup
 *      bug (duplicate hero on error boundary, etc).
 *   5. Every <img> has a non-empty alt attribute (empty alt="" is valid
 *      for decorative images and is allowed; a missing attribute is not).
 *
 * Run via `pnpm verify:seo-tags`.
 */
const { readdirSync, readFileSync, statSync } = require("node:fs");
const { join, sep } = require("node:path");

const APP_DIR = join(process.cwd(), ".next/server/app");
const SITE_HOST = "snaprints.com";

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
  fail(`${APP_DIR} not found — run "next build" before "verify:seo-tags"`);
  process.exit(1);
}

const decodeEntities = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const files = walkHtmlFiles(APP_DIR).filter((f) => !f.includes(`${sep}api${sep}`));
let checked = 0;

for (const file of files) {
  const rel = file.slice(APP_DIR.length + 1).replace(/\.html$/, "");
  const route = "/" + rel.replace(/(^|\/)index$/, "");
  const html = readFileSync(file, "utf8");

  // Next's built-in 404 page is intentionally noindex and has no real
  // route of its own (it renders for any unmatched path) — canonical/
  // robots rules for real content pages don't apply to it.
  if (route === "/_not-found") continue;
  checked++;

  // 1. canonical
  const canonicals = Array.from(html.matchAll(/<link rel="canonical" href="([^"]*)"/g)).map((m) => m[1]);
  if (canonicals.length === 0) {
    fail(`${route}: no <link rel="canonical">`);
  } else if (canonicals.length > 1) {
    fail(`${route}: ${canonicals.length} canonical tags (expected exactly 1): ${canonicals.join(", ")}`);
  } else {
    const href = canonicals[0];
    let url;
    try {
      url = new URL(href);
    } catch {
      fail(`${route}: canonical href is not an absolute URL: "${href}"`);
      url = null;
    }
    if (url) {
      if (url.protocol !== "https:" || url.host !== SITE_HOST) {
        fail(`${route}: canonical points off-site: "${href}"`);
      }
      const canonicalPath = url.pathname.replace(/\/$/, "") || "/";
      const routePath = route.replace(/\/$/, "") || "/";
      if (canonicalPath !== routePath) {
        fail(`${route}: canonical path "${canonicalPath}" doesn't match its own route`);
      }
    }
  }

  // 2. robots meta — /style is an internal design-system preview,
  // deliberately noindexed and excluded from the sitemap; it's not a
  // content page and shouldn't trip the "accidental noindex" check.
  const robotsM = html.match(/<meta name="robots" content="([^"]*)"/);
  if (robotsM && route !== "/style") {
    const content = robotsM[1].toLowerCase();
    if (content.includes("noindex")) {
      fail(`${route}: <meta name="robots"> contains "noindex": "${robotsM[1]}"`);
    }
  }

  // 3. og / twitter tag parity
  const ogTitleM = html.match(/<meta property="og:title" content="([^"]*)"/);
  const ogDescM = html.match(/<meta property="og:description" content="([^"]*)"/);
  const twTitleM = html.match(/<meta name="twitter:title" content="([^"]*)"/);
  const twDescM = html.match(/<meta name="twitter:description" content="([^"]*)"/);

  if (!ogTitleM) fail(`${route}: missing og:title`);
  if (!ogDescM) fail(`${route}: missing og:description`);
  if (!twTitleM || !twTitleM[1]) fail(`${route}: missing or empty twitter:title`);
  if (!twDescM || !twDescM[1]) fail(`${route}: missing or empty twitter:description`);

  if (ogTitleM && twTitleM && decodeEntities(ogTitleM[1]) !== decodeEntities(twTitleM[1])) {
    fail(`${route}: og:title and twitter:title diverge — og:"${ogTitleM[1]}" twitter:"${twTitleM[1]}" (twitter is likely stuck on the sitewide default)`);
  }

  // 4. exactly one h1
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count === 0) {
    fail(`${route}: no <h1> found`);
  } else if (h1Count > 1) {
    fail(`${route}: ${h1Count} <h1> tags found (expected exactly 1)`);
  }

  // 5. every img has an alt attribute (empty alt="" is fine; missing is not)
  const imgs = Array.from(html.matchAll(/<img\b[^>]*>/g)).map((m) => m[0]);
  const missingAlt = imgs.filter((tag) => !/\balt="/.test(tag));
  if (missingAlt.length > 0) {
    fail(`${route}: ${missingAlt.length} <img> tag(s) missing alt attribute`);
  }
}

ok(`checked canonical/robots/social-tags/h1/alt on ${checked} built pages`);

// 6. sitemap.xml: every <loc> is https://snaprints.com/* — no bare "www."
// host. A stray www. entry would either 404 (if www isn't set up) or
// split link equity across two hosts if it does resolve.
const sitemapPath = join(APP_DIR, "sitemap.xml.body");
if (statSync(sitemapPath, { throwIfNoEntry: false })) {
  const sitemapXml = readFileSync(sitemapPath, "utf8");
  const locs = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
  const badHost = locs.filter((u) => {
    try {
      const { protocol, host } = new URL(u);
      return protocol !== "https:" || host !== SITE_HOST;
    } catch {
      return true;
    }
  });
  if (locs.length === 0) {
    fail("sitemap.xml has zero <loc> entries");
  } else if (badHost.length > 0) {
    for (const u of badHost.slice(0, 10)) fail(`sitemap.xml has a non-canonical-host URL: ${u}`);
  } else {
    ok(`sitemap.xml: all ${locs.length} URLs are https://${SITE_HOST}/*`);
  }
} else {
  fail(`${sitemapPath} not found — sitemap host check skipped`);
}

console.log("");
console.log(failures === 0 ? "✓ all seo-tags checks passed" : `✗ ${failures} seo-tags check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
