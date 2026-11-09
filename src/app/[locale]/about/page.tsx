import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { SectionPlaceholder } from "@/components/section-placeholder";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SectionPlaceholder locale={locale} section="about" />;
}
