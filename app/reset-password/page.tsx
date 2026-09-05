"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { authService } from "@/lib/services/authService";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const strength = useMemo(() => {
    if (password.length < 6) return { label: "Weak", color: "bg-rose-500" };
    if (password.length < 10) return { label: "Medium", color: "bg-amber-500" };
    return { label: "Strong", color: "bg-emerald-500" };
  }, [password]);

  const formValid = password.length >= 6 && password === confirmPassword;

  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Account security</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Set a new password</h1>
          </div>

          {!submitted ? (
            <form
              className="mt-8 space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!formValid) return;
                const result = await authService.updatePassword(password);
                if (result.error && authService.isConfigured()) { setError("We could not update your password. Please use the reset link again."); return; }
                setSubmitted(true);
              }}
            >
              {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
              <label className="block text-sm font-medium text-slate-700">
                New password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Confirm password
                <input
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  type="password"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-500"
                />
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Password strength</span>
                  <span className="font-semibold text-slate-700">{strength.label}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${strength.color}`} style={{ width: password ? (password.length < 6 ? "30%" : password.length < 10 ? "65%" : "100%") : "0%" }} />
                </div>
              </div>

              {!formValid && password.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  {password !== confirmPassword ? "Passwords do not match." : "Password must be at least 6 characters long."}
                </div>
              )}

              <button type="submit" disabled={!formValid} className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                Reset password
              </button>
            </form>
          ) : (
            <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-800">
              Your password has been updated successfully.
              <div className="mt-5">
                <Link href="/login" className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  Go to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
