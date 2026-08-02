# Native Booking Page (`/book`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the outbound "Book a Demo" link to `book.sanskritilabs.in` (stock, unbranded, non-mobile-optimized Easy!Appointments UI) with a native `/book` page on `snaprints.com` that talks to Easy!Appointments only via its REST API.

**Architecture:** A Next.js App Router page (`app/book/page.tsx`, client component) drives a 3-step flow — pick date, pick time slot, enter contact details — backed by two server-side API routes (`app/api/book/availability/route.ts`, `app/api/book/submit/route.ts`) that proxy to the Easy!Appointments v1 REST API using a server-only `EA_API_KEY`. The EA service/provider IDs are hardcoded server-side.

**Tech Stack:** Next.js 14 (App Router, Route Handlers), React 18, TypeScript, Tailwind CSS (existing `snap-*` design tokens), framer-motion (already installed, matches existing section animations), no new dependencies.

## Global Constraints

- EA API key (`EA_API_KEY`) is a server-only environment variable — never referenced in any Client Component or exposed in a response body.
- No new npm dependencies — calendar/date-picker is hand-built (small, fixed ~30-day range, no month navigation needed beyond next/prev).
- Match existing design tokens exactly: colors `snap-red` (`#E63946`), `snap-red-dark`, `snap-charcoal`, `snap-surface`, `snap-border`, `snap-gray`; fonts `font-display` (Space Grotesk) for headings/buttons, `font-body` (Inter) for body text; reuse `components/ui/Button.tsx` and `lib/utils.ts`'s `cn()`.
- The `snaprints@sanskritilabs.in` email fallback must remain visible at all times on `/book`, including during error states.
- No test framework exists in this repo (no Jest/Vitest/Playwright) — do not add one. Pure-logic modules (EA response mapping) get a plain `node`-runnable assert-based self-check (`pnpm exec tsx` or compiled check), not a test framework. UI correctness is verified manually via `pnpm dev` + browser, per step instructions below.
- This plan does not modify the Easy!Appointments admin configuration (services, working hours, provider setup) — that's managed in the EA admin panel, unchanged.

---

### Task 1: EA API client module (server-only)

**Files:**
- Create: `lib/easyAppointments.ts`
- Create: `lib/easyAppointments.selfcheck.ts`

**Interfaces:**
- Consumes: `process.env.EA_API_KEY`, `process.env.EA_BASE_URL` (defaults to `https://book.sanskritilabs.in` if unset)
- Produces:
  - `type Slot = { time: string }` — `time` is `"HH:mm"` 24-hour format
  - `getAvailableSlots(date: string): Promise<Slot[]>` — `date` is `"YYYY-MM-DD"`. Throws `EAApiError` on non-2xx or network failure.
  - `createAppointment(input: { name: string; email: string; phone: string; date: string; time: string }): Promise<{ id: number }>` — Throws `EAApiError` on non-2xx or network failure.
  - `class EAApiError extends Error { status?: number }`
  - `EA_SERVICE_NAME = "Introduction Call with Snaprint Founder"` (exported const, used only for display copy — the actual service ID lookup happens inside this module, resolved once via EA's `/api/v1/services` on first call and cached in module scope for the life of the server process)

This module is the single place that knows EA's API shape. If EA's actual response format differs from the assumed shape below once tested against the live instance (per the spec's open verification item), fix it here only.

- [ ] **Step 1: Write the module**

```typescript
// lib/easyAppointments.ts

const EA_BASE_URL = process.env.EA_BASE_URL ?? "https://book.sanskritilabs.in";
const SERVICE_DISPLAY_NAME = "Introduction Call with Snaprint Founder";

export class EAApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "EAApiError";
    this.status = status;
  }
}

export type Slot = { time: string };

type CreateAppointmentInput = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
};

export const EA_SERVICE_NAME = SERVICE_DISPLAY_NAME;

let cachedServiceId: number | null = null;

function apiKey(): string {
  const key = process.env.EA_API_KEY;
  if (!key) {
    throw new EAApiError("EA_API_KEY is not configured on the server");
  }
  return key;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey()}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function resolveServiceId(): Promise<number> {
  if (cachedServiceId !== null) return cachedServiceId;

  const res = await fetch(`${EA_BASE_URL}/index.php/api/v1/services`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new EAApiError(`Failed to list EA services (${res.status})`, res.status);
  }
  const services: Array<{ id: number; name: string }> = await res.json();
  const match = services.find((s) => s.name === SERVICE_DISPLAY_NAME);
  if (!match) {
    throw new EAApiError(
      `EA service "${SERVICE_DISPLAY_NAME}" not found. Check the service name matches exactly in the EA admin panel.`
    );
  }
  cachedServiceId = match.id;
  return match.id;
}

export async function getAvailableSlots(date: string): Promise<Slot[]> {
  const serviceId = await resolveServiceId();
  const url = new URL(`${EA_BASE_URL}/index.php/api/v1/availabilities`);
  url.searchParams.set("serviceId", String(serviceId));
  url.searchParams.set("providerId", "0");
  url.searchParams.set("selectedDate", date);

  const res = await fetch(url.toString(), {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new EAApiError(`Failed to fetch availability (${res.status})`, res.status);
  }
  const times: string[] = await res.json();
  return times.map((time) => ({ time }));
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<{ id: number }> {
  const serviceId = await resolveServiceId();
  const start = `${input.date} ${input.time}:00`;

  const res = await fetch(`${EA_BASE_URL}/index.php/api/v1/appointments`, {
    method: "POST",
    headers: authHeaders(),
    cache: "no-store",
    body: JSON.stringify({
      start,
      serviceId,
      customer: {
        firstName: input.name,
        email: input.email,
        phone: input.phone,
      },
    }),
  });

  if (!res.ok) {
    throw new EAApiError(`Failed to create appointment (${res.status})`, res.status);
  }
  const created = await res.json();
  return { id: created.id };
}
```

- [ ] **Step 2: Write the assert-based self-check**

This self-check verifies the module's pure error-handling behavior (no network calls needed for these paths) so there's at least one runnable guard against regressions in the auth/error logic.

```typescript
// lib/easyAppointments.selfcheck.ts
import assert from "node:assert";
import { EAApiError } from "./easyAppointments";

async function main() {
  // getAvailableSlots throws EAApiError when EA_API_KEY is unset
  delete process.env.EA_API_KEY;
  const { getAvailableSlots } = await import("./easyAppointments");
  try {
    await getAvailableSlots("2026-08-10");
    assert.fail("expected getAvailableSlots to throw when EA_API_KEY is unset");
  } catch (err) {
    assert.ok(err instanceof EAApiError, "expected EAApiError");
    assert.match((err as EAApiError).message, /EA_API_KEY is not configured/);
  }

  console.log("easyAppointments.selfcheck: OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 3: Run the self-check**

Run: `npx tsx lib/easyAppointments.selfcheck.ts`
Expected: `easyAppointments.selfcheck: OK`

(If `tsx` isn't available, run `npx --yes tsx lib/easyAppointments.selfcheck.ts` — npx will fetch it transiently; it is not added to `package.json`.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add lib/easyAppointments.ts lib/easyAppointments.selfcheck.ts
git commit -m "Add server-only Easy!Appointments API client"
```

---

### Task 2: `/api/book/availability` route

**Files:**
- Create: `app/api/book/availability/route.ts`

**Interfaces:**
- Consumes: `getAvailableSlots(date: string)` from Task 1 (`lib/easyAppointments.ts`)
- Produces: `GET /api/book/availability?date=YYYY-MM-DD` → `200 { slots: Slot[] }` on success, `400 { error: string }` for a missing/malformed `date` param, `502 { error: string }` if the EA call throws `EAApiError`.

- [ ] **Step 1: Write the route**

```typescript
// app/api/book/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots, EAApiError } from "@/lib/easyAppointments";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  if (!date || !DATE_RE.test(date)) {
    return NextResponse.json(
      { error: "Query param 'date' is required in YYYY-MM-DD format" },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(date);
    return NextResponse.json({ slots });
  } catch (err) {
    const message = err instanceof EAApiError ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
```

- [ ] **Step 2: Manual verification — missing param**

Run: `pnpm dev` (leave running), then in another terminal:
`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/book/availability`
Expected: `400`

- [ ] **Step 3: Manual verification — valid param, no EA key configured**

`curl -s http://localhost:3000/api/book/availability?date=2026-08-10`
Expected: `{"error":"EA_API_KEY is not configured on the server"}` with HTTP 502 (check via `-w "\n%{http_code}\n"`)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add app/api/book/availability/route.ts
git commit -m "Add /api/book/availability route"
```

---

### Task 3: `/api/book/submit` route

**Files:**
- Create: `app/api/book/submit/route.ts`

**Interfaces:**
- Consumes: `createAppointment(input)` from Task 1
- Produces: `POST /api/book/submit` with JSON body `{ name, email, phone, date, time }` → `200 { id: number }` on success, `400 { error: string }` for missing/invalid fields, `502 { error: string }` if the EA call throws `EAApiError` (covers the "slot taken" / double-booking case, since EA rejects the create call server-side).

- [ ] **Step 1: Write the route**

```typescript
// app/api/book/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAppointment, EAApiError } from "@/lib/easyAppointments";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, email, phone, date, time } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "'name' is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid 'email' is required" }, { status: 400 });
  }
  if (typeof phone !== "string" || phone.trim().length === 0) {
    return NextResponse.json({ error: "'phone' is required" }, { status: 400 });
  }
  if (typeof date !== "string" || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "'date' must be YYYY-MM-DD" }, { status: 400 });
  }
  if (typeof time !== "string" || !TIME_RE.test(time)) {
    return NextResponse.json({ error: "'time' must be HH:mm" }, { status: 400 });
  }

  try {
    const result = await createAppointment({ name, email, phone, date, time });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof EAApiError ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
```

- [ ] **Step 2: Manual verification — invalid body**

With `pnpm dev` running:
`curl -s -X POST http://localhost:3000/api/book/submit -H "Content-Type: application/json" -d '{}' -w "\n%{http_code}\n"`
Expected: `{"error":"'name' is required"}` and `400`

- [ ] **Step 3: Manual verification — valid body, no EA key configured**

```bash
curl -s -X POST http://localhost:3000/api/book/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"9999999999","date":"2026-08-10","time":"15:00"}' \
  -w "\n%{http_code}\n"
```
Expected: `{"error":"EA_API_KEY is not configured on the server"}` and `502`

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add app/api/book/submit/route.ts
git commit -m "Add /api/book/submit route"
```

---

### Task 4: Date/time picker components

**Files:**
- Create: `components/book/DatePicker.tsx`
- Create: `components/book/TimeSlots.tsx`

**Interfaces:**
- Consumes: nothing external beyond React and existing `cn()` from `lib/utils.ts`
- Produces:
  - `DatePicker`: `{ selectedDate: string | null; onSelect: (date: string) => void }` props. Renders a 30-day grid starting today (`YYYY-MM-DD` strings), calling `onSelect` when a day is clicked. Purely presentational — does not know which days are booked/closed (that's Task 5's job, passed in as a prop here).
  - Actually produces: `DatePicker` also accepts `disabledDates?: string[]` (dates rendered non-interactive).
  - `TimeSlots`: `{ slots: { time: string }[]; selectedTime: string | null; onSelect: (time: string) => void; loading: boolean }` props. Renders slot buttons, a loading skeleton when `loading`, and "No times available that day" when `slots` is empty and not loading.

- [ ] **Step 1: Write `DatePicker.tsx`**

```typescript
// components/book/DatePicker.tsx
"use client";

import { cn } from "@/lib/utils";

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDayLabel(d: Date): { weekday: string; day: string } {
  return {
    weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
    day: d.toLocaleDateString("en-IN", { day: "numeric" }),
  };
}

type DatePickerProps = {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  disabledDates?: string[];
};

export function DatePicker({ selectedDate, onSelect, disabledDates = [] }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div
      role="listbox"
      aria-label="Select a date"
      className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10"
    >
      {days.map((d) => {
        const iso = toISODate(d);
        const { weekday, day } = formatDayLabel(d);
        const isSelected = iso === selectedDate;
        const isDisabled = disabledDates.includes(iso);

        return (
          <button
            key={iso}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={isDisabled}
            onClick={() => onSelect(iso)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-[6px] border px-2 py-3 font-body text-[13px] transition-all duration-150",
              isSelected
                ? "border-snap-red bg-snap-red text-white"
                : "border-snap-border bg-white text-snap-charcoal hover:border-snap-red",
              isDisabled && "cursor-not-allowed opacity-30 hover:border-snap-border"
            )}
          >
            <span className="uppercase tracking-wide opacity-70">{weekday}</span>
            <span className="font-display font-bold">{day}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Write `TimeSlots.tsx`**

```typescript
// components/book/TimeSlots.tsx
"use client";

import { cn } from "@/lib/utils";

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

type TimeSlotsProps = {
  slots: { time: string }[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  loading: boolean;
};

export function TimeSlots({ slots, selectedTime, onSelect, loading }: TimeSlotsProps) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2" aria-live="polite" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 w-24 animate-pulse rounded-[6px] bg-snap-surface" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="font-body text-[14px] text-snap-gray">
        No times available that day — try another date.
      </p>
    );
  }

  return (
    <div role="listbox" aria-label="Select a time" className="flex flex-wrap gap-2">
      {slots.map(({ time }) => {
        const isSelected = time === selectedTime;
        return (
          <button
            key={time}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(time)}
            className={cn(
              "rounded-[6px] border px-4 py-2.5 font-body text-[13px] font-medium transition-all duration-150",
              isSelected
                ? "border-snap-red bg-snap-red text-white"
                : "border-snap-border bg-white text-snap-charcoal hover:border-snap-red"
            )}
          >
            {formatTime(time)}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add components/book/DatePicker.tsx components/book/TimeSlots.tsx
git commit -m "Add DatePicker and TimeSlots components"
```

---

### Task 5: `/book` page — assembling the flow

**Files:**
- Create: `app/book/page.tsx`

**Interfaces:**
- Consumes:
  - `DatePicker` from `components/book/DatePicker.tsx` (Task 4)
  - `TimeSlots` from `components/book/TimeSlots.tsx` (Task 4)
  - `Button` from `components/ui/Button.tsx`
  - `GET /api/book/availability?date=` and `POST /api/book/submit` (Tasks 2–3)
- Produces: the page itself — no other task depends on this file.

- [ ] **Step 1: Write the page**

```typescript
// app/book/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DatePicker } from "@/components/book/DatePicker";
import { TimeSlots } from "@/components/book/TimeSlots";
import { Button } from "@/components/ui/Button";

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

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSelectedTime(null);
    setError(null);

    fetch(`/api/book/availability?date=${selectedDate}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load times");
        return res.json();
      })
      .then((data: { slots: Slot[] }) => setSlots(data.slots))
      .catch((err: Error) => {
        setError(err.message);
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
    setStep("details");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

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
```

- [ ] **Step 2: Manual verification — layout renders**

Run: `pnpm dev`, open `http://localhost:3000/book` in a browser.
Expected: page renders with dark gradient background, "Talk to the Snaprint founder" heading, 30-day date grid, `snaprints@sanskritilabs.in` fallback link visible at the bottom. Since `EA_API_KEY` isn't set yet, selecting a date will show the inline error from the availability route (expected at this stage — confirms error state renders correctly, matches the spec's fallback-always-visible requirement).

- [ ] **Step 3: Manual verification — mobile viewport**

In the browser devtools, switch to a mobile viewport (e.g. 375px wide, iPhone SE).
Expected: date grid wraps to 5 columns, no horizontal scroll, form fields and button are full-width and tappable, heading text scales down via the `clamp()`.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Lint**

Run: `npx next lint`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add app/book/page.tsx
git commit -m "Add /book page"
```

---

### Task 6: Wire up CTAs and env var documentation

**Files:**
- Modify: `components/sections/CtaFinal.tsx:74-85`
- Modify: `components/sections/MachineSpecs.tsx` (locate the `Request a Demo` link, matched by the `href="https://book.sanskritilabs.in"` text found during brainstorming)
- Create: `.env.example`

**Interfaces:**
- Consumes: `/book` route from Task 5
- Produces: nothing consumed by later tasks — this is the final integration task.

- [ ] **Step 1: Update `CtaFinal.tsx`**

Change:
```typescript
          <a
            href="https://book.sanskritilabs.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-[8px] bg-white px-9 py-4 font-display text-[14px] font-bold text-[#111110] transition-all duration-200 hover:bg-[#E63946] hover:text-white hover:-translate-y-px"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.35)" }}
          >
```
To:
```typescript
          <a
            href="/book"
            className="inline-flex items-center gap-2.5 rounded-[8px] bg-white px-9 py-4 font-display text-[14px] font-bold text-[#111110] transition-all duration-200 hover:bg-[#E63946] hover:text-white hover:-translate-y-px"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.35)" }}
          >
```

(Drops `target="_blank"` and `rel="noopener noreferrer"` since it's now in-site navigation; `href` changes from the external EA URL to `/book`.)

- [ ] **Step 2: Update `MachineSpecs.tsx`**

Find the `Request a Demo` link (identified during brainstorming at `components/sections/MachineSpecs.tsx:166`, near the `"Want to see the S1 in action?"` copy at line 160). Apply the same change as Step 1: replace its `href="https://book.sanskritilabs.in"` with `href="/book"`, and remove `target="_blank"`/`rel="noopener noreferrer"` if present on that link.

- [ ] **Step 3: Create `.env.example`**

```
# Easy!Appointments API key — generate in the EA admin panel under
# Settings > API > Generate. Required for /api/book/* routes.
EA_API_KEY=

# Optional override; defaults to https://book.sanskritilabs.in if unset.
# EA_BASE_URL=
```

- [ ] **Step 4: Manual verification**

Run: `pnpm dev`, open `http://localhost:3000/`, click both "Book a Demo" CTAs (hero/final CTA section and the machine specs section).
Expected: both navigate to `/book` within the same tab (no new tab opens), and the page loads correctly.

- [ ] **Step 5: Typecheck and lint**

Run: `npx tsc --noEmit && npx next lint`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add components/sections/CtaFinal.tsx components/sections/MachineSpecs.tsx .env.example
git commit -m "Point Book a Demo CTAs at native /book page"
```

---

### Task 7: Production deploy prerequisite (manual, non-code)

This task has no file changes — it's the operational step needed before `/book` works in production. Include it in execution tracking since the feature isn't actually functional without it.

- [ ] **Step 1:** In the Easy!Appointments admin panel (`https://book.sanskritilabs.in`, admin login), go to **Settings → API**, generate a fresh API key (regenerate if the previously-shared one — `RpvpKpORFrMExt6JgeGj0QjB3SPDjaVR` — hasn't already been rotated; treat that value as compromised regardless).
- [ ] **Step 2:** Add it to Vercel: `vercel env add EA_API_KEY production` (paste the key when prompted), then repeat for `preview` and `development` environments if EA should be reachable from preview deploys too.
- [ ] **Step 3:** Redeploy (`vercel deploy --prod`) so the new env var is picked up.
- [ ] **Step 4:** Manually verify on the live site: visit `https://snaprints.com/book`, complete a real test booking, confirm it appears in the EA admin calendar and the EA confirmation email arrives.

---

## Self-Review Notes

- **Spec coverage:** page + routes (spec's Architecture section) → Tasks 1–5; error handling + email fallback (spec's Flow section) → Task 5; env var / key handling (spec's Data & secrets section) → Tasks 1, 6, 7; CTA link updates (spec's Site changes section) → Task 6. All spec sections have a corresponding task.
- **Open verification item from the spec** (EA's exact API response shape unconfirmed) is carried into Task 1's docstring-equivalent note and Task 7's live verification step — implementer must adjust `lib/easyAppointments.ts` if the real EA instance's JSON shape differs from what's assumed.
- **Type consistency checked:** `Slot = { time: string }` used identically in Task 1 (`lib/easyAppointments.ts`), Task 2 (route response), Task 4 (`TimeSlots` props), Task 5 (page state). `createAppointment`'s input fields (`name, email, phone, date, time`) match the submit route's body parsing (Task 3) and the page's fetch body (Task 5).
