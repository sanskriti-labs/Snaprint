# Questions before publishing the blog posts

The 5 draft posts in `content/blog/` were written based on copy already in `components/sections/*.tsx` and `README.md` — but that marketing copy may itself be placeholder/prototype content, not how the business actually runs today. Answer inline (or tell me which are wrong) and I'll update the posts.

---

## 1. Business model — is it a franchise at all?

The posts (and the existing site copy in `components/sections/Franchise.tsx`) describe this as: shop owner pays **₹3 lakh one-time**, owns the machine, Snaprint takes **no per-print commission**, only a small recurring **platform/software fee**.

- [ ] Is this the real, current pricing model — or was `Franchise.tsx` a placeholder/concept from before the business model was finalized?
- If real: what is the actual **monthly platform fee** amount? (Not stated anywhere in the codebase — the posts avoid inventing a number, but a pricing post that never states the recurring fee is incomplete.)
- Is ₹3,00,000 the current, correct all-in price today? Any GST treatment to add (₹3L + GST, or inclusive)?
- Is it truly **one flat tier** ("Snaprint S1 Standard"), or are there multiple hardware/pricing tiers (like a Mini/Pro split)? The posts only describe one tier.

## 2. The "founding partner offer"

`snaprint-franchise-print-kiosk-investment.mdx` mentions: **first 10 partners in Bengaluru**, ₹30,000 cashback after 500 prints in month one, priority support, network map spot, co-branded signage.

- [ ] Is this offer still active / still true? (This is the kind of time-limited claim that goes stale fast and shouldn't be published if it's expired or was never real.)
- If it's outdated or aspirational copy, should I remove this section entirely?

## 3. Revenue estimate table

The franchise post includes an **illustrative** earnings table (500 prints/day → ₹12,500/month; 1,000 prints/day → ₹25,000/month), explicitly labeled as an estimate, not a guarantee.

- [ ] Are these numbers in the right ballpark, or should I remove/adjust them? Overstated earnings estimates in kiosk-franchise marketing are a common source of partner complaints later — worth getting right or leaving out.

## 4. Hardware specs

Posts state: **2000-sheet paper capacity**, **15.6" touch display**, **works with existing Canon/HP/Epson/Brother printers** (Snaprint doesn't force a hardware swap), **60 seconds** scan-to-print time.

- [ ] Are these specs accurate for the actual S1 kiosk being sold/deployed today?
- [ ] Is "works with your existing printer" actually correct — i.e., is Snaprint a **software/payment layer bolted onto a shop's own printer**, or does Snaprint supply/require its own dedicated printer hardware? This is a fairly important distinction the whole franchise pitch depends on, and I want to confirm it's not a prototype-era detail.

## 5. Support window

Posts state **"6 months of software support included"** after which — what happens? Paid support plan? Included indefinitely? Not specified anywhere, so I left it vague ("support during the included window") — needs a real answer for anything published.

## 6. Launch timeline

Posts state: apply → site visit (~30 min) → one-page agreement → **live within 7 days of payment**.

- [ ] Is 7 days realistic today given actual installation capacity, or is this aspirational?

## 7. Consumer pricing (per-page rates)

`snaprint-print-copy-scan-pricing.mdx` is careful to say Snaprint does **not** set consumer per-page prices — the **host shop owner** sets their own rate, and Snaprint just standardizes the payment/UX layer. The "typical rate ranges" table (₹1–3/page B&W, ₹8–20/page color, etc.) is labeled explicitly as **general Indian market context, not a Snaprint price list**.

- [ ] Is it correct that Snaprint has zero involvement in setting the end-customer's per-page price? (If Snaprint actually does dictate/suggest a standard rate card, this whole post's framing needs to change.)

## 8. Contact channel

All 5 posts CTA to either `mailto:snaprints@sanskritilabs.in` or `https://wa.me/919999999999` (the WhatsApp number).

- [ ] Per the README's own "before going live" checklist, `919999999999` is a **known placeholder** — what's the real WhatsApp number to use?
- [ ] Confirm `snaprints@sanskritilabs.in` is the correct live inbox (it matches your account email, so likely yes — just confirming).

## 9. Licensing/legal claims (India-specific)

The "how to start a xerox shop" post lists a generic checklist: Shop Act registration, GST (if applicable), trade licence, Udyam registration — deliberately vague on thresholds since I didn't want to fabricate a specific GST turnover limit or state-specific rule.

- [ ] No action needed unless you want this section to be more specific/authoritative — happy to tighten it if you have real numbers, but generic + accurate is safer than specific + wrong here.

## 10. Franchise vs. software-only positioning

Posts consistently frame this as: **"your shop, not a booth"** — i.e., Snaprint kiosks live inside an existing xerox/stationery shop, not as standalone street kiosks.

- [ ] Is that the actual go-to-market motion (embed into existing shops) — or is Snaprint also/instead placing standalone kiosks in malls, colleges, office lobbies, etc., independent of an existing shop? This changes the target reader for 3 of the 5 posts (franchise post, "how to start a xerox shop," low-investment-franchise post all assume "you already have or are opening a shop").

---

### How to answer

Easiest: reply inline under each checkbox, or just tell me which numbers/claims are wrong and what the correct ones are. I won't publish/deploy anything until these are resolved — the posts currently live only in `content/blog/` on your local branch, nothing is pushed or live yet.
