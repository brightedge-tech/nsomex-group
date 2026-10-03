import { categories as fallbackCategories } from "@/lib/data/marketplace";
import { fail, ok, type ApiResult } from "@/lib/types/api";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";

export interface CategoryRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  parentId: string | null;
  parentSlug: string | null;
  status: string;
  sortOrder: number;
}

function normalizeCategory(row: any): CategoryRecord {
  return {
    id: row.id,
    title: row.name ?? row.title ?? "Category",
    slug: row.slug,
    description: row.description ?? "",
    imageUrl: row.image_url ?? row.imageUrl ?? null,
    parentId: row.parent_id ?? row.parentId ?? null,
    parentSlug: row.parent_slug ?? row.parentSlug ?? null,
    status: row.is_active === false || row.status === "inactive" ? "inactive" : "active",
    sortOrder: Number(row.sort_order ?? row.sortOrder ?? 0),
  };
}

export const categoryService = {
  async list(): Promise<ApiResult<CategoryRecord[]>> {
    const client = await getSupabaseServerClient();
    if (!client) {
      return config.isDevelopment ? ok(fallbackCategories.map((category) => normalizeCategory({
        id: category.slug,
        name: category.title,
        slug: category.slug,
      }))) : fail({ code: "SERVER", message: "Categories are temporarily unavailable." });
    }

    const { data, error } = await client.from("categories").select("id,name,slug,description,image_url,parent_id,is_active,sort_order,parent:categories!parent_id(slug)").eq("is_active", true).order("name").limit(100);
    if (error || !data) {
      return config.isDevelopment ? ok(fallbackCategories.map((category) => normalizeCategory({
        id: category.slug,
        name: category.title,
        slug: category.slug,
      }))) : fail({ code: "SERVER", message: "Categories are temporarily unavailable." });
    }

    return ok((data ?? []).map(normalizeCategory));
  },

  async getBySlug(slug: string): Promise<ApiResult<CategoryRecord>> {
    const client = await getSupabaseServerClient();
    if (!client) {
      const fallback = config.isDevelopment ? fallbackCategories.find((category) => category.slug === slug || category.title.toLowerCase().replace(/\s+/g, "-") === slug) : null;
      if (!fallback) return fail({ code: "NOT_FOUND", message: "Category not found." });
      return ok(normalizeCategory({ id: fallback.slug, name: fallback.title, slug: fallback.slug }));
    }

    const { data, error } = await client.from("categories").select("id,name,slug,description,image_url,parent_id,is_active,sort_order,parent:categories!parent_id(slug)").eq("slug", slug).eq("is_active", true).maybeSingle();
    if (error || !data) {
      const fallback = config.isDevelopment ? fallbackCategories.find((category) => category.slug === slug || category.title.toLowerCase().replace(/\s+/g, "-") === slug) : null;
      if (!fallback) return fail({ code: "NOT_FOUND", message: "Category not found." });
      return ok(normalizeCategory({ id: fallback.slug, name: fallback.title, slug: fallback.slug }));
    }

    return ok(normalizeCategory(data));
  },
};
