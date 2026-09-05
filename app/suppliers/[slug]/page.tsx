import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/marketplace/ProductCard";
import { Container } from "@/components/ui/container";
import { getSupplier, products } from "@/lib/data/marketplace";

export default async function SupplierDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplier = getSupplier(slug);
  if (!supplier) return notFound();
  const supplierProducts = products.filter((product) => product.supplier.id === supplier.id);

  return (
    <section className="py-10">
      <Container>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Supplier profile</p><h1 className="mt-3 text-3xl font-bold text-slate-900">{supplier.name}</h1><p className="mt-2 text-slate-600">{supplier.location}</p></div>{supplier.verified && <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">✓ Verified supplier</span>}</div>
          <p className="mt-6 max-w-3xl leading-7 text-slate-600">{supplier.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-slate-50 p-4"><strong>{supplier.yearsInBusiness} years</strong><span className="mt-1 block text-sm text-slate-500">In business</span></div><div className="rounded-lg bg-slate-50 p-4"><strong>★ {supplier.rating}</strong><span className="mt-1 block text-sm text-slate-500">Supplier rating</span></div><div className="rounded-lg bg-slate-50 p-4"><strong>{supplierProducts.length} products</strong><span className="mt-1 block text-sm text-slate-500">Listed catalog</span></div></div>
          <div className="mt-6 flex flex-wrap gap-3"><Link href="/rfq" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Request quote</Link><Link href="/rfq" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Contact supplier</Link></div>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]"><div><h2 className="text-xl font-semibold">Product catalog</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{supplierProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></div><aside className="h-fit rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-semibold">Factory information</h2><p className="mt-3 text-sm leading-6 text-slate-600">{supplier.factory}</p><h2 className="mt-6 font-semibold">Certifications</h2><ul className="mt-3 space-y-2 text-sm text-slate-600">{supplier.certifications.map((certification) => <li key={certification}>✓ {certification}</li>)}</ul></aside></div>
      </Container>
    </section>
  );
}
