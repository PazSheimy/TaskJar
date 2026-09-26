import Link from "next/link";
import { notFound } from "next/navigation";
import { startThread } from "@/actions/messages";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, btnSecondary, Pill } from "@/components/ui";
import { getUser } from "@/lib/auth";
import { categoryLabel } from "@/lib/categories";
import { formatZips, timeAgo } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { OfferWithOwner } from "@/lib/types";

export default async function HelperPage(props: PageProps<"/helpers/[id]">) {
  const { id } = await props.params;
  const user = await getUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("offers")
    .select(
      "id,owner_id,headline,categories,description,rate_text,zips,availability,active,created_at,updated_at,owner:profiles!offers_owner_id_fkey(id,name,zip,bio)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const offer = data as unknown as OfferWithOwner;
  const name = offer.owner?.name ?? "Helper";
  const isMine = user?.id === offer.owner_id;

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8">
      <Link href="/helpers" className="text-sm text-ink-2 hover:text-ink">
        ← All helpers
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <Avatar name={name} size={56} />
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance">
            {offer.headline}
          </h1>
          <p className="mt-1 text-ink-2">
            {name}
            {offer.owner?.zip ? ` · ${offer.owner.zip}` : ""} · updated{" "}
            {timeAgo(offer.updated_at)}
          </p>
        </div>
      </div>

      {!offer.active && (
        <p className="mt-4 text-sm text-muted">
          This offer is hidden from browsing right now.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {offer.categories.map((c) => (
          <Pill key={c}>{categoryLabel(c)}</Pill>
        ))}
      </div>

      <dl className="mt-6 grid gap-3 border-y border-line py-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Rate</dt>
          <dd className="mt-0.5 font-semibold">{offer.rate_text ?? "Ask"}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Available</dt>
          <dd className="mt-0.5 font-semibold">{offer.availability ?? "Ask"}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Area</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatZips(offer.zips, 10)}</dd>
        </div>
      </dl>

      <p className="mt-6 max-w-prose whitespace-pre-line text-ink-2">
        {offer.description}
      </p>

      {offer.owner?.bio && (
        <p className="mt-4 max-w-prose text-sm text-muted">
          About {name}: {offer.owner.bio}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {isMine ? (
          <Link href="/offer" className={btnSecondary}>
            Edit my offer
          </Link>
        ) : (
          <form action={startThread.bind(null, offer.owner_id, null, `/helpers/${offer.id}`)}>
            <SubmitButton pendingText="Opening…">Message {name}</SubmitButton>
          </form>
        )}
        {!user && (
          <span className="text-sm text-muted">You’ll be asked to log in first.</span>
        )}
      </div>
    </main>
  );
}
