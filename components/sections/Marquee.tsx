export default function Marquee() {
  const items = [
    "snap. scan. print.",
    "no queue",
    "UPI payment",
    "60 seconds",
    "any printer brand",
    "24/7 ready",
    "Bengaluru-first",
    "2000 sheets",
    "remote orders",
  ];

  const track = [...items, ...items];
  const trackRev = [...items.slice().reverse(), ...items.slice().reverse()];

  return (
    <div className="overflow-hidden bg-[#111110] py-0" aria-hidden>
      {/* Forward row */}
      <div
        className="flex animate-marquee whitespace-nowrap border-b border-[rgba(255,255,255,0.05)] py-[13px]"
        style={{ willChange: "transform" }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="inline-flex flex-shrink-0 items-center gap-8 px-8 font-display text-[11px] font-medium uppercase tracking-[0.14em] text-[rgba(255,255,255,0.28)]"
          >
            {item}
            <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[#E63946]" style={{ boxShadow: "0 0 6px rgba(230,57,70,0.9)" }} />
          </span>
        ))}
      </div>
      {/* Reverse row */}
      <div
        className="flex animate-marquee-rev whitespace-nowrap py-[13px]"
        style={{ willChange: "transform" }}
      >
        {trackRev.map((item, i) => (
          <span
            key={i}
            className="inline-flex flex-shrink-0 items-center gap-8 px-8 font-display text-[11px] font-medium uppercase tracking-[0.14em] text-[rgba(230,57,70,0.35)]"
          >
            {item}
            <span className="h-px w-6 flex-shrink-0 bg-[rgba(230,57,70,0.3)]" />
          </span>
        ))}
      </div>
    </div>
  );
}
