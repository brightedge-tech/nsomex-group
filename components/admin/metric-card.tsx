export function MetricCard({
  label,
  value,
  delta,
  tone = "indigo",
}: {
  label: string;
  value: string;
  delta: string;
  tone?: "indigo" | "cyan" | "emerald" | "violet" | "amber" | "pink" | "rose" | "sky" | "teal" | "orange" | "blue" | "red";
}) {
  const toneClasses = {
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    pink: "bg-pink-50 text-pink-700 ring-pink-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    teal: "bg-teal-50 text-teal-700 ring-teal-200",
    orange: "bg-orange-50 text-orange-700 ring-orange-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    red: "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${toneClasses[tone]}`}>
          {delta}
        </span>
      </div>
    </div>
  );
}
