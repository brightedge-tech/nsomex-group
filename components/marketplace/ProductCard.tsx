"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useRFQ } from "@/components/rfq/RFQContext";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }: { product: any }) {
  const { openRFQ } = useRFQ();
  return (
    <Card className="flex h-full flex-col p-4">
      <div className="h-44 w-full rounded-md bg-slate-100" />
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{product.name}</h3>
      <div className="mt-1 text-sm text-slate-600">{product.category}</div>
      <p className="mt-2 text-sm text-slate-600">{product.description}</p>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-slate-700">{product.location}</div>
        <div className="text-sm text-slate-700">{product.price ?? "Request Price"}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="text-sm text-slate-700">{product.supplier.name}</div>
        </div>

        <div className="flex items-center gap-2">
          {product.supplier.verified && (
            <div className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">✓ VERIFIED</div>
          )}
          <Link href={`/marketplace/product/${product.id}`} className={cn("rounded-full bg-indigo-600 px-3 py-2 text-sm font-medium text-white")}>
            View
          </Link>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button aria-label={`Request quote for ${product.name}`} onClick={() => openRFQ(product)} className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm">Request Quote</button>
        <button aria-label={`Save ${product.name}`} onClick={() => {
          const existing = JSON.parse(localStorage.getItem('nsomex_saved') || '[]');
          if (!existing.find((s: any) => s.id === product.id)) existing.push(product);
          localStorage.setItem('nsomex_saved', JSON.stringify(existing));
          alert('Saved (demo)');
        }} className="rounded-full bg-slate-100 px-3 py-2 text-sm">Save</button>
      </div>
    </Card>
  );
}
