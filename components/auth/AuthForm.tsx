"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/components/auth/AuthProvider";

export function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const [role, setRole] = useState<"buyer" | "supplier">("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const isRegister = mode === "register";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const passwordInput = Array.from(event.currentTarget.querySelectorAll("input")).filter((input) => input.type !== "checkbox").at(-1) as HTMLInputElement | undefined;
    const password = String(form.get("password") || passwordInput?.value || "");
    const result = isRegister
      ? await register({ role, name: String(form.get("name") || form.get("contact") || ""), email, company: String(form.get("company") || ""), country: String(form.get("country") || ""), password })
      : await login({ email, password, role: isRegister ? role : undefined, remember });
    if (!result.ok) { setError(result.message || "Unable to continue."); return; }
    window.location.href = result.redirect || (role === "supplier" ? "/supplier/dashboard" : "/account");
  }
  if (error) return <main className="py-16"><Container><div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"><h1 className="text-2xl font-bold text-slate-900">Unable to continue</h1><p className="mt-3 text-sm text-rose-700">{error}</p><button onClick={() => setError("")} className="mt-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Try again</button></div></Container></main>;
  return <main className="py-12"><Container><div className="mx-auto max-w-xl"><div className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">NSOMEX account</p><h1 className="mt-3 text-3xl font-bold text-slate-900">{isRegister ? "Create your marketplace account" : "Sign in to NSOMEX"}</h1><p className="mt-2 text-slate-600">{isRegister ? "Join a trusted procurement network for Africa and beyond." : "Continue to your procurement workspace."}</p></div><form onSubmit={submit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1"><button type="button" onClick={() => setRole("buyer")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${role === "buyer" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}>Buyer</button><button type="button" onClick={() => setRole("supplier")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${role === "supplier" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}>Supplier</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{isRegister && (role === "buyer" ? <Field label="Full name" /> : <><Field label="Contact person" /><Field label="Company name" /></>)}<Field label={role === "supplier" ? "Business email" : "Email"} type="email" /><Field label="Phone" /><Field label="Country" /></div><label className="mt-4 block text-sm text-slate-600">Password<div className="mt-1 flex rounded-lg border border-slate-200"><input required type={showPassword ? "text" : "password"} className="min-w-0 flex-1 rounded-lg px-3 py-2 outline-none" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 text-xs font-semibold text-indigo-600">{showPassword ? "Hide" : "Show"}</button></div></label><div className="mt-4 flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label><Link href="/login" className="font-medium text-indigo-600">Forgot password?</Link></div><button type="submit" className="mt-6 w-full rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">{isRegister ? "Create account" : "Sign in"}</button><p className="mt-5 text-center text-xs text-slate-500">By continuing, you agree to the NSOMEX terms and conditions.</p></form><p className="mt-5 text-center text-sm text-slate-600">{isRegister ? "Already have an account?" : "New to NSOMEX?"} <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-indigo-600">{isRegister ? "Sign in" : "Register"}</Link></p></div></Container></main>;
}
function Field({ label, type = "text", name }: { label: string; type?: string; name?: string }) { return <label className="text-sm text-slate-600">{label}<input name={name || label.toLowerCase().replaceAll(" ", "_")} required type={type} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500" /></label>; }
