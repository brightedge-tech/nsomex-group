"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PlatformShell, Status } from "@/components/platform/PlatformUI";
import { shipments } from "@/lib/data/procurement";

export default function LogisticsPage() {
  const [status, setStatus] = useState("All");
  const filtered = useMemo(() => status === "All" ? shipments : shipments.filter((item) => item.status === status), [status]);
  return <PlatformShell eyebrow="Buyer logistics" title="Shipments" description="Monitor freight, delivery milestones and tracking numbers across your orders."><div className="mt-8 flex flex-wrap gap-2">{["All", "In Transit", "Cargo Prepared", "Delivered", "Delayed"].map((item) => <button key={item} onClick={() => setStatus(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${status === item ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{item}</button>)}</div><div className="mt-6 grid gap-4 lg:grid-cols-2">{filtered.map((shipment) => <Card key={shipment.id} className="p-5"><div className="flex flex-wrap justify-between gap-3"><div><Link href={`/tracking/${shipment.id}`} className="font-semibold text-slate-900 hover:text-indigo-700">{shipment.shipmentNumber}</Link><p className="mt-1 text-sm text-slate-500">Order {shipment.orderId} · {shipment.supplier}</p></div><Status>{shipment.status}</Status></div><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><span className="block text-slate-500">Route</span><strong>{shipment.origin} to {shipment.destination}</strong></div><div><span className="block text-slate-500">Current location</span><strong>{shipment.currentLocation}</strong></div><div><span className="block text-slate-500">Carrier</span><strong>{shipment.carrier}</strong></div><div><span className="block text-slate-500">Estimated delivery</span><strong>{shipment.estimatedDelivery}</strong></div></div><Link href={`/tracking/${shipment.id}`} className="mt-5 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Track shipment</Link></Card>)}</div></PlatformShell>;
}
