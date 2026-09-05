"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRFQ } from "@/components/rfq/RFQContext";
import { Container } from "@/components/ui/container";
import type { Product } from "@/lib/data/marketplace";

export function ProductDetails({ product }: { product: Product }) {
  const { openRFQ } = useRFQ();
  const [activeImage, setActiveImage] = useState(0);
  const [inquiryAdded, setInquiryAdded] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("nsomex_recent_views") || "[]") as any[];
    const saved = JSON.parse(localStorage.getItem("nsomex_saved") || "[]") as any[];
    setFavorite(saved.some((item) => item.id === product.id));
    if (!viewed.some((item) => item.id === product.id)) {
      localStorage.setItem("nsomex_recent_views", JSON.stringify([product, ...viewed].slice(0, 6)));
    }
  }, [product]);

  function addToInquiry() {
    const existing = JSON.parse(localStorage.getItem("nsomex_inquiries") || "[]");
    if (!existing.includes(product.id)) existing.push(product.id);
    localStorage.setItem("nsomex_inquiries", JSON.stringify(existing));
    setInquiryAdded(true);
  }

  function toggleFavorite() {
    const existing = JSON.parse(localStorage.getItem("nsomex_saved") || "[]") as any[];
    const next = existing.some((item) => item.id === product.id)
      ? existing.filter((item) => item.id !== product.id)
      : [...existing, product];
    localStorage.setItem("nsomex_saved", JSON.stringify(next));
    setFavorite(next.some((item) => item.id === product.id));
  }

  return (
    <section className="py-10">
      <Container>
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-indigo-600">Categories</Link>
          <span className="mx-2">/</span>
          <Link href={`/categories/${product.categorySlug}`} className="hover:text-indigo-600">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div>
            <div className="flex min-h-[24rem] items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 p-8 text-center text-slate-500">
              <div><div className="text-xs font-semibold uppercase tracking-[0.25em]">{product.category}</div><div className="mt-4 text-2xl font-semibold text-slate-700">{product.images[activeImage]}</div></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.images.map((image, index) => <button key={image} onClick={() => setActiveImage(index)} className={`rounded-lg border p-3 text-left text-xs ${activeImage === index ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white"}`}>{image}</button>)}
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div><h2 className="text-xl font-semibold">Product specifications</h2><dl className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">{product.specifications.map((spec) => <div key={spec.label} className="flex justify-between gap-4 p-3 text-sm"><dt className="text-slate-500">{spec.label}</dt><dd className="text-right font-medium text-slate-900">{spec.value}</dd></div>)}</dl></div>
              <div><h2 className="text-xl font-semibold">Applications</h2><ul className="mt-4 space-y-2 text-sm text-slate-600">{product.applications.map((application) => <li key={application}>• {application}</li>)}</ul><h2 className="mt-8 text-xl font-semibold">Shipping information</h2><p className="mt-3 text-sm leading-6 text-slate-600">{product.shipping}</p></div>
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{product.category}</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="mt-2 text-xs text-slate-500">SKU: {product.sku}</p>
            <div className="mt-5 flex items-center gap-2 text-sm"><span className="text-amber-500">★</span> {product.rating} supplier rating</div>
            <p className="mt-6 text-2xl font-bold text-slate-900">{product.price}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg bg-slate-50 p-3"><span className="block text-slate-500">MOQ</span><strong>{product.moq}</strong></div><div className="rounded-lg bg-slate-50 p-3"><span className="block text-slate-500">Availability</span><strong>{product.availableQuantity}</strong></div></div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{product.description}</p>
            <div className="mt-6 grid gap-2"><button onClick={() => openRFQ(product)} className="rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Request for Quote</button><button onClick={addToInquiry} className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">{inquiryAdded ? "Added to Inquiry" : "Add to Inquiry"}</button><button onClick={() => openRFQ(product)} className="rounded-full border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-700">Buy Now / Confirm Availability</button></div>
            <div className="mt-4 flex gap-2">
              <button onClick={toggleFavorite} className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${favorite ? "bg-amber-100 text-amber-700" : "border border-slate-300 bg-white text-slate-700"}`}>
                {favorite ? "Saved" : "Save product"}
              </button>
              <Link href={`/supplier/${product.supplier.slug}`} className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700">Supplier</Link>
            </div>
            <Link href={`/supplier/${product.supplier.slug}`} className="mt-6 block rounded-xl border border-slate-200 p-4 hover:border-indigo-300"><div className="flex items-center justify-between"><span className="font-semibold text-slate-900">{product.supplier.name}</span>{product.supplier.verified && <span className="text-xs font-semibold text-emerald-700">✓ VERIFIED</span>}</div><p className="mt-2 text-sm text-slate-600">{product.supplier.location}</p><p className="mt-2 text-sm text-slate-500">View supplier profile</p></Link>
            <Link href={`/supplier/${product.supplier.slug}`} className="mt-4 block text-center text-sm font-semibold text-indigo-600 hover:underline">Contact Supplier</Link>
          </aside>
        </div>
      </Container>
    </section>
  );
}
