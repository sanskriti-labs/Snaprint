import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCollegeSlugs,
  getAllAreaSlugs,
  getCollege,
  getArea,
  getCity,
  getCollegesInCity,
  getAreasInCity,
  getCollegesNearArea,
  getNeighborCities,
  getLocationFaqs,
} from "@/content/pseo/seo";
import PseoPage from "@/components/PseoPage";

const SITE_URL = "https://snaprints.com";

export function generateStaticParams() {
  const slugs = [...getAllCollegeSlugs(), ...getAllAreaSlugs()];
  return slugs.map((entity) => ({ entity }));
}

export function generateMetadata({
  params,
}: {
  params: { entity: string };
}): Metadata {
  const college = getCollege(params.entity);
  if (college) {
    const name = college.shortName ?? college.name;
    return {
      title: `Print near ${name}, ${college.city} — Snaprint`,
      description: college.intro,
      keywords: college.keywords,
      alternates: { canonical: `/print-near/${college.slug}` },
      openGraph: {
        title: `Print near ${name} — Snaprint`,
        description: college.intro,
        url: `${SITE_URL}/print-near/${college.slug}`,
        type: "website",
        images: [`${SITE_URL}/og.png`],
      },
    };
  }

  const area = getArea(params.entity);
  if (area) {
    return {
      title: `Instant Print Kiosk in ${area.name}, ${area.city} — Snaprint`,
      description: area.intro,
      keywords: area.keywords,
      alternates: { canonical: `/print-near/${area.slug}` },
      openGraph: {
        title: `Instant Print in ${area.name} — Snaprint`,
        description: area.intro,
        url: `${SITE_URL}/print-near/${area.slug}`,
        type: "website",
        images: [`${SITE_URL}/og.png`],
      },
    };
  }

  return {};
}

export default async function EntityPage({
  params,
}: {
  params: { entity: string };
}) {
  const college = getCollege(params.entity);
  const area = getArea(params.entity);

  if (!college && !area) notFound();

  if (college) {
    const parentCity = getCity(college.city);
    const siblings = getCollegesInCity(college.city);
    const neighbors = getNeighborCities(college.city);
    const faqs = getLocationFaqs(params.entity, college.city);

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Place",
          "@id": `${SITE_URL}/#location-${college.slug}`,
          name: `${college.name} — Snaprint Kiosk Nearby`,
          description: college.intro,
          url: `${SITE_URL}/print-near/${college.slug}`,
          image: `${SITE_URL}/og.png`,
          ...(college.lat && college.lng
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: college.lat,
                  longitude: college.lng,
                },
              }
            : {}),
          address: {
            "@type": "PostalAddress",
            streetAddress: college.address,
            addressLocality: college.city.charAt(0).toUpperCase() + college.city.slice(1),
            addressCountry: "IN",
          },
          parentOrganization: { "@id": `${SITE_URL}/#organization` },
        },
      ],
    };

    return (
      <PseoPage
        props={{ kind: "college", college }}
        faqs={faqs}
        crossLinks={{ parentCity: parentCity ?? undefined, colleges: siblings, neighborCities: neighbors }}
        jsonLd={jsonLd}
      />
    );
  }

  if (area) {
    const parentCity = getCity(area.city);
    const collegesInArea = getCollegesNearArea(area.slug);
    const areasInCity = getAreasInCity(area.city);
    const neighbors = getNeighborCities(area.city);
    const faqs = getLocationFaqs(params.entity, area.city);

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": `${SITE_URL}/#location-${area.slug}`,
          name: `Snaprint Kiosk — ${area.name}, ${area.city}`,
          description: area.intro,
          url: `${SITE_URL}/print-near/${area.slug}`,
          image: `${SITE_URL}/og.png`,
          ...(area.liveLocations && area.liveLocations.length > 0
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: area.liveLocations[0].lat,
                longitude: area.liveLocations[0].lng,
              },
            }
          : {}),
          areaServed: { "@id": `${SITE_URL}/#organization` },
          parentOrganization: { "@id": `${SITE_URL}/#organization` },
        },
      ],
    };

    return (
      <PseoPage
        props={{ kind: "area", area }}
        faqs={faqs}
        crossLinks={{ parentCity: parentCity ?? undefined, colleges: collegesInArea, areas: areasInCity, neighborCities: neighbors }}
        jsonLd={jsonLd}
      />
    );
  }

  notFound();
}
