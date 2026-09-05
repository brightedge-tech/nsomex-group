import { PageHeader } from "@/components/admin/page-header";

const sections = [
  "General settings",
  "Marketplace settings",
  "User settings",
  "Supplier settings",
  "Verification settings",
  "RFQ settings",
  "Order settings",
  "Notification settings",
  "Security settings",
];

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Admin settings"
        subtitle="Configure platform policies, operational controls, and marketplace defaults."
        breadcrumbs={[{ label: "Admin" }, { label: "Settings" }]}
      />

      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 text-lg font-semibold text-slate-900">{section}</div>
            <div className="grid gap-4 md:grid-cols-2">
              <input value="Platform default" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" readOnly />
              <input value="Enabled" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" readOnly />
              <input value="Regional policy" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" readOnly />
              <input value="Updated 08:40" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" readOnly />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">Save changes</button>
      </div>
    </div>
  );
}
