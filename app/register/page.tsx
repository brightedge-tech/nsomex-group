import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function RegisterPage() {
	return <main className="py-16"><Container><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">NSOMEX account</p><h1 className="mt-3 text-3xl font-bold text-slate-900">What are you looking to do?</h1><p className="mt-2 text-slate-600">Choose the workspace that fits your business.</p><div className="mt-8 grid gap-5 text-left sm:grid-cols-2"><RoleCard href="/register/buyer" title="Buy" description="Find products, contact suppliers and manage procurement." /><RoleCard href="/register/supplier" title="Sell" description="List products, reach buyers and grow your business." /></div><p className="mt-8 text-sm text-slate-600">Already have an account? <Link href="/login" className="font-semibold text-indigo-600">Log in</Link></p></div></Container></main>;
}

function RoleCard({ href, title, description }: { href: string; title: string; description: string }) { return <Link href={href} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300"><h2 className="text-xl font-bold text-slate-900">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p><span className="mt-6 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Continue</span></Link>; }
