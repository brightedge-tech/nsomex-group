import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/config";

export type PublicSection = {
  id: string;
  section_key: string;
  section_type: string;
  sort_order: number;
  content: Record<string, unknown>;
  image_url: string | null;
  image_alt: string;
};

export type PublicPage = {
  id: string;
  slug: string;
  template_key: string;
  title: string;
  summary: string | null;
  seo_title: string | null;
  seo_description: string | null;
  cover_image_url: string | null;
  sections: PublicSection[];
};

export async function getPublishedPage(slug: string, locale: Locale): Promise<PublicPage | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id,slug,template_key,cover_image_path")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (pageError || !page) return null;

  const [{ data: translation }, { data: sections }] = await Promise.all([
    supabase.from("page_translations")
      .select("title,summary,seo_title,seo_description")
      .eq("page_id", page.id)
      .eq("locale_code", locale)
      .maybeSingle(),
    supabase.from("page_sections")
      .select("id,section_key,section_type,sort_order,page_section_translations(content,locale_code)")
      .eq("page_id", page.id)
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
  ]);

  if (!translation) return null;

  const localizedSections: PublicSection[] = (sections ?? []).flatMap((section) => {
    const translations = section.page_section_translations as { locale_code: string; content: Record<string, unknown> }[] | null;
    const localized = translations?.find((item) => item.locale_code === locale);
    return localized ? [{
      id: section.id,
      section_key: section.section_key,
      section_type: section.section_type,
      sort_order: section.sort_order,
      content: localized.content,
      image_url: typeof localized.content.imagePath === "string" && localized.content.imagePath.startsWith(`pages/${page.id}/sections/`)
        ? supabase.storage.from("nsomex-website").getPublicUrl(localized.content.imagePath).data.publicUrl
        : null,
      image_alt: typeof localized.content.imageAlt === "string" ? localized.content.imageAlt : (typeof localized.content.heading === "string" ? localized.content.heading : ""),
    }] : [];
  });

  return {
    id: page.id,
    slug: page.slug,
    template_key: page.template_key,
    title: translation.title,
    summary: translation.summary,
    seo_title: translation.seo_title,
    seo_description: translation.seo_description,
    cover_image_url: typeof page.cover_image_path === "string" && page.cover_image_path.startsWith(`pages/${page.id}/cover/`)
      ? supabase.storage.from("nsomex-website").getPublicUrl(page.cover_image_path).data.publicUrl
      : null,
    sections: localizedSections,
  };
}
