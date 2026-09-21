import type { Metadata } from "next";

const title = "Snaprint Franchise  --  Become an S1 Kiosk Operator [2026]";
const description =
  "Become a Snaprint S1 print kiosk operator. Starting from ₹84,999, one-time, no annual fees. 24/7 unmanned operation, live revenue dashboard. Currently in Bengaluru.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/franchise" },
  openGraph: {
    title: `${title} · Snaprint`,
    description,
    url: "/franchise",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Snaprint Franchise  --  Become an S1 Kiosk Operator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Snaprint`,
    description,
    images: ["/og.png"],
  },
};

export default function FranchiseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
