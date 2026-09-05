import Link from "next/link";
import { PlatformShell, Status } from "@/components/platform/PlatformUI";
import { OrderCard } from "@/components/procurement/ProcurementUI";
import { procurementOrders } from "@/lib/data/procurement";

export default function OrdersPage() {
  return <PlatformShell eyebrow="Buyer procurement" title="Orders" description="Review payment, production and delivery status across your procurement activity." action={<Link href="/procurement" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold">Procurement center</Link>}><div className="mt-8 flex flex-wrap gap-2 text-sm"><Status>All orders</Status><Status>Pending payment</Status><Status>Production</Status><Status>In Transit</Status><Status>Completed</Status></div><div className="mt-5 grid gap-4 lg:grid-cols-2">{procurementOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div></PlatformShell>;
}
