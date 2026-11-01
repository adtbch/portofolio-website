import { createClient } from "@supabase/supabase-js";

// ponytail: anon key only, no auth/cookies -> no @supabase/ssr needed.
// Upgrade path: swap in @supabase/ssr createServerClient when admin UI needs login.
export function createServerSupabase(useServiceRole = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = useServiceRole
    ? (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  // If env vars missing (e.g., during static build), return a mock client that resolves empty data.
  if (!url || !key) {
    const mockChain = {
      eq: () => mockChain,
      order: () => mockChain,
      select: () => mockChain,
      single: async () => ({ data: null, error: null }),
    } as any;
    const mock = {
      from: () => mockChain,
    } as any;
    return mock;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
