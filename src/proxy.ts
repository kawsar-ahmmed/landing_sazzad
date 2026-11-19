import { NextResponse, type NextRequest } from "next/server";
import { checkAdminSession } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const auth = checkAdminSession(request.headers.get("cookie"));
  if (auth === "authorized") return NextResponse.next();
  if (auth === "unconfigured") return new NextResponse("Admin access is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.", { status: 503 });
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.username = "";
  loginUrl.password = "";
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/admin/:path*", "/api/orders"] };
