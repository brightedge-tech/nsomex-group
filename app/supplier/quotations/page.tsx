"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PlatformShell, Status } from "@/components/platform/PlatformUI";

const rfq = { id: "rfq-204", product: "Industrial Solar Inverter", buyer: "Apex Infrastructure Group", quantity: "12 units", targetPrice: "$23,500", destination: "Lagos, Nigeria", requirements: "Three-phase, grid-tied, remote monitoring, installation support" };

export default function SupplierQuotationsPage() {
  const [state, setState] = useState<"Draft" | "Submitted" | "Declined">("Draft");
  const [price, setPrice] = useState("24800");
  const [message, setMessage] = useState("Includes commissioning support and five-year warranty.");

  return (
    <PlatformShell eyebrow="Supplier workspace" title="Quotation desk" description="Review buyer requirements and send a clear commercial response. All actions are mock frontend states in this phase." action={<Link href="/supplier/inquiries" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">View RFQs</Link>}>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">{rfq.id}</p><h2 className="mt-2 text-xl font-bold text-slate-900">{rfq.product}</h2><p className="mt-1 text-sm text-slate-500">Buyer: {rfq.buyer}</p></div><Status>{state}</Status></div><dl className="mt-6 space-y-4 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">Quantity</dt><dd className="font-semibold">{rfq.quantity}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Target price</dt><dd className="font-semibold">{rfq.targetPrice}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Destination</dt><dd className="font-semibold">{rfq.destination}</dd></div></dl><div className="mt-6 border-t border-slate-200 pt-5"><p className="text-sm font-semibold text-slate-900">Buyer requirements</p><p className="mt-2 text-sm leading-6 text-slate-600">{rfq.requirements}</p></div></Card>
        <Card className="p-6"><h2 className="text-lg font-semibold text-slate-900">Build quotation</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm text-slate-600">Supplier price<input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label><label className="text-sm text-slate-600">MOQ<input defaultValue="1 unit" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label><label className="text-sm text-slate-600">Lead time<input defaultValue="6 weeks" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label><label className="text-sm text-slate-600">Shipping terms<select defaultValue="FOB Johannesburg" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"><option>FOB Johannesburg</option><option>CIF Lagos</option><option>EXW factory</option></select></label><label className="text-sm text-slate-600 sm:col-span-2">Payment terms<input defaultValue="30% deposit, 70% before dispatch" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label><label className="text-sm text-slate-600 sm:col-span-2">Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-1 min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label></div><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => setState("Submitted")} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Submit quotation</button><button onClick={() => setState("Draft")} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Save draft</button><button onClick={() => setState("Declined")} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">Decline RFQ</button></div><p className="mt-4 text-xs text-slate-500">Mock state only. No quotation is sent to a live buyer yet.</p></Card>
      </div>
    </PlatformShell>
  );
}
