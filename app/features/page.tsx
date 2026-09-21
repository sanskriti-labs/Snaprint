import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Why = dynamic(() => import("@/components/sections/Why"));
const MachineSpecs = dynamic(() => import("@/components/sections/MachineSpecs"));

const SITE_URL = "https://snaprints.com";

export const metadata: Metadata = {
  title: "Features  --  Snaprint S1 Print Kiosk",
  description:
    "Universal printer compatibility, encrypted file handling, 24/7 unattended operation, and a live owner dashboard  --  everything the Snaprint S1 does for your shop.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Features  --  Snaprint S1 Print Kiosk",
    description: "Universal printer compatibility, encrypted files, 24/7 operation, and a live owner dashboard.",
    url: `${SITE_URL}/features`,
    type: "website",
    images: [`${SITE_URL}/og.png`],
  },
  twitter: {
    title: "Features  --  Snaprint S1 Print Kiosk",
    description: "Universal printer compatibility, encrypted files, 24/7 operation, and a live owner dashboard.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/features#page`,
      url: `${SITE_URL}/features`,
      name: "Features  --  Snaprint S1",
      description:
        "Universal printer compatibility, encrypted file handling, 24/7 unattended operation, and a live owner dashboard.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Features", item: `${SITE_URL}/features` },
      ],
    },
  ],
};

export default function FeaturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <div className="mx-auto max-w-[1280px] px-6 pt-32 md:px-10">
          <p className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
            Features
          </p>
          <h1
            className="mb-5 max-w-[640px] font-display font-extrabold leading-[1.04] tracking-[-2.5px] text-[#111110]"
            style={{ fontSize: "clamp(32px,4.5vw,56px)" }}
          >
            Everything the S1 does for your shop.
          </h1>
        </div>
        <Why />
        <MachineSpecs />
      </main>
      <Footer />
    </>
  );
}
