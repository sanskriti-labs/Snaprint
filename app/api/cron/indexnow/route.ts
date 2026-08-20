import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";

// Use Node.js runtime so `spawn("node", ...)` works (Edge runtime lacks child_process).
export const runtime = "nodejs";

/**
 * Vercel Cron entry point. Vercel automatically signs the request with
 * `Authorization: Bearer ${CRON_SECRET}` once that env var is set on the
 * project — see docs/seo/indexnow-setup.md.
 *
 * We verify the bearer token before doing anything else, then spawn the
 * `scripts/seo/indexnow-submit.mjs` script as a child process and stream
 * the exit code back to Vercel's cron monitor.
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const scriptPath = path.join(process.cwd(), "scripts/seo/indexnow-submit.mjs");
  const child = spawn("node", [scriptPath], {
    env: { ...process.env, SITE_URL: "https://snaprints.com" },
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk: Buffer) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });

  return new Promise<Response>((resolve) => {
    child.on("error", (err: Error) => {
      resolve(
        NextResponse.json(
          { ok: false, error: err.message },
          { status: 500 }
        )
      );
    });
    child.on("close", (code: number | null) => {
      const marker = "INDEXNOW_REPORT_JSON=";
      const line = stdout.split("\n").find((l) => l.startsWith(marker));
      const report = line ? JSON.parse(line.slice(marker.length)) : null;
      // Surface a summary in Vercel's function logs — see gsc-export route
      // for why this is needed (child stdout doesn't reach parent console).
      console.log(`[indexnow route] exitCode=${code} urlCount=${report?.urlCount ?? "n/a"}`);
      if (code !== 0) console.error(`[indexnow route] stderr: ${stderr}`);
      resolve(
        NextResponse.json(
          { ok: code === 0, exitCode: code, report, log: stdout, error: code === 0 ? undefined : stderr },
          { status: code === 0 ? 200 : 500 }
        )
      );
    });
  });
}
