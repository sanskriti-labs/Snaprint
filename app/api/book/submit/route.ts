import { NextRequest, NextResponse } from "next/server";
import { createAppointment, getAvailableSlots, EAApiError } from "@/lib/easyAppointments";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[^\d[\]{}<>]{1,120}$/;
const PHONE_RE = /^[+0-9 ()\-]{6,32}$/;
const MAX_BODY_BYTES = 8 * 1024;

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) {
    return NextResponse.json({ error: "Origin required" }, { status: 403 });
  }
  try {
    if (new URL(origin).host !== host) {
      return NextResponse.json({ error: "Cross-origin forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid Origin header" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, email, phone, date, time, providerId } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !NAME_RE.test(name.trim())) {
    return NextResponse.json(
      { error: "A valid 'name' (letters, 1-120 chars) is required" },
      { status: 400 }
    );
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid 'email' is required" }, { status: 400 });
  }
  if (typeof phone !== "string" || !PHONE_RE.test(phone.trim())) {
    return NextResponse.json({ error: "A valid 'phone' is required" }, { status: 400 });
  }
  if (typeof date !== "string" || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "'date' must be YYYY-MM-DD" }, { status: 400 });
  }
  if (typeof time !== "string" || !TIME_RE.test(time)) {
    return NextResponse.json({ error: "'time' must be HH:mm" }, { status: 400 });
  }
  if (typeof providerId !== "number" || !Number.isInteger(providerId)) {
    return NextResponse.json({ error: "'providerId' must be an integer" }, { status: 400 });
  }

  // Reject past dates server-side regardless of what the UI sends — the client's
  // notion of "today" can be stale (cached page, tampered request, clock skew).
  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
  if (date < todayISO) {
    return NextResponse.json({ error: "'date' cannot be in the past" }, { status: 400 });
  }

  try {
    // Re-verify the slot is still available immediately before booking, to
    // narrow the window for concurrent requests double-booking the same slot.
    const slots = await getAvailableSlots(date);
    if (!slots.some((s) => s.time === time && s.providerId === providerId)) {
      return NextResponse.json(
        { error: "That time is no longer available — please pick another." },
        { status: 409 }
      );
    }
    const result = await createAppointment({ name, email, phone, date, time, providerId });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof EAApiError ? err.message : "Unexpected error";
    console.error("[book/submit] failed to create appointment:", message);
    return NextResponse.json(
      { error: "We couldn't complete your booking — please email us and we'll sort it out." },
      { status: 502 }
    );
  }
}
