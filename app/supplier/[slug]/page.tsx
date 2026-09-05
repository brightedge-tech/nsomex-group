import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { getSupplier, products } from "@/lib/data/marketplace";
import ProductCard from "@/components/marketplace/ProductCard";

export default async function SupplierRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplier = getSupplier(slug);

  if (!supplier) return notFound();

  const supplierProducts = products.filter((product) => product.supplier.id === supplier.id);

  return (
    <section className="py-10">
      <Container>
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/suppliers" className="hover:text-indigo-600">Suppliers</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{supplier.name}</span>
        </nav>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Supplier profile</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">{supplier.name}</h1>
              <p className="mt-2 text-slate-600">{supplier.location} · {supplier.yearsInBusiness} years in business</p>
            </div>
            {supplier.verified && <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">Verified supplier</span>}
          </div>

          <p className="mt-6 max-w-3xl text-slate-600">{supplier.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Business type</p><p className="mt-2 font-semibold text-slate-900">Manufacturer</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Main products</p><p className="mt-2 font-semibold text-slate-900">Industrial equipment</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Rating</p><p className="mt-2 font-semibold text-slate-900">★ {supplier.rating}</p></div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/rfq/create" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Request quote</Link>
            <Link href="/messages" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Send inquiry</Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 flex gap-2 text-sm font-medium">
              <button className="rounded-full bg-indigo-600 px-3 py-1.5 text-white">Overview</button>
              <button className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">Products</button>
              <button className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">Certifications</button>
              <button className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">Factory</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {supplierProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="p-5">
              <h2 className="font-semibold text-slate-900">Factory information</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{supplier.factory}</p>
            </Card>
            <Card className="p-5">
              <h2 className="font-semibold text-slate-900">Certifications</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {supplier.certifications.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <h2 className="font-semibold text-slate-900">Supplier statistics</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Response time: 2 hours</li>
                <li>On-time delivery: 96%</li>
                <li>Order fulfillment: 89%</li>
              </ul>
            </Card>
          </aside>
        </div>
      </Container>
    </section>
  );
}
