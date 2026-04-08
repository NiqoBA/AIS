import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Cliente Supabase (anon) para rutas API: respeta RLS (p. ej. insert público en `contact_submissions`). */
export function createRouteHandlerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
