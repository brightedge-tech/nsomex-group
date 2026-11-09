import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { getDivision } from "@/lib/site";
import { getCapabilityOfferings } from "@/lib/capability-offerings";
import { getIndicativeTimeline, toServiceSlug } from "@/lib/service-routes";
import { divisionImages, capabilityImages } from "@/lib/media";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MediaPlaceholder } from "@/components/media-placeholder";

type Props = { params: Promise<{ locale: string; slug: string; unitSlug: string; serviceSlug: string }> };

function resolveService(unitSlug: string, serviceSlug: string, locale: "en" | "fr") {
  const english = getCapabilityOfferings(unitSlug, "en");
  const index = english.findIndex((item) => toServiceSlug(item) === serviceSlug);
  if (index < 0) return null;
  const localized = getCapabilityOfferings(unitSlug, locale);
  return { index, title: localized[index] ?? english[index] };
}

export function generateStaticParams({ params }: { params: { locale: string; slug: string; unitSlug: string } }) {
  if (!isLocale(params.locale)) return [];
  return getCapabilityOfferings(params.unitSlug, "en").map((item) => ({ serviceSlug: toServiceSlug(item) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug, unitSlug, serviceSlug } = await params;
  if (!isLocale(rawLocale)) return {};
  const division = getDivision(slug);
  const capability = division?.focus.find((item) => item.slug === unitSlug);
  const service = resolveService(unitSlug, serviceSlug, rawLocale);
  if (!division || !capability || !service) return {};
  return {
    title: service.title,
    description: capability.description[rawLocale],
    alternates: {
      languages: {
        en: `/en/divisions/${slug}/${unitSlug}/${serviceSlug}`,
        fr: `/fr/divisions/${slug}/${unitSlug}/${serviceSlug}`,
      },
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale: rawLocale, slug, unitSlug, serviceSlug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const division = getDivision(slug);
  const capability = division?.focus.find((item) => item.slug === unitSlug);
  const service = resolveService(unitSlug, serviceSlug, locale);
  if (!division || !capability || !service) notFound();

  const t = getDictionary(locale).divisions;
  const imageUrl = capabilityImages[unitSlug] ?? divisionImages[slug];
  const timeline = getIndicativeTimeline(division.slug, unitSlug, serviceSlug, locale);

  return (
    <main>
      <SiteHeader locale={locale} currentPath={`divisions/${slug}/${unitSlug}/${serviceSlug}`} />
      <section className="page-hero">
        <div className="section-wrap">
          <Link className="back-link" href={`/${locale}/divisions/${slug}/${unitSlug}`}>← {capability.name[locale]}</Link>
          <p className="eyebrow"><span className="eyebrow-line" />{t.serviceDetailEyebrow} / {division.number}</p>
          <h1>{service.title}</h1>
          <p>{capability.description[locale]}</p>
        </div>
      </section>

      <section className="section-wrap service-detail-media">
        <MediaPlaceholder
          label={`${service.title} / ${getDictionary(locale).media.capabilityVisual}`}
          detail={locale === "fr" ? "Image illustrative — pas une photo de projet NSOMEX." : "Illustrative stock image — not an NSOMEX project photograph."}
          ratio="wide"
          imageUrl={imageUrl}
        />
      </section>

      <section className="section-wrap service-detail-content">
        <div className="service-detail-intro">
          <div>
            <p className="eyebrow dark-eyebrow">{t.serviceScope}</p>
            <h2>{service.title}</h2>
            <p>{capability.description[locale]}</p>
          </div>
          <aside className="timeline-card">
            <span className="timeline-label">{t.indicativeTimeline}</span>
            <strong>{timeline}</strong>
            <p>{t.timelineNote}</p>
          </aside>
        </div>

        <div className="service-detail-columns">
          <section className="service-detail-panel">
            <p className="eyebrow dark-eyebrow">01 / {t.typicalDeliverables}</p>
            <h2>{t.typicalDeliverables}</h2>
            <ul>{t.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section className="service-detail-panel">
            <p className="eyebrow dark-eyebrow">02 / {t.deliveryStages}</p>
            <h2>{t.deliveryStages}</h2>
            <ol>{t.stages.map((item) => <li key={item}>{item}</li>)}</ol>
          </section>
        </div>

        <div className="capability-cta">
          <div>
            <p className="eyebrow">{division.name}</p>
            <h2>{t.contactPrompt}</h2>
            <p>{t.contactPromptText}</p>
          </div>
          <Link className="button button-primary" href={`/${locale}/contact`}>{t.serviceEnquiry} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
