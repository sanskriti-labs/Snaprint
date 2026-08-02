import type { Metadata } from "next";

// The date grid must always reflect the visitor's actual "today" — force this
// route to render dynamically (per-request) rather than being statically
// prerendered at build time. Declared here (a server component) since Next's
// static-optimization analysis does not reliably honor `dynamic` exported from
// the "use client" page component itself.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Demo",
  description:
    "Book a 40-minute call with the Snaprint founder over Google Meet. No commitment required.",
  alternates: { canonical: "/book" },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
