"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { products } from "@/lib/data/marketplace";

export default function FavoritesPage() {
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("nsomex_saved") || "[]");
    setSaved(stored);
  }, []);

  if (saved.length === 0) {
    return (
      <section className="py-10">
        <Container>
          <Card className="mx-auto max-w-2xl p-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Your favorites is empty</h1>
            <p className="mt-3 text-slate-600">Keep products and suppliers you want to compare or revisit in one place.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Browse products</Link>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10">
      <Container>
        <h1 className="text-3xl font-bold text-slate-900">Saved products & suppliers</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((item) => (
            <Card key={item.id} className="p-4">
              <p className="font-semibold text-slate-900">{item.name || item.title || item.company || item.supplier?.name}</p>
              <p className="mt-2 text-sm text-slate-500">{item.category || item.location || item.company || item.supplier?.location}</p>
              <Link href={item.supplier ? `/supplier/${item.supplier.slug}` : `/product/${item.slug}`} className="mt-4 inline-flex text-sm font-semibold text-indigo-600">Open item</Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
