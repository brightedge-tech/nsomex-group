import { getSupplier as getFallbackSupplier, suppliers as fallbackSuppliers } from "@/lib/data/marketplace";
import { fail, ok, type ApiResult } from "@/lib/types/api";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";

const SUPPLIER_SELECT = "id,company_name,slug,description,country,address,website,business_type,years_in_business,logo_url,verification_status,created_at";

type NormalizedSupplier = {
  id: string;
  name: string;
  slug: string;
  location: string;
  verified: boolean;
  rating: number;
  yearsInBusiness: number;
  description: string;
  certifications: string[];
  factory: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessType?: string;
  logo?: string | null;
  verificationStatus?: string;
};

function normalizeSupplier(row: Record<string, any>): NormalizedSupplier {
  return {
    id: row.id,
    name: row.company_name ?? row.name ?? "Supplier",
    slug: row.slug,
    location: row.country ?? "Global",
    verified: row.verification_status === "verified",
    rating: 4.8,
    yearsInBusiness: Number(row.years_in_business ?? 1),
    description: row.description ?? "",
    certifications: Array.isArray(row.certifications) ? row.certifications : [],
    factory: row.address ?? "Production facility details available on request.",
    website: row.website ?? "",
    contactEmail: row.contact_email ?? "",
    contactPhone: row.contact_phone ?? "",
    businessType: row.business_type ?? "Manufacturer",
    logo: row.logo_url ?? null,
    verificationStatus: row.verification_status ?? "pending",
  };
}

export const supplierService = {
  async list(): Promise<ApiResult<NormalizedSupplier[]>> {
    const client = await getSupabaseServerClient();
    if (!client) return config.isDevelopment
      ? ok(fallbackSuppliers)
      : fail({ code: "SERVER", message: "Supplier directory is temporarily unavailable." });

    const { data, error } = await client
      .from("supplier_companies")
      .select(SUPPLIER_SELECT)
      .eq("verification_status", "verified")
      .order("company_name")
      .limit(48);

    if (error || !data) return config.isDevelopment
      ? ok(fallbackSuppliers)
      : fail({ code: "SERVER", message: "Supplier directory is temporarily unavailable." });
    return ok(data.map(normalizeSupplier));
  },

  async search({ query = "", verifiedOnly = false, page = 1, pageSize = 12 }: { query?: string; verifiedOnly?: boolean; page?: number; pageSize?: number } = {}) {
    const normalizedPage = Math.max(1, Math.floor(Number(page) || 1));
    const normalizedPageSize = Math.min(48, Math.max(1, Math.floor(Number(pageSize) || 12)));
    const client = await getSupabaseServerClient();
    if (!client) {
      if (!config.isDevelopment) return fail({ code: "SERVER", message: "Supplier directory is temporarily unavailable." });
      const text = query.trim().toLowerCase();
      const matches = fallbackSuppliers.filter((supplier) =>
        (!verifiedOnly || supplier.verified) &&
        (!text || `${supplier.name} ${supplier.location} ${supplier.description}`.toLowerCase().includes(text))
      );
      const start = (normalizedPage - 1) * normalizedPageSize;
      return ok({ items: matches.slice(start, start + normalizedPageSize), total: matches.length, page: normalizedPage, pageSize: normalizedPageSize, totalPages: Math.ceil(matches.length / normalizedPageSize) });
    }

    let request = client.from("supplier_companies").select(SUPPLIER_SELECT, { count: "exact" });
    if (verifiedOnly) request = request.eq("verification_status", "verified");
    if (query.trim()) request = request.ilike("company_name", `%${query.trim().slice(0, 80)}%`);
    const start = (normalizedPage - 1) * normalizedPageSize;
    const { data, error, count } = await request.order("company_name").range(start, start + normalizedPageSize - 1);
    if (error || !data) return fail({ code: "SERVER", message: "Supplier directory is temporarily unavailable." });
    const total = count ?? 0;
    return ok({ items: data.map(normalizeSupplier), total, page: normalizedPage, pageSize: normalizedPageSize, totalPages: Math.ceil(total / normalizedPageSize) });
  },

  async getBySlug(slug: string): Promise<ApiResult<NormalizedSupplier>> {
    const client = await getSupabaseServerClient();
    if (!client) {
      const fallback = config.isDevelopment ? getFallbackSupplier(slug) : null;
      return fallback ? ok(fallback) : fail({ code: "NOT_FOUND", message: "Supplier not found." });
    }

    const { data, error } = await client
      .from("supplier_companies")
      .select(SUPPLIER_SELECT)
      .eq("slug", slug)
      .eq("verification_status", "verified")
      .maybeSingle();

    if (error || !data) {
      const fallback = config.isDevelopment ? getFallbackSupplier(slug) : null;
      return fallback ? ok(fallback) : fail({ code: "NOT_FOUND", message: "Supplier not found." });
    }

    const supplier = normalizeSupplier(data);
    if (supplier.logo && !/^https?:\/\//i.test(supplier.logo)) {
      const { data: signedLogo } = await client.storage.from("supplier-logos").createSignedUrl(supplier.logo, 3600);
      supplier.logo = signedLogo?.signedUrl ?? null;
    }
    return ok(supplier);
  },
};
