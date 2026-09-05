"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/components/auth/AuthProvider";

const ImageSearchWrapper = dynamic(() => import("@/components/image/ImageSearchModal").then((m) => m.ImageSearchModal), { ssr: false });

const guestLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/categories", label: "Categories" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/rfq/my-requests", label: "RFQ" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

const buyerLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/rfq/my-requests", label: "RFQ" },
  { href: "/messages", label: "Messages" },
  { href: "/procurement", label: "Procurement" },
  { href: "/orders", label: "Orders" },
  { href: "/logistics", label: "Shipments" },
  { href: "/account", label: "Account" },
];

const supplierLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/supplier/dashboard", label: "Dashboard" },
  { href: "/supplier/products", label: "Products" },
  { href: "/supplier/quotations", label: "Quotations" },
  { href: "/supplier/orders", label: "Orders" },
  { href: "/supplier/messages", label: "Messages" },
  { href: "/supplier/verification", label: "Verification" },
  { href: "/supplier/company", label: "Company" },
  { href: "/supplier/profile", label: "Profile" },
  { href: "/supplier/settings", label: "Settings" },
];

const adminLinks = [
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/suppliers", label: "Suppliers" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/rfqs", label: "RFQs" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/shipments", label: "Shipments" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session, logout } = useAuth();
  const links = session.role === "buyer" ? buyerLinks : session.role === "supplier" ? supplierLinks : session.role === "admin" ? adminLinks : guestLinks;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <Container className="py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">NO</div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">NSOMEX</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Marketplace</p>
            </div>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-4 lg:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-slate-600 transition hover:text-slate-900">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden flex-1 items-center gap-2 lg:flex">
            <div className="relative flex-1">
              <input
                aria-label="Search marketplace"
                defaultValue=""
                placeholder="Search products, equipment, suppliers or factories"
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <ImageSearchWrapper />
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm hover:bg-slate-200" aria-label="Open language selector">🌐</button>
            </div>
          </div>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">USD</button>
            {session.role === "guest" ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <>
                <Link href={session.role === "admin" ? "/admin" : session.role === "supplier" ? "/supplier/dashboard" : "/account"} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  {session.role === "admin" ? "Admin" : session.role === "supplier" ? "Supplier" : "Buyer"}
                </Link>
                <button onClick={logout} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                  Logout
                </button>
              </>
            )}
            <Link href="/rfq/create" className="rounded-full bg-indigo-600 px-3 py-2 text-sm font-medium text-white">
              Post RFQ
            </Link>
            <Link href={session.role === "admin" ? "/admin" : session.role === "supplier" ? "/supplier/dashboard" : "/account"} aria-label="Open account" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              {session.name?.slice(0, 2)?.toUpperCase() || "AO"}
            </Link>
            <Link href="/notifications" aria-label="View notifications" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm">🔔</Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((value) => !value)}
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 lg:hidden"
          >
            ☰
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
            <div className="space-y-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {session.role === "guest" ? (
                <div className="pt-2">
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700">Login</Link>
                    <Link href="/register" className="flex-1 rounded-full bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white">Register</Link>
                  </div>
                </div>
              ) : (
                <button onClick={logout} className="mt-2 w-full rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
