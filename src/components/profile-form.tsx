"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/profile";
import { SubmitButton } from "@/components/submit-button";
import { Alert, Field, inputClass } from "@/components/ui";
import type { FormState } from "@/lib/form";

export type ProfileInitial = Partial<
  Record<"name" | "zip" | "bio" | "phone", string>
>;

export function ProfileForm({ initial }: { initial: ProfileInitial }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    updateProfile,
    null,
  );
  const v = { ...initial, ...(state?.values ?? {}) };

  return (
    <form action={formAction} className="grid gap-5">
      <Field label="Name" htmlFor="name" hint="shown on your posts">
        <input
          id="name"
          name="name"
          required
          maxLength={60}
          defaultValue={v.name}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Home zip code" htmlFor="zip" hint="optional">
          <input
            id="zip"
            name="zip"
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            defaultValue={v.zip}
            className={inputClass}
          />
        </Field>
        <Field
          label="Phone"
          htmlFor="phone"
          hint="only shared with people you’re matched with"
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={20}
            defaultValue={v.phone}
            placeholder="(305) 555-0123"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="About you" htmlFor="bio" hint="optional, a sentence or two">
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={500}
          defaultValue={v.bio}
          className={inputClass}
        />
      </Field>

      {state?.error && <Alert>{state.error}</Alert>}
      {state?.message && <Alert tone="success">{state.message}</Alert>}

      <SubmitButton pendingText="Saving…">Save</SubmitButton>
    </form>
  );
}
