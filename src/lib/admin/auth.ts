function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error("ADMIN_SESSION_SECRET is required");
  }
  return secret.trim();
}

async function hmac(value: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await globalThis.crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function signAdminSession(value: string): Promise<string> {
  return `${value}.${await hmac(value)}`;
}

export async function unsignAdminSession(signed: string | undefined): Promise<string | null> {
  if (!signed) return null;
  const parts = signed.split(".");
  if (parts.length < 2) return null;
  const sig = parts.pop()!;
  const value = parts.join(".");
  try {
    const expected = await hmac(value);
    if (sig.length !== expected.length) return null;
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) mismatch |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    return mismatch === 0 ? value : null;
  } catch {
    return null;
  }
}

export async function isAdminAuthed(signed: string | undefined): Promise<boolean> {
  return (await unsignAdminSession(signed)) === "authenticated";
}
