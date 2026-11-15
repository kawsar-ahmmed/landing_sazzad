"use client";

import { FormEvent, useState } from "react";

const products = [
  { name: "নকশিকাঁথা সিল্ক", price: "৳ ২,৮৫০", tone: "#b9445f", detail: "হাতের কাজ • সিল্ক ব্লেন্ড", tag: "নতুন" },
  { name: "জামদানি অর্পিতা", price: "৳ ৪,২০০", tone: "#263d69", detail: "ঢাকাই জামদানি • কটন", tag: "সেরা পছন্দ" },
  { name: "টাঙ্গাইল প্রভা", price: "৳ ২,৩৫০", tone: "#d49437", detail: "তাঁতের শাড়ি • সুতি", tag: "" },
  { name: "মসলিন মেঘলা", price: "৳ ৩,৬৫০", tone: "#6e4d83", detail: "সফট মসলিন • হালকা কাজ", tag: "" },
];

function SariArt({ tone, index }: { tone: string; index: number }) {
  return <div className="sari-art" style={{ backgroundColor: tone }} aria-label="শাড়ির নকশা"><span className="fabric-fall" /><span className="fabric-border" /><span className={`motif motif-${index}`}>✦</span></div>;
}

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending");
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try { const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error("Request failed"); setStatus("sent"); event.currentTarget.reset(); } catch { setStatus("error"); }
  }
  return <main>
    <div className="announcement">ঢাকার ভেতরে ক্যাশ অন ডেলিভারি • সারা বাংলাদেশে কুরিয়ার</div>
    <nav className="nav shell"><a className="brand" href="#home"><span>শ</span> শাড়িঘর</a><div className="nav-links"><a href="#collection">কালেকশন</a><a href="#story">আমাদের গল্প</a><a href="#contact">যোগাযোগ</a></div><a className="nav-cta" href="#contact">অর্ডার করুন <b>↗</b></a></nav>
    <section id="home" className="hero shell"><div className="hero-copy"><p className="eyebrow">ঢাকার ঘরে ঘরে বোনা গল্প</p><h1>শাড়ি শুধু পোশাক নয়,<br /><em>এটা আপনার প্রকাশ।</em></h1><p className="intro">বাংলার ঐতিহ্য আর আধুনিক সৌন্দর্যের মেলবন্ধনে তৈরি আমাদের প্রতিটি শাড়ি। নিজের মতো করে সাজুন, নিজের গল্প বলুন।</p><div className="hero-actions"><a className="button primary" href="#collection">কালেকশন দেখুন <span>→</span></a><a className="button text" href="#story">আমাদের সম্পর্কে</a></div><div className="hero-proof"><div className="avatars"><i>R</i><i>S</i><i>M</i></div><p><strong>২,০০০+</strong> আনন্দিত ক্রেতা<br />সারা বাংলাদেশে</p></div></div><div className="hero-visual" aria-label="লাল জামদানি শাড়ির শিল্পিত উপস্থাপনা"><div className="sun-disc" /><div className="hero-sari"><div className="pallu" /><div className="woven-dots" /></div><div className="hero-card"><span>✦</span><div><b>হাতে বোনা</b><small>ভালোবাসা দিয়ে</small></div></div><p className="vertical-note">BENGAL • HANDWOVEN • 2024</p></div></section>
    <section className="promise"><div className="shell promise-grid"><p><span>01</span> নির্বাচিত সুতা</p><p><span>02</span> দক্ষ কারিগরের কাজ</p><p><span>03</span> যত্নে প্যাকেজিং</p><p><span>04</span> সহজ রিটার্ন</p></div></section>
    <section id="collection" className="collection shell"><div className="section-head"><div><p className="eyebrow">আমাদের পছন্দের</p><h2>নতুন কালেকশন</h2></div><a href="#contact">সব শাড়ি দেখুন <span>→</span></a></div><div className="product-grid">{products.map((product, index) => <article className="product" key={product.name}><div className="product-image">{product.tag && <span className="tag">{product.tag}</span>}<SariArt tone={product.tone} index={index} /><button aria-label={`${product.name} পছন্দ করুন`}>♡</button></div><div className="product-info"><p>{product.detail}</p><div><h3>{product.name}</h3><strong>{product.price}</strong></div></div></article>)}</div></section>
    <section id="story" className="story"><div className="shell story-grid"><div className="story-art"><div className="loom-lines" /><div className="story-sari" /><span>শ</span></div><div className="story-copy"><p className="eyebrow">আমাদের কথা</p><h2>তাঁত থেকে<br /><em>আপনার আলমারি</em></h2><p>শাড়িঘর শুরু হয়েছিল খুব ছোট করে—বাংলার তাঁতিদের অসাধারণ কাজ আরও মানুষের কাছে পৌঁছে দেওয়ার স্বপ্ন নিয়ে। আজও আমরা প্রতিটি শাড়ির পেছনের মানুষ আর গল্পটাকে সবার আগে রাখি।</p><a className="button outline" href="#contact">আমাদের গল্প জানুন <span>→</span></a></div></div></section>
    <section id="contact" className="contact shell"><div><p className="eyebrow">সঠিক শাড়িটি খুঁজছেন?</p><h2>আমাদের সঙ্গে কথা বলুন</h2><p>রঙ, উপলক্ষ কিংবা বাজেট জানান। আমরা আপনার জন্য সুন্দর কিছু বেছে দেব।</p><div className="contact-details"><span>ঢাকা, বাংলাদেশ</span><span>+৮৮০ ১৭০০-০০০০০০</span></div></div><form onSubmit={submitInquiry} className="inquiry-form"><label>আপনার নাম<input required name="name" placeholder="নাম লিখুন" /></label><label>মোবাইল নম্বর<input required name="phone" type="tel" placeholder="০১XXXXXXXXX" /></label><label>আপনার পছন্দ / প্রশ্ন<textarea name="message" placeholder="যেমন: বিয়ের জন্য লাল জামদানি চাই" rows={3} /></label><button className="button primary" disabled={status === "sending"}>{status === "sending" ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান →"}</button>{status === "sent" && <p className="form-ok">ধন্যবাদ! খুব শিগগিরই আপনার সঙ্গে যোগাযোগ করব।</p>}{status === "error" && <p className="form-error">দুঃখিত, আবার চেষ্টা করুন।</p>}</form></section>
    <footer><div className="shell footer-inner"><a className="brand" href="#home"><span>শ</span> শাড়িঘর</a><p>ঐতিহ্যে আধুনিক, গল্পে আপনার</p><p>© ২০২৪ শাড়িঘর</p></div></footer>
  </main>;
}
