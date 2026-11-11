"use server";

import { createClient } from "@/lib/supabase/server";

type Result = { ok: true; id: string } | { ok: false; error: string };
type ServicePageInput = {
  id:string; divisionId:string;
  enName:string; frName:string; enSummary:string; frSummary:string;
  enDescription:string; frDescription:string; enSeoTitle:string; frSeoTitle:string;
  enSeoDescription:string; frSeoDescription:string;
};
async function authorize(permission:string,divisionId:string){
  const supabase=await createClient();
  if(!supabase)return {supabase:null,error:"Supabase is not configured."};
  const {data:{user},error:authError}=await supabase.auth.getUser();
  if(authError||!user)return {supabase:null,error:"Your session has expired. Sign in again."};
  const {data,error}=await supabase.rpc("cms_has_permission",{requested_permission:permission,requested_division_id:divisionId});
  if(error||data!==true)return {supabase:null,error:"You do not have permission for this division."};
  return {supabase,error:""};
}
const clean=(v:unknown,max:number)=>typeof v==="string"?v.trim().slice(0,max):"";

export async function saveServicePage(input:ServicePageInput):Promise<Result>{
  const id=clean(input.id,80),divisionId=clean(input.divisionId,80);
  const auth=await authorize("content.edit",divisionId);
  if(!auth.supabase)return {ok:false,error:auth.error};
  if(!id||!divisionId)return {ok:false,error:"The service and division are required."};
  const {data:service,error:serviceError}=await auth.supabase.from("services")
    .select("id,categories(business_units(division_id))").eq("id",id).single();
  const category=Array.isArray(service?.categories)?service?.categories[0]:service?.categories;
  const unit=Array.isArray(category?.business_units)?category?.business_units[0]:category?.business_units;
  if(serviceError||!service||unit?.division_id!==divisionId)return {ok:false,error:"The service does not belong to this division."};
  const translations=[
    {locale_code:"en",field_name:"name",content:clean(input.enName,200)},
    {locale_code:"fr",field_name:"name",content:clean(input.frName,200)},
    {locale_code:"en",field_name:"summary",content:clean(input.enSummary,600)},
    {locale_code:"fr",field_name:"summary",content:clean(input.frSummary,600)},
    {locale_code:"en",field_name:"description",content:clean(input.enDescription,10000)},
    {locale_code:"fr",field_name:"description",content:clean(input.frDescription,10000)},
    {locale_code:"en",field_name:"seo_title",content:clean(input.enSeoTitle,200)},
    {locale_code:"fr",field_name:"seo_title",content:clean(input.frSeoTitle,200)},
    {locale_code:"en",field_name:"seo_description",content:clean(input.enSeoDescription,320)},
    {locale_code:"fr",field_name:"seo_description",content:clean(input.frSeoDescription,320)},
  ].filter(row=>row.content);
  if(translations.filter(row=>row.field_name==="name").length!==2||
     translations.filter(row=>row.field_name==="description").length!==2){
    return {ok:false,error:"English and French names and descriptions are required."};
  }
  for(const row of translations){
    const key={service_id:id,locale_code:row.locale_code,field_name:row.field_name};
    const {data:existing,error:lookupError}=await auth.supabase.from("content_translations").select("id").match(key).maybeSingle();
    if(lookupError)return {ok:false,error:lookupError.message};
    if(existing){
      const {error}=await auth.supabase.from("content_translations").update({content:row.content}).eq("id",existing.id);
      if(error)return {ok:false,error:error.message};
    }else{
      const {error}=await auth.supabase.from("content_translations").insert({...key,content:row.content});
      if(error)return {ok:false,error:error.message};
    }
  }
  return {ok:true,id};
}

export async function changeServicePageStatus(serviceId:string,divisionId:string,status:"draft"|"review"|"published"|"archived"):Promise<Result>{
  const permission=status==="published"?"content.publish":status==="review"?"content.submit_review":status==="archived"?"content.archive":"content.edit";
  const auth=await authorize(permission,divisionId);
  if(!auth.supabase)return {ok:false,error:auth.error};
  const {data:service,error:lookupError}=await auth.supabase.from("services")
    .select("id,categories(business_units(division_id))").eq("id",serviceId).single();
  const category=Array.isArray(service?.categories)?service?.categories[0]:service?.categories;
  const unit=Array.isArray(category?.business_units)?category?.business_units[0]:category?.business_units;
  if(lookupError||!service||unit?.division_id!==divisionId)return {ok:false,error:"Service access could not be verified."};
  const {error}=await auth.supabase.from("services").update({
    status,is_active:status!=="archived",published_at:status==="published"?new Date().toISOString():null
  }).eq("id",serviceId);
  return error?{ok:false,error:error.message}:{ok:true,id:serviceId};
}

export async function saveServiceSection(input:{
  id?:string;serviceId:string;divisionId:string;sectionKey:string;sectionType:"text"|"image_text"|"feature_grid"|"process"|"faq"|"callout";
  sortOrder:number;enTitle:string;frTitle:string;enBody:string;frBody:string;
}):Promise<Result>{
  const auth=await authorize("content.edit",input.divisionId);
  if(!auth.supabase)return {ok:false,error:auth.error};
  const {data:service,error:serviceError}=await auth.supabase.from("services")
    .select("id,categories(business_units(division_id))").eq("id",input.serviceId).single();
  const category=Array.isArray(service?.categories)?service?.categories[0]:service?.categories;
  const unit=Array.isArray(category?.business_units)?category?.business_units[0]:category?.business_units;
  if(serviceError||!service||unit?.division_id!==input.divisionId)return {ok:false,error:"The service does not belong to this division."};
  const key=clean(input.sectionKey,80).toLowerCase();
  if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key))return {ok:false,error:"Use a lowercase section key with letters, numbers and hyphens."};
  const values={service_id:input.serviceId,section_key:key,section_type:input.sectionType,sort_order:Math.max(0,Math.min(9999,Math.trunc(input.sortOrder))),is_active:true};
  let sectionId=input.id;
  if(sectionId){
    const {data:existing,error:existingError}=await auth.supabase.from("service_sections").select("id,service_id").eq("id",sectionId).single();
    if(existingError||!existing||existing.service_id!==input.serviceId)return {ok:false,error:"The section does not belong to the selected service."};
    const {error}=await auth.supabase.from("service_sections").update(values).eq("id",sectionId);
    if(error)return {ok:false,error:error.message};
  }else{
    const {data,error}=await auth.supabase.from("service_sections").insert(values).select("id").single();
    if(error||!data)return {ok:false,error:error?.message??"Unable to create section."};
    sectionId=data.id;
  }
  const {error}=await auth.supabase.from("service_section_translations").upsert([
    {section_id:sectionId,locale_code:"en",title:clean(input.enTitle,200)||null,body:clean(input.enBody,12000)||null},
    {section_id:sectionId,locale_code:"fr",title:clean(input.frTitle,200)||null,body:clean(input.frBody,12000)||null},
  ],{onConflict:"section_id,locale_code"});
  return error?{ok:false,error:error.message}:{ok:true,id:sectionId};
}

export async function removeServiceSection(sectionId:string,divisionId:string):Promise<Result>{
  const auth=await authorize("content.edit",divisionId);
  if(!auth.supabase)return {ok:false,error:auth.error};
  const {data:section,error:lookupError}=await auth.supabase.from("service_sections")
    .select("id,service:services(categories(business_units(division_id)))").eq("id",sectionId).single();
  const service=section?.service as unknown as {categories:{business_units:{division_id:string}}|{business_units:{division_id:string}}[]}|null;
  const category=Array.isArray(service?.categories)?service?.categories[0]:service?.categories;
  const unit=Array.isArray(category?.business_units)?category?.business_units[0]:category?.business_units;
  if(lookupError||!section||unit?.division_id!==divisionId)return {ok:false,error:"Section access could not be verified."};
  const {error}=await auth.supabase.from("service_sections").delete().eq("id",sectionId);
  return error?{ok:false,error:error.message}:{ok:true,id:sectionId};
}

export async function attachMediaToService(input:{serviceId:string;divisionId:string;mediaAssetId:string;role:"cover"|"gallery";sortOrder:number}):Promise<Result>{
  const auth=await authorize("content.edit",input.divisionId);
  if(!auth.supabase)return {ok:false,error:auth.error};
  const {data:asset,error:assetError}=await auth.supabase.from("media_assets").select("id,division_id").eq("id",input.mediaAssetId).single();
  if(assetError||!asset||asset.division_id!==input.divisionId)return {ok:false,error:"Choose media from the same division as the service."};
  const {data:service,error:serviceError}=await auth.supabase.from("services")
    .select("id,categories(business_units(division_id))").eq("id",input.serviceId).single();
  const category=Array.isArray(service?.categories)?service?.categories[0]:service?.categories;
  const unit=Array.isArray(category?.business_units)?category?.business_units[0]:category?.business_units;
  if(serviceError||!service||unit?.division_id!==input.divisionId)return {ok:false,error:"The service does not belong to this division."};
  if(input.role==="cover"){
    const {error:coverError}=await auth.supabase.from("service_media")
      .update({media_role:"gallery"}).eq("service_id",input.serviceId).eq("media_role","cover");
    if(coverError)return {ok:false,error:coverError.message};
  }
  const {data,error}=await auth.supabase.from("service_media").upsert({
    service_id:input.serviceId,media_asset_id:input.mediaAssetId,media_role:input.role,
    sort_order:Math.max(0,Math.min(9999,Math.trunc(input.sortOrder)))
  },{onConflict:"service_id,media_asset_id"}).select("id").single();
  return error||!data?{ok:false,error:error?.message??"Unable to attach media."}:{ok:true,id:data.id};
}

export async function removeServiceMedia(mediaId:string,divisionId:string):Promise<Result>{
  const auth=await authorize("content.edit",divisionId);
  if(!auth.supabase)return {ok:false,error:auth.error};
  const {data:link,error:lookupError}=await auth.supabase.from("service_media")
    .select("id,service:services(categories(business_units(division_id)))").eq("id",mediaId).single();
  const service=link?.service as unknown as {categories:{business_units:{division_id:string}|{division_id:string}[]}|{business_units:{division_id:string}|{division_id:string}[]}[]}|null;
  const category=service?(Array.isArray(service.categories)?service.categories[0]:service.categories):undefined;
  const unit=category?(Array.isArray(category.business_units)?category.business_units[0]:category.business_units):undefined;
  if(lookupError||!link||unit?.division_id!==divisionId)return {ok:false,error:"The media link does not belong to this division."};
  const {error}=await auth.supabase.from("service_media").delete().eq("id",mediaId);
  return error?{ok:false,error:error.message}:{ok:true,id:mediaId};
}
