import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DesktopRegisterForm from "@/components/DesktopRegisterForm";

const siteUrl = "https://snaprints.com";

export const metadata: Metadata = {
  title: "Snaprint Desktop  --  Free Software for Xerox Shop Owners",
  description:
    "Snaprint Desktop is a free Windows app that helps existing print shop owners capture more revenue from remote and after-hours orders. Register free.",
  alternates: { canonical: "/register" },
  openGraph: {
    title: "Snaprint Desktop  --  Free for Xerox Shop Owners",
    description:
      "A free Windows app that helps existing print shop owners capture more revenue from orders they're currently missing.",
    url: `${siteUrl}/register`,
    type: "website",
    images: [`${siteUrl}/og.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snaprint Desktop  --  Free for Xerox Shop Owners",
    description:
      "A free Windows app that helps existing print shop owners capture more revenue from orders they're currently missing.",
    images: [`${siteUrl}/og.png`],
  },
};

const benefits = [
  {
    title: "Works on your existing PC",
    body: "No new hardware to buy. Snaprint Desktop installs on the Windows PC already at your counter and works alongside your current printer.",
  },
  {
    title: "Capture remote orders",
    body: "Turn the WhatsApp-a-PDF-and-collect-later pattern into a tracked, paid order  --  instead of something you remember to do during a rush.",
  },
  {
    title: "Free during the pilot",
    body: "No licence fee, no subscription, no per-print commission. Snaprint Desktop is free for shop owners while the program is rolling out.",
  },
  {
    title: "Built for existing shops",
    body: "Same team behind the Snaprint kiosk. Snaprint Desktop is for shops that want the software layer without adding dedicated kiosk hardware yet.",
  },
];

const faqs = [
  {
    q: "Is Snaprint Desktop really free?",
    a: "Yes. There's no licence fee, subscription, or per-print commission during the current program. Snaprint's team will let registered shops know directly if that ever changes.",
  },
  {
    q: "Do I need to buy new hardware?",
    a: "No. Snaprint Desktop installs on the Windows PC you already use at your shop counter and works with your existing printer  --  no dedicated kiosk hardware required.",
  },
  {
    q: "What happens after I register?",
    a: "The Snaprint team will contact you on the phone number you provide with the download link and a short setup walkthrough.",
  },
  {
    q: "How is this different from a Snaprint kiosk?",
    a: "A kiosk is dedicated self-service hardware installed in your shop. Snaprint Desktop is software only, running on your existing PC  --  a lighter-weight way to capture more of your shop's remote and after-hours orders.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/register#software`,
      name: "Snaprint Desktop",
      operatingSystem: "Windows",
      applicationCategory: "BusinessApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description:
        "Free Windows software that helps existing xerox and print shop owners capture more revenue from remote and after-hours orders.",
      url: `${siteUrl}/register`,
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/register#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero + form */}
        <section className="relative overflow-hidden bg-white px-6 pt-[140px] pb-20 md:px-10 md:pt-[160px] md:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-dot-grid" aria-hidden />
          <div
            className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px]"
            style={{ background: "radial-gradient(ellipse at top right, rgba(230,57,70,0.05) 0%, transparent 65%)" }}
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-7 bg-[#E63946]" />
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
                  Free for shop owners
                </span>
                <span className="h-px w-7 bg-[#E63946]" />
              </div>
              <h1
                className="mb-6 font-display font-extrabold leading-[1.0] tracking-[-3px] text-[#111110]"
                style={{ fontSize: "clamp(40px, 5.5vw, 68px)" }}
              >
                Snaprint Desktop  -- <br />
                <span className="text-[#E63946]">free software</span> for your shop.
              </h1>
              <p className="mb-8 max-w-[520px] font-body text-[17px] font-light leading-[1.78] text-[#6B6B66]">
                A Windows app that runs on the PC you already have at your counter  --  no new hardware,
                no cost. Snaprint Desktop is xerox shop software built for print shop owners who want to capture the remote and after-hours print orders their shop is
                currently missing. Register below and the team will set you up.
              </p>

              <div className="mt-10 flex flex-wrap items-end gap-10 border-t border-[rgba(0,0,0,0.07)] pt-8">
                {[
                  { v: "₹0", l: "cost during the program" },
                  { v: "Windows", l: "runs on your existing PC" },
                  { v: "No hardware", l: "software only" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-[28px] font-extrabold leading-none tracking-[-1.5px] text-[#111110]">
                      {s.v}
                    </div>
                    <div className="mt-1.5 font-body text-[11px] text-[#AAAAAA]">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-[120px]">
              <DesktopRegisterForm />
            </div>
          </div>
        </section>

        {/* Why register */}
        <section className="bg-[#F8F7F4] px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              Why register
            </div>
            <h2
              className="mb-14 max-w-[640px] font-display font-extrabold leading-[1.04] tracking-[-2px] text-[#111110]"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              Built for shops that aren&apos;t ready for a kiosk yet.
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((card) => (
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

        {/* FAQ */}
        <section className="bg-white px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-[820px]">
            <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              FAQ
            </div>
            <h2
              className="mb-12 font-display font-extrabold leading-[1.04] tracking-[-2px] text-[#111110]"
              style={{ fontSize: "clamp(28px, 3.6vw, 42px)" }}
            >
              Questions shop owners ask
            </h2>
            <div className="divide-y divide-[rgba(0,0,0,0.07)] border-t border-[rgba(0,0,0,0.07)]">
              {faqs.map((f) => (
                <div key={f.q} className="py-7">
                  <h3 className="mb-2 font-display text-[16px] font-semibold text-[#111110]">
                    {f.q}
                  </h3>
                  <p className="font-body text-[14px] font-light leading-[1.75] text-[#6B6B66]">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section
          className="relative overflow-hidden px-6 py-24 text-center md:px-10 md:py-32"
          style={{ background: "linear-gradient(160deg, #0f0f0e 0%, #111110 50%, #1a0405 100%)" }}
        >
          <div className="relative mx-auto max-w-[640px]">
            <h2
              className="mb-6 font-display font-extrabold leading-[1.02] tracking-[-3px] text-white"
              style={{ fontSize: "clamp(32px, 5vw, 60px)" }}
            >
              Ready to stop losing orders to a busy counter?
            </h2>
            <p className="mx-auto mb-10 max-w-[440px] font-body text-[16px] font-light leading-[1.75] text-[rgba(255,255,255,0.38)]">
              Register free above, or if you&apos;re considering dedicated kiosk hardware instead, see
              the Snaprint franchise program.
            </p>
            <a
              href="/franchise"
              className="inline-flex items-center gap-2.5 rounded-[8px] border border-[rgba(255,255,255,0.12)] px-7 py-4 font-body text-[14px] font-medium text-[rgba(255,255,255,0.55)] transition-all duration-200 hover:border-[rgba(255,255,255,0.3)] hover:text-white"
            >
              See the kiosk franchise
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
