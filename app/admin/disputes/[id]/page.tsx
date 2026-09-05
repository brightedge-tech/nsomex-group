import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminDisputeDetailPage() {
  return (
    <div>
      <PageHeader title="Dispute review" subtitle="Review evidence, buyer-supplier communication, and recommended resolution." breadcrumbs={[{ label: "Admin" }, { label: "Disputes" }, { label: "Dispute review" }]} />

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">DSP-1102</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div><span className="font-medium text-slate-900">Order:</span> ORD-8178</div>
            <div><span className="font-medium text-slate-900">Buyer:</span> Harbor Supply</div>
            <div><span className="font-medium text-slate-900">Supplier:</span> Vanguard Industrial</div>
            <div><span className="font-medium text-slate-900">Issue:</span> Late shipment and damaged packaging</div>
            <div><span className="font-medium text-slate-900">Status:</span> <StatusBadge status="Under Review" /></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Evidence and notes</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">Delivery photo evidence attached by buyer</div>
              <div className="rounded-xl bg-slate-50 p-3">Carrier report confirms transit delay at customs</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Actions</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Request information</button>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Propose resolution</button>
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Resolve dispute</button>
              <button className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white">Close dispute</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
