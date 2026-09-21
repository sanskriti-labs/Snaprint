import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Snappy from "@/components/mascot/Snappy";
import AgentRecoveryLinks from "@/components/AgentRecoveryLinks";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-[1280px] flex-col items-center px-6 py-32 text-center md:px-10">
        <Snappy state="asleep" scale={1.3} decorative />
        <p className="mb-5 mt-8 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
          404 · asleep
        </p>
        <h1 className="mb-6 font-display text-[36px] font-extrabold tracking-tight text-[#111110] md:text-[44px]">
          This page nodded off.
        </h1>
        <p className="mb-10 max-w-[460px] font-body text-[16px] leading-[1.78] text-[#6B6B66]">
          The page you&apos;re looking for doesn&apos;t exist, or it moved. The kiosk out
          front is still very much awake, though.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#111110] px-7 py-3.5 font-display text-[14px] font-semibold text-white transition-all hover:bg-[#E63946]"
          >
            Back home
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-[8px] border border-[#E8E6E0] px-7 py-3.5 font-body text-[14px] text-[#6B6B66] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
          >
            Book a Demo
          </Link>
        </div>
        <AgentRecoveryLinks extraLink={{ href: "/print-near", label: "/print-near  --  directory of listed print/xerox shops by area" }} />
      </main>
      <Footer />
    </>
  );
}
