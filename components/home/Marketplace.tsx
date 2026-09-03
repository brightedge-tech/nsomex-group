"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { products as sampleProducts, categories } from "@/lib/data/marketplace";
import { useMemo } from "react";
import ProductCard from "@/components/marketplace/ProductCard";
import FilterSidebar from "@/components/filters/FilterSidebar";

export function Marketplace() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [filters, setFilters] = useState<any>({});

  const filtered = useMemo(
    () =>
      sampleProducts.filter((p) => {
        if (activeCategory && p.category !== activeCategory) return false;
        if (filters.category && p.category !== filters.category) return false;
        if (filters.location && !p.location.toLowerCase().includes(String(filters.location).toLowerCase())) return false;
        if (typeof filters.verified === "boolean" && p.supplier.verified !== filters.verified) return false;
        if (filters.priceMax && typeof p.price === "string") {
          const n = Number(String(p.price).replace(/[^0-9.]/g, ""));
          if (!isNaN(n) && n > filters.priceMax) return false;
        }
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.supplier.name.toLowerCase().includes(q)
        );
      }),
    [query, activeCategory],
  );
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [filters, query, activeCategory, pageSize]);

  return (
    <section aria-label="NSOMEX Marketplace" className="py-10">
      <Container>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">NSOMEX MARKETPLACE</h1>
          <p className="mt-2 text-slate-600">Global Industrial & Equipment Marketplace</p>
          <p className="mt-1 text-sm text-slate-500">Discover equipment, machinery, technology, industrial products and services from verified suppliers and manufacturers.</p>

          <div className="mt-6 flex w-full items-center gap-3">
            <input
              aria-label="Search marketplace"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, equipment, suppliers or factories"
              className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="hidden h-10 w-10 items-center justify-center rounded-full bg-slate-100 md:inline-flex">📷</button>
            <button className="hidden h-10 w-10 items-center justify-center rounded-full bg-slate-100 md:inline-flex">🔊</button>
          </div>
        </div>

        <div className="mb-6 flex w-full flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActiveCategory(activeCategory === c.title ? null : c.title)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-sm ${activeCategory === c.title ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <div className="md:col-span-1 hidden md:block">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
          <div className="md:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">{filtered.length} products</div>
              <div className="flex items-center gap-2">
                <label className="text-sm">Page size</label>
                <select aria-label="Page size" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="rounded border px-2 py-1">
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>

            <div role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {paged.map((p) => (
                <div role="listitem" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => setPage((s) => Math.max(1, s - 1))} className="rounded border px-3 py-2">
            Prev
          </button>
          <div className="text-sm text-slate-600">Page {page} / {pageCount}</div>
          <button onClick={() => setPage((s) => Math.min(pageCount, s + 1))} className="rounded border px-3 py-2">
            Next
          </button>
        </div>
      </Container>
    </section>
  );
}

export default Marketplace;
