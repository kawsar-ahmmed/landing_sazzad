"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import color1 from "../color-img/1.jpg";
import color2 from "../color-img/2.jpg";
import color3 from "../color-img/3.jpg";
import color4 from "../color-img/4.jpg";
import color5 from "../color-img/5.jpg";
import color6 from "../color-img/6.jpg";
import color7 from "../color-img/7.jpg";
import color8 from "../color-img/8.jpg";
import color9 from "../color-img/9.jpg";
import detailImage from "../color-img/IMG-20261031-WA0007.jpg";
import storyImage from "../color-img/big.jpg";

const colorImages = [color1, color2, color3, color4, color5, color6, color7, color8, color9];
const heroImages = [...colorImages, detailImage, storyImage];
const colorNames = ["অলিভ", "বেইজ", "গোল্ড", "ল্যাভেন্ডার", "টিল", "কোরাল", "রানি পিংক", "বার্ন্ট অরেঞ্জ", "স্কাই ব্লু"];
const features = [
  "শাড়ি + ম্যাচিং ব্লাউজ পিস",
  "হাফ সিল্কের আরামদায়ক বুটিকস শাড়ি — প্রিমিয়াম কোয়ালিটি",
  "সম্পূর্ণ শাড়িতে সূক্ষ্ম বুনন — ক্লাসিক এবং নান্দনিক লুক",
  "আরামদায়ক ও দীর্ঘস্থায়ী প্রিমিয়াম ফ্যাব্রিক",
  "যত্নে তৈরি, প্রতিটি রঙে নজরকাড়া ডিজাইন",
  "সহজে পরা যায়, বিশেষ দিন ও প্রতিদিনের সাজে মানানসই",
  "১৪ হাত লম্বা শাড়ি",
  "রঙের উজ্জ্বলতা ধরে রাখতে যত্নসহকারে তৈরি",
  "সহজে রক্ষণাবেক্ষণ করা যায়",
  "উৎসব, বিয়ে বা উপহার — যেকোনো বিশেষ মুহূর্তের জন্য সুন্দর পছন্দ",
];

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [colorChoice, setColorChoice] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [heroSlide, setHeroSlide] = useState(0);
  const unitPrice = 1550;
  const moveHero = (direction: number) => setHeroSlide((current) => (current + direction + heroImages.length) % heroImages.length);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
      setQuantity(1);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main id="home">
      <div className="announcement">ঢাকার ভেতরে ক্যাশ অন ডেলিভারি <span>•</span> সারা বাংলাদেশে কুরিয়ার</div>
      <header className="nav shell">
        <a className="brand" href="#home"><span>SS</span> Supreme Saree</a>
        <a className="nav-cta" href="#order">অর্ডার করুন <b>↓</b></a>
      </header>

      <section className="lookbook shell" aria-label="শাড়ির ছবি">
        <div className="lookbook-title"><p className="eyebrow">SUPREME SAREE · NEW ARRIVAL</p><h1>শাড়ি পরলে যেন <em>বেশিই সুন্দর লাগে</em></h1></div>
        <div className="hero-slider" aria-label="শাড়ির ছবির স্লাইডার">
          <div className="hero-viewport">
            <div className="hero-track" style={{ width: `${heroImages.length * 100}%`, transform: `translateX(-${(heroSlide * 100) / heroImages.length}%)` }}>
              {heroImages.map((image, index) => <figure className="hero-slide" key={index}>
                <Image src={image} alt={`শাড়ির ছবি ${index + 1}`} fill priority={index === 0} sizes="(max-width: 700px) 100vw, 1050px" />
              </figure>)}
            </div>
            <button className="slider-arrow slider-prev" type="button" onClick={() => moveHero(-1)} aria-label="আগের ছবি">‹</button>
            <button className="slider-arrow slider-next" type="button" onClick={() => moveHero(1)} aria-label="পরের ছবি">›</button>
            <span className="slide-count">{String(heroSlide + 1).padStart(2, "0")} / {String(heroImages.length).padStart(2, "0")}</span>
          </div>
          <div className="slider-dots" aria-label="স্লাইড নির্বাচন করুন">{heroImages.map((_, index) => <button type="button" key={index} onClick={() => setHeroSlide(index)} className={heroSlide === index ? "slider-dot active" : "slider-dot"} aria-label={`ছবি ${index + 1}`} aria-current={heroSlide === index ? "true" : undefined} />)}</div>
        </div>
      </section>

      <section className="trust-card" aria-label="ক্রেতাদের আস্থা">
        <span className="verified"><i /> যাচাইকৃত কোয়ালিটি</span>
        <strong className="trust-count">২,০০০+</strong>
        <p>আনন্দিত ক্রেতা আমাদের শাড়ি বেছে নিয়েছেন</p>
        <div className="trust-pills"><span>✓ হাতে দেখে নিন</span><span>✦ কোয়ালিটি নিশ্চিত</span></div>
        <div className="trust-note">শাড়ি দেখে Quality বুঝে তারপর Payment করবেন</div>
      </section>

      <section className="product-intro shell">
        <a className="big-cta" href="#order">অর্ডার করতে চাই <span>→</span></a>
        <h2>বাংলার ঐতিহ্যে আধুনিক <em>বুটিক শাড়ি</em></h2>
        <div className="zigzag" aria-hidden="true" />
        <ul className="feature-list">{features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
      </section>

      <section className="quality-banner shell"><span>প্রিমিয়াম কোয়ালিটির নিশ্চয়তা</span></section>

      <section className="offer-card" aria-label="অর্ডারের মূল্য">
        <div className="offer-top"><span>◷ অর্ডারের মূল্য</span><span className="offer-live"><i /> ক্যাশ অন ডেলিভারি</span></div>
        <div className="offer-body"><div className="offer-price"><strong>৳ ১,৫৫০</strong><small>প্রতি পিস</small></div><div className="offer-copy"><b>সহজে অর্ডার করুন</b><p>শাড়ি হাতে পেয়ে দেখে তারপর পেমেন্ট করুন</p><div><span>প্রিমিয়াম ফ্যাব্রিক</span><span>ম্যাচিং ব্লাউজ পিস</span></div></div></div>
        <div className="offer-foot"><span>✓ সারা বাংলাদেশে কুরিয়ার</span><span>সহজ অর্ডার প্রক্রিয়া</span></div>
      </section>

      <section className="order-intro shell"><p>অগ্রিম পেমেন্ট ছাড়াই নিচে নাম, মোবাইল নম্বর ও ঠিকানা দিয়ে অর্ডার করুন</p></section>

      <section id="order" className="order-section shell">
        <div className="order-heading"><div><p className="eyebrow">আপনার পছন্দের রঙ বেছে নিন</p><h2>অর্ডার ফর্ম</h2></div><div className="price-tag">৳ ১,৫৫০ <small>/ পিস</small></div></div>
        <form onSubmit={submitInquiry} className="checkout-form">
          <fieldset className="product-picker">
            <legend>প্রোডাক্টের রঙ নির্বাচন করুন</legend>
            <div className="product-slider"><div className="product-grid">{colorImages.map((image, index) => <button type="button" key={index} onClick={() => setColorChoice(index + 1)} className={colorChoice === index + 1 ? "product-option chosen" : "product-option"} aria-pressed={colorChoice === index + 1}>
              <span className="radio-dot" />
              <span className="product-thumb"><Image src={image} alt={`${colorNames[index]} শাড়ি`} fill sizes="90px" /></span>
              <span className="product-details"><b>প্রিমিয়াম বুটিক শাড়ি</b><small>{colorNames[index]} রঙ</small><span className="mini-quantity"><span>৳ ১,৫৫০</span></span></span>
            </button>)}</div></div>
            <input type="hidden" name="colorChoice" value={colorChoice} />
          </fieldset>

          <div className="billing-title"><h3>Billing details</h3><span>★ প্রয়োজনীয় তথ্য দিন</span></div>
          <label className="form-field">আপনার নাম <b>*</b><input required name="name" placeholder="আপনার পূর্ণ নাম" autoComplete="name" /></label>
          <label className="form-field">ফোন নাম্বার (যে নাম্বারে রিসিভ করবেন) <b>*</b><input required name="phone" type="tel" placeholder="০১XXXXXXXXX" autoComplete="tel" /></label>
          <label className="form-field">সম্পূর্ণ ঠিকানা (যেখানে পার্সেল যাবে) <b>*</b><textarea required name="message" placeholder="বাড়ি/রোড, এলাকা, থানা ও জেলা লিখুন" rows={3} autoComplete="street-address" /></label>

          <div className="order-summary"><h3>Your order</h3><div className="summary-head"><b>Product</b><b>সাবটোটাল</b></div><div className="summary-item"><div className="summary-product"><span className="summary-thumb"><Image src={colorImages[colorChoice - 1]} alt={`${colorNames[colorChoice - 1]} রঙ`} fill sizes="80px" /></span><div><b>প্রিমিয়াম বুটিক শাড়ি</b><small>{colorNames[colorChoice - 1]} রঙ</small><div className="quantity-control"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="পরিমাণ কমান">−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="পরিমাণ বাড়ান">+</button></div></div></div><strong>৳ {(unitPrice * quantity).toLocaleString("bn-BD")}</strong></div><div className="summary-total"><span>সাবটোটাল</span><b>৳ {(unitPrice * quantity).toLocaleString("bn-BD")}</b></div><div className="summary-total total"><span>Total</span><b>৳ {(unitPrice * quantity).toLocaleString("bn-BD")}</b></div></div>
          <input type="hidden" name="quantity" value={quantity} />
          <fieldset className="payment-method"><legend>পেমেন্ট পদ্ধতি</legend><label><input type="radio" name="payment" value="cod" defaultChecked /> ক্যাশ অন ডেলিভারি <small>পণ্য হাতে পেয়ে পেমেন্ট করুন</small></label><label><input type="radio" name="payment" value="bkash" /> বিকাশে Payment করুন <span className="bkash-mark">bKash</span></label></fieldset>
          <button className="button primary order-submit" disabled={status === "sending"}>{status === "sending" ? "অর্ডার নেওয়া হচ্ছে..." : "অর্ডার কনফার্ম করুন"}<span>→</span></button>
          {status === "sent" && <p className="form-ok">ধন্যবাদ! আপনার অর্ডারের জন্য শিগগিরই যোগাযোগ করা হবে।</p>}
          {status === "error" && <p className="form-error">দুঃখিত, অর্ডার পাঠানো যায়নি। আবার চেষ্টা করুন।</p>}
        </form>
      </section>

      <section id="contact" className="contact-card shell"><span>যোগাযোগ করতে পারেন</span><div><a href="tel:+8801700000000">☎ কল করুন</a><a href="https://wa.me/8801700000000" target="_blank" rel="noreferrer">● WhatsApp</a><a href="https://m.me/" target="_blank" rel="noreferrer">● Messenger</a></div></section>
      <footer><div className="shell footer-inner"><a className="brand" href="#home"><span>SS</span> Supreme Saree</a><p>© 2026 Supreme Saree</p><a href="#order">অর্ডার ও যোগাযোগ</a></div></footer>
    </main>
  );
}
