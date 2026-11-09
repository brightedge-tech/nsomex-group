"use server";

import { createClient } from "@/lib/supabase/server";

export type CoreContentKind = "division" | "business_unit" | "category" | "service";
export type CoreContentInput = {
  kind: CoreContentKind;
  id?: string;
  parentId?: string | null;
  parentCategoryId?: string | null;
  code: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  enName: string;
  frName: string;
  enSummary: string;
  frSummary: string;
  enDescription: string;
  frDescription: string;
};

type Result = { ok: true; id: string } | { ok: false; error: string };

const tableByKind = {
  division: "divisions",
  business_unit: "business_units",
  category: "categories",
  service: "services",
} as const;

const parentColumn = {
  division: null,
  business_unit: "division_id",
  category: "business_unit_id",
  service: "category_id",
} as const;

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validSlug(value: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
}

export async function saveCoreContent(input: CoreContentInput): Promise<Result> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { ok: false, error: "Your session has expired. Sign in again." };

  const kind = input.kind;
  const tableName = tableByKind[kind];
  const code = clean(input.code, 80).toLowerCase();
  const slug = clean(input.slug, 100).toLowerCase();
  const enName = clean(input.enName);
  const frName = clean(input.frName);
  if (!validSlug(code) || !validSlug(slug)) {
    return { ok: false, error: "Use lowercase letters, numbers and hyphens for the code and URL slug." };
  }
  if (!enName || !frName) return { ok: false, error: "Add both English and French names." };

  let divisionId: string | null = null;
  let existing: Record<string, unknown> | null = null;

  if (input.id) {
    const { data, error } = await supabase.from(tableName).select("*").eq("id", input.id).maybeSingle();
    if (error || !data) return { ok: false, error: error?.message ?? "The record could not be found." };
    existing = data as Record<string, unknown>;
  }

  if (kind === "division") {
    divisionId = input.id ?? null;
  } else if (kind === "business_unit") {
    divisionId = String(existing?.division_id ?? input.parentId ?? "");
  } else if (kind === "category") {
    const businessUnitId = String(existing?.business_unit_id ?? input.parentId ?? "");
    const { data, error } = await supabase.from("business_units").select("division_id").eq("id", businessUnitId).single();
    if (error || !data) return { ok: false, error: "Select a valid business unit." };
    divisionId = data.division_id;
  } else {
    const categoryId = String(existing?.category_id ?? input.parentId ?? "");
    const { data, error } = await supabase.from("categories").select("business_unit_id").eq("id", categoryId).single();
    if (error || !data) return { ok: false, error: "Select a valid category." };
    const { data: unit, error: unitError } = await supabase.from("business_units").select("division_id").eq("id", data.business_unit_id).single();
    if (unitError || !unit) return { ok: false, error: "The selected category has no valid division." };
    divisionId = unit.division_id;
  }

  if (kind !== "division" && !divisionId) return { ok: false, error: "Choose the parent record first." };

  const permission = input.id ? "content.edit" : "content.create";
  const { data: allowed, error: permissionError } = await supabase.rpc("cms_has_permission", {
    requested_permission: permission,
    requested_division_id: divisionId,
  });
  if (permissionError || allowed !== true) return { ok: false, error: "You do not have permission to change this content." };

  const values: Record<string, unknown> = {
    code,
    slug,
    sort_order: Number.isFinite(input.sortOrder) ? Math.max(0, Math.min(9999, Math.trunc(input.sortOrder))) : 0,
    is_active: Boolean(input.isActive),
  };
  if (kind === "business_unit" && !input.id) values.division_id = input.parentId;
  if (kind === "category" && !input.id) {
    values.business_unit_id = input.parentId;
    values.parent_id = input.parentCategoryId || null;
  }
  if (kind === "service" && !input.id) values.category_id = input.parentId;

  let recordId = input.id;
  if (recordId) {
    const { error } = await supabase.from(tableName).update(values).eq("id", recordId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase.from(tableName).insert(values).select("id").single();
    if (error || !data) return { ok: false, error: error?.message ?? "Unable to create this record." };
    recordId = data.id;
  }

  const translationParent = {
    division: { division_id: recordId },
    business_unit: { business_unit_id: recordId },
    category: { category_id: recordId },
    service: { service_id: recordId },
  }[kind];

  const translations = [
    { locale_code: "en", field_name: "name", content: enName },
    { locale_code: "fr", field_name: "name", content: frName },
    ...(clean(input.enSummary) ? [{ locale_code: "en", field_name: "summary", content: clean(input.enSummary, 1000) }] : []),
    ...(clean(input.frSummary) ? [{ locale_code: "fr", field_name: "summary", content: clean(input.frSummary, 1000) }] : []),
    ...(clean(input.enDescription) ? [{ locale_code: "en", field_name: "description", content: clean(input.enDescription, 10000) }] : []),
    ...(clean(input.frDescription) ? [{ locale_code: "fr", field_name: "description", content: clean(input.frDescription, 10000) }] : []),
  ];

  for (const translation of translations) {
    const query = supabase.from("content_translations").select("id")
      .match({ ...translationParent, locale_code: translation.locale_code, field_name: translation.field_name });
    const { data: existingTranslation, error: lookupError } = await query.maybeSingle();
    if (lookupError) return { ok: false, error: lookupError.message };
    if (existingTranslation) {
      const { error } = await supabase.from("content_translations").update({ content: translation.content }).eq("id", existingTranslation.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase.from("content_translations").insert({ ...translationParent, ...translation });
      if (error) return { ok: false, error: error.message };
    }
  }

  return { ok: true, id: recordId };
}
