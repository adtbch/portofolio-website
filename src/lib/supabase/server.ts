import { createClient } from "@supabase/supabase-js";

// ponytail: anon key only, no auth/cookies -> no @supabase/ssr needed.
// Upgrade path: swap in @supabase/ssr createServerClient when admin UI needs login.
export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { auth: { persistSession: false } });
}
