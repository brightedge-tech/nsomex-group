import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
