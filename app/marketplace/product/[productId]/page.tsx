import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/marketplace/ProductDetails";
import { getProduct } from "@/lib/data/marketplace";

export default async function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = getProduct(productId);
  if (!product) return notFound();
  return <ProductDetails product={product} />;
}
