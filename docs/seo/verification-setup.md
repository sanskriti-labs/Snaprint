# Search Console Verification Setup

Both Google Search Console and Bing Webmaster Tools verify ownership of `snaprints.com` via a `<meta>` tag whose `content="..."` value Next.js picks up at build time from an env var. This file walks through obtaining both codes.

The code itself (`app/layout.tsx`) already supports both — see the `verification` block:

```ts
verification: {
  google: process.env.GOOGLE_SITE_VERIFICATION,
  bing: process.env.BING_SITE_VERIFICATION,
},
```

You only need to do the steps below; no further code change is required.

---

## Google Search Console

1. Visit **https://search.google.com/search-console**
2. Click **"Add property"** (top-left dropdown).
3. Choose **"URL prefix"** tab.
4. Enter `https://snaprints.com` (exact, no trailing slash).
5. Click **"Continue"**.
6. The verification methods panel appears — choose **"HTML tag"**.
7. Google shows a snippet like:
   ```html
   <meta name="google-site-verification" content="abc123XYZ_LONG_STRING" />
   ```
8. Copy **only** the `content="..."` value (the long string inside the quotes). Not the full tag.
9. Add as a Vercel env var:
   ```bash
   vercel env add GOOGLE_SITE_VERIFICATION production
   # paste the value when prompted
   ```
   Or via the dashboard: **Project → Settings → Environment Variables → Add**.
   - Name: `GOOGLE_SITE_VERIFICATION`
   - Value: the long string
   - Environment: Production (also Preview and Development if you want GSC data for those URLs)
10. **Redeploy** the production branch. After redeploy, the `<head>` of `https://snaprints.com` contains the meta tag.
11. Back in Search Console, click **"Verify"**. Status should turn to "Ownership verified".

If you skip the redeploy, the meta tag is not present in the rendered HTML and verification will fail with "Verification token not found".

---

## Bing Webmaster Tools

1. Visit **https://www.bing.com/webmasters**
2. Sign in with a Microsoft account (the Sanskriti Labs Microsoft 365 account, or a personal one — Bing does not require a specific email domain).
3. Click **"Add a site"**.
4. Enter `https://snaprints.com` (or the bare domain — Bing accepts both `domain:` and `https://`).
5. Bing offers three verification methods — choose **"Meta tag"**.
6. Bing shows a snippet like:
   ```html
   <meta name="msvalidate.01" content="ABC123XYZ_LONG_STRING" />
   ```
7. Copy **only** the `content="..."` value.
8. Add as a Vercel env var:
   - Name: `BING_SITE_VERIFICATION`
   - Value: the long string
   - Environment: Production (Preview + Development optional)
9. **Redeploy**.
10. Back in Bing Webmaster, click **"Verify"**.

---

## After verification

Once both are verified:

- **Google Search Console** → submit the sitemap at `https://snaprints.com/sitemap.xml` (Settings → Sitemaps → Add).
- **Bing Webmaster Tools** → submit the same sitemap (Settings → Sitemaps → Submit).
- **Google Search Console** → run URL Inspection on the homepage to force a fresh crawl (this speeds up initial indexing).
- **Bing Webmaster Tools** → same, via the URL Inspection tool.

---

## Troubleshooting

### "Verification token not found" (Google)

- The meta tag was added to the env var but Next.js was **not redeployed** after the env var change. Redeploy.
- The env var name has a typo — must be exactly `GOOGLE_SITE_VERIFICATION` (uppercase).
- The `<head>` is being overridden by another layout. Check `view-source:https://snaprints.com` — the tag must be in the rendered HTML, not just the source.

### "Verification failed" (Bing)

- Same as above — most Bing failures are missing-redeploy issues.
- The domain is registered in Bing Webmaster with a trailing slash (`https://snaprints.com/`) but the rendered HTML uses the no-slash version. Pick one and stick with it; we use no-slash.

### "Property already exists"

- Someone on the team already verified the site under their Google/Microsoft account. Ask them to add you as a delegated owner: Search Console → Settings → Users and permissions → Add user.

### DNS verification as a fallback

Both Google and Bing support **DNS TXT record** verification as an alternative. Useful if the meta tag keeps failing:

- Google: Settings → Ownership verification → DNS record. Add a TXT record at `snaprints.com` with the value Google provides.
- Bing: Settings → Verify ownership → DNS. Same flow.

DNS verification is more durable (env-var changes do not break it) but takes longer to propagate. Use as a fallback, not a first choice.

---

## Once verified

Move on to Phase 6.2 — `scripts/seo/gsc-export.mjs` pulls data from the Search Console API and writes daily JSON exports. That setup is documented in `docs/seo/gsc-api-setup.md`.
