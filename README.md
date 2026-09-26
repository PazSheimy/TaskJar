# TaskJar

Small jobs near you, posted by neighbors. Post a task or pick one up and earn.

Live plan: see `PLAN.md`.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind)
- [Supabase](https://supabase.com) for database, login, and photo storage
- [Vercel](https://vercel.com) for hosting

## Run it on your laptop

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev
```

Open http://localhost:3000.

## Connect Supabase (one time)

1. In the Supabase dashboard create a project (any name, region closest to you).
2. Open **SQL Editor**, paste the contents of `supabase/migrations/0001_waitlist.sql`, click **Run**.
3. Open **Project Settings → API Keys** and copy the Project URL, the publishable key, and a secret key into `.env.local`.
4. Restart `npm run dev`. The waitlist form now saves to the `waitlist` table (see **Table Editor**).

## Deploy to Vercel (one time)

1. In Vercel click **Add New → Project**, import the `TaskJar` GitHub repo, keep the defaults.
2. Under **Environment Variables** add the same three values from `.env.local`.
3. Click **Deploy**. Every later `git push` to `main` deploys automatically.

## Scripts

| Command         | What it does                      |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the local dev server        |
| `npm run build` | Production build (Vercel runs it) |
| `npm run lint`  | Check the code with ESLint        |
