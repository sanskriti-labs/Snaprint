import FeedbackModal from "./FeedbackModal";

export default function CommunityPhilosophy() {
  return (
    <section className="bg-[#111110] px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[640px] text-center">
        <h2 className="mb-5 font-display text-[26px] font-extrabold tracking-tight text-white md:text-[32px]">
          Built in public, improved together.
        </h2>
        <p className="mb-3 font-body text-[15.5px] font-light leading-[1.78] text-white/70">
          Every product has blind spots. That's why we're listening.
        </p>
        <p className="mb-10 font-body text-[15.5px] font-light leading-[1.78] text-white/70">
          Tell us what feels great. Tell us what feels broken. Tell us what you wish Snaprint could do next.
          The goal isn't to collect compliments — it's to build something better.
        </p>
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
      </div>
    </section>
  );
}
