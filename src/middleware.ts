import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/admin/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("admin_session")?.value;
  if (!(await isAdminAuthed(cookie))) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return await NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
