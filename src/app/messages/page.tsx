import Link from "next/link";
import type { Metadata } from "next";
import { Avatar, btnSecondary, Empty, PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { timeAgo } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { ThreadListRow } from "@/lib/types";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const user = await requireUser("/messages");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("threads")
    .select(
      "id,need_id,a_id,b_id,last_message_at,created_at,a:profiles!threads_a_id_fkey(id,name),b:profiles!threads_b_id_fkey(id,name),need:needs(id,title),messages(body,created_at)",
    )
    .order("last_message_at", { ascending: false })
    .order("created_at", { referencedTable: "messages", ascending: false })
    .limit(1, { referencedTable: "messages" })
    .limit(100);
  if (error) console.error("threads query failed", error);
  const threads = (data ?? []) as unknown as ThreadListRow[];

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8">
      <PageTitle sub="Every job you responded to, and every person who wrote to you.">
        Messages
      </PageTitle>

      {threads.length === 0 ? (
        <Empty
          title="No conversations yet."
          text="Respond to a job, or message a helper, and it shows up here."
        >
          <Link href="/" className={btnSecondary}>
            Browse jobs
          </Link>
        </Empty>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {threads.map((t) => {
            const other = t.a_id === user.id ? t.b : t.a;
            const last = t.messages?.[0];
            return (
              <li key={t.id}>
                <Link
                  href={`/messages/${t.id}`}
                  className="flex gap-3 px-1 py-4 transition-colors hover:bg-bg-2"
                >
                  <Avatar name={other?.name ?? "?"} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold">{other?.name ?? "Neighbor"}</span>
                      {t.need && (
                        <span className="truncate text-sm text-ink-2">· {t.need.title}</span>
                      )}
                      <span className="ml-auto shrink-0 text-xs text-muted">
                        {timeAgo(t.last_message_at)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-ink-2">
                      {last?.body ?? "No messages yet"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
