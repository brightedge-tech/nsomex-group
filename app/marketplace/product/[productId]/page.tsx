import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/marketplace/ProductDetails";
import { productService } from "@/lib/services/productService";

export default async function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const result = await productService.getBySlug(productId);
  const product = result.error ? null : result.data;
  if (!product) return notFound();
  return <ProductDetails product={product} />;
}
