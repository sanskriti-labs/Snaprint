import Link from "next/link";
import type { City, College, Area } from "@/content/pseo/types";

type Props =
  | { kind: "city"; city: City; href: string }
  | { kind: "college"; college: College; href: string }
  | { kind: "area"; area: Area; href: string };

function Card({
  title,
  sub,
  href,
  state,
}: {
  title: string;
  sub?: string;
  href: string;
  state?: string;
}) {
  return (
    <Link
      href={href}
      className={`
        group block rounded-2xl border border-[#E8E6E0] bg-white p-6
        transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E63946]
      `}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
    >
      <h3 className="mb-2 font-display text-[18px] font-extrabold tracking-tight text-[#111110] transition-colors group-hover:text-[#E63946]">
        {title}
      </h3>
      {sub && (
        <p className="mb-3 font-body text-[13px] text-[#888780]">{sub}</p>
      )}
      <div className="flex items-center justify-between">
        {state && (
          <span className="rounded-full bg-snap-red-tint px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-[#E63946]">
            {state}
          </span>
        )}
        <span
          aria-hidden
          className="ml-auto font-body text-[12px] text-[#888780] transition-colors group-hover:text-[#E63946]"
        >
          View →
        </span>
      </div>
    </Link>
  );
}

export default function EntityCard(props: Props) {
  if (props.kind === "city") {
    return (
      <Card
        title={props.city.name}
        sub={`${props.city.state} · ${props.city.pinCodes.length} pin codes`}
        href={props.href}
        state={props.city.presence === "planned" ? "Coming soon" : undefined}
      />
    );
  }
  if (props.kind === "college") {
    return (
      <Card
        title={props.college.shortName ?? props.college.name}
        sub={props.college.address}
        href={props.href}
        state={props.college.presence === "planned" ? "Coming soon" : undefined}
      />
    );
  }
  return (
    <Card
      title={props.area.name}
      sub={`${props.area.city} · ${props.area.pinCodes.join(", ")}`}
      href={props.href}
      state={props.area.presence === "planned" ? "Coming soon" : undefined}
    />
  );
}
