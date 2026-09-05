import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { messageThreads } from "@/lib/admin-data";

export default function AdminMessagesPage() {
  return (
    <div>
      <PageHeader
        title="Platform messages"
        subtitle="Monitor buyer, supplier, support, and dispute conversations across the platform."
        breadcrumbs={[{ label: "Admin" }, { label: "Messages" }]}
      />

      <FilterBar>
        <input placeholder="Search conversations" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All channels</option></select>
      </FilterBar>

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 text-sm font-semibold text-slate-800">Conversations</div>
          <div className="space-y-3">
            {messageThreads.map((thread) => (
              <div key={thread.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{thread.people}</div>
                  <StatusBadge status={thread.status} />
                </div>
                <div className="mt-2 text-xs text-slate-500">{thread.type}</div>
                <div className="mt-2 text-xs text-indigo-600">Related: {thread.related}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">Falcon Procurement / TerraForce</div>
              <div className="text-xs text-slate-500">Order and RFQ collaboration</div>
            </div>
            <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700">View case</button>
          </div>

          <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <div className="rounded-xl bg-white p-3 shadow-sm">We need an updated shipping schedule for the generator package.</div>
            <div className="ml-auto max-w-md rounded-xl bg-indigo-600 p-3 text-white">We are validating final delivery windows and will provide revised ETA by 4 PM.</div>
            <div className="rounded-xl bg-white p-3 shadow-sm">Please share the revised documents for customs clearance.</div>
          </div>

          <div className="mt-4 flex gap-2">
            <input placeholder="Type a message" className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
