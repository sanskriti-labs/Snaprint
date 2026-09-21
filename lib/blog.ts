import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const SAFE_SLUG = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,199}$/;

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  audience: "B2C" | "B2B";
  keywords: string[];
  lang?: string;
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
  readingTime: string;
};

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostMeta(slug: string): BlogPostMeta {
  if (!SAFE_SLUG.test(slug)) {
    throw new Error(`Invalid slug: ${JSON.stringify(slug)}`);
  }
  const filePath = path.resolve(BLOG_DIR, `${slug}.mdx`);
  if (!filePath.startsWith(BLOG_DIR + path.sep)) {
    throw new Error(`Slug escapes BLOG_DIR: ${JSON.stringify(slug)}`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as BlogFrontmatter;
  return {
    ...frontmatter,
    slug,
    readingTime: readingTime(content).text,
  };
}

export function getAllPostsMeta(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map(getPostMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
