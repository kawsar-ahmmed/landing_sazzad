import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, phone, message = "" } = await request.json();
    if (typeof name !== "string" || typeof phone !== "string" || !name.trim() || !phone.trim()) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }
    await pool.query("INSERT INTO inquiries (name, phone, message) VALUES ($1, $2, $3)", [name.trim(), phone.trim(), typeof message === "string" ? message.trim() : ""]);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Inquiry error", error);
    return NextResponse.json({ error: "Unable to save inquiry" }, { status: 500 });
  }
}
