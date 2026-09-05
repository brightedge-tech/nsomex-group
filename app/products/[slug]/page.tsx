import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/marketplace/ProductDetails";
import { getProduct } from "@/lib/data/marketplace";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) return notFound();

  return <ProductDetails product={product} />;
}
