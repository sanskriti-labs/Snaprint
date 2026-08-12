import type { Metadata } from "next";

const title = "Snaprint S1 Kiosk Pricing — Transparent Costs for Operators [2026]";
const description =
  "Snaprint S1 print kiosk pricing: ₹3,00,000–3,50,000 one-time. No per-print commission, no monthly royalties. ROI in 14–22 months for Bengaluru operators.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: `${title} · Snaprint`,
    description,
    url: "/pricing",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Snaprint S1 Kiosk Pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Snaprint`,
    description,
    images: ["/og.png"],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}