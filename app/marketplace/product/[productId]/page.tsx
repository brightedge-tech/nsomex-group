import { notFound } from "next/navigation";
import { products } from "@/lib/data/marketplace";

export default function ProductPage({ params }: { params: { productId: string } }) {
  const product = products.find((p) => p.id === params.productId);
  if (!product) return notFound();

  return (
    <div className="py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="h-96 w-full rounded-md bg-slate-100" />
            <h1 className="mt-4 text-2xl font-bold">{product.name}</h1>
            <p className="mt-2 text-slate-700">{product.description}</p>
          </div>

          <aside className="p-4">
            <div className="rounded-md border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-600">Supplier</div>
              <div className="mt-2 font-semibold">{product.supplier.name}</div>
              <div className="mt-1 text-sm text-slate-500">{product.location}</div>
              {product.supplier.verified && <div className="mt-2 text-emerald-700">✓ VERIFIED SUPPLIER</div>}
              <div className="mt-4">
                <button className="w-full rounded-full bg-indigo-600 px-4 py-2 text-white">Request Quote</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
