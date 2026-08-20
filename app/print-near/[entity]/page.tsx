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
  buildBreadcrumbList,
  withSharedKeywords,
} from "@/content/pseo/seo";
import { baseFaqCount } from "@/content/pseo/faqs";
import PseoPage from "@/components/PseoPage";

const SITE_URL = "https://snaprints.com";

export function generateStaticParams() {
  const slugs = [...getAllCollegeSlugs(), ...getAllAreaSlugs()];
  return slugs.map((entity) => ({ entity }));
}

/**
 * "1 Xerox Shops" reads as a bug in the SERP and depresses CTR. Every
 * count-bearing string in this file routes through these two helpers so
 * the singular case is handled once rather than at each interpolation.
 */
function shopNoun(count: number): string {
  return count === 1 ? "Xerox Shop" : "Xerox Shops";
}

function shopsPhrase(count: number): string {
  return count === 1 ? "listed xerox and print shop" : "listed xerox and print shops";
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
    // No "· Snaprint" suffix here — the root layout's title template
    // (app/layout.tsx) already appends it to every page, so adding it
    // here doubles it in the rendered <title>.
    const title =
      count > 0
        ? `${count} ${shopNoun(count)} Near ${name}, ${cityName} [2026]`
        : `Print Shops Near ${name}, ${cityName} [2026]`;
    // Description target 150–165 chars; include count, key service, and a
    // soft call-to-action. Falls back to a generic blurb when count is 0.
    const description =
      count > 0
        ? `${count} ${shopsPhrase(count)} within 1.5 km of ${name}, ${cityName}. B&W from ₹3, colour prints, binding, scan, ID photos. Call ahead for hours.`
        : `Find print and xerox shops near ${name}, ${cityName}. B&W and colour prints, binding, lamination and scanning. Open hours vary — call ahead.`;
    return {
      title,
      description,
      keywords: withSharedKeywords(college.keywords),
      alternates: { canonical: `/print-near/${college.slug}` },
      openGraph: {
        title: `${count > 0 ? count + " " : ""}${count === 1 ? "Xerox shop" : "Xerox shops"} near ${name}, ${cityName} — Snaprint`,
        description,
        url: `${SITE_URL}/print-near/${college.slug}`,
        type: "website",
        images: [`${SITE_URL}/og.png`],
      },
      twitter: {
        title: `${count > 0 ? count + " " : ""}${count === 1 ? "Xerox shop" : "Xerox shops"} near ${name}, ${cityName} — Snaprint`,
        description,
      },
    };
  }

  const area = getArea(params.entity);
  if (area) {
    const cityName = getCityName(area.city);
    const count = area.liveLocations?.length ?? 0;
    // No "· Snaprint" suffix — see the college branch above. Drop the
    // "— Open Now" tail on long area names so the title (plus the
    // layout's "· Snaprint" suffix) stays under ~70 chars.
    const shortTitle = `${count} ${shopNoun(count)} in ${area.name}, ${cityName}`;
    const title =
      count > 0
        ? (shortTitle.length <= 48 ? `${shortTitle} — Open Now` : shortTitle)
        : `Print Shops in ${area.name}, ${cityName}`;
    const description =
      count > 0
        ? `${count} ${shopsPhrase(count)} in ${area.name}, ${cityName}. B&W from ₹3, colour prints, spiral binding, scan, ID photos. Open hours vary — call ahead.`
        : `Print and xerox shops in ${area.name}, ${cityName}. B&W and colour prints, binding, lamination and scanning. Open hours vary — call ahead.`;
    return {
      title,
      description,
      keywords: withSharedKeywords(area.keywords),
      alternates: { canonical: `/print-near/${area.slug}` },
      openGraph: {
        title: `${count > 0 ? count + " " : ""}${count === 1 ? "Xerox shop" : "Xerox shops"} in ${area.name}, ${cityName} — Snaprint`,
        description,
        url: `${SITE_URL}/print-near/${area.slug}`,
        type: "website",
        images: [`${SITE_URL}/og.png`],
      },
      twitter: {
        title: `${count > 0 ? count + " " : ""}${count === 1 ? "Xerox shop" : "Xerox shops"} in ${area.name}, ${cityName} — Snaprint`,
        description,
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
    const faqs = getLocationFaqs("college", params.entity, college.presence);
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
        // Per-shop LocalBusiness nodes — one per listed shop within radius.
        // Gives each shop its own @id so search engines and AI extractors can
        // disambiguate them. Only emitted when getShopsNearCollege returns
        // data; for pages with 0 nearby shops we skip the loop entirely.
        // These are independent third-party businesses discovered via public
        // listings, not Snaprint customers or partners — no parentOrganization
        // link to Snaprint's Organization node.
        ...(nearbyShops.length > 0
          ? nearbyShops.map((loc, i) => ({
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#shop-${college.slug}-${i}`,
              name: loc.name,
              description: `${loc.name} is one of the listed print shops in ${getCityName(college.city)}. Services include B&W and colour prints, spiral binding, lamination, and scanning.`,
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
            }))
          : []),
        // BreadcrumbList — inserts the parent city crumb once it's published
        buildBreadcrumbList(
          SITE_URL,
          { name: "Print Near You", path: "/print-near" },
          { name: college.name, path: `/print-near/${college.slug}` },
          college.city
        ),
        // FAQPage — only when this entity has a local FAQ tail beyond the
        // boilerplate. Boilerplate alone is identical across every entity at
        // a given presence level; emitting FAQPage schema for content that
        // isn't unique to this page teaches search engines the page has less
        // to say than the page count suggests. The visible FAQ accordion
        // (below, via `faqs={faqs}`) still shows the boilerplate Qs — this
        // only gates the structured-data node.
        ...(faqs.length > baseFaqCount(college.presence)
          ? [
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ]
          : []),
      ],
    };

    return (
      <PseoPage
        props={{ kind: "college", college, liveLocations: nearbyShops, cityName: getCityName(college.city) }}
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
    const faqs = getLocationFaqs("area", params.entity, area.presence);

    const areaLocations = area.liveLocations ?? [];
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          // A directory of listed shops is a collection, not itself a
          // business — CollectionPage + ItemList, not LocalBusiness. This
          // node describes the page; the real businesses are the per-shop
          // LocalBusiness nodes below, each with its own @id.
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#location-${area.slug}`,
          name: `Print and xerox shops in ${area.name}, ${getCityName(area.city)}`,
          description: area.intro,
          url: `${SITE_URL}/print-near/${area.slug}`,
          image: `${SITE_URL}/og.png`,
          isPartOf: { "@id": `${SITE_URL}/#website` },
          ...(areaLocations.length > 0
            ? {
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: areaLocations.map((_loc, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    item: { "@id": `${SITE_URL}/#shop-${area.slug}-${i}` },
                  })),
                },
              }
            : {}),
        },
        // Per-shop LocalBusiness nodes — one per liveLocation. Each carries
        // its own @id so search engines and AI extractors can index the
        // individual shop entity. For areas with 0 liveLocations the map
        // returns an empty array and no per-shop nodes are emitted, leaving
        // the parent CollectionPage node as the only node in the graph.
        // These are independent third-party businesses discovered via public
        // listings, not Snaprint customers or partners — no parentOrganization
        // link to Snaprint's Organization node.
        ...(areaLocations.length > 0
          ? areaLocations.map((loc, i) => ({
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#shop-${area.slug}-${i}`,
              name: loc.name,
              description: `${loc.name} is one of the listed print shops in ${area.name}, ${getCityName(area.city)}. Services include B&W and colour prints, spiral binding, lamination, and scanning.`,
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
            }))
          : []),
        // BreadcrumbList — inserts the parent city crumb once it's published
        buildBreadcrumbList(
          SITE_URL,
          { name: "Print Near You", path: "/print-near" },
          { name: area.name, path: `/print-near/${area.slug}` },
          area.city
        ),
        // FAQPage — only when this entity has a local FAQ tail; see the
        // college branch above for why.
        ...(faqs.length > baseFaqCount(area.presence)
          ? [
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ]
          : []),
      ],
    };

    return (
      <PseoPage
        props={{ kind: "area", area, liveLocations: area.liveLocations ?? [], cityName: getCityName(area.city) }}
        faqs={faqs}
        crossLinks={{ parentCity: parentCity ?? undefined, colleges: collegesInArea, areas: areasInCity, neighborCities: neighbors }}
        jsonLd={jsonLd}
      />
    );
  }

  notFound();
}
