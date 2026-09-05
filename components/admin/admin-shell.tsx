"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminNavigation } from "@/lib/admin-data";

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-slate-100 lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-800 px-6 py-5">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                  NO
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-indigo-300">NSOMEX</div>
                  <div className="text-sm font-medium text-white">Admin Center</div>
                </div>
              </Link>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-5">
              {adminNavigation.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={classNames(
                      "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      active ? "bg-indigo-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-800 p-4">
              <div className="rounded-xl bg-slate-900 p-3">
                <div className="text-xs uppercase tracking-[0.28em] text-slate-400">System status</div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">Marketplace</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg text-slate-700 lg:hidden"
                  aria-label="Open admin menu"
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  ☰
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">Control Center</p>
                  <h1 className="text-lg font-semibold text-slate-900">NSOMEX Admin</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 md:block">
                  Today: 30 Aug 2026
                </div>
                <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                  Create announcement
                </button>
              </div>
            </div>
          </header>

          {mobileOpen && (
            <div className="border-b border-slate-200 bg-slate-950 text-slate-100 lg:hidden">
              <nav className="space-y-1 p-4">
                {adminNavigation.map((item) => {
                  const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={classNames(
                        "block rounded-xl px-3 py-2.5 text-sm font-medium",
                        active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
