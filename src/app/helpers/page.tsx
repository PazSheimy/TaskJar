import Link from "next/link";
import type { Metadata } from "next";
import { OfferCard } from "@/components/offer-card";
import {
  btnPrimary,
  btnSecondary,
  Empty,
  inputClass,
  PageTitle,
} from "@/components/ui";
import { CATEGORIES, isCategory } from "@/lib/categories";
import { first, ZIP_RE } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import type { OfferWithOwner } from "@/lib/types";

export const metadata: Metadata = { title: "Helpers" };

export default async function HelpersPage(props: PageProps<"/helpers">) {
  const sp = await props.searchParams;
  const category = first(sp.category);
  const zip = first(sp.zip).trim();
  const filtered = Boolean(category || zip);

  const supabase = await createClient();
  let query = supabase
    .from("offers")
    .select(
      "id,owner_id,headline,categories,description,rate_text,zips,availability,active,created_at,updated_at,owner:profiles!offers_owner_id_fkey(id,name,zip,bio)",
    )
    .eq("active", true)
    .order("updated_at", { ascending: false })
    .limit(60);
  if (isCategory(category)) query = query.contains("categories", [category]);
  if (ZIP_RE.test(zip)) query = query.contains("zips", [zip]);

  const { data, error } = await query;
  if (error) console.error("offers query failed", error);
  const offers = (data ?? []) as unknown as OfferWithOwner[];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8">
      <PageTitle
        sub="People nearby who do this for a living, or on the side."
        aside={
          <Link href="/offer" className={btnPrimary}>
            Offer a skill
          </Link>
        }
      >
        Helpers
      </PageTitle>

      <form className="mb-6 grid gap-3 sm:grid-cols-[240px_130px_auto]">
        <select
          name="category"
          defaultValue={isCategory(category) ? category : ""}
          aria-label="Category"
          className={inputClass}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          name="zip"
          defaultValue={zip}
          inputMode="numeric"
          maxLength={5}
          placeholder="Zip"
          aria-label="Zip code"
          className={inputClass}
        />
        <button type="submit" className={btnSecondary}>
          Filter
        </button>
      </form>

      {filtered && (
        <p className="mb-4 text-sm text-ink-2">
          Showing filtered results.{" "}
          <Link href="/helpers" className="underline hover:text-ink">
            Show everyone
          </Link>
        </p>
      )}

      {offers.length === 0 ? (
        <Empty
          title={filtered ? "No helpers match yet." : "No helpers yet."}
          text="Do you clean, cook, mow, or fix things? Put your offer up and let neighbors find you."
        >
          <Link href="/offer" className={btnPrimary}>
            Offer a skill
          </Link>
        </Empty>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {offers.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </ul>
      )}
    </main>
  );
}
