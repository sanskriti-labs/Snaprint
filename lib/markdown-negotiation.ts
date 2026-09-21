import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllPostSlugs } from "@/lib/blog";
import {
  getArea,
  getCollege,
  getCity,
  getCityName,
} from "@/content/pseo/seo";
import { bodies } from "@/content/pseo/bodies";
import type { Slug } from "@/content/pseo/types";

const SITE_URL = "https://snaprints.com";
const BLOG_DIR = path.join(process.cwd(), "content/blog");

/**
 * acceptmarkdown.com content negotiation: given a request path, resolve the
 * markdown representation for it, or null if this path has no markdown
 * variant (caller falls back to a 404 markdown body  --  see
 * app/api/markdown/route.ts). Kept separate from the route handler mainly
 * for readability  --  scripts/verify/markdown-negotiation.mjs tests this
 * behavior live over HTTP, not by importing this module directly, since the
 * bug that motivated that script (a middleware rewrite losing the request
 * path) only reproduces through a real request.
 */
export function resolveMarkdownForPath(pathname: string): string | null {
  const clean = pathname.replace(/\/+$/, "") || "/";

  if (clean === "/") return homeMarkdown();

  const blogMatch = clean.match(/^\/blog\/([a-zA-Z0-9][a-zA-Z0-9_-]{0,199})$/);
  if (blogMatch) return blogPostMarkdown(blogMatch[1]);

  const printNearMatch = clean.match(/^\/print-near\/([a-zA-Z0-9-]+)$/);
  if (printNearMatch) return printNearMarkdown(printNearMatch[1] as Slug);

  const instantPrintMatch = clean.match(/^\/instant-print\/([a-zA-Z0-9-]+)$/);
  if (instantPrintMatch) return instantPrintMarkdown(instantPrintMatch[1] as Slug);

  return null;
}

// public/llms.txt is the canonical short-form site description (kept in
// sync with content/pseo/areas.ts by scripts/seo/sync-llms-txt.mjs)  --  the
// homepage's markdown variant reuses it directly instead of maintaining a
// second, driftable copy of the same "when to use" guidance and page index.
const LLMS_TXT_PATH = path.join(process.cwd(), "public/llms.txt");

function homeMarkdown(): string {
  return fs.readFileSync(LLMS_TXT_PATH, "utf8");
}

function blogPostMarkdown(slug: string): string | null {
  if (!getAllPostSlugs().includes(slug)) return null;
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const title = typeof data.title === "string" ? data.title : slug;
  const description = typeof data.description === "string" ? data.description : "";
  return `# ${title}\n\n${description ? `> ${description}\n\n` : ""}${content.trim()}\n`;
}

function printNearMarkdown(slug: Slug): string | null {
  const college = getCollege(slug);
  const area = college ? null : getArea(slug);
  const entity = college ?? area;
  if (!entity) return null;

  const kind = college ? "college" : "area";
  const key = `${kind}-${slug}`;
  const body = bodies[key];
  const cityName = getCityName(entity.city);

  return `# Print shops near ${entity.name}, ${cityName}

${body ? body.markdown : ""}

Full listing with addresses and live shop count: ${SITE_URL}/print-near/${slug}
`;
}

function instantPrintMarkdown(slug: Slug): string | null {
  const city = getCity(slug);
  if (!city) return null;
  const body = bodies[`city-${slug}`];

  return `# Print and xerox shops in ${city.name}

${body ? body.markdown : ""}

Full listing: ${SITE_URL}/instant-print/${slug}
`;
}

/** Short markdown body for a path with no HTML page and no markdown variant. Doubles as the 404 markdown body (acceptmarkdown.com + agent-friendly-404 fixes share this). */
export function notFoundMarkdown(pathname: string): string {
  return `# 404  --  page not found

\`${pathname}\` does not exist on snaprints.com.

## Where to look next

- [Sitemap](${SITE_URL}/sitemap.xml)  --  full list of live pages
- [llms.txt](${SITE_URL}/llms.txt)  --  site description and page index for AI agents
- [Homepage](${SITE_URL}/)
- [Find a Snaprint kiosk](${SITE_URL}/find-snaprint)
- [Print shop directory](${SITE_URL}/print-near)
`;
}
