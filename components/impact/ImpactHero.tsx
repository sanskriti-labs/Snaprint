import FeedbackModal from "./FeedbackModal";

export default function ImpactHero() {
  return (
    <section className="bg-[#F8F7F4] px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
      <div className="mx-auto max-w-[760px] text-center">
        <p className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
          Snaprint Community
        </p>
        <h1
          className="mb-6 font-display font-extrabold leading-[1.05] tracking-[-2px] text-[#111110]"
          style={{ fontSize: "clamp(34px, 5.2vw, 64px)" }}
        >
          Your voice shapes Snaprint.
        </h1>
        <p className="mx-auto mb-10 max-w-[520px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
          Snaprint is being built with the people who use it. Share what works, tell us what doesn't,
          suggest something new, or simply join the conversation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <FeedbackModal
            trigger={
              <button
                type="button"
                className="liquid-glass-red group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-[14px] font-semibold text-white transition-transform duration-[--d-hover] ease-hover hover:scale-[1.03]"
              >
                Share your thoughts
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" className="transition-transform duration-[--d-hover] ease-hover group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            }
          />
          <a
            href="#community"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-body text-[14px] font-medium text-[#111110] transition-transform duration-[--d-hover] ease-hover hover:scale-[1.03]"
          >
            Explore the community
          </a>
        </div>
      </div>
    </section>
  );
}
