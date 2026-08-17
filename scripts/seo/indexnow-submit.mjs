#!/usr/bin/env node
/**
 * Submit new/changed URLs in the live sitemap to IndexNow (Bing, and any
 * other IndexNow-participating engine) in one bulk call.
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
 * Delta tracking: sitemap.xml carries a <lastmod> per URL (set in
 * app/sitemap.ts). This script caches the {url: lastmod} map from the last
 * successful run in .indexnow-state.json and only resubmits URLs that are
 * new or whose lastmod advanced — so re-running after a small edit doesn't
 * resend all 249 URLs. --all bypasses the diff for the first run or a full
 * resync.
 *
 * Usage:
 *   node scripts/seo/indexnow-submit.mjs              # submit new/changed only
 *   node scripts/seo/indexnow-submit.mjs --all         # submit full sitemap
 *   node scripts/seo/indexnow-submit.mjs /print-near/x # submit specific path(s)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const STATE_PATH = resolve(REPO_ROOT, ".indexnow-state.json");

const SITE = "https://snaprints.com";
const KEY = "ee2134cbc6429c4e16fb63572c32e915";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function getSitemapEntries() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`fetch sitemap.xml failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>/g)].map(
    ([, url, lastmod]) => ({ url, lastmod })
  );
}

function loadState() {
  if (!existsSync(STATE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(STATE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
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

const args = process.argv.slice(2);
const submitAll = args.includes("--all");
const argUrls = args.filter((a) => a !== "--all");

let urls;
let newState;

if (argUrls.length > 0) {
  urls = argUrls.map((p) => new URL(p, SITE).toString());
  newState = null; // explicit paths don't represent full sitemap state
} else {
  const entries = await getSitemapEntries();
  const prevState = submitAll ? {} : loadState();
  const changed = entries.filter((e) => prevState[e.url] !== e.lastmod);
  urls = changed.map((e) => e.url);
  newState = Object.fromEntries(entries.map((e) => [e.url, e.lastmod]));

  if (urls.length === 0) {
    console.log("[ OK ] No new or changed URLs since last submission — nothing to do.");
    process.exit(0);
  }
}

console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);
const status = await submit(urls);
console.log(`[ OK ] IndexNow accepted (${status})`);
if (newState) saveState(newState);
