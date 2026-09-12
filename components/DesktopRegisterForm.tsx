"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

export default function DesktopRegisterForm() {
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/desktop-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopName, ownerName, phone, email, city }),
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

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-10 text-center shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h3 className="mb-2 font-display text-[22px] font-bold text-[#111110]">
          You&apos;re on the list.
        </h3>
        <p className="font-body text-[14.5px] font-light leading-[1.7] text-[#6B6B66]">
          The Snaprint team will reach out on the phone number you gave us with setup
          instructions for Snaprint Desktop.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 shadow-[0_1px_4px_rgba(0,0,0,0.04)] md:p-10"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-body text-[13px] font-medium text-[#111110]">
            Shop name
          </label>
          <input
            required
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="e.g. Sri Balaji Xerox"
            className="w-full rounded-[8px] border border-[rgba(0,0,0,0.12)] px-4 py-3 font-body text-[14px] text-[#111110] outline-none transition-colors focus:border-[#E63946]"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-body text-[13px] font-medium text-[#111110]">
            Your name
          </label>
          <input
            required
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Owner or manager"
            className="w-full rounded-[8px] border border-[rgba(0,0,0,0.12)] px-4 py-3 font-body text-[14px] text-[#111110] outline-none transition-colors focus:border-[#E63946]"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-body text-[13px] font-medium text-[#111110]">
            Phone number
          </label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-[8px] border border-[rgba(0,0,0,0.12)] px-4 py-3 font-body text-[14px] text-[#111110] outline-none transition-colors focus:border-[#E63946]"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-body text-[13px] font-medium text-[#111110]">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@shop.com"
            className="w-full rounded-[8px] border border-[rgba(0,0,0,0.12)] px-4 py-3 font-body text-[14px] text-[#111110] outline-none transition-colors focus:border-[#E63946]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block font-body text-[13px] font-medium text-[#111110]">
            City <span className="text-[#AAAAAA]">(optional)</span>
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Bengaluru"
            className="w-full rounded-[8px] border border-[rgba(0,0,0,0.12)] px-4 py-3 font-body text-[14px] text-[#111110] outline-none transition-colors focus:border-[#E63946]"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 font-body text-[13.5px] text-[#E63946]" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="mt-7 w-full md:w-auto">
        {submitting ? "Submitting…" : "Register for free"}
      </Button>
      <p className="mt-4 font-body text-[12.5px] font-light text-[#AAAAAA]">
        No payment required. We&apos;ll contact you with the Snaprint Desktop download and setup steps.
      </p>
    </form>
  );
}
