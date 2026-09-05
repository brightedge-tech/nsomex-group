import { ChartCard } from "@/components/admin/chart-card";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { reportSummary } from "@/lib/admin-data";

const reportRows = [
  { metric: "Sales report", value: "$16.4M", period: "This year" },
  { metric: "Order report", value: "2,146", period: "30 days" },
  { metric: "Supplier report", value: "1,860", period: "90 days" },
  { metric: "Buyer report", value: "7,424", period: "This year" },
  { metric: "RFQ report", value: "4,850", period: "7 days" },
  { metric: "Revenue report", value: "$3.2M", period: "30 days" },
];

export default function AdminReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports & analytics"
        subtitle="Review commercial, operational, and marketplace performance across multiple time periods."
        breadcrumbs={[{ label: "Admin" }, { label: "Reports" }]}
        actions={
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {['Today', '7 Days', '30 Days', '90 Days', 'This Year', 'Custom Range'].map((range) => (
              <button key={range} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600">{range}</button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportSummary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Sales trend" value="$16.4M" subtitle="Revenue movement by month" data={[42, 44, 54, 50, 63, 77, 88, 94]} color="bg-indigo-500" />
        <ChartCard title="Order volume" value="2,146" subtitle="Orders created in selected range" data={[19, 38, 35, 52, 61, 70, 84, 90]} color="bg-emerald-500" />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 text-lg font-semibold text-slate-900">Performance summary</div>
        <DataTable
          rows={reportRows}
          columns={[
            { key: "metric", label: "Report" },
            { key: "value", label: "Value" },
            { key: "period", label: "Period" },
          ]}
        />
      </div>
    </div>
  );
}
