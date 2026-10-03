"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/marketplace/ProductCard";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import type { CategoryRecord } from "@/lib/services/categoryService";

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const queryParam = params.get("q") ?? "";
  const [query, setQuery] = useState(queryParam);
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [location, setLocation] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [moqRange, setMoqRange] = useState("");
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/categories", { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("categories");
      const result = await response.json();
      setCategories(result.categories ?? []);
    }).catch((fetchError: unknown) => {
      if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) setError(true);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const requestParams = new URLSearchParams({ q: query, category, verifiedOnly: String(verifiedOnly), inStock: String(inStock), sort: sortBy, page: String(page), pageSize: "12" });
    if (location !== "all") requestParams.set("location", location);
    if (moqRange === "1-10") { requestParams.set("minMoq", "1"); requestParams.set("maxMoq", "10"); }
    if (moqRange === "10-100") { requestParams.set("minMoq", "10"); requestParams.set("maxMoq", "100"); }
    if (priceMax !== undefined) requestParams.set("priceMax", String(priceMax));

    fetch(`/api/search?${requestParams.toString()}`, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("search");
      const result = await response.json();
      setProducts(result.items ?? []);
      setTotal(result.total ?? 0);
      setTotalPages(result.totalPages ?? 0);
      setError(false);
      if (result.page !== page) setPage(result.page);
    }).catch((fetchError: unknown) => {
      if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) setError(true);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });

    const currentParams = new URLSearchParams();
    if (query) currentParams.set("q", query); else currentParams.delete("q");
    if (category !== "all") currentParams.set("category", category); else currentParams.delete("category");
    if (page > 1) currentParams.set("page", String(page)); else currentParams.delete("page");
    if (verifiedOnly) currentParams.set("verifiedOnly", "true");
    if (inStock) currentParams.set("inStock", "true");
    if (location !== "all") currentParams.set("location", location);
    if (moqRange) {
      currentParams.set("minMoq", moqRange === "1-10" ? "1" : "10");
      currentParams.set("maxMoq", moqRange === "1-10" ? "10" : "100");
    }
    if (priceMax !== undefined) currentParams.set("priceMax", String(priceMax));
    if (sortBy !== "relevance") currentParams.set("sort", sortBy);
    const search = currentParams.toString();
    if (search !== params.toString()) router.replace(`/search${search ? `?${search}` : ""}`, { scroll: false });
    return () => controller.abort();
  }, [category, inStock, location, moqRange, page, params, priceMax, query, router, sortBy, verifiedOnly]);

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
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search products, suppliers or equipment"
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="button" onClick={() => setPage(1)} className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Search</button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="rounded-full border border-slate-200 bg-white px-3 py-2">
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.title}</option>
              ))}
            </select>
            <select value={location} onChange={(event) => { setLocation(event.target.value); setPage(1); }} className="rounded-full border border-slate-200 bg-white px-3 py-2">
              <option value="all">All locations</option>
              <option value="South Africa">South Africa</option>
              <option value="Kenya">Kenya</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Egypt">Egypt</option>
              <option value="Ghana">Ghana</option>
            </select>
            <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1); }} className="rounded-full border border-slate-200 bg-white px-3 py-2">
              <option value="relevance">Sort by relevance</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="newest">Newest</option>
            </select>
            <button
              type="button"
              onClick={() => { setVerifiedOnly((value) => !value); setPage(1); }}
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
                    <button type="button" aria-pressed={moqRange === "1-10"} onClick={() => { setMoqRange((value) => value === "1-10" ? "" : "1-10"); setPage(1); }} className="rounded-full bg-slate-100 px-3 py-1.5">1-10</button>
                    <button type="button" aria-pressed={moqRange === "10-100"} onClick={() => { setMoqRange((value) => value === "10-100" ? "" : "10-100"); setPage(1); }} className="rounded-full bg-slate-100 px-3 py-1.5">10-100</button>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Price range</p>
                  <div className="mt-2 space-y-2">
                    <button type="button" aria-pressed={priceMax === 5000} onClick={() => { setPriceMax((value) => value === 5000 ? undefined : 5000); setPage(1); }} className="block rounded-lg bg-slate-100 px-3 py-2">Under $5,000</button>
                    <button type="button" aria-pressed={priceMax === 50000} onClick={() => { setPriceMax((value) => value === 50000 ? undefined : 50000); setPage(1); }} className="block rounded-lg bg-slate-100 px-3 py-2">Up to $50,000</button>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Availability</p>
                  <button type="button" aria-pressed={inStock} onClick={() => { setInStock((value) => !value); setPage(1); }} className="mt-2 rounded-lg bg-slate-100 px-3 py-2">In stock</button>
                </div>
              </div>
            </Card>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">{total} results</p>
              <Link href="/products" className="text-sm font-semibold text-indigo-600">View all products</Link>
            </div>

            {loading ? <Card className="p-8 text-center text-slate-600" role="status">Searching products...</Card> : error ? <Card className="p-8 text-center text-slate-600" role="alert">Search is temporarily unavailable. Please try again.</Card> : products.length === 0 ? (
              <Card className="p-8 text-center">
                <h2 className="text-xl font-semibold text-slate-900">No search results found</h2>
                <p className="mt-2 text-slate-600">Try another keyword, wider category, or clear one of your filters.</p>
                <Link href="/products" className="mt-5 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Browse all products</Link>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            {!loading && !error && totalPages > 1 && <nav aria-label="Search result pages" className="mt-6 flex items-center justify-between">
              <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40">Previous</button>
              <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40">Next</button>
            </nav>}
          </div>
        </div>
      </Container>
    </section>
  );
}
