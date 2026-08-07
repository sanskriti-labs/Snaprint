import { NextResponse } from "next/server";
import { getAllLiveAreas } from "@/content/pseo/seo";

export const revalidate = 3600;

export function GET() {
  const areas = getAllLiveAreas();

  const data = areas.map((area) => ({
    slug: area.slug,
    name: area.name,
    city: area.city,
    pinCodes: area.pinCodes,
    intro: area.intro,
    keywords: area.keywords,
    presence: area.presence,
    lastReviewed: area.lastReviewed,
    liveLocations: (area.liveLocations ?? []).map((loc) => ({
      name: loc.name,
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
      phone: loc.phone ?? null,
      rating: loc.rating ?? null,
      reviews: loc.reviews ?? 0,
      placeId: loc.placeId ?? null,
    })),
  }));

  return NextResponse.json(
    { count: data.length, areas: data },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "application/json",
      },
    }
  );
}
