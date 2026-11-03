import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (password.trim() === adminPassword.trim()) {
      const cookieStore = await cookies();
      const signed = await signAdminSession("authenticated");
      cookieStore.set({
        name: "admin_session",
        value: signed,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Password salah" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "admin_session",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ success: true });
}
