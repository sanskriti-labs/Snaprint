#!/usr/bin/env node
/**
 * GSC Search Analytics export.
 *
 * Reads OAuth credentials from environment, refreshes an access token,
 * calls the Google Search Console Search Analytics API, and writes the
 * response to reports/gsc-YYYY-MM-DD.json.
 *
 * Required env vars:
 *   GSC_REFRESH_TOKEN  — OAuth2 refresh token (long-lived)
 *   GSC_CLIENT_ID      — OAuth2 client id from Google Cloud Console
 *   GSC_CLIENT_SECRET  — OAuth2 client secret
 *
 * Optional env vars:
 *   GSC_SITE_URL       — site URL as GSC expects it (default: "sc-domain:snaprints.com")
 *   GSC_START_DATE     — ISO date (default: 2025-08-01, the earliest meaningful window)
 *
 * Usage:
 *   node scripts/seo/gsc-export.mjs
 *
 * No new dependencies — uses Node 18+ global `fetch` and built-in fs/path.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const REQUIRED_ENV = ["GSC_REFRESH_TOKEN", "GSC_CLIENT_ID", "GSC_CLIENT_SECRET"];
const TODAY = new Date().toISOString().slice(0, 10);
const DEFAULT_START_DATE = "2025-08-01";

function readEnv() {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(
      `[gsc-export] Missing required env vars: ${missing.join(", ")}.\n` +
        "See docs/seo/gsc-api-setup.md for how to obtain these."
    );
    process.exit(2);
  }
  return {
    refreshToken: process.env.GSC_REFRESH_TOKEN,
    clientId: process.env.GSC_CLIENT_ID,
    clientSecret: process.env.GSC_CLIENT_SECRET,
    siteUrl: process.env.GSC_SITE_URL || "sc-domain:snaprints.com",
    startDate: process.env.GSC_START_DATE || DEFAULT_START_DATE,
    endDate: TODAY,
  };
}

/**
 * Exchange a refresh token for a short-lived access token.
 * https://developers.google.com/identity/protocols/oauth2/web-server#offline
 */
async function fetchAccessToken({ clientId, clientSecret, refreshToken }) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `OAuth token refresh failed: ${res.status} ${res.statusText}\n${text}`
    );
  }
  const json = await res.json();
  if (!json.access_token) {
    throw new Error("OAuth response did not include access_token");
  }
  return json.access_token;
}

/**
 * Call the GSC Search Analytics API.
 * Docs: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
 *
 * The API caps rowCount at 25,000 and returns up to that many rows. For
 * snaprints.com this is more than enough — we rarely exceed a few hundred
 * distinct (query, page, country, device) tuples per day.
 */
async function fetchSearchAnalytics({ accessToken, siteUrl, startDate, endDate }) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    siteUrl
  )}/searchAnalytics/query`;

  const body = {
    startDate,
    endDate,
    dimensions: ["query", "page", "country", "device"],
    rowLimit: 25000,
    startRow: 0,
    aggregationType: "auto",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `GSC Search Analytics call failed: ${res.status} ${res.statusText}\n${text}`
    );
  }
  return res.json();
}

// Vercel functions only allow writes under /tmp; everywhere else (local dev,
// CI) the repo's own gitignored reports/ dir is writable and persists.
function reportsDir() {
  return process.env.VERCEL ? "/tmp/reports" : join(process.cwd(), "reports");
}

function writeReport({ rows, env, payload }) {
  const dir = reportsDir();
  mkdirSync(dir, { recursive: true });

  const outPath = join(dir, `gsc-${TODAY}.json`);
  const enriched = {
    fetchedAt: new Date().toISOString(),
    siteUrl: env.siteUrl,
    startDate: env.startDate,
    endDate: env.endDate,
    rowCount: rows.length,
    payload,
  };
  writeFileSync(outPath, JSON.stringify(enriched, null, 2));
  return { outPath, enriched };
}

async function main() {
  const env = readEnv();
  console.log(
    `[gsc-export] Refreshing access token for site ${env.siteUrl} ` +
      `(window ${env.startDate} → ${env.endDate})`
  );

  try {
    const accessToken = await fetchAccessToken(env);
    const payload = await fetchSearchAnalytics({
      accessToken,
      siteUrl: env.siteUrl,
      startDate: env.startDate,
      endDate: env.endDate,
    });
    const rows = payload.rows || [];
    const { outPath, enriched } = writeReport({ rows, env, payload });

    console.log(
      `[gsc-export] OK — fetched ${rows.length} row${rows.length === 1 ? "" : "s"}; ` +
        `wrote ${outPath}`
    );
    // Machine-readable line the caller (the cron route) can grep out of
    // stdout — /tmp on Vercel isn't retrievable after the invocation ends,
    // so this is the actual way to get the data out, not the file on disk.
    console.log(`GSC_REPORT_JSON=${JSON.stringify(enriched)}`);
  } catch (err) {
    console.error(`[gsc-export] FAILED: ${err.message}`);
    process.exit(1);
  }
}

main();
