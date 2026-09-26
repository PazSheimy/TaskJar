import Link from "next/link";
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth-forms";
import { PageTitle } from "@/components/ui";
import { first, safeNext } from "@/lib/form";

export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage(props: PageProps<"/signup">) {
  const sp = await props.searchParams;
  const next = safeNext(first(sp.next));

  return (
    <main className="mx-auto w-full max-w-md px-5 py-10">
      <PageTitle sub="One account for both sides: post jobs, or pick them up.">
        Create account
      </PageTitle>
      <SignupForm next={next} />
      <p className="mt-6 text-sm text-ink-2">
        Already have one?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="font-semibold underline hover:text-ink"
        >
          Log in
        </Link>
      </p>
      <p className="mt-8 text-xs text-muted">
        By creating an account you confirm you’re 18 or older. TaskJar connects
        neighbors; you agree on price and payment directly with each other.
      </p>
    </main>
  );
}
