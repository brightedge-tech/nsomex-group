"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { authService } from "@/lib/services/authService";
import { useAuth } from "@/components/auth/AuthProvider";

export default function FavoritesPage() {
  const [saved, setSaved] = useState<any[]>([]);
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
          if (active) setSaved((result.favorites ?? []).map((item: { product?: Record<string, unknown> }) => item.product).filter(Boolean));
        } catch (loadError) {
          if (active) setError(loadError instanceof Error ? loadError.message : "Favorites could not be loaded.");
        }
      } else {
        try { if (active) setSaved(JSON.parse(localStorage.getItem("nsomex_saved") || "[]")); }
        catch { if (active) setError("Saved items could not be loaded from this browser."); }
      }
      if (active) setLoading(false);
    }
    void loadFavorites();
    return () => { active = false; };
  }, [favoriteIds]);

  async function removeFavorite(item: any) {
    await toggleFavorite(item);
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
              <p className="font-semibold text-slate-900">{item.name || item.title || item.company || item.supplier?.name}</p>
              <p className="mt-2 text-sm text-slate-500">{item.category || item.location || item.company || item.supplier?.location}</p>
              <div className="mt-4 flex items-center gap-4"><Link href={item.supplier ? `/supplier/${item.supplier.slug}` : `/product/${item.slug}`} className="inline-flex text-sm font-semibold text-indigo-600">Open item</Link><button type="button" onClick={() => void removeFavorite(item)} className="text-sm font-semibold text-rose-700">Remove</button></div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
