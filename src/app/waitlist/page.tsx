import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist-form";

export const metadata: Metadata = { title: "Waitlist" };

const MATH = [
  ["House cleaning", "$100–150 per home", "4 homes"],
  ["Lawn mowing", "$40–60 per yard", "10 yards"],
  ["Pressure washing a driveway", "$100–200 per job", "3 jobs"],
  ["Weekly meal prep", "$150–250 + groceries", "2–3 clients"],
  ["Cat sitting while they travel", "$20–30 per visit", "20 visits"],
];

export default function WaitlistPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10">
      <section className="grid gap-8 bg-sign p-6 text-sign-ink sm:grid-cols-[1.1fr_1fr] sm:p-10">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Need a hand?
            <br />
            Have two?
          </h1>
          <p className="mt-4 max-w-md text-sign-ink/85">
            TaskJar opens one neighborhood at a time. Join the waitlist and
            we’ll email you the day it opens near you. Early members get their
            posts seen first.
          </p>
        </div>
        <WaitlistForm />
      </section>

      <section className="mt-14">
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
                  <td className="py-3 pr-4 tabular-nums whitespace-nowrap">{pay}</td>
                  <td className="py-3 tabular-nums whitespace-nowrap">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
