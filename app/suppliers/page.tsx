"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { products } from "@/lib/data/marketplace";

const suppliers = Array.from(new Map(products.map((product) => [product.supplier.id, product.supplier])).values());

export default function SuppliersPage() {
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const text = `${supplier.name} ${supplier.location} ${supplier.description}`.toLowerCase();
      const matchesQuery = !query || text.includes(query.toLowerCase());
      const matchesVerified = !verifiedOnly || supplier.verified;
      return matchesQuery && matchesVerified;
    });
  }, [query, verifiedOnly]);

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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search suppliers, locations or expertise"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => setVerifiedOnly((value) => !value)}
            className={`rounded-full px-4 py-3 text-sm font-semibold ${verifiedOnly ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}
          >
            {verifiedOnly ? "Verified only" : "Show all"}
          </button>
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No suppliers match your current search. Try another keyword or clear the filter.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((supplier) => (
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
        )}
      </Container>
    </section>
  );
}
