import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { supplierRows } from "@/lib/admin-data";

export default function AdminSuppliersPage() {
  return (
    <div>
      <PageHeader
        title="Supplier management"
        subtitle="Review supplier quality, verification status, marketplace performance, and fulfillment metrics."
        breadcrumbs={[{ label: "Admin" }, { label: "Suppliers" }]}
      />

      <FilterBar>
        <input placeholder="Search suppliers" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <option>Verification status</option>
          <option>Verified</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <option>Business type</option>
          <option>Manufacturer</option>
          <option>Trading company</option>
          <option>Distributor</option>
        </select>
      </FilterBar>

      <DataTable
        rows={supplierRows}
        columns={[
          { key: "name", label: "Supplier name" },
          { key: "company", label: "Company" },
          { key: "country", label: "Country" },
          { key: "businessType", label: "Business type" },
          { key: "verification", label: "Verification status", render: (row) => <StatusBadge status={row.verification} /> },
          { key: "products", label: "Products" },
          { key: "orders", label: "Orders" },
          { key: "rating", label: "Rating" },
          { key: "registered", label: "Registration date" },
          { key: "status", label: "Account status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "id", label: "Actions", render: (row) => <Link href={`/admin/suppliers/${row.id}`} className="text-indigo-600">View</Link> },
        ]}
      />
    </div>
  );
}
