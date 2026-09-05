import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { userRows } from "@/lib/admin-data";

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader
        title="User management"
        subtitle="Manage accounts, verification states, and user activity across the marketplace."
        breadcrumbs={[{ label: "Admin" }, { label: "Users" }]}
        actions={
          <div className="flex gap-2">
            <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Export</button>
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Add user</button>
          </div>
        }
      />

      <FilterBar>
        <input placeholder="Search users" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <option>All account types</option>
          <option>Buyer</option>
          <option>Supplier</option>
          <option>Admin</option>
        </select>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <option>All statuses</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>
      </FilterBar>

      <DataTable
        rows={userRows}
        columns={[
          { key: "name", label: "User name" },
          { key: "email", label: "Email" },
          { key: "type", label: "Account type" },
          { key: "country", label: "Country" },
          { key: "registered", label: "Registration date" },
          { key: "status", label: "Account status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "verification", label: "Verification", render: (row) => <StatusBadge status={row.verification} /> },
          { key: "lastActivity", label: "Last activity" },
          { key: "id", label: "Actions", render: (row) => (
            <div className="flex gap-2">
              <Link href={`/admin/users/${row.id}`} className="text-indigo-600">View</Link>
              <button className="text-slate-600">Edit</button>
              <button className="text-rose-600">Suspend</button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
