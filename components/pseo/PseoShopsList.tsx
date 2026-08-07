import { cn } from "@/lib/utils";
import type { LiveLocation } from "@/content/pseo/types";

type Props = {
  locations: LiveLocation[];
  displayName: string;
  preposition?: "in" | "near";
};

function googleMapsUrl(loc: LiveLocation): string {
  if (loc.placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${loc.placeId}`;
  }
  if (loc.lat && loc.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`;
}

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill={i < filled ? "#F59E0B" : "#E5E3DF"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 0L6.12 3.47H9.75L6.8 5.63L7.93 9.09L5 6.91L2.07 9.09L3.2 5.63L0.25 3.47H3.88L5 0Z" />
        </svg>
      ))}
      <span className="ml-1 font-body text-[11px] text-[#888780]">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function PseoShopsList({ locations, displayName, preposition = "in" }: Props) {
  if (!locations || locations.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="font-display text-[22px] font-bold text-[#111110]">
            {locations.length} xerox shops {preposition} {displayName}
          </h2>
          <p className="mt-1 font-body text-[13px] text-[#888780]">
            Verified print &amp; copy shops near you — updated August 2026
          </p>
        </div>
        <a
          href={`https://www.google.com/maps/search/xerox+shops+${preposition}+${encodeURIComponent(displayName)}+Bangalore`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-[#E8E6E0] bg-white px-4 py-1.5 font-body text-[12px] text-[#6B6B66] transition-colors hover:border-[#111110] hover:text-[#111110]"
        >
          View on Maps →
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {locations.map((loc, i) => (
          <div
            key={loc.placeId ?? i}
            className={cn(
              "flex flex-col gap-2 rounded-xl border border-[#E8E6E0] bg-[#FDFCFA] p-4",
              "transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[14px] font-bold text-[#111110] leading-snug">
                  {loc.name}
                </h3>
                <p className="mt-1 font-body text-[12px] text-[#888780] leading-relaxed">
                  {loc.address}
                </p>
              </div>
              <a
                href={googleMapsUrl(loc)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${loc.name} on Google Maps`}
                className="shrink-0 rounded-lg bg-[#F5F3EE] p-2 text-[#6B6B66] transition-colors hover:bg-[#E8E6E0] hover:text-[#111110]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {loc.rating && (
                <StarRating rating={loc.rating} />
              )}
              {loc.reviews !== undefined && loc.reviews > 0 && (
                <span className="font-body text-[11px] text-[#888780]">
                  {loc.reviews.toLocaleString()} reviews
                </span>
              )}
              {loc.phone && (
                <a
                  href={`tel:${loc.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-1 font-body text-[11px] text-[#6B6B66] transition-colors hover:text-[#E63946]"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 5.31 5.31l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {loc.phone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
