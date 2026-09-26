/** Shared shape for every form that uses useActionState. */
export type FormState = {
  error?: string;
  message?: string;
  values?: Record<string, string>;
} | null;

/** A trimmed string from FormData, or "" when missing. */
export function str(v: FormDataEntryValue | null | undefined): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Everything the user typed, so a form can refill itself after an error. */
export function valuesOf(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of new Set(formData.keys())) {
    if (key.startsWith("$ACTION")) continue;
    const vals = formData
      .getAll(key)
      .filter((v): v is string => typeof v === "string");
    out[key] = vals.join(",");
  }
  return out;
}

/** Only allow redirects inside this site. */
export function safeNext(v: unknown): string {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}

/** First value of a search param. */
export function first(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const ZIP_RE = /^\d{5}$/;
