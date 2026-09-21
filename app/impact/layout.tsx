import type { Metadata } from "next";

const title = "Impact  --  Snaprint Community";
const description = "Share feedback, discover Snaprint updates, ask questions and join the Snaprint community.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/impact" },
  openGraph: {
    title,
    description,
    url: "/impact",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Snaprint community" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function ImpactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
