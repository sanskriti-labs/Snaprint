import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { BlogPostMeta } from "@/lib/blog";

const SITE_URL = "https://snaprints.com";

export default function BlogPage({
  meta,
  children,
}: {
  meta: BlogPostMeta;
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${meta.slug}#post`,
        headline: meta.title,
        description: meta.description,
        url: `${SITE_URL}/blog/${meta.slug}`,
        datePublished: meta.date,
        dateModified: meta.date,
        image: `${SITE_URL}/og.png`,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        keywords: meta.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: meta.title, item: `${SITE_URL}/blog/${meta.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="mx-auto max-w-[760px] px-6 py-28 md:px-10">
        <Link
          href="/blog"
          className="mb-8 inline-block font-body text-[13px] text-snap-gray transition-colors hover:text-snap-red"
        >
          ← Back to Blog
        </Link>
        <span className="mb-3 inline-block rounded-full bg-snap-red-tint px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-snap-red">
          {meta.audience === "B2B" ? "For shop owners" : "For everyone"}
        </span>
        <h1 className="mb-3 font-display text-[36px] font-extrabold tracking-tight text-snap-charcoal md:text-[44px]">
          {meta.title}
        </h1>
        <p className="mb-14 font-body text-[13px] text-snap-gray">
          {new Date(meta.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          {meta.readingTime}
        </p>
        <div className="blog-content font-body text-[15px] leading-[1.8] text-snap-charcoal-soft">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
