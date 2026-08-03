import Link from "next/link";

export default function PseoCta() {
  return (
    <section
      className="relative overflow-hidden px-6 py-20 md:px-10"
      style={{
        background: "linear-gradient(160deg, #0f0f0e 0%, #111110 50%, #1a0405 100%)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 100%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[900px] text-center">
        <p className="mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#E63946]" />
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
            Get started
          </span>
          <span className="h-px w-8 bg-[#E63946]" />
        </p>

        <h2 className="mb-6 font-display font-extrabold leading-[1.02] tracking-[-2px] text-white"
          style={{ fontSize: "clamp(28px, 4vw, 52px)" }}>
          Want Snaprint at your shop?
        </h2>

        <p className="mx-auto mb-10 max-w-[420px] font-body text-[15px] font-light leading-[1.75] text-[rgba(255,255,255,0.38)]">
          Contact the Snaprint team to explore partnership options — no commitment required.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2.5 rounded-[8px] bg-white px-9 py-4 font-display text-[14px] font-bold text-[#111110] transition-all duration-200 hover:bg-[#E63946] hover:text-white hover:-translate-y-px"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.35)" }}
          >
            Book a Demo
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <a
            href="mailto:snaprints@sanskritilabs.in"
            className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(255,255,255,0.12)] px-7 py-4 font-body text-[14px] font-medium text-[rgba(255,255,255,0.55)] transition-all duration-200 hover:border-[rgba(255,255,255,0.3)] hover:text-white"
          >
            snaprints@sanskritilabs.in
          </a>
        </div>
      </div>
    </section>
  );
}
