"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { changePageStatus, changeSectionStatus, savePage, saveSection } from "@/app/admin/(protected)/[module]/actions";

type Translation = { locale_code: string; title?: string; summary?: string | null; content?: Record<string, unknown> };
type Section = {
  id: string; section_key: string; section_type: string; status: "draft" | "published" | "archived";
  sort_order: number; page_section_translations: Translation[];
};
type Page = {
  id: string; slug: string; template_key: string; status: "draft" | "review" | "published" | "archived";
  division_id: string | null; show_in_navigation: boolean; navigation_order: number;
  page_translations: Translation[]; page_sections: Section[];
};
type Division = { id: string; code: string };
type Props = { pages: Page[]; divisions: Division[]; canManageGlobal: boolean };

const emptyPage = {
  id: undefined as string | undefined, slug: "", templateKey: "standard", divisionId: "",
  showInNavigation: false, navigationOrder: 0, enTitle: "", enSummary: "", frTitle: "", frSummary: "",
};
const emptySection = {
  id: undefined as string | undefined, pageId: "", sectionKey: "", sectionType: "text",
  sortOrder: 0, enContent: '{\n  "heading": "",\n  "body": ""\n}', frContent: '{\n  "heading": "",\n  "body": ""\n}',
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
    order:"Ordre", englishJson:"Contenu anglais (JSON)", frenchJson:"Contenu français (JSON)", saveSection:"Enregistrer la section",
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
    order:"Order", englishJson:"English content (JSON)", frenchJson:"French content (JSON)", saveSection:"Save section",
    cancelSection:"Cancel section edit", workflow:"Page workflow", draft:"Save as draft", review:"Submit for review",
    publish:"Publish page", archive:"Archive", pageSaved:"Page saved. Both language versions are stored.",
    sectionSaved:"Section saved in English and French.", pageStatus:"Page status changed to", sectionStatus:"Section status changed to",
  };
  const [pageForm, setPageForm] = useState({ ...emptyPage, divisionId: canManageGlobal ? "" : divisions[0]?.id ?? "" });
  const [sectionForm, setSectionForm] = useState(emptySection);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const selectedPage = useMemo(() => pages.find(page => page.id === pageForm.id), [pages, pageForm.id]);
  const sections = selectedPage?.page_sections ?? [];

  function selectPage(page: Page) {
    const en = translation(page.page_translations, "en");
    const fr = translation(page.page_translations, "fr");
    setPageForm({
      id: page.id, slug: page.slug, templateKey: page.template_key, divisionId: page.division_id ?? "",
      showInNavigation: page.show_in_navigation, navigationOrder: page.navigation_order,
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

  async function updateStatus(status: "draft" | "review" | "published" | "archived") {
    if (!pageForm.id) return;
    setBusy(true); setMessage("");
    const result = await changePageStatus(pageForm.id, status);
    setBusy(false);
    setMessage(result.ok ? `${t.pageStatus} ${status}.` : result.error);
    if (result.ok) router.refresh();
  }

  async function submitSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pageForm.id) return;
    setBusy(true); setMessage("");
    const result = await saveSection({ ...sectionForm, pageId: pageForm.id });
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
          <div className="cms-editor-two">
            <label>{t.navigationOrder}<input type="number" min={0} max={9999} value={pageForm.navigationOrder} onChange={e=>setPageForm({...pageForm,navigationOrder:Number(e.target.value)})} /></label>
            <label className="cms-editor-check"><input type="checkbox" checked={pageForm.showInNavigation} onChange={e=>setPageForm({...pageForm,showInNavigation:e.target.checked})} /> {t.showNavigation}</label>
          </div>
          <button className="cms-login-submit" type="submit" disabled={busy}>{busy ? t.saving : t.savePage}</button>
        </form>

        {selectedPage && <div className="cms-section-editor">
          <div className="cms-pages-editor-heading"><div><p className="cms-eyebrow">{t.reusable}</p><h2>{t.sections}</h2></div><span className="cms-module-tag">{sections.length} {t.sectionCount}</span></div>
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
            <div className="cms-editor-two">
              <label>{t.englishJson}<textarea required rows={18} className="cms-long-content" value={sectionForm.enContent} onChange={e=>setSectionForm({...sectionForm,enContent:e.target.value})} /></label>
              <label>{t.frenchJson}<textarea required rows={18} className="cms-long-content" value={sectionForm.frContent} onChange={e=>setSectionForm({...sectionForm,frContent:e.target.value})} /></label>
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
