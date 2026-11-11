import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getPublishedPage } from "@/lib/public-pages";
import { PublicPageSections } from "@/components/public-page-sections";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const page = await getPublishedPage(slug, rawLocale);
  if (!page) return {};
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || page.summary || undefined,
    alternates: { languages: { en: `/en/pages/${slug}`, fr: `/fr/pages/${slug}` } },
  };
}

export default async function CmsPublicPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const page = await getPublishedPage(slug, locale);
  if (!page) notFound();

  return <main>
    <SiteHeader locale={locale} currentPath={`pages/${slug}`} />
    <section className="page-hero">
      <div className="section-wrap">
        <Link className="back-link" href={`/${locale}`}>{locale === "fr" ? "← Accueil" : "← Home"}</Link>
        <p className="eyebrow"><span className="eyebrow-line" />NSOMEX GROUP</p>
        <h1>{page.title}</h1>
        {page.summary && <p>{page.summary}</p>}
        {page.cover_image_url && <figure className="public-page-cover"><img src={page.cover_image_url} alt={page.title} /></figure>}
      </div>
    </section>
    <PublicPageSections sections={page.sections} />
    <SiteFooter locale={locale} />
  </main>;
}
