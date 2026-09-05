"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PlatformShell, Status } from "@/components/platform/PlatformUI";

type CartItem = {
  id: string;
  product: string;
  productId: string;
  supplier: string;
  verified: boolean;
  quantity: number;
  moq: number;
  unitPrice: number;
  shipping: number;
};

const initialItems: CartItem[] = [
  { id: "cart-1", product: "Industrial Solar Inverter", productId: "industrial-solar-inverter", supplier: "SolarTech Africa", verified: true, quantity: 12, moq: 1, unitPrice: 2066.67, shipping: 1250 },
  { id: "cart-2", product: "Edge Gateway X1", productId: "edge-gateway-x1", supplier: "IoT Hub Ltd", verified: false, quantity: 10, moq: 5, unitPrice: 1200, shipping: 480 },
];

const money = (value: number) => `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export default function CartPage() {
  const [items, setItems] = useState(initialItems);
  const [saved, setSaved] = useState<string[]>([]);

  const updateQuantity = (id: string, delta: number) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(item.moq, item.quantity + delta) } : item));
  };

  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));
  const saveForLater = (id: string) => setSaved((current) => current.includes(id) ? current : [...current, id]);
  const suppliers = [...new Set(items.map((item) => item.supplier))];
  const productTotal = items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  const shippingTotal = items.reduce((total, item) => total + item.shipping, 0);

  return (
    <PlatformShell eyebrow="Buyer procurement" title="Procurement list" description="Group sourcing needs by supplier, confirm commercial terms, and move selected items into an order." action={<Link href="/inquiries" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">View inquiries</Link>}>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {suppliers.map((supplier) => (
            <section key={supplier}>
              <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">{supplier}</h2><span className="text-sm text-slate-500">{items.filter((item) => item.supplier === supplier).length} items</span></div>
              <div className="space-y-3">
                {items.filter((item) => item.supplier === supplier).map((item) => (
                  <Card key={item.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><Link href={`/product/${item.productId}`} className="font-semibold text-slate-900 hover:text-indigo-700">{item.product}</Link><p className="mt-1 text-sm text-slate-500">{item.supplier} · MOQ {item.moq} units</p></div><Status>{item.verified ? "Verified supplier" : "Verification in progress"}</Status></div>
                    <div className="mt-5 grid gap-4 text-sm sm:grid-cols-4"><div><span className="block text-slate-500">Quantity</span><div className="mt-1 inline-flex items-center rounded-lg border border-slate-200"><button aria-label={`Decrease ${item.product} quantity`} onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1.5 text-lg">-</button><span className="min-w-10 border-x border-slate-200 px-3 py-1.5 text-center font-semibold">{item.quantity}</span><button aria-label={`Increase ${item.product} quantity`} onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1.5 text-lg">+</button></div></div><div><span className="block text-slate-500">Unit price</span><strong>{money(item.unitPrice)}</strong></div><div><span className="block text-slate-500">Estimated subtotal</span><strong>{money(item.quantity * item.unitPrice)}</strong></div><div><span className="block text-slate-500">Shipping estimate</span><strong>{money(item.shipping)}</strong></div></div>
                    <div className="mt-5 flex flex-wrap gap-3"><Link href="/messages" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Contact supplier</Link><Link href={`/rfq/create`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Request quote</Link><button onClick={() => saveForLater(item.id)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">{saved.includes(item.id) ? "Saved for later" : "Save for later"}</button><button onClick={() => removeItem(item.id)} className="rounded-full px-4 py-2 text-sm font-semibold text-rose-600">Remove</button></div>
                  </Card>
                ))}
              </div>
            </section>
          ))}
          {items.length === 0 && <Card className="p-10 text-center"><h2 className="font-semibold text-slate-900">Your procurement list is empty</h2><Link href="/marketplace" className="mt-4 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Browse marketplace</Link></Card>}
        </div>
        <Card className="h-fit p-6 lg:sticky lg:top-24"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Order estimate</p><h2 className="mt-2 text-xl font-bold text-slate-900">Ready for review</h2><dl className="mt-6 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-slate-500">Products</dt><dd>{money(productTotal)}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Shipping estimate</dt><dd>{money(shippingTotal)}</dd></div><div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold"><dt>Estimated total</dt><dd>{money(productTotal + shippingTotal)}</dd></div></dl><Link href="/order/create/inq-204" className="mt-6 flex justify-center rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">Review order</Link><p className="mt-3 text-xs leading-5 text-slate-500">Final shipping, taxes, and payment terms are confirmed with the supplier before submission.</p></Card>
      </div>
    </PlatformShell>
  );
}
