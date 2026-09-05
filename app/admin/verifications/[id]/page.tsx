import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminVerificationDetailPage() {
  return (
    <div>
      <PageHeader title="Verification review" subtitle="Review documentation, factory compliance, and business credentials before approval." breadcrumbs={[{ label: "Admin" }, { label: "Supplier verification" }, { label: "Verification review" }]} />

      <div className="grid gap-6 xl:grid-cols-[350px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">JSK Power Systems</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div><span className="font-medium text-slate-900">Contact:</span> Haruto Sato</div>
            <div><span className="font-medium text-slate-900">Country:</span> Japan</div>
            <div><span className="font-medium text-slate-900">Submission date:</span> 2026-08-22</div>
            <div><span className="font-medium text-slate-900">Status:</span> <StatusBadge status="Pending Review" /></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Business credentials</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">Business registration: BR-09321</div>
              <div className="rounded-xl bg-slate-50 p-3">Business license: Valid</div>
              <div className="rounded-xl bg-slate-50 p-3">Factory: Osaka - 2,400 sqm</div>
              <div className="rounded-xl bg-slate-50 p-3">Certifications: ISO 9001/14001</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Review actions</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Approve</button>
              <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Reject</button>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Request additional info</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
