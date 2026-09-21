// app/(marketing)/book/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { DatePicker } from "@/components/book/DatePicker";
import { TimeSlots } from "@/components/book/TimeSlots";
import { Button } from "@/components/ui/Button";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import Snappy from "@/components/mascot/Snappy";

export const dynamic = "force-dynamic";

type Slot = { time: string; providerId: number; providerName: string };
type Provider = {
  id: number;
  firstName: string;
  // Image is sourced from /public/founders; photo filename is kebab-case of the
  // first name. The mapping is local so we don't ship an image URL from EA.
  photo: string;
};

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });
}

export default function BookPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  // Load linked providers on mount and pair them with local photo assets.
  useEffect(() => {
    fetch("/api/book/providers")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load founders");
        return res.json();
      })
      .then((data: { providers: Array<{ id: number; firstName: string }> }) => {
        const mapped: Provider[] = (data.providers ?? []).map((p) => ({
          id: p.id,
          firstName: p.firstName,
          photo: `/founders/${p.firstName.toLowerCase()}.webp`,
        }));
        setProviders(mapped);
        // Pre-select the first provider so the time grid renders with content
        // before the user has interacted.
        if (mapped.length > 0) setSelectedProviderId(mapped[0].id);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  // Fetch slots whenever the selected date changes.
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setSelectedTime(null);
      return;
    }
    let ignore = false;
    setLoadingSlots(true);
    setSelectedTime(null);
    setError(null);

    fetch(`/api/book/availability?date=${selectedDate}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load times");
        return res.json();
      })
      .then((data: { slots: Slot[] }) => {
        if (!ignore) setSlots(data.slots ?? []);
      })
      .catch((err: Error) => {
        if (!ignore) {
          setError(err.message);
          setSlots([]);
        }
      })
      .finally(() => {
        if (!ignore) setLoadingSlots(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedDate]);

  // Filter the slot list to the selected founder. We always filter  --  even with
  // one founder selected  --  so the contract stays simple if more providers are
  // added later.
  const filteredSlots = useMemo(() => {
    if (selectedProviderId === null) return [];
    return slots
      .filter((s) => s.providerId === selectedProviderId)
      .map(({ time }) => ({ time }));
  }, [slots, selectedProviderId]);

  const selectedProvider = providers.find((p) => p.id === selectedProviderId) ?? null;
  const ready = selectedDate !== null && selectedProviderId !== null && selectedTime !== null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || submittingRef.current) return;
    submittingRef.current = true;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/book/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: selectedDate,
          time: selectedTime,
          providerId: selectedProviderId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  }

  if (submitted && selectedDate && selectedTime && selectedProvider) {
    return (
      <main
        className="relative min-h-screen overflow-hidden px-6 py-24 md:px-10"
        style={{ background: "linear-gradient(160deg, #0f0f0e 0%, #111110 50%, #1a0405 100%)" }}
      >
        <div className="relative mx-auto max-w-[560px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[12px] border border-white/10 bg-white p-10 text-center"
          >
            <div className="mb-4 flex justify-center">
              <Snappy state="done" scale={0.85} decorative />
            </div>
            <h1 className="mb-3 font-display text-[28px] font-bold text-snap-charcoal">
              You&apos;re booked!
            </h1>
            <p className="font-body text-[15px] text-snap-gray">
              {formatDateLabel(selectedDate)} at {formatTimeLabel(selectedTime)} with{" "}
              {selectedProvider.firstName}. A Google Meet invite will land on{" "}
              {selectedProvider.firstName}&apos;s calendar  --  they&apos;ll send the link
              before the call.
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 py-16 md:px-10 md:py-24"
      style={{ background: "linear-gradient(160deg, #0f0f0e 0%, #111110 50%, #1a0405 100%)" }}
    >
      <div className="relative mx-auto max-w-[1080px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-snap-red" />
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-snap-red">
              Book a demo
            </span>
            <span className="h-px w-8 bg-snap-red" />
          </span>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-2px] text-white text-[clamp(28px,4.5vw,48px)]">
            Talk to the Snaprint founder
          </h1>
          <p className="mx-auto mt-4 max-w-[440px] font-body text-[15px] font-light leading-[1.7] text-white/40">
            A 40-minute call over Google Meet. No commitment required.
          </p>
        </motion.div>

        <div className="grid gap-6 rounded-[12px] border border-white/10 bg-white p-6 md:grid-cols-[260px_1fr] md:gap-0 md:p-0 md:overflow-hidden">
          {/* Left column  --  founders */}
          <aside className="md:border-r md:border-snap-border md:bg-snap-surface/30 md:p-6">
            <h2 className="mb-4 font-display text-[13px] font-bold uppercase tracking-wide text-snap-charcoal">
              With
            </h2>
            <div className="flex flex-row gap-3 overflow-x-auto md:flex-col md:gap-3 md:overflow-visible">
              {providers.map((provider) => {
                const isSelected = provider.id === selectedProviderId;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => {
                      setSelectedProviderId(provider.id);
                      setSelectedTime(null);
                    }}
                    aria-pressed={isSelected}
                    className={`flex shrink-0 items-center gap-3 rounded-[8px] border p-3 text-left transition-all duration-150 ${
                      isSelected
                        ? "border-snap-red bg-white shadow-[0_0_0_2px_rgba(220,38,38,0.15)]"
                        : "border-snap-border bg-white hover:border-snap-red/50"
                    }`}
                  >
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-snap-surface">
                      <ImageWithSkeleton
                        src={provider.photo}
                        alt={provider.firstName}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        skeletonClassName="absolute inset-0 rounded-full"
                      />
                    </span>
                    <span className="font-body text-[14px] font-medium text-snap-charcoal">
                      {provider.firstName}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right column  --  date, time, details */}
          <div className="space-y-6 md:p-6">
            <section>
              <h2 className="mb-3 font-display text-[13px] font-bold uppercase tracking-wide text-snap-charcoal">
                Pick a date
              </h2>
              <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
            </section>

            {selectedDate && (
              <section>
                <h2 className="mb-3 font-display text-[13px] font-bold uppercase tracking-wide text-snap-charcoal">
                  Pick a time{selectedProvider ? ` with ${selectedProvider.firstName}` : ""}
                </h2>
                <TimeSlots
                  slots={filteredSlots}
                  selectedTime={selectedTime}
                  onSelect={setSelectedTime}
                  loading={loadingSlots}
                />
              </section>
            )}

            {ready && (
              <section>
                <h2 className="mb-3 font-display text-[13px] font-bold uppercase tracking-wide text-snap-charcoal">
                  Your details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block font-body text-[13px] font-medium text-snap-charcoal">
                      Name
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-[6px] border border-snap-border px-3.5 py-2.5 font-body text-[14px] outline-none focus:border-snap-charcoal"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-body text-[13px] font-medium text-snap-charcoal">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-[6px] border border-snap-border px-3.5 py-2.5 font-body text-[14px] outline-none focus:border-snap-charcoal"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-body text-[13px] font-medium text-snap-charcoal">
                      Phone
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-[6px] border border-snap-border px-3.5 py-2.5 font-body text-[14px] outline-none focus:border-snap-charcoal"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="font-body text-[13px] text-snap-red-dark">
                      {error}
                    </p>
                  )}

                  <Button type="submit" disabled={submitting} className="w-full justify-center gap-2">
                    {submitting && (
                      <span className="inline-flex h-5 w-5 items-center justify-center overflow-hidden">
                        <span className="scale-[0.13] origin-center">
                          <Snappy state="printing" decorative idleBeat={false} />
                        </span>
                      </span>
                    )}
                    {submitting
                      ? "Booking…"
                      : `Confirm  --  ${formatDateLabel(selectedDate!)} at ${formatTimeLabel(selectedTime!)}`}
                  </Button>
                </form>
              </section>
            )}

            {!ready && error && (
              <p role="alert" className="font-body text-[13px] text-snap-red-dark">
                {error}
              </p>
            )}
          </div>
        </div>

        <p className="mt-8 text-center font-body text-[13px] text-white/30">
          Prefer email?{" "}
          <a href="mailto:snaprints@sanskritilabs.in" className="underline hover:text-white/60">
            snaprints@sanskritilabs.in
          </a>
        </p>
      </div>
    </main>
  );
}