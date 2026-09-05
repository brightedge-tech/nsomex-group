"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getProcurementOrder } from "@/lib/data/procurement";

export default function ReviewPage({ params }: { params: { id: string } }) {
  const [submitted, setSubmitted] = useState(false);
  const order = getProcurementOrder(params.id);
  if (!order) return notFound();
  if (submitted) return <section className="py-16"><Container><Card className="mx-auto max-w-xl p-8 text-center"><h1 className="text-3xl font-bold">Review submitted</h1><p className="mt-3 text-slate-600">Thank you. This mock review is ready for backend persistence later.</p><Link href={`/orders/${order.id}`} className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Back to order</Link></Card></Container></section>;
  return <section className="py-10"><Container><div className="mx-auto max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Completed order</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Review {order.product}</h1><p className="mt-2 text-slate-600">Order {order.id} · {order.supplier}</p><Card className="mt-8 p-6"><div className="grid gap-5 sm:grid-cols-2">{["Product quality", "Supplier communication", "Shipping", "Overall experience"].map((label) => <label key={label} className="text-sm font-medium text-slate-700">{label}<select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"><option>5 stars</option><option>4 stars</option><option>3 stars</option><option>2 stars</option><option>1 star</option></select></label>)}</div><label className="mt-5 block text-sm font-medium text-slate-700">Written review<textarea className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Share useful feedback for future buyers..." /></label><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Product review<input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Product strengths" /></label><label className="text-sm font-medium text-slate-700">Supplier review<input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Supplier experience" /></label></div><button onClick={() => setSubmitted(true)} className="mt-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Submit review</button></Card></div></Container></section>;
}
