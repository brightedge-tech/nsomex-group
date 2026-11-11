"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };
type PageInput = {
  id?: string;
  slug: string;
  templateKey: string;
  divisionId: string | null;
  showInNavigation: boolean;
  navigationOrder: number;
  enTitle: string;
  enSummary: string;
  frTitle: string;
  frSummary: string;
  coverImagePath?: string | null;
};
type SectionInput = {
  id?: string;
  pageId: string;
  sectionKey: string;
  sectionType: string;
  sortOrder: number;
  enContent: string;
  frContent: string;
};

function textValue(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function slugValue(value: unknown): string {
  return textValue(value, 100).toLowerCase();
}
function parseContent(value: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}
async function authorizedClient(): Promise<Awaited<ReturnType<typeof createClient>>> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return supabase;
}

export async function savePage(input: PageInput): Promise<ActionResult> {
  const supabase = await authorizedClient();
  if (!supabase) return { ok: false, error: "Your session has expired. Sign in again." };

  const slug = slugValue(input.slug);
  const templateKey = slugValue(input.templateKey || "standard");
  const enTitle = textValue(input.enTitle, 200);
  const frTitle = textValue(input.frTitle, 200);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return { ok: false, error: "Use a valid URL slug with lowercase letters, numbers and hyphens." };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(templateKey)) return { ok: false, error: "Use a valid template key." };
  if (!enTitle || !frTitle) return { ok: false, error: "Add both English and French page titles before saving." };

  const coverImagePath = textValue(input.coverImagePath, 500);
  const coverPrefix = input.id ? `pages/${input.id}/cover/` : "";
  const coverFilename = coverImagePath.startsWith(coverPrefix) ? coverImagePath.slice(coverPrefix.length) : "";
  if (coverImagePath && (!input.id || !coverPrefix || !/^[A-Za-z0-9-]+[.](jpg|jpeg|png|webp|avif)$/i.test(coverFilename))) {
    return { ok: false, error: "The page cover image path is invalid." };
  }

  const pageValues = {
    slug,
    cover_image_path: coverImagePath || null,
    template_key: templateKey,
    division_id: input.divisionId || null,
    show_in_navigation: Boolean(input.showInNavigation),
    navigation_order: Number.isFinite(input.navigationOrder) ? Math.max(0, Math.min(9999, Math.trunc(input.navigationOrder))) : 0,
  };

  let pageId = input.id;
  if (pageId) {
    const { error } = await supabase.from("pages").update(pageValues).eq("id", pageId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase.from("pages").insert(pageValues).select("id").single();
    if (error || !data) return { ok: false, error: error?.message ?? "Unable to create the page." };
    pageId = data.id;
  }

  const { error: translationsError } = await supabase.from("page_translations").upsert([
    { page_id: pageId, locale_code: "en", title: enTitle, summary: textValue(input.enSummary, 600) || null },
    { page_id: pageId, locale_code: "fr", title: frTitle, summary: textValue(input.frSummary, 600) || null },
  ], { onConflict: "page_id,locale_code" });
  if (translationsError) return { ok: false, error: translationsError.message };
  revalidatePath(`/en/pages/${slug}`);
  revalidatePath(`/fr/pages/${slug}`);
  if (slug === "about") { revalidatePath("/en/about"); revalidatePath("/fr/about"); }
  revalidatePath("/en");
  revalidatePath("/fr");
  return { ok: true, id: pageId };
}

export async function changePageStatus(pageId: string, status: "draft" | "review" | "published" | "archived"): Promise<ActionResult> {
  const supabase = await authorizedClient();
  if (!supabase) return { ok: false, error: "Your session has expired. Sign in again." };

  const { data: page, error: lookupError } = await supabase
    .from("pages").select("id,slug,division_id").eq("id", pageId).maybeSingle();
  if (lookupError || !page) return { ok: false, error: lookupError?.message ?? "Page not found." };

  const permission = status === "published" ? "content.publish"
    : status === "review" ? "content.submit_review"
    : status === "archived" ? "content.archive" : "content.edit";
  const { data: allowed, error: permissionError } = await supabase.rpc("cms_has_permission", {
    requested_permission: permission,
    requested_division_id: page.division_id,
  });
  if (permissionError || allowed !== true) return { ok: false, error: "You do not have permission to change this page's publishing status." };

  // A published page with no published sections appears blank. Publish its saved
  // sections in the same operation so the public route can render the content.
  if (status === "published") {
    const { error: sectionError } = await supabase.from("page_sections")
      .update({ status: "published" }).eq("page_id", pageId).neq("status", "archived");
    if (sectionError) return { ok: false, error: sectionError.message };
  }

  const values = status === "published"
    ? { status, published_at: new Date().toISOString() }
    : { status, published_at: null };
  const { error } = await supabase.from("pages").update(values).eq("id", pageId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/en/pages/${page.slug}`);
  revalidatePath(`/fr/pages/${page.slug}`);
  if (page.slug === "about") { revalidatePath("/en/about"); revalidatePath("/fr/about"); }
  revalidatePath("/en");
  revalidatePath("/fr");
  return { ok: true, id: pageId };
}

export async function saveSection(input: SectionInput): Promise<ActionResult> {
  const supabase = await authorizedClient();
  if (!supabase) return { ok: false, error: "Your session has expired. Sign in again." };

  const sectionKey = slugValue(input.sectionKey);
  const sectionType = slugValue(input.sectionType);
  const enContent = parseContent(input.enContent);
  const frContent = parseContent(input.frContent);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(sectionKey) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(sectionType)) {
    return { ok: false, error: "Section key and type must use lowercase letters, numbers and hyphens." };
  }
  if (!enContent || !frContent) return { ok: false, error: "English and French section content must each be a valid JSON object." };
  const sectionPrefix = `pages/${input.pageId}/sections/`;
  const validSectionImage = (content: Record<string, unknown>) => {
    const path = content.imagePath;
    if (path === undefined || path === null || path === "") return true;
    if (typeof path !== "string" || !path.startsWith(sectionPrefix)) return false;
    return /^[A-Za-z0-9-]+[.](jpg|jpeg|png|webp|avif)$/i.test(path.slice(sectionPrefix.length));
  };
  if (!validSectionImage(enContent) || !validSectionImage(frContent)) return { ok: false, error: "The section image path is invalid." };

  let sectionId = input.id;
  if (sectionId) {
    const { error } = await supabase.from("page_sections").update({
      section_key: sectionKey,
      section_type: sectionType,
      sort_order: Math.max(0, Math.min(9999, Math.trunc(input.sortOrder || 0))),
    }).eq("id", sectionId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase.from("page_sections").insert({
      page_id: input.pageId,
      section_key: sectionKey,
      section_type: sectionType,
      sort_order: Math.max(0, Math.min(9999, Math.trunc(input.sortOrder || 0))),
    }).select("id").single();
    if (error || !data) return { ok: false, error: error?.message ?? "Unable to create the section." };
    sectionId = data.id;
  }

  const { error: translationError } = await supabase.from("page_section_translations").upsert([
    { page_section_id: sectionId, locale_code: "en", content: enContent },
    { page_section_id: sectionId, locale_code: "fr", content: frContent },
  ], { onConflict: "page_section_id,locale_code" });
  if (translationError) return { ok: false, error: translationError.message };
  return { ok: true, id: sectionId };
}

export async function changeSectionStatus(sectionId: string, status: "draft" | "published" | "archived"): Promise<ActionResult> {
  const supabase = await authorizedClient();
  if (!supabase) return { ok: false, error: "Your session has expired. Sign in again." };
  const { data: section, error: lookupError } = await supabase.from("page_sections")
    .select("id,page_id,pages(slug,division_id)").eq("id", sectionId).maybeSingle();
  if (lookupError || !section) return { ok: false, error: lookupError?.message ?? "Section not found." };
  const page = Array.isArray(section.pages) ? section.pages[0] : section.pages;
  if (!page) return { ok: false, error: "The section's parent page could not be found." };
  const permission = status === "published" ? "content.publish" : status === "archived" ? "content.archive" : "content.edit";
  const { data: allowed, error: permissionError } = await supabase.rpc("cms_has_permission", {
    requested_permission: permission,
    requested_division_id: page.division_id,
  });
  if (permissionError || allowed !== true) return { ok: false, error: "You do not have permission to change this section's status." };
  const { error } = await supabase.from("page_sections").update({ status }).eq("id", sectionId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/en/pages/${page.slug}`);
  revalidatePath(`/fr/pages/${page.slug}`);
  return { ok: true, id: sectionId };
}
