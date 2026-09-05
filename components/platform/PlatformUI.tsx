import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export function PlatformShell({ eyebrow, title, description, children, action }: { eyebrow?: string; title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="bg-slate-50/80 py-10"><Container><div className="flex flex-wrap items-end justify-between gap-4"><div>{eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">{eyebrow}</p>}<h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>{description && <p className="mt-2 max-w-2xl text-slate-600">{description}</p>}</div>{action}</div>{children}</Container></section>;
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <Card className="p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p><p className="mt-2 text-xs font-medium text-emerald-700">{detail}</p></Card>;
}

export function Status({ children }: { children: React.ReactNode }) {
  const value = String(children);
  const color = value.includes("Verified") || value === "Published" || value === "Responded" || value === "Shipped" ? "bg-emerald-50 text-emerald-700" : value.includes("Pending") || value.includes("Receiving") || value === "In production" || value === "Shortlisted" ? "bg-amber-50 text-amber-700" : value.includes("Requires") ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{children}</span>;
}

export function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return <Link href={href} className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm"><p className="font-semibold text-slate-900">{title}</p><p className="mt-1 text-sm text-slate-500">{description}</p></Link>;
}

export function EmptyState({ title, description, href, action }: { title: string; description: string; href?: string; action?: string }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"><p className="font-semibold text-slate-900">{title}</p><p className="mt-2 text-sm text-slate-500">{description}</p>{href && <Link href={href} className="mt-4 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{action ?? "Get started"}</Link>}</div>;
}
