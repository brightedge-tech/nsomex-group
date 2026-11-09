import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { divisions, getDivision } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  return divisions.map((division) => ({ slug: division.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const division = getDivision(slug);
  if (!division) return {};
  return {
    title: division.name,
    description: division.summary[rawLocale],
    alternates: { languages: { en: `/en/divisions/${slug}`, fr: `/fr/divisions/${slug}` } },
  };
}

export default async function DivisionDetailPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const division = getDivision(slug);
  if (!division) notFound();
  const t = getDictionary(locale).divisions;
  return (
    <main>
      <SiteHeader locale={locale} currentPath={`divisions/${slug}`} />
      <section className="page-hero"><div className="section-wrap">
        <Link className="back-link" href={`/${locale}/divisions`}>← {t.back}</Link>
        <p className="eyebrow"><span className="eyebrow-line" />{division.number} / NSOMEX GROUP</p>
        <h1>{division.name}</h1><p>{division.overview[locale]}</p>
      </div></section>
      <section className="directory-section section-wrap">
        <p className="eyebrow dark-eyebrow">{t.focus}</p>
        <div className="focus-grid">
          {division.focus.map((item, index) => (
            <article className="focus-card" key={item.slug}>
              <span className="division-number">{String(index + 1).padStart(2, "0")}</span>
              <h2>{item.name[locale]}</h2><p>{item.description[locale]}</p>
            </article>
          ))}
        </div>
        <Link className="button button-dark page-contact" href={`/${locale}/contact`}>{t.enquire} <span aria-hidden="true">↗</span></Link>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
