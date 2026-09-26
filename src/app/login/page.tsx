import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";
import { Alert, PageTitle } from "@/components/ui";
import { first, safeNext } from "@/lib/form";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage(props: PageProps<"/login">) {
  const sp = await props.searchParams;
  const next = safeNext(first(sp.next));
  const check = first(sp.check) === "1";

  return (
    <main className="mx-auto w-full max-w-md px-5 py-10">
      <PageTitle>Log in</PageTitle>
      {check && (
        <div className="mb-5">
          <Alert tone="info">
            Almost there. Check your email for a confirmation link, then log in here.
          </Alert>
        </div>
      )}
      <LoginForm next={next} />
      <p className="mt-6 text-sm text-ink-2">
        New here?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="font-semibold underline hover:text-ink"
        >
          Create an account
        </Link>
      </p>
    </main>
  );
}
