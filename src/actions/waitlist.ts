"use server";

import { getAdminClient } from "@/lib/supabase/admin";
import { EMAIL_RE } from "@/lib/form";

export type WaitlistState = { ok: boolean; message: string } | null;

const ROLES = new Set(["need", "earn", "both"]);

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const role = String(formData.get("role") ?? "");
  const zip = String(formData.get("zip") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return {
      ok: false,
      message: "That email doesn’t look right. Check it and try again.",
    };
  }
  if (!ROLES.has(role)) {
    return { ok: false, message: "Pick one of the three options." };
  }
  if (zip && !/^\d{5}$/.test(zip)) {
    return { ok: false, message: "Zip code should be 5 digits." };
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return {
      ok: false,
      message: "The waitlist isn’t connected yet. Try again in a bit.",
    };
  }

  const { error } = await supabase
    .from("waitlist")
    .insert({ email, role, zip: zip || null });

  // 23505 = unique violation: this email already signed up. Treat as success.
  if (error?.code === "23505") {
    return {
      ok: true,
      message:
        "You were already on the list. We’ll email you when TaskJar opens near you.",
    };
  }
  if (error) {
    console.error("waitlist insert failed", error);
    return {
      ok: false,
      message: "Something went wrong on our side. Try again in a minute.",
    };
  }

  return { ok: true, message: "We’ll email you when TaskJar opens near you." };
}
