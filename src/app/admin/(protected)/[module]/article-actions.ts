"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type Result={ok:true;id:string}|{ok:false;error:string};
type ArticleInput={
 id?:string;divisionId:string;articleType:"news"|"insight"|"announcement";isFeatured:boolean;coverMediaAssetId:string;
 enSlug:string;frSlug:string;enTitle:string;frTitle:string;enExcerpt:string;frExcerpt:string;
 enBody:string;frBody:string;enSeoTitle:string;frSeoTitle:string;enSeoDescription:string;frSeoDescription:string;
 categoryIds:string[];
};
function clean(value:unknown,max=300){return typeof value==="string"?value.trim().slice(0,max):"";}
function validSlug(value:string){return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);}
function parseBody(value:string):Record<string,unknown>|null{
 try{const parsed:unknown=JSON.parse(value);return parsed!==null&&typeof parsed==="object"&&!Array.isArray(parsed)?parsed as Record<string,unknown>:null;}
 catch{return null;}
}
async function authorize(permission:string,divisionId:string|null){
 const supabase=await createClient();
 if(!supabase)return {supabase:null,error:"Supabase is not configured."};
 const {data:{user},error:authError}=await supabase.auth.getUser();
 if(authError||!user)return {supabase:null,error:"Your session has expired. Sign in again."};
 const {data,error}=await supabase.rpc("cms_has_permission",{requested_permission:permission,requested_division_id:divisionId});
 if(error||data!==true)return {supabase:null,error:"You do not have permission to manage this content."};
 return {supabase,error:""};
}
export async function saveArticle(input:ArticleInput):Promise<Result>{
 const divisionId=clean(input.divisionId,80)||null;
 const permission=input.id?"content.edit":"content.create";
 const auth=await authorize(permission,divisionId);
 if(!auth.supabase)return {ok:false,error:auth.error};
 const supabase=auth.supabase;
 const enSlug=clean(input.enSlug,100).toLowerCase(),frSlug=clean(input.frSlug,100).toLowerCase();
 const enTitle=clean(input.enTitle,200),frTitle=clean(input.frTitle,200);
 const enBody=parseBody(input.enBody),frBody=parseBody(input.frBody);
 if(!enTitle||!frTitle)return {ok:false,error:"Add both English and French titles."};
 if(!validSlug(enSlug)||!validSlug(frSlug))return {ok:false,error:"Both language slugs must use lowercase letters, numbers and hyphens."};
 if(!enBody||!frBody)return {ok:false,error:"English and French article bodies must each be a valid JSON object."};
 if(!["news","insight","announcement"].includes(input.articleType))return {ok:false,error:"Choose a valid article type."};

 if(input.coverMediaAssetId){
  const {data:asset,error}=await supabase.from("media_assets").select("id,division_id,status").eq("id",input.coverMediaAssetId).maybeSingle();
  if(error||!asset)return {ok:false,error:"The selected cover media could not be found."};
  if(asset.status!=="published")return {ok:false,error:"Publish the cover media in the Media Library before using it on a public article."};
  if(divisionId!==asset.division_id)return {ok:false,error:"The cover media must belong to the same division as the article."};
 }

 const values={division_id:divisionId,article_type:input.articleType,cover_media_asset_id:input.coverMediaAssetId||null,is_featured:Boolean(input.isFeatured)};
 let articleId=input.id;
 if(articleId){
  const {error}=await supabase.from("articles").update(values).eq("id",articleId);
  if(error)return {ok:false,error:error.message};
 }else{
  const {data,error}=await supabase.from("articles").insert({...values,status:"draft"}).select("id").single();
  if(error||!data)return {ok:false,error:error?.message??"Unable to create the article."};
  articleId=data.id;
 }
 if(!articleId)return {ok:false,error:"Unable to identify the saved article."};
 const id=articleId;
 const translations=[
  {article_id:id,locale_code:"en",slug:enSlug,title:enTitle,excerpt:clean(input.enExcerpt,600)||null,body:enBody,seo_title:clean(input.enSeoTitle,200)||null,seo_description:clean(input.enSeoDescription,320)||null},
  {article_id:id,locale_code:"fr",slug:frSlug,title:frTitle,excerpt:clean(input.frExcerpt,600)||null,body:frBody,seo_title:clean(input.frSeoTitle,200)||null,seo_description:clean(input.frSeoDescription,320)||null},
 ];
 const {error:translationError}=await supabase.from("article_translations").upsert(translations,{onConflict:"article_id,locale_code"});
 if(translationError)return {ok:false,error:translationError.message};

 const {data:existing,error:existingError}=await supabase.from("article_category_assignments").select("category_id").eq("article_id",id);
 if(existingError)return {ok:false,error:existingError.message};
 const nextIds=[...new Set(input.categoryIds.filter(id=>typeof id==="string"&&id.length>0))];
 const removeIds=(existing??[]).map(row=>row.category_id).filter(categoryId=>!nextIds.includes(categoryId));
 if(removeIds.length){
  const {error}=await supabase.from("article_category_assignments").delete().eq("article_id",id).in("category_id",removeIds);
  if(error)return {ok:false,error:error.message};
 }
 const existingIds=new Set((existing??[]).map(row=>row.category_id));
 const addIds=nextIds.filter(categoryId=>!existingIds.has(categoryId));
 if(addIds.length){
  const {error}=await supabase.from("article_category_assignments").insert(addIds.map(category_id=>({article_id:id,category_id})));
  if(error)return {ok:false,error:error.message};
 }
 return {ok:true,id};
}
export async function changeArticleStatus(articleId:string,divisionId:string|null,status:"draft"|"review"|"published"|"archived"):Promise<Result>{
 const permission=status==="published"?"content.publish":status==="review"?"content.submit_review":status==="archived"?"content.archive":"content.edit";
 const auth=await authorize(permission,divisionId);
 if(!auth.supabase)return {ok:false,error:auth.error};
 const {error}=await auth.supabase.from("articles").update({status,published_at:status==="published"?new Date().toISOString():null}).eq("id",articleId);
 if(error)return {ok:false,error:error.message};
 revalidatePath("/en/insights");revalidatePath("/fr/insights");
 const {data:slugs}=await auth.supabase.from("article_translations").select("locale_code,slug").eq("article_id",articleId);
 for(const row of slugs??[])if(row.locale_code==="en"||row.locale_code==="fr")revalidatePath(`/${row.locale_code}/insights/${row.slug}`);
 return {ok:true,id:articleId};
}
type CategoryInput={id?:string;slug:string;enName:string;frName:string;enDescription:string;frDescription:string};
export async function saveArticleCategory(input:CategoryInput):Promise<Result>{
 const auth=await authorize(input.id?"content.edit":"content.create",null);
 if(!auth.supabase)return {ok:false,error:auth.error};
 const slug=clean(input.slug,100).toLowerCase(),enName=clean(input.enName,100),frName=clean(input.frName,100);
 if(!validSlug(slug))return {ok:false,error:"Use a valid lowercase category slug."};
 if(!enName||!frName)return {ok:false,error:"Add the category name in English and French."};
 let id=input.id;
 if(id){
  const {error}=await auth.supabase.from("article_categories").update({slug}).eq("id",id);
  if(error)return {ok:false,error:error.message};
 }else{
  const {data,error}=await auth.supabase.from("article_categories").insert({slug,status:"draft"}).select("id").single();
  if(error||!data)return {ok:false,error:error?.message??"Unable to create the category."};
  id=data.id;
 }
 if(!id)return {ok:false,error:"Unable to identify the category."};
 const {error}=await auth.supabase.from("article_category_translations").upsert([
  {category_id:id,locale_code:"en",name:enName,description:clean(input.enDescription,500)||null},
  {category_id:id,locale_code:"fr",name:frName,description:clean(input.frDescription,500)||null},
 ],{onConflict:"category_id,locale_code"});
 return error?{ok:false,error:error.message}:{ok:true,id};
}
export async function changeArticleCategoryStatus(id:string,status:"draft"|"published"|"archived"):Promise<Result>{
 const permission=status==="published"?"content.publish":status==="archived"?"content.archive":"content.edit";
 const auth=await authorize(permission,null);
 if(!auth.supabase)return {ok:false,error:auth.error};
 const {error}=await auth.supabase.from("article_categories").update({status}).eq("id",id);
 return error?{ok:false,error:error.message}:{ok:true,id};
}
