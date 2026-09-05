import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminRFQDetailPage() {
  return (
    <div>
      <PageHeader title="RFQ inspection" subtitle="Review requirements, supplier responses, and negotiation activity for this request." breadcrumbs={[{ label: "Admin" }, { label: "RFQs" }, { label: "Inspection" }]} />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">Industrial Boiler Upgrade</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div><span className="font-medium text-slate-900">Buyer:</span> Falcon Procurement</div>
            <div><span className="font-medium text-slate-900">Category:</span> Power Equipment</div>
            <div><span className="font-medium text-slate-900">Quantity:</span> 18 units</div>
            <div><span className="font-medium text-slate-900">Status:</span> <StatusBadge status="Receiving Quotes" /></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Requirements</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>High-efficiency package boiler</li>
              <li>Compliance with local emissions rules</li>
              <li>Delivery within 45 days</li>
              <li>Factory inspection and commissioning support</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Supplier responses</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">TerraForce Equipment — $420,000 — 32 days</div>
              <div className="rounded-xl bg-slate-50 p-3">Apex Engineering — $448,700 — 30 days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
