import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { shipmentRows } from "@/lib/admin-data";

export default function AdminShipmentsPage() {
  return (
    <div>
      <PageHeader
        title="Logistics management"
        subtitle="Review shipment progress, origin-destination flow, carrier performance, and delays."
        breadcrumbs={[{ label: "Admin" }, { label: "Shipments" }]}
      />

      <FilterBar>
        <input placeholder="Search shipments" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All statuses</option></select>
      </FilterBar>

      <DataTable
        rows={shipmentRows}
        columns={[
          { key: "id", label: "Shipment number" },
          { key: "order", label: "Order number" },
          { key: "supplier", label: "Supplier" },
          { key: "buyer", label: "Buyer" },
          { key: "origin", label: "Origin" },
          { key: "destination", label: "Destination" },
          { key: "carrier", label: "Carrier" },
          { key: "status", label: "Current status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "eta", label: "Estimated delivery" },
          { key: "id", label: "Actions", render: (row) => <Link href={`/admin/shipments/${row.id}`} className="text-indigo-600">Track</Link> },
        ]}
      />
    </div>
  );
}
