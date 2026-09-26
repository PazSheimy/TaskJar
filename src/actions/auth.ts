"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EMAIL_RE, safeNext, str, type FormState } from "@/lib/form";

export async function signUp(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = str(formData.get("name"));
  const email = str(formData.get("email")).toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const values = { name, email, next };

  if (name.length < 2) return { error: "Enter your name.", values };
  if (!EMAIL_RE.test(email))
    return { error: "That email doesn’t look right.", values };
  if (password.length < 8)
    return { error: "Password needs at least 8 characters.", values };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) return { error: error.message, values };

  // No session means Supabase wants the email confirmed first.
  if (!data.session) {
    redirect(`/login?check=1&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export async function logIn(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = str(formData.get("email")).toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const values = { email, next };

  if (!EMAIL_RE.test(email) || !password)
    return { error: "Enter your email and password.", values };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const notConfirmed = /confirm/i.test(error.message);
    return {
      error: notConfirmed
        ? "Confirm your email first. Check your inbox for the link."
        : "Wrong email or password.",
      values,
    };
  }
  redirect(next);
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
