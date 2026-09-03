"use client";

import { categories } from "@/lib/data/marketplace";

export default function FilterSidebar({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: (f: any) => void;
}) {
  return (
    <aside className="w-64 shrink-0">
      <div className="rounded-lg border p-4">
        <h4 className="font-semibold">Filters</h4>

        <div className="mt-3">
          <label className="text-sm font-medium">Category</label>
          <select value={filters.category ?? ""} onChange={(e) => setFilters({ ...filters, category: e.target.value || null })} className="mt-2 w-full rounded border px-2 py-1">
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.title}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="mt-3">
          <label className="text-sm font-medium">Location</label>
          <input value={filters.location ?? ""} onChange={(e) => setFilters({ ...filters, location: e.target.value || null })} placeholder="e.g. Kenya" className="mt-2 w-full rounded border px-2 py-1" />
        </div>

        <div className="mt-3">
          <label className="text-sm font-medium">Verified supplier</label>
          <div className="mt-2 flex items-center gap-2">
            <button onClick={() => setFilters({ ...filters, verified: filters.verified === true ? null : true })} className={`rounded px-3 py-1 ${filters.verified === true ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Yes</button>
            <button onClick={() => setFilters({ ...filters, verified: filters.verified === false ? null : false })} className={`rounded px-3 py-1 ${filters.verified === false ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>No</button>
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm font-medium">Price max (numeric)</label>
          <input type="number" value={filters.priceMax ?? ""} onChange={(e) => setFilters({ ...filters, priceMax: e.target.value ? Number(e.target.value) : null })} className="mt-2 w-full rounded border px-2 py-1" />
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => setFilters({})} className="rounded border px-3 py-1">Clear</button>
        </div>
      </div>
    </aside>
  );
}
