import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { rfqRows } from "@/lib/admin-data";

export default function AdminRFQsPage() {
  return (
    <div>
      <PageHeader
        title="RFQ management"
        subtitle="Track buyer requests, supplier participation, and collaborative price negotiations."
        breadcrumbs={[{ label: "Admin" }, { label: "RFQs" }]}
      />

      <FilterBar>
        <input placeholder="Search RFQs" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All statuses</option></select>
      </FilterBar>

      <DataTable
        rows={rfqRows}
        columns={[
          { key: "title", label: "RFQ title" },
          { key: "buyer", label: "Buyer" },
          { key: "category", label: "Category" },
          { key: "quantity", label: "Quantity" },
          { key: "responses", label: "Supplier responses" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "id", label: "Actions", render: (row) => <Link href={`/admin/rfqs/${row.id}`} className="text-indigo-600">Inspect</Link> },
        ]}
      />
    </div>
  );
}
