"use server";

import { contactSchema } from "@/lib/validations/contact";
import { createServerSupabase } from "@/lib/supabase/server";
import { headers } from "next/headers";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
// ponytail: in-memory best-effort rate limit; no external store. Upgrade path: Redis/Upstash.
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientKey() {
  try {
    const h = headers();
    // headers() may be sync in some Next versions; handle both
    const headersObj: any = h as any;
    if (typeof headersObj?.get === "function") {
      const ip = headersObj.get("x-forwarded-for")?.split(",")[0]?.trim() || headersObj.get("x-real-ip") || "unknown";
      return ip;
    }
    // if it's a Promise-like in older contexts, skip; but Next 15+ headers() is sync? try to await not possible here
    return "unknown";
  } catch {
    return "unknown";
  }
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count += 1;
  hits.set(key, entry);
  return true;
}

export async function submitContact(formData: unknown) {
  try {
    const key = getClientKey();
    if (!checkRateLimit(key)) {
      return { ok: false, error: "Terlalu banyak permintaan. Coba lagi nanti." };
    }

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message || "Data tidak valid";
      return { ok: false, error: first };
    }

    const data = parsed.data;
    // honeypot
    if (data.website && data.website.length > 0) {
      return { ok: true };
    }

    const supabase = createServerSupabase();
    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        message: data.message,
      });

    if (error) {
      return { ok: false, error: "Gagal menyimpan pesan" };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: "Terjadi kesalahan" };
  }
}
