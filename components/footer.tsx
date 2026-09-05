import Link from "next/link";
import { Container } from "@/components/ui/container";

const marketplaceLinks = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/rfq/my-requests", label: "RFQ" },
  { href: "/help", label: "Buyer Protection" },
];

const supplierLinks = [
  { href: "/register", label: "Become a Supplier" },
  { href: "/supplier/dashboard", label: "Supplier Dashboard" },
  { href: "/supplier/verification", label: "Verification" },
  { href: "/supplier/products/add", label: "Add Products" },
  { href: "/help", label: "Supplier Resources" },
];

const companyLinks = [
  { href: "/help", label: "About NSOMEX" },
  { href: "/help", label: "Contact" },
  { href: "/help", label: "Careers" },
  { href: "/help", label: "Help Center" },
];

const legalLinks = [
  { href: "/help", label: "Terms" },
  { href: "/help", label: "Privacy" },
  { href: "/help", label: "Buyer Protection" },
  { href: "/help", label: "Supplier Policy" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">NO</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">NSOMEX</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Marketplace</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">A trusted B2B marketplace for industrial sourcing, supplier discovery, and cross-border procurement.</p>
            <div className="mt-5 flex gap-3 text-lg text-slate-500">
              <span>◌</span>
              <span>◍</span>
              <span>◐</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Marketplace</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {marketplaceLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">For Suppliers</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {supplierLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {companyLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {legalLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2">
              <button className="rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600">EN</button>
              <button className="rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600">USD</button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>© 2026 NSOMEX Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
