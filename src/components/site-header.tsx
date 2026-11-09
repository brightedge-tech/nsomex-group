import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { primaryNavigation } from "@/lib/site";

type Props = { locale: Locale; currentPath?: string };

export function SiteHeader({ locale, currentPath = "" }: Props) {
  const dictionary = getDictionary(locale);
  const otherLocale = locale === "en" ? "fr" : "en";
  const languageLabel = locale === "en" ? "FR" : "EN";
  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`} aria-label="NSOMEX Group home">
        <span className="brand-mark">N</span><span className="brand-name">NSOMEX<span>GROUP</span></span>
      </Link>
      <nav className="desktop-nav" aria-label={locale === "en" ? "Main navigation" : "Navigation principale"}>
        {primaryNavigation.map((item) => <Link key={item.href} href={`/${locale}/${item.href}`}>{dictionary.navigation[item.key]}</Link>)}
      </nav>
      <div className="header-actions">
        <Link className="language-switch" href={`/${otherLocale}${currentPath ? `/${currentPath}` : ""}`} lang={otherLocale} aria-label={otherLocale === "fr" ? "Passer en français" : "Switch to English"}>{languageLabel}</Link>
        <Link className="header-cta" href={`/${locale}/contact`}>{dictionary.navigation.connect} <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}
