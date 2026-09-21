import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostMeta } from "@/lib/blog";
import BlogPage from "@/components/BlogPage";
import Script from "next/script";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  if (!getAllPostSlugs().includes(params.slug)) return {};
  const meta = getPostMeta(params.slug);
  const metadata = {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    // lang is not yet part of Next.js 14.2's Metadata type, so it's typed as
    // unknown here and silenced with the cast below. It is used only as the
    // source of truth for the beforeInteractive script that sets <html lang>.
    // Remove this field and the cast once the field is added upstream.
    lang: meta.lang ?? "en",
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date,
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
  } as unknown as Metadata;
  return metadata;
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const slugs = getAllPostSlugs();
  if (!slugs.includes(params.slug)) notFound();

  const meta = getPostMeta(params.slug);
  const htmlLang = meta.lang ?? "en";

  return (
    <>
      <Script
        id="blog-html-lang"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang='${htmlLang}';`,
        }}
      />
      <BlogPage meta={meta}>
        {(await import(`@/content/blog/${meta.slug}.mdx`)).default}
      </BlogPage>
    </>
  );
}
