import { notFound } from "next/navigation";
import ProductCard from "@/components/marketplace/ProductCard";
import { Container } from "@/components/ui/container";
import { categoryService } from "@/lib/services/categoryService";
import { productService } from "@/lib/services/productService";

export default async function CategoryDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categoryResult, productsResult] = await Promise.all([
    categoryService.getBySlug(slug),
    productService.listByCategory(slug),
  ]);
  const category = categoryResult.error ? null : categoryResult.data;

  if (!category) return notFound();
  const categoryProducts = productsResult.error ? [] : productsResult.data;

  return (
    <section className="py-16">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Category</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{category.title}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{category.description || `Explore products available in ${category.title.toLowerCase()}.`}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {productsResult.error ? <p role="alert" className="mt-8 rounded-xl border border-dashed border-rose-300 p-8 text-slate-500">Products are temporarily unavailable. Please try again later.</p> : categoryProducts.length === 0 && <p className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-slate-500">No products are listed in this category yet.</p>}
      </Container>
    </section>
  );
}
