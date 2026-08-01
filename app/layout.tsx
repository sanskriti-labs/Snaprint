import type { Metadata } from "next";
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  title: {
    default: "Snaprint — Instant Print Kiosks for Xerox Shops in Bengaluru",
    template: "%s · Snaprint",
  },
  description:
    "Snaprint turns your xerox shop into a 24/7 remote printing hub. Students scan, pay, and collect — no queue, no wait. Built for Bengaluru shop owners by Sanskriti Labs.",
  keywords: ["print kiosk", "xerox shop", "remote printing", "Bengaluru", "Snaprint", "instant print", "smart kiosk", "self-service printing"],
  authors: [{ name: "Sanskriti Labs", url: siteUrl }],
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Snaprint — Instant Print Kiosks for Xerox Shops",
    description: "India's instant print network. Built for xerox shop owners. Powered by Sanskriti Labs, Bengaluru.",
    url: siteUrl,
    siteName: "Snaprint",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Snaprint — snap. scan. print." }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snaprint — Instant Print Kiosks for Xerox Shops",
    description: "India's instant print network. Built for xerox shop owners.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
      parentOrganization: { "@type": "Organization", name: "Sanskriti Labs" },
      areaServed: { "@type": "City", name: "Bengaluru" },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Snaprint",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Product",
      "@id": `${siteUrl}/#product-s1`,
      name: "Snaprint S1",
      description:
        "Self-service print kiosk that connects to any existing printer (Canon, HP, Epson, Brother). Customers scan a QR code, upload a document, pay, and collect the print without staff present.",
      brand: { "@id": `${siteUrl}/#organization` },
      image: `${siteUrl}/og.png`,
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Does the Snaprint S1 work with my existing printer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The Snaprint S1 works with any printer brand — Canon, HP, Epson, Brother — so you don't need to replace your existing equipment.",
          },
        },
        {
          "@type": "Question",
          name: "Can the kiosk take orders when my shop is closed?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Orders queue automatically and the kiosk keeps printing whether or not you're present, so your shop can earn from print jobs placed after hours.",
          },
        },
        {
          "@type": "Question",
          name: "What happens to a customer's uploaded documents?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Files are end-to-end encrypted and automatically deleted after each print job completes — no document is stored on the kiosk.",
          },
        },
        {
          "@type": "Question",
          name: "How do shop owners track orders and revenue?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every order, along with revenue, print counts, and ink and paper status, is visible on a live dashboard on the shop owner's phone.",
          },
        },
        {
          "@type": "Question",
          name: "Can I get a refund if I cancel before installation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. If you've paid for a kiosk but installation hasn't taken place yet, you can cancel and request a full refund, processed within 7–14 business days to your original payment method.",
          },
        },
      ],
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
    </html>
  );
}
