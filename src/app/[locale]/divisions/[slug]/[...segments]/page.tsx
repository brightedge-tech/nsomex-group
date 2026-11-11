import type {Metadata} from "next";
import Link from "next/link";
import {notFound,redirect} from "next/navigation";
import {getDictionary} from "@/i18n/dictionaries";
import {isLocale} from "@/i18n/config";
import {catalogueText,getPublicBusinessUnit,getPublicCategory,getPublicService} from "@/lib/public-catalogue";
import {SiteHeader} from "@/components/site-header";
import {SiteFooter} from "@/components/site-footer";
import {MediaPlaceholder} from "@/components/media-placeholder";
import {divisionImages,capabilityImages} from "@/lib/media";

type Props={params:Promise<{locale:string;slug:string;segments:string[]}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale,slug,segments}=await params;if(!isLocale(locale)||!segments?.length)return{};
 const [unitSlug,categorySlug,serviceSlug]=segments;
 if(segments.length===1){const r=await getPublicBusinessUnit(slug,unitSlug);return r?{title:catalogueText(r.unit.content_translations,locale,"name"),description:catalogueText(r.unit.content_translations,locale,"summary")}:{};}
 if(segments.length===2){const r=await getPublicCategory(slug,unitSlug,categorySlug);return r?{title:catalogueText(r.category.content_translations,locale,"name")}:{};}
 if(segments.length===3){const r=await getPublicService(slug,unitSlug,categorySlug,serviceSlug);return r?{
  title:catalogueText(r.service.content_translations,locale,"seo_title")||catalogueText(r.service.content_translations,locale,"name"),
  description:catalogueText(r.service.content_translations,locale,"seo_description")||catalogueText(r.service.content_translations,locale,"summary")
 }:{};}
 return{};
}
export default async function CataloguePathPage({params}:Props){
 const {locale:raw,slug,segments}=await params;
 if(!isLocale(raw)||!segments?.length||segments.length>3)notFound();
 const locale=raw,[unitSlug,categorySlug,serviceSlug]=segments,t=getDictionary(locale).divisions;
 let r:Awaited<ReturnType<typeof getPublicBusinessUnit>>|Awaited<ReturnType<typeof getPublicCategory>>|Awaited<ReturnType<typeof getPublicService>>;
 if(segments.length===1)r=await getPublicBusinessUnit(slug,unitSlug);
 else if(segments.length===2){
  r=await getPublicCategory(slug,unitSlug,categorySlug);
  if(!r){const parent=await getPublicBusinessUnit(slug,unitSlug);const legacy=parent?.unit.categories.flatMap(category=>category.services.map(service=>({category,service}))).find(item=>item.service.slug===categorySlug);if(legacy)redirect(`/${locale}/divisions/${slug}/${unitSlug}/${legacy.category.slug}/${legacy.service.slug}`);notFound();}
 }else r=await getPublicService(slug,unitSlug,categorySlug,serviceSlug);
 if(!r)notFound();
 const d=r.division,u=r.unit,unitName=catalogueText(u.content_translations,locale,"name")||u.code,divisionName=catalogueText(d.content_translations,locale,"name")||d.code;
 const image=capabilityImages[unitSlug]??divisionImages[slug];
 if(segments.length===1){
  return <main><SiteHeader locale={locale} currentPath={`divisions/${slug}/${unitSlug}`}/>
   <section className="page-hero"><div className="section-wrap"><Link className="back-link" href={`/${locale}/divisions/${slug}`}>← {divisionName}</Link><p className="eyebrow"><span className="eyebrow-line"/>{t.capabilityEyebrow} / {String(d.sort_order).padStart(2,"0")}</p><h1>{unitName}</h1><p>{catalogueText(u.content_translations,locale,"description")||catalogueText(u.content_translations,locale,"summary")}</p></div></section>
   <section className="section-wrap capability-media"><MediaPlaceholder label={unitName} detail={locale==="fr"?"Image illustrative — pas une photo de projet NSOMEX.":"Illustrative stock image — not an NSOMEX project photograph."} ratio="wide" imageUrl={image}/></section>
   <section className="section-wrap capability-content"><div className="capability-intro"><p className="eyebrow dark-eyebrow">{t.capabilityOverview}</p><h2>{t.scopeHeading}</h2><p>{catalogueText(u.content_translations,locale,"description")||catalogueText(u.content_translations,locale,"summary")}</p></div>
    <section className="offerings-section"><div className="offerings-heading"><p className="eyebrow dark-eyebrow">{t.capabilityEyebrow}</p><h2>{locale==="fr"?"Catégories":"Categories"}</h2></div><div className="service-card-grid">{u.categories.map((c,i)=>{const n=catalogueText(c.content_translations,locale,"name")||c.code;return <Link className="service-card" key={c.id} href={`/${locale}/divisions/${slug}/${unitSlug}/${c.slug}`}><span className="division-number">{String(i+1).padStart(2,"0")}</span><h3>{n}</h3><span className="service-card-link">{t.viewDetails} ↗</span></Link>;})}</div></section>
    <div className="capability-cta"><div><p className="eyebrow">{divisionName}</p><h2>{t.contactPrompt}</h2><p>{t.contactPromptText}</p></div><Link className="button button-primary" href={`/${locale}/contact`}>{t.contactCta} ↗</Link></div></section><SiteFooter locale={locale}/></main>;
 }
 if(segments.length===2){
  const c=(r as Awaited<ReturnType<typeof getPublicCategory>>)?.category;if(!c)notFound();
  const categoryName=catalogueText(c.content_translations,locale,"name")||c.code;
  return <main><SiteHeader locale={locale} currentPath={`divisions/${slug}/${unitSlug}/${categorySlug}`}/>
   <section className="page-hero"><div className="section-wrap"><Link className="back-link" href={`/${locale}/divisions/${slug}/${unitSlug}`}>← {unitName}</Link><p className="eyebrow"><span className="eyebrow-line"/>{t.serviceDetailEyebrow} / {divisionName}</p><h1>{categoryName}</h1><p>{catalogueText(c.content_translations,locale,"description")||catalogueText(u.content_translations,locale,"description")||catalogueText(u.content_translations,locale,"summary")}</p></div></section>
   <section className="section-wrap capability-content"><div className="offerings-heading"><p className="eyebrow dark-eyebrow">{t.capabilityEyebrow}</p><h2>{locale==="fr"?"Services disponibles":"Available services"}</h2></div>
    <div className="service-card-grid">{c.services.map((s,i)=>{const n=catalogueText(s.content_translations,locale,"name")||s.code;return <Link className="service-card" key={s.id} href={`/${locale}/divisions/${slug}/${unitSlug}/${categorySlug}/${s.slug}`}><span className="division-number">{String(i+1).padStart(2,"0")}</span><h3>{n}</h3><span className="service-card-link">{t.viewDetails} ↗</span></Link>;})}</div>
    <div className="capability-cta"><div><p className="eyebrow">{unitName}</p><h2>{t.contactPrompt}</h2><p>{t.contactPromptText}</p></div><Link className="button button-primary" href={`/${locale}/contact`}>{t.serviceEnquiry} ↗</Link></div></section><SiteFooter locale={locale}/></main>;
 }
 const result=r as Awaited<ReturnType<typeof getPublicService>>;if(!result?.service)notFound();
 const c=result.category,s=result.service,categoryName=catalogueText(c.content_translations,locale,"name")||c.code;
 const serviceName=catalogueText(s.content_translations,locale,"name")||s.code;
 const description=catalogueText(s.content_translations,locale,"description");
 const summary=catalogueText(s.content_translations,locale,"summary");
 const media=s.media??[],cover=media.find((item:{media_role:string})=>item.media_role==="cover"),gallery=media.filter((item:{media_role:string})=>item.media_role==="gallery");
 const sections=[...(s.service_sections??[])].sort((a:{sort_order:number},b:{sort_order:number})=>a.sort_order-b.sort_order);
 return <main><SiteHeader locale={locale} currentPath={`divisions/${slug}/${unitSlug}/${categorySlug}/${serviceSlug}`}/>
  <section className="page-hero"><div className="section-wrap"><Link className="back-link" href={`/${locale}/divisions/${slug}/${unitSlug}/${categorySlug}`}>← {categoryName}</Link><p className="eyebrow"><span className="eyebrow-line"/>{t.serviceDetailEyebrow} / {divisionName}</p><h1>{serviceName}</h1>{summary&&<p>{summary}</p>}</div></section>
  {cover?<section className="section-wrap service-detail-media"><MediaPlaceholder label={serviceName} detail={""} ratio="wide" imageUrl={cover.url}/></section>:null}
  <section className="section-wrap service-detail-content">
   {description&&<div className="service-detail-intro"><div><p className="eyebrow dark-eyebrow">{t.serviceScope}</p><h2>{serviceName}</h2><p>{description}</p></div></div>}
   {sections.length>0?<div className="capability-panels">{sections.map((section:{id:string;section_key:string;section_type:string;service_section_translations:{locale_code:string;title:string|null;body:string|null}[]},index:number)=>{
    const tr=section.service_section_translations.find(x=>x.locale_code===locale)??section.service_section_translations.find(x=>x.locale_code==="en");
    if(!tr||(!tr.title&&!tr.body))return null;
    return <article className="capability-panel" key={section.id}><p className="eyebrow dark-eyebrow">{String(index+1).padStart(2,"0")} / {section.section_type.replaceAll("_"," ")}</p>{tr.title&&<h2>{tr.title}</h2>}{tr.body&&<p style={{whiteSpace:"pre-line"}}>{tr.body}</p>}</article>;
   })}</div>:null}
   {gallery.length>0?<section className="offerings-section"><div className="offerings-heading"><p className="eyebrow dark-eyebrow">{locale==="fr"?"Galerie":"Gallery"}</p><h2>{serviceName}</h2></div><div className="service-card-grid">{gallery.map((item:{id:string;url:string;service_media_translations:{locale_code:string;alt_text:string|null;caption:string|null}[]},index:number)=>{const tr=item.service_media_translations.find(x=>x.locale_code===locale)??item.service_media_translations.find(x=>x.locale_code==="en");return <figure key={item.id}><MediaPlaceholder label={tr?.alt_text||serviceName} detail={tr?.caption||""} ratio="wide" imageUrl={item.url}/></figure>;})}</div></section>:null}
   <div className="capability-cta"><div><p className="eyebrow">{unitName}</p><h2>{t.contactPrompt}</h2><p>{t.contactPromptText}</p></div><Link className="button button-primary" href={`/${locale}/contact`}>{t.serviceEnquiry} ↗</Link></div>
  </section><SiteFooter locale={locale}/></main>;
}
