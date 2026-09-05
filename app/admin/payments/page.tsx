import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { paymentRows } from "@/lib/admin-data";

export default function AdminPaymentsPage() {
  return (
    <div>
      <PageHeader
        title="Payment management"
        subtitle="Review transaction health, settlement states, and exception handling across marketplace orders."
        breadcrumbs={[{ label: "Admin" }, { label: "Payments" }]}
      />

      <FilterBar>
        <input placeholder="Search transactions" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All statuses</option></select>
      </FilterBar>

      <DataTable
        rows={paymentRows}
        columns={[
          { key: "id", label: "Transaction ID" },
          { key: "order", label: "Order" },
          { key: "buyer", label: "Buyer" },
          { key: "supplier", label: "Supplier" },
          { key: "amount", label: "Amount" },
          { key: "currency", label: "Currency" },
          { key: "method", label: "Payment method" },
          { key: "status", label: "Payment status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "date", label: "Date" },
        ]}
      />
    </div>
  );
}
