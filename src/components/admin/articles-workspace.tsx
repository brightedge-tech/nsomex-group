"use client";

import { useMemo,useState,type FormEvent } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { changeArticleCategoryStatus,changeArticleStatus,saveArticle,saveArticleCategory } from "@/app/admin/(protected)/[module]/article-actions";

type Translation={locale_code:string;slug?:string;title?:string;excerpt?:string|null;body?:Record<string,unknown>;seo_title?:string|null;seo_description?:string|null;name?:string;description?:string|null};
type Division={id:string;code:string};
type Media={id:string;division_id:string|null;original_filename:string;mime_type:string;status:string};
type Category={id:string;slug:string;status:"draft"|"published"|"archived";article_category_translations:Translation[]};
type Article={id:string;division_id:string|null;article_type:"news"|"insight"|"announcement";status:"draft"|"review"|"published"|"archived";cover_media_asset_id:string|null;is_featured:boolean;published_at:string|null;updated_at:string;article_translations:Translation[];article_category_assignments:{category_id:string}[]};
type Props={articles:Article[];categories:Category[];divisions:Division[];media:Media[];canManageGlobal:boolean};
const emptyArticle={
 id:undefined as string|undefined,divisionId:"",articleType:"news" as "news"|"insight"|"announcement",isFeatured:false,coverMediaAssetId:"",
 enSlug:"",frSlug:"",enTitle:"",frTitle:"",enExcerpt:"",frExcerpt:"",
 enBody:'{\n  "blocks": [\n    { "type": "paragraph", "text": "" }\n  ]\n}',
 frBody:'{\n  "blocks": [\n    { "type": "paragraph", "text": "" }\n  ]\n}',
 enSeoTitle:"",frSeoTitle:"",enSeoDescription:"",frSeoDescription:"",categoryIds:[] as string[],
};
const emptyCategory={id:undefined as string|undefined,slug:"",enName:"",frName:"",enDescription:"",frDescription:""};
function translation(rows:Translation[],locale:string){return rows.find(row=>row.locale_code===locale);}
export function ArticlesWorkspace({articles,categories,divisions,media,canManageGlobal}:Props){
 const router=useRouter(),search=useSearchParams(),fr=search.get("lang")==="fr";
 const t=fr?{
  articles:"Actualités et articles",newArticle:"＋ Nouvel article",none:"Aucun article pour le moment.",create:"Créer un article",edit:"Modifier l’article",
  type:"Type",news:"Actualité",insight:"Analyse",announcement:"Annonce",division:"Division",group:"Tout le groupe",slug:"Identifiant URL",
  en:"Anglais",fr:"Français",title:"Titre",excerpt:"Résumé",body:"Contenu structuré (JSON)",seoTitle:"Titre SEO",seoDescription:"Description SEO",
  cover:"Image de couverture",noCover:"Aucune image",featured:"Mettre en avant",categories:"Catégories",save:"Enregistrer l’article",
  workflow:"Publication",draft:"Brouillon",review:"Soumettre à validation",publish:"Publier",archive:"Archiver",backDraft:"Remettre en brouillon",
  saved:"Article enregistré en anglais et en français.",categorySaved:"Catégorie enregistrée.",status:"Statut",mediaHint:"Seuls les médias publiés de la même division sont proposés.",
  categoryManager:"Gérer les catégories",newCategory:"＋ Nouvelle catégorie",categoryName:"Nom de catégorie",categorySlug:"Identifiant de catégorie",
  description:"Description",saveCategory:"Enregistrer la catégorie",noCategories:"Aucune catégorie n’a encore été créée.",categoryStatus:"Statut de la catégorie",editCategory:"Modifier",
  groupOnly:"Les catégories sont gérées par le super administrateur.",choose:"Choisir…",messageError:"Une erreur est survenue.",
 }:{
  articles:"News & articles",newArticle:"＋ New article",none:"No articles yet. Add verified company content when ready.",create:"Create an article",edit:"Edit article",
  type:"Article type",news:"News",insight:"Insight",announcement:"Announcement",division:"Division",group:"Group-wide",slug:"URL slug",
  en:"English",fr:"French",title:"Title",excerpt:"Excerpt",body:"Structured content (JSON)",seoTitle:"SEO title",seoDescription:"SEO description",
  cover:"Cover image",noCover:"No cover image",featured:"Feature this article",categories:"Categories",save:"Save article",
  workflow:"Publishing",draft:"Draft",review:"Submit for review",publish:"Publish",archive:"Archive",backDraft:"Return to draft",
  saved:"Article saved in English and French.",categorySaved:"Category saved.",status:"Status",mediaHint:"Only published media from the same division is available.",
  categoryManager:"Manage categories",newCategory:"＋ New category",categoryName:"Category name",categorySlug:"Category slug",
  description:"Description",saveCategory:"Save category",noCategories:"No categories have been created yet.",categoryStatus:"Category status",editCategory:"Edit",
  groupOnly:"Categories are managed by the super administrator.",choose:"Choose…",messageError:"Something went wrong.",
 };
 const [form,setForm]=useState({...emptyArticle,divisionId:canManageGlobal?"":divisions[0]?.id??""});
 const [categoryForm,setCategoryForm]=useState(emptyCategory);
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 const selected=useMemo(()=>articles.find(article=>article.id===form.id),[articles,form.id]);
 const mediaOptions=media.filter(item=>item.status==="published"&&(form.divisionId?item.division_id===form.divisionId:canManageGlobal&&item.division_id===null));
 function editArticle(article:Article){
  const en=translation(article.article_translations,"en"),frRow=translation(article.article_translations,"fr");
  setForm({
   id:article.id,divisionId:article.division_id??"",articleType:article.article_type,isFeatured:article.is_featured,coverMediaAssetId:article.cover_media_asset_id??"",
   enSlug:en?.slug??"",frSlug:frRow?.slug??"",enTitle:en?.title??"",frTitle:frRow?.title??"",enExcerpt:en?.excerpt??"",frExcerpt:frRow?.excerpt??"",
   enBody:JSON.stringify(en?.body??{},null,2),frBody:JSON.stringify(frRow?.body??{},null,2),
   enSeoTitle:en?.seo_title??"",frSeoTitle:frRow?.seo_title??"",enSeoDescription:en?.seo_description??"",frSeoDescription:frRow?.seo_description??"",
   categoryIds:article.article_category_assignments.map(item=>item.category_id),
  });
  setMessage("");
 }
 function newArticle(){setForm({...emptyArticle,divisionId:canManageGlobal?"":divisions[0]?.id??""});setMessage("");}
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setBusy(true);setMessage("");
  const result=await saveArticle(form);setBusy(false);
  if(!result.ok){setMessage(result.error);return;}
  setForm(current=>({...current,id:result.id}));setMessage(t.saved);router.refresh();
 }
 async function status(next:"draft"|"review"|"published"|"archived"){
  if(!form.id)return;
  setBusy(true);setMessage("");
  const result=await changeArticleStatus(form.id,form.divisionId||null,next);setBusy(false);
  setMessage(result.ok?`${t.status}: ${next}`:result.error);if(result.ok)router.refresh();
 }
 function toggleCategory(id:string,checked:boolean){
  setForm(current=>({...current,categoryIds:checked?[...current.categoryIds,id]:current.categoryIds.filter(value=>value!==id)}));
 }
 async function submitCategory(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setBusy(true);setMessage("");
  const result=await saveArticleCategory(categoryForm);setBusy(false);
  if(!result.ok){setMessage(result.error);return;}
  setCategoryForm(emptyCategory);setMessage(t.categorySaved);router.refresh();
 }
 function editCategory(category:Category){
  const en=translation(category.article_category_translations,"en"),frRow=translation(category.article_category_translations,"fr");
  setCategoryForm({id:category.id,slug:category.slug,enName:en?.name??"",frName:frRow?.name??"",enDescription:en?.description??"",frDescription:frRow?.description??""});
  setMessage("");
 }
 async function categoryStatus(id:string,next:"draft"|"published"|"archived"){
  setBusy(true);setMessage("");
  const result=await changeArticleCategoryStatus(id,next);setBusy(false);
  setMessage(result.ok?`${t.categoryStatus}: ${next}`:result.error);if(result.ok)router.refresh();
 }
 return <div className="cms-articles-workspace">
  <div className="cms-articles-layout">
   <aside className="cms-pages-list">
    <div className="cms-pages-list-head"><strong>{t.articles}</strong><span>{articles.length}</span></div>
    <button type="button" className="cms-pages-new" onClick={newArticle}>{t.newArticle}</button>
    {!articles.length&&<p className="cms-pages-empty">{t.none}</p>}
    {articles.map(article=><button type="button" key={article.id} className={article.id===form.id?"cms-page-item is-selected":"cms-page-item"} onClick={()=>editArticle(article)}>
     <strong>{translation(article.article_translations,fr?"fr":"en")?.title??translation(article.article_translations,"en")?.title??"Untitled"}</strong>
     <span>{article.article_type} · {article.status}</span>
    </button>)}
   </aside>
   <section className="cms-pages-editor">
    <div className="cms-pages-editor-heading"><div><p className="cms-eyebrow">EDITORIAL WORKSPACE</p><h2>{form.id?t.edit:t.create}</h2></div>{selected&&<span className="cms-module-tag">{selected.status}</span>}</div>
    <form className="cms-editor-form" onSubmit={submit}>
     <div className="cms-editor-two">
      <label>{t.type}<select value={form.articleType} onChange={e=>setForm({...form,articleType:e.target.value as typeof form.articleType})}><option value="news">{t.news}</option><option value="insight">{t.insight}</option><option value="announcement">{t.announcement}</option></select></label>
      <label>{t.division}<select value={form.divisionId} onChange={e=>setForm({...form,divisionId:e.target.value,coverMediaAssetId:""})}>
       {canManageGlobal&&<option value="">{t.group}</option>}{divisions.map(d=><option key={d.id} value={d.id}>{d.code}</option>)}
      </select></label>
     </div>
     <div className="cms-editor-language"><strong>{t.en}</strong><span>EN</span></div>
     <label>{t.title}<input required maxLength={200} value={form.enTitle} onChange={e=>setForm({...form,enTitle:e.target.value})}/></label>
     <label>{t.slug}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.enSlug} onChange={e=>setForm({...form,enSlug:e.target.value})} placeholder="company-update"/></label>
     <label>{t.excerpt}<textarea rows={2} maxLength={600} value={form.enExcerpt} onChange={e=>setForm({...form,enExcerpt:e.target.value})}/></label>
     <label>{t.body}<textarea rows={9} spellCheck={false} value={form.enBody} onChange={e=>setForm({...form,enBody:e.target.value})}/></label>
     <div className="cms-editor-two">
      <label>{t.seoTitle}<input maxLength={200} value={form.enSeoTitle} onChange={e=>setForm({...form,enSeoTitle:e.target.value})}/></label>
      <label>{t.seoDescription}<textarea rows={2} maxLength={320} value={form.enSeoDescription} onChange={e=>setForm({...form,enSeoDescription:e.target.value})}/></label>
     </div>
     <div className="cms-editor-language"><strong>{t.fr}</strong><span>FR</span></div>
     <label>{t.title}<input required maxLength={200} value={form.frTitle} onChange={e=>setForm({...form,frTitle:e.target.value})}/></label>
     <label>{t.slug}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.frSlug} onChange={e=>setForm({...form,frSlug:e.target.value})} placeholder="actualite-entreprise"/></label>
     <label>{t.excerpt}<textarea rows={2} maxLength={600} value={form.frExcerpt} onChange={e=>setForm({...form,frExcerpt:e.target.value})}/></label>
     <label>{t.body}<textarea rows={9} spellCheck={false} value={form.frBody} onChange={e=>setForm({...form,frBody:e.target.value})}/></label>
     <div className="cms-editor-two">
      <label>{t.seoTitle}<input maxLength={200} value={form.frSeoTitle} onChange={e=>setForm({...form,frSeoTitle:e.target.value})}/></label>
      <label>{t.seoDescription}<textarea rows={2} maxLength={320} value={form.frSeoDescription} onChange={e=>setForm({...form,frSeoDescription:e.target.value})}/></label>
     </div>
     <label>{t.cover}<select value={form.coverMediaAssetId} onChange={e=>setForm({...form,coverMediaAssetId:e.target.value})}><option value="">{t.noCover}</option>{mediaOptions.map(asset=><option key={asset.id} value={asset.id}>{asset.original_filename} · {asset.mime_type}</option>)}</select></label>
     <p className="cms-articles-hint">{t.mediaHint}</p>
     <label className="cms-inline-check"><input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})}/>{t.featured}</label>
     <fieldset className="cms-article-categories"><legend>{t.categories}</legend>
      {categories.filter(category=>category.status==="published"||canManageGlobal).map(category=><label key={category.id} className="cms-inline-check"><input type="checkbox" checked={form.categoryIds.includes(category.id)} onChange={e=>toggleCategory(category.id,e.target.checked)}/>{translation(category.article_category_translations,fr?"fr":"en")?.name??category.slug} <span>· {category.status}</span></label>)}
      {!categories.length&&<p className="cms-pages-empty">{t.noCategories}</p>}
     </fieldset>
     <button className="cms-primary-button" type="submit" disabled={busy}>{busy?"…":t.save}</button>
    </form>
    {form.id&&<div className="cms-project-workflow"><strong>{t.workflow}</strong><div className="cms-project-actions">
     <button type="button" disabled={busy} onClick={()=>status("draft")}>{t.backDraft}</button>
     <button type="button" disabled={busy} onClick={()=>status("review")}>{t.review}</button>
     <button type="button" disabled={busy} onClick={()=>status("published")}>{t.publish}</button>
     <button type="button" disabled={busy} onClick={()=>status("archived")}>{t.archive}</button>
    </div></div>}
    {message&&<p className="cms-project-message" role="status">{message}</p>}
   </section>
  </div>
  <section className="cms-media-panel cms-article-category-panel">
   <div className="cms-pages-editor-heading"><div><p className="cms-eyebrow">EDITORIAL TAXONOMY</p><h2>{t.categoryManager}</h2></div><span className="cms-module-tag">{categories.length}</span></div>
   {canManageGlobal?<div className="cms-article-category-grid">
    <form className="cms-editor-form" onSubmit={submitCategory}>
     <label>{t.categorySlug}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={categoryForm.slug} onChange={e=>setCategoryForm({...categoryForm,slug:e.target.value})}/></label>
     <div className="cms-editor-language"><strong>{t.en}</strong><span>EN</span></div>
     <label>{t.categoryName}<input required maxLength={100} value={categoryForm.enName} onChange={e=>setCategoryForm({...categoryForm,enName:e.target.value})}/></label>
     <label>{t.description}<textarea rows={2} maxLength={500} value={categoryForm.enDescription} onChange={e=>setCategoryForm({...categoryForm,enDescription:e.target.value})}/></label>
     <div className="cms-editor-language"><strong>{t.fr}</strong><span>FR</span></div>
     <label>{t.categoryName}<input required maxLength={100} value={categoryForm.frName} onChange={e=>setCategoryForm({...categoryForm,frName:e.target.value})}/></label>
     <label>{t.description}<textarea rows={2} maxLength={500} value={categoryForm.frDescription} onChange={e=>setCategoryForm({...categoryForm,frDescription:e.target.value})}/></label>
     <button type="submit" className="cms-primary-button" disabled={busy}>{t.saveCategory}</button>
    </form>
    <div className="cms-article-category-list">
     {!categories.length&&<p className="cms-pages-empty">{t.noCategories}</p>}
     {categories.map(category=><div className="cms-media-row" key={category.id}>
      <div><strong>{translation(category.article_category_translations,fr?"fr":"en")?.name??category.slug}</strong><span>{category.slug} · {category.status}</span></div>
      <div className="cms-project-actions"><button type="button" disabled={busy} onClick={()=>editCategory(category)}>{t.editCategory}</button>{category.status==="published"?<button type="button" disabled={busy} onClick={()=>categoryStatus(category.id,"draft")}>{t.backDraft}</button>:<button type="button" disabled={busy} onClick={()=>categoryStatus(category.id,"published")}>{t.publish}</button>}</div>
     </div>)}
    </div>
   </div>:<p className="cms-pages-empty">{t.groupOnly}</p>}
  </section>
 </div>;
}
