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

const tableByKind: Record<CoreContentKind, string> = {
  division: "divisions",
  business_unit: "business_units",
  category: "categories",
  service: "services",
};

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validSlug(value: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
}

async function owningDivisionId(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  kind: CoreContentKind,
  record: Record<string, unknown>,
): Promise<string | null> {
  if (kind === "division") return String(record.id ?? "");
  if (kind === "business_unit") return String(record.division_id ?? "") || null;

  if (kind === "category") {
    const { data } = await supabase.from("business_units").select("division_id")
      .eq("id", String(record.business_unit_id ?? "")).maybeSingle();
    return data?.division_id ?? null;
  }

  const { data: category } = await supabase.from("categories").select("business_unit_id")
    .eq("id", String(record.category_id ?? "")).maybeSingle();
  if (!category) return null;
  const { data: unit } = await supabase.from("business_units").select("division_id")
    .eq("id", category.business_unit_id).maybeSingle();
  return unit?.division_id ?? null;
}

export async function saveCoreContent(input: CoreContentInput): Promise<Result> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { ok: false, error: "Your session has expired. Sign in again." };

  if (!input || !Object.prototype.hasOwnProperty.call(tableByKind, input.kind)) {
    return { ok: false, error: "Choose a valid catalogue content type." };
  }

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

  let existing: Record<string, unknown> | null = null;
  let previousDivisionId: string | null = null;

  if (input.id) {
    const { data, error } = await supabase.from(tableName).select("*").eq("id", input.id).maybeSingle();
    if (error || !data) return { ok: false, error: error?.message ?? "The record could not be found." };
    existing = data as Record<string, unknown>;
    previousDivisionId = await owningDivisionId(supabase, kind, existing);
    if (!previousDivisionId) return { ok: false, error: "The existing record has no valid owning division." };
  }

  let targetDivisionId: string | null = null;
  const parentId = clean(input.parentId, 80);

  if (kind === "division") {
    targetDivisionId = input.id ?? null;
  } else if (kind === "business_unit") {
    const { data, error } = await supabase.from("divisions").select("id")
      .eq("id", parentId).maybeSingle();
    if (error || !data) return { ok: false, error: "Select a valid parent division." };
    targetDivisionId = data.id;
  } else if (kind === "category") {
    const { data, error } = await supabase.from("business_units").select("id,division_id")
      .eq("id", parentId).maybeSingle();
    if (error || !data) return { ok: false, error: "Select a valid parent business unit." };
    targetDivisionId = data.division_id;

    const parentCategoryId = clean(input.parentCategoryId, 80);
    if (parentCategoryId) {
      const { data: parentCategory, error: parentError } = await supabase
        .from("categories").select("id").eq("id", parentCategoryId)
        .eq("business_unit_id", parentId).maybeSingle();
      if (parentError || !parentCategory || parentCategory.id === input.id) {
        return { ok: false, error: "The parent category must belong to the selected business unit and cannot be itself." };
      }
      if (input.id) {
        const { data: categoryRows, error: categoryError } = await supabase
          .from("categories").select("id,parent_id").eq("business_unit_id", parentId);
        if (categoryError || !categoryRows) return { ok: false, error: "Unable to validate the category hierarchy." };
        const parentById = new Map(categoryRows.map(row => [row.id, row.parent_id as string | null]));
        const visited = new Set<string>();
        let cursor: string | null = parentCategoryId;
        while (cursor) {
          if (cursor === input.id || visited.has(cursor)) {
            return { ok: false, error: "This parent selection would create a category hierarchy cycle." };
          }
          visited.add(cursor);
          cursor = parentById.get(cursor) ?? null;
        }
      }
    }
  } else {
    const { data, error } = await supabase.from("categories").select("id,business_unit_id")
      .eq("id", parentId).maybeSingle();
    if (error || !data) return { ok: false, error: "Select a valid parent category." };
    const { data: unit, error: unitError } = await supabase.from("business_units")
      .select("division_id").eq("id", data.business_unit_id).maybeSingle();
    if (unitError || !unit) return { ok: false, error: "The selected category has no valid owning division." };
    targetDivisionId = unit.division_id;
  }

  if (kind !== "division" && !targetDivisionId) {
    return { ok: false, error: "Choose the parent record first." };
  }

  const permission = input.id ? "content.edit" : "content.create";
  if (kind === "division" && !input.id) {
    const { data: allowed, error } = await supabase.rpc("cms_has_permission", {
      requested_permission: permission,
      requested_division_id: null,
    });
    if (error || allowed !== true) {
      return { ok: false, error: "Only an administrator with global catalogue access can create a division." };
    }
  } else {
    const divisionsToAuthorize = [...new Set(
      (input.id ? [previousDivisionId, targetDivisionId] : [targetDivisionId])
        .filter((id): id is string => Boolean(id)),
    )];

    for (const divisionId of divisionsToAuthorize) {
      const { data: allowed, error } = await supabase.rpc("cms_has_permission", {
        requested_permission: permission,
        requested_division_id: divisionId,
      });
      if (error || allowed !== true) {
        return { ok: false, error: "You do not have permission to change content in the current and selected division." };
      }
    }
  }

  const values: Record<string, unknown> = {
    code,
    slug,
    sort_order: Number.isFinite(input.sortOrder) ? Math.max(0, Math.min(9999, Math.trunc(input.sortOrder))) : 0,
    is_active: Boolean(input.isActive),
  };

  if (kind === "business_unit") values.division_id = parentId;
  if (kind === "category") {
    values.business_unit_id = parentId;
    values.parent_id = clean(input.parentCategoryId, 80) || null;
  }
  if (kind === "service") values.category_id = parentId;

  let recordId = input.id;
  if (recordId) {
    const { data, error } = await supabase.from(tableName).update(values).eq("id", recordId).select("id").maybeSingle();
    if (error || !data) return { ok: false, error: error?.message ?? "The record could not be updated. Check your access and parent selection." };
    recordId = data.id;
  } else {
    const { data, error } = await supabase.from(tableName).insert(values).select("id").single();
    if (error || !data) return { ok: false, error: error?.message ?? "Unable to create this record." };
    recordId = data.id;
  }

  if (!recordId) return { ok: false, error: "The record could not be saved." };

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
    const { data: existingTranslation, error: lookupError } = await supabase
      .from("content_translations").select("id")
      .match({ ...translationParent, locale_code: translation.locale_code, field_name: translation.field_name })
      .maybeSingle();
    if (lookupError) return { ok: false, error: lookupError.message };

    if (existingTranslation) {
      const { error } = await supabase.from("content_translations")
        .update({ content: translation.content }).eq("id", existingTranslation.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase.from("content_translations")
        .insert({ ...translationParent, ...translation });
      if (error) return { ok: false, error: error.message };
    }
  }

  return { ok: true, id: recordId };
}
