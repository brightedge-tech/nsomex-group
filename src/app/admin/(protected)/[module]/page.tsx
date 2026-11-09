import { notFound } from "next/navigation";
import { PagesWorkspace } from "@/components/admin/pages-workspace";
import { createClient } from "@/lib/supabase/server";

const moduleInfo: Record<string,{title:string;description:string}> = {
  pages:{title:"Pages & sections",description:"Create and manage bilingual website pages and reusable content sections."},
  projects:{title:"Projects portfolio",description:"Approved project records, translations and associated media will be managed here."},
  articles:{title:"News & insights",description:"News, insights and announcements will be drafted, reviewed and published here."},
  media:{title:"Media library",description:"Private media uploads, metadata and published asset delivery will be managed here."},
  careers:{title:"Careers",description:"Job openings and confidential applications will be managed here."},
  enquiries:{title:"Contact enquiries",description:"Messages submitted through the corporate contact form will be reviewed here."},
  administrators:{title:"Administrator management",description:"Invited CMS users, division assignments and role changes will be managed here."},
};

type PageRow = {
  id:string; slug:string; template_key:string; status:"draft"|"review"|"published"|"archived";
  division_id:string|null; show_in_navigation:boolean; navigation_order:number;
  page_translations:{locale_code:string;title:string;summary:string|null}[];
  page_sections:{
    id:string;section_key:string;section_type:string;status:"draft"|"published"|"archived";sort_order:number;
    page_section_translations:{locale_code:string;content:Record<string,unknown>}[];
  }[];
};

export default async function AdminModulePage({params}:{params:Promise<{module:string}>}) {
  const {module}=await params;
  const item=moduleInfo[module];
  if(!item) notFound();

  if(module === "pages") {
    const supabase = await createClient();
    if (!supabase) notFound();
    const [{ data: pageData }, { data: divisionData }, { data: { user } }] = await Promise.all([
      supabase.from("pages").select("id,slug,template_key,status,division_id,show_in_navigation,navigation_order,page_translations(locale_code,title,summary),page_sections(id,section_key,section_type,status,sort_order,page_section_translations(locale_code,content))").order("updated_at",{ascending:false}),
      supabase.from("divisions").select("id,code").eq("is_active",true).order("sort_order"),
      supabase.auth.getUser(),
    ]);
    const { data: roles } = user
      ? await supabase.from("cms_role_assignments").select("role").eq("user_id",user.id).is("revoked_at",null)
      : { data: [] as {role:string}[] };
    const pageRows = (pageData ?? []) as unknown as PageRow[];
    const divisionRows = (divisionData ?? []) as {id:string;code:string}[];
    return <section>
      <div className="cms-page-heading"><div><p className="cms-eyebrow">CMS MODULE</p><h1>{item.title}</h1><p>{item.description}</p></div></div>
      <PagesWorkspace pages={pageRows} divisions={divisionRows} canManageGlobal={Boolean(roles?.some(role=>role.role==="super_admin"))} />
    </section>;
  }

  return <section>
    <div className="cms-page-heading"><div><p className="cms-eyebrow">CMS MODULE</p><h1>{item.title}</h1><p>{item.description}</p></div></div>
    <div className="cms-notice">This module is not active yet. Its database access, server-side permission checks and editing workflow will be implemented before this workspace is enabled. No sample records are being displayed.</div>
  </section>;
}
