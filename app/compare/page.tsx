"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { products, type Product } from "@/lib/data/marketplace";

const STORAGE_KEY = "nsomex_compare";

export default function ComparePage() {
  const [selected, setSelected] = useState<Product[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
    const nextProducts = products.filter((product) => stored.includes(product.id));
    setSelected(nextProducts);
  }, []);

  const addProduct = (product: Product) => {
    const next = selected.some((item) => item.id === product.id)
      ? selected.filter((item) => item.id !== product.id)
      : [...selected, product].slice(0, 3);

    setSelected(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.map((item) => item.id)));
  };

  if (selected.length === 0) {
    return (
      <section className="py-10">
        <Container>
          <Card className="mx-auto max-w-3xl p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Comparison</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">No products selected</h1>
            <p className="mt-3 text-slate-600">Choose up to three products to compare price, MOQ, supplier, availability and certifications.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Browse products</Link>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10">
      <Container>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Comparison</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Compare products</h1>
          </div>
          <Link href="/products" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Add more products</Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 font-semibold text-slate-700">Attribute</th>
                {selected.map((product) => (
                  <th key={product.id} className="p-4 font-semibold text-slate-900">
                    <div className="flex flex-col gap-2">
                      <span>{product.name}</span>
                      <button onClick={() => addProduct(product)} className="text-left text-xs font-medium text-indigo-600">Remove</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200"><td className="p-4 font-medium text-slate-700">Price</td>{selected.map((product) => <td key={product.id} className="p-4 text-slate-600">{product.price}</td>)}</tr>
              <tr className="border-t border-slate-200"><td className="p-4 font-medium text-slate-700">MOQ</td>{selected.map((product) => <td key={product.id} className="p-4 text-slate-600">{product.moq}</td>)}</tr>
              <tr className="border-t border-slate-200"><td className="p-4 font-medium text-slate-700">Supplier</td>{selected.map((product) => <td key={product.id} className="p-4 text-slate-600">{product.supplier.name}</td>)}</tr>
              <tr className="border-t border-slate-200"><td className="p-4 font-medium text-slate-700">Location</td>{selected.map((product) => <td key={product.id} className="p-4 text-slate-600">{product.location}</td>)}</tr>
              <tr className="border-t border-slate-200"><td className="p-4 font-medium text-slate-700">Rating</td>{selected.map((product) => <td key={product.id} className="p-4 text-slate-600">★ {product.rating}</td>)}</tr>
              <tr className="border-t border-slate-200"><td className="p-4 font-medium text-slate-700">Availability</td>{selected.map((product) => <td key={product.id} className="p-4 text-slate-600">{product.availableQuantity}</td>)}</tr>
              <tr className="border-t border-slate-200"><td className="p-4 font-medium text-slate-700">Lead time</td>{selected.map((product) => <td key={product.id} className="p-4 text-slate-600">4-8 weeks</td>)}</tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <button key={product.id} type="button" onClick={() => addProduct(product)} className={`rounded-2xl border p-4 text-left ${selected.some((item) => item.id === product.id) ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white"}`}>
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="mt-1 text-sm text-slate-500">{product.category}</p>
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
