export default function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "#how" },
        { label: "The S1 kiosk", href: "#machine" },
        { label: "Why Snaprint", href: "#why" },
        { label: "Results", href: "#testimonials" },
      ],
    },
{
      title: "Contact",
      links: [
        { label: "contact@snaprint.in", href: "mailto:contact@snaprint.in" },
        { label: "Request a Quote", href: "mailto:contact@snaprint.in?subject=Quote Request" },
        { label: "Book a Demo", href: "#contact" },
        { label: "snaprint.in", href: "https://snaprint.in" },
      ],
    },
  ];

  return (
    <footer className="bg-[#F8F7F4] px-6 pb-8 pt-16 md:px-10">
      <div className="mx-auto max-w-[1280px]">

        {/* Top section */}
        <div className="mb-12 grid grid-cols-1 gap-12 border-b border-[rgba(0,0,0,0.08)] pb-12 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr]">

          {/* Brand block */}
          <div>
            <div className="mb-5 flex items-center gap-0">
              <span className="font-display text-[22px] font-extrabold tracking-[-0.8px] text-[#E63946]">snap</span>
              <span className="font-display text-[22px] font-extrabold tracking-[-0.8px] text-[#111110]">rint</span>
              <span className="mb-[8px] ml-[2px] inline-block h-[6px] w-[6px] rounded-full bg-[#E63946]" />
            </div>
            <p className="mb-6 max-w-[220px] font-body text-[13px] leading-[1.75] text-[#777770]">
              Smart print automation for independent shop owners. Built by Sanskriti Labs, Bengaluru.
            </p>
            <a
              href="mailto:contact@snaprint.in"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.1)] bg-white px-4 py-2 font-body text-[12.5px] font-medium text-[#111110] shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:border-[#E63946] hover:text-[#E63946]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              contact@snaprint.in
            </a>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#AAAAAA]">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="font-body text-[13.5px] text-[#555550] transition-colors duration-150 hover:text-[#E63946]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="font-body text-[12.5px] text-[#AAAAAA]">
            © 2026 Snaprint · A Sanskriti Labs product · Bengaluru, India
          </span>
          <div className="flex items-center gap-1">
            {["Privacy", "Terms", "Refund policy"].map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#DDDDDD]">·</span>}
                <a href="#" className="font-body text-[12.5px] text-[#AAAAAA] transition-colors hover:text-[#555550]">{l}</a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
