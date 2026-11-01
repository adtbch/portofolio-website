import { createClient } from "@supabase/supabase-js";

// ponytail: server-only. No anon fallback for service role.
// Upgrade path: @supabase/ssr createServerClient if migrating.
export function createServerSupabase(useServiceRole = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL missing");
  }

  const key = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error(
      useServiceRole
        ? "SUPABASE_SERVICE_ROLE_KEY missing"
        : "Supabase anon/publishable key missing"
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}
