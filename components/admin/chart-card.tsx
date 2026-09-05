export function ChartCard({
  title,
  value,
  subtitle,
  data,
  color = "bg-indigo-500",
}: {
  title: string;
  value: string;
  subtitle: string;
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data, 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      </div>

      <div className="mt-4 flex h-24 items-end gap-2">
        {data.map((point, index) => (
          <div key={`${title}-${index}`} className="flex flex-1 items-end justify-center">
            <div
              className={`${color} w-full rounded-t-lg`}
              style={{ height: `${Math.max((point / max) * 100, 15)}%` }}
              title={`${point}`}
            />
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
