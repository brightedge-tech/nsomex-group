import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { divisions } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { divisionImages } from "@/lib/media";

type Props = { params: Promise<{ locale: string }> };

export default async function DivisionsPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = getDictionary(locale).divisions;
  const media = getDictionary(locale).media;
  return (
    <main>
      <SiteHeader locale={locale} currentPath="divisions" />
      <section className="page-hero"><div className="section-wrap">
        <p className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p>
      </div></section>
      <section className="directory-section section-wrap">
        <div className="directory-grid">
          {divisions.map((division) => (
            <article className="directory-card" key={division.slug}>
              <span className="division-number">{division.number}</span><MediaPlaceholder className="directory-card-media" label={`${media.divisionVisual} / ${division.name}`} detail={locale === "fr" ? "Image illustrative — pas une photo de projet NSOMEX." : "Illustrative stock image — not an NSOMEX project photograph."} ratio="landscape" imageUrl={divisionImages[division.slug]} /><h2>{division.name}</h2>
              <p>{division.summary[locale]}</p>
              <Link className="card-link" href={`/${locale}/divisions/${division.slug}`}>{t.overview} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
