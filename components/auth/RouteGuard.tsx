"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/lib/mock-auth";

export function RouteGuard({
  children,
  allow,
  redirectTo = "/login",
}: {
  children: React.ReactNode;
  allow: UserRole[];
  redirectTo?: string;
}) {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!allow.includes(session.role)) {
      router.replace(session.role === "guest" ? redirectTo : "/unauthorized");
    }
  }, [allow, isLoading, router, session.role]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
        Loading your workspace…
      </div>
    );
  }

  if (!allow.includes(session.role)) {
    return null;
  }

  return <>{children}</>;
}
