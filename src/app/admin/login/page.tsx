"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { adminMessages, type AdminLocale } from "@/lib/admin-messages";

export default function AdminLoginPage() {
  const [locale, setLocale] = useState<AdminLocale>("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = adminMessages[locale];
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!configured) {
      setError(t.configMissing);
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setError(t.configMissing);
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (signInError) {
      setError(t.signInError);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return <div className="cms-login-wrap">
    <section className="cms-login-brand">
      <Link className="cms-brand" href="/"><span className="cms-brand-symbol">N</span><span><strong>NSOMEX GROUP</strong><small>CONNECTING GLOBAL BUSINESS TO GLOBAL OPPORTUNITY</small></span></Link>
      <div className="cms-login-message">
        <p className="cms-eyebrow">PRIVATE ADMINISTRATION</p>
        <h1>One group.<br />One connected<br /><span style={{color:"#e0c48d"}}>workspace.</span></h1>
        <p>{t.signInCopy}</p>
      </div>
      <div className="cms-login-foot">NSOMEX GROUP · CONTENT MANAGEMENT</div>
    </section>
    <section className="cms-login-panel">
      <div className="cms-login-card">
        <div className="cms-login-language">
          <button type="button" aria-pressed={locale==="en"} onClick={()=>setLocale("en")}>EN</button>
          <span>/</span>
          <button type="button" aria-pressed={locale==="fr"} onClick={()=>setLocale("fr")}>FR</button>
        </div>
        <p className="cms-eyebrow">ADMINISTRATOR ACCESS</p>
        <h2>{t.signInTitle}</h2>
        <p>{t.signInCopy}</p>
        <form onSubmit={handleSubmit}>
          <div className="cms-login-field">
            <label htmlFor="admin-email">{t.email}</label>
            <input autoComplete="username" id="admin-email" name="email" onChange={event=>setEmail(event.target.value)} placeholder={t.emailPlaceholder} required type="email" value={email} />
          </div>
          <div className="cms-login-field">
            <label htmlFor="admin-password">{t.password}</label>
            <input autoComplete="current-password" id="admin-password" name="password" onChange={event=>setPassword(event.target.value)} placeholder={t.passwordPlaceholder} required type="password" value={password} />
          </div>
          <button className="cms-login-submit" disabled={loading} type="submit">{loading ? t.signingIn : t.signIn}</button>
          {error && <p className="cms-login-error" role="alert">{error}</p>}
        </form>
      </div>
    </section>
  </div>;
}
