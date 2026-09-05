import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { verificationRows } from "@/lib/admin-data";

export default function AdminVerificationsPage() {
  return (
    <div>
      <PageHeader
        title="Supplier verification center"
        subtitle="Review applications, request additional documents, and approve suppliers for marketplace onboarding."
        breadcrumbs={[{ label: "Admin" }, { label: "Supplier verification" }]}
        actions={<button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Review queue</button>}
      />

      <FilterBar>
        <input placeholder="Search verification records" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:max-w-xs" />
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option>All statuses</option></select>
      </FilterBar>

      <DataTable
        rows={verificationRows}
        columns={[
          { key: "company", label: "Company name" },
          { key: "contact", label: "Contact person" },
          { key: "country", label: "Country" },
          { key: "businessRegistration", label: "Business registration" },
          { key: "businessLicense", label: "Business license" },
          { key: "factoryInfo", label: "Factory information" },
          { key: "certifications", label: "Certifications" },
          { key: "submittedDoc", label: "Submitted docs", render: (row) => `${row.submittedDocs} files` },
          { key: "submittedDate", label: "Submission date" },
          { key: "status", label: "Verification status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "id", label: "Actions", render: (row) => <Link href={`/admin/verifications/${row.id}`} className="text-indigo-600">Review</Link> },
        ]}
      />
    </div>
  );
}
