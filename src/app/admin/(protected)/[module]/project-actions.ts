"use server";

import { createClient } from "@/lib/supabase/server";

type Result = { ok: true; id: string } | { ok: false; error: string };
type ProjectInput = {
  id?: string; divisionId: string; businessUnitId: string; serviceId: string; slug: string; projectType: string;
  locationName: string; city: string; region: string; countryCode: string;
  startedOn: string; completedOn: string; isFeatured: boolean; sortOrder: number;
  enTitle: string; frTitle: string; enSummary: string; frSummary: string;
  enDescription: string; frDescription: string;
};
const allowedMime = new Set(["image/jpeg","image/png","image/webp","image/avif","video/mp4","application/pdf"]);
const maxBytes = 50 * 1024 * 1024;

async function authorized(permission: string, divisionId: string) {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, error: "Supabase is not configured." };
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { supabase: null, error: "Your session has expired. Sign in again." };
  const { data, error } = await supabase.rpc("cms_has_permission", {
    requested_permission: permission,
    requested_division_id: divisionId,
  });
  if (error || data !== true) return { supabase: null, error: "You do not have permission for this division." };
  return { supabase, error: "" };
}
function clean(value: unknown, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0,max) : "";
}
function validSlug(value: string) { return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value); }

export async function saveProject(input: ProjectInput): Promise<Result> {
  const divisionId = clean(input.divisionId, 80);
  const auth = await authorized(input.id ? "content.edit" : "content.create", divisionId);
  if (!auth.supabase) return { ok:false, error:auth.error };
  const supabase = auth.supabase;
  const slug = clean(input.slug, 100).toLowerCase();
  const projectType = clean(input.projectType || "general", 80).toLowerCase();
  const enTitle = clean(input.enTitle, 200);
  const frTitle = clean(input.frTitle, 200);
  if (!divisionId) return {ok:false,error:"Choose a division."};
  if (!validSlug(slug) || !validSlug(projectType)) return {ok:false,error:"Use lowercase letters, numbers and hyphens for the slug and project type."};
  if (!enTitle || !frTitle) return {ok:false,error:"Add both English and French project titles."};
  if (input.startedOn && input.completedOn && input.completedOn < input.startedOn) return {ok:false,error:"The completion date cannot be earlier than the start date."};

  const businessUnitId = clean(input.businessUnitId,80) || null;
  const serviceId = clean(input.serviceId,80) || null;
  if (serviceId && !businessUnitId) return {ok:false,error:"Choose a business unit before linking a service."};
  if (serviceId) {
    const {data:service,error:serviceError}=await supabase.from("services").select("id,categories(business_unit_id)").eq("id",serviceId).single();
    const category=Array.isArray(service?.categories)?service.categories[0]:service?.categories;
    if(serviceError||!service||!category||category.business_unit_id!==businessUnitId) return {ok:false,error:"Choose a service that belongs to the selected business unit."};
    const {data:unit,error:unitError}=await supabase.from("business_units").select("division_id").eq("id",businessUnitId).single();
    if(unitError||!unit||unit.division_id!==divisionId) return {ok:false,error:"The selected business unit does not belong to this division."};
  }
  const values = {
    division_id:divisionId,
    business_unit_id:businessUnitId,
    service_id:serviceId,
    slug, project_type:projectType,
    location_name:clean(input.locationName,200) || null,
    city:clean(input.city,120) || null,
    region:clean(input.region,120) || null,
    country_code:clean(input.countryCode,2).toUpperCase() || null,
    started_on:clean(input.startedOn,10) || null,
    completed_on:clean(input.completedOn,10) || null,
    is_featured:Boolean(input.isFeatured),
    sort_order:Number.isFinite(input.sortOrder) ? Math.max(0,Math.min(9999,Math.trunc(input.sortOrder))) : 0,
  };
  let id = input.id;
  if (id) {
    const {error}=await supabase.from("projects").update(values).eq("id",id);
    if(error) return {ok:false,error:error.message};
  } else {
    const {data,error}=await supabase.from("projects").insert({...values,status:"draft"}).select("id").single();
    if(error || !data) return {ok:false,error:error?.message ?? "Unable to create the project."};
    id=data.id;
  }
  if (!id) return {ok:false,error:"Unable to identify the saved project."};
  const savedId=id;
  const {error:translationError}=await supabase.from("project_translations").upsert([
    {project_id:savedId,locale_code:"en",title:enTitle,summary:clean(input.enSummary,600)||null,description:clean(input.enDescription,12000)||null},
    {project_id:savedId,locale_code:"fr",title:frTitle,summary:clean(input.frSummary,600)||null,description:clean(input.frDescription,12000)||null},
  ],{onConflict:"project_id,locale_code"});
  if(translationError) return {ok:false,error:translationError.message};
  return {ok:true,id:savedId};
}

export async function changeProjectStatus(projectId: string, divisionId: string, status:"draft"|"review"|"published"|"archived"): Promise<Result> {
  const permission = status==="published" ? "content.publish" : status==="review" ? "content.submit_review" : status==="archived" ? "content.archive" : "content.edit";
  const auth=await authorized(permission,divisionId);
  if(!auth.supabase) return {ok:false,error:auth.error};
  const {error}=await auth.supabase.from("projects").update({
    status,
    published_at:status==="published"?new Date().toISOString():null,
  }).eq("id",projectId).eq("division_id",divisionId);
  return error?{ok:false,error:error.message}:{ok:true,id:projectId};
}

export async function registerMediaAsset(input:{divisionId:string;objectPath:string;filename:string;mimeType:string;byteSize:number}):Promise<Result>{
  const divisionId=clean(input.divisionId,80);
  const auth=await authorized("media.manage",divisionId);
  if(!auth.supabase) return {ok:false,error:auth.error};
  const filename=clean(input.filename,255);
  const objectPath=clean(input.objectPath,600);
  if(!allowedMime.has(input.mimeType)) return {ok:false,error:"This file type is not allowed."};
  if(!Number.isInteger(input.byteSize)||input.byteSize<1||input.byteSize>maxBytes) return {ok:false,error:"The file must be smaller than 50 MB."};
  if(!filename||!objectPath.startsWith(divisionId+"/")||objectPath.includes("..")||objectPath.startsWith("/")) return {ok:false,error:"Invalid media file path."};
  const {data,error}=await auth.supabase.from("media_assets").insert({
    division_id:divisionId,bucket_name:"nsomex-media",object_path:objectPath,
    original_filename:filename,mime_type:input.mimeType,byte_size:input.byteSize,status:"draft",
  }).select("id").single();
  if(error||!data) return {ok:false,error:error?.message??"Unable to register the uploaded file."};
  return {ok:true,id:data.id};
}

export async function attachMediaToProject(input:{projectId:string;divisionId:string;mediaAssetId:string;role:"cover"|"gallery"|"document"|"video"}):Promise<Result>{
  const auth=await authorized("content.edit",input.divisionId);
  if(!auth.supabase) return {ok:false,error:auth.error};
  const {data:asset,error:assetError}=await auth.supabase.from("media_assets").select("id,division_id").eq("id",input.mediaAssetId).single();
  if(assetError||!asset||asset.division_id!==input.divisionId) return {ok:false,error:"Choose media from the same division as the project."};
  const {data:existing}=await auth.supabase.from("project_media").select("id").eq("project_id",input.projectId).eq("media_asset_id",input.mediaAssetId).maybeSingle();
  if(existing) return {ok:true,id:existing.id};
  const {data,error}=await auth.supabase.from("project_media").insert({
    project_id:input.projectId,media_asset_id:input.mediaAssetId,media_role:input.role,sort_order:0,
  }).select("id").single();
  return error||!data?{ok:false,error:error?.message??"Unable to attach media."}:{ok:true,id:data.id};
}

export async function changeMediaStatus(mediaId:string,divisionId:string,status:"draft"|"published"|"archived"):Promise<Result>{
  const auth=await authorized("media.manage",divisionId);
  if(!auth.supabase) return {ok:false,error:auth.error};
  const {error}=await auth.supabase.from("media_assets").update({status}).eq("id",mediaId).eq("division_id",divisionId);
  return error?{ok:false,error:error.message}:{ok:true,id:mediaId};
}
