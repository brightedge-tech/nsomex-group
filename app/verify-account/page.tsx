"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { authService } from "@/lib/services/authService";

export default function VerifyAccountPage() {
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    authService.getCurrentUser().then(({ user }) => {
      if (!active) return;
      setEmail(user?.email ?? "");
      setVerified(Boolean(user?.email_confirmed_at));
      setLoading(false);
    }).catch(() => {
      if (active) { setError("We could not check verification status. Please sign in again."); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  async function resend() {
    if (!email) { setError("Sign in or register again to request a verification email."); return; }
    setSending(true);
    setMessage("");
    setError("");
    const result = await authService.resendSignupVerification(email);
    if (result.error) setError("We could not send the verification email. Please try again later.");
    else setMessage("If the address can receive a verification email, it has been sent.");
    setSending(false);
  }

  return <main className="py-16"><Container><div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Account verification</p>
    <h1 className="mt-3 text-3xl font-bold text-slate-900">Verify your email</h1>
    {loading ? <p role="status" className="mt-4 text-slate-600">Checking verification status...</p> : verified ? <p role="status" className="mt-4 text-emerald-700">Your email address{email ? ` (${email})` : ""} is verified.</p> : <>
      <p className="mt-4 text-slate-600">Open the verification link sent by Supabase to complete account setup.</p>
      {email && <p className="mt-2 text-sm text-slate-500">{email}</p>}
      <button type="button" disabled={sending} onClick={() => void resend()} className="mt-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{sending ? "Sending..." : "Resend verification email"}</button>
    </>}
    {message && <p role="status" className="mt-4 text-sm text-emerald-700">{message}</p>}
    {error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}
    <div className="mt-6"><Link href="/login" className="text-sm font-semibold text-indigo-600">Return to sign in</Link></div>
  </div></Container></main>;
}
