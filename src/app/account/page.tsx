import Link from "next/link";
import type { Metadata } from "next";
import { logOut } from "@/actions/auth";
import { ProfileForm } from "@/components/profile-form";
import { SubmitButton } from "@/components/submit-button";
import { btnPrimary, btnSecondary, PageTitle, Pill, statusTone } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL, timeAgo } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Need, Offer, Profile, ResponseRow } from "@/lib/types";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser("/account");
  const supabase = await createClient();

  const [profileRes, contactRes, needsRes, offerRes, responsesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("contacts").select("phone").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("needs")
      .select("id,title,status,created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("offers").select("id,headline,active").eq("owner_id", user.id).maybeSingle(),
    supabase
      .from("responses")
      .select("id,status,created_at,need:needs(id,title,status)")
      .eq("helper_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const profile = profileRes.data as Profile | null;
  const phone = (contactRes.data?.phone as string | null) ?? "";
  const needs = (needsRes.data ?? []) as Pick<Need, "id" | "title" | "status" | "created_at">[];
  const offer = offerRes.data as Pick<Offer, "id" | "headline" | "active"> | null;
  const responses = (responsesRes.data ?? []) as unknown as ResponseRow[];

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8">
      <PageTitle
        sub={user.email}
        aside={
          <form action={logOut}>
            <SubmitButton className={btnSecondary} pendingText="Logging out…">
              Log out
            </SubmitButton>
          </form>
        }
      >
        Your account
      </PageTitle>

      <section className="grid gap-8 sm:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="mb-3 font-display text-xl font-bold">Profile</h2>
          <ProfileForm
            initial={{
              name: profile?.name ?? "",
              zip: profile?.zip ?? "",
              bio: profile?.bio ?? "",
              phone,
            }}
          />
        </div>

        <div className="grid content-start gap-8">
          <div>
            <h2 className="mb-3 font-display text-xl font-bold">My offer</h2>
            {offer ? (
              <div className="flex flex-wrap items-center gap-2 border border-line bg-white p-4">
                <Link href={`/helpers/${offer.id}`} className="font-semibold hover:underline">
                  {offer.headline}
                </Link>
                <Pill tone={offer.active ? "green" : "muted"}>
                  {offer.active ? "Visible" : "Hidden"}
                </Pill>
                <Link href="/offer" className="ml-auto text-sm underline hover:text-ink">
                  Edit
                </Link>
              </div>
            ) : (
              <div className="grid justify-items-start gap-2 border border-dashed border-line p-4">
                <p className="text-sm text-ink-2">
                  Tell neighbors what you do and they can message you.
                </p>
                <Link href="/offer" className={btnSecondary}>
                  Offer a skill
                </Link>
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">My jobs</h2>
              <Link href="/jobs/new" className={btnPrimary}>
                Post a job
              </Link>
            </div>
            {needs.length === 0 ? (
              <p className="text-sm text-ink-2">You haven’t posted a job yet.</p>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {needs.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/jobs/${n.id}`}
                      className="flex items-center gap-2 py-2.5 hover:bg-bg-2"
                    >
                      <span className="min-w-0 flex-1 truncate font-medium">{n.title}</span>
                      <Pill tone={statusTone(n.status)}>{STATUS_LABEL[n.status]}</Pill>
                      <span className="w-16 text-right text-xs text-muted">
                        {timeAgo(n.created_at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="mb-3 font-display text-xl font-bold">Jobs I responded to</h2>
            {responses.length === 0 ? (
              <p className="text-sm text-ink-2">
                Nothing yet.{" "}
                <Link href="/" className="underline hover:text-ink">
                  Browse open jobs
                </Link>
                .
              </p>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {responses.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={r.need ? `/jobs/${r.need.id}` : "/messages"}
                      className="flex items-center gap-2 py-2.5 hover:bg-bg-2"
                    >
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {r.need?.title ?? "Job removed"}
                      </span>
                      <Pill tone={statusTone(r.status)}>
                        {r.status === "pending" ? "Waiting" : r.status === "picked" ? "Picked" : "Declined"}
                      </Pill>
                      <span className="w-16 text-right text-xs text-muted">
                        {timeAgo(r.created_at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
