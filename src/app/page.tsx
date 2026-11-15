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
import storyImage from "../color-img/big.jpg";

const colorImages = [color1, color2, color3, color4, color5, color6, color7, color8, color9];

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [colorChoice, setColorChoice] = useState(1);
  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending");
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try { const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error("Request failed"); setStatus("sent"); event.currentTarget.reset(); } catch { setStatus("error"); }
  }
  return <main>
    <div className="announcement">ঢাকার ভেতরে ক্যাশ অন ডেলিভারি • সারা বাংলাদেশে কুরিয়ার</div>
    <nav className="nav shell"><a className="brand" href="#home"><span>SS</span> Supreme Saree</a><div className="nav-links"><a href="#collection">কালেকশন</a><a href="#story">আমাদের গল্প</a><a href="#contact">যোগাযোগ</a></div><a className="nav-cta" href="#contact">অর্ডার করুন <b>↗</b></a></nav>
    <section id="home" className="hero shell"><div className="hero-copy"><h1>শাড়ি শুধু পোশাক নয়,<br /><em>এটা আপনার প্রকাশ।</em></h1><p className="intro">বাংলার ঐতিহ্য আর আধুনিক সৌন্দর্যের মেলবন্ধনে তৈরি আমাদের প্রতিটি শাড়ি। নিজের মতো করে সাজুন, নিজের গল্প বলুন।</p><div className="hero-actions"><a className="button primary" href="#contact">অর্ডার করুন <span>→</span></a><a className="button whatsapp" href="https://wa.me/8801700000000?text=%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%B6%E0%A6%BE%E0%A7%9C%E0%A6%BF%20%E0%A6%85%E0%A6%B0%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4" target="_blank" rel="noreferrer">WhatsApp <span>◉</span></a></div><p className="price-highlight"><span>শুরু মাত্র</span> ৳ ১,৫৫০ <small>থেকে</small></p><div className="hero-proof"><div className="avatars"><i>R</i><i>S</i><i>M</i></div><p><strong>২,০০০+</strong> আনন্দিত ক্রেতা<br />সারা বাংলাদেশে</p></div></div><div className="hero-visual"><Image className="hero-photo" src={color1} alt="সবুজ শাড়ি" fill priority sizes="(max-width: 760px) 100vw, 50vw" /></div></section>
    <section className="promise"><div className="shell promise-grid"><p><span>01</span> নির্বাচিত সুতা</p><p><span>02</span> দক্ষ কারিগরের কাজ</p><p><span>03</span> যত্নে প্যাকেজিং</p><p><span>04</span> সহজ রিটার্ন</p></div></section>
    <section id="collection" className="collection shell"><div className="section-head"><div><h2>নতুন কালেকশন</h2></div></div><div className="color-grid">{colorImages.map((image, index) => <figure className="color-image" key={index}><Image src={image} alt="" fill sizes="(max-width: 760px) 50vw, 33vw" /></figure>)}</div></section>
    <section id="story" className="story"><div className="shell story-grid"><div className="story-art"><Image className="story-photo" src={storyImage} alt="Supreme Saree-এর শাড়ি" fill sizes="(max-width: 760px) 100vw, 50vw" /></div><div className="story-copy"><h2>তাঁত থেকে<br /><em>আপনার আলমারি</em></h2><p>Supreme Saree শুরু হয়েছিল খুব ছোট করে—বাংলার তাঁতিদের অসাধারণ কাজ আরও মানুষের কাছে পৌঁছে দেওয়ার স্বপ্ন নিয়ে। আজও আমরা প্রতিটি শাড়ির পেছনের মানুষ আর গল্পটাকে সবার আগে রাখি।</p><a className="button outline" href="#contact">এখনই অর্ডার করুন <span>→</span></a></div></div></section>
    <section id="contact" className="contact shell"><div><h2>অর্ডার করুন —<br />ফ্রি ক্যাশ অন ডেলিভারি</h2></div><form onSubmit={submitInquiry} className="inquiry-form"><label>আপনার নাম<input required name="name" placeholder="নাম লিখুন" /></label><label>মোবাইল নম্বর<input required name="phone" type="tel" placeholder="০১XXXXXXXXX" /></label><fieldset className="color-picker"><legend>পছন্দের রঙ নির্বাচন করুন</legend><div className="selected-color"><Image src={colorImages[colorChoice - 1]} alt={`নির্বাচিত রঙ ${colorChoice}`} fill sizes="320px" /><span>রঙ {colorChoice}</span></div><div className="color-strip">{colorImages.map((image, index) => <button className={colorChoice === index + 1 ? "color-option selected" : "color-option"} type="button" key={index} onClick={() => setColorChoice(index + 1)} aria-pressed={colorChoice === index + 1} aria-label={`রঙ ${index + 1} নির্বাচন করুন`}><Image src={image} alt="" fill sizes="72px" /></button>)}</div><input type="hidden" name="colorChoice" value={colorChoice} /></fieldset><label>ডেলিভারির ঠিকানা<textarea required name="message" placeholder="বাড়ি নম্বর, রাস্তা, এলাকা, থানা ও জেলা লিখুন" rows={3} /></label><button className="button primary order-submit" disabled={status === "sending"}>{status === "sending" ? "অর্ডার নেওয়া হচ্ছে..." : "এখনই অর্ডার করুন"}</button>{status === "sent" && <p className="form-ok">ধন্যবাদ! খুব শিগগিরই আপনার সঙ্গে যোগাযোগ করব।</p>}{status === "error" && <p className="form-error">দুঃখিত, আবার চেষ্টা করুন।</p>}</form></section>
    <footer><div className="shell footer-inner"><a className="brand" href="#home"><span>SS</span> Supreme Saree</a><p>© 2026 Supreme Saree</p></div></footer>
  </main>;
}
