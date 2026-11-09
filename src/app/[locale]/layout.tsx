import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import "./../globals.css";

type LocaleParams = { params: Promise<{ locale: string }> };
type LayoutProps = LocaleParams & { children: React.ReactNode };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: { default: "NSOMEX Group | Connecting Global Business to Global Opportunity", template: "%s | NSOMEX Group" },
    description: locale === "fr"
      ? "Un groupe international axé sur la technologie, reliant les entreprises, les produits, les services, les talents et les opportunités."
      : "A technology-driven global business group connecting businesses, products, services, talent, and opportunities across markets.",
    alternates: { languages: { en: "/en", fr: "/fr" } },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale}><body>{children}</body></html>;
}
