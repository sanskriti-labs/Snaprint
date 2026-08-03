// app/api/book/providers/route.ts
import { NextResponse } from "next/server";
import { getAvailableProviders, EAApiError } from "@/lib/easyAppointments";

export async function GET() {
  try {
    const providers = await getAvailableProviders();
    return NextResponse.json({ providers });
  } catch (err) {
    const message = err instanceof EAApiError ? err.message : "Unexpected error";
    console.error("[book/providers] failed to list providers:", message);
    return NextResponse.json(
      { error: "We couldn't load founders right now — please email us." },
      { status: 502 }
    );
  }
}