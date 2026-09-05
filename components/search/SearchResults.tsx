"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/marketplace/ProductCard";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { categories, products } from "@/lib/data/marketplace";

export function SearchResults() {
  const params = useSearchParams();
  const queryParam = params.get("q") ?? "";
  const [query, setQuery] = useState(queryParam);
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const nextProducts = products.filter((product) => {
      const matchesText =
        !needle ||
        `${product.name} ${product.description} ${product.category} ${product.supplier.name} ${product.location}`
          .toLowerCase()
          .includes(needle);

      const matchesCategory = category === "all" || product.categorySlug === category;
      const matchesLocation = location === "all" || product.location.toLowerCase().includes(location.toLowerCase());
      const matchesVerified = !verifiedOnly || product.supplier.verified;

      return matchesText && matchesCategory && matchesLocation && matchesVerified;
    });

    const sorted = [...nextProducts];
    if (sortBy === "price-low") {
      sorted.sort((a, b) => Number(String(a.price).replace(/[^0-9.]/g, "")) - Number(String(b.price).replace(/[^0-9.]/g, "")));
    }
    if (sortBy === "price-high") {
      sorted.sort((a, b) => Number(String(b.price).replace(/[^0-9.]/g, "")) - Number(String(a.price).replace(/[^0-9.]/g, "")));
    }
    if (sortBy === "newest") {
      sorted.reverse();
    }

    return sorted;
  }, [category, location, query, sortBy, verifiedOnly]);

  return (
    <section className="py-10">
      <Container>
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Search</span>
        </nav>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, suppliers or equipment"
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Search</button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-full border border-slate-200 bg-white px-3 py-2">
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.title}</option>
              ))}
            </select>
            <select value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-full border border-slate-200 bg-white px-3 py-2">
              <option value="all">All locations</option>
              <option value="South Africa">South Africa</option>
              <option value="Kenya">Kenya</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Egypt">Egypt</option>
              <option value="Ghana">Ghana</option>
            </select>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-full border border-slate-200 bg-white px-3 py-2">
              <option value="relevance">Sort by relevance</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="newest">Newest</option>
            </select>
            <button
              type="button"
              onClick={() => setVerifiedOnly((value) => !value)}
              className={`rounded-full px-3 py-2 font-medium ${verifiedOnly ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}
            >
              Verified suppliers only
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[15rem_1fr]">
          <aside className="space-y-4">
            <Card className="p-5">
              <h2 className="font-semibold text-slate-900">Filters</h2>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-700">MOQ</p>
                  <div className="mt-2 flex gap-2">
                    <button className="rounded-full bg-slate-100 px-3 py-1.5">1-10</button>
                    <button className="rounded-full bg-slate-100 px-3 py-1.5">10-100</button>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Price range</p>
                  <div className="mt-2 space-y-2">
                    <div className="rounded-lg bg-slate-100 px-3 py-2">Under $5,000</div>
                    <div className="rounded-lg bg-slate-100 px-3 py-2">$5k - $50k</div>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Availability</p>
                  <div className="mt-2 rounded-lg bg-slate-100 px-3 py-2">In stock</div>
                </div>
              </div>
            </Card>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">{filteredProducts.length} results</p>
              <Link href="/products" className="text-sm font-semibold text-indigo-600">View all products</Link>
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="p-8 text-center">
                <h2 className="text-xl font-semibold text-slate-900">No search results found</h2>
                <p className="mt-2 text-slate-600">Try another keyword, wider category, or clear one of your filters.</p>
                <Link href="/products" className="mt-5 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Browse all products</Link>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
