import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminBuyerDetailPage() {
  return (
    <div>
      <PageHeader title="Buyer profile" subtitle="Overview of company performance, procurement activity, and account health." breadcrumbs={[{ label: "Admin" }, { label: "Buyers" }, { label: "Buyer profile" }]} />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-lg font-bold text-cyan-700">NR</div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Nadia Rahman</div>
              <div className="text-sm text-slate-500">Falcon Procurement Ltd.</div>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div><span className="font-medium text-slate-900">Country:</span> UAE</div>
            <div><span className="font-medium text-slate-900">RFQs:</span> 24</div>
            <div><span className="font-medium text-slate-900">Orders:</span> 18</div>
            <div><span className="font-medium text-slate-900">Purchase value:</span> $2.4M</div>
            <div><span className="font-medium text-slate-900">Status:</span> <StatusBadge status="Active" /></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recent RFQ history</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3 text-slate-700">Industrial Boiler Upgrade — Active</div>
              <div className="rounded-xl bg-slate-50 p-3 text-slate-700">Container Handling Gear — Negotiating</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Orders & disputes</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">ORD-8012 — In transit</div>
              <div className="rounded-xl bg-slate-50 p-3">DSP-1102 — Under review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
