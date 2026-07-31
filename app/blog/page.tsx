import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPostsMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides on instant printing, xerox shop business, and Snaprint kiosk franchises in India.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[900px] px-6 py-28 md:px-10">
        <h1 className="mb-3 font-display text-[36px] font-extrabold tracking-tight text-snap-charcoal md:text-[44px]">
          Snaprint Blog
        </h1>
        <p className="mb-14 font-body text-[15px] text-snap-gray">
          Guides on instant printing, running a xerox shop, and starting a Snaprint kiosk franchise.
        </p>
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-snap-border bg-white p-6 transition-colors hover:border-snap-red md:p-8"
            >
              <span className="mb-3 inline-block rounded-full bg-snap-red-tint px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-snap-red">
                {post.audience === "B2B" ? "For shop owners" : "For everyone"}
              </span>
              <h2 className="mb-2 font-display text-[22px] font-semibold text-snap-charcoal group-hover:text-snap-red md:text-[26px]">
                {post.title}
              </h2>
              <p className="mb-4 font-body text-[14px] leading-relaxed text-snap-gray">{post.description}</p>
              <span className="font-body text-[12.5px] text-snap-gray">
                {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                {" · "}
                {post.readingTime}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
