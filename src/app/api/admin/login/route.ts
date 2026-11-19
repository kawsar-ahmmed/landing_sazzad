import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "ব্যবহারকারীর নাম ও পাসওয়ার্ড দিন।" }, { status: 400 });
    }

    const session = createAdminSession(username, password);
    if (session.result === "unconfigured") {
      return NextResponse.json({ error: "অ্যাডমিন লগইন কনফিগার করা নেই।" }, { status: 503 });
    }
    if (session.result !== "authorized") {
      return NextResponse.json({ error: "ব্যবহারকারীর নাম বা পাসওয়ার্ড সঠিক নয়।" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: session.maxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "লগইন করা যায়নি। আবার চেষ্টা করুন।" }, { status: 400 });
  }
}
