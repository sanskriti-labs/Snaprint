const WELCOME = [
  "Questions are welcome.",
  "Constructive criticism is welcome.",
  "Feature ideas are welcome.",
  "Problems and bugs are welcome.",
  "Experiences and suggestions are welcome.",
];

export default function TrustSection() {
  return (
    <section className="bg-white px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[720px]">
        <h2 className="mb-4 font-display text-[26px] font-extrabold tracking-tight text-[#111110] md:text-[32px]">
          Real feedback. Real conversations.
        </h2>
        <p className="mb-9 font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
          We want the good, the bad and everything in between. Tell us what you actually think about Snaprint.
        </p>

        <ul className="mb-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {WELCOME.map((item) => (
            <li key={item} className="flex items-start gap-2.5 font-body text-[14.5px] text-[#444440]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {item}
            </li>
          ))}
          <li className="flex items-start gap-2.5 font-body text-[14.5px] text-[#444440]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Harassment, hate speech, spam and unrelated promotion are not.
          </li>
        </ul>

        <div className="light-card rounded-2xl px-6 py-6 sm:px-8">
          <p className="font-display text-[19px] font-bold text-[#111110] sm:text-[22px]">
            Honest criticism stays. Abuse doesn't.
          </p>
          <p className="mt-2.5 font-body text-[13.5px] font-light leading-[1.7] text-[#6B6B66]">
            We remove harassment, hate speech, spam and abuse so that useful conversations don't get buried —
            not because a comment was negative. Positive, negative, or somewhere in between, real feedback stays up.
          </p>
        </div>
      </div>
    </section>
  );
}
