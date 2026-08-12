import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const siteUrl = "https://snaprints.com";

const included = [
  { title: "S1 kiosk hardware", body: "Dedicated print + scan unit, 2000-sheet capacity, 15.6\" touch display, UPS backup, and the Snaprint OS pre-installed and activated." },
  { title: "Owner mobile dashboard", body: "Live revenue, print counts, ink and paper status — full visibility from your phone, not from the counter." },
  { title: "Customer-facing app", body: "QR-driven mobile upload and UPI payment flow. No app install required for customers — works in any mobile browser." },
  { title: "Onboarding + training", body: "In-person Bengaluru installation, owner training session, and 6 months of software support included from day one." },
  { title: "Co-branded signage kit", body: "Window decal, counter sign, and a network listing on the Snaprint map so customers can find your kiosk." },
  { title: "Lifetime software updates", body: "New features, security patches, and OS updates shipped automatically. You don't touch a thing — they install overnight." },
];

const roiAssumptions = [
  { label: "Prints per day (conservative)", value: "50" },
  { label: "Average revenue per print", value: "₹15" },
  { label: "Operating days / month", value: "25" },
  { label: "Monthly kiosk revenue", value: "₹18,750" },
  { label: "UPI / payment fee (~2%)", value: "- ₹375" },
  { label: "Paper + toner + electricity", value: "- ₹3,000" },
  { label: "Net monthly cash flow", value: "₹15,375" },
  { label: "Investment recouped in", value: "≈ 21 months" },
];

const faqs = [
  {
    q: "Are there financing options for the ₹3–3.5L investment?",
    a: "Most operators fund the investment out of family savings, personal accumulation, or small-ticket business loans. Equipment financing from the printer dealer is sometimes available for the kiosk hardware itself, usually 12–24 months. MUDRA loans (PMMY Shishu/Kishore) cover up to ₹5L at 8–12% p.a. for non-corporate small businesses — most PSU banks offer these.",
  },
  {
    q: "Do you charge GST on the kiosk?",
    a: "Yes — Snaprint is a GST-registered business under Sanskriti Labs. The invoice is issued with 18% GST broken out separately. The all-in price mentioned on the site is the base price; GST is added on top at invoicing.",
  },
  {
    q: "Can I return the kiosk if the location doesn't work out?",
    a: "Refund policy is straightforward: if you've paid but installation hasn't happened yet, you can cancel for a full refund within 7 days of payment, processed in 7–14 business days to your original payment method. Once the kiosk is installed and live, refunds are pro-rated minus a setup and refurbishment fee. See the full refund policy at /refund-policy.",
  },
  {
    q: "What's the upgrade path if Snaprint launches a new model?",
    a: "Operators on the network get first-look access to new hardware revisions at trade-in pricing. The S1 hardware is designed to be field-upgradeable — most software upgrades ship automatically with no operator action, and component swaps (printer head, scanner module) are handled by the Bengaluru support team.",
  },
  {
    q: "Are there hidden costs — toner, paper, servicing?",
    a: "No hidden costs in the kiosk itself. Toner and paper are your existing shop consumables — you're already buying them for the counter. The kiosk doesn't introduce new consumables. Servicing is on us for hardware under warranty (1 year). After the warranty period, service is charged at cost (typically ₹1,500–₹3,000 per visit).",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${siteUrl}/pricing#s1`,
      name: "Snaprint S1 Print Kiosk",
      description: "Self-service print kiosk with built-in QR-driven mobile upload and UPI payment. Hardware + software bundle, designed for xerox shop operators.",
      brand: { "@id": `${siteUrl}/#organization` },
      image: `${siteUrl}/og.png`,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: "300000",
        highPrice: "350000",
        offerCount: "1",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/pricing`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/pricing#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-white px-6 pt-[140px] pb-20 md:px-10 md:pt-[160px] md:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-dot-grid" aria-hidden />
          <div
            className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px]"
            style={{ background: "radial-gradient(ellipse at top right, rgba(230,57,70,0.05) 0%, transparent 65%)" }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-[1080px]">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-7 bg-[#E63946]" />
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
                Snaprint pricing
              </span>
              <span className="h-px w-7 bg-[#E63946]" />
            </div>
            <h1
              className="mb-6 font-display font-extrabold leading-[1.0] tracking-[-3px] text-[#111110]"
              style={{ fontSize: "clamp(44px, 6vw, 76px)" }}
            >
              One price.<br />
              <span className="text-[#E63946]">Zero royalties.</span>
            </h1>
            <p className="mb-10 max-w-[560px] font-body text-[17px] font-light leading-[1.78] text-[#6B6B66]">
              The Snaprint S1 kiosk is a one-time investment. No per-print commission, no monthly platform fee in the first six months, no territory restrictions. You own the hardware, set your own prices, and keep the margin.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/book"
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#111110] px-8 py-4 font-display text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#E63946] hover:-translate-y-px"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.16)" }}
              >
                Book a Demo
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="/franchise"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(0,0,0,0.1)] px-6 py-4 font-body text-[13.5px] font-medium text-[#555550] transition-all duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#111110]"
              >
                Become an operator
              </a>
            </div>

            <div className="mt-14 flex flex-wrap items-end gap-10 border-t border-[rgba(0,0,0,0.07)] pt-10">
              {[
                { v: "₹3–3.5L", l: "one-time, all-in" },
                { v: "0%", l: "per-print commission" },
                { v: "6 mo", l: "free software support" },
                { v: "1 yr", l: "hardware warranty" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-[32px] font-extrabold leading-none tracking-[-1.5px] text-[#111110]">
                    {s.v}
                  </div>
                  <div className="mt-1.5 font-body text-[11px] text-[#AAAAAA]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing tier ── */}
        <section className="bg-[#F8F7F4] px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              The all-in price
            </div>
            <h2
              className="mb-4 max-w-[640px] font-display font-extrabold leading-[1.04] tracking-[-2px] text-[#111110]"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              One bundle. No add-ons, no upsells.
            </h2>
            <p className="mb-14 max-w-[560px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
              Everything you need to run a self-service print kiosk, hardware to software to support. Final invoiced price is determined by site survey.
            </p>

            <div className="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2 md:p-12">
                <div>
                  <div className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#AAAAAA]">
                    Snaprint S1 kiosk bundle
                  </div>
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="font-display text-[56px] font-extrabold leading-none tracking-[-2.5px] text-[#111110]">
                      ₹3&ndash;3.5L
                    </span>
                    <span className="font-body text-[14px] text-[#AAAAAA]">one-time</span>
                  </div>
                  <div className="mt-2 inline-block rounded-full bg-[rgba(230,57,70,0.08)] px-3 py-1 font-body text-[11px] font-medium text-[#E63946]">
                    + 18% GST
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 font-body text-[14px] text-[#3A3A36]">
                    <span className="mt-[3px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E63946]" />
                    Hardware, software, OS license — included
                  </div>
                  <div className="flex items-start gap-2 font-body text-[14px] text-[#3A3A36]">
                    <span className="mt-[3px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E63946]" />
                    Bengaluru installation + training — included
                  </div>
                  <div className="flex items-start gap-2 font-body text-[14px] text-[#3A3A36]">
                    <span className="mt-[3px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E63946]" />
                    6 months of software support — included
                  </div>
                  <div className="flex items-start gap-2 font-body text-[14px] text-[#3A3A36]">
                    <span className="mt-[3px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E63946]" />
                    1-year hardware warranty — included
                  </div>
                  <div className="flex items-start gap-2 font-body text-[14px] text-[#3A3A36]">
                    <span className="mt-[3px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E63946]" />
                    No per-print commission, no royalties
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What's included ── */}
        <section className="bg-white px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              What&apos;s included
            </div>
            <h2
              className="mb-14 max-w-[640px] font-display font-extrabold leading-[1.04] tracking-[-2px] text-[#111110]"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              Every line of the bundle.
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {included.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                >
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(230,57,70,0.08)]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12l5 5L20 6" />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-display text-[16px] font-semibold text-[#111110]">
                    {card.title}
                  </h3>
                  <p className="font-body text-[13.5px] font-light leading-[1.7] text-[#6B6B66]">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ROI worked example ── */}
        <section className="bg-[#0D0D0C] px-6 py-24 md:px-10 md:py-28 bg-dot-grid-dark">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              ROI worked example
            </div>
            <h2
              className="mb-4 max-w-[640px] font-display font-extrabold leading-[1.04] tracking-[-2px] text-white"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              Conservative numbers, real outcome.
            </h2>
            <p className="mb-14 max-w-[560px] font-body text-[16px] font-light leading-[1.78] text-[rgba(255,255,255,0.42)]">
              Using a conservative 50 prints/day at ₹15 average. Volume is the lever — busy college-area shops (200&ndash;500 prints/day) recoup 2&ndash;3× faster.
            </p>

            <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    <th className="px-6 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.4)]">
                      Line
                    </th>
                    <th className="px-6 py-4 text-right font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.4)]">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roiAssumptions.map((r, i) => {
                    const isLast = i === roiAssumptions.length - 1;
                    return (
                      <tr
                        key={r.label}
                        className={`border-b border-[rgba(255,255,255,0.05)] last:border-b-0 ${
                          isLast ? "bg-[rgba(230,57,70,0.06)]" : ""
                        }`}
                      >
                        <td className={`px-6 py-4 font-body text-[14px] ${isLast ? "font-medium text-white" : "font-light text-[rgba(255,255,255,0.7)]"}`}>
                          {r.label}
                        </td>
                        <td className={`px-6 py-4 text-right font-display text-[15px] ${isLast ? "font-bold text-[#E63946]" : "font-semibold text-white"}`}>
                          {r.value}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-6 font-body text-[12.5px] font-light text-[rgba(255,255,255,0.3)]">
              Figures are illustrative. Actual ROI depends on footfall, average ticket size, and the local print mix. Higher-volume scenarios (200&ndash;500 prints/day) are modelled on the franchise page.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-[860px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              FAQ
            </div>
            <h2
              className="mb-14 font-display font-extrabold leading-[1.04] tracking-[-2px] text-[#111110]"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              Pricing questions, answered directly.
            </h2>

            <div className="divide-y divide-[rgba(0,0,0,0.08)] border-y border-[rgba(0,0,0,0.08)]">
              {faqs.map((f) => (
                <details key={f.q} className="group py-6">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                    <h3 className="font-display text-[17px] font-semibold text-[#111110]">
                      {f.q}
                    </h3>
                    <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] text-[#E63946] transition-transform duration-200 group-open:rotate-45">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 font-body text-[15px] font-light leading-[1.78] text-[#6B6B66]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section
          className="relative overflow-hidden px-6 py-28 md:px-10"
          style={{ background: "linear-gradient(160deg, #0f0f0e 0%, #111110 50%, #1a0405 100%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(230,57,70,0.18) 0%, rgba(230,57,70,0.04) 50%, transparent 70%)",
              filter: "blur(50px)",
            }}
            aria-hidden
          />

          <div className="relative mx-auto max-w-[900px] text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#E63946]" />
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
                Get started
              </span>
              <span className="h-px w-8 bg-[#E63946]" />
            </div>
            <h2
              className="mb-6 font-display font-extrabold leading-[1.02] tracking-[-3px] text-white"
              style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
            >
              Numbers add up? Let&apos;s walk through your location.
            </h2>
            <p className="mx-auto mb-12 max-w-[460px] font-body text-[16px] font-light leading-[1.75] text-[rgba(255,255,255,0.38)]">
              A 40-minute call. We bring your location&apos;s footfall, the realistic unit economics, and the rollout timeline. No obligation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/book"
                className="inline-flex items-center gap-2.5 rounded-[8px] bg-white px-9 py-4 font-display text-[14px] font-bold text-[#111110] transition-all duration-200 hover:bg-[#E63946] hover:text-white hover:-translate-y-px"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.35)" }}
              >
                Book a Demo
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="mailto:snaprints@sanskritilabs.in"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(255,255,255,0.12)] px-7 py-4 font-body text-[14px] font-medium text-[rgba(255,255,255,0.55)] transition-all duration-200 hover:border-[rgba(255,255,255,0.3)] hover:text-white"
              >
                snaprints@sanskritilabs.in
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}