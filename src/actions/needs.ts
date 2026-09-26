"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { isCategory } from "@/lib/categories";
import { str, valuesOf, ZIP_RE, type FormState } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import { findOrCreateThread } from "@/actions/messages";

const PAY_TYPES = new Set(["fixed", "hourly", "offer"]);

/** Create a job, or update one when the form carries an id. */
export async function saveNeed(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = str(formData.get("id"));
  const user = await requireUser(id ? `/jobs/${id}/edit` : "/jobs/new");
  const values = valuesOf(formData);

  const title = str(formData.get("title"));
  const category = str(formData.get("category"));
  const description = str(formData.get("description"));
  const zip = str(formData.get("zip"));
  const area = str(formData.get("area"));
  const payType = str(formData.get("pay_type"));
  const amountRaw = str(formData.get("pay_amount"));
  const whenText = str(formData.get("when_text"));

  if (title.length < 3 || title.length > 100)
    return { error: "Give the job a short title (3 to 100 characters).", values };
  if (!isCategory(category)) return { error: "Pick a category.", values };
  if (description.length < 10 || description.length > 2000)
    return { error: "Add a few more details (at least 10 characters).", values };
  if (zip && !ZIP_RE.test(zip))
    return { error: "Zip code should be 5 digits, or leave it empty.", values };
  if (!PAY_TYPES.has(payType)) return { error: "Pick how you want to pay.", values };

  let payAmount: number | null = null;
  if (payType !== "offer") {
    payAmount = Number.parseInt(amountRaw, 10);
    if (!Number.isFinite(payAmount) || payAmount < 1 || payAmount > 100000)
      return { error: "Enter the amount you’ll pay, in whole dollars.", values };
  }

  const row = {
    title,
    category,
    description,
    zip: zip || null,
    area: area || null,
    pay_type: payType,
    pay_amount: payAmount,
    when_text: whenText || null,
  };

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("needs")
      .update(row)
      .eq("id", id)
      .eq("owner_id", user.id);
    if (error) return { error: "Couldn’t save the changes. Try again.", values };
    revalidatePath(`/jobs/${id}`);
    redirect(`/jobs/${id}`);
  }

  const { data, error } = await supabase
    .from("needs")
    .insert({ ...row, owner_id: user.id })
    .select("id")
    .single();
  if (error || !data) {
    console.error("need insert failed", error);
    return { error: "Couldn’t post the job. Try again.", values };
  }
  revalidatePath("/");
  redirect(`/jobs/${data.id}`);
}

/** "I can do this": saves the response and opens a conversation with the poster. */
export async function respondToNeed(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const needId = str(formData.get("need_id"));
  const message = str(formData.get("message"));
  const user = await requireUser(`/jobs/${needId}`);
  const values = valuesOf(formData);

  if (!needId) return { error: "This job no longer exists.", values };
  if (message.length < 1 || message.length > 1000)
    return { error: "Write a short message to the poster.", values };

  const supabase = await createClient();
  const { data: need } = await supabase
    .from("needs")
    .select("id, owner_id, status")
    .eq("id", needId)
    .maybeSingle();
  if (!need) return { error: "This job no longer exists.", values };
  if (need.owner_id === user.id)
    return { error: "This is your own job.", values };
  if (need.status !== "open")
    return { error: "This job is no longer open.", values };

  const { error } = await supabase
    .from("responses")
    .insert({ need_id: needId, helper_id: user.id, message });
  if (error && error.code !== "23505") {
    console.error("response insert failed", error);
    return { error: "Couldn’t send your response. Try again.", values };
  }

  const threadId = await findOrCreateThread(supabase, user.id, need.owner_id, needId);
  if (!threadId) return { error: "Couldn’t open the conversation. Try again.", values };

  // Only post the message when this is a new response, so a retry doesn't duplicate it.
  if (!error) {
    await supabase
      .from("messages")
      .insert({ thread_id: threadId, sender_id: user.id, body: message });
  }

  revalidatePath(`/jobs/${needId}`);
  redirect(`/messages/${threadId}`);
}

/** The poster picks one helper. The job becomes "taken" and the others are declined. */
export async function pickHelper(needId: string, responseId: string) {
  const user = await requireUser(`/jobs/${needId}`);
  const supabase = await createClient();

  const { data: resp } = await supabase
    .from("responses")
    .select("id, helper_id, need_id")
    .eq("id", responseId)
    .maybeSingle();
  if (!resp || resp.need_id !== needId) return;

  const { data: updated } = await supabase
    .from("needs")
    .update({ status: "taken", helper_id: resp.helper_id })
    .eq("id", needId)
    .eq("owner_id", user.id)
    .eq("status", "open")
    .select("id");
  if (!updated?.length) return;

  await supabase.from("responses").update({ status: "picked" }).eq("id", responseId);
  await supabase
    .from("responses")
    .update({ status: "declined" })
    .eq("need_id", needId)
    .eq("status", "pending");

  revalidatePath(`/jobs/${needId}`);
}

export async function declineResponse(needId: string, responseId: string) {
  await requireUser(`/jobs/${needId}`);
  const supabase = await createClient();
  await supabase
    .from("responses")
    .update({ status: "declined" })
    .eq("id", responseId)
    .eq("need_id", needId)
    .eq("status", "pending");
  revalidatePath(`/jobs/${needId}`);
}

/** Owner marks the job done or cancels it. */
export async function setNeedStatus(needId: string, status: "done" | "cancelled") {
  const user = await requireUser(`/jobs/${needId}`);
  const supabase = await createClient();
  await supabase
    .from("needs")
    .update({ status })
    .eq("id", needId)
    .eq("owner_id", user.id)
    .in("status", status === "done" ? ["taken"] : ["open", "taken"]);
  revalidatePath(`/jobs/${needId}`);
  revalidatePath("/");
}
