import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getPublishedPage } from "@/lib/public-pages";
import { PublicPageSections } from "@/components/public-page-sections";
import { SectionPlaceholder } from "@/components/section-placeholder";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const page = await getPublishedPage("about", rawLocale);
  if (!page) return { title: rawLocale === "fr" ? "À propos de NSOMEX Group" : "About NSOMEX Group" };
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || page.summary || undefined,
    alternates: { languages: { en: "/en/about", fr: "/fr/about" } },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const page = await getPublishedPage("about", locale);
  if (!page) return <SectionPlaceholder locale={locale} section="about" />;

  return <main>
    <SiteHeader locale={locale} currentPath="about" />
    <section className="page-hero">
      <div className="section-wrap">
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
