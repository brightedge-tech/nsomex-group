import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { buyerRows } from "@/lib/admin-data";

export default function AdminBuyersPage() {
  return (
    <div>
      <PageHeader
        title="Buyer management"
        subtitle="Track buyer activity, company profiles, RFQ volume, and purchasing behavior."
        breadcrumbs={[{ label: "Admin" }, { label: "Buyers" }]}
      />

      <FilterBar>
        <input placeholder="Search buyers" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All countries</option></select>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All statuses</option></select>
      </FilterBar>

      <DataTable
        rows={buyerRows}
        columns={[
          { key: "name", label: "Buyer name" },
          { key: "company", label: "Company" },
          { key: "country", label: "Country" },
          { key: "rfqs", label: "RFQs" },
          { key: "orders", label: "Orders" },
          { key: "value", label: "Total purchase value" },
          { key: "status", label: "Account status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "registered", label: "Registration date" },
          { key: "id", label: "Actions", render: (row) => <Link href={`/admin/buyers/${row.id}`} className="text-indigo-600">View profile</Link> },
        ]}
      />
    </div>
  );
}
