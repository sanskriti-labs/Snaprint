#!/usr/bin/env node
/**
 * Submit every URL in the live sitemap to IndexNow (Bing, and any other
 * IndexNow-participating engine) in one bulk call.
 *
 * Why not Bing Webmaster Tools' own "submit URL" UI: that's one URL at a
 * time by hand. Why not the CMS-plugin integrations indexnow.org lists:
 * this is a hand-rolled Next.js site, not Wordpress/Shopify/etc, so no
 * plugin applies. IndexNow itself is just a key file + an HTTP POST — no
 * Bing Webmaster account or site verification required for this endpoint.
 *
 * Setup (one-time):
 *   1. public/<key>.txt already exists containing just the key.
 *   2. That key is hardcoded below (KEY) — matches the deployed file.
 *
 * Usage:
 *   node scripts/seo/indexnow-submit.mjs              # submit full sitemap
 *   node scripts/seo/indexnow-submit.mjs /print-near/x # submit specific path(s)
 */

const SITE = "https://snaprints.com";
const KEY = "ee2134cbc6429c4e16fb63572c32e915";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function getSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`fetch sitemap.xml failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

async function submit(urlList) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });
  // IndexNow returns 200/202 on success, 200 even for partial-key-format
  // issues in some implementations — surface the body on anything else.
  if (res.status !== 200 && res.status !== 202) {
    const body = await res.text().catch(() => "");
    throw new Error(`IndexNow submit failed: ${res.status} ${body}`);
  }
  return res.status;
}

const argUrls = process.argv.slice(2);
const urls = argUrls.length > 0 ? argUrls.map((p) => new URL(p, SITE).toString()) : await getSitemapUrls();

console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);
const status = await submit(urls);
console.log(`[ OK ] IndexNow accepted (${status})`);
