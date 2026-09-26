import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client that uses the secret key.
 * It bypasses row level security, so only ever import it from
 * server code (server actions, route handlers). Never from a
 * client component.
 *
 * Returns null when the env vars are missing so the site still
 * renders before Supabase is connected.
 */
export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
