import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
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
  // Consumer-first title/description. The homepage previously described only
  // the kiosk business ("Serving shop owners across India") while ~95% of the
  // site's search impressions are near-me print queries  --  see the Hero
  // comment. Franchise intent is served by /franchise, which owns those terms.
  title: {
    default: "Find Xerox & Print Shops Near You  --  Snaprint",
    template: "%s · Snaprint",
  },
  description:
    "Find xerox and print shops near you across 6 Indian cities  --  B&W, colour, binding, scanning. Snaprint builds self-service print kiosks for shops and colleges.",
  keywords: ["xerox shop near me", "print shop near me", "printout near me", "photocopy near me", "print kiosk", "self printing kiosk", "self service printing kiosk", "self-service printing kiosk", "print kiosk cost", "print kiosk price India", "print kiosk franchise India", "xerox shop software", "print shop software Windows", "automated printing kiosk India", "document printing kiosk", " unattended print kiosk", "Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi NCR", "Snaprint", "instant print", "printing kiosk for colleges"],
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
    title: "Find Xerox & Print Shops Near You  --  Snaprint",
    description: "Listed xerox and print shops across Bengaluru, Hyderabad, Chennai, Mumbai, Pune and Delhi NCR. B&W, colour, binding and scanning near you.",
    url: siteUrl,
    siteName: "Snaprint",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Snaprint  --  snap. scan. print." }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Xerox & Print Shops Near You  --  Snaprint",
    description: "Listed xerox and print shops across six Indian cities. B&W, colour, binding and scanning near you.",
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
      description: "Snaprint builds self-service printing kiosks  --  automated print stations that turn xerox shops into 24/7 remote printing hubs, and deploy as document printing kiosks for colleges, offices, hospitals, libraries, and retail across India.",
      email: "snaprints@sanskritilabs.in",
      contactPoint: {
        "@type": "ContactPoint",
        email: "snaprints@sanskritilabs.in",
        contactType: "customer service",
        areaServed: "IN",
      },
      knowsAbout: [
        "Self-service printing kiosk",
        "Automated printing kiosk",
        "Document printing kiosk",
        "QR code printing",
        "UPI printing kiosk",
      ],
      // TODO(KG): once Snaprint has Crunchbase + F6S + Justdial + Wikidata
      // entries, uncomment them here. LinkedIn, Instagram, and Reddit
      // (verified) are the only authoritative sameAs today.
      sameAs: [
        "https://www.linkedin.com/company/snaprintss/",
        "https://www.linkedin.com/company/sanskriti-labs/",
        "https://www.instagram.com/snaprints.labs/",
        "https://www.reddit.com/r/Snaprint/",
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
    <html lang="en" className={baloo2.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        {/* Runs before hydration to hide the SnappyLoader overlay via pure
            CSS when it's already been seen this session (or reduced motion
            is on)  --  otherwise the server always renders it frozen at 0%
            (SSR can't read sessionStorage), and it sits on screen, visible,
            until React hydrates and catches up. See snappy-loader-root rule
            in globals.css. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('snappy-loader-seen')||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-skip-loader')}}catch(e){}",
          }}
        />
        <SnappyLoader />
        <RouteTransition />
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
        <SnappyScrollTop />
        <CookieConsent />
        <SpeedInsights />
      </body>
    </html>
  );
}
