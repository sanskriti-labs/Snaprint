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
  getShopsNearCollege,
  getCityName,
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
      // No "— Snaprint" suffix: the root layout's title template already
      // appends "· Snaprint", which was rendering "… — Snaprint · Snaprint".
      title: `Print and xerox shops near ${name}, ${getCityName(college.city)}`,
      description: college.intro,
      keywords: college.keywords,
      alternates: { canonical: `/print-near/${college.slug}` },
      openGraph: {
        title: `Print and xerox shops near ${name} — Snaprint`,
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
      title: `Print and xerox shops in ${area.name}, ${getCityName(area.city)}`,
      description: area.intro,
      keywords: area.keywords,
      alternates: { canonical: `/print-near/${area.slug}` },
      openGraph: {
        title: `Print and xerox shops in ${area.name} — Snaprint`,
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
    const nearbyShops = getShopsNearCollege(college.slug);

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          // Single node with two @type values — schema.org canonical
          // pattern for "this is X and Y". A separate EducationalOrganization
          // peer node would create a duplicate @id with the Place, which
          // LLM extractors handle inconsistently. The Place type carries
          // the geo/address; EducationalOrganization adds the educational
          // entity classification without claiming a kiosk location.
          "@type": ["Place", "EducationalOrganization"],
          "@id": `${SITE_URL}/print-near/${college.slug}#org`,
          name: college.name,
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
            addressLocality: getCityName(college.city),
            addressCountry: "IN",
          },
        },
        // BreadcrumbList
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Print Near You", item: `${SITE_URL}/print-near` },
            { "@type": "ListItem", position: 3, name: college.name, item: `${SITE_URL}/print-near/${college.slug}` },
          ],
        },
        // FAQPage
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    };

    return (
      <PseoPage
        props={{ kind: "college", college, liveLocations: nearbyShops }}
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
          name: `Print and xerox shops in ${area.name}, ${getCityName(area.city)}`,
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
          ...(area.liveLocations && area.liveLocations[0]?.phone
            ? { telephone: area.liveLocations[0].phone }
            : {}),
        },
        // BreadcrumbList
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Print Near You", item: `${SITE_URL}/print-near` },
            { "@type": "ListItem", position: 3, name: area.name, item: `${SITE_URL}/print-near/${area.slug}` },
          ],
        },
        // FAQPage
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    };

    return (
      <PseoPage
        props={{ kind: "area", area, liveLocations: area.liveLocations ?? [] }}
        faqs={faqs}
        crossLinks={{ parentCity: parentCity ?? undefined, colleges: collegesInArea, areas: areasInCity, neighborCities: neighbors }}
        jsonLd={jsonLd}
      />
    );
  }

  notFound();
}
