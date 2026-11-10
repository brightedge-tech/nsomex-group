"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { attachMediaToProject, changeMediaStatus, changeProjectStatus, registerMediaAsset, saveProject } from "@/app/admin/(protected)/[module]/project-actions";

type Translation={locale_code:string;title:string;summary:string|null;description:string|null};
type Division={id:string;code:string};
type BusinessUnit={id:string;division_id:string;code:string};
type Service={id:string;slug:string;category_id:string;categories:{business_unit_id:string}|{business_unit_id:string}[]|null};
type Project={
  id:string;division_id:string;business_unit_id:string|null;service_id:string|null;slug:string;project_type:string;status:"draft"|"review"|"published"|"archived";
  location_name:string|null;city:string|null;region:string|null;country_code:string|null;started_on:string|null;completed_on:string|null;
  is_featured:boolean;sort_order:number;project_translations:Translation[];
};
type MediaAsset={id:string;division_id:string;object_path:string;original_filename:string;mime_type:string;byte_size:number;status:"draft"|"published"|"archived";created_at:string};
type Props={projects:Project[];divisions:Division[];businessUnits:BusinessUnit[];services:Service[];mediaAssets:MediaAsset[];canManageGlobal:boolean};
const blank={
  id:undefined as string|undefined,divisionId:"",businessUnitId:"",serviceId:"",slug:"",projectType:"general",locationName:"",city:"",region:"",countryCode:"",
  startedOn:"",completedOn:"",isFeatured:false,sortOrder:0,enTitle:"",frTitle:"",enSummary:"",frSummary:"",enDescription:"",frDescription:"",
};
function tr(items:Translation[],locale:string){return items.find(item=>item.locale_code===locale);}

export function ProjectsMediaWorkspace({projects,divisions,businessUnits,services,mediaAssets,canManageGlobal}:Props){
  const router=useRouter();
  const search=useSearchParams();
  const fr=search.get("lang")==="fr";
  const t=fr?{
    projects:"Projets",newProject:"＋ Nouveau projet",edit:"Modifier le projet",create:"Créer un projet",none:"Aucun projet. Ajoutez un projet vérifié lorsque vous êtes prêt.",
    division:"Division",unit:"Unité commerciale (facultatif)",service:"Service associé (facultatif)",slug:"Identifiant URL",type:"Type de projet",location:"Lieu",city:"Ville",region:"Région",country:"Code pays (ISO)",start:"Date de début",end:"Date d’achèvement",
    featured:"Mettre en avant",order:"Ordre d’affichage",en:"Anglais",fr:"Français",title:"Titre",summary:"Résumé",description:"Description",save:"Enregistrer le projet",
    workflow:"Publication",draft:"Brouillon",review:"Soumettre à validation",published:"Publié",archived:"Archivé",publish:"Publier",archive:"Archiver",reset:"Brouillon",
    media:"Bibliothèque multimédia",upload:"Téléverser un fichier",uploadHint:"Images, vidéo MP4 ou PDF · 50 Mo maximum",file:"Choisir un fichier",uploading:"Téléversement…",noMedia:"Aucun média téléversé.",
    attach:"Associer au projet sélectionné",chooseProject:"Sélectionnez d’abord un projet enregistré",chooseMedia:"Choisir un média",role:"Utilisation",cover:"Couverture",gallery:"Galerie",document:"Document",video:"Vidéo",add:"Associer le média",
    mediaStatus:"Statut du média",makePublic:"Publier le média",makeDraft:"Remettre en brouillon",saveSuccess:"Projet enregistré en anglais et en français.",uploadSuccess:"Fichier ajouté à la bibliothèque.",attachSuccess:"Média associé au projet.",error:"Une erreur est survenue.",
    groupWide:"Toutes les divisions",selectDivision:"Sélectionner une division",
  }:{
    projects:"Projects",newProject:"＋ New project",edit:"Edit project",create:"Create a project",none:"No projects yet. Add a verified project when you are ready.",
    division:"Division",unit:"Business unit (optional)",service:"Related service (optional)",slug:"URL slug",type:"Project type",location:"Location name",city:"City",region:"Region",country:"Country code (ISO)",start:"Start date",end:"Completion date",
    featured:"Feature this project",order:"Display order",en:"English",fr:"French",title:"Title",summary:"Summary",description:"Description",save:"Save project",
    workflow:"Publishing",draft:"Draft",review:"Submit for review",published:"Published",archived:"Archived",publish:"Publish",archive:"Archive",reset:"Return to draft",
    media:"Media library",upload:"Upload a file",uploadHint:"Images, MP4 video or PDF · 50 MB maximum",file:"Choose file",uploading:"Uploading…",noMedia:"No media uploaded yet.",
    attach:"Attach to selected project",chooseProject:"Save or select a project first",chooseMedia:"Choose media",role:"Usage",cover:"Cover",gallery:"Gallery",document:"Document",video:"Video",add:"Attach media",
    mediaStatus:"Media status",makePublic:"Publish media",makeDraft:"Return to draft",saveSuccess:"Project saved in English and French.",uploadSuccess:"File added to the library.",attachSuccess:"Media attached to project.",error:"Something went wrong.",
    groupWide:"All divisions",selectDivision:"Select a division",
  };
  const [form,setForm]=useState({...blank,divisionId:divisions[0]?.id??""});
  const [uploadDivision,setUploadDivision]=useState(divisions[0]?.id??"");
  const [mediaId,setMediaId]=useState("");
  const [mediaRole,setMediaRole]=useState<"cover"|"gallery"|"document"|"video">("gallery");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const [uploading,setUploading]=useState(false);
  const selected=useMemo(()=>projects.find(p=>p.id===form.id),[projects,form.id]);
  const units=businessUnits.filter(unit=>unit.division_id===form.divisionId);
  const serviceOptions=services.filter(service=>{const category=Array.isArray(service.categories)?service.categories[0]:service.categories;return Boolean(category&&category.business_unit_id===form.businessUnitId);});
  const availableMedia=mediaAssets.filter(asset=>asset.division_id===form.divisionId);

  function editProject(project:Project){
    const en=tr(project.project_translations,"en"),fr=tr(project.project_translations,"fr");
    setForm({
      id:project.id,divisionId:project.division_id,businessUnitId:project.business_unit_id??"",serviceId:project.service_id??"",slug:project.slug,projectType:project.project_type,
      locationName:project.location_name??"",city:project.city??"",region:project.region??"",countryCode:project.country_code??"",
      startedOn:project.started_on??"",completedOn:project.completed_on??"",isFeatured:project.is_featured,sortOrder:project.sort_order,
      enTitle:en?.title??"",frTitle:fr?.title??"",enSummary:en?.summary??"",frSummary:fr?.summary??"",enDescription:en?.description??"",frDescription:fr?.description??"",
    });
    setMessage("");
  }
  function newProject(){
    setForm({...blank,divisionId:canManageGlobal?(divisions[0]?.id??""):(divisions[0]?.id??"")});
    setMessage("");
  }
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setMessage("");
    const result=await saveProject(form);setBusy(false);
    if(!result.ok){setMessage(result.error);return;}
    setForm(current=>({...current,id:result.id}));setMessage(t.saveSuccess);router.refresh();
  }
  async function status(next:"draft"|"review"|"published"|"archived"){
    if(!form.id)return;
    setBusy(true);setMessage("");
    const result=await changeProjectStatus(form.id,form.divisionId,next);setBusy(false);
    setMessage(result.ok?(`${t.workflow}: ${next}`):result.error);if(result.ok)router.refresh();
  }
  async function upload(event:ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0];if(!file)return;
    const allowed=["image/jpeg","image/png","image/webp","image/avif","video/mp4","application/pdf"];
    if(!uploadDivision){setMessage(t.selectDivision);return;}
    if(!allowed.includes(file.type)||file.size>50*1024*1024){setMessage("Choose JPEG, PNG, WebP, AVIF, MP4 or PDF under 50 MB.");event.target.value="";return;}
    const supabase=createClient();if(!supabase){setMessage("Supabase is not configured.");return;}
    setUploading(true);setMessage("");
    const safeName=file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g,"-").replace(/^-+|-+$/g,"").slice(-180)||"upload";
    const path=`${uploadDivision}/${crypto.randomUUID()}-${safeName}`;
    const {error:uploadError}=await supabase.storage.from("nsomex-media").upload(path,file,{contentType:file.type,upsert:false});
    if(uploadError){setUploading(false);setMessage(uploadError.message);event.target.value="";return;}
    const result=await registerMediaAsset({divisionId:uploadDivision,objectPath:path,filename:file.name,mimeType:file.type,byteSize:file.size});
    setUploading(false);event.target.value="";
    setMessage(result.ok?t.uploadSuccess:result.error);if(result.ok)router.refresh();
  }
  async function attach(){
    if(!form.id||!mediaId){setMessage(t.chooseProject);return;}
    setBusy(true);setMessage("");
    const result=await attachMediaToProject({projectId:form.id,divisionId:form.divisionId,mediaAssetId:mediaId,role:mediaRole});
    setBusy(false);setMessage(result.ok?t.attachSuccess:result.error);if(result.ok)router.refresh();
  }
  async function mediaStatus(asset:MediaAsset,next:"draft"|"published"){
    setBusy(true);setMessage("");
    const result=await changeMediaStatus(asset.id,asset.division_id,next);setBusy(false);
    setMessage(result.ok?t.mediaStatus+": "+next:result.error);if(result.ok)router.refresh();
  }

  return <div className="cms-projects-workspace">
    <div className="cms-projects-layout">
      <aside className="cms-projects-list">
        <div className="cms-pages-list-head"><strong>{t.projects}</strong><span>{projects.length}</span></div>
        <button type="button" className="cms-pages-new" onClick={newProject}>{t.newProject}</button>
        {!projects.length&&<p className="cms-pages-empty">{t.none}</p>}
        {projects.map(project=><button type="button" key={project.id} className={project.id===form.id?"cms-page-item is-selected":"cms-page-item"} onClick={()=>editProject(project)}>
          <strong>{tr(project.project_translations,fr?"fr":"en")?.title??project.slug}</strong><span>{project.slug} · {project.status}</span>
        </button>)}
      </aside>
      <section className="cms-pages-editor">
        <div className="cms-pages-editor-heading"><div><p className="cms-eyebrow">PROJECT PORTFOLIO</p><h2>{form.id?t.edit:t.create}</h2></div>{selected&&<span className="cms-module-tag">{selected.status}</span>}</div>
        <form className="cms-editor-form" onSubmit={submit}>
          <div className="cms-editor-two">
            <label>{t.division}<select required value={form.divisionId} disabled={!canManageGlobal&&divisions.length===1} onChange={e=>setForm({...form,divisionId:e.target.value,businessUnitId:""})}>
              {divisions.map(d=><option key={d.id} value={d.id}>{d.code}</option>)}
            </select></label>
            <label>{t.unit}<select value={form.businessUnitId} onChange={e=>setForm({...form,businessUnitId:e.target.value,serviceId:""})}><option value="">—</option>{units.map(u=><option key={u.id} value={u.id}>{u.code}</option>)}</select></label>
          </div>
          <div className="cms-editor-two">
            <label>{t.slug}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="project-name"/></label>
            <label>{t.type}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.projectType} onChange={e=>setForm({...form,projectType:e.target.value})}/></label>
          </div>
          <div className="cms-editor-language"><strong>{t.en}</strong><span>EN</span></div>
          <label>{t.title}<input required maxLength={200} value={form.enTitle} onChange={e=>setForm({...form,enTitle:e.target.value})}/></label>
          <label>{t.summary}<textarea rows={2} maxLength={600} value={form.enSummary} onChange={e=>setForm({...form,enSummary:e.target.value})}/></label>
          <label>{t.description}<textarea rows={5} maxLength={12000} value={form.enDescription} onChange={e=>setForm({...form,enDescription:e.target.value})}/></label>
          <div className="cms-editor-language"><strong>{t.fr}</strong><span>FR</span></div>
          <label>{t.title}<input required maxLength={200} value={form.frTitle} onChange={e=>setForm({...form,frTitle:e.target.value})}/></label>
          <label>{t.summary}<textarea rows={2} maxLength={600} value={form.frSummary} onChange={e=>setForm({...form,frSummary:e.target.value})}/></label>
          <label>{t.description}<textarea rows={5} maxLength={12000} value={form.frDescription} onChange={e=>setForm({...form,frDescription:e.target.value})}/></label>
          <div className="cms-editor-two">
            <label>{t.location}<input maxLength={200} value={form.locationName} onChange={e=>setForm({...form,locationName:e.target.value})}/></label>
            <label>{t.city}<input maxLength={120} value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></label>
            <label>{t.region}<input maxLength={120} value={form.region} onChange={e=>setForm({...form,region:e.target.value})}/></label>
            <label>{t.country}<input maxLength={2} value={form.countryCode} onChange={e=>setForm({...form,countryCode:e.target.value.toUpperCase()})}/></label>
            <label>{t.start}<input type="date" value={form.startedOn} onChange={e=>setForm({...form,startedOn:e.target.value})}/></label>
            <label>{t.end}<input type="date" value={form.completedOn} onChange={e=>setForm({...form,completedOn:e.target.value})}/></label>
            <label>{t.order}<input type="number" min={0} max={9999} value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:Number(e.target.value)})}/></label>
          </div>
          <label className="cms-inline-check"><input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})}/>{t.featured}</label>
          <button className="cms-primary-button" disabled={busy} type="submit">{busy?"…":t.save}</button>
        </form>
        {form.id&&<div className="cms-project-workflow"><strong>{t.workflow}</strong><div className="cms-project-actions">
          <button type="button" disabled={busy} onClick={()=>status("draft")}>{t.reset}</button>
          <button type="button" disabled={busy} onClick={()=>status("review")}>{t.review}</button>
          <button type="button" disabled={busy} onClick={()=>status("published")}>{t.publish}</button>
          <button type="button" disabled={busy} onClick={()=>status("archived")}>{t.archive}</button>
        </div></div>}
        {message&&<p className="cms-project-message" role="status">{message}</p>}
      </section>
    </div>

    <section className="cms-media-panel">
      <div className="cms-pages-editor-heading"><div><p className="cms-eyebrow">PRIVATE STORAGE</p><h2>{t.media}</h2></div><span className="cms-module-tag">{mediaAssets.length}</span></div>
      <div className="cms-editor-two cms-media-upload">
        <label>{t.division}<select value={uploadDivision} onChange={e=>setUploadDivision(e.target.value)}>{divisions.map(d=><option key={d.id} value={d.id}>{d.code}</option>)}</select></label>
        <label>{t.file}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,application/pdf" onChange={upload} disabled={uploading}/></label>
      </div>
      <p className="cms-media-hint">{uploading?t.uploading:t.uploadHint}</p>
      <div className="cms-media-attach">
        <strong>{t.attach}</strong>
        {!form.id?<p>{t.chooseProject}</p>:<div className="cms-editor-two">
          <label>{t.chooseMedia}<select value={mediaId} onChange={e=>setMediaId(e.target.value)}><option value="">—</option>{availableMedia.map(asset=><option key={asset.id} value={asset.id}>{asset.original_filename} · {asset.status}</option>)}</select></label>
          <label>{t.role}<select value={mediaRole} onChange={e=>setMediaRole(e.target.value as typeof mediaRole)}><option value="cover">{t.cover}</option><option value="gallery">{t.gallery}</option><option value="document">{t.document}</option><option value="video">{t.video}</option></select></label>
          <button type="button" className="cms-primary-button" disabled={busy||!mediaId} onClick={attach}>{t.add}</button>
        </div>}
      </div>
      {!mediaAssets.length?<p className="cms-pages-empty">{t.noMedia}</p>:<div className="cms-media-list">{mediaAssets.map(asset=><div className="cms-media-row" key={asset.id}>
        <div><strong>{asset.original_filename}</strong><span>{asset.mime_type} · {(asset.byte_size/1024/1024).toFixed(1)} MB · {asset.status}</span></div>
        <button type="button" disabled={busy} onClick={()=>mediaStatus(asset,asset.status==="published"?"draft":"published")}>{asset.status==="published"?t.makeDraft:t.makePublic}</button>
      </div>)}</div>}
    </section>
  </div>;
}
