import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { checkAdminSession } from "@/lib/admin-auth";

function authError(request: Request) {
  const auth = checkAdminSession(request.headers.get("cookie"));
  if (auth === "authorized") return null;
  return NextResponse.json(
    { error: auth === "unconfigured" ? "Admin access is not configured" : "Authentication required" },
    { status: auth === "unconfigured" ? 503 : 401 },
  );
}

async function ensureOrderColumns() {
  await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS quantity SMALLINT NOT NULL DEFAULT 1");
  await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS delivery_zone VARCHAR(30) NOT NULL DEFAULT 'inside-dhaka'");
  await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) NOT NULL DEFAULT 'cod'");
  await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS unit_price INTEGER NOT NULL DEFAULT 1550");
  await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS delivery_fee INTEGER NOT NULL DEFAULT 80");
  await pool.query("ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending'");
}

export async function GET(request: Request) {
  const denied = authError(request);
  if (denied) return denied;
  try {
    await ensureOrderColumns();
    const { rows } = await pool.query(
      `SELECT id, name, phone, message, color_choice AS "colorChoice", quantity,
        delivery_zone AS "deliveryZone", payment_method AS "paymentMethod", unit_price AS "unitPrice",
        delivery_fee AS "deliveryFee", status, created_at AS "createdAt"
       FROM inquiries ORDER BY created_at DESC`,
    );
    return NextResponse.json({ orders: rows });
  } catch (error) {
    console.error("Orders error", error);
    return NextResponse.json({ error: "Unable to load orders" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const denied = authError(request);
  if (denied) return denied;
  try {
    const { id, status } = await request.json();
    if (!Number.isInteger(Number(id)) || !["sent", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
    }
    await ensureOrderColumns();
    const { rowCount } = await pool.query(
      "UPDATE inquiries SET status = $1 WHERE id = $2",
      [status, Number(id)],
    );
    if (!rowCount) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Order update error", error);
    return NextResponse.json({ error: "Unable to update order" }, { status: 500 });
  }
}
