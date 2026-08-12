import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const siteUrl = "https://snaprints.com";

const included = [
  {
    title: "Snaprint S1 kiosk hardware",
    body: "Dedicated print + scan unit, 2000-sheet capacity, 15.6\" touch display, UPS backup, and the Snaprint OS already installed and activated.",
  },
  {
    title: "Mobile app + dashboard",
    body: "Live revenue, print counts, ink and paper status — everything you need to run the kiosk from your phone, not from the counter.",
  },
  {
    title: "Ongoing support",
    body: "In-person Bengaluru installation, training, and a support team that knows the hardware. Six months of software support included, then ongoing indefinitely under the yearly platform fee.",
  },
  {
    title: "Brand association",
    body: "Snaprint shop branding kit, co-branded signage for the founding partner program, and listing on the Snaprint network map where customers can find your kiosk.",
  },
];

const steps = [
  { n: "01", t: "Enquire", d: "Fill the form or message on WhatsApp. Tell us your shop location and rough daily print volume." },
  { n: "02", t: "Site survey", d: "Our Bengaluru team visits your shop. We verify space, power, and internet. Takes 30 minutes." },
  { n: "03", t: "Install", d: "Hardware reaches you, our team mounts, wires, and brings the kiosk online. Typically within 7 days of payment." },
  { n: "04", t: "Go live", d: "Owner dashboard walkthrough, training session, and your Snaprint kiosk is live. UPI orders start flowing the same day." },
];

const roiAssumptions = [
  { label: "Prints per day", value: "50" },
  { label: "Average revenue per print", value: "₹15" },
  { label: "Operating days / month", value: "25" },
  { label: "Monthly kiosk revenue", value: "₹18,750" },
  { label: "UPI / payment fee (~2%)", value: "- ₹375" },
  { label: "Incremental opex (paper, toner, electricity)", value: "- ₹3,000" },
  { label: "Net monthly incremental cash flow", value: "₹15,375" },
];

const faqs = [
  {
    q: "How much does the Snaprint franchise cost?",
    a: "The Snaprint S1 kiosk is priced at ₹3,00,000–₹3,50,000 one-time, all-in. This includes the dedicated hardware, software, installation, training, and the first six months of software support. A separate yearly platform fee applies after the first six months — the exact amount is shared during your site visit. There is no per-print commission.",
  },
  {
    q: "Is there a contract or lock-in period?",
    a: "You own the hardware. There is a one-page agreement covering software and brand usage, with standard exit terms. We don't have multi-year lock-ins with early-exit penalties — the model is built for operators who want to own the kiosk, not lease it back.",
  },
  {
    q: "Which areas do you currently support?",
    a: "Snaprint is currently in Bengaluru — installation, on-site training, and support are all Bengaluru-based. If you're outside Bengaluru and interested, get in touch and we'll discuss expanding into your area based on operator density.",
  },
  {
    q: "What is the realistic ROI timeline?",
    a: "At a typical mid-traffic Bengaluru shop (50 prints/day, ₹15 average), the ₹3.25L investment recoups in roughly 21 months. At a busy college gate (500 prints/day, the rate cited on the franchise home page), the same investment recoups in roughly 26 months of operating cash flow. Volume is the lever, not the equipment cost.",
  },
  {
    q: "Can I add a Snaprint kiosk to my existing xerox shop?",
    a: "Yes — that's the intended setup. The S1 is designed to fit inside an existing xerox or stationery shop and capture the remote and after-hours orders your counter is currently missing. Most operators are existing shop owners adding a self-service layer, not starting a new shop from scratch.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${siteUrl}/franchise#service`,
      name: "Snaprint S1 Kiosk Operator Programme",
      serviceType: "Self-service print kiosk operator programme",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: { "@type": "City", name: "Bengaluru" },
      description:
        "Become a Snaprint S1 print kiosk operator. One-time investment, dedicated hardware, live revenue dashboard, Bengaluru-based support.",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: "300000",
        highPrice: "350000",
        offerCount: "1",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/franchise`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/franchise#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function FranchisePage() {
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
                Snaprint franchise
              </span>
              <span className="h-px w-7 bg-[#E63946]" />
            </div>
            <h1
              className="mb-6 font-display font-extrabold leading-[1.0] tracking-[-3px] text-[#111110]"
              style={{ fontSize: "clamp(44px, 6vw, 76px)" }}
            >
              Become a Snaprint<br />
              <span className="text-[#E63946]">operator.</span>
            </h1>
            <p className="mb-10 max-w-[560px] font-body text-[17px] font-light leading-[1.78] text-[#6B6B66]">
              Install the Snaprint S1 in your shop and turn the WhatsApp-a-PDF-and-collect-later pattern into a paid, self-service order — running 24/7, even when you&apos;re not at the counter. ₹3&ndash;3.5L one-time investment. No per-print commission.
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
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(0,0,0,0.1)] px-6 py-4 font-body text-[13.5px] font-medium text-[#555550] transition-all duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#111110]"
              >
                See pricing
              </a>
            </div>

            <div className="mt-14 flex flex-wrap items-end gap-10 border-t border-[rgba(0,0,0,0.07)] pt-10">
              {[
                { v: "₹3–3.5L", l: "one-time investment" },
                { v: "0%", l: "per-print commission" },
                { v: "24/7", l: "unmanned operation" },
                { v: "7 days", l: "from payment to live" },
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

        {/* ── What you get ── */}
        <section className="bg-[#F8F7F4] px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              What you get
            </div>
            <h2
              className="mb-4 max-w-[640px] font-display font-extrabold leading-[1.04] tracking-[-2px] text-[#111110]"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              The S1 hardware, the software, the support. One bundle.
            </h2>
            <p className="mb-14 max-w-[560px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
              Built for shop owners who want to capture the remote and after-hours orders they&apos;re currently missing — without adding a counter shift.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {included.map((card) => (
                <div
                  key={card.title}
                  className="group rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
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

        {/* ── How it works ── */}
        <section className="bg-white px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              How it works
            </div>
            <h2
              className="mb-14 max-w-[560px] font-display font-extrabold leading-[1.04] tracking-[-2px] text-[#111110]"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              From enquiry to first UPI order in 7&ndash;10 days.
            </h2>

            <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] md:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  className={`group p-8 transition-colors duration-200 hover:bg-[#F8F7F4] ${
                    i < 3
                      ? "border-b border-[rgba(0,0,0,0.06)] lg:border-b-0 lg:border-r lg:border-[rgba(0,0,0,0.06)]"
                      : ""
                  }`}
                >
                  <div className="mb-4 font-display text-[42px] font-extrabold leading-none tracking-[-2px] text-[#111110]/[0.05] group-hover:text-[#111110]/[0.08] transition-colors">
                    {s.n}
                  </div>
                  <div className="mb-2 font-display text-[15px] font-semibold text-[#111110]">{s.t}</div>
                  <div className="font-body text-[13px] font-light leading-[1.65] text-[#6B6B66]">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Operator economics ── */}
        <section className="bg-[#0D0D0C] px-6 py-24 md:px-10 md:py-28 bg-dot-grid-dark">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              Operator economics
            </div>
            <h2
              className="mb-4 max-w-[640px] font-display font-extrabold leading-[1.04] tracking-[-2px] text-white"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              Worked example, conservative case.
            </h2>
            <p className="mb-14 max-w-[560px] font-body text-[16px] font-light leading-[1.78] text-[rgba(255,255,255,0.42)]">
              Mixing B&amp;W at ₹3 and colour at ₹10 to an average ticket of ₹15. Volume is the lever &mdash; the same kiosk at 500 prints/day earns materially more.
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
                  {roiAssumptions.map((r, i) => (
                    <tr
                      key={r.label}
                      className={`border-b border-[rgba(255,255,255,0.05)] last:border-b-0 ${
                        i === roiAssumptions.length - 1 ? "bg-[rgba(230,57,70,0.06)]" : ""
                      }`}
                    >
                      <td className={`px-6 py-4 font-body text-[14px] ${i === roiAssumptions.length - 1 ? "font-medium text-white" : "font-light text-[rgba(255,255,255,0.7)]"}`}>
                        {r.label}
                      </td>
                      <td className={`px-6 py-4 text-right font-display text-[15px] ${i === roiAssumptions.length - 1 ? "font-bold text-[#E63946]" : "font-semibold text-white"}`}>
                        {r.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 font-body text-[12.5px] font-light text-[rgba(255,255,255,0.3)]">
              Figures are illustrative and based on a 50 prints/day conservative floor. Actual revenue depends on footfall, location, and average ticket size. Estimated operator earnings at higher volumes (500/day, 1,000/day) are shown on the homepage franchise section.
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
              Questions shop owners ask before signing.
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
              Ready to slot a Snaprint kiosk into your shop?
            </h2>
            <p className="mx-auto mb-12 max-w-[460px] font-body text-[16px] font-light leading-[1.75] text-[rgba(255,255,255,0.38)]">
              A 40-minute call with the Snaprint founder. We walk through your location, volume, and the realistic unit economics for your specific shop.
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
