# Pixel Homepage — Build Plan (for approval)

Status: **plan only, nothing built yet.** This branch exists because this repo is the wrong home. The real build should go in its own repo (see Decisions).

---

## 1. Context: The Million Dollar Homepage (2005)

- Made by Alex Tew, a 21-year-old UK student, to pay for university. Launched 26 Aug 2005.
- One page holding a 1000×1000 pixel image. Space sold at **$1 per pixel in 10×10 blocks**, so the cheapest buy was **$100**. Buyers could take several adjacent blocks to fit a bigger logo.
- Each buyer supplied **an image, a link URL and a hover slogan**. Blocks were promised to stay up for **at least five years** (it's still online).
- Friends and family bought the first ~1,000 pixels. Tew spent that money on a press release. BBC, Guardian and Register coverage made it snowball. Early buyers included The Times and Orange.
- A quarter was sold by the end of September ($250k). It sold out in about 138 days. The last 1,000 pixels went on eBay for $38,100, for a total of **$1,037,100**.
- During that auction, extortionists hit it with a **DDoS attack** and asked for $5k, then $50k. Tew refused. The site was down for about a week while the FBI and local police got involved.
- **Link rot:** in 2014, 22% of the links were dead. 23,200 pixels were dead from day one because buyers never gave a URL. A 2017 Harvard study found 547 unreachable links.

### What it was like to *buy* (from the accounts I could find)

- **Simple and quick.** You picked a spot, sent an image, a URL and a slogan, and paid. A UX retrospective puts the success down to that simplicity.
- **Choosing your spot mattered.** Buyers picked where they went and who their neighbours were. That gave them a sense of owning a piece of the page.
- **Locked once placed.** The original FAQ said: you can change the image only if your site has a "major change", and **no refunds** once a block is accepted and on the page.
- **Content was moderated.** No obscene or offensive images, so a person checked each one before it went live.
- **The return was mostly novelty and press, not clicks.** One case study, published by Tew, says a 100-pixel buyer saw traffic jump 100× and pitched for £18k of work in 4 days. Other accounts point the other way. Marketers doubted buyers got their money's worth from the untargeted traffic. A later owner saw 28 referrals in a few weeks. Commenters say buyers with big blocks or catchy logos did best, and that a "dull logo" didn't get clicked even at 500 pixels. People bought for ads, to own a bit of internet history, or to show off.
- **Long tail:** the promise ended at the pixel. If your domain lapsed, your block pointed at whoever owns the domain now. One later owner of a domain listed on the page found they couldn't change its pixels.

> Caveat: this environment couldn't open the source pages directly (network policy), so these points come from search-engine summaries of Wikipedia, TechSpot, Quartz, Harvard LIL, Entrepreneur, The Register, NamePros and others. I found no detailed first-hand buyer diary. Steps not documented (exact payment provider, how long buyers waited for placement) are **not** stated as fact here.

---

## 2. Plan v1 (first draft)

1. New page `pixels.html` on brynwhyman.com with a 1000×1000 canvas.
2. Every block bought is an `<img>` absolutely positioned on the grid, wrapped in an `<a>` with a `title` for the hover slogan.
3. Buy flow: click blocks to select them → form for image, URL and slogan → Stripe Checkout.
4. Backend: a Node/Express server with Postgres to store blocks and handle Stripe webhooks. The image goes live as soon as payment succeeds.
5. Price: $1/pixel, 10×10 minimum, like the original.

---

## 3. Review of v1: flaws and improvements

| # | Problem in v1 | Why it matters | Fix in v2 |
|---|---|---|---|
| 1 | Lives in this repo / on the personal homepage | You flagged it's the wrong repo. Mixing a commerce app into a static portfolio couples their uptime and deploys. | Separate repo and subdomain or domain. The homepage just links to it as a "Thing I've made". |
| 2 | Express + Postgres server | It's a server to patch, pay for and keep up for "forever". It goes against the repo's plain HTML, no-build-step style. | Static front end plus one small serverless function (Cloudflare Worker + D1 + R2). Close to zero cost when idle. |
| 3 | No protection against two people buying the same block | Two checkouts at once could both pay for the same pixels: a double sale and a refund mess. | Server-side **hold** with a 15-minute expiry. A unique constraint per cell in the DB. The webhook confirms only if the hold is still valid, otherwise it auto-refunds. |
| 4 | Click-to-select individual blocks | Painful for a 6×4 logo. Non-rectangular shapes make fitting the image ambiguous. | **Drag a rectangle** that snaps to the 10px grid. Live price and size readout. Taken blocks greyed out. Rectangles only. |
| 5 | Upload with no preview | Buyers cared about placement and neighbours. A logo squashed into the wrong aspect ratio is a bad buy. | Client-side crop and resize to the exact pixel size, plus a **live preview on the real canvas** next to the neighbours, before paying. |
| 6 | Goes live on payment | The original moderated content. Instant publishing invites porn, scams, malware links and copyrighted logos on your name. | Paid → **pending review**. Bryn gets an approve/reject link by email. Rejecting refunds automatically. Terms say so. |
| 7 | Hundreds of `<img>` tags | Slow page and many requests. Tew's page was effectively one image plus link areas. | On approval, re-composite **one `canvas.png`** (or WebP). Clickable regions come from `blocks.json` as absolutely-positioned `<a>` overlays. One image request. |
| 8 | 1000px canvas on phones | Doesn't fit a 375px screen. | Pinch and pan with a minimap on mobile. Selecting to buy is desktop-first, with a "best on desktop" note. |
| 9 | Link rot and "forever" promises | 22% dead links. Promising forever is a liability. | Promise a fixed term (e.g. 5 years, like the original). `rel="sponsored noopener"` on links. Monthly dead-link check that flags links, never auto-removes. URL is required (23,200 pixels were dead on day one without it). |
| 10 | Can't edit after purchase | That's the original rule, but bought domains change hands. | Keep the image locked (part of the charm). Allow **one URL change** per block via a magic link to the buyer's email, which goes through review again. |
| 11 | DDoS and extortion (it happened to Tew) | One origin server is a single point of failure. | Static page and canvas on Cloudflare Pages / CDN. The Worker only handles buying, so attacks on it don't take the page down. |
| 12 | Payments, tax, legal | Real money means refunds, chargebacks, and GST (if NZ-based) and consumer-law questions. | Stripe Checkout (no card data touches us). Short Terms page (no refunds after approval, content rules, term length). Bryn to confirm tax position. |
| 13 | $1/pixel assumes 2005-level hype | Realistically demand is low, and an empty grid looks dead. | Price is Bryn's call (see Decisions). Seed a few "house" blocks, as Tew did with friends. Optionally show a "pixels sold" counter for social proof. |
| 14 | Accessibility and SEO | Image-only page is invisible to screen readers and search. | Each overlay `<a>` gets an `aria-label` (the slogan). A hidden-by-default "List view" of all advertisers. |

---

## 4. Plan v2 (recommended)

### Architecture
```
Browser ──► Cloudflare Pages (static): index.html, canvas.png, blocks.json, app.js
   │
   └─► Cloudflare Worker /api/*
         ├─ D1 (SQLite): blocks, holds, orders
         ├─ R2: original uploaded images
         └─ Stripe Checkout + webhook
Approval ─► Worker re-composites canvas.png + blocks.json ─► R2/Pages (CDN-cached)
```
No framework and no build step on the front end: plain HTML/CSS/JS to match Bryn's style. The Worker is one TypeScript file deployed with `wrangler`.

### Buyer journey
1. **Land:** see the full grid with "X / 1,000,000 pixels sold". Hover a block to see the slogan. Click to visit.
2. **Select:** "Buy pixels" → drag a rectangle (snaps to 10×10). Live readout: "60×40 px = 24 blocks = $2,400". Overlaps with taken blocks show red.
3. **Design:** upload a PNG/JPG/GIF. Crop and fit to the exact size. Preview it in place on the real canvas. Enter URL (required, validated), slogan (≤ 80 chars) and email.
4. **Hold & pay:** the Worker creates a 15-minute hold and a Stripe Checkout session. The buyer pays.
5. **Pending:** the buyer sees a "Paid, in review (usually within 24 h)" page and a confirmation email. Their block shows as a "reserved" hatch on the grid.
6. **Live:** Bryn approves → the canvas is regenerated → the buyer gets a "you're live" email with a link straight to their block (`/#x=120&y=340`).
7. **After:** one URL change allowed via magic link (re-reviewed). The image stays fixed for the term.

### Admin (Bryn)
- An email per order with Approve / Reject links (signed, single-use).
- `/admin` page (Cloudflare Access protected) listing pending, live and flagged blocks, with a dead-link report.
- Reject → Stripe refund issued automatically and the hold released.

### Data model (D1)
- `blocks(id, x, y, w, h, image_key, url, title, email, status[held|paid|live|rejected], created_at, live_at, expires_at)`
- `cells(cx, cy PRIMARY KEY, block_id)`: one row per 10×10 cell. The unique key is what prevents double sales.
- `orders(id, block_id, stripe_session_id, amount, currency, status)`

### Build phases (each ends with something usable)
1. **Static grid:** canvas render, overlays from a hand-written `blocks.json`, hover and click, mobile pan and zoom, a few seed blocks. *(Deployable as a demo.)*
2. **Selector + preview:** drag-select, price readout, image crop and preview. All client-side, with no purchase yet.
3. **Worker + holds + Stripe (test mode):** reserve, checkout, webhook, pending state, emails.
4. **Moderation + compositing:** approve/reject flow, canvas regeneration, refunds on reject.
5. **Hardening:** Terms page, dead-link checker (scheduled Worker), rate limiting, list view and accessibility, Stripe live mode.

### Testing
- Unit tests for the grid maths (snapping, overlap, price) and hold expiry.
- Playwright run of the full purchase on Stripe test cards, including two browsers racing for the same block.
- Webhook replay and idempotency test (Stripe retries).

---

## 5. Decisions needed from you before I build

1. **Repo and domain:** new repo name (e.g. `brynwhyman/pixels`) and where it lives (`pixels.brynwhyman.com`?).
2. **Real money or for fun?** Real Stripe payments, or a free "claim a block" version (no payments, so phases 3–4 get much simpler)?
3. **Price and currency:** $1/pixel USD like the original, or something cheaper or a twist (e.g. $0.10/pixel NZD, or price going up as it fills)?
4. **Grid size:** 1000×1000 (faithful) or smaller so it can realistically fill up?
5. **Term:** 5 years, "as long as the site exists", or something else?
6. **Hosting:** fine with Cloudflare (Pages + Worker + D1 + R2)? The alternative is Vercel + Supabase.
