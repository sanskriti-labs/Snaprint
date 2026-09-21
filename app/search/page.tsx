import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPostsMeta } from "@/lib/blog";
import { getAllCitySlugs, getCity, getAllCollegeSlugs, getCollege, getAllAreaSlugs, getArea } from "@/content/pseo/seo";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Snaprint  --  pricing, franchise, blog guides, and print shops by city or college across India.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

type Result = { title: string; description: string; href: string };

// Static marketing pages  --  hand-listed since there's no single index of them.
const staticPages: Result[] = [
  { title: "Snaprint  --  Instant Print Kiosks", description: "Turn your xerox shop into a 24/7 remote printing hub.", href: "/" },
  { title: "Pricing", description: "Snaprint S1 kiosk pricing, what's included, and expected ROI for shop owners.", href: "/#pricing" },
  { title: "Franchise", description: "Host a Snaprint self-service print kiosk in your college, hostel, or shop.", href: "/franchise" },
  { title: "About Snaprint", description: "Snaprint is a self-service print kiosk built by Sanskriti Labs in Bengaluru.", href: "/about" },
  { title: "Book a Demo", description: "Book a 40-minute call with the Snaprint founder over Google Meet.", href: "/book" },
  { title: "Print shops by city", description: "Find print and xerox shops across Indian cities.", href: "/instant-print" },
  { title: "Print shops near you", description: "Find print and xerox shops near your college or neighbourhood.", href: "/print-near" },
];

function buildIndex(): Result[] {
  const posts = getAllPostsMeta().map((p) => ({
    title: p.title,
    description: p.description,
    href: `/blog/${p.slug}`,
  }));

  const cities = getAllCitySlugs().flatMap((slug) => {
    const c = getCity(slug);
    if (!c) return [];
    return [{ title: `Print shops in ${c.name}`, description: c.intro, href: `/instant-print/${c.slug}` }];
  });

  const colleges = getAllCollegeSlugs().flatMap((slug) => {
    const c = getCollege(slug);
    if (!c) return [];
    return [{ title: `Print shops near ${c.name}`, description: c.intro, href: `/print-near/${c.slug}` }];
  });

  const areas = getAllAreaSlugs().flatMap((slug) => {
    const a = getArea(slug);
    if (!a) return [];
    return [{ title: `Print shops in ${a.name}`, description: a.intro, href: `/print-near/${a.slug}` }];
  });

  return [...staticPages, ...posts, ...cities, ...colleges, ...areas];
}

function search(query: string): Result[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return buildIndex()
    .filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    .slice(0, 30);
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? "";
  const results = search(query);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[900px] px-6 py-28 md:px-10">
        <h1 className="mb-3 font-display text-[36px] font-extrabold tracking-tight text-snap-charcoal md:text-[44px]">
          Search
        </h1>
        <form action="/search" method="get" className="mb-14">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search pricing, franchise, cities, colleges…"
            className="w-full rounded-xl border border-snap-border bg-white px-5 py-4 font-body text-[15px] text-snap-charcoal outline-none focus:border-snap-red"
          />
        </form>

        {query && (
          <p className="mb-8 font-body text-[13px] text-snap-gray">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>
        )}

        <div className="flex flex-col gap-6">
          {results.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group rounded-2xl border border-snap-border bg-white p-6 transition-colors hover:border-snap-red"
            >
              <h2 className="mb-2 font-display text-[18px] font-semibold text-snap-charcoal group-hover:text-snap-red">
                {r.title}
              </h2>
              <p className="font-body text-[14px] leading-relaxed text-snap-gray">{r.description}</p>
            </Link>
          ))}
        </div>

        {query && results.length === 0 && (
          <p className="font-body text-[14px] text-snap-gray">
            No results. Try {" "}
            <Link href="/instant-print" className="text-snap-red hover:underline">print shops by city</Link>
            {" "}or{" "}
            <Link href="/blog" className="text-snap-red hover:underline">the blog</Link>.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
