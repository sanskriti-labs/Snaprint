import { NextResponse } from "next/server";
import { runIndexNowSync } from "@/lib/indexnow";

/**
 * Vercel Cron entry point. Vercel automatically signs the request with
 * `Authorization: Bearer ${CRON_SECRET}` once that env var is set on the
 * project  --  see docs/seo/indexnow-setup.md.
 *
 * Runs the sync in-process (see lib/indexnow.ts for why this replaced
 * spawning scripts/seo/indexnow-submit.mjs as a child process).
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runIndexNowSync();
  console.log(`[indexnow route] ok=${result.ok} urlCount=${result.urlCount} skipped=${result.skipped}${result.error ? ` error=${result.error}` : ""}`);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
