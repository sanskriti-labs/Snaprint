# Product Hunt Launch Plan  --  Snaprint

Last updated: 2026-09-18. Written for high-DR distribution (Product Hunt, Hacker News,
Indie Hackers) per the team's decision to prioritize these over the India-directory list
in `directories.md` for now.

## Reality check first

Product Hunt's audience is SaaS/dev-tool-heavy. Snaprint is a physical kiosk + India-local
franchise business  --  a real but less common category there. Two things are still true
despite that:

1. **The listing itself is a permanent page on a very high-authority domain**, indexed and
   citable  --  that's real GEO/entity value (AI engines cite PH listings) even if the launch
   doesn't hit the front page. The outbound "visit website" link on PH product pages carries
   `rel="noopener"` but not `nofollow` for the primary site link as of PH's current markup  -- 
   verify at submission time since platforms change this without announcing it.
2. **"Hardware" and India-focused submissions do exist and place reasonably**  --  the bar isn't
   "be a SaaS app," it's "have a coherent product page, real visuals, and a founder who
   engages in comments all day." Don't expect front-page #1; a respectable placement plus
   the permanent listing is still worth doing.

**Verify before launch:** PH's actual current link/nofollow policy and category structure
change over time  --  check `producthunt.com` directly when you're 1–2 weeks out, don't rely on
this document's specifics going stale.

## Hard block: what's missing right now

Per the readiness checklist, PH (and DevHunt/BetaList as backups) expect **5–8 real product
screenshots + a 60–90s demo video**. Current asset inventory in `public/`:

- `public/kiosks/gtc-bangalore.png`  --  1 real installed-kiosk photo
- `public/kiosks/lakshmi-print-hyderabad.png`  --  1 real installed-kiosk photo
- Founder photos (`public/founders/`), mascot art (`public/mascot/`)  --  not product screenshots

**That's 2 of the 5–8 needed.** Before this launch is submittable, you need:

- 3–6 more real photos: kiosk in different shop settings, the touch-display UI mid-order,
  the owner dashboard/app, someone scanning the QR and paying via UPI
- A 60–90s screen-and-hardware demo video (phone scan → upload → pay → print → collect)
- Gallery gallery images sized 1270×760 for the PH gallery slots

This is the single blocking item. Everything else below can be drafted now and slotted in
once the visuals exist.

## Tagline (rotate-test a few, ≤60 chars)

1. "Turn any xerox shop into a 24/7 self-service print kiosk"
2. "Self-service print kiosks Indian shop owners own outright"
3. "Scan, pay, print  --  no counter, no app, no queue"

## 260-character description

> Snaprint is a self-service print kiosk that fits inside an existing xerox or stationery
> shop. Customers scan a QR, upload from their phone, pay via UPI, and collect in under a
> minute  --  even when the shop's closed. Built in Bengaluru, owned outright by the shop owner.

## Category

Primary: **Hardware**. Secondary if PH allows multiple: **India** (regional tag, if it
exists as a topic) or **Fintech** (for the UPI payment angle)  --  check current PH topic list
at submission time, topics get renamed/merged periodically.

## First comment (post as the maker, not marketing copy)

> Hey Product Hunt  --  Abhishek here, one of the two people building Snaprint out of Bengaluru.
>
> The idea started from something boring and unsexy: xerox shops. Every one of them already
> runs an informal "WhatsApp me the PDF, I'll print it, come by in 20 minutes" workflow  -- 
> real transaction volume, completely untracked, and lost the moment the shop closes or gets
> busy. We built a kiosk that turns that into a paid, self-service order the shop owner keeps
> running 24/7 without being behind the counter.
>
> This is our first real public launch. Genuinely want your honest take  --  especially if
> anything about the pitch, the pricing model (one-time purchase, no per-print commission),
> or the "why would a shop owner want this" case doesn't land. Happy to answer anything.

(Matches the "ask for feedback, not upvotes" rule  --  PH's algorithm reportedly weights comment
quality over raw upvote count.)

## Customer first comment (line up in advance)

Ask one existing shop-owner partner (or the strongest testimonial contact) to leave a short,
specific comment the morning of launch  --  "we installed one at [shop], captures the
after-hours orders we used to lose" reads far better than a generic "cool product!"

## Pre-launch checklist (compress the usual 21-day warm-up given current timeline)

- [ ] Close the visual-asset gap above  --  this is the actual blocker, not the copy
- [ ] Create the PH "Upcoming" page 1–2 weeks out to collect notify-on-launch subscribers
- [ ] Both founders (Goutham, Abhishek) should have active PH maker accounts  --  upvote/comment
      on a few launches in the days before so the accounts aren't brand-new on launch day
- [ ] Line up 3–5 people (shop-owner partners, friends, early supporters) who'll leave
      genuine comments in the first 2 hours  --  this is the 50-supporter threshold that
      triggers PH's algorithmic distribution
- [ ] Launch Tue/Wed/Thu at 12:01 AM Pacific (= 12:31 PM IST)  --  weekend launches get
      60–70% less traffic per the general playbook
- [ ] Have `india-informal-retail-nobody-builds-for.mdx` ready to link in comments/replies  -- 
      it's the right "why we built this" piece for a PH audience already
- [ ] Post-launch: cross-post the launch (not a sales pitch  --  the story) to r/StartUpIndia,
      r/IndianStartups, and Indie Hackers within 24–48 hours while there's momentum

## What to do with `india-informal-retail-nobody-builds-for.mdx`

This post is already exactly the asset a PH/HN/Indie Hackers audience responds to  --  a
founder-voice "here's a boring category nobody built for, here's what building it taught us"
essay, not a sales page. It's currently only reachable via `/blog` and isn't linked from
Navbar/Footer. Before the PH launch:

1. Confirm it's live and indexed (`site:snaprints.com "original dark stores"` in Google)
2. Have the URL ready to drop in PH comments and any HN/Reddit cross-post
3. Consider a genuine Show HN submission ("Show HN: We built self-service print kiosks for
   India's xerox shops") pointing at this post or the homepage  --  separate from PH, same week
   or the week after so they don't cannibalize each other's momentum

## Fix while you're in here (unrelated but found during this pass)

Two blog posts link to `/pricing`, which doesn't exist as a route
(`xerox-shop-investment-cost-india.mdx` and `xerox-shop-franchise-cost-india.mdx`)  --  likely
should point to `/franchise` or `/#pricing`. Worth fixing before driving traffic here from a
PH launch; a 404 on an inbound-linked page wastes exactly the traffic you're trying to earn.
