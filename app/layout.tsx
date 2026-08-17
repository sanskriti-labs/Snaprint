import type { Metadata } from "next";
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Editorial serif — used selectively for typographic contrast moments
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const siteUrl = "https://snaprints.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Consumer-first title/description. The homepage previously described only
  // the kiosk business ("Serving shop owners across India") while ~95% of the
  // site's search impressions are near-me print queries — see the Hero
  // comment. Franchise intent is served by /franchise, which owns those terms.
  title: {
    default: "Find Xerox & Print Shops Near You — Snaprint",
    template: "%s · Snaprint",
  },
  description:
    "Find verified xerox and print shops near you across Bengaluru, Hyderabad, Chennai, Mumbai, Pune and Delhi NCR. B&W, colour, binding, scanning — open now.",
  keywords: ["xerox shop near me", "print shop near me", "printout near me", "photocopy near me", "print kiosk", "Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi NCR", "Snaprint", "instant print", "self-service printing"],
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
    title: "Find Xerox & Print Shops Near You — Snaprint",
    description: "Verified xerox and print shops across Bengaluru, Hyderabad, Chennai, Mumbai, Pune and Delhi NCR. B&W, colour, binding and scanning near you.",
    url: siteUrl,
    siteName: "Snaprint",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Snaprint — snap. scan. print." }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Xerox & Print Shops Near You — Snaprint",
    description: "Verified xerox and print shops across six Indian cities. B&W, colour, binding and scanning near you.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      ...(process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : {}),
    },
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
      description: "Snaprint builds self-service print kiosks that turn xerox shops into 24/7 remote printing hubs.",
      email: "snaprints@sanskritilabs.in",
      contactPoint: {
        "@type": "ContactPoint",
        email: "snaprints@sanskritilabs.in",
        contactType: "customer service",
        areaServed: "IN",
      },
      // TODO(KG): once Snaprint has Crunchbase + F6S + Justdial + Wikidata
      // entries, uncomment them here. LinkedIn (verified) is the only
      // authoritative sameAs today.
      sameAs: [
        "https://www.linkedin.com/showcase/snaprints/",
        "https://www.linkedin.com/company/sanskriti-labs/",
        // TODO: uncomment after creating profile at https://www.crunchbase.com/organization/snaprint
        // "https://www.crunchbase.com/organization/snaprint",
        // TODO: uncomment after verifying the F6S URL exists (claimed in GSC serps)
        // "https://www.f6s.com/company/snaprint",
        // TODO: uncomment after creating profile at https://www.justdial.com/Bangalore/Snaprint
        // "https://www.justdial.com/Bangalore/Snaprint",
      ],
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
      areaServed: [
        { "@type": "City", name: "Bengaluru" },
        { "@type": "City", name: "Hyderabad" },
        { "@type": "City", name: "Chennai" },
        { "@type": "City", name: "Mumbai" },
        { "@type": "City", name: "Pune" },
        { "@type": "City", name: "Delhi NCR" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Snaprint",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">{children}</body>
      <GoogleAnalytics gaId="G-76GFPGCHWQ" />
      <Analytics />
    </html>
  );
}
