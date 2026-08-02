// app/book/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DatePicker } from "@/components/book/DatePicker";
import { TimeSlots } from "@/components/book/TimeSlots";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

type Slot = { time: string };
type Step = "picking" | "details" | "success";

function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });
}

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [step, setStep] = useState<Step>("picking");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!selectedDate) return;
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

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
    setStep("details");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    if (submittingRef.current) return;
    submittingRef.current = true;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/book/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, date: selectedDate, time: selectedTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 py-24 md:px-10"
      style={{ background: "linear-gradient(160deg, #0f0f0e 0%, #111110 50%, #1a0405 100%)" }}
    >
      <div className="relative mx-auto max-w-[720px]">
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

        <div className="rounded-[12px] border border-white/10 bg-white p-6 md:p-8">
          {step === "success" && selectedDate && selectedTime ? (
            <div className="py-10 text-center">
              <h2 className="mb-2 font-display text-[22px] font-bold text-snap-charcoal">
                You&apos;re booked!
              </h2>
              <p className="font-body text-[15px] text-snap-gray">
                {formatDateLabel(selectedDate)} at {formatTimeLabel(selectedTime)}. Check your
                email for the Google Meet link.
              </p>
            </div>
          ) : step === "details" && selectedDate && selectedTime ? (
            <form onSubmit={handleSubmit}>
              <button
                type="button"
                onClick={() => setStep("picking")}
                className="mb-4 font-body text-[13px] text-snap-gray hover:text-snap-charcoal"
              >
                &larr; {formatDateLabel(selectedDate)} at {formatTimeLabel(selectedTime)}
              </button>

              <div className="mb-4">
                <label className="mb-1.5 block font-body text-[13px] font-medium text-snap-charcoal">
                  Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[6px] border border-snap-border px-3.5 py-2.5 font-body text-[14px] outline-none focus:border-snap-red"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block font-body text-[13px] font-medium text-snap-charcoal">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[6px] border border-snap-border px-3.5 py-2.5 font-body text-[14px] outline-none focus:border-snap-red"
                />
              </div>

              <div className="mb-6">
                <label className="mb-1.5 block font-body text-[13px] font-medium text-snap-charcoal">
                  Phone
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-[6px] border border-snap-border px-3.5 py-2.5 font-body text-[14px] outline-none focus:border-snap-red"
                />
              </div>

              {error && (
                <p role="alert" className="mb-4 font-body text-[13px] text-snap-red-dark">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full justify-center">
                {submitting ? "Booking…" : "Confirm Booking"}
              </Button>
            </form>
          ) : (
            <>
              <h2 className="mb-3 font-display text-[15px] font-bold text-snap-charcoal">
                Pick a date
              </h2>
              <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />

              {selectedDate && (
                <div className="mt-6">
                  <h2 className="mb-3 font-display text-[15px] font-bold text-snap-charcoal">
                    Pick a time
                  </h2>
                  <TimeSlots
                    slots={slots}
                    selectedTime={selectedTime}
                    onSelect={handleTimeSelect}
                    loading={loadingSlots}
                  />
                </div>
              )}

              {error && (
                <p role="alert" className="mt-4 font-body text-[13px] text-snap-red-dark">
                  {error}
                </p>
              )}
            </>
          )}
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
