import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { divisions } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { divisionImages, stockImages } from "@/lib/media";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = getDictionary(locale).home;
  return (
    <main>
      <SiteHeader locale={locale} />
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,19,33,.97) 0%, rgba(7,19,33,.86) 48%, rgba(7,19,33,.56) 100%), url("${stockImages.corporate}")` }}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow"><span className="eyebrow-line" /> {t.eyebrow}</p>
          <h1>{t.headlineFirst}<br /><span>{t.headlineSecond}</span></h1>
          <p className="hero-copy">{t.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/${locale}/divisions`}>{t.explore} <span aria-hidden="true">↗</span></Link>
            <Link className="text-link" href={`/${locale}/about`}>{t.discover} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="hero-aside" aria-hidden="true">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit orbit-three" />
          <span className="orbit-core">N</span><span className="orbit-caption">{t.orbit}</span>
        </div>
        <div className="hero-footer"><span>{t.capabilities}</span><span>{t.world}</span></div>
      </section>
      <section className="intro section-wrap">
        <div><p className="eyebrow dark-eyebrow">{t.who}</p><h2>{t.one}<br /><span>{t.multiple}</span><br />{t.ambition}</h2></div>
        <div className="intro-copy">
          <p>{t.aboutOne}</p><p>{t.aboutTwo}</p>
          <Link className="text-link dark-link" href={`/${locale}/about`}>{t.more} <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="section-wrap home-media-section">
        <MediaPlaceholder label={getDictionary(locale).media.groupVisual} detail={locale === "fr" ? "Photo illustrative libre de droits — à remplacer par un visuel NSOMEX approuvé." : "Illustrative stock photo — replace with approved NSOMEX imagery when available."} ratio="wide" imageUrl={stockImages.corporate} />
      </section>
      <section className="divisions-section">
        <div className="section-wrap">
          <div className="section-heading"><div><p className="eyebrow">{t.ourDivisions}</p><h2>{t.divisionHeading}</h2></div><p>{t.divisionIntro}</p></div>
          <div className="division-grid">
            {divisions.map((division) => (
              <article className="division-card" key={division.slug}>
                <div className="division-card-top"><span className="division-number">{division.number}</span><span className="card-arrow" aria-hidden="true">↗</span></div>
                <MediaPlaceholder className="home-division-media" label={`${division.name} / illustrative stock image`} detail={locale === "fr" ? "Image illustrative — pas une photo de projet NSOMEX." : "Illustrative stock image — not an NSOMEX project photograph."} ratio="landscape" imageUrl={divisionImages[division.slug]} />
                <h3>{division.name}</h3><p>{division.summary[locale]}</p>
                <ul>{division.focus.slice(0, 3).map((item) => <li key={item.slug}>{item.name[locale]}</li>)}</ul>
                <Link className="card-link" href={`/${locale}/divisions/${division.slug}`}>{t.exploreDivision} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="closing-cta section-wrap">
        <p className="eyebrow dark-eyebrow">{t.move}</p>
        <div className="closing-row"><h2>{t.opportunity}<br /><span>{t.connection}</span></h2><Link className="button button-dark" href={`/${locale}/contact`}>{t.start} <span aria-hidden="true">↗</span></Link></div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
