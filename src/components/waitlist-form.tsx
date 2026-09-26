"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "@/actions/waitlist";

const ROLES = [
  { value: "need", label: "I need help with things" },
  { value: "earn", label: "I want to earn" },
  { value: "both", label: "Both" },
];

const inputClass =
  "w-full rounded-lg border-2 border-sign-ink/20 bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-muted focus:border-sign-ink focus:outline-none";

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState<WaitlistState, FormData>(
    joinWaitlist,
    null,
  );

  if (state?.ok) {
    return (
      <div role="status" className="rounded-xl bg-white/70 p-5">
        <p className="font-display text-2xl font-bold">You’re on the list.</p>
        <p className="mt-1 text-sign-ink/85">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-semibold">
          What brings you here?
        </legend>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r, i) => (
            <label
              key={r.value}
              className="cursor-pointer rounded-full border-2 border-sign-ink/25 bg-white/60 px-3.5 py-1.5 text-sm font-medium has-checked:border-sign-ink has-checked:bg-sign-ink has-checked:text-sign has-focus-visible:ring-2 has-focus-visible:ring-sign-ink has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-sign"
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                defaultChecked={i === 2}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-1.5">
        <label htmlFor="zip" className="text-sm font-semibold">
          Zip code{" "}
          <span className="font-normal text-sign-ink/70">
            (optional, tells us where to open first)
          </span>
        </label>
        <input
          id="zip"
          name="zip"
          inputMode="numeric"
          pattern="[0-9]{5}"
          maxLength={5}
          placeholder="5 digits"
          className={`${inputClass} max-w-40`}
        />
      </div>

      {state && !state.ok && (
        <p role="alert" className="text-sm font-semibold text-red-800">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 justify-self-start rounded-lg bg-sign-ink px-5 py-3 font-semibold text-sign transition-colors hover:bg-ink disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sign-ink"
      >
        {pending ? "Adding you…" : "Join the waitlist"}
      </button>

      <p className="text-xs text-sign-ink/70">
        No spam. One email when TaskJar opens near you.
      </p>
    </form>
  );
}
