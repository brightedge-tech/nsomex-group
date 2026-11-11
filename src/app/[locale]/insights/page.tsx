import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublishedArticles } from "@/lib/public-articles";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicInsights } from "@/components/public-insights";

type Props = { params: Promise<{ locale: string }> };

export default async function InsightsPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const copy = getDictionary(locale).sections.insights;
  const articles = await getPublishedArticles(locale);

  return (
    <main>
      <SiteHeader locale={locale} currentPath="insights" />
      <section className="page-hero"><div className="section-wrap">
        <p className="eyebrow"><span className="eyebrow-line" />{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </div></section>
      <section className="directory-section section-wrap">
        <PublicInsights locale={locale} articles={articles} emptyMessage={copy.note} />
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
