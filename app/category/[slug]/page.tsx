import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { categories, getProductsByCategory, products } from "@/lib/data/marketplace";
import ProductCard from "@/components/marketplace/ProductCard";

export default async function CategoryRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug || item.title.toLowerCase().replace(/\s+/g, "-") === slug);

  if (!category) return notFound();

  const categoryProducts = getProductsByCategory(slug);
  const featuredSuppliers = Array.from(new Map(products.filter((p) => p.categorySlug === slug).map((p) => [p.supplier.id, p.supplier])).values());

  return (
    <section className="py-10">
      <Container>
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-indigo-600">Categories</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{category.title}</span>
        </nav>

        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-indigo-50 to-slate-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Category</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{category.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Explore sourcing options, supplier capabilities and equipment availability in {category.title.toLowerCase()}.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white px-3 py-1.5 text-slate-700">{categoryProducts.length} products</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-slate-700">{featuredSuppliers.length} suppliers</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-slate-700">Verified sourcing</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[15rem_1fr]">
          <aside className="space-y-4">
            <Card className="p-5">
              <h2 className="font-semibold text-slate-900">Subcategories</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Heavy machinery</li>
                <li>Generator systems</li>
                <li>Monitoring solutions</li>
                <li>Service support</li>
              </ul>
            </Card>
            <Card className="p-5">
              <h2 className="font-semibold text-slate-900">Featured suppliers</h2>
              <div className="mt-4 space-y-3">
                {featuredSuppliers.slice(0, 3).map((supplier) => (
                  <Link key={supplier.id} href={`/supplier/${supplier.slug}`} className="block rounded-lg bg-slate-50 p-3 text-sm text-slate-700 hover:text-indigo-700">
                    {supplier.name}
                  </Link>
                ))}
              </div>
            </Card>
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">Recommended for {category.title}</p>
              <select className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">
                <option>Sort by relevance</option>
                <option>Price low to high</option>
                <option>Newest</option>
              </select>
            </div>

            {categoryProducts.length === 0 ? (
              <Card className="p-8 text-center text-slate-600">No products are listed for this category yet.</Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
