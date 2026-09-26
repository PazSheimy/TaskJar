"use client";

import { useActionState } from "react";
import { logIn, signUp } from "@/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { Alert, Field, inputClass } from "@/components/ui";
import type { FormState } from "@/lib/form";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(logIn, null);
  const v = state?.values ?? {};

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={v.email}
          className={inputClass}
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>
      {state?.error && <Alert>{state.error}</Alert>}
      <SubmitButton pendingText="Logging in…">Log in</SubmitButton>
    </form>
  );
}

export function SignupForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(signUp, null);
  const v = state?.values ?? {};

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      <Field label="Your name" htmlFor="name" hint="shown on your posts">
        <input
          id="name"
          name="name"
          required
          maxLength={60}
          autoComplete="name"
          defaultValue={v.name}
          className={inputClass}
        />
      </Field>
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={v.email}
          className={inputClass}
        />
      </Field>
      <Field label="Password" htmlFor="password" hint="at least 8 characters">
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>
      {state?.error && <Alert>{state.error}</Alert>}
      <SubmitButton pendingText="Creating account…">Create account</SubmitButton>
    </form>
  );
}
