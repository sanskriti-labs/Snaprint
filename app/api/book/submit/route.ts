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

  const { name, email, phone, date, time, providerId } = (body ?? {}) as Record<string, unknown>;

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
