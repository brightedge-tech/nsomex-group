"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";

export default function SuppliersPage() {
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ q: query, verifiedOnly: String(verifiedOnly), page: String(page), pageSize: "12" });
    fetch(`/api/suppliers?${params}`, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("suppliers");
      const result = await response.json();
      setSuppliers(result.suppliers ?? []);
      setTotal(result.total ?? 0);
      setTotalPages(result.totalPages ?? 0);
      setError(false);
    }).catch((fetchError: unknown) => {
      if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) setError(true);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [page, query, verifiedOnly]);

  return (
    <section className="py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Supplier directory</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Discover trusted suppliers</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/register" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Become a supplier</Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value.slice(0, 80)); setPage(1); }}
            placeholder="Search suppliers, locations or expertise"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => { setVerifiedOnly((value) => !value); setPage(1); }}
            className={`rounded-full px-4 py-3 text-sm font-semibold ${verifiedOnly ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}
          >
            {verifiedOnly ? "Verified only" : "Show all"}
          </button>
        </div>

        {!loading && !error && suppliers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No suppliers match your current search. Try another keyword or clear the filter.
          </div>
        ) : !loading && !error ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Link key={supplier.id} href={`/supplier/${supplier.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                    {supplier.name.slice(0, 2).toUpperCase()}
                  </div>
                  {supplier.verified && <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Verified</span>}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-slate-900">{supplier.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{supplier.location}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{supplier.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>{supplier.yearsInBusiness} years</span>
                  <span>★ {supplier.rating}</span>
                </div>
                <div className="mt-4 text-sm font-semibold text-indigo-600">View supplier →</div>
              </Link>
            ))}
          </div>
        ) : <p role={error ? "alert" : "status"} className="mt-8 text-sm text-slate-600">{error ? "Supplier directory is temporarily unavailable." : "Loading suppliers..."}</p>}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-slate-600">{total} suppliers</span>
          {totalPages > 1 && <>
            <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40">Previous</button>
            <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40">Next</button>
          </>}
        </div>
      </Container>
    </section>
  );
}
