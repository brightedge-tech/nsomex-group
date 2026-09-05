import { products, getProduct, getProductsByCategory } from "@/lib/data/marketplace";
import { mockGet, mockList } from "@/lib/services/mock-service";
export const productService = { list: () => mockList(products), getBySlug: (slug: string) => mockGet(getProduct(slug), "Product"), listByCategory: (slug: string) => mockList(getProductsByCategory(slug)) };
