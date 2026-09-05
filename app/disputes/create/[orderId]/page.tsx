"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getProcurementOrder } from "@/lib/data/procurement";

export default function CreateDisputePage({ params }: { params: { orderId: string } }) {
  const [submitted, setSubmitted] = useState(false);
  const order = getProcurementOrder(params.orderId);
  if (!order) return notFound();
  if (submitted) return <section className="py-16"><Container><Card className="mx-auto max-w-xl p-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Dispute submitted</p><h1 className="mt-3 text-3xl font-bold">Case is ready for review</h1><p className="mt-3 text-slate-600">This is a mock frontend state. No dispute service has been connected yet.</p><Link href="/disputes" className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">View dispute center</Link></Card></Container></section>;
  return <section className="py-10"><Container><div className="mx-auto max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Buyer protection</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Open a dispute</h1><p className="mt-2 text-slate-600">Order {order.id} · {order.product} · {order.supplier}</p><Card className="mt-8 p-6"><label className="block text-sm font-medium text-slate-700">Issue type<select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"><option>Product quality issue</option><option>Wrong product</option><option>Missing quantity</option><option>Damaged goods</option><option>Late shipment</option><option>Other</option></select></label><label className="mt-5 block text-sm font-medium text-slate-700">Description<textarea className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Describe what happened and when..." /></label><label className="mt-5 block text-sm font-medium text-slate-700">Evidence / photos<input type="file" multiple className="mt-2 block w-full rounded-lg border border-slate-200 p-2 text-sm" /></label><label className="mt-5 block text-sm font-medium text-slate-700">Requested resolution<select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"><option>Replacement</option><option>Partial refund</option><option>Full refund</option><option>Supplier clarification</option></select></label><button onClick={() => setSubmitted(true)} className="mt-6 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white">Submit dispute</button></Card></div></Container></section>;
}
