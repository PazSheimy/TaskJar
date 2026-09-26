import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const body = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TaskJar",
    template: "%s · TaskJar",
  },
  description:
    "Small jobs near you, posted by neighbors. Post a task or pick one up and earn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        <Nav />
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="border-t border-line">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-5 py-6 text-sm text-muted sm:flex-row sm:justify-between">
            <p>
              <span className="font-display font-bold text-ink">TaskJar</span> ·
              small jobs, near you
            </p>
            <p>
              You agree on the price and pay each other directly.{" "}
              <Link href="/waitlist" className="underline hover:text-ink">
                Not open in your area yet?
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
