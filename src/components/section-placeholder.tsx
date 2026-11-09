import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MediaPlaceholder } from "@/components/media-placeholder";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type SectionKey = "about" | "projects" | "insights" | "contact";

export function SectionPlaceholder({ locale, section }: { locale: Locale; section: SectionKey }) {
  const copy = getDictionary(locale).sections[section];
  return (
    <main>
      <SiteHeader locale={locale} currentPath={section} />
      <section className="page-hero"><div className="section-wrap">
        <p className="eyebrow"><span className="eyebrow-line" />{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </div></section>
      {section === "about" ? (
        <section className="section-wrap editorial-media-section">
          <MediaPlaceholder label={getDictionary(locale).sections.about.imageLabel} detail={getDictionary(locale).sections.about.imageDetail} ratio="wide" />
          <div className="leadership-placeholders">
            {[1, 2, 3].map((item) => (
              <MediaPlaceholder key={item} label={locale === "fr" ? "PORTRAIT DE LA DIRECTION" : "LEADERSHIP PORTRAIT"} detail={locale === "fr" ? "Profil à présenter après validation" : "Profile to be added after approval"} ratio="portrait" />
            ))}
          </div>
        </section>
      ) : section === "projects" ? (
        <section className="section-wrap editorial-media-section">
          <MediaPlaceholder label={getDictionary(locale).sections.projects.imageLabel} detail={getDictionary(locale).sections.projects.imageDetail} ratio="wide" />
          <div className="project-media-grid">
            {[1, 2, 3].map((item) => (
              <MediaPlaceholder key={item} label={locale === "fr" ? `PROJET / IMAGE 0${item}` : `PROJECT / IMAGE 0${item}`} detail={locale === "fr" ? "Visuel approuvé à ajouter" : "Approved project image to be added"} ratio="landscape" />
            ))}
          </div>
        </section>
      ) : null}
      <section className="directory-section section-wrap">
        <div className="section-note">
          <span className="division-number">NSOMEX GROUP</span>
          <p>{copy.note}</p>
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
