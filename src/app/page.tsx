import Link from "next/link";
import { NeedCard } from "@/components/need-card";
import {
  btnPrimary,
  btnSecondary,
  Empty,
  inputClass,
  PageTitle,
} from "@/components/ui";
import { getUser } from "@/lib/auth";
import { CATEGORIES, isCategory } from "@/lib/categories";
import { first } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import type { NeedWithOwner } from "@/lib/types";

export default async function JobsPage(props: PageProps<"/">) {
  const sp = await props.searchParams;
  const q = first(sp.q).replace(/[^\w\s-]/g, "").trim().slice(0, 60);
  const category = first(sp.category);
  const zip = first(sp.zip).trim();
  const filtered = Boolean(q || category || zip);

  const user = await getUser();
  const supabase = await createClient();

  let query = supabase
    .from("needs")
    .select(
      "id,owner_id,title,category,description,zip,area,pay_type,pay_amount,when_text,status,helper_id,created_at,owner:profiles!needs_owner_id_fkey(id,name,zip)",
    )
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(60);
  if (isCategory(category)) query = query.eq("category", category);
  if (/^\d{3,5}$/.test(zip)) query = query.like("zip", `${zip.slice(0, 3)}%`);
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) console.error("needs query failed", error);
  const needs = (data ?? []) as unknown as NeedWithOwner[];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8">
      {!user && (
        <section className="mb-8 grid gap-5 border border-line bg-bg-2 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Small jobs near you, posted by neighbors.
            </h1>
            <p className="mt-2 max-w-xl text-ink-2">
              Post the lawn, the laundry, the cats. Or pick up a few jobs and
              make your extra $500 this week. You agree on the price and pay
              each other directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/signup" className={btnPrimary}>
              Create account
            </Link>
            <Link href="/helpers" className={btnSecondary}>
              Find a helper
            </Link>
          </div>
        </section>
      )}

      <PageTitle
        sub="Newest first. Pick one, say hi, agree on the details."
        aside={
          <Link href="/offer" className={btnSecondary}>
            Offer a skill
          </Link>
        }
      >
        Open jobs
      </PageTitle>

      <form className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px_130px_auto]">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search jobs"
          aria-label="Search jobs"
          className={inputClass}
        />
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
          <Link href="/" className="underline hover:text-ink">
            Show all open jobs
          </Link>
        </p>
      )}

      {needs.length === 0 ? (
        <Empty
          title={filtered ? "Nothing matches yet." : "No open jobs yet."}
          text={
            filtered
              ? "Try a wider search, or post what you need and let helpers come to you."
              : "Be the first. Posting takes two minutes."
          }
        >
          <Link href="/jobs/new" className={btnPrimary}>
            Post a job
          </Link>
        </Empty>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {needs.map((n) => (
            <NeedCard key={n.id} need={n} />
          ))}
        </ul>
      )}
    </main>
  );
}
