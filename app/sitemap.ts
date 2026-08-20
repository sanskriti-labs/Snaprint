import type { MetadataRoute } from "next";
import { getAllSitePages } from "@/lib/site-urls";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllSitePages();
}
