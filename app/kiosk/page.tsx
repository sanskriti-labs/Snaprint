import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const siteUrl = "https://snaprints.com";

const verticals = [
  {
    title: "Colleges & universities",
    body: "Exam season and assignment deadlines spike print demand past what a counter can handle. A kiosk in the corridor or library absorbs the surge without extra staff.",
  },
  {
    title: "Offices & coworking spaces",
    body: "Guests, meeting rooms, and BYOD employees need to print without IT setting up drivers on every laptop. Scan a QR, print, done.",
  },
  {
    title: "Hospitals & clinics",
    body: "Attendants and visitors printing prescriptions, ID copies, and insurance paperwork — a self-service point near reception keeps the front desk free for patients.",
  },
  {
    title: "Libraries",
    body: "Members already queue for book issue and returns. A self-service kiosk handles printing separately, so the desk isn't doubling as a print counter.",
  },
  {
    title: "Railway stations & transit hubs",
    body: "Travellers printing tickets, ID proofs, or reservation slips at odd hours — unattended operation means the kiosk works long after any staffed counter closes.",
  },
  {
    title: "Malls & retail stores",
    body: "High footfall, low staff-to-visitor ratio. A kiosk captures printing demand that would otherwise walk out and go to a shop down the road.",
  },
];

const capabilities = [
  {
    label: "Unattended",
    heading: "Runs 24/7 without staff present.",
    body: "Orders queue automatically and print in the background — the kiosk keeps working through closed hours, shift changes, and lunch breaks.",
    accent: true,
  },
  {
    label: "QR + UPI",
    heading: "Scan, upload, pay via UPI. No app.",
    body: "The customer's phone camera reads the QR code and opens the upload flow directly in the browser — no install, no account creation.",
    accent: false,
  },
  {
    label: "Any printer",
    heading: "Works with your existing printer.",
    body: "Canon, HP, Epson, Brother — the kiosk connects to whatever's already installed. No forced hardware change for the deployment site.",
    accent: false,
  },
  {
    label: "Remote management",
    heading: "Monitor every kiosk from one dashboard.",
    body: "Live order volume, revenue, and consumables status per unit — check on a single kiosk or a fleet across multiple sites from your phone.",
    accent: false,
  },
  {
    label: "Security",
    heading: "Documents deleted after every print.",
    body: "Files are encrypted end-to-end and auto-deleted on completion. Nothing sits on the kiosk after the job finishes — a real requirement for hospital and office deployments.",
    accent: false,
  },
];

const faqs = [
  {
    q: "What is a self-service printing kiosk?",
    a: "A self-service printing kiosk is a self-contained unit that lets someone print a document without staff operating the machine for them. With Snaprint, the customer scans a QR code on the kiosk with their phone, uploads a file, pays via UPI or card, and collects the printout — the kiosk connects to a regular printer behind the scenes, so no specialised print hardware is required.",
  },
  {
    q: "Can I print documents from my phone without an app?",
    a: "Yes. There's no app to install. Scanning the kiosk's QR code opens the upload page directly in your phone's browser, on both Android and iOS.",
  },
  {
    q: "Where can a Snaprint kiosk be deployed?",
    a: "Anywhere with a printer and a bit of counter or wall space: colleges, university libraries, corporate offices, hospitals and clinics, retail stores, and transit hubs. The common thread is a location with recurring print demand and limited staff to handle it at the counter.",
  },
  {
    q: "Is this different from a self-service xerox or photocopy machine?",
    a: "The end result is similar — an unattended way to get a document printed — but a Snaprint kiosk is the front-end plus payment and job-queueing layer sitting in front of your existing printer, not a standalone photocopier. It also runs completely unattended, including outside staffed hours, which a walk-up photocopier doesn't handle on its own.",
  },
  {
    q: "Can multiple kiosks across different sites be managed centrally?",
    a: "Yes. Every kiosk reports into the same owner dashboard — order volume, revenue, and consumables status — so a business running kiosks at several locations can check all of them from one place rather than visiting each site.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${siteUrl}/kiosk#service`,
      name: "Snaprint Self-Service Printing Kiosk",
      serviceType: "Self-service printing kiosk deployment",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: { "@type": "Country", name: "India" },
      description:
        "Self-service printing kiosk / automated print station for deployment at colleges, offices, hospitals, libraries, railway stations, and retail across India. QR-code upload, UPI payment, unattended 24/7 operation.",
      audience: {
        "@type": "BusinessAudience",
        audienceType:
          "Colleges, universities, offices, hospitals, libraries, railway stations, malls, retail stores",
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: "84999",
        highPrice: "299999",
        offerCount: "1",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/kiosk`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/kiosk#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function KioskPage() {
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
                Self-service printing kiosk · India
              </span>
              <span className="h-px w-7 bg-[#E63946]" />
            </div>
            <h1
              className="mb-6 font-display font-extrabold leading-[1.0] tracking-[-3px] text-[#111110]"
              style={{ fontSize: "clamp(40px, 5.6vw, 68px)" }}
            >
              A self-service printing<br />
              kiosk for <span className="text-[#E63946]">any location.</span>
            </h1>
            <p className="mb-10 max-w-[600px] font-body text-[17px] font-light leading-[1.78] text-[#6B6B66]">
              Snaprint is a self-service printing kiosk / automated print station that plugs into any existing printer. QR-code upload, UPI payment, and unattended 24/7 operation — built for colleges, offices, hospitals, libraries, and retail across India.
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
                { v: "24/7", l: "unattended operation" },
                { v: "<60s", l: "scan to print" },
                { v: "6+", l: "deployment vertical types" },
                { v: "UPI", l: "native payment" },
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

        {/* ── Capabilities ── */}
        <section className="bg-[#0D0D0C] px-6 py-24 md:px-10 md:py-28 bg-dot-grid-dark">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              What the kiosk does
            </div>
            <h2
              className="mb-4 max-w-[640px] font-display font-extrabold leading-[1.04] tracking-[-2px] text-white"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              An automated print station, not just a photocopier.
            </h2>
            <p className="mb-14 max-w-[560px] font-body text-[16px] font-light leading-[1.78] text-[rgba(255,255,255,0.42)]">
              Every deployment gets the same core: document upload, payment, print job queueing, and remote visibility — regardless of where the kiosk sits.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-2xl p-7 ${
                    card.accent
                      ? "bg-[#E63946]"
                      : "border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)]"
                  }`}
                >
                  <div
                    className={`mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      card.accent ? "text-white/70" : "text-[#E63946]"
                    }`}
                  >
                    {card.label}
                  </div>
                  <h3 className={`mb-2 font-display text-[16px] font-semibold ${card.accent ? "text-white" : "text-white"}`}>
                    {card.heading}
                  </h3>
                  <p className={`font-body text-[13.5px] font-light leading-[1.7] ${card.accent ? "text-white/85" : "text-[rgba(255,255,255,0.5)]"}`}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Deployment verticals ── */}
        <section className="bg-[#F8F7F4] px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              Where it fits
            </div>
            <h2
              className="mb-4 max-w-[640px] font-display font-extrabold leading-[1.04] tracking-[-2px] text-[#111110]"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              A printing kiosk for colleges, offices, hospitals, and more.
            </h2>
            <p className="mb-14 max-w-[560px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
              Different locations, same problem: recurring print demand outpacing staffed counter capacity.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {verticals.map((v) => (
                <div
                  key={v.title}
                  className="group rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                >
                  <h3 className="mb-2 font-display text-[16px] font-semibold text-[#111110]">
                    {v.title}
                  </h3>
                  <p className="font-body text-[13.5px] font-light leading-[1.7] text-[#6B6B66]">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
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
              Questions before deploying a kiosk.
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
              See the kiosk running before you decide.
            </h2>
            <p className="mx-auto mb-12 max-w-[460px] font-body text-[16px] font-light leading-[1.75] text-[rgba(255,255,255,0.38)]">
              A short call to walk through your location, expected volume, and whether a Snaprint kiosk is the right fit.
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
