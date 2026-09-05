import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminSupplierDetailPage() {
  return (
    <div>
      <PageHeader title="Supplier profile" subtitle="Detailed verification, catalog, sales, and compliance overview." breadcrumbs={[{ label: "Admin" }, { label: "Suppliers" }, { label: "Supplier profile" }]} />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">TF</div>
            <div>
              <div className="text-lg font-semibold text-slate-900">TerraForce Equipment</div>
              <div className="text-sm text-slate-500">Manufacturer</div>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div><span className="font-medium text-slate-900">Country:</span> China</div>
            <div><span className="font-medium text-slate-900">Verification:</span> <StatusBadge status="Verified" /></div>
            <div><span className="font-medium text-slate-900">Products:</span> 184</div>
            <div><span className="font-medium text-slate-900">Orders:</span> 321</div>
            <div><span className="font-medium text-slate-900">Rating:</span> 4.9/5</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Verification & certifications</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">Business license valid • BR-09321</div>
              <div className="rounded-xl bg-slate-50 p-3">ISO 9001 • ISO 14001 • CE</div>
              <div className="rounded-xl bg-slate-50 p-3">Factory documentation approved</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recent RFQs and quotations</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">RFQ-2201 — Industrial Boiler Upgrade</div>
              <div className="rounded-xl bg-slate-50 p-3">Quotation Q-2109 — Submitted 2 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
