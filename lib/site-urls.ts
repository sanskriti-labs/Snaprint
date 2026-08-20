import { getAllPostsMeta } from "@/lib/blog";
import {
  getAllCitySlugs,
  getCity,
  getAllCollegeSlugs,
  getCollege,
  getAllAreaSlugs,
  getArea,
} from "@/content/pseo/seo";

export const siteUrl = "https://snaprints.com";

export interface SitePage {
  url: string;
  lastModified: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

// Single source of truth for every indexable URL on the site — sitemap.ts
// and the IndexNow submission script both read from here so neither can
// drift out of sync with the other.
export function getAllSitePages(): SitePage[] {
  const posts = getAllPostsMeta().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const cities = getAllCitySlugs().map((slug) => {
    const city = getCity(slug);
    return {
      url: `${siteUrl}/instant-print/${slug}`,
      lastModified: city?.lastReviewed ?? "2026-08-03",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  const colleges = getAllCollegeSlugs().map((slug) => {
    const college = getCollege(slug);
    return {
      url: `${siteUrl}/print-near/${slug}`,
      lastModified: college?.lastReviewed ?? "2026-08-03",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  const areas = getAllAreaSlugs().map((slug) => {
    const area = getArea(slug);
    return {
      url: `${siteUrl}/print-near/${slug}`,
      lastModified: area?.lastReviewed ?? "2026-08-03",
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

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
    {
      url: `${siteUrl}/book`,
      lastModified: "2026-08-02",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/franchise`,
      lastModified: "2026-08-12",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/kiosk`,
      lastModified: "2026-08-15",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: "2026-08-12",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/instant-print`,
      lastModified: "2026-08-03",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/print-near`,
      lastModified: "2026-08-03",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts,
    ...cities,
    ...colleges,
    ...areas,
    {
      url: `${siteUrl}/privacy`,
      lastModified: "2026-07-30",
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: "2026-07-30",
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/refund-policy`,
      lastModified: "2026-07-30",
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
