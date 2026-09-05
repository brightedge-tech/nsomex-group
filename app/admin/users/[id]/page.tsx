import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminUserDetailPage() {
  return (
    <div>
      <PageHeader title="User profile" subtitle="Full account overview, activity history, and verification states." breadcrumbs={[{ label: "Admin" }, { label: "Users" }, { label: "Profile" }]} />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">AM</div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Alicia Morgan</div>
              <div className="text-sm text-slate-500">Supplier account</div>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div><span className="font-medium text-slate-900">Email:</span> alicia@northstar-industries.com</div>
            <div><span className="font-medium text-slate-900">Country:</span> United States</div>
            <div><span className="font-medium text-slate-900">Registration date:</span> 2024-08-12</div>
            <div><span className="font-medium text-slate-900">Status:</span> <StatusBadge status="Active" /></div>
            <div><span className="font-medium text-slate-900">Verification:</span> <StatusBadge status="Verified" /></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Account activity</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">RFQs posted</div><div className="mt-1 text-xl font-semibold">14</div></div>
              <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Orders</div><div className="mt-1 text-xl font-semibold">28</div></div>
              <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Last login</div><div className="mt-1 text-xl font-semibold">2h ago</div></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recent actions</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">Approved product listing: Diesel Generator 120kVA</div>
              <div className="rounded-xl bg-slate-50 p-3">Updated supplier profile and factory details</div>
              <div className="rounded-xl bg-slate-50 p-3">Submitted response to RFQ-2201</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
