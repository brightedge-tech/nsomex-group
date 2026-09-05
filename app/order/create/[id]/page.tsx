"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PaymentSummary, ProductSummary } from "@/components/procurement/ProcurementUI";
import { getProcurementOrder, procurementInquiries } from "@/lib/data/procurement";
import { getProduct } from "@/lib/data/marketplace";

export default function CreateOrderPage({ params }: { params: { id: string } }) {
  const [submitted, setSubmitted] = useState(false);
  const source = getProcurementOrder(params.id) ?? getProcurementOrder("NSX-1048");
  const inquiry = procurementInquiries.find((item) => item.id === params.id);
  const product = inquiry ? getProduct(inquiry.productId) : undefined;
  if (!source) return notFound();
  const order = product ? { ...source, product: product.name, supplier: product.supplier.name } : source;
  if (submitted) return <section className="py-16"><Container><Card className="mx-auto max-w-xl p-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Order submitted</p><h1 className="mt-3 text-3xl font-bold">Your order is awaiting supplier confirmation</h1><p className="mt-3 text-slate-600">We created a mock order request for {order.product}. No payment has been processed.</p><Link href={`/orders/${order.id}`} className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">View order</Link></Card></Container></section>;
  return <section className="py-10"><Container><div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Procurement checkout</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Review and create order</h1><p className="mt-2 text-slate-600">Confirm commercial terms before sending this order to the supplier.</p></div><div className="grid gap-6 lg:grid-cols-[1fr_20rem]"><div className="space-y-6"><ProductSummary order={order} /><Card className="p-5"><h2 className="font-semibold">Delivery and buyer information</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm text-slate-600">Shipping method<select className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"><option>{order.shippingMethod}</option><option>Air freight</option><option>Sea freight</option></select></label><label className="text-sm text-slate-600">Estimated delivery<input readOnly value={order.estimatedDelivery} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" /></label><label className="text-sm text-slate-600">Delivery destination<input defaultValue={order.destination} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" /></label><label className="text-sm text-slate-600">Buyer contact<input defaultValue="Amara Okafor · procurement@meridian.example" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" /></label></div></Card><Card className="p-5"><h2 className="font-semibold">Order confirmation</h2><p className="mt-3 text-sm leading-6 text-slate-600">Submitting creates a frontend-only order request. Supplier confirmation, payment and logistics remain mock states until backend services are connected.</p><button onClick={() => setSubmitted(true)} className="mt-5 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Submit order</button></Card></div><PaymentSummary order={order} /></div></Container></section>;
}
