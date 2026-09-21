import type { Metadata } from "next";

// The date grid must always reflect the visitor's actual "today"  --  force this
// route to render dynamically (per-request) rather than being statically
// prerendered at build time. Declared here (a server component) since Next's
// static-optimization analysis does not reliably honor `dynamic` exported from
// the "use client" page component itself.
export const dynamic = "force-dynamic";

const title = "Book a Demo";
const description =
  "Book a 40-minute call with the Snaprint founder over Google Meet. No commitment required.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/book" },
  openGraph: {
    title: `${title} · Snaprint`,
    description,
    url: "/book",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Snaprint`,
    description,
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
