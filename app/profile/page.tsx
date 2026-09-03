"use client";

import { Container } from "@/components/ui/container";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [saved, setSaved] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);

  useEffect(() => {
    setSaved(JSON.parse(localStorage.getItem('nsomex_saved') || '[]'));
    setRfqs(JSON.parse(localStorage.getItem('nsomex_rfqs') || '[]'));
  }, []);

  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-bold">My Account</h1>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-semibold">Saved Products</h2>
            {saved.length === 0 && <div className="text-sm text-slate-500">No saved products.</div>}
            <div className="mt-3 space-y-3">
              {saved.map((s) => (
                <div key={s.id} className="rounded-md border p-3">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-slate-600">{s.category}</div>
                  <div className="mt-2">
                    <Link href={`/marketplace/product/${s.id}`} className="text-indigo-600">View product</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold">My RFQs</h2>
            {rfqs.length === 0 && <div className="text-sm text-slate-500">No RFQs submitted.</div>}
            <div className="mt-3 space-y-3">
              {rfqs.map((r) => (
                <div key={r.id} className="rounded-md border p-3">
                  <div className="font-semibold">{r.product?.name ?? 'Custom RFQ'}</div>
                  <div className="text-sm text-slate-600">Quantity: {r.quantity}</div>
                  <div className="mt-2"><Link href="/rfq" className="text-indigo-600">View RFQs</Link></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
