"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRFQ } from "@/components/rfq/RFQContext";
import { Container } from "@/components/ui/container";
import type { Product } from "@/lib/data/marketplace";
import { useAuth } from "@/components/auth/AuthProvider";

export function ProductDetails({ product }: { product: Product }) {
  const { openRFQ } = useRFQ();
  const { favoriteIds, toggleFavorite, session, isLoading: authLoading } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [favoriteSaving, setFavoriteSaving] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquirySubject, setInquirySubject] = useState(product.name);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryQuantity, setInquiryQuantity] = useState("1");
  const [inquirySaving, setInquirySaving] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const favorite = favoriteIds.includes(product.id);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("nsomex_recent_views") || "[]") as Product[];
    const next = [product, ...viewed.filter((item) => item.id !== product.id)].slice(0, 6);
    localStorage.setItem("nsomex_recent_views", JSON.stringify(next));
  }, [product]);

  async function handleFavoriteToggle() {
    setFavoriteSaving(true);
    setFavoriteError("");
    const saved = await toggleFavorite(product);
    if (!saved) setFavoriteError("Sign in or try again to update your saved products.");
    setFavoriteSaving(false);
  }

  async function submitInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInquirySaving(true);
    setInquiryError("");
    const subject = inquirySubject.trim();
    const message = inquiryMessage.trim();
    const quantity = Number(inquiryQuantity);
    if (subject.length < 3 || subject.length > 120) {
      setInquiryError("Subject must be between 3 and 120 characters.");
      setInquirySaving(false);
      return;
    }
    if (message.length < 10 || message.length > 2000) {
      setInquiryError("Message must be between 10 and 2,000 characters.");
      setInquirySaving(false);
      return;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setInquiryError("Quantity must be greater than 0.");
      setInquirySaving(false);
      return;
    }
    try {
      const response = await fetch("/api/product-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          subject,
          message,
          quantity,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sign in with a buyer account to send an inquiry.");
        }
        throw new Error(result.error ?? "Your inquiry could not be sent.");
      }
      setInquirySent(true);
    } catch (submitError) {
      setInquiryError(submitError instanceof Error ? submitError.message : "Your inquiry could not be sent.");
    } finally {
      setInquirySaving(false);
    }
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
            <div className="relative flex min-h-[24rem] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 p-8 text-center text-slate-500">
              {product.images[activeImage]?.startsWith("http") ? <Image src={product.images[activeImage]} alt={product.name} fill unoptimized className="object-contain" /> : <div><div className="text-xs font-semibold uppercase tracking-[0.25em]">{product.category}</div><div className="mt-4 text-2xl font-semibold text-slate-700">{product.images[activeImage] || "Product image"}</div></div>}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.images.map((image, index) => <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`relative min-h-14 overflow-hidden rounded-lg border p-3 text-left text-xs ${activeImage === index ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white"}`}>{image.startsWith("http") ? <Image src={image} alt={`${product.name} view ${index + 1}`} fill unoptimized className="object-cover" /> : image}</button>)}
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
            <div className="mt-6 grid gap-2"><button onClick={() => openRFQ(product)} className="rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Request for Quote</button><button onClick={() => { setInquiryOpen((open) => !open); setInquirySent(false); setInquiryError(""); }} className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">Contact Supplier</button><button onClick={() => openRFQ(product)} className="rounded-full border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-700">Buy Now / Confirm Availability</button></div>
            <div className="mt-4 flex gap-2">
              <button disabled={favoriteSaving} aria-pressed={favorite} onClick={() => void handleFavoriteToggle()} className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold disabled:opacity-50 ${favorite ? "bg-amber-100 text-amber-700" : "border border-slate-300 bg-white text-slate-700"}`}>
                {favorite ? "Saved" : "Save product"}
              </button>
              <Link href={`/supplier/${product.supplier.slug}`} className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700">Supplier</Link>
            </div>
            {favoriteError && <p role="alert" className="mt-2 text-sm text-rose-700">{favoriteError}</p>}
            {inquiryOpen && <div className="mt-5 rounded-xl border border-slate-200 p-4">
              {inquirySent ? <div role="status"><p className="font-semibold text-emerald-700">Inquiry sent</p><p className="mt-1 text-sm text-slate-600">Status: <span className="font-semibold">Pending</span>. You can track the request and supplier response from your account inquiries.</p><Link href="/account/inquiries" className="mt-3 inline-flex text-sm font-semibold text-indigo-600">View my inquiries</Link></div> : authLoading ? <p role="status" className="text-sm text-slate-600">Checking your sign-in...</p> : session.role !== "buyer" ? <div><p className="text-sm text-slate-700">Sign in with a buyer account to contact this supplier.</p><Link href="/login" className="mt-3 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Sign in</Link></div> : <form onSubmit={submitInquiry} className="space-y-3">
                <h2 className="font-semibold text-slate-900">Send an inquiry</h2>
                <label className="block text-sm text-slate-600">Subject<input required minLength={3} maxLength={120} value={inquirySubject} onChange={(event) => setInquirySubject(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label>
                <label className="block text-sm text-slate-600">Quantity requested<input required type="number" min="0.01" max="999999999999" step="0.01" value={inquiryQuantity} onChange={(event) => setInquiryQuantity(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label>
                <label className="block text-sm text-slate-600">Message<textarea required minLength={10} maxLength={2000} rows={4} value={inquiryMessage} onChange={(event) => setInquiryMessage(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label>
                {inquiryError && <p role="alert" className="text-sm text-rose-700">{inquiryError}{inquiryError.startsWith("Sign in") && <> <Link href="/login" className="font-semibold underline">Sign in</Link></>}</p>}
                <button disabled={inquirySaving} className="w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{inquirySaving ? "Sending..." : "Send inquiry"}</button>
              </form>}
            </div>}
            <Link href={`/supplier/${product.supplier.slug}`} className="mt-6 block rounded-xl border border-slate-200 p-4 hover:border-indigo-300"><div className="flex items-center justify-between"><span className="font-semibold text-slate-900">{product.supplier.name}</span>{product.supplier.verified && <span className="text-xs font-semibold text-emerald-700">✓ VERIFIED</span>}</div><p className="mt-2 text-sm text-slate-600">{product.supplier.location}</p><p className="mt-2 text-sm text-slate-500">View supplier profile</p></Link>
          </aside>
        </div>
      </Container>
    </section>
  );
}
