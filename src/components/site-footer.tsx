import Link from "next/link";
import type { Locale } from "@/i18n/config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copyright = locale === "fr" ? "Tous droits réservés." : "All rights reserved.";
  return (
    <footer className="site-footer">
      <Link className="brand footer-brand" href={`/${locale}`}>
        <span className="brand-mark">N</span><span className="brand-name">NSOMEX<span>GROUP</span></span>
      </Link>
      <p>Connecting Global Business to Global Opportunity.</p>
      <span>© {new Date().getFullYear()} NSOMEX Group. {copyright}</span>
    </footer>
  );
}
