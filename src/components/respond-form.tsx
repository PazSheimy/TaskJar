"use client";

import { useActionState } from "react";
import { respondToNeed } from "@/actions/needs";
import { SubmitButton } from "@/components/submit-button";
import { Alert, inputClass } from "@/components/ui";
import type { FormState } from "@/lib/form";

export function RespondForm({ needId }: { needId: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    respondToNeed,
    null,
  );

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="need_id" value={needId} />
      <label htmlFor="message" className="text-sm font-semibold">
        Say hi and how you’d do it
      </label>
      <textarea
        id="message"
        name="message"
        required
        rows={3}
        maxLength={1000}
        defaultValue={state?.values?.message}
        placeholder="Hi! I can come Saturday at 9. I have my own mower."
        className={inputClass}
      />
      {state?.error && <Alert>{state.error}</Alert>}
      <SubmitButton pendingText="Sending…">I can do this</SubmitButton>
    </form>
  );
}
