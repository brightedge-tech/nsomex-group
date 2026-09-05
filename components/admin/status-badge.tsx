const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  Pending: "bg-amber-100 text-amber-700 ring-amber-200",
  Suspended: "bg-rose-100 text-rose-700 ring-rose-200",
  Disabled: "bg-slate-200 text-slate-700 ring-slate-300",
  Verified: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "Pending Review": "bg-amber-100 text-amber-700 ring-amber-200",
  "Under Review": "bg-indigo-100 text-indigo-700 ring-indigo-200",
  "Additional Information Required": "bg-orange-100 text-orange-700 ring-orange-200",
  Published: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "Draft": "bg-slate-200 text-slate-700 ring-slate-300",
  "Draft ": "bg-slate-200 text-slate-700 ring-slate-300",
  "Awaiting Payment": "bg-amber-100 text-amber-700 ring-amber-200",
  "In Transit": "bg-sky-100 text-sky-700 ring-sky-200",
  "Paid": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "In Review": "bg-indigo-100 text-indigo-700 ring-indigo-200",
  "Processing": "bg-blue-100 text-blue-700 ring-blue-200",
  "Completed": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "Received": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "Failed": "bg-rose-100 text-rose-700 ring-rose-200",
  "Refunded": "bg-violet-100 text-violet-700 ring-violet-200",
  "Delayed": "bg-orange-100 text-orange-700 ring-orange-200",
  "Open": "bg-sky-100 text-sky-700 ring-sky-200",
  "Resolved": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "Submitted": "bg-indigo-100 text-indigo-700 ring-indigo-200",
  "Closed": "bg-slate-200 text-slate-700 ring-slate-300",
  "Waiting for Buyer": "bg-amber-100 text-amber-700 ring-amber-200",
  "Receiving Quotes": "bg-sky-100 text-sky-700 ring-sky-200",
  "Negotiating": "bg-violet-100 text-violet-700 ring-violet-200",
  "Cancelled": "bg-rose-100 text-rose-700 ring-rose-200",
  "Enabled": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "Approved": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "Hidden": "bg-orange-100 text-orange-700 ring-orange-200",
  "Investigating": "bg-blue-100 text-blue-700 ring-blue-200",
  "Success": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "Flagged": "bg-rose-100 text-rose-700 ring-rose-200",
  "Updated": "bg-indigo-100 text-indigo-700 ring-indigo-200",
  "Preparing": "bg-amber-100 text-amber-700 ring-amber-200",
  "Customs": "bg-orange-100 text-orange-700 ring-orange-200",
  "Delivered": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "Pending Approval": "bg-amber-100 text-amber-700 ring-amber-200",
  "Rejected": "bg-rose-100 text-rose-700 ring-rose-200",
};

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? "bg-slate-100 text-slate-700 ring-slate-300";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${style}`}>
      {status}
    </span>
  );
}
