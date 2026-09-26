"use client";

import { useActionState } from "react";
import { sendMessage } from "@/actions/messages";
import { SubmitButton } from "@/components/submit-button";
import { Alert, inputClass } from "@/components/ui";
import type { FormState } from "@/lib/form";

export function MessageForm({ threadId }: { threadId: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    sendMessage,
    null,
  );

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="thread_id" value={threadId} />
      <label htmlFor="body" className="sr-only">
        Message
      </label>
      <textarea
        id="body"
        name="body"
        required
        rows={2}
        maxLength={2000}
        defaultValue={state?.values?.body}
        placeholder="Write a message"
        className={inputClass}
      />
      {state?.error && <Alert>{state.error}</Alert>}
      <div className="flex justify-end">
        <SubmitButton pendingText="Sending…">Send</SubmitButton>
      </div>
    </form>
  );
}
