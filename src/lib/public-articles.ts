import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/config";

export type PublicArticle = {
  id: string;
  article_type: "news" | "insight" | "announcement";
  is_featured: boolean;
  published_at: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: Record<string, unknown>;
  seo_title: string | null;
  seo_description: string | null;
  cover_url: string | null;
};

type ArticleRow = {
  id: string;
  article_type: PublicArticle["article_type"];
  is_featured: boolean;
  published_at: string;
  cover_media_asset_id: string | null;
  article_translations: Array<{
    locale_code: string;
    slug: string;
    title: string;
    excerpt: string | null;
    body: Record<string, unknown>;
    seo_title: string | null;
    seo_description: string | null;
  }>;
};

type MediaRow = { id: string; bucket_name: string; object_path: string };

async function loadPublishedArticles(locale: Locale, slug?: string): Promise<PublicArticle[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase
    .from("articles")
    .select("id,article_type,is_featured,published_at,cover_media_asset_id,article_translations!inner(locale_code,slug,title,excerpt,body,seo_title,seo_description)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .eq("article_translations.locale_code", locale)
    .order("published_at", { ascending: false });

  if (slug) query = query.eq("article_translations.slug", slug);

  const { data, error } = await query;
  if (error || !data) return [];

  const rows = data as unknown as ArticleRow[];
  const mediaIds = [...new Set(rows.map((row) => row.cover_media_asset_id).filter((id): id is string => Boolean(id)))];
  const mediaById = new Map<string, MediaRow>();

  if (mediaIds.length) {
    const { data: media } = await supabase
      .from("media_assets")
      .select("id,bucket_name,object_path")
      .in("id", mediaIds)
      .eq("status", "published");
    for (const asset of (media ?? []) as MediaRow[]) mediaById.set(asset.id, asset);
  }

  return Promise.all(rows.flatMap((row) => {
    const translation = row.article_translations.find((item) => item.locale_code === locale);
    if (!translation) return [];

    return [async () => {
      let coverUrl: string | null = null;
      const asset = row.cover_media_asset_id ? mediaById.get(row.cover_media_asset_id) : undefined;
      if (asset) {
        const { data: signed } = await supabase.storage
          .from(asset.bucket_name)
          .createSignedUrl(asset.object_path, 60 * 60);
        coverUrl = signed?.signedUrl ?? null;
      }

      return {
        id: row.id,
        article_type: row.article_type,
        is_featured: row.is_featured,
        published_at: row.published_at,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt,
        body: translation.body ?? {},
        seo_title: translation.seo_title,
        seo_description: translation.seo_description,
        cover_url: coverUrl,
      } satisfies PublicArticle;
    }];
  }).map(async (build) => build()));
}

export async function getPublishedArticles(locale: Locale): Promise<PublicArticle[]> {
  return loadPublishedArticles(locale);
}

export async function getPublishedArticle(locale: Locale, slug: string): Promise<PublicArticle | null> {
  const articles = await loadPublishedArticles(locale, slug);
  return articles[0] ?? null;
}
