import type { MetadataRoute } from "next";
import { getAllPostsMeta } from "@/lib/blog";

const siteUrl = "https://snaprints.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostsMeta().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: "2026-06-29",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: "2026-07-31",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts,
    {
      url: `${siteUrl}/privacy`,
      lastModified: "2026-07-30",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: "2026-07-30",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/refund-policy`,
      lastModified: "2026-07-30",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
