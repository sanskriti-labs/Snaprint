import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SnappyLoader from "@/components/mascot/SnappyLoader";
import SnappyScrollTop from "@/components/mascot/SnappyScrollTop";
import LenisProvider from "@/components/motion/LenisProvider";
import CustomCursor from "@/components/motion/CustomCursor";
import RouteTransition from "@/components/motion/RouteTransition";

// Snappy mascot's "Zzz" glyph only
const baloo2 = Baloo_2({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-baloo",
  display: "swap",
});

const siteUrl = "https://snaprints.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Snaprint — Own a Self-Service Print Kiosk. No Rent, No Revenue Share.",
    template: "%s · Snaprint",
  },
  description:
    "Snaprint is a self-service print kiosk you buy once and own outright — starting at ₹84,999. Scan, upload, pay, collect. Zero platform fee, set your own price. Built by Sanskriti Labs, Bengaluru.",
  keywords: ["print kiosk", "kiosk ownership", "self-service printing", "xerox shop", "remote printing", "Bengaluru", "Snaprint", "instant print", "smart kiosk"],
  authors: [{ name: "Sanskriti Labs", url: siteUrl }],
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Snaprint — Own a Self-Service Print Kiosk",
    description: "India's self-service print network. Buy the kiosk, set your price, keep every rupee. Powered by Sanskriti Labs, Bengaluru.",
    url: siteUrl,
    siteName: "Snaprint",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Snaprint — snap. scan. print." }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snaprint — Own a Self-Service Print Kiosk",
    description: "India's self-service print network. Buy the kiosk, set your price, keep every rupee.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Snaprint",
      url: siteUrl,
      logo: `${siteUrl}/icon-512.png`,
      description: "Snaprint builds self-service print kiosks that owners buy outright and run on their own terms — no rent, no revenue share.",
      email: "snaprints@sanskritilabs.in",
      // TODO(KG): once Snaprint has Crunchbase + Wikidata entries, add them here.
      // LinkedIn (verified) is the only authoritative sameAs today.
      sameAs: ["https://www.linkedin.com/showcase/snaprints/"],
      founder: [
        {
          "@type": "Person",
          name: "Abhishek Rajpurohit",
          sameAs: ["https://www.linkedin.com/in/abhishek-rajpurohit/"],
        },
        {
          "@type": "Person",
          name: "Goutham Singh",
          sameAs: ["https://www.linkedin.com/in/goutham-singh-/"],
        },
      ],
      parentOrganization: {
        "@type": "Organization",
        name: "Sanskriti Labs",
        sameAs: ["https://www.linkedin.com/company/sanskriti-labs/"],
      },
      areaServed: { "@type": "City", name: "Bengaluru" },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Snaprint",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={baloo2.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <SnappyLoader />
        <RouteTransition />
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
        <SnappyScrollTop />
        <GoogleAnalytics gaId="G-76GFPGCHWQ" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
