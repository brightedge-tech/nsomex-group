import { notFound } from "next/navigation";
import { products } from "@/lib/data/marketplace";

export default function SupplierPage({ params }: { params: { supplierId: string } }) {
  const supplier = products.map((p) => p.supplier).find((s) => s.id === params.supplierId);
  if (!supplier) return notFound();

  const supplierProducts = products.filter((p) => p.supplier.id === supplier.id);

  return (
    <div className="py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-slate-200" />
          <div>
            <h1 className="text-2xl font-bold">{supplier.name}</h1>
            <p className="text-sm text-slate-600">Demo supplier profile</p>
            {supplier.verified && <div className="mt-2 text-emerald-700">✓ VERIFIED SUPPLIER</div>}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {supplierProducts.map((p) => (
              <div key={p.id} className="rounded-md border border-slate-200 p-3">
                <div className="h-24 w-full rounded-md bg-slate-100" />
                <div className="mt-2 font-semibold">{p.name}</div>
                <div className="text-sm text-slate-600">{p.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
