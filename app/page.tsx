import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Footer from "@/components/Footer";

// Below-the-fold sections: deferred so their JS (incl. framer-motion) doesn't
// block initial paint of the hero — this was the render-blocking bundle
// PageSpeed flagged (109 KiB unused JS on first load).
const Problem = dynamic(() => import("@/components/sections/Problem"));
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"));
const Why = dynamic(() => import("@/components/sections/Why"));
const MachineSpecs = dynamic(() => import("@/components/sections/MachineSpecs"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const CtaFinal = dynamic(() => import("@/components/sections/CtaFinal"));

const SITE_URL = "https://snaprints.com";

// Product/WebApplication/kiosk-FAQ schema lives here (not root layout) so it
// only describes the Snaprint S1 on the page that's actually about it — PSEO
// directory pages (print-near/*, instant-print/*) were surfacing the kiosk
// price in search snippets for pages about unrelated third-party xerox shops.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${SITE_URL}/#product-s1`,
      name: "Snaprint S1",
      description:
        "Self-service print kiosk that connects to any existing printer (Canon, HP, Epson, Brother). Customers scan a QR code, upload a document, pay, and collect the print without staff present.",
      brand: { "@id": `${SITE_URL}/#organization` },
      image: `${SITE_URL}/og.png`,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: "300000",
        highPrice: "350000",
        offerCount: "1",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#kiosk-app`,
      name: "Snaprint Kiosk Customer App",
      url: SITE_URL,
      description: "QR-code-driven print upload and payment flow that runs in any mobile browser — no app install required.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any (browser-based)",
      browserRequirements: "Requires JavaScript. Mobile-first; works on iOS Safari 14+ and Android Chrome 90+.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free to use for print customers; print prices set by the hosting shop.",
      },
      author: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Does the Snaprint S1 work with my existing printer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The Snaprint S1 works with any printer brand — Canon, HP, Epson, Brother — so you don't need to replace your existing equipment.",
          },
        },
        {
          "@type": "Question",
          name: "Can the kiosk take orders when my shop is closed?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Orders queue automatically and the kiosk keeps printing whether or not you're present, so your shop can earn from print jobs placed after hours.",
          },
        },
        {
          "@type": "Question",
          name: "What happens to a customer's uploaded documents?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Files are end-to-end encrypted and automatically deleted after each print job completes — no document is stored on the kiosk.",
          },
        },
        {
          "@type": "Question",
          name: "How do shop owners track orders and revenue?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every order, along with revenue, print counts, and ink and paper status, is visible on a live dashboard on the shop owner's phone.",
          },
        },
        {
          "@type": "Question",
          name: "Can I get a refund if I cancel before installation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. If you've paid for a kiosk but installation hasn't taken place yet, you can cancel and request a full refund, processed within 7–14 business days to your original payment method.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <HowItWorks />
      <Why />
      <MachineSpecs />
      <Testimonials />
      <CtaFinal />
      <Footer />
    </main>
  );
}
