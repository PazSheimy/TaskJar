import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageForm } from "@/components/message-form";
import { Avatar } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { timeAgo } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Message, Need, Profile, Thread } from "@/lib/types";

type ThreadRow = Thread & {
  a: Pick<Profile, "id" | "name"> | null;
  b: Pick<Profile, "id" | "name"> | null;
  need: Pick<Need, "id" | "title" | "status" | "owner_id" | "helper_id"> | null;
};

export default async function ThreadPage(props: PageProps<"/messages/[id]">) {
  const { id } = await props.params;
  const user = await requireUser(`/messages/${id}`);
  const supabase = await createClient();

  const { data } = await supabase
    .from("threads")
    .select(
      "id,need_id,a_id,b_id,last_message_at,created_at,a:profiles!threads_a_id_fkey(id,name),b:profiles!threads_b_id_fkey(id,name),need:needs(id,title,status,owner_id,helper_id)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const thread = data as unknown as ThreadRow;
  const other = thread.a_id === user.id ? thread.b : thread.a;
  const otherId = thread.a_id === user.id ? thread.b_id : thread.a_id;

  const { data: rows } = await supabase
    .from("messages")
    .select("id,thread_id,sender_id,body,created_at")
    .eq("thread_id", id)
    .order("created_at", { ascending: true })
    .limit(500);
  const messages = (rows ?? []) as Message[];

  const { data: p } = await supabase.rpc("contact_for", { other: otherId });
  const phone = (p as string | null) ?? null;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-8">
      <Link href="/messages" className="text-sm text-ink-2 hover:text-ink">
        ← All messages
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <Avatar name={other?.name ?? "?"} size={44} />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {other?.name ?? "Neighbor"}
          </h1>
          {thread.need && (
            <p className="truncate text-sm text-ink-2">
              About{" "}
              <Link href={`/jobs/${thread.need.id}`} className="underline hover:text-ink">
                {thread.need.title}
              </Link>
            </p>
          )}
        </div>
      </div>

      {phone && (
        <p className="mt-4 border border-sign bg-sign/30 px-4 py-2 text-sm">
          You’re matched on a job, so here’s their phone:{" "}
          <a href={`tel:${phone}`} className="font-semibold underline">
            {phone}
          </a>
        </p>
      )}

      <ol className="mt-6 flex flex-1 flex-col gap-3">
        {messages.length === 0 && (
          <li className="text-sm text-muted">No messages yet. Say hi.</li>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === user.id;
          return (
            <li
              key={m.id}
              className={`max-w-[85%] ${mine ? "self-end" : "self-start"}`}
            >
              <div
                className={`whitespace-pre-line rounded-2xl px-4 py-2.5 ${
                  mine ? "bg-green text-white" : "border border-line bg-white"
                }`}
              >
                {m.body}
              </div>
              <div className={`mt-1 text-xs text-muted ${mine ? "text-right" : ""}`}>
                {timeAgo(m.created_at)}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 border-t border-line pt-4">
        <MessageForm threadId={thread.id} />
      </div>
    </main>
  );
}
