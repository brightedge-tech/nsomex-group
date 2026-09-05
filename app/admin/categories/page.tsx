import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { categoryRows } from "@/lib/admin-data";

export default function AdminCategoriesPage() {
  return (
    <div>
      <PageHeader
        title="Category management"
        subtitle="Manage marketplace hierarchy, category health, and taxonomy updates."
        breadcrumbs={[{ label: "Admin" }, { label: "Categories" }]}
        actions={<button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Add category</button>}
      />

      <FilterBar>
        <input placeholder="Search categories" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All statuses</option></select>
      </FilterBar>

      <DataTable
        rows={categoryRows}
        columns={[
          { key: "name", label: "Category name" },
          { key: "parent", label: "Parent category" },
          { key: "products", label: "Number of products" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "name", label: "Actions", render: () => (
            <div className="flex gap-3 text-xs font-medium">
              <button className="text-indigo-600">Edit</button>
              <button className="text-slate-600">Enable</button>
              <button className="text-rose-600">Delete</button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
