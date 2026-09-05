"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/components/auth/AuthProvider";

export default function BuyerRegistrationPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("terms") || !data.get("privacy")) {
      setError("Please accept the terms and privacy policy to continue.");
      return;
    }
    const result = await register({ role: "buyer", name: String(data.get("name")), email: String(data.get("email")), company: String(data.get("company")), country: String(data.get("country")), password: String(data.get("password")) });
    if (!result.ok) { setError(result.message || "Unable to create your account."); return; }
    router.push(result.redirect || "/onboarding/buyer");
  }

  return <RegistrationShell title="Create your buyer account" subtitle="Find products, contact suppliers and manage procurement."><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><Field name="name" label="Full name" /><Field name="company" label="Company name" /><Field name="email" label="Business email" type="email" /><Field name="phone" label="Phone number" /><Field name="country" label="Country" /><Field name="industry" label="Industry" required={false} /><Field name="jobTitle" label="Job title" required={false} /><Field name="website" label="Website" required={false} /><Field name="password" label="Password" type="password" /><Field name="confirm" label="Confirm password" type="password" /><label className="sm:col-span-2 flex gap-2 text-sm text-slate-600"><input name="terms" type="checkbox" /> I accept the terms of service.</label><label className="sm:col-span-2 flex gap-2 text-sm text-slate-600"><input name="privacy" type="checkbox" /> I accept the privacy policy.</label>{error && <p className="sm:col-span-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<button className="sm:col-span-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Create buyer account</button></form></RegistrationShell>;
}

function RegistrationShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <main className="py-12"><Container><div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">NSOMEX buyer</p><h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1><p className="mt-2 text-slate-600">{subtitle}</p><div className="mt-8">{children}</div></div></Container></main>; }
function Field({ name, label, type = "text", required = true }: { name: string; label: string; type?: string; required?: boolean }) { return <label className="text-sm font-medium text-slate-700">{label}<input name={name} type={type} required={required} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-500" /></label>; }
