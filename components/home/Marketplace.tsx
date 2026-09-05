"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { categories, products as catalogProducts } from "@/lib/data/marketplace";
import ProductCard from "@/components/marketplace/ProductCard";
import FilterSidebar from "@/components/filters/FilterSidebar";

const featuredCategories = [
  { slug: "construction-equipment", title: "Construction", count: "420 listings" },
  { slug: "industrial-equipment", title: "Industrial Equipment", count: "640 listings" },
  { slug: "renewable-energy", title: "Renewable Energy", count: "240 listings" },
  { slug: "security-surveillance", title: "Security & Surveillance", count: "185 listings" },
  { slug: "electrical-equipment", title: "Electrical Equipment", count: "310 listings" },
  { slug: "tools-hardware", title: "Tools & Hardware", count: "520 listings" },
];

export function Marketplace() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [products] = useState(catalogProducts);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory && p.categorySlug !== activeCategory) return false;
      if (query && !`${p.name} ${p.category} ${p.description} ${p.supplier.name}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.category && p.category !== filters.category) return false;
      if (filters.location && !p.location.toLowerCase().includes(String(filters.location).toLowerCase())) return false;
      if (typeof filters.verified === "boolean" && p.supplier.verified !== filters.verified) return false;
      if (filters.priceMax && typeof p.price === "string") {
        const n = Number(String(p.price).replace(/[^0-9.]/g, ""));
        if (!isNaN(n) && n > filters.priceMax) return false;
      }
      return true;
    });
  }, [products, filters, activeCategory, query]);

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
        <div className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600">Global sourcing network</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Smart B2B sourcing for industrial growth</h1>
              <p className="mt-3 text-slate-600">Search equipment, compare suppliers, manage RFQs and source with confidence across Africa and global trade corridors.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/rfq/create" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Post an RFQ</Link>
              <Link href="/suppliers" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Explore suppliers</Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <input
              aria-label="Search marketplace"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, equipment, suppliers or factories"
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Link href="/search?q=generator" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Search Products</Link>
            <Link href="/search?q=generator" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">Search by Image</Link>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Popular categories</h2>
            <Link href="/categories" className="text-sm font-semibold text-indigo-600">Browse all categories</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Category</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{category.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Featured products</h2>
            <Link href="/products" className="text-sm font-semibold text-indigo-600">See all products</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Trending products</h2>
            <div className="mt-4 space-y-3">
              {products.slice(0, 4).map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-300">
                  <div>
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{product.supplier.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-700">{product.price}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Verified suppliers</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {catalogProducts.slice(0, 4).map((product) => (
                <Link key={product.supplier.id} href={`/supplier/${product.supplier.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">{product.supplier.name.slice(0, 2).toUpperCase()}</div>
                    {product.supplier.verified && <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Verified</span>}
                  </div>
                  <h3 className="mt-3 font-semibold text-slate-900">{product.supplier.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{product.supplier.location}</p>
                  <p className="mt-2 text-sm text-slate-600">{product.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card>
            <h3 className="text-xl font-bold text-slate-900">Featured factories</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Inspect manufacturing sites, certifications, and production capabilities before issuing an RFQ.</p>
            <Link href="/suppliers" className="mt-4 inline-flex text-sm font-semibold text-indigo-600">View factories</Link>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-slate-900">Recommended products</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Based on your current sourcing preferences and category activity across the marketplace.</p>
            <Link href="/search?q=solar" className="mt-4 inline-flex text-sm font-semibold text-indigo-600">See recommendations</Link>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-slate-900">Latest RFQs</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Track active procurement requests and respond to buyers with faster, better quotations.</p>
            <Link href="/rfq" className="mt-4 inline-flex text-sm font-semibold text-indigo-600">View RFQs</Link>
          </Card>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-xl font-bold text-slate-900">Why buy through NSOMEX</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Verified supplier screening and supplier trust signals.</li>
              <li>• Clear RFQ workflows and quotation comparisons.</li>
              <li>• Secure buyer communication and sourcing coordination.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-slate-900">Supplier benefits</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Access to qualified buyers and procurement teams.</li>
              <li>• Product listing management and verification support.</li>
              <li>• Streamlined order and inquiry tracking.</li>
            </ul>
          </Card>
        </div>

        <div className="mt-10 rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Buyer protection</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Source with confidence and transparency</h3>
            </div>
            <Link href="/register" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Create account</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Marketplace;
