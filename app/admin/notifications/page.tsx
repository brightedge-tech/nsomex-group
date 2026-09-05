import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { notificationRows } from "@/lib/admin-data";

export default function AdminNotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications management"
        subtitle="Review platform alerts and publish announcements to users or supplier groups."
        breadcrumbs={[{ label: "Admin" }, { label: "Notifications" }]}
        actions={<button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Create announcement</button>}
      />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 text-lg font-semibold text-slate-900">Create announcement</div>
        <div className="grid gap-4 md:grid-cols-2">
          <input placeholder="Title" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>Type</option></select>
          <input placeholder="Audience" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:col-span-2" />
          <textarea placeholder="Announcement message" rows={4} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:col-span-2" />
        </div>
        <div className="mt-4 flex justify-end">
          <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Publish</button>
        </div>
      </div>

      <FilterBar>
        <input placeholder="Search notifications" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All types</option></select>
      </FilterBar>

      <DataTable
        rows={notificationRows}
        columns={[
          { key: "id", label: "Notification ID" },
          { key: "title", label: "Title" },
          { key: "type", label: "Type" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "id", label: "Actions", render: () => <button className="text-indigo-600">View</button> },
        ]}
      />
    </div>
  );
}
