import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminOrderDetailPage() {
  return (
    <div>
      <PageHeader title="Order overview" subtitle="Complete order monitoring including buyer, seller, payment, shipping, and dispute status." breadcrumbs={[{ label: "Admin" }, { label: "Orders" }, { label: "Order overview" }]} />

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">ORD-8012</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div><span className="font-medium text-slate-900">Buyer:</span> Falcon Procurement</div>
            <div><span className="font-medium text-slate-900">Supplier:</span> TerraForce Equipment</div>
            <div><span className="font-medium text-slate-900">Amount:</span> $184,200</div>
            <div><span className="font-medium text-slate-900">Payment status:</span> <StatusBadge status="Paid" /></div>
            <div><span className="font-medium text-slate-900">Shipping status:</span> <StatusBadge status="In Transit" /></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Products</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">Diesel Generator 120kVA — Qty 4 — $18,200 each</div>
              <div className="rounded-xl bg-slate-50 p-3">Control relay module — Qty 12 — $1,240 each</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Order timeline</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">2026-08-26 — Order created</div>
              <div className="rounded-xl bg-slate-50 p-3">2026-08-27 — Payment confirmed</div>
              <div className="rounded-xl bg-slate-50 p-3">2026-08-28 — Goods packed</div>
              <div className="rounded-xl bg-slate-50 p-3">2026-08-30 — In transit to Jebel Ali</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
