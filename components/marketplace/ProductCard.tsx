"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRFQ } from "@/components/rfq/RFQContext";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }: { product: any }) {
  const { openRFQ } = useRFQ();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nsomex_saved") || "[]") as any[];
    setFavorite(saved.some((item) => item.id === product.id));
  }, [product.id]);

  const toggleFavorite = () => {
    const existing = JSON.parse(localStorage.getItem("nsomex_saved") || "[]") as any[];
    const next = existing.some((item) => item.id === product.id)
      ? existing.filter((item) => item.id !== product.id)
      : [...existing, product];

    localStorage.setItem("nsomex_saved", JSON.stringify(next));
    setFavorite(next.some((item) => item.id === product.id));
  };

  const markViewed = () => {
    const viewed = JSON.parse(localStorage.getItem("nsomex_recent_views") || "[]") as any[];
    const withoutCurrent = viewed.filter((item) => item.id !== product.id);
    localStorage.setItem("nsomex_recent_views", JSON.stringify([product, ...withoutCurrent].slice(0, 6)));
  };

  return (
    <Card className="flex h-full flex-col p-4">
      <Link href={`/product/${product.slug || product.id}`} onClick={markViewed} className="block h-44 w-full rounded-md bg-gradient-to-br from-slate-100 to-indigo-100 p-4 text-sm font-medium text-slate-500">Product image</Link>
      <h3 className="mt-3 text-lg font-semibold text-slate-900"><Link href={`/product/${product.slug || product.id}`} onClick={markViewed} className="hover:text-indigo-600">{product.name}</Link></h3>
      <div className="mt-1 text-sm text-slate-600">{product.category}</div>
      <p className="mt-2 text-sm text-slate-600">{product.description}</p>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-slate-700">{product.location}</div>
        <div className="text-sm text-slate-700">{product.price ?? "Request Price"}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <Link href={`/supplier/${product.supplier.slug || product.supplier.id}`} className="text-sm text-slate-700 hover:text-indigo-600">{product.supplier.name}</Link>
        </div>

        <div className="flex items-center gap-2">
          {product.supplier.verified && (
            <div className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">✓ VERIFIED</div>
          )}
          <Link href={`/product/${product.slug || product.id}`} onClick={markViewed} className={cn("rounded-full bg-indigo-600 px-3 py-2 text-sm font-medium text-white")}>
            View
          </Link>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button aria-label={`Request quote for ${product.name}`} onClick={() => openRFQ(product)} className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm">Request Quote</button>
        <button aria-label={`Save ${product.name}`} onClick={toggleFavorite} className={`rounded-full px-3 py-2 text-sm ${favorite ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
          {favorite ? "Saved" : "Save"}
        </button>
      </div>
    </Card>
  );
}
