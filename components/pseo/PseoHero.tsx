import type { City, College, Area } from "@/content/pseo/types";

type Props =
  | { kind: "city"; city: City }
  | { kind: "college"; college: College }
  | { kind: "area"; area: Area };

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
      {children}
    </p>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="mb-6 font-display font-extrabold leading-[1.05] tracking-[-2px] text-[#111110]"
      style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
    >
      {children}
    </h1>
  );
}

function Intro({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-[580px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
      {children}
    </p>
  );
}

export default function PseoHero(props: Props) {
  if (props.kind === "city") {
    const { city } = props;
    return (
      <div className="mb-16">
        <Eyebrow>Instant print in {city.name}</Eyebrow>
        <H1>Find print and xerox shops in {city.name}</H1>
        <Intro>{city.intro}</Intro>
      </div>
    );
  }

  if (props.kind === "college") {
    const { college } = props;
    const name = college.shortName ?? college.name;
    // H1 copy varies by presence to avoid claiming a kiosk exists
    // when no shop data is verified within radius (planned).
    const headline =
      college.presence === "live"
        ? `Find print and xerox shops near ${name}, ${college.city}`
        : `Print and xerox shops near ${name}, ${college.city}`;
    return (
      <div className="mb-16">
        <Eyebrow>Print near {name} campus</Eyebrow>
        <H1>{headline}</H1>
        <Intro>{college.intro}</Intro>
        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-body text-[14px] font-medium text-[#E63946] underline underline-offset-4"
          >
            Visit {name} official website ↗
          </a>
        )}
      </div>
    );
  }

  // kind === "area"
  const { area } = props;
  return (
    <div className="mb-16">
      <Eyebrow>Instant print in {area.name}</Eyebrow>
      <H1>Find print and xerox shops in {area.name}, {area.city}</H1>
      <Intro>{area.intro}</Intro>
    </div>
  );
}
