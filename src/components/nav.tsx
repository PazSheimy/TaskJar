import Link from "next/link";
import { getUser } from "@/lib/auth";
import { btnPrimary, btnSecondary } from "@/components/ui";

export async function Nav() {
  const user = await getUser();

  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold tracking-tight"
        >
          TaskJar
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-ink-2">
          <Link href="/" className="hover:text-ink">
            Jobs
          </Link>
          <Link href="/helpers" className="hover:text-ink">
            Helpers
          </Link>
          <Link href="/money" className="hover:text-ink">
            Money plan
          </Link>
          {user && (
            <Link href="/messages" className="hover:text-ink">
              Messages
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/jobs/new" className={btnPrimary}>
            Post a job
          </Link>
          {user ? (
            <Link href="/account" className={btnSecondary}>
              Account
            </Link>
          ) : (
            <Link href="/login" className={btnSecondary}>
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
