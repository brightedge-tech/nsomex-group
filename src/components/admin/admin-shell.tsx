"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { adminMessages, type AdminLocale } from "@/lib/admin-messages";

type Props = { children: React.ReactNode; email: string };
const navigation = [
  { key:"dashboard", href:"/admin" }, { key:"catalogue", href:"/admin/catalogue" }, { key:"pages", href:"/admin/pages" },
  { key:"projects", href:"/admin/projects" }, { key:"articles", href:"/admin/articles" },
  { key:"media", href:"/admin/media" }, { key:"careers", href:"/admin/careers" },
  { key:"enquiries", href:"/admin/enquiries" }, { key:"administrators", href:"/admin/administrators" },
] as const;

export function AdminShell({ children, email }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale: AdminLocale = searchParams.get("lang") === "fr" ? "fr" : "en";
  const t = adminMessages[locale];

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  function changeLocale(nextLocale: AdminLocale) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLocale);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return <div className="cms-frame">
    <aside className="cms-sidebar">
      <Link className="cms-brand" href="/admin"><span className="cms-brand-symbol">N</span><span><strong>{t.brand}</strong><small>{t.workspace}</small></span></Link>
      <div className="cms-nav-label">{t.overview}</div>
      <nav aria-label={t.workspace} className="cms-nav">
        {navigation.map(item => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return <Link aria-current={active ? "page" : undefined} className={active ? "cms-nav-link is-active" : "cms-nav-link"} href={item.href} key={item.key}>
            <span className="cms-nav-dot" />{t[item.key]}{item.href !== "/admin" && <span className="cms-nav-soon">·</span>}
          </Link>;
        })}
      </nav>
      <div className="cms-sidebar-bottom"><span className="cms-secure-dot" /><span>{t.secureNote}</span></div>
    </aside>
    <div className="cms-main">
      <header className="cms-topbar">
        <div className="cms-breadcrumb">{t.brand}<span>/</span>{t.dashboard}</div>
        <div className="cms-user-tools">
          <div className="cms-user-email">{email}</div>
          <div className="cms-language">
            <button aria-current={locale==="en" ? "page":undefined} onClick={()=>changeLocale("en")} type="button">EN</button>
            <span>/</span>
            <button aria-current={locale==="fr" ? "page":undefined} onClick={()=>changeLocale("fr")} type="button">FR</button>
          </div>
          <button className="cms-signout" onClick={signOut} type="button">{t.signOut}</button>
        </div>
      </header>
      <main className="cms-content">{children}</main>
    </div>
  </div>;
}
