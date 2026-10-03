import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/marketplace/ProductDetails";
import { productService } from "@/lib/services/productService";

export default async function ProductRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await productService.getBySlug(slug);
  const product = result.error ? null : result.data;

  if (!product) return notFound();

  return <ProductDetails product={product} />;
}
