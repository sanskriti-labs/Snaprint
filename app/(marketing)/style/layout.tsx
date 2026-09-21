import type { Metadata } from "next";

// Internal design-system preview  --  never indexed, never in the sitemap.
export const metadata: Metadata = {
  title: "Design System",
  alternates: { canonical: "/style" },
  robots: { index: false, follow: false },
};

export default function StyleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
