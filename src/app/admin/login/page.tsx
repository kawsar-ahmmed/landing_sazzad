"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const loginUrl = new URL("/api/admin/login", window.location.origin);
      const response = await fetch(loginUrl.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "লগইন করা যায়নি।");
      const adminUrl = new URL("/admin", window.location.origin);
      window.location.replace(adminUrl.toString());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "লগইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link className="admin-login-brand" href="/"><span>SS</span><span>Supreme Saree<small>ORDER DESK</small></span></Link>
        <p className="admin-login-kicker">ADMIN ACCESS</p>
        <h1>অ্যাডমিন লগইন</h1>
        <p className="admin-login-copy">আপনার অর্ডার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন।</p>
        <form onSubmit={signIn} className="admin-login-form">
          <label>ব্যবহারকারীর নাম<input required name="username" autoComplete="username" placeholder="আপনার ইউজারনেম" /></label>
          <label>পাসওয়ার্ড<input required type="password" name="password" autoComplete="current-password" placeholder="আপনার পাসওয়ার্ড" /></label>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button type="submit" disabled={busy}>{busy ? "লগইন হচ্ছে…" : "লগইন করুন"}<span>→</span></button>
        </form>
      </section>
      <p className="admin-login-footer">© 2026 Supreme Saree</p>
    </main>
  );
}
