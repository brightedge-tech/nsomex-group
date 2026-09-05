import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { activityRows } from "@/lib/admin-data";

export default function AdminActivityPage() {
  return (
    <div>
      <PageHeader
        title="Admin audit log"
        subtitle="Review administrative actions, resource changes, and operational activity history."
        breadcrumbs={[{ label: "Admin" }, { label: "Activity" }]}
      />

      <DataTable
        rows={activityRows}
        columns={[
          { key: "admin", label: "Admin" },
          { key: "action", label: "Action" },
          { key: "resource", label: "Resource" },
          { key: "date", label: "Date" },
          { key: "device", label: "IP/device placeholder" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
      />
    </div>
  );
}
