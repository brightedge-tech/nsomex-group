"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveCoreContent, type CoreContentInput, type CoreContentKind } from "@/app/admin/(protected)/[module]/core-actions";

type Translation = { locale_code: string; field_name: string; content: string };
type Service = { id: string; category_id: string; code: string; slug: string; is_active: boolean; sort_order: number; content_translations: Translation[] };
type Category = { id: string; business_unit_id: string; parent_id: string | null; code: string; slug: string; is_active: boolean; sort_order: number; content_translations: Translation[]; services: Service[] };
type BusinessUnit = { id: string; division_id: string; code: string; slug: string; is_active: boolean; sort_order: number; content_translations: Translation[]; categories: Category[] };
type Division = { id: string; code: string; slug: string; is_active: boolean; sort_order: number; content_translations: Translation[]; business_units: BusinessUnit[] };

type Props = { divisions: Division[] };
type FormState = {
  kind: CoreContentKind; id?: string; parentId: string; parentCategoryId: string;
  code: string; slug: string; sortOrder: number; isActive: boolean;
  enName: string; frName: string; enSummary: string; frSummary: string;
  enDescription: string; frDescription: string;
};

const emptyForm = (kind: CoreContentKind, parentId = ""): FormState => ({
  kind, parentId, parentCategoryId: "", code: "", slug: "", sortOrder: 0, isActive: false,
  enName: "", frName: "", enSummary: "", frSummary: "", enDescription: "", frDescription: "",
});

function value(items: Translation[] | undefined, locale: string, field: string): string {
  return items?.find(item => item.locale_code === locale && item.field_name === field)?.content ?? "";
}
function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function CoreContentWorkspace({ divisions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get("lang") === "fr" ? "fr" : "en";
  const fr = locale === "fr";
  const [divisionId, setDivisionId] = useState(divisions[0]?.id ?? "");
  const [form, setForm] = useState<FormState>(() => emptyForm("business_unit", divisions[0]?.id ?? ""));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  const division = divisions.find(item => item.id === divisionId) ?? divisions[0];
  const units = division?.business_units ?? [];
  const categories = units.flatMap(unit => unit.categories ?? []);
  const parentOptions = useMemo(() => {
    if (form.kind === "business_unit") return division ? [{ id: division.id, label: value(division.content_translations, locale, "name") || division.code }] : [];
    if (form.kind === "category") return units.map(item => ({ id: item.id, label: value(item.content_translations, locale, "name") || item.code }));
    if (form.kind === "service") return categories.map(item => ({ id: item.id, label: value(item.content_translations, locale, "name") || item.code }));
    return [];
  }, [form.kind, division, units, categories, locale]);

  function chooseKind(kind: CoreContentKind) {
    setForm(emptyForm(kind, kind === "division" ? "" : kind === "business_unit" ? divisionId : kind === "category" ? units[0]?.id ?? "" : categories[0]?.id ?? ""));
    setAutoSlug(true);
    setMessage("");
  }

  function edit(kind: CoreContentKind, item: Division | BusinessUnit | Category | Service) {
    const translations = item.content_translations;
    const parentId = kind === "business_unit" ? (item as BusinessUnit).division_id
      : kind === "category" ? (item as Category).business_unit_id
      : kind === "service" ? (item as Service).category_id : "";
    setForm({
      kind, id: item.id, parentId,
      parentCategoryId: kind === "category" ? (item as Category).parent_id ?? "" : "",
      code: item.code, slug: item.slug, sortOrder: item.sort_order, isActive: item.is_active,
      enName: value(translations, "en", "name"), frName: value(translations, "fr", "name"),
      enSummary: value(translations, "en", "summary"), frSummary: value(translations, "fr", "summary"),
      enDescription: value(translations, "en", "description"), frDescription: value(translations, "fr", "description"),
    });
    if (kind === "division") setDivisionId(item.id);
    setAutoSlug(false);
    setMessage("");
  }

  function updateName(name: string, field: "enName" | "frName") {
    setForm(current => ({ ...current, [field]: name, ...(autoSlug && field === "enName" && !current.id ? { code: slugify(name), slug: slugify(name) } : {}) }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const input: CoreContentInput = { ...form, parentId: form.kind === "division" ? null : form.parentId || null };
    const result = await saveCoreContent(input);
    setBusy(false);
    if (!result.ok) { setMessage(result.error); return; }
    setMessage(fr ? "Enregistré. Les versions anglaise et française sont sauvegardées." : "Saved. English and French versions have been stored.");
    if (form.kind === "division") setDivisionId(result.id);
    setForm(current => ({ ...current, id: result.id }));
    router.refresh();
  }

  const label = (kind: CoreContentKind) => ({
    division: fr ? "Division" : "Division",
    business_unit: fr ? "Unité opérationnelle" : "Business unit",
    category: fr ? "Catégorie" : "Category",
    service: fr ? "Service" : "Service",
  })[kind];

  function recordRow(kind: CoreContentKind, item: Division | BusinessUnit | Category | Service, depth = 0) {
    const name = value(item.content_translations, locale, "name") || item.code;
    return <div className="cms-catalogue-row" key={item.id} style={{ paddingLeft: 14 + depth * 18 }}>
      <div><strong>{name}</strong><span>{item.code} · /{item.slug} · {item.is_active ? (fr ? "Actif" : "Active") : (fr ? "Inactif" : "Inactive")}</span></div>
      <button type="button" onClick={() => edit(kind, item)}>{fr ? "Modifier" : "Edit"}</button>
    </div>;
  }

  return <div className="cms-catalogue-workspace">
    <section className="cms-catalogue-panel">
      <div className="cms-catalogue-toolbar">
        <label>{fr ? "Division sélectionnée" : "Selected division"}
          <select value={divisionId} onChange={event => { setDivisionId(event.target.value); setForm(emptyForm("business_unit", event.target.value)); setAutoSlug(true); setMessage(""); }}>
            {divisions.map(item => <option key={item.id} value={item.id}>{value(item.content_translations, locale, "name") || item.code}</option>)}
          </select>
        </label>
        <label>{fr ? "Créer ou modifier" : "Create or edit"}
          <select value={form.kind} onChange={event => chooseKind(event.target.value as CoreContentKind)}>
            <option value="division">{label("division")}</option>
            <option value="business_unit">{label("business_unit")}</option>
            <option value="category">{label("category")}</option>
            <option value="service">{label("service")}</option>
          </select>
        </label>
      </div>

      <form className="cms-editor-form cms-catalogue-form" onSubmit={submit}>
        <div className="cms-pages-editor-heading"><div><p className="cms-eyebrow">{fr ? "ÉDITEUR DU CATALOGUE" : "CATALOGUE EDITOR"}</p><h2>{form.id ? (fr ? "Modifier" : "Edit") : (fr ? "Créer" : "Create")} {label(form.kind)}</h2></div><span className="cms-module-tag">{form.kind.replace("_", " ")}</span></div>
        {form.kind !== "division" && <label>{form.kind === "service" ? (fr ? "Catégorie parente" : "Parent category") : form.kind === "category" ? (fr ? "Unité opérationnelle" : "Business unit") : (fr ? "Division" : "Division")}
          <select required value={form.parentId} onChange={event => setForm({ ...form, parentId: event.target.value, parentCategoryId: "" })}>
            <option value="">{fr ? "Sélectionner…" : "Select…"}</option>
            {parentOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </label>}
        {form.kind === "category" && !form.id && <label>{fr ? "Sous-catégorie de (facultatif)" : "Subcategory of (optional)"}
          <select value={form.parentCategoryId} onChange={event => setForm({ ...form, parentCategoryId: event.target.value })}>
            <option value="">{fr ? "Catégorie principale" : "Top-level category"}</option>
            {categories.filter(item => item.id !== form.id && item.business_unit_id === form.parentId).map(item => <option key={item.id} value={item.id}>{value(item.content_translations, locale, "name") || item.code}</option>)}
          </select>
        </label>}
        <div className="cms-editor-two">
          <label>{fr ? "Code" : "Code"}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.code} onChange={event => { setForm({ ...form, code: event.target.value }); setAutoSlug(false); }} /></label>
          <label>{fr ? "URL slug" : "URL slug"}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={event => { setForm({ ...form, slug: event.target.value }); setAutoSlug(false); }} /></label>
        </div>
        <div className="cms-editor-language"><strong>English</strong><span>EN</span></div>
        <label>{fr ? "Nom (anglais)" : "Name (English)"}<input required maxLength={200} value={form.enName} onChange={event => updateName(event.target.value, "enName")} /></label>
        <label>{fr ? "Résumé (anglais)" : "Summary (English)"}<textarea rows={2} maxLength={1000} value={form.enSummary} onChange={event => setForm({ ...form, enSummary: event.target.value })} /></label>
        <label>{fr ? "Description (anglais)" : "Description (English)"}<textarea rows={3} maxLength={10000} value={form.enDescription} onChange={event => setForm({ ...form, enDescription: event.target.value })} /></label>
        <div className="cms-editor-language"><strong>Français</strong><span>FR</span></div>
        <label>{fr ? "Nom (français)" : "Name (French)"}<input required maxLength={200} value={form.frName} onChange={event => updateName(event.target.value, "frName")} /></label>
        <label>{fr ? "Résumé (français)" : "Summary (French)"}<textarea rows={2} maxLength={1000} value={form.frSummary} onChange={event => setForm({ ...form, frSummary: event.target.value })} /></label>
        <label>{fr ? "Description (français)" : "Description (French)"}<textarea rows={3} maxLength={10000} value={form.frDescription} onChange={event => setForm({ ...form, frDescription: event.target.value })} /></label>
        <div className="cms-editor-two">
          <label>{fr ? "Ordre d'affichage" : "Display order"}<input type="number" min={0} max={9999} value={form.sortOrder} onChange={event => setForm({ ...form, sortOrder: Number(event.target.value) })} /></label>
          <label className="cms-editor-check"><input type="checkbox" checked={form.isActive} onChange={event => setForm({ ...form, isActive: event.target.checked })} /> {fr ? "Actif sur le site public" : "Active on the public website"}</label>
        </div>
        <button className="cms-login-submit" type="submit" disabled={busy || (form.kind !== "division" && !form.parentId)}>{busy ? (fr ? "Enregistrement…" : "Saving…") : (fr ? "Enregistrer" : "Save changes")}</button>
        {message && <p className="cms-catalogue-message" role="status">{message}</p>}
      </form>
    </section>

    <section className="cms-catalogue-panel">
      <div className="cms-pages-editor-heading"><div><p className="cms-eyebrow">{fr ? "STRUCTURE ACTUELLE" : "CURRENT STRUCTURE"}</p><h2>{fr ? "Catalogue de l'entreprise" : "Business catalogue"}</h2></div><span className="cms-module-tag">{units.length} {fr ? "unités" : "units"}</span></div>
      {division && recordRow("division", division)}
      {units.length === 0 && <p className="cms-pages-empty">{fr ? "Aucune unité opérationnelle n'a encore été ajoutée." : "No business units have been added yet."}</p>}
      {units.map(unit => <div key={unit.id}>
        {recordRow("business_unit", unit, 1)}
        {(unit.categories ?? []).map(category => <div key={category.id}>
          {recordRow("category", category, 2)}
          {(category.services ?? []).map(service => recordRow("service", service, 3))}
        </div>)}
      </div>)}
    </section>
  </div>;
}
