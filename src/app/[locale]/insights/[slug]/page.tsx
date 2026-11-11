import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublishedArticle } from "@/lib/public-articles";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicArticleBody } from "@/components/public-insights";
import styles from "@/components/public-insights.module.css";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const article = await getPublishedArticle(rawLocale, slug);
  if (!article) return {};
  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt || undefined,
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const article = await getPublishedArticle(locale, slug);
  if (!article) notFound();
  const backLabel = getDictionary(locale).navigation.insights;
  const date = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en", { dateStyle: "long" }).format(new Date(article.published_at));

  return (
    <main>
      <SiteHeader locale={locale} currentPath="insights" />
      <section className="page-hero"><div className="section-wrap">
        <Link className={styles.back} href={`/${locale}/insights`}>← {backLabel}</Link>
        <div className={styles.articleIntro}>
          <time dateTime={article.published_at}>{date}</time>
          <h1>{article.title}</h1>
          {article.excerpt && <p>{article.excerpt}</p>}
        </div>
      </div></section>
      {article.cover_url && <div className={`section-wrap ${styles.articleCover}`}><Image src={article.cover_url} alt="" fill sizes="100vw" unoptimized /></div>}
      <section className={`section-wrap ${styles.articleContent}`}>
        <PublicArticleBody body={article.body} />
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
