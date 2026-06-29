import type { Metadata } from "next";
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Snaprint — snap. scan. print.",
  description:
    "Snaprint turns your xerox shop into a 24/7 remote printing hub. No queue. No wait. Students scan, pay, and collect — you earn around the clock.",
  keywords: ["print kiosk", "xerox shop", "remote printing", "Bengaluru", "Snaprint", "instant print", "smart kiosk"],
  authors: [{ name: "Sanskriti Labs", url: "https://snaprint.in" }],
  openGraph: {
    title: "Snaprint — snap. scan. print.",
    description: "India's instant print network. Built for xerox shop owners. Powered by Sanskriti Labs, Bengaluru.",
    url: "https://snaprint.in",
    siteName: "Snaprint",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snaprint — snap. scan. print.",
    description: "India's instant print network. Built for xerox shop owners.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
