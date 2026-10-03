"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth/AuthProvider";

const supplierWorkspacePrefixes = ["/supplier/dashboard", "/supplier/company", "/supplier/inquiries", "/supplier/messages", "/supplier/orders", "/supplier/products", "/supplier/profile", "/supplier/quotations", "/supplier/settings", "/supplier/verification"];

export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isSupplierWorkspace = supplierWorkspacePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  useEffect(() => {
    if (isLoading) return;
    if (!pathname) return;

    if (pathname.startsWith("/admin") && session.role !== "admin") {
      router.replace(session.role === "guest" ? "/login" : "/unauthorized");
      return;
    }

    if (pathname.startsWith("/account") && !["buyer", "admin"].includes(session.role)) {
      router.replace(session.role === "guest" ? "/login" : "/unauthorized");
      return;
    }

    if (isSupplierWorkspace && !["supplier", "admin"].includes(session.role)) {
      router.replace(session.role === "guest" ? "/login" : "/unauthorized");
      return;
    }

    if (pathname.startsWith("/onboarding/buyer") && session.role !== "buyer") {
      router.replace(session.role === "guest" ? "/login" : "/unauthorized");
      return;
    }

    if (pathname.startsWith("/onboarding/supplier") && session.role !== "supplier") {
      router.replace(session.role === "guest" ? "/login" : "/unauthorized");
    }
  }, [isLoading, isSupplierWorkspace, pathname, router, session.role]);

  return isAdmin ? <AdminShell>{children}</AdminShell> : <AppShell>{children}</AppShell>;
}
