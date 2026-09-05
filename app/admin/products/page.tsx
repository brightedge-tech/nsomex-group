import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { productRows } from "@/lib/admin-data";

export default function AdminProductsPage() {
  return (
    <div>
      <PageHeader
        title="Product management"
        subtitle="Moderate storefront listings, supplier submissions, and product compliance."
        breadcrumbs={[{ label: "Admin" }, { label: "Products" }]}
        actions={<button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Review queue</button>}
      />

      <FilterBar>
        <input placeholder="Search products" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>Status</option></select>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>Category</option></select>
      </FilterBar>

      <DataTable
        rows={productRows}
        columns={[
          { key: "name", label: "Product name" },
          { key: "supplier", label: "Supplier" },
          { key: "category", label: "Category" },
          { key: "price", label: "Price" },
          { key: "moq", label: "MOQ" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "date", label: "Date submitted" },
          { key: "id", label: "Actions", render: (row) => <Link href={`/admin/products/${row.id}`} className="text-indigo-600">Moderate</Link> },
        ]}
      />
    </div>
  );
}
