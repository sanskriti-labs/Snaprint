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
  // Layout template appends "· Snaprint" — no explicit suffix here.
  title: "Print and xerox shops across India",
  description:
    "Browse print and xerox shop directories city by city — instant print, photocopy, scan, and ID services near you across India.",
  alternates: { canonical: "/instant-print" },
  openGraph: {
    title: "Print and xerox shops across India — Snaprint",
    description:
      "Browse print and xerox shop directories city by city — find instant print, photocopy, scan, and ID services near you.",
    url: `${SITE_URL}/instant-print`,
    type: "website",
    images: [`${SITE_URL}/og.png`],
  },
  twitter: {
    title: "Print and xerox shops across India — Snaprint",
    description:
      "Browse print and xerox shop directories city by city — find instant print, photocopy, scan, and ID services near you.",
  },
};

export default function InstantPrintIndex() {
  const cities = getAllLiveCities();
  const colleges = getAllLiveColleges();
  const areas = getAllLiveAreas();

  const totalLive = cities.length + colleges.length + areas.length;
  const totalShops = areas.reduce(
    (acc, a) => acc + (a.liveLocations?.length ?? 0),
    0,
  );

  // CollectionPage + BreadcrumbList + FAQPage — no Product/kiosk-usage FAQ
  // here. Those schemas are scoped to app/page.tsx on purpose (see comment
  // there): adding kiosk pricing/FAQ to directory hub pages leaked into
  // search snippets for pages about unrelated third-party shops. These FAQs
  // are about the directory itself, so they stay accurate as coverage grows.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/instant-print#collection`,
        url: `${SITE_URL}/instant-print`,
        name: "Print and xerox shops across India",
        // Statically generated at build time from the live entity list —
        // this is the real build date, refreshed on every rebuild.
        dateModified: new Date().toISOString().slice(0, 10),
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "All locations",
            item: `${SITE_URL}/instant-print`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How many cities does Snaprint cover?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Snaprint currently lists ${cities.length || 1} live ${cities.length === 1 ? "city" : "cities"} with ${areas.length} neighbourhoods and ${colleges.length} colleges, covering ${totalShops}+ partner xerox shops. New areas are added every week.`,
            },
          },
          {
            "@type": "Question",
            name: "How do I find a print shop near me?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Pick your city, then browse by neighbourhood or college. Each listing shows the partner xerox shop's exact location, hours, and the documents customers most often print there.",
            },
          },
          {
            "@type": "Question",
            name: "Is this list of shops updated regularly?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Listings are updated as Snaprint kiosks go live in new shops, so the counts on this page reflect the current live network, not a static directory.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          Print and xerox shops, city by city.
        </h1>
        <p className="mb-6 max-w-[600px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
          Pick a city to find the nearest Snaprint-enabled xerox shop — print,
          copy, and scan from your phone in under 60 seconds.
        </p>

        {/* Quick stats — concrete numbers help AI citability + skimming */}
        <dl className="mb-16 flex flex-wrap gap-x-10 gap-y-4 border-y border-[#E8E6E0] py-6">
          <div>
            <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888780]">
              Live cities
            </dt>
            <dd className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-[#111110]">
              {cities.length || 1}
            </dd>
          </div>
          <div>
            <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888780]">
              Live neighbourhoods
            </dt>
            <dd className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-[#111110]">
              {areas.length}
            </dd>
          </div>
          <div>
            <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888780]">
              Partner xerox shops
            </dt>
            <dd className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-[#111110]">
              {totalShops}+
            </dd>
          </div>
          <div>
            <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888780]">
              Colleges live
            </dt>
            <dd className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-[#111110]">
              {colleges.length}
            </dd>
          </div>
        </dl>

        <section>
          <h2 className="mb-6 font-display text-[24px] font-extrabold tracking-tight text-[#111110]">
            Bengaluru neighbourhoods with live print and xerox shop listings
          </h2>
          <p className="mb-6 max-w-[640px] font-body text-[15px] font-light leading-[1.78] text-[#6B6B66]">
            Each neighbourhood below is a live Snaprint service area. Click
            through to see the full list of partner xerox shops, their hours,
            and the documents customers most often print there.
          </p>
          {areas.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/print-near/${a.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[#E8E6E0] bg-white px-5 py-4 transition-colors hover:border-[#E63946]"
                  >
                    <div>
                      <div className="font-display text-[16px] font-bold text-[#111110] group-hover:text-[#E63946]">
                        {a.name}
                      </div>
                      <div className="mt-0.5 font-body text-[12.5px] text-[#888780]">
                        {a.liveLocations?.length ?? 0} partner shop
                        {(a.liveLocations?.length ?? 0) === 1 ? "" : "s"}
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="font-body text-[14px] text-[#888780] transition-transform group-hover:translate-x-1 group-hover:text-[#E63946]"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-[15px] text-[#6B6B66]">
              We&apos;re onboarding new neighbourhoods every week — Bengaluru
              first, then other Indian cities.
            </p>
          )}
        </section>

        {totalLive === 0 ? (
          <EmptyState />
        ) : cities.length > 0 ? (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-[24px] font-extrabold tracking-tight text-[#111110]">
              Live cities
            </h2>
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
          </section>
        ) : null}

        {/* Cross-link to /print-near + blog */}
        <div className="mt-20 border-t border-[#E8E6E0] pt-12">
          <h2 className="mb-3 font-display text-[20px] font-extrabold tracking-tight text-[#111110]">
            Looking for a specific location?
          </h2>
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
        Print and xerox shop listings are coming online across Bengaluru first, then expanding
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
