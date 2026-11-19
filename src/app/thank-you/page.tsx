"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderConfirmation = {
  id: number | string;
  name: string;
  phone: string;
  message: string;
  colorChoice: number;
  quantity: number;
  deliveryZone: "inside-dhaka" | "outside-dhaka";
  paymentMethod: "cod" | "bkash";
  unitPrice: number;
  deliveryFee: number;
};

const colorNames = ["অলিভ", "বেইজ", "গোল্ড", "ল্যাভেন্ডার", "টিল", "কোরাল", "রানি পিংক", "বার্ন্ট অরেঞ্জ", "স্কাই ব্লু"];
const money = (amount: number) => `৳ ${amount.toLocaleString("bn-BD")}`;

export default function ThankYouPage() {
  const [order, setOrder] = useState<OrderConfirmation | null>(null);

  useEffect(() => {
    let active = true;
    const savedOrder = window.sessionStorage.getItem("last-order-confirmation");
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder) as OrderConfirmation;
        Promise.resolve().then(() => { if (active) setOrder(parsedOrder); });
      } catch {
        window.sessionStorage.removeItem("last-order-confirmation");
      }
    }
    return () => { active = false; };
  }, []);

  const total = order ? order.unitPrice * order.quantity + order.deliveryFee : 0;

  return (
    <main className="thankyou-page">
      <div className="thankyou-wrap">
        <Link className="thankyou-brand" href="/"><span>SS</span> Supreme Saree</Link>
        <section className="thankyou-card" aria-live="polite">
          <div className="thankyou-check">✓</div>
          <p className="thankyou-eyebrow">SUPREME SAREE · ORDER CONFIRMATION</p>
          <h1>{order ? "ধন্যবাদ, আপনার অর্ডারটি সম্পন্ন হয়েছে!" : "ধন্যবাদ!"}</h1>
          <p className="thankyou-copy">{order ? "আপনার অর্ডারটি আমরা পেয়েছি। নিশ্চিত করতে আমাদের টিম শিগগিরই আপনার সঙ্গে যোগাযোগ করবে।" : "অর্ডারের তথ্য দেখতে অর্ডার সম্পন্ন করার পর এই পেজে আসুন।"}</p>

          {order && <>
            <div className="thankyou-order-id"><span>অর্ডার নম্বর</span><b>#SS-{String(order.id).padStart(4, "0")}</b></div>
            <div className="thankyou-details">
              <h2>অর্ডারের তথ্য</h2>
              <div><span>প্রোডাক্ট</span><b>প্রিমিয়াম বুটিক শাড়ি · {colorNames[(order.colorChoice ?? 1) - 1] ?? colorNames[0]}</b></div>
              <div><span>পরিমাণ</span><b>{order.quantity} পিস</b></div>
              <div><span>ডেলিভারি এলাকা</span><b>{order.deliveryZone === "inside-dhaka" ? "ঢাকার মধ্যে" : "ঢাকার বাইরে"}</b></div>
              <div><span>পেমেন্ট</span><b>{order.paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি" : "বিকাশ"}</b></div>
              <div className="thankyou-total"><span>সর্বমোট (ডেলিভারিসহ)</span><b>{money(total)}</b></div>
            </div>
            <div className="thankyou-details contact-details">
              <h2>যোগাযোগ ও ডেলিভারি</h2>
              <div><span>নাম</span><b>{order.name}</b></div>
              <div><span>ফোন</span><a href={`tel:${order.phone}`}>{order.phone}</a></div>
              <div className="address-row"><span>ঠিকানা</span><b>{order.message}</b></div>
            </div>
          </>}

          <div className="thankyou-contact"><span>প্রয়োজনে আমাদের সঙ্গে যোগাযোগ করুন</span><div><a href="tel:+8801700000000">☎ ফোন করুন</a><a href="https://wa.me/8801700000000" target="_blank" rel="noreferrer">WhatsApp</a></div></div>
          <Link className="thankyou-home" href="/">ওয়েবসাইটে ফিরে যান <span>→</span></Link>
        </section>
        <p className="thankyou-footer">© 2026 Supreme Saree</p>
      </div>
    </main>
  );
}
