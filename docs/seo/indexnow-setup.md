# IndexNow Setup  --  key file + Vercel Cron

[IndexNow](https://www.indexnow.org/documentation) lets us push URLs to Bing,
Yandex, and other participating search engines the moment a page is
created/updated, instead of waiting for their crawler to rediscover it.
**Google does not support IndexNow**  --  this only speeds up Bing/Yandex;
Google indexing still goes through sitemap.xml + Search Console.

The script `scripts/seo/indexnow-submit.mjs` fetches the live
`https://snaprints.com/sitemap.xml`, extracts every `<loc>`, and POSTs the
full list to the IndexNow API. It reads from the deployed sitemap (rather
than re-deriving the URL list from `content/pseo/seo.ts`) so it can never
drift out of sync with what's actually published  --  see `lib/site-urls.ts`,
which is the single source of truth `app/sitemap.ts` itself reads from.

---

## 1. Key file (already done)

IndexNow requires a verification file at `https://<domain>/<key>.txt`
containing the key. This repo already has:

```
public/6d5e4dde8981c3ea5feeb1ea205345bd.txt   (contents: the key itself)
```

If the key ever needs to be rotated, generate a new one and replace **both**
the file and the `INDEXNOW_KEY` env var together  --  they must match:

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## 2. Env vars

```bash
vercel env add INDEXNOW_KEY production
# value: 6d5e4dde8981c3ea5feeb1ea205345bd (same key as the .txt file above)
```

`CRON_SECRET` is already required by the existing `gsc-export` cron
(see `docs/seo/gsc-api-setup.md`) and is reused here  --  no separate secret
needed. Confirm it's set for this project too:

```bash
vercel env add CRON_SECRET production
```

## 3. Vercel Cron

Wired in `vercel.json`:

```json
{ "path": "/api/cron/indexnow", "schedule": "0 4 * * *" }
```

Runs daily at 04:00 UTC (1 hour after the GSC export, to keep cron load
staggered). Vercel signs the request with
`Authorization: Bearer $CRON_SECRET`, which `app/api/cron/indexnow/route.ts`
verifies before spawning `scripts/seo/indexnow-submit.mjs`.

## 4. Manual / one-off submission

To push the current sitemap right now (e.g. right after a big PSEO batch
lands), run locally with the env var set:

```bash
INDEXNOW_KEY=6d5e4dde8981c3ea5feeb1ea205345bd node scripts/seo/indexnow-submit.mjs
```

Or trigger the deployed cron route directly:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://snaprints.com/api/cron/indexnow
```

## Verification

- [Bing Webmaster Tools → IndexNow](https://www.bing.com/webmasters/indexnow) shows submission history and status once the domain is verified there.
- A `200`/`202` response from the API means the batch was accepted  --  it does not guarantee immediate indexing, just faster crawl scheduling.

## Common issues

| Issue | Fix |
|-------|-----|
| `INDEXNOW_KEY` missing | Set the env var; script exits with code 2 and a reminder to check this doc |
| Key mismatch | The value of `INDEXNOW_KEY` must exactly match the contents of `public/<key>.txt` and the filename itself |
| Empty sitemap | Script refuses to submit an empty URL batch  --  check `https://snaprints.com/sitemap.xml` is returning XML, not HTML (see `seo-sitemap` skill §10) |
