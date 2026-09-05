"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BuyerAccount } from "@/components/account/BuyerAccount";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export default function AccountPage() {
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("nsomex_recent_views") || "[]");
    setRecent(viewed);
  }, []);

  return (
    <>
      <BuyerAccount />
      <section className="pb-10">
        <Container>
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">Recently viewed</h2>
              <Link href="/products" className="text-sm font-semibold text-indigo-600">Browse more</Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recent.length === 0 ? (
                <p className="text-sm text-slate-500">No recent products yet. Open a product to build your viewing history.</p>
              ) : (
                recent.map((product) => (
                  <Link key={product.id} href={`/product/${product.slug}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-2 text-slate-500">{product.category}</p>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
