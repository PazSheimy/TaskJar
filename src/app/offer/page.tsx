import Link from "next/link";
import type { Metadata } from "next";
import { OfferForm, type OfferInitial } from "@/components/offer-form";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Offer } from "@/lib/types";

export const metadata: Metadata = { title: "Offer a skill" };

export default async function OfferPage() {
  const user = await requireUser("/offer");
  const supabase = await createClient();
  const { data } = await supabase
    .from("offers")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();
  const offer = data as Offer | null;

  const initial: OfferInitial | undefined = offer
    ? {
        headline: offer.headline,
        categories: offer.categories.join(","),
        description: offer.description,
        rate_text: offer.rate_text ?? "",
        zips: offer.zips.join(", "),
        availability: offer.availability ?? "",
        active: offer.active ? "on" : "off",
      }
    : undefined;

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8">
      <PageTitle
        sub={
          offer
            ? "Update what you offer. Changes show right away."
            : "Tell neighbors what you do. They can message you directly from your offer."
        }
        aside={
          offer && (
            <Link href={`/helpers/${offer.id}`} className="text-sm underline hover:text-ink">
              See my offer
            </Link>
          )
        }
      >
        {offer ? "My offer" : "Offer a skill"}
      </PageTitle>
      <OfferForm initial={initial} isEdit={Boolean(offer)} />
    </main>
  );
}
