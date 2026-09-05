import { getSupplier, suppliers } from "@/lib/data/marketplace";
import { mockGet, mockList } from "@/lib/services/mock-service";
export const supplierService = { list: () => mockList(suppliers), getBySlug: (slug: string) => mockGet(getSupplier(slug), "Supplier") };
