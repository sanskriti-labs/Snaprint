import { Redis } from "@upstash/redis";
import { getAllSitePages } from "@/lib/site-urls";

/**
 * IndexNow submission, diffed against what we've already pushed.
 *
 * This used to run as scripts/seo/indexnow-submit.mjs, spawned as a child
 * process from the cron route. That broke in production: Vercel's function
 * bundler only traces static imports starting from route.ts, so it never
 * saw `@upstash/redis` being required inside the spawned script and left
 * it out of the deployed bundle entirely (Cannot find package
 * '@upstash/redis' imported from /var/task/scripts/seo/indexnow-submit.mjs).
 * The old script had zero npm dependencies, which is the only reason
 * spawning it ever worked. Running the logic in-process, imported directly
 * by the route, is what actually gets traced and bundled correctly.
 *
 * State: a Redis hash of url -> lastmod from the last successful run
 * (getAllSitePages() gives every page a real, stable lastModified date  -- 
 * unlike a `new Date()`-at-request-time value, this is safe to diff on).
 */

const SITE = "https://snaprints.com";
const KEY = "ee2134cbc6429c4e16fb63572c32e915";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const REDIS_KEY = "indexnow:submitted";

function makeClient(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

let client: Redis | null | undefined;
function redis(): Redis | null {
  if (client === undefined) client = makeClient();
  return client;
}

export interface IndexNowRunResult {
  urlCount: number;
  skipped: number;
  ok: boolean;
  error?: string;
}

export async function runIndexNowSync(): Promise<IndexNowRunResult> {
  const pages = getAllSitePages();

  const db = redis();
  if (!db) {
    return { urlCount: 0, skipped: 0, ok: false, error: "missing KV_REST_API_URL / KV_REST_API_TOKEN" };
  }

  const prevState = (await db.hgetall<Record<string, string>>(REDIS_KEY)) ?? {};
  const changed = pages.filter((p) => prevState[p.url] !== p.lastModified);

  if (changed.length === 0) {
    return { urlCount: 0, skipped: pages.length, ok: true };
  }

  const urls = changed.map((p) => p.url);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE).host,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      }),
    });

    if (res.status !== 200 && res.status !== 202) {
      const body = await res.text().catch(() => "");
      return { urlCount: 0, skipped: pages.length - urls.length, ok: false, error: `IndexNow submit failed: ${res.status} ${body}` };
    }

    const newState: Record<string, string> = {};
    for (const p of changed) newState[p.url] = p.lastModified;
    await db.hset(REDIS_KEY, newState);

    return { urlCount: urls.length, skipped: pages.length - urls.length, ok: true };
  } catch (err) {
    return { urlCount: 0, skipped: pages.length - urls.length, ok: false, error: String(err) };
  }
}
