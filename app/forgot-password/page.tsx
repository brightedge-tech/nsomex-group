"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { authService } from "@/lib/services/authService";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Password recovery</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Reset your password</h1>
          </div>

          {!submitted ? (
            <form
              className="mt-8 space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                const result = await authService.requestPasswordReset(email);
                if (result.error && authService.isConfigured()) { setError("We could not start password recovery. Please try again."); return; }
                setSubmitted(true);
              }}
            >
              {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none ring-0 transition focus:border-indigo-500"
                />
              </label>

              <button type="submit" className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">
                Send reset link
              </button>

              <div className="text-center text-sm text-slate-600">
                Back to <Link href="/login" className="font-semibold text-indigo-600">Login</Link>
              </div>
            </form>
          ) : (
            <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-800">
              If an account exists for <span className="font-semibold">{email}</span>, password reset instructions will be sent.
              <div className="mt-5">
                <Link href="/login" className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  Return to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
