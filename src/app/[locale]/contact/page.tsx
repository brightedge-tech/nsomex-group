import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactEnquiryForm } from "@/components/contact-enquiry-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = getDictionary(locale).sections.contact;

  return (
    <main>
      <SiteHeader locale={locale} currentPath="contact" />
      <section className="page-hero contact-hero">
        <div className="section-wrap">
          <p className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>
      </section>

      <section className="contact-section section-wrap">
        <div className="contact-intro">
          <p className="eyebrow dark-eyebrow">{t.directEyebrow}</p>
          <h2>{t.directTitle}</h2>
          <p>{t.directDescription}</p>
        </div>
        <div className="contact-methods">
          <a className="contact-method contact-email" href="mailto:info@nsomex.com">
            <span className="contact-method-label">{t.emailLabel}</span>
            <strong>info@nsomex.com</strong>
            <span className="contact-method-action">{t.emailAction} ↗</span>
          </a>
          <a className="contact-method" href="tel:+8613949026940">
            <span className="contact-method-label">{t.chinaLabel}</span>
            <strong>+86 139 4902 6940</strong>
            <span className="contact-method-action">{t.callAction} ↗</span>
          </a>
          <a className="contact-method" href="tel:+237651629350">
            <span className="contact-method-label">{t.cameroonLabel}</span>
            <strong>+237 651 629 350</strong>
            <span className="contact-method-action">{t.callAction} ↗</span>
          </a>
        </div>
        <ContactEnquiryForm locale={locale} />
        <div className="contact-note">
          <span className="division-number">NSOMEX GROUP / GLOBAL ENQUIRIES</span>
          <p>{t.responseNote}</p>
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
