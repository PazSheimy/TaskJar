"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { str, valuesOf, ZIP_RE, type FormState } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser("/account");
  const values = valuesOf(formData);

  const name = str(formData.get("name"));
  const zip = str(formData.get("zip"));
  const bio = str(formData.get("bio"));
  const phone = str(formData.get("phone")).replace(/[^\d+() -]/g, "");

  if (name.length < 2 || name.length > 60)
    return { error: "Enter your name (2 to 60 characters).", values };
  if (zip && !ZIP_RE.test(zip))
    return { error: "Zip code should be 5 digits.", values };
  if (bio.length > 500)
    return { error: "Keep your bio under 500 characters.", values };
  if (phone && phone.replace(/\D/g, "").length < 10)
    return { error: "Phone number should have at least 10 digits.", values };

  const supabase = await createClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: user.id, name, zip: zip || null, bio: bio || null });
  const { error: contactError } = await supabase
    .from("contacts")
    .upsert({ user_id: user.id, phone: phone || null });

  if (profileError || contactError) {
    console.error("profile update failed", profileError, contactError);
    return { error: "Couldn’t save. Try again.", values };
  }

  revalidatePath("/account");
  return { message: "Saved.", values };
}
