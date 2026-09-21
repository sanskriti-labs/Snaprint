# GSC API Setup  --  OAuth credentials + Vercel Cron

The script `scripts/seo/gsc-export.mjs` pulls Google Search Console data via the Search Analytics API and writes daily JSON to `reports/gsc-YYYY-MM-DD.json`. It needs three OAuth2 credentials from Google Cloud, plus a Vercel Cron trigger to fire it once a day.

This doc walks through obtaining each piece.

---

## 1. Create OAuth2 Client ID

1. Go to **https://console.cloud.google.com/**
2. Select the Sanskriti Labs project (or create one if you haven't yet  --  name it `sanskriti-labs`).
3. Enable the API:
   - Hamburger menu → **APIs & Services → Library**
   - Search **"Google Search Console API"**
   - Click → **Enable**
4. Configure the OAuth consent screen (one-time):
   - **APIs & Services → OAuth consent screen**
   - User type: **External** (since snaprints.com is a public product)
   - App name: `Snaprint GSC Export`
   - User support email: snaprints@sanskritilabs.in
   - Scopes: leave default (we only use `openid email profile` + GSC scopes)
   - Test users: add your own email so you can mint a refresh token while the app is in "Testing" mode
5. Create the client ID:
   - **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `snaprint-gsc-export`
   - Authorized redirect URIs: `https://developers.google.com/oauthplayground` (we use the OAuth Playground below)
   - Click **Create**
6. Copy the **Client ID** and **Client Secret**  --  these become `GSC_CLIENT_ID` and `GSC_CLIENT_SECRET`.

---

## 2. Get a refresh token via OAuth Playground

1. Visit **https://developers.google.com/oauthplayground**
2. Click the gear icon (top-right) → **Use your own OAuth credentials**
   - Paste the Client ID and Client Secret from step 1.
3. In the left panel, scroll to **"Search Console API v1"** → check **`https://www.googleapis.com/auth/webmasters.readonly`**.
4. Click **"Authorize APIs"** → sign in with the Sanskriti Labs account that owns the Search Console property for `snaprints.com`.
5. On the next screen, click **"Exchange authorization code for tokens"**.
6. The response contains an **`access_token`** (short-lived, ignore) and a **`refresh_token`** (long-lived  --  this is what you want).
7. Copy the **`refresh_token`** value.

---

## 3. Add env vars to Vercel

Add three env vars to the Vercel project:

```bash
vercel env add GSC_REFRESH_TOKEN production
vercel env add GSC_CLIENT_ID production
vercel env add GSC_CLIENT_SECRET production
```

(Or via the dashboard: **Project → Settings → Environment Variables**.)

Optionally also set `GSC_SITE_URL` if you ever switch domains. Default is `sc-domain:snaprints.com`.

After adding, **redeploy** so the Vercel function bundle sees the new env vars.

---

## 4. Set up Vercel Cron

`vercel.json` (project root) declares cron schedules. The repo does not yet have one  --  the new file looks like:

```json
{
  "crons": [
    { "path": "/api/cron/gsc-export", "schedule": "0 3 * * *" }
  ]
}
```

This fires `app/api/cron/gsc-export/route.ts` once a day at 03:00 UTC (08:30 IST).

The route spawns `node scripts/seo/gsc-export.mjs` server-side. On Vercel, the only writable path is `/tmp`, which doesn't survive past the invocation  --  so the script also prints the full report as a `GSC_REPORT_JSON=...` line on stdout, and the route parses that out and returns it as `{ ok: true, exitCode: 0, report: {...} }`. Locally (or anywhere `VERCEL` isn't set), the script writes to the repo's gitignored `reports/gsc-YYYY-MM-DD.json` as well.

Set the cron secret env var:

```bash
vercel env add CRON_SECRET production
# paste a long random string  --  e.g. `openssl rand -hex 32`
```

The route checks `Authorization: Bearer ${CRON_SECRET}`. Vercel signs every cron call with this header automatically once you set it.

### Optional: skip the API route, run the script directly

If you'd rather not have the API-route indirection, you can have the Vercel Cron point at the script directly. **But** Vercel Cron currently only hits HTTP endpoints  --  `path:` must be a route, not a script path. The route we ship spawns the script as a child process. That's the canonical pattern.

---

## 5. Verify

After deploying:

1. Wait for the next 03:00 UTC tick (or trigger manually via **Project → Settings → Crons → Run now** if you have a Hobby plan with that feature).
2. Check the deployment logs for `[gsc-export] OK  --  fetched N rows`.
3. Hit the route's response body directly (or check the function's log output)  --  it includes the full report under `report`. There's no deployment artifact to pull; `/tmp` on Vercel doesn't persist past the invocation.

---

## Troubleshooting

### "redirect_uri_mismatch"

You didn't add `https://developers.google.com/oauthplayground` to the Authorized redirect URIs. Go back to step 1 and add it.

### "access_denied" in OAuth Playground

Your Google account is not the owner of the GSC property for `sc-domain:snaprints.com`. Add yourself as a user at Search Console → Settings → Users and permissions → Add user.

### "Insufficient Permission" when the script runs

The OAuth client is missing the `webmasters.readonly` scope. Re-do step 2, checking that scope in the Playground.

### "Invalid grant" on token refresh

The refresh token has been revoked or expired (long disuse, password change, etc.). Re-do step 2 to mint a new refresh token and update `GSC_REFRESH_TOKEN`.

### Cron returns 401

`CRON_SECRET` is not set on Vercel, or Vercel's cron signing header is missing. The route enforces `Authorization: Bearer ${CRON_SECRET}`  --  Vercel signs the call automatically only if `CRON_SECRET` is configured in the project.

### Cron returns 500 with "spawn ENOENT"

The Node binary isn't on `$PATH` inside the function. Vercel's default Node runtime includes it; this error usually means the runtime is Edge instead of Node. Set the route to Node:

```ts
export const runtime = "nodejs";
```

(Add to `app/api/cron/gsc-export/route.ts`.)
