"use client";

import { useState,type ChangeEvent,type FormEvent } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { changeMediaStatus,registerMediaAsset } from "@/app/admin/(protected)/[module]/project-actions";
import { attachMediaToService,changeServicePageStatus,removeServiceMedia,removeServiceSection,saveServicePage,saveServiceSection } from "@/app/admin/(protected)/[module]/service-page-actions";

type Translation={locale_code:string;field_name:string;content:string};
type SectionTranslation={locale_code:string;title:string|null;body:string|null};
type SectionType="text"|"image_text"|"feature_grid"|"process"|"faq"|"callout";
type SectionForm={id:string;sectionKey:string;sectionType:SectionType;sortOrder:number;enTitle:string;frTitle:string;enBody:string;frBody:string};
type Section={id:string;section_key:string;section_type:SectionType;sort_order:number;service_section_translations:SectionTranslation[]};
type BusinessUnitRelation={division_id:string;code:string;divisions:{code:string}|{code:string}[]|null};
type CategoryRelation={business_units:BusinessUnitRelation|BusinessUnitRelation[]|null};
type Service={id:string;slug:string;code:string;status:"draft"|"review"|"published"|"archived";category_id:string;categories:CategoryRelation|CategoryRelation[]|null;content_translations:Translation[];service_sections:Section[];service_media:AttachedMedia[]};
type Asset={id:string;division_id:string;object_path:string;original_filename:string;mime_type:string;byte_size:number;status:string};
type AttachedMedia={id:string;media_role:"cover"|"gallery";media_assets:{original_filename:string;status:string;mime_type:string}|{original_filename:string;status:string;mime_type:string}[]|null};
type Props={services:Service[];assets:Asset[];canManageGlobal:boolean};
const get=(rows:Translation[],locale:string,field:string)=>rows.find(x=>x.locale_code===locale&&x.field_name===field)?.content??"";
const getSection=(rows:SectionTranslation[],locale:string)=>rows.find(x=>x.locale_code===locale);
const emptySection:SectionForm={id:"",sectionKey:"",sectionType:"text",sortOrder:0,enTitle:"",frTitle:"",enBody:"",frBody:""};
const formFor=(service?:Service)=>({
  enName:get(service?.content_translations??[],"en","name"),frName:get(service?.content_translations??[],"fr","name"),
  enSummary:get(service?.content_translations??[],"en","summary"),frSummary:get(service?.content_translations??[],"fr","summary"),
  enDescription:get(service?.content_translations??[],"en","description"),frDescription:get(service?.content_translations??[],"fr","description"),
  enSeoTitle:get(service?.content_translations??[],"en","seo_title"),frSeoTitle:get(service?.content_translations??[],"fr","seo_title"),
  enSeoDescription:get(service?.content_translations??[],"en","seo_description"),frSeoDescription:get(service?.content_translations??[],"fr","seo_description")
});

export function ServicePagesWorkspace({services,assets}:Props){
  const router=useRouter(),search=useSearchParams(),fr=search.get("lang")==="fr";
  const [selectedId,setSelectedId]=useState(services[0]?.id??"");
  const selected=services.find(s=>s.id===selectedId)??services[0];
  const selectedCategory=selected?(Array.isArray(selected.categories)?selected.categories[0]:selected.categories):null;
  const selectedUnit=selectedCategory?(Array.isArray(selectedCategory.business_units)?selectedCategory.business_units[0]:selectedCategory.business_units):null;
  const divisionId=selectedUnit?.division_id??"";
  const [form,setForm]=useState(()=>formFor(services[0]));
  const [section,setSection]=useState<SectionForm>(emptySection);
  const [mediaId,setMediaId]=useState("");
  const [mediaRole,setMediaRole]=useState<"cover"|"gallery">("cover");
  const [busy,setBusy]=useState(false),[uploading,setUploading]=useState(false),[message,setMessage]=useState("");
  const t=fr?{
    order:"Ordre d’affichage",title:"Gestion des pages de services",intro:"Contenu bilingue, médias et publication des pages de services.",
    services:"Services",choose:"Sélectionnez un service",content:"Contenu de la page",english:"Anglais",french:"Français",
    name:"Nom du service",summary:"Résumé",description:"Description complète",seoTitle:"Titre SEO",seoDescription:"Description SEO",
    save:"Enregistrer le contenu",workflow:"Publication",publish:"Publier",draft:"Brouillon",review:"Soumettre pour validation",archive:"Archiver",
    sections:"Sections de contenu",key:"Clé de section",type:"Type de section",sectionTitle:"Titre de section",body:"Contenu",saveSection:"Enregistrer la section",newSection:"Nouvelle section",remove:"Supprimer",
    media:"Images et galerie",upload:"Téléverser une image",chooseFile:"Choisir un fichier",role:"Utilisation",cover:"Image de couverture",gallery:"Galerie",attach:"Associer l’image",edit:"Modifier",
    empty:"Aucun service dans votre périmètre.",saved:"Modifications enregistrées.",status:"Statut",loading:"Enregistrement…"
  }:{
    order:"Display order",title:"Service Page Manager",intro:"Manage bilingual service content, media and publication workflows.",
    services:"Services",choose:"Select a service",content:"Page content",english:"English",french:"French",
    name:"Service name",summary:"Summary",description:"Full description",seoTitle:"SEO title",seoDescription:"SEO description",
    save:"Save page content",workflow:"Publishing",publish:"Publish",draft:"Draft",review:"Submit for review",archive:"Archive",
    sections:"Content sections",key:"Section key",type:"Section type",sectionTitle:"Section title",body:"Content",saveSection:"Save section",newSection:"New section",remove:"Remove",
    media:"Images and gallery",upload:"Upload an image",chooseFile:"Choose a file",role:"Usage",cover:"Cover image",gallery:"Gallery",attach:"Attach image",edit:"Edit",
    empty:"No services are available in your access scope.",saved:"Changes saved.",status:"Status",loading:"Saving…"
  };
  function selectService(id:string){
    const service=services.find(x=>x.id===id);if(!service)return;
    setSelectedId(id);setForm(formFor(service));setSection(emptySection);setMessage("");
  }
  async function save(event:FormEvent){event.preventDefault();if(!selected)return;setBusy(true);setMessage("");
    const result=await saveServicePage({id:selected.id,divisionId,...form});setBusy(false);
    setMessage(result.ok?t.saved:result.error);if(result.ok)router.refresh();
  }
  async function changeStatus(status:"draft"|"review"|"published"|"archived"){
    if(!selected)return;
    if(status==="published"&&(!form.enDescription.trim()||!form.frDescription.trim())){
      setMessage(fr?"Ajoutez la description complète en anglais et en français avant la publication.":"Add the full description in both English and French before publishing.");return;
    }
    setBusy(true);setMessage(fr?"Enregistrement du contenu avant publication…":"Saving your latest edits before publishing…");
    const saved=await saveServicePage({id:selected.id,divisionId,...form});
    if(!saved.ok){setBusy(false);setMessage(saved.error);return;}
    const result=await changeServicePageStatus(selected.id,divisionId,status);setBusy(false);
    setMessage(result.ok?(fr?`Statut mis à jour : ${status}`:`Status updated: ${status}`):result.error);if(result.ok)router.refresh();
  }
  async function saveSection(event:FormEvent){
    event.preventDefault();if(!selected)return;setBusy(true);setMessage("");
    const result=await saveServiceSection({...section,serviceId:selected.id,divisionId});setBusy(false);
    setMessage(result.ok?t.saved:result.error);if(result.ok){setSection(emptySection);router.refresh();}
  }
  async function upload(event:ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0];if(!file||!selected)return;
    if(!["image/jpeg","image/png","image/webp","image/avif"].includes(file.type)||file.size>10*1024*1024){setMessage("Use JPEG, PNG, WebP or AVIF under 10 MB.");event.target.value="";return;}
    const supabase=createClient();if(!supabase){setMessage("Supabase is not configured.");return;}
    setUploading(true);setMessage("");
    const safe=file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g,"-").slice(-150)||"image";
    const path=`${divisionId}/${crypto.randomUUID()}-${safe}`;
    const {error}=await supabase.storage.from("nsomex-media").upload(path,file,{contentType:file.type,upsert:false});
    if(error){setUploading(false);setMessage(error.message);event.target.value="";return;}
    const registered=await registerMediaAsset({divisionId,objectPath:path,filename:file.name,mimeType:file.type,byteSize:file.size});
    setUploading(false);event.target.value="";setMessage(registered.ok?"Image uploaded.":registered.error);if(registered.ok)router.refresh();
  }
  async function setAssetStatus(asset:Asset){
    const result=await changeMediaStatus(asset.id,divisionId,asset.status==="published"?"draft":"published");
    setMessage(result.ok?"Media status updated.":result.error);if(result.ok)router.refresh();
  }
  async function attach(){
    if(!selected||!mediaId)return;setBusy(true);setMessage("");
    const result=await attachMediaToService({serviceId:selected.id,divisionId,mediaAssetId:mediaId,role:mediaRole,sortOrder:0});
    setBusy(false);setMessage(result.ok?t.saved:result.error);if(result.ok)router.refresh();
  }
  function editSection(item:Section){
    const en=getSection(item.service_section_translations,"en"),frText=getSection(item.service_section_translations,"fr");
    const validKey=/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.section_key);
    setSection({id:item.id,sectionKey:validKey?item.section_key:`section-${Math.max(1,item.sort_order)}`,sectionType:item.section_type,sortOrder:item.sort_order,enTitle:en?.title??"",frTitle:frText?.title??"",enBody:en?.body??"",frBody:frText?.body??""});
  }
  async function removeMedia(id:string){
    setBusy(true);const result=await removeServiceMedia(id,divisionId);setBusy(false);
    setMessage(result.ok?t.saved:result.error);if(result.ok)router.refresh();
  }
  async function deleteSection(id:string){
    setBusy(true);const result=await removeServiceSection(id,divisionId);setBusy(false);
    setMessage(result.ok?t.saved:result.error);if(result.ok)router.refresh();
  }
  if(!services.length)return <div className="cms-notice">{t.empty}</div>;
  const availableAssets=assets.filter(a=>a.division_id===divisionId&&a.mime_type.startsWith("image/"));
  const attachedMedia=selected?.service_media??[];
  return <div className="cms-projects-workspace">
    <div className="cms-projects-layout">
      <aside className="cms-projects-list"><div className="cms-pages-list-head"><strong>{t.services}</strong><span>{services.length}</span></div>
        {services.map(s=><button type="button" key={s.id} className={s.id===selected?.id?"cms-page-item is-selected":"cms-page-item"} onClick={()=>selectService(s.id)}>
          <strong>{get(s.content_translations,fr?"fr":"en","name")||s.slug}</strong><span>{s.slug} · {s.status}</span>
        </button>)}
      </aside>
      {selected&&<section className="cms-pages-editor">
        <div className="cms-pages-editor-heading"><div><p className="cms-eyebrow">SERVICE PAGE</p><h2>{get(selected.content_translations,fr?"fr":"en","name")||selected.slug}</h2></div><span className="cms-module-tag">{selected.status}</span></div>
        <form className="cms-editor-form" onSubmit={save}>
          <div className="cms-editor-language"><strong>{t.english}</strong><span>EN</span></div>
          <label>{t.name}<input required maxLength={200} value={form.enName} onChange={e=>setForm({...form,enName:e.target.value})}/></label>
          <label>{t.summary}<textarea rows={3} maxLength={600} value={form.enSummary} onChange={e=>setForm({...form,enSummary:e.target.value})}/></label>
          <label>{t.description}<textarea rows={12} maxLength={10000} value={form.enDescription} onChange={e=>setForm({...form,enDescription:e.target.value})}/></label>
          <label>{t.seoTitle}<input maxLength={200} value={form.enSeoTitle} onChange={e=>setForm({...form,enSeoTitle:e.target.value})}/></label>
          <label>{t.seoDescription}<textarea rows={3} maxLength={320} value={form.enSeoDescription} onChange={e=>setForm({...form,enSeoDescription:e.target.value})}/></label>
          <div className="cms-editor-language"><strong>{t.french}</strong><span>FR</span></div>
          <label>{t.name}<input required maxLength={200} value={form.frName} onChange={e=>setForm({...form,frName:e.target.value})}/></label>
          <label>{t.summary}<textarea rows={3} maxLength={600} value={form.frSummary} onChange={e=>setForm({...form,frSummary:e.target.value})}/></label>
          <label>{t.description}<textarea rows={12} maxLength={10000} value={form.frDescription} onChange={e=>setForm({...form,frDescription:e.target.value})}/></label>
          <label>{t.seoTitle}<input maxLength={200} value={form.frSeoTitle} onChange={e=>setForm({...form,frSeoTitle:e.target.value})}/></label>
          <label>{t.seoDescription}<textarea rows={3} maxLength={320} value={form.frSeoDescription} onChange={e=>setForm({...form,frSeoDescription:e.target.value})}/></label>
          <button className="cms-primary-button" disabled={busy} type="submit">{busy?t.loading:t.save}</button>
        </form>
        <div className="cms-project-workflow"><strong>{t.workflow}</strong><div className="cms-project-actions">
          <button type="button" disabled={busy} onClick={()=>changeStatus("draft")}>{t.draft}</button>
          <button type="button" disabled={busy} onClick={()=>changeStatus("review")}>{t.review}</button>
          <button type="button" disabled={busy} onClick={()=>changeStatus("published")}>{t.publish}</button>
          <button type="button" disabled={busy} onClick={()=>changeStatus("archived")}>{t.archive}</button>
        </div></div>
        <section className="cms-media-panel"><div className="cms-pages-editor-heading"><h2>{t.sections}</h2></div>
          {selected.service_sections.map(s=><div className="cms-media-row" key={s.id}><div><strong>{getSection(s.service_section_translations,fr?"fr":"en")?.title||s.section_key}</strong><span>{s.section_type} · {s.section_key}</span></div><div><button type="button" onClick={()=>editSection(s)} disabled={busy}>{t.edit}</button><button type="button" onClick={()=>deleteSection(s.id)} disabled={busy}>{t.remove}</button></div></div>)}
          <form className="cms-editor-form" onSubmit={saveSection}>
            <label>{t.key}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={section.sectionKey} onChange={e=>setSection({...section,sectionKey:e.target.value})}/></label>
            <label>{t.order}<input type="number" min={0} max={9999} value={section.sortOrder} onChange={e=>setSection({...section,sortOrder:Number(e.target.value)})}/></label>
            <label>{t.type}<select value={section.sectionType} onChange={e=>setSection({...section,sectionType:e.target.value as typeof section.sectionType})}>
              {["text","image_text","feature_grid","process","faq","callout"].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
            <div className="cms-editor-language"><strong>{t.english}</strong><span>EN</span></div>
            <label>{t.sectionTitle}<input value={section.enTitle} onChange={e=>setSection({...section,enTitle:e.target.value})}/></label>
            <label>{t.body}<textarea rows={6} value={section.enBody} onChange={e=>setSection({...section,enBody:e.target.value})}/></label>
            <div className="cms-editor-language"><strong>{t.french}</strong><span>FR</span></div>
            <label>{t.sectionTitle}<input value={section.frTitle} onChange={e=>setSection({...section,frTitle:e.target.value})}/></label>
            <label>{t.body}<textarea rows={6} value={section.frBody} onChange={e=>setSection({...section,frBody:e.target.value})}/></label>
            <button className="cms-primary-button" disabled={busy} type="submit">{t.saveSection}</button>
          </form>
        </section>
        <section className="cms-media-panel"><div className="cms-pages-editor-heading"><h2>{t.media}</h2></div>
          <div className="cms-media-list">{attachedMedia.map(link=>{const asset=Array.isArray(link.media_assets)?link.media_assets[0]:link.media_assets;return <div className="cms-media-row" key={link.id}><div><strong>{asset?.original_filename??"Media asset"}</strong><span>{link.media_role} · {asset?.mime_type??""} · {asset?.status??""}</span></div><button type="button" disabled={busy} onClick={()=>removeMedia(link.id)}>{t.remove}</button></div>;})}</div>
          <label>{t.upload}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} disabled={uploading}/></label>
          <div className="cms-media-list">{availableAssets.map(asset=><div className="cms-media-row" key={asset.id}><div><strong>{asset.original_filename}</strong><span>{asset.mime_type} · {asset.status}</span></div><button type="button" onClick={()=>setAssetStatus(asset)} disabled={busy}>{asset.status==="published"?"Return to draft":"Publish media"}</button></div>)}</div>
          <div className="cms-editor-two"><label>{t.chooseFile}<select value={mediaId} onChange={e=>setMediaId(e.target.value)}><option value="">—</option>{availableAssets.map(a=><option key={a.id} value={a.id}>{a.original_filename}</option>)}</select></label>
            <label>{t.role}<select value={mediaRole} onChange={e=>setMediaRole(e.target.value as typeof mediaRole)}><option value="cover">{t.cover}</option><option value="gallery">{t.gallery}</option></select></label>
            <button type="button" className="cms-primary-button" disabled={busy||!mediaId} onClick={attach}>{t.attach}</button></div>
        </section>
        {message&&<p className="cms-project-message" role="status">{message}</p>}
      </section>}
    </div>
  </div>;
}
