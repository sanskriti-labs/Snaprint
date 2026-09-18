#!/usr/bin/env node
/**
 * Fast blog frontmatter checker — reads content/blog/*.mdx directly via
 * gray-matter, no `next build` required. Runs in well under a second, so
 * it's cheap enough to run on every `pnpm dev` / `pnpm build` invocation
 * (wired into build:bodies) rather than only being caught by the full
 * verify:meta pass against built HTML.
 *
 * Checks the same bounds as scripts/verify/meta.js — kept in sync
 * manually since one runs pre-build (source frontmatter) and the other
 * post-build (rendered HTML); update both if the bounds ever change.
 *
 * Mirrors the root layout's title template ("%s · Snaprint",
 * app/layout.tsx) to check the *rendered* title length, not just the
 * raw frontmatter string — a title can pass at the source and still
 * blow the SERP limit once the suffix is appended.
 *
 * Run via `pnpm verify:blog-meta`.
 */
const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const matter = require("gray-matter");

const BLOG_DIR = join(process.cwd(), "content/blog");
const TITLE_SUFFIX = " · Snaprint";
const TITLE_MIN = 10;
const TITLE_MAX = 70;
const DESC_MIN = 50;
const DESC_MAX = 165;
const REQUIRED_FIELDS = ["title", "description", "date", "audience", "keywords"];

let failures = 0;
const fail = (file, msg) => { console.error(`[FAIL] ${file}: ${msg}`); failures++; };
const ok = (msg) => { console.log(`[ OK ] ${msg}`); };

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

for (const file of files) {
  const raw = readFileSync(join(BLOG_DIR, file), "utf8");
  const { data } = matter(raw);

  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      fail(file, `missing required frontmatter field "${field}"`);
    }
  }

  if (!data.title) continue; // remaining checks need a title to be meaningful

  if (data.title.includes(TITLE_SUFFIX.trim())) {
    fail(file, `title already contains "${TITLE_SUFFIX.trim()}" — the root layout's title template appends "${TITLE_SUFFIX}" automatically, this will double up. (A title that simply starts with the brand name, e.g. "Snaprint Franchise: ...", is fine — this only flags the literal separator+suffix pattern.)`);
  }

  const renderedTitle = `${data.title}${TITLE_SUFFIX}`;
  if (renderedTitle.length < TITLE_MIN || renderedTitle.length > TITLE_MAX) {
    fail(file, `rendered title length ${renderedTitle.length} outside ${TITLE_MIN}-${TITLE_MAX} chars (raw title is ${data.title.length} chars + "${TITLE_SUFFIX}"): "${renderedTitle}"`);
  }

  if (data.description) {
    const len = data.description.length;
    if (len < DESC_MIN || len > DESC_MAX) {
      fail(file, `description length ${len} outside ${DESC_MIN}-${DESC_MAX} chars: "${data.description}"`);
    }
  }

  if (data.audience && !["B2B", "B2C"].includes(data.audience)) {
    fail(file, `audience "${data.audience}" is not "B2B" or "B2C"`);
  }

  if (data.keywords && (!Array.isArray(data.keywords) || data.keywords.length === 0)) {
    fail(file, `keywords must be a non-empty array`);
  }

  if (data.slug && data.slug !== file.replace(/\.mdx$/, "")) {
    fail(file, `frontmatter slug "${data.slug}" does not match filename`);
  }
}

if (failures === 0) {
  ok(`checked title + description on ${files.length} blog posts`);
  console.log("\n✓ all blog-meta checks passed");
  process.exit(0);
} else {
  console.error(`\n✗ ${failures} blog-meta check(s) failed`);
  process.exit(1);
}
