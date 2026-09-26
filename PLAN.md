# Solvd — Launch Plan (zero budget until we have users)

Working name: **Solvd**. Started 2026-09-25.

## What it is

A neighborhood board for small paid jobs. Two sides, one account:

- **I need help** — post a small job: mow the lawn, pressure wash the house, clean the house, wash and fold my laundry, cook and meal prep my week, feed my cats while I travel.
- **I want to earn** — register, post what you're good at ("I clean houses", "I cook"), and browse open jobs to pick how you make your extra $500 this week.

We connect people. In v1 they pay each other directly (cash, Zelle, Venmo). No payments inside the app until there are real users.

## 1. Names

Short one-word names are all taken. These looked unregistered by DNS check on 2026-09-25 (verify at Namecheap / Porkbun / Cloudflare before buying, and search USPTO for trademarks).

| Name | Hook | Domain status |
|---|---|---|
| **TaskJar** (recommended) | "Drop a task in. Pull a task out." Works for both sides. | taskjar.app looks free, taskjar.com taken |
| **Errandly** | "Little jobs, done nearby." | errandly.app looks free, .com taken |
| **QuickHands** | "Need a hand? Got two?" | quickhands.app looks free |
| **ChoreClub** | "Your neighborhood's to-do list." | choreclub.app looks free, .com taken |
| **HelpNest** | "Help lives close by." | helpnest.app looks free |
| **SideGig** | "Pick up $500 this week." Very clear, hard to own as a brand. | sidegig.app looks free |
| **SpareJob** | "Spare time. Spare cash." | sparejob.app looks free, .com taken |
| **Solvd** | "Post it. Solvd." | .com .app .co .io all taken; Solvd Inc. is an existing software company (trademark risk) |

Decision (2026-09-25): public name is **TaskJar**. "Solvd" stays only as the folder name. Don't buy the domain yet; launch on the free `taskjar.vercel.app` address and verify taskjar.app at a registrar before spending anything.

## 2. What you need (all free)

Already on this laptop: Node 24, npm 11, git, Claude Code.

Accounts to create (no credit card):

- [ ] GitHub — stores the code
- [ ] Vercel — hosts the site, free Hobby plan (see note below)
- [ ] Supabase — database, login, photo storage, free plan
- [ ] Resend — sends login and notification emails, free plan (3,000/month)
- [ ] Google Cloud console — only to enable "Sign in with Google" (free)

Money later, not now:

| Item | Cost | When |
|---|---|---|
| Domain name (.app or .com) | ~$10–15 / year | After ~100 users |
| Vercel Pro (Hobby plan is for non-commercial use) | $20 / month | When we start charging money. Cloudflare Pages is a free alternative that allows commercial use. |
| LLC / business registration | $50–500 depending on state | When money flows through the app |
| Stripe fees | ~3% + $0.30 per payment | When we add in-app payments |

## 3. Stack

- **Next.js** (React) — the website, mobile-first, installable on phones as a PWA (no app store needed).
- **Supabase** — Postgres database, email/Google login, photo storage, row-level security so users only edit their own posts.
- **Vercel** — hosting with automatic deploys from GitHub.
- **Resend** — email delivery (Supabase's built-in email is rate-limited to a few per hour; plug Resend in as SMTP).
- **No paid maps.** Location is zip code + neighborhood text. Distance filter by zip prefix at first.

Free-tier gotchas to know:

- Supabase free projects pause after 7 days with no activity. Any real traffic prevents it; early on, just open the site once a week.
- Supabase free: 500 MB database, 1 GB file storage. Plenty for thousands of posts; compress photos on upload.

## 4. MVP (version 1) — what's in, what's out

### In

1. **Sign up / log in** — email magic link or Google. Profile: name, photo, zip, short bio, phone (hidden until matched).
2. **Post a need** — title, category, description, zip + neighborhood, pay (fixed $, hourly, or "make an offer"), when (date or flexible), up to 3 photos, status (open / taken / done).
3. **Post an offer** — "I do ___", categories, rate, service area (zips), availability, photos of past work.
4. **Browse** — feed of needs (default for earners) and feed of helpers (for posters). Filter by category, zip, pay. Search. Sort newest first.
5. **Respond** — "I can do this" / "Hire me" opens a message thread. Poster picks one person → job becomes "taken" → phone numbers revealed to both.
6. **Finish** — mark done. Both sides leave a 1–5 star rating and a sentence.
7. **Safety basics** — email verification, report post/user, block user, Terms of Service + Privacy Policy, 18+ only.

### Out (for now)

- In-app payments (Stripe Connect) — fees, identity checks, refunds, liability. Add once trust exists.
- Background checks — costs per check. Later, as an optional paid badge.
- Maps — costs money at scale. Zip codes are enough for one city.
- Native iOS/Android apps — PWA first. App stores cost $99/yr (Apple) + $25 (Google).
- SMS notifications — costs per message. Email only in v1.
- Childcare category — highest liability. Hold until Terms and safety features are solid.

### Categories

Yard & lawn · Pressure washing · House cleaning · Laundry & ironing · Cooking & meal prep · Pet sitting & dog walking · Moving & hauling · Handyman & small repairs · Car wash & detailing · Errands & delivery · Tech help · Other

### Data model

- `profiles` — id, name, photo, zip, bio, phone, created_at
- `needs` — id, owner, title, category, description, zip, area, pay_type, pay_amount, when, status, photos[]
- `offers` — id, owner, headline, categories[], rate, zips[], availability, photos[]
- `responses` — id, need_id, helper_id, message, status (pending / picked / declined)
- `messages` — id, thread (need_id + helper_id), sender, body, sent_at
- `reviews` — id, need_id, reviewer, reviewee, stars, text
- `reports` — id, reporter, target_type, target_id, reason

## 5. Timeline

| Phase | Dates | Goal | Cost |
|---|---|---|---|
| 0 — Name & landing | Sep 25 – Oct 1 | Pick name, create accounts, one-page site with "join the waitlist" email box. Share in local Facebook groups, Nextdoor, WhatsApp. | $0 |
| 1 — Build MVP | Oct 2 – Oct 22 | Everything in "In" above, built with Claude Code. Test with 3 friends. | $0 |
| 2 — Soft launch | Oct 23 – Oct 29 | One city or neighborhood only. Seed 10 real needs (friends, family) and recruit 10 helpers. | $0 |
| 3 — Iterate | November | Fix what users complain about. Email notifications. Ratings visible on profiles. | $0 |
| 4 — First dollars | After ~100 users | Buy the domain. Consider LLC. Test monetization. | ~$15 |

## 6. Getting the first users (chicken and egg)

Start with the earner side: people who want $500 a week are easier to find than people ready to post a job. Then bring them jobs.

- Post your own real needs first (your lawn, your laundry). Ask 10 friends/family to post one real need each.
- Recruit helpers where they already look: local Facebook buy/sell groups, Nextdoor, Craigslist gigs, community college boards, church groups.
- One flyer, printed at home, on grocery store and laundromat boards: "Need a hand? Have two? [name].vercel.app".
- Reply to every post yourself in week 1 so nobody sees an empty board.

## 7. How to make money later (pick one, after users)

- **Featured post** — $3–5 to pin a need at the top for 3 days.
- **Helper Pro badge** — $5–10/month for a verified badge, more photos, appear first.
- **Service fee** — 5–10% of the job when paid through the app (needs Stripe Connect).

## 8. Rough "$500 a week" math (typical US ranges, adjust for your area)

| Job | Typical pay | To reach $500 |
|---|---|---|
| House cleaning | $100–150 per home | 4 homes |
| Lawn mowing | $40–60 per yard | 10 yards |
| Pressure washing driveway | $100–200 | 3 jobs |
| Weekly meal prep | $150–250 + groceries | 2–3 clients |
| Cat sitting | $20–30 per visit | 20 visits |

This table can live on the landing page for the earner side.

## 9. Next steps

1. Pick the name (verify domain + trademark, 10 minutes).
2. Create GitHub, Vercel, Supabase accounts (20 minutes).
3. Tell Claude Code: "set up the Next.js + Supabase project and build the landing page with a waitlist".
