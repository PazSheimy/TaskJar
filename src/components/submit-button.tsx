"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { btnPrimary } from "@/components/ui";

export function SubmitButton({
  children,
  pendingText = "Saving…",
  className = btnPrimary,
}: {
  children: ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}
