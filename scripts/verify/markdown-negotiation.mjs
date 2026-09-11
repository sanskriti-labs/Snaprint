#!/usr/bin/env node
/**
 * Live verifier for acceptmarkdown.com content negotiation (finding:
 * "Markdown content negotiation") and the agent-friendly-404 markdown body
 * (finding: "Agent-friendly 404s"). Runs against a real running server
 * (dev or deployed), not source files — the bug this exists to catch (a
 * middleware rewrite losing the original path across the rewrite boundary)
 * only shows up at request time, not by reading middleware.ts.
 *
 * Usage:
 *   node scripts/verify/markdown-negotiation.mjs <base-url>
 *   node scripts/verify/markdown-negotiation.mjs http://localhost:3000
 *   node scripts/verify/markdown-negotiation.mjs https://snaprints.com
 *
 * Checks:
 *   1. GET / with Accept: text/markdown returns Content-Type text/markdown
 *      with real Snaprint content (not the HTML app shell).
 *   2. A live blog post negotiates to markdown and includes its title.
 *   3. A live /print-near/<slug> entity negotiates to markdown and includes
 *      the entity's own body text (not another entity's, and not the
 *      homepage's — this is the specific bug the rewrite-header fix caught).
 *   4. A nonexistent path with Accept: text/markdown returns 404 with a
 *      markdown body naming that path and linking to /sitemap.xml.
 *   5. A nonexistent path with default Accept still returns a real HTTP 404
 *      (not 200 with the app shell) — the Agent-friendly-404 finding.
 *   6. The default (non-markdown) response on a negotiable page carries
 *      "Accept" in its Vary header — this is set by vercel.json at Vercel's
 *      edge layer (see next.config.mjs for why it can't be set any other
 *      way), so it is NOT observable against a local `next dev` server.
 *      Skipped with a note when baseUrl is localhost.
 */
const baseUrl = process.argv[2];
if (!baseUrl) {
  console.error("usage: node scripts/verify/markdown-negotiation.mjs <base-url>");
  process.exit(2);
}
const origin = new URL(baseUrl).origin;
const isLocal = /localhost|127\.0\.0\.1/.test(origin);

let failures = 0;
const fail = (msg) => { console.error(`[FAIL] ${msg}`); failures++; };
const ok = (msg) => { console.log(`[ OK ] ${msg}`); };
const skip = (msg) => { console.log(`[SKIP] ${msg}`); };

async function main() {
  // 1. Homepage
  {
    const res = await fetch(`${origin}/`, { headers: { Accept: "text/markdown" } });
    const contentType = res.headers.get("content-type") ?? "";
    const body = await res.text();
    if (!contentType.includes("text/markdown")) {
      fail(`/ with Accept: text/markdown returned Content-Type "${contentType}", expected text/markdown`);
    } else if (!body.includes("Snaprint")) {
      fail(`/ markdown body doesn't mention "Snaprint" — got: ${body.slice(0, 120)}`);
    } else {
      ok("/ negotiates to markdown with real content");
    }
  }

  // 2. Blog post
  {
    const slug = "print-from-your-phone-instantly";
    const res = await fetch(`${origin}/blog/${slug}`, { headers: { Accept: "text/markdown" } });
    const body = await res.text();
    if (res.status !== 200) {
      fail(`/blog/${slug} markdown negotiation returned ${res.status}`);
    } else if (!body.includes("Print From Your Phone")) {
      fail(`/blog/${slug} markdown body missing expected title — got: ${body.slice(0, 120)}`);
    } else {
      ok(`/blog/${slug} negotiates to markdown with its own title`);
    }
  }

  // 3. PSEO entity — the specific case that caught the rewrite-header bug:
  // an earlier version of this route returned the *homepage* markdown for
  // every unmatched or mis-threaded path instead of the entity's own body.
  {
    const slug = "koramangala";
    const res = await fetch(`${origin}/print-near/${slug}`, { headers: { Accept: "text/markdown" } });
    const body = await res.text();
    if (res.status !== 200) {
      fail(`/print-near/${slug} markdown negotiation returned ${res.status}`);
    } else if (!body.toLowerCase().includes("koramangala")) {
      fail(`/print-near/${slug} markdown body doesn't mention "Koramangala" — got: ${body.slice(0, 120)}`);
    } else if (body.startsWith("# Snaprint\n")) {
      fail(`/print-near/${slug} markdown negotiation returned the HOMEPAGE body instead of the entity's own — rewrite path is not reaching the route handler correctly`);
    } else {
      ok(`/print-near/${slug} negotiates to its own markdown body`);
    }
  }

  // 4. Unknown path + markdown Accept -> markdown 404
  {
    const deadPath = "/this-path-should-never-exist-verify-check";
    const res = await fetch(`${origin}${deadPath}`, { headers: { Accept: "text/markdown" } });
    const body = await res.text();
    if (res.status !== 404) {
      fail(`${deadPath} with Accept: text/markdown returned ${res.status}, expected 404`);
    } else if (!body.includes(deadPath) || !body.includes("/sitemap.xml")) {
      fail(`${deadPath} markdown 404 body missing the path or a sitemap link — got: ${body.slice(0, 200)}`);
    } else {
      ok("unknown path negotiates to a markdown 404 body pointing at the sitemap");
    }
  }

  // 5. Unknown path, default Accept -> real HTTP 404, not a 200 app shell
  {
    const deadPath = "/this-path-should-never-exist-verify-check";
    const res = await fetch(`${origin}${deadPath}`);
    if (res.status !== 404) {
      fail(`${deadPath} with default Accept returned ${res.status}, expected 404 (agent-friendly-404 finding)`);
    } else {
      ok("unknown path returns a real HTTP 404 for default (HTML) requests");
    }
  }

  // 6. Vary header on the default HTML response — edge-layer only, not
  // observable against `next dev` (see vercel.json + next.config.mjs).
  if (isLocal) {
    skip("Vary: Accept on the default HTML response is set by vercel.json at Vercel's edge layer — not observable against a local dev server. Verify manually after deploy: curl -sI <prod-url>/ | grep -i vary");
  } else {
    const res = await fetch(`${origin}/`);
    const vary = res.headers.get("vary") ?? "";
    if (!vary.toLowerCase().includes("accept")) {
      fail(`/ default response Vary header is "${vary}", missing "Accept"`);
    } else {
      ok('/ default response Vary header includes "Accept"');
    }
  }

  console.log("");
  console.log(failures === 0 ? "✓ all markdown negotiation checks passed" : `✗ ${failures} markdown negotiation check(s) failed`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
