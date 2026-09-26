"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireUser } from "@/lib/auth";
import { safeNext, str, valuesOf, type FormState } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";

const NO_NEED = "00000000-0000-0000-0000-000000000000";

/**
 * One thread per pair of people per job (or per pair with no job).
 * Returns the thread id, creating the thread if needed.
 */
export async function findOrCreateThread(
  supabase: SupabaseClient,
  me: string,
  other: string,
  needId: string | null,
): Promise<string | null> {
  const [a, b] = [me, other].sort();

  let lookup = supabase.from("threads").select("id").eq("a_id", a).eq("b_id", b);
  lookup = needId ? lookup.eq("need_id", needId) : lookup.is("need_id", null);
  const { data: existing } = await lookup.maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("threads")
    .insert({ a_id: a, b_id: b, need_id: needId })
    .select("id")
    .single();
  if (created) return created.id;

  // Someone else created it between our lookup and insert. Look again.
  if (error?.code === "23505") {
    let again = supabase.from("threads").select("id").eq("a_id", a).eq("b_id", b);
    again = needId ? again.eq("need_id", needId) : again.is("need_id", null);
    const { data } = await again.maybeSingle();
    return data?.id ?? null;
  }
  console.error("thread insert failed", error, { needId: needId ?? NO_NEED });
  return null;
}

/** "Message this person" button. Opens (or reopens) the conversation. */
export async function startThread(
  otherId: string,
  needId: string | null,
  next: string,
) {
  const user = await requireUser(safeNext(next));
  if (otherId === user.id) redirect("/messages");

  const supabase = await createClient();
  const threadId = await findOrCreateThread(supabase, user.id, otherId, needId);
  redirect(threadId ? `/messages/${threadId}` : "/messages");
}

export async function sendMessage(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const threadId = str(formData.get("thread_id"));
  const body = str(formData.get("body"));
  const user = await requireUser(`/messages/${threadId}`);

  if (!threadId) return { error: "This conversation no longer exists." };
  if (body.length < 1 || body.length > 2000)
    return { error: "Write a message first.", values: valuesOf(formData) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("messages")
    .insert({ thread_id: threadId, sender_id: user.id, body });
  if (error) {
    console.error("message insert failed", error);
    return { error: "Couldn’t send. Try again.", values: valuesOf(formData) };
  }

  revalidatePath(`/messages/${threadId}`);
  revalidatePath("/messages");
  return null;
}
