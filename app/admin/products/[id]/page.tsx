import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminProductDetailPage() {
  return (
    <div>
      <PageHeader title="Product moderation" subtitle="Inspect supplier product details, compliance, and approval status before publishing." breadcrumbs={[{ label: "Admin" }, { label: "Products" }, { label: "Moderation" }]} />

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-200 to-slate-300" />
          <div className="mt-4 text-xl font-semibold text-slate-900">Diesel Generator 120kVA</div>
          <div className="mt-2 text-sm text-slate-500">Supplier: TerraForce Equipment</div>
          <div className="mt-4"><StatusBadge status="Pending Approval" /></div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Product overview</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">Category: Industrial Equipment</div>
              <div className="rounded-xl bg-slate-50 p-3">Price: $18,200</div>
              <div className="rounded-xl bg-slate-50 p-3">MOQ: 4 units</div>
              <div className="rounded-xl bg-slate-50 p-3">Certification: ISO 9001</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Description and compliance</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Heavy-duty diesel generator engineered for industrial backup power, optimized for voltage stability, remote monitoring, and long-duration load handling.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Moderation actions</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Approve Product</button>
              <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Reject Product</button>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Request Changes</button>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Suspend Product</button>
            </div>
            <textarea placeholder="Reason for rejection or request for changes" rows={3} className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
