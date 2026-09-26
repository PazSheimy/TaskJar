import type { Metadata } from "next";
import { NeedForm } from "@/components/need-form";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Post a job" };

export default async function NewJobPage() {
  const user = await requireUser("/jobs/new");
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("zip")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8">
      <PageTitle sub="Two minutes. Helpers nearby see it right away.">
        Post a job
      </PageTitle>
      <NeedForm initial={{ zip: profile?.zip ?? "" }} />
    </main>
  );
}
