import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Wide open  --  new site needs both AI search citations and AI training
      // inclusion to build discoverability. Nothing here is worth blocking yet.
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://snaprints.com/sitemap.xml",
  };
}
