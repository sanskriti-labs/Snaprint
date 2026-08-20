import Link from "next/link";
import type { City, College, Area } from "@/content/pseo/types";
import { getCityName } from "@/content/pseo/seo";

type Props = {
  parentCity?: City;
  colleges?: College[];
  areas?: Area[];
  neighborCities?: City[];
};

function LinkBlock({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  if (links.length === 0) return null;
  return (
    <div>
      <p className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-[#888780]">
        {title}
      </p>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="font-body text-[13.5px] text-[#6B6B66] underline-offset-2 transition-colors hover:text-[#E63946] hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PseoCrossLinks({ parentCity, colleges, areas, neighborCities }: Props) {
  const hasAny =
    (colleges?.length ?? 0) > 0 ||
    (areas?.length ?? 0) > 0 ||
    (neighborCities?.length ?? 0) > 0;

  if (!hasAny) return null;

  return (
    <section className="mb-16 rounded-2xl border border-[#E8E6E0] bg-[#F5F3EE] px-8 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#E8E6E0]" />
        <p className="shrink-0 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888780]">
          Explore more locations
        </p>
        <span className="h-px flex-1 bg-[#E8E6E0]" />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {parentCity && (
          <LinkBlock
            title="Also in this city"
            links={[
              ...(colleges ?? []).map((c) => ({
                label: `Near ${c.shortName ?? c.name}`,
                href: `/print-near/${c.slug}`,
              })),
              ...(areas ?? []).map((a) => ({
                label: a.name,
                href: `/print-near/${a.slug}`,
              })),
            ]}
          />
        )}
        {(neighborCities?.length ?? 0) > 0 && (
          <LinkBlock
            title="Nearby cities"
            links={(neighborCities ?? []).map((c) => ({
              label: c.name,
              href: `/instant-print/${c.slug}`,
            }))}
          />
        )}
        {!parentCity && (
          <LinkBlock
            title="Other locations"
            links={[
              ...(colleges ?? []).map((c) => ({
                label: `Near ${c.shortName ?? c.name}`,
                href: `/print-near/${c.slug}`,
              })),
              ...(areas ?? []).map((a) => ({
                label: a.name,
                href: `/print-near/${a.slug}`,
              })),
            ]}
          />
        )}
      </div>
      {parentCity && (
        <div className="mt-12 border-t border-[#E8E6E0] pt-10">
          <h3 className="font-display text-[20px] font-bold mb-3 text-[#111110]">
            Own a xerox shop in {getCityName(parentCity.slug)}?
          </h3>
          <p className="text-[15px] leading-[1.78] text-[#3A3A36] mb-4">
            Add the Snaprint S1 kiosk to your counter and earn from after-hours
            print jobs. 24/7 unmanned operation, no queue at your counter,
            live revenue dashboard.
          </p>
          <a
            href="/book"
            className="inline-block bg-[#E63946] hover:bg-[#C1121F] text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Book a Demo →
          </a>
        </div>
      )}
    </section>
  );
}
