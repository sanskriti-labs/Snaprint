import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE_URL = "https://snaprints.com";

export const metadata: Metadata = {
  title: "About Snaprint — Sanskriti Labs, Bengaluru",
  description:
    "Snaprint is a self-service print kiosk built by Sanskriti Labs in Bengaluru. We turn xerox shops into 24/7 print points for students and small businesses.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Snaprint — Sanskriti Labs",
    description: "A self-service print kiosk for Indian xerox shops, built in Bengaluru by Sanskriti Labs.",
    url: `${SITE_URL}/about`,
    type: "website",
    images: [`${SITE_URL}/og.png`],
  },
  twitter: {
    title: "About Snaprint — Sanskriti Labs",
    description: "A self-service print kiosk for Indian xerox shops, built in Bengaluru by Sanskriti Labs.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#page`,
      url: `${SITE_URL}/about`,
      name: "About Snaprint",
      description:
        "Snaprint is a self-service print kiosk built by Sanskriti Labs in Bengaluru, India.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="mx-auto max-w-[860px] px-6 py-24 md:px-10">
        <p className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
          About
        </p>
        <h1
          className="mb-6 font-display font-extrabold leading-[1.05] tracking-[-2px] text-[#111110]"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
        >
          We turn xerox shops into 24/7 print points.
        </h1>
        <p className="mb-12 max-w-[640px] font-body text-[17px] font-light leading-[1.78] text-[#6B6B66]">
          Snaprint is built by <strong>Sanskriti Labs</strong>, a product company in
          Bengaluru, India. The S1 kiosk connects to any existing printer and lets
          customers print from their phone — no app, no staff, no queue.
        </p>

        <section className="mb-12">
          <h2 className="mb-4 font-display text-[24px] font-extrabold tracking-tight text-[#111110]">
            The problem
          </h2>
          <p className="mb-4 font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
            Independent xerox shops in India lose revenue every night and on
            weekends — the doors close at 21:00, but students and job applicants
            need to print at 23:00. Daytime queues stretch 10–40 minutes during
            exam and placement season. The shop owner cannot bill for the time
            spent managing the queue, and the customer walks away frustrated.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-display text-[24px] font-extrabold tracking-tight text-[#111110]">
            What we built
          </h2>
          <p className="mb-4 font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
            The Snaprint S1 is a counter-top unit that pairs with any Canon, HP,
            Epson, or Brother printer. A customer scans a QR on the S1 with their
            phone, uploads a document, pays via UPI or card, and the S1 prints
            automatically. Files are end-to-end encrypted and deleted after each
            job. Shop owners track revenue, ink, and paper from a phone
            dashboard.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-display text-[24px] font-extrabold tracking-tight text-[#111110]">
            The business
          </h2>
          <p className="mb-4 font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
            The S1 is sold to shop owners for a one-time ₹84,999 to ₹2,99,999, depending on the model.
            There is no per-print commission, no monthly fee, and no franchise
            royalty. Shop owners set their own print prices and keep 100% of
            revenue after the hardware cost is recovered.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-display text-[24px] font-extrabold tracking-tight text-[#111110]">
            Where we operate
          </h2>
          <p className="mb-4 font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
            Snaprint&apos;s rollout is currently focused on Bengaluru and Hyderabad. Five more kiosks
            are being installed across Bengaluru, going live by 5 September 2026.
          </p>
          <p className="mb-4 font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
            See the <Link href="/find-snaprint" className="text-[#E63946] underline-offset-4 hover:underline">Find Snaprint page</Link> for
            the current, up-to-date list of live and upcoming kiosk locations.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-display text-[24px] font-extrabold tracking-tight text-[#111110]">
            Contact
          </h2>
          <p className="mb-2 font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
            Email:{" "}
            <a
              href="mailto:snaprints@sanskritilabs.in"
              className="text-[#111110] underline-offset-4 hover:text-[#E63946] hover:underline"
            >
              snaprints@sanskritilabs.in
            </a>
          </p>
          <p className="mb-2 font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
            Headquarters: Sanskriti Labs, Bengaluru, Karnataka, India
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
