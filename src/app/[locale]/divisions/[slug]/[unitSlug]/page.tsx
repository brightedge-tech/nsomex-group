import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { getDivision } from "@/lib/site";
import { getCapabilityOfferings } from "@/lib/capability-offerings";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { divisionImages, capabilityImages } from "@/lib/media";
import { toServiceSlug } from "@/lib/service-routes";

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
  const capabilityImage = capabilityImages[unitSlug] ?? divisionImages[slug];

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

      <section className="section-wrap capability-media">
        <MediaPlaceholder label={`${capability.name[locale]} / ${getDictionary(locale).media.capabilityVisual}`} detail={locale === "fr" ? "Image illustrative — pas une photo de projet NSOMEX." : "Illustrative stock image — not an NSOMEX project photograph."} ratio="wide" imageUrl={capabilityImage} />
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
          <div className="service-card-grid">
            {offerings.map((offering, index) => (
              <Link className="service-card" key={offering} href={`/${locale}/divisions/${slug}/${unitSlug}/${toServiceSlug(getCapabilityOfferings(unitSlug, "en")[index])}`}>
                <span className="division-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{offering}</h3>
                <span className="service-card-link">{t.exploreCapability} <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
        </section>

        {unitSlug === "software" ? (
          <aside className="product-example">
            <div>
              <p className="eyebrow dark-eyebrow">{t.productExampleEyebrow}</p>
              <h2>{t.productExampleTitle}</h2>
              <p>{t.productExampleText}</p>
              <span className="product-example-status">{t.productExampleStatus}</span>
            </div>
            <div className="product-example-visual" aria-hidden="true">
              <span className="product-example-mark">N</span>
              <span className="product-example-caption">CONNECT / DIGITAL SERVICES</span>
            </div>
          </aside>
        ) : null}

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
