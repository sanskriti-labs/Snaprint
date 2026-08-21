import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Machine3D from "@/components/Machine3D";

// ─── Every fact on this page is sourced from the real 2026 Kiosk Ownership
// PDF brochure (public/snaprint-kiosk-brochure.pdf) — this is that same
// document rebuilt as a native, numbered web page instead of an embedded
// PDF viewer, so it reads properly on mobile and loads instantly. Nothing
// here should say anything the PDF doesn't already say.

const SITE_URL = "https://snaprints.com";
const PDF_PATH = "/snaprint-kiosk-brochure.pdf";
const TOTAL_PAGES = 7;

export const metadata: Metadata = {
  title: "Kiosk Ownership Brochure — Snaprint",
  description:
    "Own a Snaprint self-service print kiosk. Full pricing across all three models, unit economics, specifications and what's included — read the full brochure online.",
  alternates: { canonical: "/franchise/brochure" },
  openGraph: {
    title: "Snaprint — Kiosk Ownership Brochure",
    description: "Own a self-service print kiosk. Three models, transparent pricing, zero platform fee.",
    url: `${SITE_URL}/franchise/brochure`,
    type: "website",
    images: [`${SITE_URL}/og.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snaprint — Kiosk Ownership Brochure",
    description: "Own a self-service print kiosk. Three models, transparent pricing, zero platform fee.",
    images: [`${SITE_URL}/og.png`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/franchise/brochure#page`,
      url: `${SITE_URL}/franchise/brochure`,
      name: "Snaprint Kiosk Ownership Brochure",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Kiosk Ownership Brochure", item: `${SITE_URL}/franchise/brochure` },
      ],
    },
  ],
};

function PageMeta({ n, section }: { n: number; section: string }) {
  return (
    <div className="mb-10 flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] pb-4">
      <span className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[#AAAAAA]">
        Snaprint · Kiosk Brochure
      </span>
      <span className="font-mono tabular-nums text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AAAAAA]">
        {String(n).padStart(2, "0")} / {String(TOTAL_PAGES).padStart(2, "0")} · {section}
      </span>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="h-px w-6 bg-[#E63946]" />
      <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E63946]">{children}</span>
    </div>
  );
}

function StatCard({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="rounded-xl border border-l-[3px] border-[rgba(0,0,0,0.07)] border-l-[#E63946] bg-[#F8F7F4] p-5">
      <div className="mb-2 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#999994]">{label}</div>
      <div className="mb-1 font-mono tabular-nums text-[26px] font-bold leading-none text-[#111110]">{value}</div>
      <div className="font-body text-[12px] text-[#777770]">{caption}</div>
    </div>
  );
}

function FeatureRow({ items }: { items: { n: string; title: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-[rgba(0,0,0,0.08)] pt-8 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((f) => (
        <div key={f.n}>
          <div className="mb-2 font-mono tabular-nums text-[12px] font-bold text-[#E63946]">{f.n}</div>
          <div className="mb-1.5 font-display text-[15px] font-bold text-[#111110]">{f.title}</div>
          <p className="font-body text-[13px] font-light leading-[1.6] text-[#777770]">{f.body}</p>
        </div>
      ))}
    </div>
  );
}

function Page({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`border-b border-[rgba(0,0,0,0.06)] bg-white px-6 py-16 md:px-16 md:py-20 ${className}`}>
      <div className="mx-auto max-w-[900px]">{children}</div>
    </section>
  );
}

const TIERS = [
  {
    name: "S1",
    tagline: "The smart way in.",
    price: "84,999",
    bullets: ["Colour & black-and-white printing", "Up to 250 A4 sheets capacity", "Zero setup cost — full ownership"],
    bestFor: "Shopkeepers, stationery stores, coaching centres · low–medium footfall",
  },
  {
    name: "S1 Pro",
    tagline: "Built for the daily rush.",
    price: "1,39,999",
    bullets: ["Higher-speed colour & B/W printing", "Up to 550 A4 sheets capacity", "Zero setup cost — full ownership"],
    bestFor: "College & university campuses, co-working spaces · medium–high footfall",
  },
  {
    name: "S1 Pro Max",
    tagline: "Engineered for volume that never stops.",
    price: "2,99,999",
    bullets: ["Enterprise-grade print engine", "Up to 1,830 A4 sheets* capacity", "Zero setup cost — full ownership"],
    bestFor: "Malls, commercial hubs, multi-kiosk operators · highest footfall",
    popular: true,
  },
];

const SPEC_ROWS: [string, string, string, string][] = [
  ["Starting price", "₹84,999", "₹1,39,999", "₹2,99,999"],
  ["Print resolution", "Up to 4800×1200 dpi", "Up to 4800×2400 dpi", "High-res enterprise engine"],
  ["Paper capacity", "Up to 250 sheets", "Up to 550 sheets", "Up to 1,830 sheets*"],
  ["Connectivity", "Wi-Fi, Wi-Fi Direct, Ethernet", "Wi-Fi, Ethernet", "Wi-Fi, Ethernet, network print"],
  ["Cost per page, B/W*", "≈ ₹1.40", "≈ ₹0.85", "≈ ₹0.65"],
  ["Margin per page*", "≈ ₹0.60", "≈ ₹1.15", "≈ ₹1.35"],
];

const PAYBACK_ROWS = [
  { model: "S1", volume: "500/day", months: "≈ 1.9 mo" },
  { model: "S1 Pro", volume: "1,000/day", months: "≈ 1.5 mo" },
  { model: "S1 Pro Max", volume: "2,000/day", months: "≈ 1.6 mo" },
];

export default function FranchiseBrochurePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="bg-white">
        {/* ── COVER ── */}
        <section
          className="relative overflow-hidden px-6 pb-16 pt-32 md:px-16 md:pt-40"
          style={{ background: "linear-gradient(160deg, #0f0f0e 0%, #111110 55%, #1a0405 100%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(230,57,70,0.16) 0%, transparent 70%)", filter: "blur(50px)" }}
            aria-hidden
          />

          <div className="relative mx-auto flex max-w-[1100px] items-center justify-between">
            <span className="font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">Snaprint</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">
              Kiosk Ownership · 2026
            </span>
          </div>

          <div className="relative mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-14 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            <div>
              <div className="mb-5 flex items-center gap-1.5">
                <span className="text-[13px] text-[#E63946]">★</span>
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E63946]">
                  India&apos;s smartest print network
                </span>
              </div>
              <h1 className="mb-6 font-display font-extrabold leading-[1.06] tracking-[-2px] text-white" style={{ fontSize: "clamp(34px, 4.5vw, 52px)" }}>
                <span className="text-[#E63946]">Own the kiosk.</span> Set your price. Build your print business.
              </h1>
              <p className="mb-10 max-w-[440px] font-body text-[15px] font-light leading-[1.75] text-white/55">
                A self-service printing machine you buy once, run on your own terms, and keep — full ownership, no
                rent, no revenue share.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-full bg-[#E63946] px-6 py-3.5 font-display text-[13.5px] font-semibold text-white transition-colors hover:bg-red-deep"
                >
                  Book a Demo
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href={PDF_PATH}
                  download
                  className="font-body text-[13px] font-medium text-white/50 underline underline-offset-4 transition-colors hover:text-white"
                >
                  Download as PDF
                </a>
              </div>
            </div>

            <div className="hidden justify-self-center lg:flex">
              <Machine3D vignette interactive={false} scale={0.95} />
            </div>
          </div>

          <div className="relative mx-auto mt-16 grid max-w-[1100px] grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
            {[
              ["₹84,999", "Starting price + GST"],
              ["Full Ownership", "Yours from day one"],
              ["24/7", "Operating uptime"],
              ["Instant Setup", "Live within the hour"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="mb-1 font-mono tabular-nums text-[18px] font-bold text-white">{v}</div>
                <div className="font-body text-[11px] text-white/40">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 01 · OVERVIEW ── */}
        <Page>
          <PageMeta n={1} section="Overview" />
          <Eyebrow>The opportunity</Eyebrow>
          <h2 className="mb-6 font-display text-[32px] font-extrabold leading-[1.1] tracking-[-1px] text-[#111110] sm:text-[38px]">
            The queue is the problem.<br /><span className="text-[#E63946]">Not the printing.</span>
          </h2>
          <p className="mb-4 font-body text-[15px] font-light leading-[1.8] text-[#555550]">
            People already expect to scan, pay and walk away — for food, for transit, for almost everything.
            Printing is one of the last everyday errands still stuck behind a counter, a shop that&apos;s shut, or a
            queue that eats into a five-minute break between classes.
          </p>
          <p className="mb-8 font-body text-[15px] font-light leading-[1.8] text-[#555550]">
            Snaprint moves printing to wherever people already are — a corridor outside a lecture hall, a
            co-working floor, a business centre lobby — and makes it self-service, available the moment someone
            needs it.
          </p>
          <div className="mb-10 rounded-xl border-l-[3px] border-[#E63946] bg-[#F8F7F4] px-6 py-5">
            <p className="font-display text-[17px] font-medium italic leading-[1.6] text-[#111110]">
              &ldquo;A printing business that doesn&apos;t need a till, a rota, or someone standing next to it all
              day.&rdquo;
            </p>
          </div>
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Starting price" value="₹84,999" caption="Zero setup cost — full ownership" />
            <StatCard label="Models available" value="3" caption="S1, S1 Pro, S1 Pro Max — pick by location and volume" />
          </div>
          <FeatureRow
            items={[
              { n: "01", title: "Own the Machine", body: "Yours from day one. No rent, no revenue share, no renewal." },
              { n: "02", title: "Set Your Own Price", body: "Price every print type the way your location and customers expect." },
              { n: "03", title: "Serve More Customers", body: "One kiosk takes on print jobs a counter alone can't keep up with." },
              { n: "04", title: "Zero Platform Fee", body: "Every rupee from every print is yours to keep." },
            ]}
          />
        </Page>

        {/* ── 02 · WORKFLOW ── */}
        <Page className="bg-[#F8F7F4]">
          <PageMeta n={2} section="Workflow" />
          <Eyebrow>How the kiosk works</Eyebrow>
          <h2 className="mb-6 font-display text-[32px] font-extrabold leading-[1.1] tracking-[-1px] text-[#111110] sm:text-[38px]">
            Six steps. <span className="text-[#E63946]">Under a minute.</span>
          </h2>
          <p className="mb-10 max-w-[560px] font-body text-[15px] font-light leading-[1.8] text-[#555550]">
            Every Snaprint kiosk pairs a 15.6″ touchscreen with a self-contained print engine, built to run
            unattended, all day — the same self-service flow on every model.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["01", "Scan", "Scan the QR code shown on the kiosk screen with any phone camera."],
              ["02", "Upload", "Send documents straight from the phone, or from a cloud drive."],
              ["03", "Choose", "Pick paper size, number of copies, and colour or black-and-white."],
              ["04", "Pay", "Complete payment on the kiosk — UPI, card, or cash where supported."],
              ["05", "Release", "Confirm the job and the kiosk starts printing immediately."],
              ["06", "Collect", "Pick up the finished pages from the collection tray. Done."],
            ].map(([n, t, b]) => (
              <div key={n} className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6">
                <div className="mb-3 font-mono tabular-nums text-[12px] font-bold text-[#E63946]">{n}</div>
                <div className="mb-2 font-display text-[16px] font-bold text-[#111110]">{t}</div>
                <p className="font-body text-[13px] font-light leading-[1.6] text-[#777770]">{b}</p>
              </div>
            ))}
          </div>
        </Page>

        {/* ── 03 · OWNERSHIP ── */}
        <Page>
          <PageMeta n={3} section="Ownership" />
          <Eyebrow>Why own Snaprint</Eyebrow>
          <h2 className="mb-8 font-display text-[32px] font-extrabold leading-[1.1] tracking-[-1px] text-[#111110] sm:text-[38px]">
            Built to work <span className="text-[#E63946]">in your favour.</span>
          </h2>
          <div className="mb-10 rounded-2xl bg-[#111110] p-8 sm:p-10">
            <div className="mb-1 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E63946]">Transparency</div>
            <div className="mb-3 font-mono tabular-nums text-[56px] font-extrabold leading-none text-white">₹0</div>
            <p className="mb-5 max-w-[480px] font-body text-[14px] font-light leading-[1.7] text-white/60">
              Once you buy a Snaprint kiosk, there&apos;s no cut of your earnings for us to take, and no recurring
              platform charge to keep it running.
            </p>
            <div className="flex flex-wrap gap-2">
              {["No Revenue Sharing", "No Mandatory AMC", "You Own the Machine"].map((p) => (
                <span key={p} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-body text-[11px] text-white/60">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <FeatureRow
            items={[
              { n: "05", title: "Add Self-Service Capacity", body: "Extend printing beyond what your current setup can staff." },
              { n: "06", title: "Operate Beyond Counter Hours", body: "Keeps working after the counter closes for the day." },
              { n: "07", title: "Cut Manual Handling", body: "Customers upload, pay and collect without anyone touching a file." },
              { n: "08", title: "A New Revenue Channel", body: "Add a second, independent stream of print income." },
            ]}
          />
        </Page>

        {/* ── 04 · PRICING ── */}
        <Page className="bg-[#F8F7F4]">
          <PageMeta n={4} section="Pricing" />
          <Eyebrow>Three models</Eyebrow>
          <h2 className="mb-3 font-display text-[32px] font-extrabold leading-[1.1] tracking-[-1px] text-[#111110] sm:text-[38px]">
            Pick by footfall, volume and budget.
          </h2>
          <p className="mb-10 max-w-[560px] font-body text-[15px] font-light leading-[1.8] text-[#555550]">
            Same self-service kiosk, same software, same ownership terms — sized to how busy your location gets.
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col overflow-hidden rounded-2xl p-7 ${
                  t.popular ? "border-2 border-[#E63946] bg-white" : "border border-[rgba(0,0,0,0.08)] bg-white"
                }`}
              >
                {t.popular && (
                  <span className="absolute right-5 top-5 rounded-full bg-[#E63946] px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.1em] text-white">
                    Most popular
                  </span>
                )}
                <div className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E63946]">
                  Snaprint {t.name}
                </div>
                <div className="mb-1 font-display text-[16px] font-bold text-[#111110]">{t.tagline}</div>
                <div className="mb-5 font-mono tabular-nums text-[30px] font-extrabold text-[#111110]">
                  <span className="align-top text-[16px]">₹</span>{t.price}
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 font-body text-[12.5px] leading-[1.5] text-[#555550]">
                      <span className="mt-0.5 text-[#E63946]">✓</span>{b}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-[rgba(0,0,0,0.07)] pt-4 font-body text-[11.5px] leading-[1.5] text-[#999994]">
                  {t.bestFor}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-body text-[11px] text-[#AAAAAA]">*With optional additional paper trays. Prices shown exclude GST.</p>
        </Page>

        {/* ── 05 · SPECS ── */}
        <Page>
          <PageMeta n={5} section="Specifications" />
          <Eyebrow>Side by side</Eyebrow>
          <h2 className="mb-8 font-display text-[32px] font-extrabold leading-[1.1] tracking-[-1px] text-[#111110] sm:text-[38px]">
            Specifications.
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.08)]">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[rgba(0,0,0,0.08)] bg-[#F8F7F4]">
                  <th className="px-5 py-3.5 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#999994]">Spec</th>
                  {TIERS.map((t) => (
                    <th key={t.name} className="px-5 py-3.5 font-display text-[13px] font-bold text-[#111110]">{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row, i) => (
                  <tr key={row[0]} className={i % 2 ? "bg-[#FAFAF8]" : ""}>
                    <td className="px-5 py-3 font-body text-[12.5px] text-[#777770]">{row[0]}</td>
                    <td className="px-5 py-3 font-mono tabular-nums text-[12.5px] text-[#111110]">{row[1]}</td>
                    <td className="px-5 py-3 font-mono tabular-nums text-[12.5px] text-[#111110]">{row[2]}</td>
                    <td className="px-5 py-3 font-mono tabular-nums text-[12.5px] text-[#111110]">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-[700px] font-body text-[11px] leading-[1.6] text-[#AAAAAA]">
            Illustrative estimate — cost per page assumes ink and paper only; margin assumes a ₹2 black-and-white
            selling price. You set your own price. Specifications describe each print engine&apos;s published
            capability; actual performance varies with paper, content and network conditions.
          </p>
        </Page>

        {/* ── 06 · ECONOMICS ── */}
        <Page className="bg-[#F8F7F4]">
          <PageMeta n={6} section="Economics" />
          <Eyebrow>You set the price</Eyebrow>
          <h2 className="mb-8 font-display text-[32px] font-extrabold leading-[1.1] tracking-[-1px] text-[#111110] sm:text-[38px]">
            Here&apos;s the cost side.
          </h2>
          <p className="mb-8 max-w-[600px] font-body text-[15px] font-light leading-[1.8] text-[#555550]">
            Illustrative payback at a medium daily volume for each model, assuming 30 operating days/month and a
            blended ₹3.20/print (60% black-and-white at ₹2, 40% colour at ₹5).
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PAYBACK_ROWS.map((r) => (
              <div key={r.model} className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6">
                <div className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#999994]">
                  {r.model} · at {r.volume}
                </div>
                <div className="font-mono tabular-nums text-[30px] font-extrabold text-[#111110]">{r.months}</div>
                <div className="font-body text-[11px] text-[#999994]">illustrative payback</div>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[700px] font-body text-[11px] leading-[1.6] text-[#AAAAAA]">
            Illustrative example only. Earnings depend fully on your location, your pricing and consumable costs at
            market price. Snaprint does not guarantee income, ROI or payback period.
          </p>
        </Page>

        {/* ── 07 · INCLUDED ── */}
        <Page>
          <PageMeta n={7} section="Included" />
          <Eyebrow>Everything it takes to go live</Eyebrow>
          <h2 className="mb-8 font-display text-[32px] font-extrabold leading-[1.1] tracking-[-1px] text-[#111110] sm:text-[38px]">
            What&apos;s included.
          </h2>
          <div className="mb-10 divide-y divide-[rgba(0,0,0,0.07)] rounded-xl border border-[rgba(0,0,0,0.07)]">
            {["Snaprint kiosk hardware", "Touchscreen interface", "Snaprint self-service software", "Installation", "1-Year warranty"].map((f) => (
              <div key={f} className="flex items-center justify-between px-6 py-4">
                <span className="font-body text-[14px] font-medium text-[#111110]">{f}</span>
                <span className="text-[#E63946]">✓</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border-l-[3px] border-[#E63946] bg-[#F8F7F4] px-6 py-6">
            <div className="mb-2 font-display text-[17px] font-bold text-[#111110]">
              Your customers&apos; documents are theirs — not ours.
            </div>
            <p className="font-body text-[13.5px] font-light leading-[1.7] text-[#6B6B66]">
              A file exists on the kiosk only for as long as it takes to complete that print job. Once the job is
              done, it&apos;s removed as part of Snaprint&apos;s standard privacy workflow.
            </p>
          </div>
          <p className="mt-4 font-body text-[11px] uppercase tracking-[0.1em] text-[#AAAAAA]">
            Owner-serviced · lockable rear access for paper &amp; ink
          </p>
        </Page>

        {/* ── GET STARTED ── */}
        <section
          className="relative overflow-hidden px-6 py-20 md:px-16"
          style={{ background: "linear-gradient(160deg, #0f0f0e 0%, #111110 55%, #1a0405 100%)" }}
        >
          <div
            className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full animate-glow-pulse"
            style={{ background: "radial-gradient(ellipse, rgba(230,57,70,0.2) 0%, transparent 70%)", filter: "blur(40px)" }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-[900px]">
            <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Browse the models", "See S1, S1 Pro and S1 Pro Max — pick by your footfall and budget."],
                ["02", "Book a demo", "Tell us your location; our Bengaluru team gets in touch."],
                ["03", "We install", "Setup and training included — live within the hour."],
                ["04", "Start earning", "Set your own price. Keep every rupee."],
              ].map(([n, t, b]) => (
                <div key={n}>
                  <div className="mb-2 font-mono tabular-nums text-[28px] font-extrabold text-[#E63946]/70">{n}</div>
                  <div className="mb-1.5 font-display text-[15px] font-bold text-white">{t}</div>
                  <p className="font-body text-[12.5px] font-light leading-[1.6] text-white/45">{b}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="mb-2 font-display text-[26px] font-extrabold leading-[1.15] text-white sm:text-[30px]">
                    Ready to own your <span className="text-[#E63946]">print network?</span>
                  </h2>
                  <p className="font-body text-[13.5px] font-light leading-[1.7] text-white/55">
                    Installation, software and a 1-year warranty included on every model. Starting at{" "}
                    <span className="font-mono tabular-nums font-semibold text-white">₹84,999</span>.
                  </p>
                </div>
                <a
                  href="/book"
                  data-magnetic="0.35"
                  className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-display text-[13.5px] font-semibold text-charcoal transition-colors hover:bg-red hover:text-white"
                >
                  Book a Demo
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
              <div>
                <div className="mb-2 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">Contact</div>
                <a href="mailto:snaprints@sanskritilabs.in" className="block font-body text-[13px] text-white/60 hover:text-white">
                  snaprints@sanskritilabs.in
                </a>
              </div>
              <div>
                <div className="mb-2 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">Web</div>
                <a href="https://snaprints.com" className="block font-body text-[13px] text-white/60 hover:text-white">
                  snaprints.com
                </a>
              </div>
              <div>
                <div className="mb-2 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">Head office</div>
                <div className="font-body text-[13px] text-white/60">Sanskriti Labs, Bengaluru, India</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
