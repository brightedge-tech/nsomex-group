import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { primaryNavigation } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

type Props = { locale: Locale; currentPath?: string };

type CmsNavigationPage = {
  slug: string;
  page_translations: { locale_code: string; title: string }[] | null;
};

export async function SiteHeader({ locale, currentPath = "" }: Props) {
  const dictionary = getDictionary(locale);
  const otherLocale = locale === "en" ? "fr" : "en";
  const languageLabel = locale === "en" ? "FR" : "EN";
  const supabase = await createClient();
  let cmsPages: CmsNavigationPage[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("pages")
      .select("slug,page_translations(locale_code,title)")
      .eq("status", "published")
      .eq("show_in_navigation", true)
      .order("navigation_order", { ascending: true });
    cmsPages = (data ?? []) as CmsNavigationPage[];
  }

  const localizedPages = cmsPages.flatMap((page) => {
    const translation = page.page_translations?.find((item) => item.locale_code === locale);
    return translation ? [{ slug: page.slug, title: translation.title }] : [];
  });

  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`} aria-label="NSOMEX Group home">
        <span className="brand-mark">N</span><span className="brand-name">NSOMEX<span>GROUP</span></span>
      </Link>
      <nav className="desktop-nav" aria-label={locale === "en" ? "Main navigation" : "Navigation principale"}>
        {primaryNavigation.map((item) => <Link key={item.href} href={`/${locale}/${item.href}`}>{dictionary.navigation[item.key]}</Link>)}
        {localizedPages.map((page) => <Link key={page.slug} href={`/${locale}/pages/${page.slug}`}>{page.title}</Link>)}
      </nav>
      <div className="header-actions">
        <Link className="language-switch" href={`/${otherLocale}${currentPath ? `/${currentPath}` : ""}`} lang={otherLocale} aria-label={otherLocale === "fr" ? "Passer en français" : "Switch to English"}>{languageLabel}</Link>
        <Link className="header-cta" href={`/${locale}/contact`}>{dictionary.navigation.connect} <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}
