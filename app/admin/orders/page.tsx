import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { orderRows } from "@/lib/admin-data";

export default function AdminOrdersPage() {
  return (
    <div>
      <PageHeader
        title="Order management"
        subtitle="Monitor transaction flow, payment progress, shipping milestones, and dispute risk."
        breadcrumbs={[{ label: "Admin" }, { label: "Orders" }]}
      />

      <FilterBar>
        <input placeholder="Search orders" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All statuses</option></select>
      </FilterBar>

      <DataTable
        rows={orderRows}
        columns={[
          { key: "id", label: "Order Number" },
          { key: "buyer", label: "Buyer" },
          { key: "supplier", label: "Supplier" },
          { key: "amount", label: "Amount" },
          { key: "paymentStatus", label: "Payment status", render: (row) => <StatusBadge status={row.paymentStatus} /> },
          { key: "orderStatus", label: "Order status", render: (row) => <StatusBadge status={row.orderStatus} /> },
          { key: "shippingStatus", label: "Shipping status", render: (row) => <StatusBadge status={row.shippingStatus} /> },
          { key: "date", label: "Date" },
          { key: "id", label: "Actions", render: (row) => <Link href={`/admin/orders/${row.id}`} className="text-indigo-600">Monitor</Link> },
        ]}
      />
    </div>
  );
}
