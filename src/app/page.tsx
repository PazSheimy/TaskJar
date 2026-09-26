import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";

const CATEGORIES = [
  "Yard & lawn",
  "Pressure washing",
  "House cleaning",
  "Laundry & ironing",
  "Cooking & meal prep",
  "Pet sitting & dog walking",
  "Moving & hauling",
  "Handyman & small repairs",
  "Car wash & detailing",
  "Errands & delivery",
  "Tech help",
];

const STEPS = [
  {
    title: "Post it, or browse",
    text: "Need something done? Post it in two minutes with a price and a day. Want to earn? Browse what neighbors need near your zip.",
  },
  {
    title: "Message and agree",
    text: "Say “I can do this.” Sort out the details in chat. The poster picks one person and phone numbers unlock for both.",
  },
  {
    title: "Get it done, pay directly",
    text: "Cash, Zelle, Venmo, whatever you both like. No fees in the middle. Leave each other a rating so the next job is easier.",
  },
];

const MATH = [
  ["House cleaning", "$100–150 per home", "4 homes"],
  ["Lawn mowing", "$40–60 per yard", "10 yards"],
  ["Pressure washing a driveway", "$100–200 per job", "3 jobs"],
  ["Weekly meal prep", "$150–250 + groceries", "2–3 clients"],
  ["Cat sitting while they travel", "$20–30 per visit", "20 visits"],
];

export default function Home() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold tracking-tight"
        >
          TaskJar
        </Link>
        <a
          href="#waitlist"
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-green"
        >
          Join the waitlist
        </a>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-5 pt-10 pb-14 sm:pt-16 sm:pb-20">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Coming soon · one neighborhood at a time
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-balance sm:text-7xl">
            Small jobs near you, posted by neighbors.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-2">
            Post the lawn, the laundry, the cats. Or pick up a few jobs and
            make your extra $500 this week. You agree on the price and pay each
            other directly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#waitlist"
              className="rounded-lg bg-green px-5 py-3 font-semibold text-white transition-colors hover:bg-green-dark"
            >
              Get early access
            </a>
            <a
              href="#how"
              className="rounded-lg border-2 border-line px-5 py-3 font-semibold text-ink transition-colors hover:border-ink"
            >
              How it works
            </a>
          </div>
        </section>

        {/* Two sides */}
        <section className="mx-auto grid max-w-5xl gap-4 px-5 sm:grid-cols-2">
          <div className="flex flex-col gap-3 border border-line bg-bg-2 p-6">
            <h2 className="font-display text-2xl font-bold">I need help</h2>
            <p className="text-ink-2">
              Post a small job in two minutes. Say what, when, where, and what
              you’ll pay.
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-ink-2 marker:text-green">
              <li>Mow the lawn, pressure wash the house</li>
              <li>Clean the house, wash and fold my laundry</li>
              <li>Cook and meal prep my week</li>
              <li>Feed my cats while I travel</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 border border-line bg-bg-2 p-6">
            <h2 className="font-display text-2xl font-bold">I want to earn</h2>
            <p className="text-ink-2">
              Register, say what you’re good at, and pick the jobs that fit
              your week.
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-ink-2 marker:text-green">
              <li>Post your skill: “I clean houses”</li>
              <li>Browse open jobs near your zip</li>
              <li>Message, agree on a price, get paid directly</li>
              <li>Collect ratings so the next job is easier</li>
            </ul>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-5xl px-5 pt-14">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance">
            The kinds of jobs you’ll find
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="border border-line bg-bg-2 px-3 py-1.5 text-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-5xl px-5 pt-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance">
            How it works
          </h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2">
                <span className="font-display text-4xl font-extrabold text-green">
                  {i + 1}
                </span>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="text-ink-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* The $500 math */}
        <section className="mx-auto max-w-5xl px-5 pt-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance">
            The $500-a-week math
          </h2>
          <p className="mt-2 max-w-xl text-ink-2">
            Typical ranges people charge for these jobs. Your area may differ.
          </p>
          <div className="mt-5 overflow-x-auto border-t-2 border-ink">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="font-mono text-xs uppercase tracking-wider text-muted">
                  <th className="py-3 pr-4 font-medium">Job</th>
                  <th className="py-3 pr-4 font-medium">Typical pay</th>
                  <th className="py-3 font-medium">To reach $500</th>
                </tr>
              </thead>
              <tbody>
                {MATH.map(([job, pay, count]) => (
                  <tr key={job} className="border-t border-line">
                    <td className="py-3 pr-4">{job}</td>
                    <td className="py-3 pr-4 tabular-nums whitespace-nowrap">
                      {pay}
                    </td>
                    <td className="py-3 tabular-nums whitespace-nowrap">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="mx-auto max-w-5xl px-5 pt-16 pb-20">
          <div className="grid gap-8 bg-sign p-6 text-sign-ink sm:grid-cols-[1.1fr_1fr] sm:p-10">
            <div>
              <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">
                Need a hand?
                <br />
                Have two?
              </h2>
              <p className="mt-4 max-w-md text-sign-ink/85">
                TaskJar opens one neighborhood at a time. Join the waitlist and
                we’ll email you the day it opens near you. Early members get
                their posts seen first.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:justify-between">
          <p>
            <span className="font-display font-bold text-ink">TaskJar</span> ·
            small jobs, near you
          </p>
          <p>
            We connect neighbors. You agree on the price and pay each other
            directly.
          </p>
        </div>
      </footer>
    </>
  );
}
