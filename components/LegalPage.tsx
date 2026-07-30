import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[760px] px-6 py-28 md:px-10">
        <Link
          href="/"
          className="mb-8 inline-block font-body text-[13px] text-snap-gray transition-colors hover:text-snap-red"
        >
          ← Back to Snaprint
        </Link>
        <h1 className="mb-3 font-display text-[36px] font-extrabold tracking-tight text-snap-charcoal md:text-[44px]">
          {title}
        </h1>
        <p className="mb-14 font-body text-[13px] text-snap-gray">Last updated: {updated}</p>
        <div className="legal-content font-body text-[15px] leading-[1.8] text-snap-charcoal-soft">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
