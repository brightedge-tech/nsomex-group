import { productService } from "@/lib/services/productService";

export interface SearchRequest {
  query?: string;
  category?: string;
  supplier?: string;
  verifiedOnly?: boolean;
  priceMax?: number;
  minMoq?: number;
  maxMoq?: number;
  inStock?: boolean;
  location?: string;
  page?: number;
  pageSize?: number;
  sort?: "relevance" | "price-low" | "price-high" | "newest";
}

export async function searchProducts(filters: SearchRequest = {}) {
  return productService.search(filters);
}
