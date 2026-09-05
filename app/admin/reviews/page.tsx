import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { reviewRows } from "@/lib/admin-data";

export default function AdminReviewsPage() {
  return (
    <div>
      <PageHeader
        title="Review management"
        subtitle="Moderate product, supplier, and buyer review quality and flag reported content."
        breadcrumbs={[{ label: "Admin" }, { label: "Reviews" }]}
      />

      <FilterBar>
        <input placeholder="Search reviews" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All types</option></select>
      </FilterBar>

      <DataTable
        rows={reviewRows}
        columns={[
          { key: "id", label: "Review ID" },
          { key: "type", label: "Type" },
          { key: "rating", label: "Rating" },
          { key: "status", label: "Review status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "reported", label: "Reported" },
          { key: "reviewer", label: "Reviewer" },
          { key: "id", label: "Actions", render: () => (
            <div className="flex gap-3 text-xs font-medium">
              <button className="text-emerald-600">Approve</button>
              <button className="text-amber-600">Hide</button>
              <button className="text-rose-600">Remove</button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
