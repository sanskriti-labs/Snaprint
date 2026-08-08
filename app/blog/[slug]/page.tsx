import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostMeta } from "@/lib/blog";
import BlogPage from "@/components/BlogPage";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  if (!getAllPostSlugs().includes(params.slug)) return {};
  const meta = getPostMeta(params.slug);
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const slugs = getAllPostSlugs();
  if (!slugs.includes(params.slug)) notFound();

  const meta = getPostMeta(params.slug);
  const { default: Content } = await import(`@/content/blog/${meta.slug}.mdx`);

  return (
    <BlogPage meta={meta}>
      <Content />
    </BlogPage>
  );
}
