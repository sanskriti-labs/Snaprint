import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImpactHero from "@/components/impact/ImpactHero";
import TrustSection from "@/components/impact/TrustSection";
import CommunityPhilosophy from "@/components/impact/CommunityPhilosophy";
import { REDDIT_SUBREDDIT_URL } from "@/lib/reddit";

// Deferred: fetches the live feed client-side, must never block the rest of
// the page (spec: "the main page must not wait for Reddit to load").
const CommunityFeed = dynamic(() => import("@/components/impact/CommunityFeed"), {
  loading: () => <div className="bg-[#F8F7F4] px-6 py-28 md:px-10" />,
});

const SITE_URL = "https://snaprints.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/impact#page`,
      url: `${SITE_URL}/impact`,
      name: "Impact  --  Snaprint Community",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Impact", item: `${SITE_URL}/impact` },
      ],
    },
  ],
};

export default function ImpactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <ImpactHero />
        <TrustSection />
        <CommunityFeed />
        <CommunityPhilosophy />
        <section className="bg-white px-6 py-10 text-center md:px-10">
          <a
            href={REDDIT_SUBREDDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[13px] text-[#AAAAAA] underline-offset-4 hover:text-[#E63946] hover:underline"
          >
            Prefer to browse everything on Reddit? Visit r/Snaprint directly →
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
