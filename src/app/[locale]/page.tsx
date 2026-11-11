import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { catalogueText, getPublicDivisions } from "@/lib/public-catalogue";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { divisionImages, stockImages } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = getDictionary(locale).home;
  const divisions = await getPublicDivisions();
  const supabase = await createClient();
  const { data: landingAssets } = supabase
    ? await supabase.from("landing_page_media").select("slot,object_path")
    : { data: [] as { slot: string; object_path: string }[] };
  const landingImages: Record<string, string> = {};
  for (const asset of landingAssets ?? []) {
    landingImages[asset.slot] = supabase!.storage.from("nsomex-website").getPublicUrl(asset.object_path).data.publicUrl;
  }
  const heroImage = landingImages.hero ?? stockImages.heroSkyline;
  const corporateImage = landingImages.corporate ?? stockImages.corporate;
  return (
    <main>
      <SiteHeader locale={locale} />
      <section
        className="hero"
        style={{
          // Put the approved globe-and-skyline composition at
          // public/images/homepage-hero.jpg. The existing skyline remains
          // as a fallback until that image is added.
          backgroundImage: `linear-gradient(90deg, rgba(5, 20, 38, .72) 0%, rgba(5, 25, 47, .40) 55%, rgba(5, 25, 47, .12) 100%), url("${heroImage}")`,
        }}
      >
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
        <MediaPlaceholder label={getDictionary(locale).media.groupVisual} detail={locale === "fr" ? "Photo illustrative libre de droits — à remplacer par un visuel NSOMEX approuvé." : "Illustrative stock photo — replace with approved NSOMEX imagery when available."} ratio="wide" imageUrl={corporateImage} />
      </section>
      <section className="divisions-section">
        <div className="section-wrap">
          <div className="section-heading"><div><p className="eyebrow">{t.ourDivisions}</p><h2>{t.divisionHeading}</h2></div><p>{t.divisionIntro}</p></div>
          <div className="division-grid">
            {divisions.map((division) => {
              const name = catalogueText(division.content_translations, locale, "name") || division.code;
              const summary = catalogueText(division.content_translations, locale, "summary");
              return (
                <article className="division-card" key={division.id}>
                  <div className="division-card-top"><span className="division-number">{String(division.sort_order).padStart(2, "0")}</span><span className="card-arrow" aria-hidden="true">↗</span></div>
                  <MediaPlaceholder className="home-division-media" label={`${name} / illustrative stock image`} detail={locale === "fr" ? "Image illustrative — pas une photo de projet NSOMEX." : "Illustrative stock image — not an NSOMEX project photograph."} ratio="landscape" imageUrl={landingImages[division.slug] ?? divisionImages[division.slug]} />
                  <h3>{name}</h3><p>{summary}</p>
                  <ul>{division.business_units.slice(0, 3).map((unit) => <li key={unit.id}>{catalogueText(unit.content_translations, locale, "name") || unit.code}</li>)}</ul>
                  <Link className="card-link" href={`/${locale}/divisions/${division.slug}`}>{t.exploreDivision} <span aria-hidden="true">→</span></Link>
                </article>
              );
            })}
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
