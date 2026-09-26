import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "./env";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Uses the signed-in user's session from cookies, so row level security applies.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = publicEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, which cannot set cookies.
          // proxy.ts refreshes the session cookie instead.
        }
      },
    },
  });
}
