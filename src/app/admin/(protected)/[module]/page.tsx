import { notFound } from "next/navigation";
import { PagesWorkspace } from "@/components/admin/pages-workspace";
import { CoreContentWorkspace } from "@/components/admin/core-content-workspace";
import { ProjectsMediaWorkspace } from "@/components/admin/projects-media-workspace";
import { ArticlesWorkspace } from "@/components/admin/articles-workspace";
import { createClient } from "@/lib/supabase/server";

const moduleInfo: Record<string,{title:string;description:string}> = {
  catalogue:{title:"Business structure",description:"Manage divisions, business units, categories, subcategories and services in English and French."},
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

  if(module === "catalogue") {
    const supabase = await createClient();
    if (!supabase) notFound();
    const [{ data: { user } }] = await Promise.all([supabase.auth.getUser()]);
    if (!user) notFound();
    const { data: divisions } = await supabase
      .from("divisions")
      .select("id,code,slug,is_active,sort_order,content_translations(locale_code,field_name,content),business_units(id,division_id,code,slug,is_active,sort_order,content_translations(locale_code,field_name,content),categories(id,business_unit_id,parent_id,code,slug,is_active,sort_order,content_translations(locale_code,field_name,content),services(id,category_id,code,slug,is_active,sort_order,content_translations(locale_code,field_name,content)))")
      .order("sort_order");
    return <section>
      <div className="cms-page-heading"><div><p className="cms-eyebrow">CMS MODULE</p><h1>{item.title}</h1><p>{item.description}</p></div></div>
      <CoreContentWorkspace divisions={(divisions ?? []) as never} />
    </section>;
  }

  if(module === "projects" || module === "media") {
    const supabase = await createClient();
    if (!supabase) notFound();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) notFound();
    const { data: roles } = await supabase
      .from("cms_role_assignments")
      .select("role,division_id")
      .eq("user_id",user.id)
      .is("revoked_at",null);
    const canManageGlobal = Boolean(roles?.some(role=>role.role==="super_admin"));
    const assignedDivisionIds = [...new Set((roles ?? []).map(role=>role.division_id).filter((id):id is string=>Boolean(id)))];
    if (!canManageGlobal && assignedDivisionIds.length === 0) {
      return <section><div className="cms-notice">No active division access is assigned to this account.</div></section>;
    }
    let divisionQuery = supabase.from("divisions").select("id,code").eq("is_active",true).order("sort_order");
    let unitQuery = supabase.from("business_units").select("id,division_id,code").eq("is_active",true).order("sort_order");
    let projectQuery = supabase.from("projects").select("id,division_id,business_unit_id,slug,project_type,status,location_name,city,region,country_code,started_on,completed_on,is_featured,sort_order,project_translations(locale_code,title,summary,description)").order("updated_at",{ascending:false});
    let mediaQuery = supabase.from("media_assets").select("id,division_id,object_path,original_filename,mime_type,byte_size,status,created_at").order("created_at",{ascending:false});
    if (!canManageGlobal) {
      divisionQuery = divisionQuery.in("id",assignedDivisionIds);
      unitQuery = unitQuery.in("division_id",assignedDivisionIds);
      projectQuery = projectQuery.in("division_id",assignedDivisionIds);
      mediaQuery = mediaQuery.in("division_id",assignedDivisionIds);
    }
    const [{data:divisions},{data:units},{data:projects},{data:media}] = await Promise.all([
      divisionQuery,unitQuery,projectQuery,mediaQuery,
    ]);
    return <section>
      <div className="cms-page-heading"><div><p className="cms-eyebrow">CMS MODULE</p><h1>{item.title}</h1><p>{item.description}</p></div></div>
      <ProjectsMediaWorkspace
        projects={(projects ?? []) as never}
        divisions={(divisions ?? []) as never}
        businessUnits={(units ?? []) as never}
        mediaAssets={(media ?? []) as never}
        canManageGlobal={canManageGlobal}
      />
    </section>;
  }

  if(module === "articles") {
    const supabase = await createClient();
    if (!supabase) notFound();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) notFound();
    const { data: roles } = await supabase
      .from("cms_role_assignments")
      .select("role,division_id")
      .eq("user_id",user.id)
      .is("revoked_at",null);
    const canManageGlobal = Boolean(roles?.some(role=>role.role==="super_admin"));
    const assignedDivisionIds = [...new Set((roles ?? []).map(role=>role.division_id).filter((id):id is string=>Boolean(id)))];
    if (!canManageGlobal && assignedDivisionIds.length === 0) {
      return <section><div className="cms-notice">No active division access is assigned to this account.</div></section>;
    }
    let divisionQuery = supabase.from("divisions").select("id,code").eq("is_active",true).order("sort_order");
    let articleQuery = supabase.from("articles").select("id,division_id,article_type,status,cover_media_asset_id,is_featured,published_at,updated_at,article_translations(locale_code,slug,title,excerpt,body,seo_title,seo_description),article_category_assignments(category_id)").order("updated_at",{ascending:false});
    let mediaQuery = supabase.from("media_assets").select("id,division_id,original_filename,mime_type,status").eq("status","published").order("created_at",{ascending:false});
    if (!canManageGlobal) {
      divisionQuery = divisionQuery.in("id",assignedDivisionIds);
      articleQuery = articleQuery.in("division_id",assignedDivisionIds);
      mediaQuery = mediaQuery.in("division_id",assignedDivisionIds);
    }
    const [{data:divisions},{data:articleData},{data:categoryData},{data:mediaData}] = await Promise.all([
      divisionQuery,
      articleQuery,
      supabase.from("article_categories").select("id,slug,status,article_category_translations(locale_code,name,description)").order("sort_order"),
      mediaQuery,
    ]);
    return <section>
      <div className="cms-page-heading"><div><p className="cms-eyebrow">CMS MODULE</p><h1>{item.title}</h1><p>{item.description}</p></div></div>
      <ArticlesWorkspace
        articles={(articleData ?? []) as never}
        categories={(categoryData ?? []) as never}
        divisions={(divisions ?? []) as never}
        media={(mediaData ?? []) as never}
        canManageGlobal={canManageGlobal}
      />
    </section>;
  }

  if(module === "pages") {
    const supabase = await createClient();
    if (!supabase) notFound();
    const [{ data: pageData }, { data: { user } }] = await Promise.all([
      supabase.from("pages").select("id,slug,template_key,status,division_id,show_in_navigation,navigation_order,page_translations(locale_code,title,summary),page_sections(id,section_key,section_type,status,sort_order,page_section_translations(locale_code,content))").order("updated_at",{ascending:false}),
      supabase.auth.getUser(),
    ]);
    const { data: roles } = user
      ? await supabase.from("cms_role_assignments").select("role,division_id").eq("user_id",user.id).is("revoked_at",null)
      : { data: [] as {role:string;division_id:string|null}[] };
    const canManageGlobal = Boolean(roles?.some(role=>role.role==="super_admin"));
    const assignedDivisionIds = [...new Set((roles ?? []).map(role=>role.division_id).filter((id):id is string=>Boolean(id)))];
    let divisionQuery = supabase.from("divisions").select("id,code").eq("is_active",true).order("sort_order");
    if (!canManageGlobal) {
      if (assignedDivisionIds.length === 0) {
        return <section><div className="cms-notice">No active division access is assigned to this account.</div></section>;
      }
      divisionQuery = divisionQuery.in("id",assignedDivisionIds);
    }
    const { data: divisionData } = await divisionQuery;
    const pageRows = (pageData ?? []) as unknown as PageRow[];
    const divisionRows = (divisionData ?? []) as {id:string;code:string}[];
    return <section>
      <div className="cms-page-heading"><div><p className="cms-eyebrow">CMS MODULE</p><h1>{item.title}</h1><p>{item.description}</p></div></div>
      <PagesWorkspace pages={pageRows} divisions={divisionRows} canManageGlobal={canManageGlobal} />
    </section>;
  }

  return <section>
    <div className="cms-page-heading"><div><p className="cms-eyebrow">CMS MODULE</p><h1>{item.title}</h1><p>{item.description}</p></div></div>
    <div className="cms-notice">This module is not active yet. Its database access, server-side permission checks and editing workflow will be implemented before this workspace is enabled. No sample records are being displayed.</div>
  </section>;
}
