import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { disputeRows } from "@/lib/admin-data";

export default function AdminDisputesPage() {
  return (
    <div>
      <PageHeader
        title="Dispute management"
        subtitle="Monitor transaction conflicts, evidence collection, and resolution workflows."
        breadcrumbs={[{ label: "Admin" }, { label: "Disputes" }]}
      />

      <FilterBar>
        <input placeholder="Search disputes" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All statuses</option></select>
      </FilterBar>

      <DataTable
        rows={disputeRows}
        columns={[
          { key: "id", label: "Dispute ID" },
          { key: "order", label: "Order" },
          { key: "buyer", label: "Buyer" },
          { key: "supplier", label: "Supplier" },
          { key: "issue", label: "Issue" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "id", label: "Actions", render: (row) => <Link href={`/admin/disputes/${row.id}`} className="text-indigo-600">Review</Link> },
        ]}
      />
    </div>
  );
}
