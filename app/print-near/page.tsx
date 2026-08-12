import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PseoCta from "@/components/pseo/PseoCta";
import EntityCard from "@/components/pseo/EntityCard";
import {
  getAllLiveAreas,
  getAllLiveColleges,
} from "@/content/pseo/seo";

const SITE_URL = "https://snaprints.com";

export const metadata: Metadata = {
  // Layout template appends "· Snaprint" — no explicit suffix here.
  title: "Print and xerox shops near you — Colleges & Neighbourhoods",
  description:
    "Find print and xerox shops near your college, office, or neighbourhood. Print, copy, and scan from your phone in under 60 seconds.",
  alternates: { canonical: "/print-near" },
  openGraph: {
    title: "Print and xerox shops near you — Snaprint",
    description:
      "Find print and xerox shops near your college, office, or neighbourhood.",
    url: `${SITE_URL}/print-near`,
    type: "website",
    images: [`${SITE_URL}/og.png`],
  },
  twitter: {
    title: "Print and xerox shops near you — Snaprint",
    description:
      "Find print and xerox shops near your college, office, or neighbourhood.",
  },
};

type AreaGroup = {
  cityName: string;
  citySlug: string;
  areas: ReturnType<typeof getAllLiveAreas>;
  colleges: ReturnType<typeof getAllLiveColleges>;
};

export default function PrintNearIndex() {
  const allAreas = getAllLiveAreas();
  const allColleges = getAllLiveColleges();

  // Group all live areas by their parent city slug, and collect the
  // live colleges assigned to each city. The hub shows colleges only
  // when their presence has been flipped to "live" — planned entries
  // are intentionally excluded so the public page never advertises a
  // launch that hasn't happened.
  const groups: AreaGroup[] = [];
  const seenCities = new Set<string>();
  for (const area of allAreas) {
    if (!seenCities.has(area.city)) {
      seenCities.add(area.city);
      groups.push({
        cityName: area.city.charAt(0).toUpperCase() + area.city.slice(1),
        citySlug: area.city,
        areas: allAreas.filter((a) => a.city === area.city),
        colleges: allColleges.filter((c) => c.city === area.city),
      });
    }
  }

  // Cities that have live colleges but no live areas (e.g. college-first
  // launches) still need a group to render the colleges section.
  for (const c of allColleges) {
    if (!seenCities.has(c.city)) {
      seenCities.add(c.city);
      groups.push({
        cityName: c.city.charAt(0).toUpperCase() + c.city.slice(1),
        citySlug: c.city,
        areas: [],
        colleges: allColleges.filter((cc) => cc.city === c.city),
      });
    }
  }

  const totalLive = allAreas.length + allColleges.length;

  // CollectionPage + BreadcrumbList + FAQPage — no Product/kiosk-usage FAQ
  // here. See app/instant-print/page.tsx for why: kiosk pricing/FAQ on
  // directory hub pages leaked into snippets for unrelated shop pages.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/print-near#collection`,
        url: `${SITE_URL}/print-near`,
        name: "Print and xerox shops near you",
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
            item: `${SITE_URL}/print-near`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I find a print shop near my college or neighbourhood?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Scroll to your city, then pick your college or neighbourhood from the list. Each listing links to the partner xerox shop's exact location, hours, and services.",
            },
          },
          {
            "@type": "Question",
            name: "How many colleges and neighbourhoods are covered?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `This page currently lists ${allColleges.length} ${allColleges.length === 1 ? "college" : "colleges"} and ${allAreas.length} ${allAreas.length === 1 ? "neighbourhood" : "neighbourhoods"} with live partner shops. Coverage expands every week.`,
            },
          },
          {
            "@type": "Question",
            name: "What if my area isn't listed yet?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Email snaprints@sanskritilabs.in to request coverage in your area — new locations are added as Snaprint kiosks go live nearby.",
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
        <p className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
          All locations
        </p>
        <h1
          className="mb-6 font-display font-extrabold leading-[1.05] tracking-[-2px] text-[#111110]"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
        >
          Print near your college or neighbourhood.
        </h1>
        <p className="mb-16 max-w-[600px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
          Find print and xerox shops near your college or neighbourhood.
          Compare hours, ratings, and phone numbers — pick the closest.
        </p>

        {totalLive === 0 ? <EmptyState /> : <GroupedList groups={groups} />}

        {/* Cross-link to /instant-print */}
        <div className="mt-20 border-t border-[#E8E6E0] pt-12">
          <p className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888780]">
            Looking for a city-level overview?
          </p>
          <Link
            href="/instant-print"
            className="group inline-flex items-center gap-2 font-display text-[16px] font-bold text-[#111110] transition-colors hover:text-[#E63946]"
          >
            Browse by city
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </main>
      <PseoCta />
      <Footer />
    </>
  );
}

function GroupedList({ groups }: { groups: AreaGroup[] }) {
  return (
    <div className="flex flex-col gap-16">
      {groups.map(({ cityName, citySlug, areas, colleges }) => (
        <section key={citySlug}>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#E8E6E0]" />
            <h2 className="shrink-0 font-display text-[22px] font-extrabold tracking-tight text-[#111110]">
              {cityName}
            </h2>
            <span className="h-px flex-1 bg-[#E8E6E0]" />
          </div>

          {colleges.length > 0 && (
            <div className="mb-10">
              <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-[#888780]">
                Colleges &amp; Universities
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {colleges.map((c) => (
                  <EntityCard
                    key={c.slug}
                    kind="college"
                    college={c}
                    href={`/print-near/${c.slug}`}
                  />
                ))}
              </div>
            </div>
          )}

          {areas.length > 0 && (
            <div>
              <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-[#888780]">
                Neighbourhoods
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {areas.map((a) => (
                  <EntityCard
                    key={a.slug}
                    kind="area"
                    area={a}
                    href={`/print-near/${a.slug}`}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-[#E8E6E0] bg-[#F5F3EE] px-8 py-16 text-center">
      <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
        Pre-launch
      </p>
      <h2 className="mb-4 font-display text-[28px] font-extrabold tracking-tight text-[#111110]">
        We&apos;re adding locations every week.
      </h2>
      <p className="mx-auto mb-8 max-w-[420px] font-body text-[14px] leading-[1.75] text-[#6B6B66]">
        Print and xerox shop listings are expanding across Bengaluru
        colleges and neighbourhoods first. Tell us where you&apos;d like to see coverage next.
      </p>
      <a
        href="mailto:snaprints@sanskritilabs.in"
        className="inline-flex items-center gap-2 rounded-[8px] bg-[#111110] px-6 py-3 font-display text-[13px] font-semibold text-white transition-all hover:bg-[#E63946]"
      >
        Request a location
      </a>
    </div>
  );
}
