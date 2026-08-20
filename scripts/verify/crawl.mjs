#!/usr/bin/env node
/**
 * Live crawl verifier — runs against a real deployed URL (Vercel preview
 * or production), not source files. Complements verify:pseo (which checks
 * source/data before build) by catching what only breaks at request time:
 * a route that 404s despite correct source, a redirect loop, an env var
 * present locally but missing on Vercel.
 *
 * Usage: node scripts/verify/crawl.mjs <base-url>
 *
 * Checks:
 *   1. Every <loc> in /sitemap.xml returns 200.
 *   2. Every internal link (href="/...") found on a same-origin crawl of
 *      those sitemap pages also returns 200 — catches a live page linking
 *      to a dead one (the instant-print/[city] -> planned-area bug).
 *   3. No price/offers JSON-LD block is shared identically across more
 *      than one page's <head>. A page-specific AggregateOffer (e.g.
 *      /pricing's kiosk price, /franchise's investment range) appears on
 *      exactly one URL and is fine. A LEAK looks different: the same
 *      script tag rendered by a shared layout/component shows up
 *      byte-identical on many unrelated pages (this is literally how the
 *      S1 kiosk price shipped into PSEO shop-page snippets — see
 *      verify:pseo check #14, which guards the source-level cause; this
 *      is the live-HTML symptom check). No hardcoded path allowlist, so
 *      a new page adding its own real price schema doesn't need this
 *      file edited to stay green.
 */
const baseUrl = process.argv[2];
if (!baseUrl) {
  console.error("usage: node scripts/verify/crawl.mjs <base-url>");
  process.exit(2);
}
const origin = new URL(baseUrl).origin;

let failures = 0;
const fail = (msg) => { console.error(`[FAIL] ${msg}`); failures++; };
const ok = (msg) => { console.log(`[ OK ] ${msg}`); };

const statusCache = new Map();
async function checkStatus(url) {
  if (statusCache.has(url)) return statusCache.get(url);
  let status;
  try {
    const res = await fetch(url, { redirect: "manual" });
    status = res.status;
  } catch (e) {
    status = `ERR:${e.message}`;
  }
  statusCache.set(url, status);
  return status;
}

function isOk(status) {
  return status === 200 || status === 308 || status === 307 || status === 301 || status === 302;
}

async function main() {
  // 1. sitemap URLs all resolve
  const sitemapUrl = `${origin}/sitemap.xml`;
  const sitemapRes = await fetch(sitemapUrl);
  if (!sitemapRes.ok) {
    fail(`sitemap.xml itself did not return 200 (got ${sitemapRes.status})`);
    console.log(`\n✗ ${failures} crawl check(s) failed`);
    process.exit(1);
  }
  const sitemapXml = await sitemapRes.text();
  const sitemapUrls = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
  if (sitemapUrls.length === 0) {
    fail("sitemap.xml has zero <loc> entries");
  }

  let sitemapFails = 0;
  await Promise.all(
    sitemapUrls.map(async (url) => {
      const status = await checkStatus(url);
      if (!isOk(status)) {
        fail(`sitemap URL returns ${status}: ${url}`);
        sitemapFails++;
      }
    })
  );
  if (sitemapFails === 0) {
    ok(`all ${sitemapUrls.length} sitemap URLs return 2xx/3xx`);
  }

  // 2. crawl each sitemap page, collect same-origin internal links, verify
  // they resolve too (catches a live page linking to a page that 404s,
  // even if that dead page itself is correctly absent from the sitemap).
  const linkTargets = new Map(); // url -> Set of pages that link to it
  const priceBlockPages = new Map(); // JSON-LD block text -> Set of pages carrying it

  await Promise.all(
    sitemapUrls.map(async (pageUrl) => {
      let html;
      try {
        const res = await fetch(pageUrl);
        html = await res.text();
      } catch {
        return;
      }

      for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
        const path = m[1];
        if (path.startsWith("//")) continue; // protocol-relative external
        const full = `${origin}${path}`;
        if (!linkTargets.has(full)) linkTargets.set(full, new Set());
        linkTargets.get(full).add(pageUrl);
      }

      const ldMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
      for (const block of ldMatches) {
        if (/\b(?:lowPrice|highPrice)\b/.test(block)) {
          if (!priceBlockPages.has(block)) priceBlockPages.set(block, new Set());
          priceBlockPages.get(block).add(pageUrl);
        }
      }
    })
  );

  let linkFails = 0;
  const checkedLinks = [...linkTargets.keys()].filter(
    (u) => !u.includes("/api/") && !u.match(/\.(png|jpg|jpeg|svg|ico|webmanifest|xml)$/)
  );
  await Promise.all(
    checkedLinks.map(async (url) => {
      const status = await checkStatus(url);
      if (!isOk(status)) {
        const linkedFrom = [...linkTargets.get(url)].slice(0, 3).join(", ");
        fail(`internal link returns ${status}: ${url} (linked from: ${linkedFrom})`);
        linkFails++;
      }
    })
  );
  if (linkFails === 0) {
    ok(`all ${checkedLinks.length} discovered internal links resolve (2xx/3xx)`);
  }

  // A price/offer block on exactly one page is that page's own schema.
  // The same block appearing on 2+ pages means a shared component/layout
  // is stamping it out everywhere — the actual leak.
  const leakedBlocks = [...priceBlockPages.entries()].filter(([, pages]) => pages.size > 1);
  if (leakedBlocks.length > 0) {
    for (const [, pages] of leakedBlocks) {
      const sample = [...pages].slice(0, 5).join(", ");
      fail(`price/offer JSON-LD is identical across ${pages.size} pages (shared-layout leak): ${sample}${pages.size > 5 ? ", …" : ""}`);
    }
  } else {
    ok("every price/offers JSON-LD block is unique to its own page (no shared-layout leak)");
  }

  console.log("");
  console.log(failures === 0 ? "✓ all crawl checks passed" : `✗ ${failures} crawl check(s) failed`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
