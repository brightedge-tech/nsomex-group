"use client";

import { UnderDevelopment } from "@/components/layout/under-development";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SupplierDashboardPage() {
  const { session } = useAuth();
  return <div><div className="mx-auto mt-6 max-w-6xl px-6 sm:px-8 lg:px-12"><div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-800">Verification status: {session.verificationStatus}</p><p className="mt-1 text-sm text-amber-700">Complete your supplier profile while our team reviews your application.</p></div></div><UnderDevelopment title="Seller Dashboard" description="Your seller workspace is under development." /></div>;
}
