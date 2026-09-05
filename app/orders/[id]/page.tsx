import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PlatformShell, Status } from "@/components/platform/PlatformUI";
import { OrderTimeline, PaymentSummary, ProductSummary } from "@/components/procurement/ProcurementUI";
import { getProcurementOrder } from "@/lib/data/procurement";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getProcurementOrder(id);
  if (!order) return notFound();
  return <PlatformShell eyebrow="Order management" title={order.id} description={`${order.product} · placed ${order.date}`} action={<Link href={`/tracking/${order.id}`} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Track shipment</Link>}><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]"><div className="space-y-6"><ProductSummary order={order} /><Card className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold text-slate-900">Order progress</h2><Status>{order.status}</Status></div><div className="mt-6"><OrderTimeline status={order.status} /></div></Card><Card className="p-5"><h2 className="font-semibold text-slate-900">Order information</h2><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">Buyer</dt><dd className="font-medium">{order.buyer}</dd></div><div><dt className="text-slate-500">Supplier</dt><dd className="font-medium">{order.supplier}</dd></div><div><dt className="text-slate-500">Payment status</dt><dd className="font-medium">{order.paymentStatus}</dd></div><div><dt className="text-slate-500">Estimated delivery</dt><dd className="font-medium">{order.estimatedDelivery}</dd></div></dl></Card></div><div className="space-y-4"><PaymentSummary order={order} /><Card className="p-5"><h2 className="font-semibold">Next actions</h2><div className="mt-4 grid gap-2">{order.paymentStatus.includes("Pending") && <Link href={`/checkout/${order.id}`} className="rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white">Complete payment</Link>}<Link href={`/disputes/create/${order.id}`} className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold">Open a dispute</Link>{order.status === "Completed" && <Link href={`/orders/${order.id}/review`} className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold">Review order</Link>}</div></Card></div></div></PlatformShell>;
}
