import Link from "next/link";
import type { Locale } from "@/i18n/config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copyright = locale === "fr" ? "Tous droits réservés." : "All rights reserved.";
  const labels = locale === "fr"
    ? { email: "E-mail", china: "Chine", cameroon: "Cameroun", contact: "Contact" }
    : { email: "Email", china: "China", cameroon: "Cameroon", contact: "Contact" };
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="brand footer-brand" href={`/${locale}`}>
          <span className="brand-mark">N</span><span className="brand-name">NSOMEX<span>GROUP</span></span>
        </Link>
        <p>Connecting Global Business to Global Opportunity.</p>
      </div>
      <div className="footer-contact">
        <span>{labels.email}</span><a href="mailto:info@nsomex.com">info@nsomex.com</a>
        <span>{labels.china}</span><a href="tel:+8613949026940">+86 139 4902 6940</a>
        <span>{labels.cameroon}</span><a href="tel:+237651629350">+237 651 629 350</a>
      </div>
      <div className="footer-bottom">
        <Link href={`/${locale}/contact`}>{labels.contact} ↗</Link>
        <span>© {new Date().getFullYear()} NSOMEX Group. {copyright}</span>
      </div>
    </footer>
  );
}
