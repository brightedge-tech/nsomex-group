"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PaymentSummary } from "@/components/procurement/ProcurementUI";
import { getProcurementOrder } from "@/lib/data/procurement";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [paid, setPaid] = useState(false);
  const [method, setMethod] = useState("Visa");
  const order = getProcurementOrder(params.id);
  if (!order) return notFound();
  if (paid) return <section className="py-16"><Container><Card className="mx-auto max-w-xl p-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Mock payment authorized</p><h1 className="mt-3 text-3xl font-bold text-slate-900">Payment is pending confirmation</h1><p className="mt-3 text-slate-600">No real payment was processed. The order is ready for the next connected payment-provider phase.</p><Link href={`/orders/${order.id}`} className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Return to order</Link></Card></Container></section>;
  return <section className="py-10"><Container><div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Secure checkout</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Payment for {order.id}</h1><p className="mt-2 text-slate-600">Mock payment interface for frontend validation only.</p></div><div className="grid gap-6 lg:grid-cols-[1fr_20rem]"><div className="space-y-6"><Card className="p-5"><h2 className="font-semibold">Payment method</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{["Visa", "Mastercard", "Bank Transfer", "Other"].map((item) => <button key={item} onClick={() => setMethod(item)} className={`rounded-xl border p-4 text-left text-sm font-semibold ${method === item ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200"}`}>{item}<span className="mt-1 block text-xs font-normal text-slate-500">Mock method</span></button>)}</div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm text-slate-600">Billing name<input defaultValue="Amara Okafor" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" /></label><label className="text-sm text-slate-600">Company<input defaultValue="Meridian Infrastructure Group" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" /></label><label className="text-sm text-slate-600 sm:col-span-2">Billing address<textarea defaultValue="12 Marina Road, Lagos, Nigeria" className="mt-1 min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2" /></label></div></Card><Card className="p-5"><h2 className="font-semibold">Shipping address</h2><p className="mt-3 text-sm leading-6 text-slate-600">{order.destination}<br />Meridian Infrastructure Group<br />Receiving department · Lagos, Nigeria</p><button onClick={() => setPaid(true)} className="mt-5 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Authorize mock payment</button></Card></div><PaymentSummary order={order} /></div></Container></section>;
}
