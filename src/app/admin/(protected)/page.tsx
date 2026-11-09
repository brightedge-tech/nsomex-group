import { createClient } from "@/lib/supabase/server";
import { adminMessages, type AdminLocale } from "@/lib/admin-messages";

type Props = { searchParams: Promise<{ lang?: string }> };
const modules = [
  { key:"pages", detailEn:"Manage website pages, reusable sections and bilingual copy.", detailFr:"Gérez les pages du site, les sections réutilisables et les contenus bilingues." },
  { key:"projects", detailEn:"Maintain the approved projects portfolio and project media.", detailFr:"Gérez le portfolio des projets approuvés et leurs médias." },
  { key:"articles", detailEn:"Prepare news, insights and company announcements.", detailFr:"Préparez les actualités, analyses et annonces du groupe." },
  { key:"media", detailEn:"Organise approved images and documents in the private library.", detailFr:"Organisez les images et documents approuvés dans la bibliothèque privée." },
  { key:"careers", detailEn:"Manage job openings and confidential applications.", detailFr:"Gérez les offres d’emploi et les candidatures confidentielles." },
  { key:"enquiries", detailEn:"Review messages submitted through the corporate contact form.", detailFr:"Consultez les messages envoyés via le formulaire de contact." },
  { key:"administrators", detailEn:"Manage invited administrators and division-scoped access.", detailFr:"Gérez les administrateurs invités et les accès par division." },
] as const;

export default async function AdminDashboard({ searchParams }: Props) {
  const { lang } = await searchParams;
  const locale: AdminLocale = lang === "fr" ? "fr" : "en";
  const t = adminMessages[locale];
  const supabase = await createClient();
  const { data: { user } } = await supabase!.auth.getUser();
  const [{ data: profile }, { data: assignments }] = await Promise.all([
    supabase!.from("cms_admin_profiles").select("display_name").eq("user_id", user!.id).maybeSingle(),
    supabase!.from("cms_role_assignments").select("role, division_id").eq("user_id", user!.id).is("revoked_at", null),
  ]);
  const ids = [...new Set((assignments ?? []).map(item => item.division_id).filter((id): id is string => Boolean(id)))];
  const { data: divisions } = ids.length
    ? await supabase!.from("divisions").select("id, name").in("id", ids)
    : { data: [] as {id:string;name:string}[] };
  const names = new Map((divisions ?? []).map(item => [item.id, item.name]));

  return <>
    <div className="cms-page-heading">
      <div><p className="cms-eyebrow">NSOMEX GROUP / {t.overview.toUpperCase()}</p><h1>{t.welcome}</h1><p>{t.welcomeCopy}</p></div>
    </div>
    <h2 className="cms-section-title">{t.access}</h2>
    <div className="cms-role-grid">
      {(assignments ?? []).map(item => <article className="cms-role-card" key={item.role + (item.division_id ?? "global")}>
        <div className="cms-role-card-head"><strong>{item.role.replaceAll("_"," ")}</strong><span className="cms-role-badge">{t.active}</span></div>
        <p>{item.division_id ? names.get(item.division_id) ?? t.division : t.noDivision}</p>
      </article>)}
    </div>
    {!assignments?.length && <div className="cms-notice">{t.noRoles}</div>}
    <h2 className="cms-section-title">{t.modules}</h2>
    <p style={{margin:"-5px 0 17px",color:"#788592",fontSize:12,lineHeight:1.8}}>{t.modulesCopy}</p>
    <div className="cms-module-grid">
      {modules.map(item => <article className="cms-module-card" key={item.key}>
        <h3>{t[item.key]}</h3>
        <p>{locale==="fr" ? item.detailFr : item.detailEn}</p>
        <span className="cms-module-tag">{t.comingSoon}</span>
      </article>)}
    </div>
  </>;
}
