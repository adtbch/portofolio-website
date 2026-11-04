// reproduce certificates handleSave payload exactly
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter(l => l.includes("=")).map(l => {
    const i = l.indexOf("=");
    return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
  })
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data: certs, error: fetchErr } = await sb.from("certificates").select("*").limit(1);
if (fetchErr) { console.log("FETCH ERR:", fetchErr); process.exit(1); }
const c = certs[0];
console.log("target:", c.id, "|", c.title);
console.log("existing image_url:", c.image_url, "| image_public_id:", c.image_public_id);

// payload identical to handleSave when user only pastes a URL and uploads nothing
const payload = {
  title: c.title,
  issuer: c.issuer,
  issued_at: c.issued_at || null,
  credential_url: "https://example.com/credential",
  image_url: "https://example.com/link-only.jpg",
  image_public_id: null,
  sort_order: c.sort_order,
  published: c.published,
};

const { error } = await sb.from("certificates").update(payload).eq("id", c.id);
console.log("UPDATE error:", error ? JSON.stringify(error) : "none");

// insert test too (add flow)
const { error: insErr } = await sb.from("certificates").insert([{ ...payload, title: "__TEST_CERT_DELETE_ME__", issuer: "x", sort_order: 999 }]);
console.log("INSERT error:", insErr ? JSON.stringify(insErr) : "none");
if (!insErr) {
  await sb.from("certificates").delete().eq("title", "__TEST_CERT_DELETE_ME__");
  console.log("test row cleaned");
}

// restore
await sb.from("certificates").update({ credential_url: c.credential_url, image_url: c.image_url, image_public_id: c.image_public_id }).eq("id", c.id);
console.log("restored");
