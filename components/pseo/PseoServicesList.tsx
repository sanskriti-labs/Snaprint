import { cn } from "@/lib/utils";

const services = [
  { label: "Black & white print", detail: "A4 · B&W" },
  { label: "Colour print", detail: "A4 · A3 · Colour" },
  { label: "Single & double-sided", detail: "Auto-detect" },
  { label: "Photocopy", detail: "Reduce / enlarge" },
  { label: "Scan to email", detail: "Get a PDF instantly" },
  { label: "ID & passport photos", detail: "Standard sizes" },
];

export default function PseoServicesList() {
  return (
    <section className="mb-16">
      <h2 className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E63946]">
        Services available
      </h2>
      <p className="mb-8 font-body text-[13px] text-[#888780]">
        Services offered by partner xerox shops near this location:
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {services.map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-xl border border-[#E8E6E0] bg-[#F5F3EE] p-4",
              "flex flex-col gap-1.5"
            )}
          >
            <span className="font-display text-[13px] font-bold text-[#111110]">
              {s.label}
            </span>
            <span className="font-body text-[11px] text-[#888780]">
              {s.detail}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
