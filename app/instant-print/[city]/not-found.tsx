import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function InstantPrintNotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-6 py-32 md:px-10">
        <p className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
          404
        </p>
        <h1 className="mb-6 font-display text-[36px] font-extrabold tracking-tight text-[#111110] md:text-[44px]">
          City not found
        </h1>
        <p className="mb-10 max-w-[460px] font-body text-[16px] leading-[1.78] text-[#6B6B66]">
          We don&apos;t have print or xerox shop listings for that city yet. Get in touch
          to let us know where you&apos;d like to see us next.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#111110] px-7 py-3.5 font-display text-[14px] font-semibold text-white transition-all hover:bg-[#E63946]"
          >
            Book a Demo
          </Link>
          <a
            href="mailto:snaprints@sanskritilabs.in"
            className="inline-flex items-center gap-2 rounded-[8px] border border-[#E8E6E0] px-7 py-3.5 font-body text-[14px] text-[#6B6B66] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
          >
            Contact us
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
