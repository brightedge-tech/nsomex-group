import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { divisions, getDivision } from "@/lib/site";
import { getCapabilityOfferings } from "@/lib/capability-offerings";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Props = { params: Promise<{ locale: string; slug: string; unitSlug: string }> };

export function generateStaticParams({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) return [];
  const division = getDivision(params.slug);
  return division ? division.focus.map((item) => ({ unitSlug: item.slug })) : [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug, unitSlug } = await params;
  if (!isLocale(rawLocale)) return {};
  const division = getDivision(slug);
  const capability = division?.focus.find((item) => item.slug === unitSlug);
  if (!division || !capability) return {};
  return {
    title: capability.name[rawLocale],
    description: capability.description[rawLocale],
    alternates: {
      languages: {
        en: `/en/divisions/${slug}/${unitSlug}`,
        fr: `/fr/divisions/${slug}/${unitSlug}`,
      },
    },
  };
}

export default async function CapabilityDetailPage({ params }: Props) {
  const { locale: rawLocale, slug, unitSlug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const division = getDivision(slug);
  const capability = division?.focus.find((item) => item.slug === unitSlug);
  if (!division || !capability) notFound();
  const t = getDictionary(locale).divisions;
  const offerings = getCapabilityOfferings(unitSlug, locale);

  return (
    <main>
      <SiteHeader locale={locale} currentPath={`divisions/${slug}/${unitSlug}`} />
      <section className="page-hero">
        <div className="section-wrap">
          <Link className="back-link" href={`/${locale}/divisions/${slug}`}>← {division.name}</Link>
          <p className="eyebrow"><span className="eyebrow-line" />{t.capabilityEyebrow} / {division.number}</p>
          <h1>{capability.name[locale]}</h1>
          <p>{capability.description[locale]}</p>
        </div>
      </section>

      <section className="section-wrap capability-content">
        <div className="capability-intro">
          <p className="eyebrow dark-eyebrow">{t.capabilityOverview}</p>
          <h2>{t.scopeHeading}</h2>
          <p>{capability.description[locale]}</p>
        </div>

        <section className="offerings-section" aria-labelledby="offerings-heading">
          <div className="offerings-heading">
            <p className="eyebrow dark-eyebrow">{t.capabilityEyebrow}</p>
            <h2 id="offerings-heading">{t.offerings}</h2>
          </div>
          <ul className="offerings-list">
            {offerings.map((offering, index) => (
              <li key={offering}>
                <span className="division-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{offering}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="capability-panels">
          <article className="capability-panel">
            <p className="eyebrow dark-eyebrow">01 / {t.serviceApproach}</p>
            <h2>{t.serviceApproach}</h2>
            <p>{t.serviceApproachText}</p>
          </article>
          <article className="capability-panel">
            <p className="eyebrow dark-eyebrow">02 / {t.partnership}</p>
            <h2>{t.partnership}</h2>
            <p>{t.partnershipText}</p>
          </article>
        </div>

        <div className="capability-cta">
          <div>
            <p className="eyebrow">{t.capabilityEyebrow}</p>
            <h2>{t.contactPrompt}</h2>
            <p>{t.contactPromptText}</p>
          </div>
          <Link className="button button-primary" href={`/${locale}/contact`}>{t.contactCta} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
