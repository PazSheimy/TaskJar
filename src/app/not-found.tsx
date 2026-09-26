import Link from "next/link";
import { btnPrimary, PageTitle } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <PageTitle sub="It may have been removed, or the link is wrong.">
        That page doesn’t exist.
      </PageTitle>
      <Link href="/" className={btnPrimary}>
        Back to jobs
      </Link>
    </main>
  );
}
