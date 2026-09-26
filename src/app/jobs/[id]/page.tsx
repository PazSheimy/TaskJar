import Link from "next/link";
import { notFound } from "next/navigation";
import { startThread } from "@/actions/messages";
import { declineResponse, pickHelper, setNeedStatus } from "@/actions/needs";
import { RespondForm } from "@/components/respond-form";
import { SubmitButton } from "@/components/submit-button";
import {
  Alert,
  Avatar,
  btnDanger,
  btnPrimary,
  btnSecondary,
  Pill,
  statusTone,
} from "@/components/ui";
import { getUser } from "@/lib/auth";
import { categoryLabel } from "@/lib/categories";
import { formatPay, formatPlace, STATUS_LABEL, timeAgo } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { NeedWithOwner, ResponseRow } from "@/lib/types";

export default async function JobPage(props: PageProps<"/jobs/[id]">) {
  const { id } = await props.params;
  const user = await getUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("needs")
    .select(
      "id,owner_id,title,category,description,zip,area,pay_type,pay_amount,when_text,status,helper_id,created_at,owner:profiles!needs_owner_id_fkey(id,name,zip),helper:profiles!needs_helper_id_fkey(id,name)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const need = data as unknown as NeedWithOwner;

  const isOwner = user?.id === need.owner_id;
  const isPickedHelper = Boolean(user) && user?.id === need.helper_id;
  const matched =
    (need.status === "taken" || need.status === "done") && (isOwner || isPickedHelper);

  let responses: ResponseRow[] = [];
  let myResponse: ResponseRow | null = null;
  let myThreadId: string | null = null;
  let phone: string | null = null;

  if (isOwner) {
    const { data: rows } = await supabase
      .from("responses")
      .select(
        "id,need_id,helper_id,message,status,created_at,helper:profiles!responses_helper_id_fkey(id,name,zip)",
      )
      .eq("need_id", id)
      .order("created_at", { ascending: true });
    responses = (rows ?? []) as unknown as ResponseRow[];
  } else if (user) {
    const { data: mine } = await supabase
      .from("responses")
      .select("id,need_id,helper_id,message,status,created_at")
      .eq("need_id", id)
      .eq("helper_id", user.id)
      .maybeSingle();
    myResponse = (mine as ResponseRow | null) ?? null;
    if (myResponse) {
      const [a, b] = [user.id, need.owner_id].sort();
      const { data: thread } = await supabase
        .from("threads")
        .select("id")
        .eq("a_id", a)
        .eq("b_id", b)
        .eq("need_id", id)
        .maybeSingle();
      myThreadId = thread?.id ?? null;
    }
  }

  if (matched && user) {
    const other = isOwner ? need.helper_id : need.owner_id;
    if (other) {
      const { data: p } = await supabase.rpc("contact_for", { other });
      phone = (p as string | null) ?? null;
    }
  }

  const pay = formatPay(need.pay_type, need.pay_amount);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8">
      <Link href="/" className="text-sm text-ink-2 hover:text-ink">
        ← All jobs
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Pill>{categoryLabel(need.category)}</Pill>
        <Pill tone={statusTone(need.status)}>{STATUS_LABEL[need.status]}</Pill>
        <span className="text-xs text-muted">posted {timeAgo(need.created_at)}</span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
        {need.title}
      </h1>

      <dl className="mt-5 grid gap-3 border-y border-line py-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Pay</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{pay}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">When</dt>
          <dd className="mt-0.5 font-semibold">{need.when_text ?? "Flexible"}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Where</dt>
          <dd className="mt-0.5 font-semibold">{formatPlace(need.zip, need.area)}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Posted by</dt>
          <dd className="mt-0.5 font-semibold">{need.owner?.name ?? "Neighbor"}</dd>
        </div>
      </dl>

      <p className="mt-6 max-w-prose whitespace-pre-line text-ink-2">
        {need.description}
      </p>

      {/* Matched: show the other person's phone. */}
      {matched && (
        <section className="mt-8 border border-sign bg-sign/30 p-5">
          <h2 className="font-display text-xl font-bold">
            {isOwner
              ? `You picked ${need.helper?.name ?? "a helper"}.`
              : "You were picked for this job."}
          </h2>
          <p className="mt-1 text-sm text-ink-2">
            {phone
              ? `Phone: ${phone}`
              : "They haven’t added a phone number yet. Use messages to sort out the details."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <form
              action={startThread.bind(
                null,
                (isOwner ? need.helper_id : need.owner_id) ?? "",
                need.id,
                `/jobs/${need.id}`,
              )}
            >
              <SubmitButton className={btnSecondary} pendingText="Opening…">
                Open messages
              </SubmitButton>
            </form>
            {isOwner && need.status === "taken" && (
              <form action={setNeedStatus.bind(null, need.id, "done")}>
                <SubmitButton pendingText="Saving…">Mark as done</SubmitButton>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Owner: manage responses. */}
      {isOwner && (
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-bold">
              {responses.length === 0
                ? "No responses yet"
                : `${responses.length} ${responses.length === 1 ? "response" : "responses"}`}
            </h2>
            <div className="flex flex-wrap gap-2">
              {need.status === "open" && (
                <Link href={`/jobs/${need.id}/edit`} className={btnSecondary}>
                  Edit
                </Link>
              )}
              {(need.status === "open" || need.status === "taken") && (
                <form action={setNeedStatus.bind(null, need.id, "cancelled")}>
                  <SubmitButton className={btnDanger} pendingText="Cancelling…">
                    Cancel job
                  </SubmitButton>
                </form>
              )}
            </div>
          </div>

          {responses.length === 0 ? (
            <p className="mt-3 text-ink-2">
              Helpers nearby can see this job now. You’ll see their messages here.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {responses.map((r) => (
                <li key={r.id} className="flex gap-3 border border-line bg-white p-4">
                  <Avatar name={r.helper?.name ?? "?"} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{r.helper?.name ?? "Helper"}</span>
                      {r.helper?.zip && (
                        <span className="text-xs text-muted">{r.helper.zip}</span>
                      )}
                      <Pill tone={statusTone(r.status)}>
                        {r.status === "pending" ? "Waiting" : r.status === "picked" ? "Picked" : "Declined"}
                      </Pill>
                      <span className="ml-auto text-xs text-muted">{timeAgo(r.created_at)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-line text-ink-2">{r.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {need.status === "open" && r.status === "pending" && (
                        <>
                          <form action={pickHelper.bind(null, need.id, r.id)}>
                            <SubmitButton pendingText="Picking…">Pick {r.helper?.name?.split(" ")[0] ?? "them"}</SubmitButton>
                          </form>
                          <form action={declineResponse.bind(null, need.id, r.id)}>
                            <SubmitButton className={btnSecondary} pendingText="…">Decline</SubmitButton>
                          </form>
                        </>
                      )}
                      <form action={startThread.bind(null, r.helper_id, need.id, `/jobs/${need.id}`)}>
                        <SubmitButton className={btnSecondary} pendingText="Opening…">Message</SubmitButton>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Visitor / helper: respond. */}
      {!isOwner && (
        <section className="mt-8 border border-line bg-bg-2 p-5">
          {need.status !== "open" && !isPickedHelper ? (
            <p className="text-ink-2">
              This job is {STATUS_LABEL[need.status].toLowerCase()}, so it isn’t taking responses.
            </p>
          ) : !user ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-ink-2">Want to do this job?</p>
              <Link href={`/login?next=${encodeURIComponent(`/jobs/${need.id}`)}`} className={btnPrimary}>
                Log in to respond
              </Link>
              <Link href={`/signup?next=${encodeURIComponent(`/jobs/${need.id}`)}`} className={btnSecondary}>
                Create account
              </Link>
            </div>
          ) : myResponse ? (
            <div className="grid gap-3">
              <Alert tone={myResponse.status === "declined" ? "info" : "success"}>
                {myResponse.status === "picked"
                  ? "You were picked. Sort out the details in messages."
                  : myResponse.status === "declined"
                    ? "The poster went with someone else this time."
                    : "You responded. The poster will see it and can message you."}
              </Alert>
              <p className="text-sm text-ink-2">You said: “{myResponse.message}”</p>
              {myThreadId && (
                <Link href={`/messages/${myThreadId}`} className={`${btnSecondary} justify-self-start`}>
                  Open conversation
                </Link>
              )}
            </div>
          ) : (
            <RespondForm needId={need.id} />
          )}
        </section>
      )}
    </main>
  );
}
