import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCitySlugs,
  getCity,
  getCollegesInCity,
  getAreasInCity,
  getNeighborCities,
  getCityFaqs,
  getShopsInCity,
} from "@/content/pseo/seo";
import PseoPage from "@/components/PseoPage";

const SITE_URL = "https://snaprints.com";

export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ city: slug }));
}

export function generateMetadata({
  params,
}: {
  params: { city: string };
}): Metadata {
  const city = getCity(params.city);
  if (!city) return {};
  const areaCount = getAreasInCity(city.slug).length;
  // Power-word pattern mirrors the /print-near pages so the SERP looks
  // consistent across the pSEO cluster. No "· Snaprint" suffix — the
  // root layout's title template already appends it.
  const title =
    areaCount > 0
      ? `${areaCount} Areas with Print & Xerox Shops in ${city.name} — Verified`
      : `Print and xerox shops in ${city.name} — Verified`;
  const description =
    areaCount > 0
      ? `${areaCount} neighbourhoods across ${city.name} with verified xerox and print shops. B&W and colour prints, binding, scanning. Browse areas near you.`
      : `Verified print and xerox shops in ${city.name}. B&W and colour prints, binding, lamination, scanning. Open hours vary — call ahead.`;
  return {
    // Layout template appends "· Snaprint" — no explicit suffix here.
    title,
    description,
    keywords: city.keywords,
    alternates: { canonical: `/instant-print/${city.slug}` },
    openGraph: {
      title: `${areaCount > 0 ? areaCount + " areas with " : ""}Print & xerox shops in ${city.name} — Snaprint`,
      description,
      url: `${SITE_URL}/instant-print/${city.slug}`,
      type: "website",
      images: [`${SITE_URL}/og.png`],
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: { city: string };
}) {
  const city = getCity(params.city);
  if (!city) notFound();

  const colleges = getCollegesInCity(params.city);
  const areas = getAreasInCity(params.city);
  const neighbors = getNeighborCities(params.city);
  const faqs = getCityFaqs(params.city);
  const shops = getShopsInCity(params.city);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#location-${city.slug}`,
        name: `Print and xerox shops in ${city.name}`,
        description: city.intro,
        url: `${SITE_URL}/instant-print/${city.slug}`,
        image: `${SITE_URL}/og.png`,
        ...(city.lat && city.lng
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: city.lat,
                longitude: city.lng,
              },
            }
          : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: city.name,
          addressRegion: city.state,
          addressCountry: "IN",
        },
        areaServed: { "@id": `${SITE_URL}/#organization` },
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        ...(city.liveLocations && city.liveLocations.length > 0
          ? {
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Print & scan services",
                itemListElement: [
                  "Black & white A4 print",
                  "Colour A4 print",
                  "A3 print",
                  "Photocopy / reduce-enlarge",
                  "Scan to email",
                  "ID & passport photos",
                ].map((name, i) => ({ "@type": "Offer", position: i, name })),
              },
            }
          : {}),
      },
    ],
  };

  return (
    <PseoPage
      props={{ kind: "city", city, liveLocations: shops }}
      faqs={faqs}
      crossLinks={{ colleges, areas, neighborCities: neighbors }}
      jsonLd={jsonLd}
    />
  );
}
