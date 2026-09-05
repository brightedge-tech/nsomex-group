import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminShipmentDetailPage() {
  return (
    <div>
      <PageHeader title="Shipment timeline" subtitle="Track cargo movement, carrier updates, and route milestones." breadcrumbs={[{ label: "Admin" }, { label: "Shipments" }, { label: "Shipment timeline" }]} />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">SHP-5591</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div><span className="font-medium text-slate-900">Order:</span> ORD-8012</div>
            <div><span className="font-medium text-slate-900">Origin:</span> Shanghai</div>
            <div><span className="font-medium text-slate-900">Destination:</span> Jebel Ali</div>
            <div><span className="font-medium text-slate-900">Carrier:</span> Maersk</div>
            <div><span className="font-medium text-slate-900">Status:</span> <StatusBadge status="In Transit" /></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Shipment milestones</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="rounded-xl bg-slate-50 p-3">2026-08-28 — Goods packed and handed to carrier</div>
            <div className="rounded-xl bg-slate-50 p-3">2026-08-29 — Export processing completed</div>
            <div className="rounded-xl bg-slate-50 p-3">2026-08-30 — Port departure confirmed</div>
            <div className="rounded-xl bg-slate-50 p-3">2026-09-04 — Expected arrival at destination</div>
          </div>
        </div>
      </div>
    </div>
  );
}
