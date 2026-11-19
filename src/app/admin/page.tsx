"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Order = {
  id: number;
  name: string;
  phone: string;
  message: string;
  colorChoice: number | null;
  quantity: number;
  deliveryZone: "inside-dhaka" | "outside-dhaka";
  paymentMethod: "cod" | "bkash";
  unitPrice: number;
  deliveryFee: number;
  status: "pending" | "sent" | "cancelled";
  createdAt: string;
};

const colors = ["অলিভ", "বেইজ", "গোল্ড", "ল্যাভেন্ডার", "টিল", "কোরাল", "রানি পিংক", "বার্ন্ট অরেঞ্জ", "স্কাই ব্লু"];
const money = (value: number) => `৳ ${value.toLocaleString("bn-BD")}`;
const date = (value: string) => new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
const orderAmount = (order: Order) => (order.unitPrice || 1550) * (order.quantity || 1) + (order.deliveryFee || 0);

function summarize(orders: Order[]) {
  return orders.reduce((summary, order) => ({ count: summary.count + 1, amount: summary.amount + orderAmount(order) }), { count: 0, amount: 0 });
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      if (!response.ok) throw new Error("অর্ডার লোড করা যায়নি");
      const data = await response.json();
      setOrders(data.orders);
    } catch {
      setError("অর্ডার লোড করা যায়নি। ডেটাবেস সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/orders", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("অর্ডার লোড করা যায়নি");
        return response.json();
      })
      .then((data) => { if (active) setOrders(data.orders); })
      .catch(() => { if (active) setError("অর্ডার লোড করা যায়নি। ডেটাবেস সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => ({
    all: summarize(orders),
    active: summarize(orders.filter((order) => order.status === "pending")),
    sent: summarize(orders.filter((order) => order.status === "sent")),
    cancelled: summarize(orders.filter((order) => order.status === "cancelled")),
  }), [orders]);
  const visibleOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  async function updateStatus(order: Order, status: "sent" | "cancelled") {
    setUpdating(order.id);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status }),
      });
      if (!response.ok) throw new Error("অর্ডার আপডেট করা যায়নি");
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item));
    } catch {
      setError("অর্ডারের অবস্থা আপডেট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/"><span>SS</span><span>Supreme Saree<small>ORDER DESK</small></span></Link>
        <div className="admin-nav-label">WORKSPACE</div>
        <Link className="admin-nav active" href="/admin"><span>▦</span> অর্ডার ম্যানেজমেন্ট</Link>
        <Link className="admin-nav" href="/"><span>↗</span> ওয়েবসাইট দেখুন</Link>
        <div className="sidebar-bottom"><span className="online-dot" /> অর্ডার ডেস্ক <small>ADMIN PANEL</small></div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar"><div className="breadcrumb">Workspace <span>/</span> <b>অর্ডার ম্যানেজমেন্ট</b></div><Link href="/" className="store-link">Supreme Saree <span>↗</span></Link></header>
        <div className="admin-content">
          <div className="admin-heading"><div><p className="admin-kicker">ORDER OVERVIEW</p><h1>অর্ডার ম্যানেজমেন্ট</h1><p className="admin-subtitle">আপনার সব অর্ডার এক জায়গায় দেখুন এবং কুরিয়ারে পাঠান।</p></div><button className="refresh-button" type="button" onClick={() => void loadOrders()} disabled={loading}><span className={loading ? "refresh-icon spinning" : "refresh-icon"}>↻</span> রিফ্রেশ</button></div>

          <div className="admin-stats">
            <article className="stat-card"><div className="stat-top"><span>সর্বমোট অর্ডার</span><i className="stat-icon total-icon">▤</i></div><strong>{loading || (error && orders.length === 0) ? "—" : stats.all.count.toLocaleString("bn-BD")}</strong><small className="stat-amount">{loading || (error && orders.length === 0) ? "মোট মূল্য —" : `মোট মূল্য ${money(stats.all.amount)}`}</small></article>
            <article className="stat-card"><div className="stat-top"><span>সক্রিয় অর্ডার</span><i className="stat-icon pending-icon">◷</i></div><strong>{loading || (error && orders.length === 0) ? "—" : stats.active.count.toLocaleString("bn-BD")}</strong><small className="stat-amount">{loading || (error && orders.length === 0) ? "মোট মূল্য —" : `মোট মূল্য ${money(stats.active.amount)}`}</small></article>
            <article className="stat-card"><div className="stat-top"><span>কুরিয়ারে পাঠানো</span><i className="stat-icon sent-icon">↗</i></div><strong>{loading || (error && orders.length === 0) ? "—" : stats.sent.count.toLocaleString("bn-BD")}</strong><small className="stat-amount">{loading || (error && orders.length === 0) ? "মোট মূল্য —" : `মোট মূল্য ${money(stats.sent.amount)}`}</small></article>
            <article className="stat-card"><div className="stat-top"><span>বাতিল অর্ডার</span><i className="stat-icon cancelled-icon">×</i></div><strong>{loading || (error && orders.length === 0) ? "—" : stats.cancelled.count.toLocaleString("bn-BD")}</strong><small className="stat-amount">{loading || (error && orders.length === 0) ? "মোট মূল্য —" : `মোট মূল্য ${money(stats.cancelled.amount)}`}</small></article>
          </div>

          <section className="orders-panel">
            <div className="orders-panel-head"><div><h2>অর্ডার তালিকা</h2><p>সাম্প্রতিক অর্ডারগুলো আগে দেখানো হচ্ছে</p></div><div className="order-filters" aria-label="অর্ডার ফিল্টার"><button onClick={() => setFilter("all")} className={filter === "all" ? "selected" : ""}>সব <span>{stats.all.count}</span></button><button onClick={() => setFilter("pending")} className={filter === "pending" ? "selected" : ""}>সক্রিয়</button><button onClick={() => setFilter("sent")} className={filter === "sent" ? "selected" : ""}>কুরিয়ারে পাঠানো</button><button onClick={() => setFilter("cancelled")} className={filter === "cancelled" ? "selected" : ""}>বাতিল</button></div></div>
            {error && <div className="admin-error" role="alert">{error}</div>}
            <div className="orders-table-wrap"><table className="orders-table"><thead><tr><th>অর্ডার</th><th>ক্রেতা</th><th>প্রোডাক্ট</th><th>ঠিকানা</th><th>তারিখ</th><th>অবস্থা</th><th>অ্যাকশন</th></tr></thead><tbody>
              {loading ? <tr><td className="table-message" colSpan={7}>অর্ডার লোড হচ্ছে…</td></tr> : error && orders.length === 0 ? <tr><td className="table-message" colSpan={7}>ডেটাবেস সংযোগ পাওয়া গেলে অর্ডার এখানে দেখা যাবে।</td></tr> : visibleOrders.length === 0 ? <tr><td className="table-message" colSpan={7}>{orders.length === 0 ? "এখনও কোনো অর্ডার পাওয়া যায়নি।" : "এই ফিল্টারে কোনো অর্ডার নেই।"}</td></tr> : visibleOrders.map((order) => <tr key={order.id}>
                <td data-label="অর্ডার"><b className="order-number">#SS-{String(order.id).padStart(4, "0")}</b><small>{money(orderAmount(order))}</small></td>
                <td data-label="ক্রেতা"><b>{order.name}</b><a className="customer-phone" href={`tel:${order.phone}`}>{order.phone}</a></td>
                <td data-label="প্রোডাক্ট"><b>প্রিমিয়াম বুটিক শাড়ি</b><small>{colors[(order.colorChoice ?? 1) - 1] ?? colors[0]} · {order.quantity || 1} পিস</small><small>{order.deliveryZone === "outside-dhaka" ? "ঢাকার বাইরে" : "ঢাকার মধ্যে"} · {order.paymentMethod === "bkash" ? "বিকাশ" : "ক্যাশ অন ডেলিভারি"}</small></td>
                <td data-label="ঠিকানা" className="address-cell" title={order.message}>{order.message || "—"}</td>
                <td data-label="তারিখ" className="date-cell">{date(order.createdAt)}</td>
                <td data-label="অবস্থা"><span className={`status-badge ${order.status}`}><i />{order.status === "pending" ? "সক্রিয় অর্ডার" : order.status === "sent" ? "কুরিয়ারে পাঠানো" : "বাতিল"}</span></td>
                <td data-label="অ্যাকশন"><div className="row-actions">{order.status === "pending" && <><button className="courier-button" type="button" onClick={() => void updateStatus(order, "sent")} disabled={updating === order.id}>{updating === order.id ? "পাঠাচ্ছে…" : "কুরিয়ারে পাঠান"}</button><button className="cancel-button" type="button" title="অর্ডার বাতিল করুন" aria-label={`অর্ডার ${order.id} বাতিল করুন`} onClick={() => void updateStatus(order, "cancelled")} disabled={updating === order.id}>বাতিল</button></>}{order.status === "sent" && <span className="done-note">✓ পাঠানো হয়েছে</span>}{order.status === "cancelled" && <span className="done-note muted">বাতিল</span>}</div></td>
              </tr>)}
            </tbody></table></div>
            <div className="table-footer">মোট <b>{visibleOrders.length.toLocaleString("bn-BD")}</b> টি অর্ডার</div>
          </section>
          <footer className="admin-footer">© 2026 Supreme Saree <span>সুন্দর অর্ডার অভিজ্ঞতার জন্য</span></footer>
        </div>
      </section>
    </main>
  );
}
