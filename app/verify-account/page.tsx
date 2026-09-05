"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/container";

const states = [
  { label: "Email verification", status: "Verified" },
  { label: "Phone verification", status: "Verification Sent" },
  { label: "Business identity", status: "Not Verified" },
];

export default function VerifyAccountPage() {
  const [verificationState, setVerificationState] = useState<"Not Verified" | "Verification Sent" | "Verified" | "Failed">("Verification Sent");

  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Account verification</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Verify your account</h1>
            <p className="mt-2 text-slate-600">This is a mock verification flow for frontend onboarding and role setup.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {states.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{item.label}</p>
                <div className="mt-3 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {item.status}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setVerificationState("Verified")} className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Mark as verified</button>
            <button onClick={() => setVerificationState("Verification Sent")} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">Send verification</button>
            <button onClick={() => setVerificationState("Failed")} className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700">Failed</button>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            Current status: <span className="font-semibold">{verificationState}</span>
          </div>

          <div className="mt-6 text-center">
            <Link href="/account" className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              Back to account
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
