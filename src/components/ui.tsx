import type { ReactNode } from "react";
import { initials } from "@/lib/format";

export const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-dark disabled:opacity-60";
export const btnSecondary =
  "inline-flex items-center justify-center rounded-lg border-2 border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:opacity-60";
export const btnDanger =
  "inline-flex items-center justify-center rounded-lg border-2 border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-800 transition-colors hover:border-red-700 disabled:opacity-60";
export const inputClass =
  "w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-muted focus:border-green focus:outline-none";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
        {hint && (
          <span className="ml-2 font-normal text-muted">{hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}

export function Alert({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "success" | "info";
}) {
  const tones = {
    error: "border-red-200 bg-red-50 text-red-900",
    success: "border-green/30 bg-green/10 text-green-dark",
    info: "border-sign bg-sign/30 text-sign-ink",
  };
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3.5 py-2.5 text-sm ${tones[tone]}`}
    >
      {children}
    </p>
  );
}

type Tone = "neutral" | "green" | "yellow" | "muted" | "red";

const PILL_TONES: Record<Tone, string> = {
  neutral: "border-line bg-bg-2 text-ink-2",
  green: "border-green/30 bg-green/10 text-green-dark",
  yellow: "border-sign bg-sign text-sign-ink",
  muted: "border-line bg-bg-2 text-muted",
  red: "border-red-200 bg-red-50 text-red-800",
};

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${PILL_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  switch (status) {
    case "open":
    case "picked":
      return "green";
    case "taken":
    case "pending":
      return "yellow";
    case "cancelled":
    case "declined":
      return "red";
    default:
      return "muted";
  }
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-green font-display font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </span>
  );
}

export function Empty({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid justify-items-start gap-3 border border-dashed border-line p-6">
      <p className="font-display text-xl font-bold">{title}</p>
      {text && <p className="max-w-md text-ink-2">{text}</p>}
      {children}
    </div>
  );
}

export function PageTitle({
  children,
  sub,
  aside,
}: {
  children: ReactNode;
  sub?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          {children}
        </h1>
        {sub && <p className="mt-1 max-w-xl text-ink-2">{sub}</p>}
      </div>
      {aside && <div className="flex flex-wrap gap-2">{aside}</div>}
    </div>
  );
}
