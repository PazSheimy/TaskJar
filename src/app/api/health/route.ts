import { envReport } from "@/lib/supabase/env";

/**
 * GET /api/health
 * Reports which settings the server can see, as yes/no only.
 * Handy when the site is deployed and something isn't connected.
 */
export function GET() {
  const env = envReport();
  const ok =
    env.NEXT_PUBLIC_SUPABASE_URL &&
    (env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  return Response.json(
    { ok, env, checkedAt: new Date().toISOString() },
    { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } },
  );
}
