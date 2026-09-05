import Link from "next/link";
import { Container } from "@/components/ui/container";
import { categories } from "@/lib/data/marketplace";

export default function CategoriesPage() {
  return (
    <section className="py-10">
      <Container>
        <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
        <p className="mt-2 text-slate-600">Browse the industrial marketplace by category.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm">
              <h2 className="font-semibold text-slate-900">{category.title}</h2>
              <p className="mt-2 text-sm text-slate-500">View category details</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
