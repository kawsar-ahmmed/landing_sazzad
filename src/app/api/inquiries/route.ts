import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, phone, message = "", colorChoice } = await request.json();
    if (typeof name !== "string" || typeof phone !== "string" || !name.trim() || !phone.trim()) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }
    const selectedColor = Number(colorChoice);
    if (!Number.isInteger(selectedColor) || selectedColor < 1 || selectedColor > 9) {
      return NextResponse.json({ error: "Please select a color" }, { status: 400 });
    }
    await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS color_choice SMALLINT");
    await pool.query(
      "INSERT INTO inquiries (name, phone, message, color_choice) VALUES ($1, $2, $3, $4)",
      [name.trim(), phone.trim(), typeof message === "string" ? message.trim() : "", selectedColor],
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Inquiry error", error);
    return NextResponse.json({ error: "Unable to save inquiry" }, { status: 500 });
  }
}
