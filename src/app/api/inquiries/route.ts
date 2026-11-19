import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, phone, message = "", colorChoice, quantity = 1, deliveryZone = "inside-dhaka", payment = "cod" } = await request.json();
    if (typeof name !== "string" || typeof phone !== "string" || !name.trim() || !phone.trim()) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }
    const selectedColor = Number(colorChoice);
    if (!Number.isInteger(selectedColor) || selectedColor < 1 || selectedColor > 9) {
      return NextResponse.json({ error: "Please select a color" }, { status: 400 });
    }
    const orderQuantity = Number(quantity);
    if (!Number.isInteger(orderQuantity) || orderQuantity < 1 || orderQuantity > 99) {
      return NextResponse.json({ error: "Please select a valid quantity" }, { status: 400 });
    }
    if (!["inside-dhaka", "outside-dhaka"].includes(deliveryZone)) {
      return NextResponse.json({ error: "Please select a valid delivery area" }, { status: 400 });
    }
    if (!["cod", "bkash"].includes(payment)) {
      return NextResponse.json({ error: "Please select a valid payment method" }, { status: 400 });
    }
    const unitPrice = 1550;
    const deliveryFee = deliveryZone === "inside-dhaka" ? 80 : 150;
    await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS color_choice SMALLINT");
    await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS quantity SMALLINT NOT NULL DEFAULT 1");
    await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS delivery_zone VARCHAR(30) NOT NULL DEFAULT 'inside-dhaka'");
    await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) NOT NULL DEFAULT 'cod'");
    await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS unit_price INTEGER NOT NULL DEFAULT 1550");
    await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS delivery_fee INTEGER NOT NULL DEFAULT 80");
    await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending'");
    const { rows } = await pool.query(
      `INSERT INTO inquiries (name, phone, message, color_choice, quantity, delivery_zone, payment_method, unit_price, delivery_fee)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, phone, message, color_choice AS "colorChoice", quantity,
         delivery_zone AS "deliveryZone", payment_method AS "paymentMethod", unit_price AS "unitPrice",
         delivery_fee AS "deliveryFee", status, created_at AS "createdAt"`,
      [name.trim(), phone.trim(), typeof message === "string" ? message.trim() : "", selectedColor, orderQuantity, deliveryZone, payment, unitPrice, deliveryFee],
    );
    return NextResponse.json({ ok: true, order: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Inquiry error", error);
    return NextResponse.json({ error: "Unable to save inquiry" }, { status: 500 });
  }
}
