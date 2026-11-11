import "server-only";
import {createClient} from "@/lib/supabase/server";
import type {Locale} from "@/i18n/config";
export type T={locale_code:string;field_name:"name"|"summary"|"description";content:string};
export type S={id:string;category_id:string;code:string;slug:string;sort_order:number;content_translations:T[]};
export type C={id:string;business_unit_id:string;parent_id:string|null;code:string;slug:string;sort_order:number;content_translations:T[];services:S[]};
export type U={id:string;division_id:string;code:string;slug:string;sort_order:number;content_translations:T[];categories:C[]};
export type D={id:string;code:string;slug:string;sort_order:number;content_translations:T[];business_units:U[]};
export function catalogueText(rows:T[]|null|undefined,locale:Locale,field:T["field_name"]){return rows?.find(x=>x.locale_code===locale&&x.field_name===field)?.content??rows?.find(x=>x.locale_code==="en"&&x.field_name===field)?.content??"";}
const select=`id,code,slug,sort_order,content_translations(locale_code,field_name,content),business_units(id,division_id,code,slug,sort_order,content_translations(locale_code,field_name,content),categories(id,business_unit_id,parent_id,code,slug,sort_order,content_translations(locale_code,field_name,content),services(id,category_id,code,slug,sort_order,content_translations(locale_code,field_name,content))))`;
export async function getPublicDivisions(slug?:string):Promise<D[]>{const sb=await createClient();if(!sb)return[];let q=sb.from("divisions").select(select).eq("is_active",true).order("sort_order");if(slug)q=q.eq("slug",slug);const {data,error}=await q;if(error||!data)return[];return (data as unknown as D[]).map(d=>({...d,business_units:[...(d.business_units??[])].sort((a,b)=>a.sort_order-b.sort_order).map(u=>({...u,categories:[...(u.categories??[])].sort((a,b)=>a.sort_order-b.sort_order).map(c=>({...c,services:[...(c.services??[])].sort((a,b)=>a.sort_order-b.sort_order)}))}))})).sort((a,b)=>a.sort_order-b.sort_order);}
export async function getPublicDivision(slug:string){return(await getPublicDivisions(slug))[0]??null;}
export async function getPublicBusinessUnit(ds:string,us:string){const d=await getPublicDivision(ds),u=d?.business_units.find(x=>x.slug===us);return d&&u?{division:d,unit:u}:null;}
export async function getPublicCategory(ds:string,us:string,cs:string){const r=await getPublicBusinessUnit(ds,us),c=r?.unit.categories.find(x=>x.slug===cs);return r&&c?{...r,category:c}:null;}
export async function getPublicService(ds:string,us:string,cs:string,ss:string){const r=await getPublicCategory(ds,us,cs),s=r?.category.services.find(x=>x.slug===ss);return r&&s?{...r,service:s}:null;}
