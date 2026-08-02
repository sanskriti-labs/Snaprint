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
