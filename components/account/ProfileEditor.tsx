"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  preferred_language: string;
  company: string | null;
  role: string;
  status: string;
}

export function ProfileEditor() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", country: "", preferred_language: "en", company: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/profile", { signal: controller.signal }).then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Profile could not be loaded.");
      const next: Profile = result.profile;
      setProfile(next);
      setForm({ full_name: next.full_name ?? "", phone: next.phone ?? "", country: next.country ?? "", preferred_language: next.preferred_language ?? "en", company: next.company ?? "" });
    }).catch((fetchError: unknown) => {
      if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) setError(fetchError instanceof Error ? fetchError.message : "Profile could not be loaded.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Profile could not be updated.");
      setProfile(result.profile);
      setMessage("Profile updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Profile could not be updated.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div role="status" className="rounded-xl border border-slate-200 p-6 text-sm text-slate-500">Loading your profile...</div>;
  if (error && !profile) return <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>;
  if (!profile) return null;

  const fields: { key: keyof typeof form; label: string; type?: string }[] = [
    { key: "full_name", label: "Display name" },
    { key: "company", label: "Company" },
    { key: "phone", label: "Phone" },
    { key: "country", label: "Country" },
    { key: "preferred_language", label: "Preferred language" },
  ];

  return <form onSubmit={save} className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(({ key, label }) => <label key={key} className="text-sm text-slate-600">{label}<input value={form[key]} maxLength={key === "full_name" ? 120 : key === "company" ? 160 : key === "phone" ? 40 : key === "country" ? 100 : 12} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label>)}
      <label className="text-sm text-slate-600">Email<input readOnly value={profile.email ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" /></label>
      <label className="text-sm text-slate-600">Account type<input readOnly value={profile.role} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 capitalize text-slate-700" /></label>
      <label className="text-sm text-slate-600">Account status<input readOnly value={profile.status} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 capitalize text-slate-700" /></label>
    </div>
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
    <div className="flex flex-wrap gap-3"><button type="submit" disabled={saving} className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save profile"}</button><button type="button" onClick={() => void logout()} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700">Sign out</button></div>
  </form>;
}
