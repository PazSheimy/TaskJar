import type { Metadata } from "next";
import Link from "next/link";
import { MoneyPlan } from "@/components/money-plan";
import { btnSecondary, PageTitle } from "@/components/ui";
import { ALLOCATION } from "@/lib/allocation";

export const metadata: Metadata = {
  title: "Money plan",
  description:
    "Type what you earn and get a simple monthly plan: what you can spend, what to save, and what to invest.",
};

export default function MoneyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8">
      <PageTitle sub="Type what you earn. Get a simple monthly plan: what you can spend, what to save, and what to invest. Taxes are taken out first so the numbers are real.">
        Where should your paycheck go?
      </PageTitle>

      <MoneyPlan />

      <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            The rule, in one breath
          </h2>
          <p className="mt-2 max-w-prose text-ink-2">
            Every dollar that lands in your account already has a job. Needs get
            a hard ceiling so they can’t swallow everything. Fun gets a small
            slice so you don’t burn out. The other 40% builds your future, and
            it moves the day you get paid, not whatever is left at the end of
            the month.
          </p>
          <ol className="mt-4 grid gap-2">
            {ALLOCATION.map((a) => (
              <li key={a.key} className="flex items-baseline gap-3">
                <span className="w-12 shrink-0 font-display text-lg font-bold tabular-nums">
                  {Math.round(a.share * 100)}%
                </span>
                <span>
                  <span className="font-semibold">{a.label}.</span>{" "}
                  <span className="text-ink-2">{a.hint}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid content-start gap-4 border border-sign bg-sign/30 p-5">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Short on the 40%?
          </h2>
          <p className="text-ink-2">
            If needs already eat more than 55%, you don’t need a new rule. You
            need a bit more income this month. One or two small jobs a week
            closes the gap for most people.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className={btnSecondary}>
              See open jobs
            </Link>
            <Link href="/offer" className={btnSecondary}>
              Offer a skill
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
