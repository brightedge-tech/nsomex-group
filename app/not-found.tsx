import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() { return <main className="py-20"><Container><div className="mx-auto max-w-xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">404</p><h1 className="mt-3 text-4xl font-bold text-slate-900">We could not find that page</h1><p className="mt-3 text-slate-600">The product, supplier, or route may have moved.</p><Link href="/marketplace" className="mt-7 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Return to Marketplace</Link></div></Container></main>; }
