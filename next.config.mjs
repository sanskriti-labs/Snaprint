import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import createBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // The Vary: Accept header for acceptmarkdown.com content negotiation
  // (finding: markdown content negotiation) is set in vercel.json, not here.
  // Next's App Router calls res.setHeader("vary", ...) unconditionally deep
  // in base-server.js (setVaryHeader) on every page response, which
  // *overwrites* anything a next.config.mjs headers() rule or middleware.ts
  // already put there — there is no supported way to append to it from
  // application code. vercel.json's headers run at Vercel's edge layer, on
  // the response Next.js already finished building, so it lands after that
  // overwrite instead of before it. See middleware.ts +
  // lib/markdown-negotiation.ts for the negotiation logic itself.
  async redirects() {
    return [
      {
        source: "/blog/snaprint-vs-atomte-vs-qwikprint-comparison",
        destination: "/blog/print-kiosk-pricing-models-compared",
        permanent: true,
      },
      {
        source: "/pricing",
        destination: "/#pricing",
        permanent: true,
      },
      // Stale external links (old llms.txt) pointed here — the brochure has
      // always lived at /franchisebrochure.
      {
        source: "/franchise/brochure",
        destination: "/franchisebrochure",
        permanent: true,
      },
      // GSC 404s from slugs Google discovered off old sitemaps. `frazer-town`
      // is a spelling variant of the live `fraser-town` page; the rest are
      // real Bengaluru localities with no dedicated page yet, so send them to
      // the directory hub rather than leaving a dead end.
      {
        source: "/print-near/frazer-town",
        destination: "/print-near/fraser-town",
        permanent: true,
      },
      {
        source: "/print-near/:slug(sadashivanagar|mg-road|avenue-road)",
        destination: "/print-near",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
  },
});

// Run `ANALYZE=true pnpm build` to inspect bundle composition.
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(withMDX(nextConfig));
