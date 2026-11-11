"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter, useSearchParams } from "next/navigation";
import { changePageStatus, changeSectionStatus, savePage, saveSection } from "@/app/admin/(protected)/[module]/actions";

type Translation = { locale_code: string; title?: string; summary?: string | null; content?: Record<string, unknown> };
type Section = {
  id: string; section_key: string; section_type: string; status: "draft" | "published" | "archived";
  sort_order: number; page_section_translations: Translation[];
};
type Page = {
  id: string; slug: string; template_key: string; status: "draft" | "review" | "published" | "archived";
  division_id: string | null; show_in_navigation: boolean; navigation_order: number; cover_image_path: string | null;
  page_translations: Translation[]; page_sections: Section[];
};
type Division = { id: string; code: string };
type Props = { pages: Page[]; divisions: Division[]; canManageGlobal: boolean };

const emptyPage = {
  id: undefined as string | undefined, slug: "", templateKey: "standard", divisionId: "",
  showInNavigation: false, navigationOrder: 0, coverImagePath: "", enTitle: "", enSummary: "", frTitle: "", frSummary: "",
};
const emptySection = {
  id: undefined as string | undefined, pageId: "", sectionKey: "", sectionType: "text",
  sortOrder: 0, imagePath: "", imageAlt: "", enContent: '{\n  "heading": "",\n  "body": ""\n}', frContent: '{\n  "heading": "",\n  "body": ""\n}',
};

function translation<T extends Translation>(items: T[] | undefined, locale: string): T | undefined {
  return items?.find(item => item.locale_code === locale);
}

export function PagesWorkspace({ pages, divisions, canManageGlobal }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get("lang") === "fr" ? "fr" : "en";
  const t = locale === "fr" ? {
    websitePages:"Pages du site", createPage:"＋ Créer une page", noPages:"Aucune page pour le moment. Créez la première lorsque vous êtes prêt.",
    editPage:"Modifier la page", newPage:"Créer une page", contentEditor:"ÉDITEUR DE CONTENU", slug:"Identifiant URL", template:"Clé du modèle",
    ownership:"Responsable du contenu", groupWide:"Page du groupe (super administrateur)", english:"Anglais", french:"Français",
    pageTitle:"Titre de la page (anglais)", summary:"Résumé court (anglais)", pageTitleFr:"Titre de la page (français)", summaryFr:"Résumé (français)",
    navigationOrder:"Ordre de navigation", showNavigation:"Afficher dans la navigation du site", savePage:"Enregistrer la page",
    saving:"Enregistrement…", reusable:"CONTENU RÉUTILISABLE", sections:"Sections de la page", sectionCount:"sections",
    editSection:"Modifier la section", addSection:"Ajouter une section", sectionKey:"Clé de section", sectionType:"Type de section",
    order:"Ordre", englishJson:"Contenu de section (anglais)", frenchJson:"Contenu de section (français)", saveSection:"Enregistrer la section",
    cancelSection:"Annuler la modification", workflow:"Cycle de publication", draft:"Brouillon", review:"Soumettre à la validation",
    publish:"Publier", archive:"Archiver", pageSaved:"Page enregistrée. Les deux versions linguistiques sont stockées.",
    sectionSaved:"Section enregistrée en anglais et en français.", pageStatus:"Statut de la page modifié :", sectionStatus:"Statut de la section modifié :",
  } : {
    websitePages:"Website pages", createPage:"＋ Create page", noPages:"No pages yet. Create the first page when you are ready.",
    editPage:"Edit page", newPage:"Create a page", contentEditor:"CONTENT EDITOR", slug:"URL slug", template:"Template key",
    ownership:"Content ownership", groupWide:"Group-wide page (super admin)", english:"English", french:"Français",
    pageTitle:"Page title (English)", summary:"Short summary (English)", pageTitleFr:"Page title (French)", summaryFr:"Summary (French)",
    navigationOrder:"Navigation order", showNavigation:"Show in website navigation", savePage:"Save page",
    saving:"Saving…", reusable:"REUSABLE CONTENT", sections:"Page sections", sectionCount:"sections",
    editSection:"Edit section", addSection:"Add a section", sectionKey:"Section key", sectionType:"Section type",
    order:"Order", englishJson:"English section content", frenchJson:"French section content", saveSection:"Save section",
    cancelSection:"Cancel section edit", workflow:"Page workflow", draft:"Save as draft", review:"Submit for review",
    publish:"Publish page", archive:"Archive", pageSaved:"Page saved. Both language versions are stored.",
    sectionSaved:"Section saved in English and French.", pageStatus:"Page status changed to", sectionStatus:"Section status changed to",
  };
  const [pageForm, setPageForm] = useState({ ...emptyPage, divisionId: canManageGlobal ? "" : divisions[0]?.id ?? "" });
  const [sectionForm, setSectionForm] = useState(emptySection);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const supabase = createClient();
  const selectedPage = useMemo(() => pages.find(page => page.id === pageForm.id), [pages, pageForm.id]);
  const sections = selectedPage?.page_sections ?? [];

  function selectPage(page: Page) {
    const en = translation(page.page_translations, "en");
    const fr = translation(page.page_translations, "fr");
    setPageForm({
      id: page.id, slug: page.slug, templateKey: page.template_key, divisionId: page.division_id ?? "",
      showInNavigation: page.show_in_navigation, navigationOrder: page.navigation_order, coverImagePath: page.cover_image_path ?? "",
      enTitle: en?.title ?? "", enSummary: en?.summary ?? "",
      frTitle: fr?.title ?? "", frSummary: fr?.summary ?? "",
    });
    setSectionForm({ ...emptySection, pageId: page.id });
    setMessage("");
  }

  async function submitPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const result = await savePage({ ...pageForm, divisionId: pageForm.divisionId || null });
    setBusy(false);
    if (!result.ok) { setMessage(result.error); return; }
    setPageForm(current => ({ ...current, id: result.id }));
    setMessage(t.pageSaved);
    router.refresh();
  }

  async function uploadPageCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    if (!pageForm.id) { setMessage(locale === "fr" ? "Enregistrez d’abord la page avant d’ajouter une image." : "Save the page first, then upload its cover image."); event.target.value = ""; return; }
    if (!supabase) { setMessage("Supabase is not configured."); return; }
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) || file.size < 1 || file.size > 10 * 1024 * 1024) { setMessage(locale === "fr" ? "Choisissez une image JPEG, PNG, WebP ou AVIF de 10 Mo maximum." : "Choose a JPEG, PNG, WebP or AVIF image no larger than 10 MB."); event.target.value = ""; return; }
    setBusy(true); setMessage("");
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `pages/${pageForm.id}/cover/${crypto.randomUUID()}.${extension}`, oldPath = pageForm.coverImagePath;
    const { error: uploadError } = await supabase.storage.from("nsomex-website").upload(path, file, { contentType: file.type, upsert: false, cacheControl: "31536000" });
    if (uploadError) { setBusy(false); setMessage(uploadError.message); event.target.value = ""; return; }
    const saved = await savePage({ ...pageForm, divisionId: pageForm.divisionId || null, coverImagePath: path });
    if (!saved.ok) { await supabase.storage.from("nsomex-website").remove([path]); setBusy(false); setMessage(saved.error); event.target.value = ""; return; }
    if (oldPath && oldPath !== path) await supabase.storage.from("nsomex-website").remove([oldPath]);
    setPageForm(current => ({ ...current, id: saved.id, coverImagePath: path })); setBusy(false);
    setMessage(locale === "fr" ? "Image de couverture enregistrée. Republiez la page pour afficher la modification." : "Cover image saved. Republish the page to make the change public.");
    router.refresh(); event.target.value = "";
  }

  async function uploadSectionImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    if (!pageForm.id) { setMessage(locale === "fr" ? "Enregistrez d’abord la page." : "Save the page before uploading section images."); event.target.value = ""; return; }
    if (!supabase) { setMessage("Supabase is not configured."); return; }
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) || file.size < 1 || file.size > 10 * 1024 * 1024) { setMessage(locale === "fr" ? "Choisissez une image JPEG, PNG, WebP ou AVIF de 10 Mo maximum." : "Choose a JPEG, PNG, WebP or AVIF image no larger than 10 MB."); event.target.value = ""; return; }
    setBusy(true); setMessage("");
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `pages/${pageForm.id}/sections/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("nsomex-website").upload(path, file, { contentType: file.type, upsert: false, cacheControl: "31536000" });
    setBusy(false); if (error) setMessage(error.message);
    else { setSectionForm(current => ({ ...current, imagePath: path })); setMessage(locale === "fr" ? "Image téléversée. Enregistrez la section pour appliquer la modification." : "Image uploaded. Save the section to apply the change."); }
    event.target.value = "";
  }

  async function updateStatus(status: "draft" | "review" | "published" | "archived") {
    if (!pageForm.id) return;
    setBusy(true); setMessage(locale==="fr"?"Enregistrement des modifications avant publication…":"Saving your latest page edits before publishing…");
    const savedPage = await savePage({ ...pageForm, divisionId: pageForm.divisionId || null });
    if (!savedPage.ok) { setBusy(false); setMessage(savedPage.error); return; }
    if (sectionForm.sectionKey.trim()) {
      const savedSection = await saveSection({ ...sectionForm, pageId: pageForm.id, enContent: mergeSectionImage(sectionForm.enContent, sectionForm.imagePath, sectionForm.imageAlt), frContent: mergeSectionImage(sectionForm.frContent, sectionForm.imagePath, sectionForm.imageAlt) });
      if (!savedSection.ok) { setBusy(false); setMessage(savedSection.error); return; }
    }
    const result = await changePageStatus(pageForm.id, status);
    setBusy(false);
    setMessage(result.ok ? `${t.pageStatus} ${status}.` : result.error);
    if (result.ok) router.refresh();
  }

  async function submitSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pageForm.id) return;
    setBusy(true); setMessage("");
    const result = await saveSection({ ...sectionForm, pageId: pageForm.id, enContent: mergeSectionImage(sectionForm.enContent, sectionForm.imagePath, sectionForm.imageAlt), frContent: mergeSectionImage(sectionForm.frContent, sectionForm.imagePath, sectionForm.imageAlt) });
    setBusy(false);
    setMessage(result.ok ? t.sectionSaved : result.error);
    if (result.ok) {
      setSectionForm({ ...emptySection, pageId: pageForm.id });
      router.refresh();
    }
  }

  async function updateSectionStatus(id: string, status: "draft" | "published" | "archived") {
    setBusy(true); setMessage("");
    const result = await changeSectionStatus(id, status);
    setBusy(false);
    setMessage(result.ok ? `${t.sectionStatus} ${status}.` : result.error);
    if (result.ok) router.refresh();
  }

  function editSection(section: Section) {
    const en = translation(section.page_section_translations, "en")?.content ?? {};
    const fr = translation(section.page_section_translations, "fr")?.content ?? {};
    setSectionForm({
      id: section.id, pageId: pageForm.id ?? "", sectionKey: section.section_key,
      sectionType: section.section_type, sortOrder: section.sort_order,
      imagePath: typeof en.imagePath === "string" ? en.imagePath : typeof fr.imagePath === "string" ? fr.imagePath : "",
      imageAlt: typeof en.imageAlt === "string" ? en.imageAlt : typeof fr.imageAlt === "string" ? fr.imageAlt : "",
      enContent: JSON.stringify(en, null, 2), frContent: JSON.stringify(fr, null, 2),
    });
  }

  return <div className="cms-pages-workspace">
    <div className="cms-pages-grid">
      <aside className="cms-pages-list">
        <div className="cms-pages-list-head"><strong>{t.websitePages}</strong><span>{pages.length}</span></div>
        <button type="button" className="cms-pages-new" onClick={() => { setPageForm({ ...emptyPage, divisionId: canManageGlobal ? "" : divisions[0]?.id ?? "" }); setSectionForm(emptySection); setMessage(""); }}>{t.createPage}</button>
        {pages.length === 0 && <p className="cms-pages-empty">{t.noPages}</p>}
        {pages.map(page => {
          const en = translation(page.page_translations, "en");
          return <button type="button" key={page.id} className={page.id === pageForm.id ? "cms-page-item is-selected" : "cms-page-item"} onClick={() => selectPage(page)}>
            <strong>{en?.title || page.slug}</strong>
            <span>/{page.slug} · {page.status}</span>
          </button>;
        })}
      </aside>

      <section className="cms-pages-editor">
        <div className="cms-pages-editor-heading">
          <div><p className="cms-eyebrow">{t.contentEditor}</p><h2>{pageForm.id ? t.editPage : t.newPage}</h2></div>
          {selectedPage && <span className="cms-module-tag">{selectedPage.status}</span>}
        </div>
        <form onSubmit={submitPage} className="cms-editor-form">
          <div className="cms-editor-two">
            <label>{t.slug}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={pageForm.slug} onChange={e=>setPageForm({...pageForm,slug:e.target.value})} placeholder="about-us" /></label>
            <label>{t.template}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={pageForm.templateKey} onChange={e=>setPageForm({...pageForm,templateKey:e.target.value})} /></label>
          </div>
          <label>{t.ownership}
            <select value={pageForm.divisionId} onChange={e=>setPageForm({...pageForm,divisionId:e.target.value})}>
              {canManageGlobal && <option value="">{t.groupWide}</option>}
              {divisions.map(division=><option key={division.id} value={division.id}>{division.code.replaceAll("-"," ")}</option>)}
            </select>
          </label>
          <div className="cms-editor-language"><strong>{t.english}</strong><span>EN</span></div>
          <label>{t.pageTitle}<input required maxLength={200} value={pageForm.enTitle} onChange={e=>setPageForm({...pageForm,enTitle:e.target.value})} /></label>
          <label>{t.summary}<textarea rows={5} maxLength={600} value={pageForm.enSummary} onChange={e=>setPageForm({...pageForm,enSummary:e.target.value})} /></label>
          <div className="cms-editor-language"><strong>{t.french}</strong><span>FR</span></div>
          <label>{t.pageTitleFr}<input required maxLength={200} value={pageForm.frTitle} onChange={e=>setPageForm({...pageForm,frTitle:e.target.value})} /></label>
          <label>{t.summaryFr}<textarea rows={5} maxLength={600} value={pageForm.frSummary} onChange={e=>setPageForm({...pageForm,frSummary:e.target.value})} /></label>
          <div className="cms-page-image-field">
            <label>{locale === "fr" ? "Image de couverture de la page" : "Page cover image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadPageCover} disabled={busy || !pageForm.id} /></label>
            {pageForm.coverImagePath && supabase && <div className="cms-page-image-preview"><img src={supabase.storage.from("nsomex-website").getPublicUrl(pageForm.coverImagePath).data.publicUrl} alt={locale === "fr" ? "Aperçu de la couverture" : "Cover image preview"} /><span>{locale === "fr" ? "Image actuelle" : "Current image"}</span></div>}
            <p>{locale === "fr" ? "JPEG, PNG, WebP ou AVIF · 10 Mo maximum. L’image est stockée dans Supabase et utilisée sur la page publique." : "JPEG, PNG, WebP or AVIF · 10 MB maximum. Images are stored in Supabase and displayed on the public page."}</p>
          </div>
          <div className="cms-editor-two">
            <label>{t.navigationOrder}<input type="number" min={0} max={9999} value={pageForm.navigationOrder} onChange={e=>setPageForm({...pageForm,navigationOrder:Number(e.target.value)})} /></label>
            <label className="cms-editor-check"><input type="checkbox" checked={pageForm.showInNavigation} onChange={e=>setPageForm({...pageForm,showInNavigation:e.target.checked})} /> {t.showNavigation}</label>
          </div>
          <button className="cms-login-submit" type="submit" disabled={busy}>{busy ? t.saving : t.savePage}</button>
        </form>

        {selectedPage && <div className="cms-section-editor">
          <div className="cms-pages-editor-heading"><div><p className="cms-eyebrow">{t.reusable}</p><h2>{t.sections}</h2><p>{locale==="fr"?"Une page est la destination complète du site. Les sections sont les blocs de contenu affichés dans l’ordre sur cette page.":"A page is the complete website destination. Sections are the content blocks displayed in order within that page."}</p></div><span className="cms-module-tag">{sections.length} {t.sectionCount}</span></div>
          {sections.map(section=><div className="cms-section-row" key={section.id}>
            <button type="button" className="cms-section-edit" onClick={()=>editSection(section)}><strong>{section.section_key}</strong><span>{section.section_type} · {section.status}</span></button>
            <div className="cms-section-actions">
              <button type="button" onClick={()=>updateSectionStatus(section.id,"published")} disabled={busy}>{t.publish}</button>
              <button type="button" onClick={()=>updateSectionStatus(section.id,"draft")} disabled={busy}>{t.draft}</button>
              <button type="button" onClick={()=>updateSectionStatus(section.id,"archived")} disabled={busy}>{t.archive}</button>
            </div>
          </div>)}
          <form onSubmit={submitSection} className="cms-editor-form cms-section-form">
            <h3>{sectionForm.id ? t.editSection : t.addSection}</h3>
            <div className="cms-editor-two">
              <label>{t.sectionKey}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={sectionForm.sectionKey} onChange={e=>setSectionForm({...sectionForm,sectionKey:e.target.value})} placeholder="intro" /></label>
              <label>{t.sectionType}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={sectionForm.sectionType} onChange={e=>setSectionForm({...sectionForm,sectionType:e.target.value})} placeholder="text" /></label>
            </div>
            <label>{t.order}<input type="number" min={0} max={9999} value={sectionForm.sortOrder} onChange={e=>setSectionForm({...sectionForm,sortOrder:Number(e.target.value)})} /></label>
            <div className="cms-page-image-field">
              <label>{locale === "fr" ? "Image de section" : "Section image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadSectionImage} disabled={busy || !pageForm.id} /></label>
              <label>{locale === "fr" ? "Texte alternatif de l’image" : "Image alternative text"}<input maxLength={200} value={sectionForm.imageAlt} onChange={e=>setSectionForm({...sectionForm,imageAlt:e.target.value})} placeholder={locale === "fr" ? "Décrivez l’image" : "Describe the image"} /></label>
              {sectionForm.imagePath && supabase && <div className="cms-page-image-preview"><img src={supabase.storage.from("nsomex-website").getPublicUrl(sectionForm.imagePath).data.publicUrl} alt={sectionForm.imageAlt || "Section image preview"} /><span>{locale === "fr" ? "Image sélectionnée" : "Selected image"}</span></div>}
              <p>{locale === "fr" ? "L’image sera publiée avec la section après son enregistrement et la publication de la page." : "The image is published with this section after you save the section and publish the page."}</p>
            </div>
            <div className="cms-editor-two">
              <SectionContentFields locale="en" value={sectionForm.enContent} onChange={value=>setSectionForm(current=>({...current,enContent:value}))} />
              <SectionContentFields locale="fr" value={sectionForm.frContent} onChange={value=>setSectionForm(current=>({...current,frContent:value}))} />
            </div>
            <button className="cms-login-submit" type="submit" disabled={busy}>{busy ? t.saving : t.saveSection}</button>
            {sectionForm.id && <button type="button" className="cms-pages-new" onClick={()=>setSectionForm({...emptySection,pageId:pageForm.id ?? ""})}>{t.cancelSection}</button>}
          </form>
        </div>}

        {selectedPage && <div className="cms-status-actions">
          <strong>{t.workflow}</strong>
          <div>
            <button type="button" onClick={()=>updateStatus("draft")} disabled={busy}>{t.draft}</button>
            <button type="button" onClick={()=>updateStatus("review")} disabled={busy}>{t.review}</button>
            <button type="button" onClick={()=>updateStatus("published")} disabled={busy}>{t.publish}</button>
            <button type="button" onClick={()=>updateStatus("archived")} disabled={busy}>{t.archive}</button>
          </div>
        </div>}
        {message && <p className="cms-notice" role="status">{message}</p>}
      </section>
    </div>
  </div>;
}


function mergeSectionImage(value:string,imagePath:string,imageAlt:string):string{
 let data:Record<string,unknown>={};try{const parsed=JSON.parse(value);if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed))data=parsed;}catch{}
 if(imagePath){data.imagePath=imagePath;data.imageAlt=imageAlt.trim();}else{delete data.imagePath;delete data.imageAlt;}
 return JSON.stringify(data);
}

function SectionContentFields({locale,value,onChange}:{locale:"en"|"fr";value:string;onChange:(value:string)=>void}){
 type Item={title?:string;description?:string};
 let data:Record<string,unknown>={};
 try{const parsed=JSON.parse(value);if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed))data=parsed;}catch{}
 const text=(key:string)=>typeof data[key]==="string"?data[key] as string:"";
 const items=Array.isArray(data.items)?data.items.filter((item):item is Item=>Boolean(item)&&typeof item==="object"&&!Array.isArray(item)):[];
 function update(key:string,next:unknown){onChange(JSON.stringify({...data,[key]:next},null,2));}
 function updateItem(index:number,key:"title"|"description",next:string){const nextItems=[...items];nextItems[index]={...nextItems[index],[key]:next};update("items",nextItems);}
 const fr=locale==="fr";
 return <div className="cms-section-content-fields">
  <label>{fr?"Petit titre / surtitre":"Eyebrow / small label"}<input maxLength={120} value={text("eyebrow")} onChange={e=>update("eyebrow",e.target.value)}/></label>
  <label>{fr?"Titre de section":"Section heading"}<input maxLength={200} value={text("heading")} onChange={e=>update("heading",e.target.value)}/></label>
  <label>{fr?"Texte d’introduction":"Lead / introduction"}<textarea rows={3} maxLength={1200} value={text("lead")} onChange={e=>update("lead",e.target.value)}/></label>
  <label>{fr?"Texte de section":"Section text"}<textarea rows={10} maxLength={20000} value={text("body")} onChange={e=>update("body",e.target.value)}/></label>
  <div className="cms-section-items">
   <div className="cms-pages-editor-heading"><strong>{fr?"Éléments / cartes":"Items / cards"}</strong><button type="button" onClick={()=>update("items",[...items,{title:"",description:""}])}>{fr?"＋ Ajouter un élément":"＋ Add item"}</button></div>
   {items.map((item,index)=><div className="cms-section-item-editor" key={index}>
    <div className="cms-pages-editor-heading"><strong>{fr?"Élément":"Item"} {index+1}<button type="button" onClick={()=>update("items",items.filter((_,i)=>i!==index))}>{fr?"Supprimer":"Remove"}</button></strong></div>
    <label>{fr?"Titre":"Title"}<input maxLength={160} value={item.title??""} onChange={e=>updateItem(index,"title",e.target.value)}/></label>
    <label>{fr?"Description":"Description"}<textarea rows={3} maxLength={1200} value={item.description??""} onChange={e=>updateItem(index,"description",e.target.value)}/></label>
   </div>)}
  </div>
 </div>;
}
