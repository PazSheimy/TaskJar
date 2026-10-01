"use client";

import { useState } from "react";
import { inputClass } from "@/components/ui";
import { ALLOCATION } from "@/lib/allocation";
import { estimateTakeHome, TAX_YEAR, type FilingStatus } from "@/lib/tax";

type Mode = "hourly" | "monthly" | "yearly";

const MODES: { value: Mode; label: string }[] = [
  { value: "hourly", label: "Hourly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function num(s: string): number {
  const n = Number.parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function MoneyPlan() {
  const [mode, setMode] = useState<Mode>("hourly");
  const [hours, setHours] = useState("40");
  const [rate, setRate] = useState("20");
  const [monthly, setMonthly] = useState("3500");
  const [yearly, setYearly] = useState("42000");
  const [beforeTax, setBeforeTax] = useState(true);
  const [status, setStatus] = useState<FilingStatus>("single");
  const [stateRate, setStateRate] = useState("0");

  const grossAnnual =
    mode === "hourly"
      ? num(hours) * num(rate) * 52
      : mode === "monthly"
        ? num(monthly) * 12
        : num(yearly);

  const stateShare = Math.min(Math.max(num(stateRate), 0), 15) / 100;
  const taxes = beforeTax
    ? estimateTakeHome({ grossAnnual, status, stateRate: stateShare })
    : null;
  const netMonthly = (taxes ? taxes.net : grossAnnual) / 12;
  const taxMonthly = taxes ? (grossAnnual - taxes.net) / 12 : 0;
  const hasIncome = grossAnnual > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Inputs */}
      <section className="grid content-start gap-5 border border-line bg-white p-5">
        <h2 className="font-display text-xl font-bold">What you earn</h2>

        <div
          role="group"
          aria-label="How do you want to enter your income?"
          className="grid grid-cols-3 overflow-hidden rounded-lg border-2 border-line"
        >
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              aria-pressed={mode === m.value}
              onClick={() => setMode(m.value)}
              className={`py-2 text-sm font-semibold transition-colors ${
                mode === m.value ? "bg-ink text-bg" : "bg-white text-ink-2 hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "hourly" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold">
              Hours per week
              <input
                type="number"
                inputMode="decimal"
                min={1}
                max={100}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Pay per hour
              <div className="flex items-center rounded-lg border-2 border-line bg-white focus-within:border-green">
                <span className="pl-3.5 text-muted">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="0.5"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full bg-transparent px-2 py-2.5 text-base focus:outline-none"
                />
              </div>
            </label>
          </div>
        )}

        {mode === "monthly" && (
          <label className="grid gap-1.5 text-sm font-semibold">
            Pay per month
            <div className="flex items-center rounded-lg border-2 border-line bg-white focus-within:border-green">
              <span className="pl-3.5 text-muted">$</span>
              <input
                type="number"
                inputMode="decimal"
                min={1}
                step="50"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                className="w-full bg-transparent px-2 py-2.5 text-base focus:outline-none"
              />
            </div>
          </label>
        )}

        {mode === "yearly" && (
          <label className="grid gap-1.5 text-sm font-semibold">
            Pay per year
            <div className="flex items-center rounded-lg border-2 border-line bg-white focus-within:border-green">
              <span className="pl-3.5 text-muted">$</span>
              <input
                type="number"
                inputMode="decimal"
                min={1}
                step="500"
                value={yearly}
                onChange={(e) => setYearly(e.target.value)}
                className="w-full bg-transparent px-2 py-2.5 text-base focus:outline-none"
              />
            </div>
          </label>
        )}

        <label className="flex items-start gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={beforeTax}
            onChange={(e) => setBeforeTax(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-green"
          />
          <span>
            <span className="font-semibold">This is before taxes.</span>{" "}
            <span className="text-ink-2">
              We’ll estimate federal, Social Security, Medicare, and state taxes
              so the plan uses what actually lands in your account.
            </span>
          </span>
        </label>

        {beforeTax && (
          <div className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold">
              Filing status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FilingStatus)}
                className={inputClass}
              >
                <option value="single">Single</option>
                <option value="married">Married, filing jointly</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              State income tax
              <div className="flex items-center rounded-lg border-2 border-line bg-white focus-within:border-green">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={15}
                  step="0.5"
                  value={stateRate}
                  onChange={(e) => setStateRate(e.target.value)}
                  className="w-full bg-transparent px-3.5 py-2.5 text-base focus:outline-none"
                />
                <span className="pr-3.5 text-muted">%</span>
              </div>
              <span className="text-xs font-normal text-muted">
                0 in Florida, Texas, Nevada, Tennessee, Washington, Wyoming, South Dakota.
              </span>
            </label>
          </div>
        )}
      </section>

      {/* Results */}
      <section className="grid content-start gap-5">
        <div className="border border-line bg-bg-2 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Take-home pay per month
          </p>
          <p className="mt-1 font-display text-4xl font-extrabold tracking-tight tabular-nums">
            {hasIncome ? money.format(netMonthly) : "$0"}
          </p>
          {hasIncome && taxes && (
            <p className="mt-1 text-sm text-ink-2 tabular-nums">
              From {money.format(grossAnnual / 12)} gross, after about{" "}
              {money.format(taxMonthly)} in taxes ({Math.round(taxes.effectiveRate * 100)}%).
            </p>
          )}
          {hasIncome && !beforeTax && (
            <p className="mt-1 text-sm text-ink-2">Using the amount you entered as-is.</p>
          )}
        </div>

        <div
          className="flex h-4 w-full overflow-hidden rounded-full"
          role="img"
          aria-label="How take-home pay splits: 55% needs, 5% fun, 10% invest, 15% goals, 15% long term"
        >
          {ALLOCATION.map((a) => (
            <span
              key={a.key}
              style={{ width: `${a.share * 100}%`, background: a.color }}
            />
          ))}
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {ALLOCATION.map((a) => (
            <li key={a.key} className="grid grid-cols-[14px_1fr_auto] items-start gap-3 py-3.5">
              <span
                aria-hidden
                className="mt-1.5 h-3.5 w-3.5 rounded-full"
                style={{ background: a.color }}
              />
              <div>
                <p className="font-semibold">
                  {a.label}{" "}
                  <span className="font-mono text-xs font-normal text-muted">
                    {Math.round(a.share * 100)}%
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-ink-2">{a.hint}</p>
              </div>
              <p className="font-display text-xl font-bold tabular-nums">
                {hasIncome ? money.format(netMonthly * a.share) : "$0"}
                <span className="block text-right font-sans text-xs font-normal text-muted">
                  per month
                </span>
              </p>
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted">
          Estimate only. Uses {TAX_YEAR} federal brackets and the standard
          deduction, with no credits or other deductions, so your real paycheck
          can differ. Not tax or investment advice.
        </p>
      </section>
    </div>
  );
}
