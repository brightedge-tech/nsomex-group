"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { authService } from "@/lib/services/authService";
import { useAuth } from "@/components/auth/AuthProvider";

type SavedProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  supplier?: { name: string; slug: string; location: string } | null;
};

function normalizeSavedProduct(item: Record<string, unknown>): SavedProduct | null {
  const product = (item.product && typeof item.product === "object" ? item.product : item) as Record<string, unknown>;
  if (typeof product.id !== "string" || typeof product.slug !== "string") return null;
  const supplierValue = product.supplier;
  const supplier = supplierValue && typeof supplierValue === "object" ? supplierValue as Record<string, unknown> : null;
  const categoryValue = product.category;
  const category = categoryValue && typeof categoryValue === "object"
    ? String((categoryValue as Record<string, unknown>).name ?? "")
    : String(categoryValue ?? "");
  return {
    id: product.id,
    name: String(product.name ?? product.title ?? "Product"),
    slug: product.slug,
    category,
    supplier: supplier ? {
      name: String(supplier.name ?? supplier.company_name ?? "Supplier"),
      slug: String(supplier.slug ?? ""),
      location: String(supplier.location ?? supplier.country ?? ""),
    } : null,
  };
}

export default function FavoritesPage() {
  const [saved, setSaved] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { favoriteIds, toggleFavorite } = useAuth();

  useEffect(() => {
    let active = true;
    async function loadFavorites() {
      if (authService.isConfigured()) {
        try {
          const response = await fetch("/api/favorites");
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Favorites could not be loaded.");
          if (active) setSaved((result.favorites ?? []).map((item: Record<string, unknown>) => normalizeSavedProduct(item)).filter((item: SavedProduct | null): item is SavedProduct => Boolean(item)));
        } catch (loadError) {
          if (active) setError(loadError instanceof Error ? loadError.message : "Favorites could not be loaded.");
        }
      } else {
        try {
          const localSaved = JSON.parse(localStorage.getItem("nsomex_saved") || "[]") as Record<string, unknown>[];
          if (active) setSaved(localSaved.map(normalizeSavedProduct).filter((item): item is SavedProduct => Boolean(item)));
        }
        catch { if (active) setError("Saved items could not be loaded from this browser."); }
      }
      if (active) setLoading(false);
    }
    void loadFavorites();
    return () => { active = false; };
  }, [favoriteIds]);

  async function removeFavorite(item: SavedProduct) {
    const removed = await toggleFavorite(item);
    if (!removed) {
      setError("The favorite could not be removed. Please try again.");
      return;
    }
    setSaved((current) => current.filter((savedItem) => savedItem.id !== item.id));
  }

  if (loading) return <section className="py-10"><Container><p role="status" className="text-sm text-slate-500">Loading favorites...</p></Container></section>;
  if (error) return <section className="py-10"><Container><Card role="alert" className="mx-auto max-w-2xl p-8 text-center text-rose-700">{error}</Card></Container></section>;

  if (saved.length === 0) {
    return (
      <section className="py-10">
        <Container>
          <Card className="mx-auto max-w-2xl p-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Your favorites is empty</h1>
            <p className="mt-3 text-slate-600">Keep products and suppliers you want to compare or revisit in one place.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Browse products</Link>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10">
      <Container>
        <h1 className="text-3xl font-bold text-slate-900">Saved products & suppliers</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((item) => (
            <Card key={item.id} className="p-4">
              <p className="font-semibold text-slate-900">{item.name}</p>
              <p className="mt-2 text-sm text-slate-500">{item.category || item.supplier?.location}</p>
              <div className="mt-4 flex items-center gap-4"><Link href={`/products/${item.slug}`} className="inline-flex text-sm font-semibold text-indigo-600">Open product</Link>{item.supplier?.slug && <Link href={`/supplier/${item.supplier.slug}`} className="inline-flex text-sm font-semibold text-indigo-600">Supplier</Link>}<button type="button" onClick={() => void removeFavorite(item)} className="text-sm font-semibold text-rose-700">Remove</button></div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
