import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";

// ─── Every kiosk listed here is real, current rollout status as of Aug 2026 —
// 2 live (private use, not public walk-in yet) + 5 coming soon in Bengaluru,
// going live by 5 September 2026. Do not add locations that aren't confirmed.

const SITE_URL = "https://snaprints.com";

export const metadata: Metadata = {
  title: "Find a Snaprint Kiosk — Live & Coming Soon",
  description:
    "See exactly where Snaprint kiosks are live today and where they're opening next across Bengaluru and Hyderabad.",
  alternates: { canonical: "/find-snaprint" },
  openGraph: {
    title: "Find a Snaprint Kiosk",
    description: "Live and upcoming Snaprint kiosk locations across Bengaluru and Hyderabad.",
    url: `${SITE_URL}/find-snaprint`,
    type: "website",
    images: [`${SITE_URL}/og.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Snaprint Kiosk",
    description: "Live and upcoming Snaprint kiosk locations across Bengaluru and Hyderabad.",
    images: [`${SITE_URL}/og.png`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/find-snaprint#page`,
      url: `${SITE_URL}/find-snaprint`,
      name: "Find a Snaprint Kiosk",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Find Snaprint", item: `${SITE_URL}/find-snaprint` },
      ],
    },
  ],
};

type Kiosk = {
  name: string;
  city: string;
  area?: string;
  status: "live" | "soon";
  note?: string;
  image?: string;
};

const LIVE: Kiosk[] = [
  {
    name: "GTC",
    city: "Bengaluru",
    status: "live",
    note: "Private use — not yet open to walk-in customers",
    image: "/kiosks/gtc-bangalore.png",
  },
  {
    name: "Lakshmi Print",
    city: "Hyderabad",
    status: "live",
    note: "Private use — not yet open to walk-in customers",
    image: "/kiosks/lakshmi-print-hyderabad.png",
  },
];

const COMING_SOON: Kiosk[] = [
  { name: "Quick Copy Point", city: "Bengaluru", area: "Koramangala", status: "soon" },
  { name: "Sri Xerox & Stationery", city: "Bengaluru", area: "Indiranagar", status: "soon" },
  { name: "Metro Digital Prints", city: "Bengaluru", area: "Whitefield", status: "soon" },
  { name: "Campus Copy Corner", city: "Bengaluru", area: "Jayanagar", status: "soon" },
  { name: "City Print Studio", city: "Bengaluru", area: "HSR Layout", status: "soon" },
];

function StatusBadge({ status }: { status: "live" | "soon" }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(22,163,74,0.1)] px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#16A34A]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(230,57,70,0.08)] px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#E63946]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#E63946]" />
      Coming soon
    </span>
  );
}

function KioskCard({ kiosk, compact }: { kiosk: Kiosk; compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]">
      <div className={`relative w-full bg-[#F8F7F4] ${compact ? "h-[140px]" : "h-[220px]"}`}>
        {kiosk.image ? (
          <ImageWithSkeleton
            src={kiosk.image}
            alt={`Snaprint kiosk at ${kiosk.name}, ${kiosk.city}`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#CCCCC5" strokeWidth="1.6">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-body text-[11px] text-[#AAAAAA]">Photo coming with launch</span>
          </div>
        )}
      </div>
      <div className={compact ? "p-4" : "p-5"}>
        <div className="mb-2.5">
          <StatusBadge status={kiosk.status} />
        </div>
        <h3 className={`mb-1 font-display font-bold text-[#111110] ${compact ? "text-[15px]" : "text-[17px]"}`}>{kiosk.name}</h3>
        <p className="font-body text-[13px] text-[#6B6B66]">
          {kiosk.area ? `${kiosk.area}, ` : ""}
          {kiosk.city}
        </p>
        {kiosk.status === "soon" && (
          <p className="mt-2 font-body text-[12px] text-[#999994]">Live by 5 September 2026</p>
        )}
        {kiosk.note && <p className="mt-2 font-body text-[12px] text-[#999994]">{kiosk.note}</p>}
      </div>
    </div>
  );
}

export default function FindSnaprintPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="bg-paper px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          {/* Header */}
          <p className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
            Find Snaprint
          </p>
          <h1
            className="mb-6 max-w-[640px] font-display font-extrabold leading-[1.05] tracking-[-2px] text-[#111110]"
            style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
          >
            Find a kiosk near you.
          </h1>
          <p className="mb-12 max-w-[560px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
            Snaprint is rolling out across Bengaluru and Hyderabad. Here&apos;s exactly what&apos;s live today
            and what&apos;s opening next — no exaggeration, just the real rollout.
          </p>

          {/* Stats strip */}
          <div className="mb-16 grid max-w-[480px] grid-cols-3 gap-4">
            <div>
              <div className="font-mono tabular-nums text-[32px] font-extrabold leading-none text-[#111110]">7</div>
              <div className="mt-1 font-body text-[12px] text-[#999994]">total kiosks</div>
            </div>
            <div>
              <div className="font-mono tabular-nums text-[32px] font-extrabold leading-none text-[#16A34A]">2</div>
              <div className="mt-1 font-body text-[12px] text-[#999994]">live today</div>
            </div>
            <div>
              <div className="font-mono tabular-nums text-[32px] font-extrabold leading-none text-[#E63946]">5</div>
              <div className="mt-1 font-body text-[12px] text-[#999994]">coming by Sept 5</div>
            </div>
          </div>

          {/* Live section */}
          <section className="mb-16">
            <h2 className="mb-2 font-display text-[22px] font-bold text-[#111110]">Live today</h2>
            <p className="mb-6 max-w-[560px] font-body text-[13.5px] font-light leading-[1.7] text-[#6B6B66]">
              These kiosks are already printing — currently for private, internal use at the host
              location, not open to walk-in public yet.
            </p>
            <div className="grid max-w-[560px] grid-cols-1 gap-4 sm:grid-cols-2">
              {LIVE.map((k) => (
                <KioskCard key={k.name} kiosk={k} compact />
              ))}
            </div>
          </section>

          {/* Coming soon section */}
          <section>
            <h2 className="mb-2 font-display text-[22px] font-bold text-[#111110]">Coming soon — Bengaluru</h2>
            <p className="mb-6 max-w-[560px] font-body text-[13.5px] font-light leading-[1.7] text-[#6B6B66]">
              Five more kiosks are being installed across Bengaluru, going live by 5 September 2026.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {COMING_SOON.map((k) => (
                <KioskCard key={k.name} kiosk={k} />
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-16 flex flex-col items-start gap-5 rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white px-8 py-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[420px] font-body text-[15px] font-light text-[#555550]">
              Want a Snaprint kiosk at your shop, campus or workspace?
            </p>
            <a
              href="/book"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-red px-7 py-3.5 font-display text-[13.5px] font-semibold text-white transition-colors duration-[--d-hover] ease-hover hover:bg-red-deep"
            >
              Register Kiosk
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
