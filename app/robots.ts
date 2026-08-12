import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Citation bots — explicitly allow so AI search engines can quote us
      {
        userAgent: ["OAI-SearchBot", "ClaudeBot", "Claude-SearchBot", "PerplexityBot"],
        allow: "/",
      },
      // Training bots — block from training but user-fetch bots may still cite
      {
        userAgent: ["GPTBot", "anthropic-ai", "Google-Extended"],
        disallow: "/",
      },
      // Everyone else
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://snaprints.com/sitemap.xml",
  };
}
