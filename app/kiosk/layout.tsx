import type { Metadata } from "next";

const title = "Self-Service Printing Kiosk  --  Colleges & Hospitals";
const description =
  "Snaprint is a self-service printing kiosk / automated print station for India  --  QR upload, UPI payment, unattended 24/7 printing for colleges, offices, hospitals.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/kiosk" },
  openGraph: {
    title: `${title} · Snaprint`,
    description,
    url: "/kiosk",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Snaprint self-service printing kiosk" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Snaprint`,
    description,
    images: ["/og.png"],
  },
};

export default function KioskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
