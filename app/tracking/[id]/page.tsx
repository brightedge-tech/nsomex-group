import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PlatformShell, Status } from "@/components/platform/PlatformUI";
import { ShipmentTimeline } from "@/components/procurement/ProcurementUI";
import { getShipment } from "@/lib/data/procurement";

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = getShipment(id);
  if (!shipment) return notFound();
  return <PlatformShell eyebrow="Logistics tracking" title={shipment.shipmentNumber} description={`${shipment.orderId} · ${shipment.carrier}`} action={<Link href="/logistics" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold">All shipments</Link>}><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]"><Card className="p-5"><div className="flex flex-wrap justify-between gap-3"><h2 className="font-semibold">Tracking timeline</h2><Status>{shipment.status}</Status></div><div className="mt-6"><ShipmentTimeline shipment={shipment} /></div></Card><div className="space-y-4"><Card className="p-5"><h2 className="font-semibold">Shipment details</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Carrier</dt><dd className="font-medium">{shipment.carrier}</dd></div><div><dt className="text-slate-500">Current location</dt><dd className="font-medium">{shipment.currentLocation}</dd></div><div><dt className="text-slate-500">Origin</dt><dd className="font-medium">{shipment.origin}</dd></div><div><dt className="text-slate-500">Destination</dt><dd className="font-medium">{shipment.destination}</dd></div><div><dt className="text-slate-500">Estimated delivery</dt><dd className="font-medium">{shipment.estimatedDelivery}</dd></div></dl></Card><Link href={`/orders/${shipment.orderId}`} className="block rounded-xl bg-indigo-600 p-4 text-center text-sm font-semibold text-white">View linked order</Link></div></div></PlatformShell>;
}
