"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { isCategory } from "@/lib/categories";
import { str, valuesOf, ZIP_RE, type FormState } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";

/** Create or update the signed-in user's one offer. */
export async function saveOffer(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser("/offer");
  const values = valuesOf(formData);

  const headline = str(formData.get("headline"));
  const description = str(formData.get("description"));
  const rateText = str(formData.get("rate_text"));
  const availability = str(formData.get("availability"));
  const active = formData.get("active") === "on";
  const categories = formData
    .getAll("categories")
    .map((c) => str(c))
    .filter(isCategory);
  const zips = str(formData.get("zips"))
    .split(/[\s,]+/)
    .map((z) => z.trim())
    .filter(Boolean);

  if (headline.length < 3 || headline.length > 100)
    return { error: "Give your offer a short headline, like “I clean houses”.", values };
  if (categories.length === 0)
    return { error: "Pick at least one category.", values };
  if (description.length < 10 || description.length > 2000)
    return { error: "Tell people a bit more about what you do (at least 10 characters).", values };
  if (zips.length === 0 || zips.length > 10 || zips.some((z) => !ZIP_RE.test(z)))
    return { error: "List 1 to 10 zip codes you serve, 5 digits each, separated by commas.", values };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("offers")
    .upsert(
      {
        owner_id: user.id,
        headline,
        categories,
        description,
        rate_text: rateText || null,
        zips,
        availability: availability || null,
        active,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "owner_id" },
    )
    .select("id")
    .single();
  if (error || !data) {
    console.error("offer upsert failed", error);
    return { error: "Couldn’t save your offer. Try again.", values };
  }

  revalidatePath("/helpers");
  redirect(`/helpers/${data.id}`);
}
