const crypto = require("crypto");

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD required");
  }
  return secret;
}

export function signAdminSession(value: string): string {
  const secret = getSecret();
  const sig = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${sig}`;
}

export function unsignAdminSession(signed: string | undefined): string | null {
  if (!signed) return null;
  const parts = signed.split(".");
  if (parts.length < 2) return null;
  const sig = parts.pop()!;
  const value = parts.join(".");
  try {
    const secret = getSecret();
    const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
    if (crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) {
      return value;
    }
  } catch {
    return null;
  }
  return null;
}

export function isAdminAuthed(signed: string | undefined): boolean {
  return unsignAdminSession(signed) === "authenticated";
}
