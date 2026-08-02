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
    console.error("[book/availability] failed to fetch available slots:", message);
    return NextResponse.json(
      { error: "We couldn't load available times right now — please email us." },
      { status: 502 }
    );
  }
}
