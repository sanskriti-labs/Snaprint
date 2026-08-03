import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PseoCta from "@/components/pseo/PseoCta";
import EntityCard from "@/components/pseo/EntityCard";
import {
  getAllLiveCities,
  getAllLiveColleges,
  getAllLiveAreas,
} from "@/content/pseo/seo";

const SITE_URL = "https://snaprints.com";

export const metadata: Metadata = {
  title: "Instant Print Kiosks Across India — Snaprint",
  description:
    "Browse all Snaprint kiosk locations — find instant print, photocopy, scan, and ID services near you. Live and coming-soon cities, colleges, and neighbourhoods across India.",
  alternates: { canonical: "/instant-print" },
  openGraph: {
    title: "Instant Print Kiosks Across India — Snaprint",
    description:
      "Browse all Snaprint kiosk locations — find instant print, photocopy, scan, and ID services near you.",
    url: `${SITE_URL}/instant-print`,
    type: "website",
    images: [`${SITE_URL}/og.png`],
  },
};

export default function InstantPrintIndex() {
  const cities = getAllLiveCities();
  const colleges = getAllLiveColleges();
  const areas = getAllLiveAreas();

  const totalLive = cities.length + colleges.length + areas.length;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-6 py-24 md:px-10">
        {/* Eyebrow + H1 */}
        <p className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
          All locations
        </p>
        <h1
          className="mb-6 font-display font-extrabold leading-[1.05] tracking-[-2px] text-[#111110]"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
        >
          Snaprint kiosks, city by city.
        </h1>
        <p className="mb-16 max-w-[600px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
          Pick a city to find the nearest Snaprint-enabled xerox shop — print,
          copy, and scan from your phone in under 60 seconds.
        </p>

        {totalLive === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <EntityCard
                key={city.slug}
                kind="city"
                city={city}
                href={`/instant-print/${city.slug}`}
              />
            ))}
          </div>
        )}

        {/* Cross-link to /print-near */}
        <div className="mt-20 border-t border-[#E8E6E0] pt-12">
          <p className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888780]">
            Looking for a specific location?
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/print-near"
              className="group inline-flex items-center gap-2 font-display text-[16px] font-bold text-[#111110] transition-colors hover:text-[#E63946]"
            >
              Browse by neighbourhood or college
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/blog"
              className="font-body text-[14px] text-[#6B6B66] underline-offset-2 transition-colors hover:text-[#E63946] hover:underline"
            >
              Or read the blog
            </Link>
          </div>
        </div>
      </main>
      <PseoCta />
      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-[#E8E6E0] bg-[#F5F3EE] px-8 py-16 text-center">
      <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
        Pre-launch
      </p>
      <h2 className="mb-4 font-display text-[28px] font-extrabold tracking-tight text-[#111110]">
        We&apos;re rolling out city by city.
      </h2>
      <p className="mx-auto mb-8 max-w-[420px] font-body text-[14px] leading-[1.75] text-[#6B6B66]">
        Snaprint kiosks are coming online across Bengaluru first, then expanding
        across Karnataka and India. Get in touch if you&apos;d like us in your
        area.
      </p>
      <a
        href="mailto:snaprints@sanskritilabs.in"
        className="inline-flex items-center gap-2 rounded-[8px] bg-[#111110] px-6 py-3 font-display text-[13px] font-semibold text-white transition-all hover:bg-[#E63946]"
      >
        Request a city
      </a>
    </div>
  );
}
