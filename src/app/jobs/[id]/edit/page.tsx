import Link from "next/link";
import { notFound } from "next/navigation";
import { NeedForm } from "@/components/need-form";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Need } from "@/lib/types";

export default async function EditJobPage(props: PageProps<"/jobs/[id]/edit">) {
  const { id } = await props.params;
  const user = await requireUser(`/jobs/${id}/edit`);
  const supabase = await createClient();
  const { data } = await supabase
    .from("needs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const need = data as Need | null;
  if (!need || need.owner_id !== user.id) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8">
      <Link href={`/jobs/${id}`} className="text-sm text-ink-2 hover:text-ink">
        ← Back to the job
      </Link>
      <div className="mt-4">
        <PageTitle>Edit job</PageTitle>
      </div>
      <NeedForm
        initial={{
          id: need.id,
          title: need.title,
          category: need.category,
          description: need.description,
          zip: need.zip ?? "",
          area: need.area ?? "",
          pay_type: need.pay_type,
          pay_amount: need.pay_amount?.toString() ?? "",
          when_text: need.when_text ?? "",
        }}
      />
    </main>
  );
}
