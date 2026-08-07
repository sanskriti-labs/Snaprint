import { NextResponse } from "next/server";
import { getArea } from "@/content/pseo/seo";
import type { Slug } from "@/content/pseo/types";

export const revalidate = 3600;

export function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug as Slug;
  const area = getArea(slug);

  if (!area) {
    return NextResponse.json(
      { error: "Area not found or not live", slug },
      { status: 404 }
    );
  }

  const data = {
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
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json",
    },
  });
}
