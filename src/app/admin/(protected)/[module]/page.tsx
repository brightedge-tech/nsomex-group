import { notFound } from "next/navigation";
const moduleInfo: Record<string,{title:string;description:string}> = {
  pages:{title:"Pages & sections",description:"Bilingual website pages and reusable page sections will be managed here."},
  projects:{title:"Projects portfolio",description:"Approved project records, translations and associated media will be managed here."},
  articles:{title:"News & insights",description:"News, insights and announcements will be drafted, reviewed and published here."},
  media:{title:"Media library",description:"Private media uploads, metadata and published asset delivery will be managed here."},
  careers:{title:"Careers",description:"Job openings and confidential applications will be managed here."},
  enquiries:{title:"Contact enquiries",description:"Messages submitted through the corporate contact form will be reviewed here."},
  administrators:{title:"Administrator management",description:"Invited CMS users, division assignments and role changes will be managed here."},
};
export default async function AdminModulePage({params}:{params:Promise<{module:string}>}) {
  const {module}=await params;
  const item=moduleInfo[module];
  if(!item) notFound();
  return <section>
    <div className="cms-page-heading"><div><p className="cms-eyebrow">CMS MODULE</p><h1>{item.title}</h1><p>{item.description}</p></div></div>
    <div className="cms-notice">This module is not active yet. Its database access, server-side permission checks and editing workflow will be implemented before this workspace is enabled. No sample records are being displayed.</div>
  </section>;
}
