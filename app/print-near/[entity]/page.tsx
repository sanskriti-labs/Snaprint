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
  getCityState,
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
    const cityName = getCityName(college.city);
    // Compute shop count up front so the title and description can both
    // use the same number — keeps the SERP entry consistent.
    const count = getShopsNearCollege(college.slug).length;
    const title =
      count > 0
        ? `${count} Xerox Shops Near ${name}, ${cityName} [2026] · Snaprint`
        : `Print Shops Near ${name}, ${cityName} [2026] · Snaprint`;
    // Description target 150–160 chars; include count, key service, and a
    // soft call-to-action. Falls back to a generic blurb when count is 0.
    const description =
      count > 0
        ? `${count} verified xerox and print shops within 1.5 km of ${name}, ${cityName}. B&W from ₹3, colour prints, spiral binding, lamination, scan, ID photos. Open hours vary — call ahead.`
        : `Find print and xerox shops near ${name}, ${cityName}. B&W and colour prints, binding, lamination and scanning. Open hours vary — call ahead.`;
    return {
      // No "— Snaprint" suffix: the root layout's title template already
      // appends "· Snaprint". The literal "· Snaprint" we add here ends up
      // rendered as the title-template suffix anyway; keeping it makes the
      // string readable in code and in OG/email previews where the template
      // doesn't apply.
      title,
      description,
      keywords: college.keywords,
      alternates: { canonical: `/print-near/${college.slug}` },
      openGraph: {
        title: `${count > 0 ? count + " " : ""}Xerox shops near ${name}, ${cityName} — Snaprint`,
        description,
        url: `${SITE_URL}/print-near/${college.slug}`,
        type: "website",
        images: [`${SITE_URL}/og.png`],
      },
    };
  }

  const area = getArea(params.entity);
  if (area) {
    const cityName = getCityName(area.city);
    const count = area.liveLocations?.length ?? 0;
    const title =
      count > 0
        ? `${count} Xerox Shops in ${area.name}, ${cityName} — Open Now · Snaprint`
        : `Print Shops in ${area.name}, ${cityName} · Snaprint`;
    const description =
      count > 0
        ? `${count} verified print and xerox shops in ${area.name}, ${cityName}. B&W from ₹3, colour prints, spiral binding, scan, ID photos. Open hours vary — call ahead.`
        : `Print and xerox shops in ${area.name}, ${cityName}. B&W and colour prints, binding, lamination and scanning. Open hours vary — call ahead.`;
    return {
      title,
      description,
      keywords: area.keywords,
      alternates: { canonical: `/print-near/${area.slug}` },
      openGraph: {
        title: `${count > 0 ? count + " " : ""}Xerox shops in ${area.name}, ${cityName} — Snaprint`,
        description,
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
          // The college's own official homepage — sameAs, not url, since
          // url must stay the canonical URL of THIS page (the Place half
          // of the dual @type). sameAs is schema.org's property for "this
          // real-world entity also has a page at this other URL".
          ...(college.website ? { sameAs: college.website } : {}),
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
        // Per-shop LocalBusiness nodes — one per verified shop within radius.
        // Gives each shop its own @id so search engines and AI extractors can
        // disambiguate them. Only emitted when getShopsNearCollege returns
        // data; for pages with 0 nearby shops we skip the loop entirely.
        ...(nearbyShops.length > 0
          ? nearbyShops.map((loc, i) => ({
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#shop-${college.slug}-${i}`,
              name: loc.name,
              description: `${loc.name} is one of the verified print shops in ${getCityName(college.city)}. Services include B&W and colour prints, spiral binding, lamination, and scanning.`,
              ...(loc.placeId
                ? { url: `https://www.google.com/maps/place/?q=place_id:${loc.placeId}` }
                : {}),
              ...(loc.phone ? { telephone: loc.phone } : {}),
              address: {
                "@type": "PostalAddress",
                streetAddress: loc.address,
                addressLocality: getCityName(college.city),
                addressRegion: getCityState(college.city),
                addressCountry: "IN",
              },
              ...(loc.lat && loc.lng
                ? {
                    geo: {
                      "@type": "GeoCoordinates",
                      latitude: loc.lat,
                      longitude: loc.lng,
                    },
                  }
                : {}),
              ...(loc.rating
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: loc.rating,
                      reviewCount: loc.reviews || 1,
                    },
                  }
                : {}),
              parentOrganization: { "@id": `${SITE_URL}/#organization` },
            }))
          : []),
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

    const areaLocations = area.liveLocations ?? [];
    // Fallback anchor for the parent node's address/geo/telephone — only
    // used when it exists, and always taken as a whole so the three fields
    // describe the same real place instead of mixing one shop's coordinates
    // with a street-less, area-wide address.
    const firstLoc = areaLocations[0];
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
          address: {
            "@type": "PostalAddress",
            ...(firstLoc ? { streetAddress: firstLoc.address } : {}),
            addressLocality: area.name,
            addressRegion: getCityState(area.city),
            addressCountry: "IN",
            ...(area.pinCodes?.[0] ? { postalCode: area.pinCodes[0] } : {}),
          },
          ...(firstLoc?.lat && firstLoc?.lng
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: firstLoc.lat,
                  longitude: firstLoc.lng,
                },
              }
            : {}),
          ...(firstLoc?.phone ? { telephone: firstLoc.phone } : {}),
          // Parent summary node — kept as a stable @id that does NOT depend
          // on individual shop entries, so removing a shop from liveLocations
          // doesn't orphan the page-level node. Per-shop nodes below carry
          // their own verifiable address/geo/telephone.
          areaServed: { "@id": `${SITE_URL}/#organization` },
          parentOrganization: { "@id": `${SITE_URL}/#organization` },
        },
        // Per-shop LocalBusiness nodes — one per liveLocation. Each carries
        // its own @id so search engines and AI extractors can index the
        // individual shop entity. For areas with 0 liveLocations the map
        // returns an empty array and no per-shop nodes are emitted, leaving
        // the parent summary node as the only LocalBusiness in the graph.
        ...(areaLocations.length > 0
          ? areaLocations.map((loc, i) => ({
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#shop-${area.slug}-${i}`,
              name: loc.name,
              description: `${loc.name} is one of the verified print shops in ${area.name}, ${getCityName(area.city)}. Services include B&W and colour prints, spiral binding, lamination, and scanning.`,
              ...(loc.placeId
                ? { url: `https://www.google.com/maps/place/?q=place_id:${loc.placeId}` }
                : {}),
              ...(loc.phone ? { telephone: loc.phone } : {}),
              address: {
                "@type": "PostalAddress",
                streetAddress: loc.address,
                addressLocality: area.name,
                addressRegion: getCityState(area.city),
                addressCountry: "IN",
                ...(area.pinCodes?.[0] ? { postalCode: area.pinCodes[0] } : {}),
              },
              ...(loc.lat && loc.lng
                ? {
                    geo: {
                      "@type": "GeoCoordinates",
                      latitude: loc.lat,
                      longitude: loc.lng,
                    },
                  }
                : {}),
              ...(loc.rating
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: loc.rating,
                      reviewCount: loc.reviews || 1,
                    },
                  }
                : {}),
              parentOrganization: { "@id": `${SITE_URL}/#organization` },
            }))
          : []),
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
