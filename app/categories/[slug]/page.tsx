import { notFound } from "next/navigation";
import ProductCard from "@/components/marketplace/ProductCard";
import { Container } from "@/components/ui/container";
import { categories, getProductsByCategory } from "@/lib/data/marketplace";

export default async function CategoryDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) return notFound();
  const categoryProducts = getProductsByCategory(slug);

  return (
    <section className="py-16">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Category</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{category.title}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Explore products available in {category.title.toLowerCase()}.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {categoryProducts.length === 0 && <p className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-slate-500">No products are listed in this category yet.</p>}
      </Container>
    </section>
  );
}
