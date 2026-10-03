import {
  products as fallbackProducts,
  getProduct as getFallbackProduct,
  getProductsByCategory as getFallbackProductsByCategory,
} from "@/lib/data/marketplace";
import { fail, ok, type ApiResult } from "@/lib/types/api";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";

const PRODUCT_SELECT = "id,name,slug,description,price,currency,minimum_order_quantity,stock,unit,specifications,shipping_information,created_at,supplier_company_id,supplier_companies!inner(id,company_name,slug,country,verification_status,years_in_business,description,address),categories(id,name,slug)";
const MAX_PAGE_SIZE = 48;

export interface ProductSearchFilters {
  query?: string;
  category?: string;
  supplier?: string;
  verifiedOnly?: boolean;
  priceMax?: number;
  location?: string;
  minMoq?: number;
  maxMoq?: number;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
  sort?: "relevance" | "price-low" | "price-high" | "newest";
}

function formatPrice(value: number | string | null | undefined, currency = "USD") {
  if (value === null || value === undefined || value === "") return "Request Quote";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "Request Quote";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(numericValue);
}

function normalizeProduct(row: any) {
  const supplier = row.supplier_companies ?? row.supplier ?? {};
  const category = row.categories ?? row.category ?? {};
  const images = Array.isArray(row.product_images)
    ? row.product_images.map((item: any) => item.storage_path ?? item.image_url ?? item.url).filter(Boolean)
    : Array.isArray(row.images)
      ? row.images
      : Array.isArray(row.image_urls)
        ? row.image_urls
        : ["Product image"];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: category.name ?? "Uncategorized",
    categorySlug: category.slug ?? "uncategorized",
    description: row.description ?? "",
    price: formatPrice(row.price, row.currency ?? "USD"),
    moq: row.minimum_order_quantity ? `${row.minimum_order_quantity} ${row.unit ?? "unit"}` : `1 ${row.unit ?? "unit"}`,
    availableQuantity: `${Number(row.stock ?? 0)} units available`,
    location: supplier.country ?? "Global",
    verified: supplier.verification_status === "verified",
    rating: 4.8,
    sku: row.sku ?? row.id.slice(0, 8).toUpperCase(),
    applications: Array.isArray(row.applications) ? row.applications : [],
    shipping: row.shipping_information ?? "Shipping details available on request.",
    specifications: Object.entries(row.specifications ?? {}).map(([label, value]) => ({ label, value: String(value) })),
    supplier: {
      id: supplier.id ?? row.supplier_id ?? "supplier-unknown",
      name: supplier.company_name ?? supplier.name ?? "Supplier",
      slug: supplier.slug ?? "supplier",
      location: supplier.country ?? "Global",
      verified: supplier.verification_status === "verified",
      rating: 4.8,
      yearsInBusiness: supplier.years_in_business ?? 1,
      description: supplier.description ?? "",
      certifications: Array.isArray(supplier.certifications) ? supplier.certifications : [],
      factory: supplier.address ?? "Production facility details available on request.",
    },
    images,
  };
}

export const productService = {
  async list(limit = 24): Promise<ApiResult<any[]>> {
    const client = await getSupabaseServerClient();
    if (!client) return config.isDevelopment
      ? ok(fallbackProducts.slice(0, Math.min(MAX_PAGE_SIZE, Math.max(1, limit))))
      : fail({ code: "SERVER", message: "Marketplace data is temporarily unavailable." });

    const { data, error } = await client
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "published")
      .eq("supplier_companies.verification_status", "verified")
      .order("created_at", { ascending: false })
      .limit(Math.min(MAX_PAGE_SIZE, Math.max(1, limit)));

    if (error || !data) return config.isDevelopment
      ? ok(fallbackProducts.slice(0, Math.min(MAX_PAGE_SIZE, Math.max(1, limit))))
      : fail({ code: "SERVER", message: "Marketplace data is temporarily unavailable." });
    return ok(data.map(normalizeProduct));
  },

  async search(filters: ProductSearchFilters = {}) {
    const page = Math.max(1, Math.floor(Number(filters.page ?? 1)));
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(Number(filters.pageSize ?? 12))));
    const start = (page - 1) * pageSize;
    const client = await getSupabaseServerClient();

    if (!client) {
      if (!config.isDevelopment) return fail({ code: "SERVER", message: "Marketplace data is temporarily unavailable." });
      const all = [...fallbackProducts];
      const query = (filters.query ?? "").trim().toLowerCase();
      const matches = all.filter((product) =>
        (!query || [product.name, product.description, product.category, product.supplier.name, product.location].join(" ").toLowerCase().includes(query)) &&
        (!filters.category || filters.category === "all" || product.categorySlug === filters.category) &&
        (!filters.supplier || filters.supplier === "all" || product.supplier.slug === filters.supplier) &&
        (!filters.verifiedOnly || product.supplier.verified) &&
        (!filters.location || product.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.minMoq === undefined || Number.parseFloat(product.moq) >= filters.minMoq) &&
        (filters.maxMoq === undefined || Number.parseFloat(product.moq) <= filters.maxMoq) &&
        (!filters.inStock || Number.parseFloat(product.availableQuantity) > 0) &&
        (filters.priceMax === undefined || product.price === "Request Quote" || Number(product.price.replace(/[^0-9.]/g, "")) <= filters.priceMax)
      );
      const total = matches.length;
      return ok({ items: matches.slice(start, start + pageSize), total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
    }

    const select = filters.category && filters.category !== "all"
      ? "id,name,slug,description,price,currency,minimum_order_quantity,stock,unit,specifications,shipping_information,created_at,supplier_company_id,supplier_companies!inner(id,company_name,slug,country,verification_status,years_in_business,description,address),categories!inner(id,name,slug)"
      : PRODUCT_SELECT;
    let request = client.from("products").select(select, { count: "exact" })
      .eq("status", "published")
      .eq("supplier_companies.verification_status", "verified");

    if (filters.query?.trim()) request = request.textSearch("search_document", filters.query.trim().slice(0, 120), { type: "plain", config: "simple" });
    if (filters.category && filters.category !== "all") request = request.eq("categories.slug", filters.category);
    if (filters.supplier && filters.supplier !== "all") request = request.eq("supplier_companies.slug", filters.supplier);
    if (filters.priceMax !== undefined) request = request.lte("price", filters.priceMax);
    if (filters.location?.trim()) request = request.ilike("supplier_companies.country", `%${filters.location.trim().slice(0, 80)}%`);
    if (filters.minMoq !== undefined) request = request.gte("minimum_order_quantity", filters.minMoq);
    if (filters.maxMoq !== undefined) request = request.lte("minimum_order_quantity", filters.maxMoq);
    if (filters.inStock) request = request.gt("stock", 0);
    if (filters.sort === "price-low") request = request.order("price", { ascending: true, nullsFirst: false });
    else if (filters.sort === "price-high") request = request.order("price", { ascending: false, nullsFirst: false });
    else request = request.order("created_at", { ascending: false });

    const { data, error, count } = await request.range(start, start + pageSize - 1);
    if (error || !data) return fail({ code: "SERVER", message: "Marketplace search is temporarily unavailable." });
    const total = count ?? 0;
    return ok({ items: data.map(normalizeProduct), total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  },

  async getBySlug(slug: string): Promise<ApiResult<any>> {
    const normalizedSlug = slug.toLowerCase();
    const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(normalizedSlug);
    if (!isId && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
      return fail({ code: "NOT_FOUND", message: "Product not found." });
    }
    const client = await getSupabaseServerClient();
    if (!client) {
      const fallback = config.isDevelopment ? getFallbackProduct(normalizedSlug) : null;
      return fallback ? ok(fallback) : fail({ code: "NOT_FOUND", message: "Product not found." });
    }

    let request = client
      .from("products")
      .select(`${PRODUCT_SELECT},product_images(storage_path,sort_order)`)
      .eq("status", "published")
      .eq("supplier_companies.verification_status", "verified");
    request = isId ? request.or(`slug.eq.${normalizedSlug},id.eq.${normalizedSlug}`) : request.eq("slug", normalizedSlug);
    const { data, error } = await request.maybeSingle();

    if (error || !data) {
      const fallback = config.isDevelopment ? getFallbackProduct(normalizedSlug) : null;
      return fallback ? ok(fallback) : fail({ code: "NOT_FOUND", message: "Product not found." });
    }

    const product = normalizeProduct(data) as ReturnType<typeof normalizeProduct> & { images: string[] };
    const imageRows = Array.isArray(data.product_images) ? [...data.product_images].sort((a: any, b: any) => a.sort_order - b.sort_order) : [];
    const imagePaths = imageRows.map((image: any) => image.storage_path).filter(Boolean);
    if (imagePaths.length) {
      const { data: signedImages } = await client.storage.from("product-images").createSignedUrls(imagePaths, 3600);
      product.images = (signedImages ?? []).map((image) => image.signedUrl).filter(Boolean);
    }
    if (!product.images.length) product.images = ["Product image"];
    return ok(product);
  },

  async listByCategory(slug: string): Promise<ApiResult<any[]>> {
    const client = await getSupabaseServerClient();
    if (!client) {
      return config.isDevelopment
        ? ok(getFallbackProductsByCategory(slug).slice(0, MAX_PAGE_SIZE))
        : fail({ code: "SERVER", message: "Category products are temporarily unavailable." });
    }

    const { data, error } = await client
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "published")
      .eq("supplier_companies.verification_status", "verified")
      .eq("categories.slug", slug)
      .eq("categories.is_active", true)
      .order("created_at", { ascending: false })
      .limit(MAX_PAGE_SIZE);

    if (error || !data) {
      return config.isDevelopment
        ? ok(getFallbackProductsByCategory(slug).slice(0, MAX_PAGE_SIZE))
        : fail({ code: "SERVER", message: "Category products are temporarily unavailable." });
    }

    return ok(data.map(normalizeProduct));
  },

  async listBySupplier(supplierId: string, limit = 24): Promise<ApiResult<any[]>> {
    const client = await getSupabaseServerClient();
    if (!client) return fail({ code: "SERVER", message: "Supplier products are temporarily unavailable." });
    const { data, error } = await client.from("products").select(PRODUCT_SELECT)
      .eq("supplier_company_id", supplierId)
      .eq("status", "published")
      .eq("supplier_companies.verification_status", "verified")
      .order("created_at", { ascending: false })
      .limit(Math.min(MAX_PAGE_SIZE, Math.max(1, limit)));
    if (error || !data) return fail({ code: "SERVER", message: "Supplier products are temporarily unavailable." });
    return ok(data.map(normalizeProduct));
  },
};
