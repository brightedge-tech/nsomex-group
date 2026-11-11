-- Phase 2 hardening: service page edits return published pages to draft until reviewed.
-- Additive policy updates; no existing catalogue records are removed.

begin;

alter table public.services alter column status set default 'draft';

revoke all on function public.cms_guard_service_status() from public, anon, authenticated;

drop policy if exists "CMS can create service sections" on public.service_sections;
create policy "CMS can create service sections"
  on public.service_sections for insert to authenticated
  with check (
    exists (
      select 1 from public.services s
      join public.categories c on c.id=s.category_id
      join public.business_units bu on bu.id=c.business_unit_id
      where s.id=service_id
        and public.cms_has_permission('content.edit',bu.division_id)
    )
  );

create policy "Authorized editors can add service page translations"
  on public.content_translations for insert to authenticated
  with check (
    service_id is not null
    and exists (
      select 1 from public.services s
      join public.categories c on c.id=s.category_id
      join public.business_units bu on bu.id=c.business_unit_id
      where s.id=service_id
        and (
          public.cms_has_permission('content.create',bu.division_id)
          or public.cms_has_permission('content.edit',bu.division_id)
        )
    )
  );

create or replace function public.cms_guard_service_translation()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $function$
declare
  division_value uuid;
  service_status text;
begin
  select bu.division_id,s.status into division_value,service_status
  from public.services s
  join public.categories c on c.id=s.category_id
  join public.business_units bu on bu.id=c.business_unit_id
  where s.id=new.service_id;

  if division_value is null then
    raise exception 'Service translation has no valid owning division' using errcode='23503';
  end if;
  if not (
    public.cms_has_permission('content.create',division_value)
    or public.cms_has_permission('content.edit',division_value)
  ) then
    raise exception 'Insufficient permission for service translation' using errcode='42501';
  end if;

  if service_status in ('published','review') then
    if not public.cms_has_permission('content.edit',division_value) then
      raise exception 'Editing a published service requires content.edit' using errcode='42501';
    end if;
    update public.services
      set status='draft',published_at=null,updated_at=now()
      where id=new.service_id;
  end if;
  return new;
end;
$function$;

revoke all on function public.cms_guard_service_translation() from public, anon, authenticated;
create trigger cms_service_translation_guard
  before insert or update on public.content_translations
  for each row
  when (new.service_id is not null)
  execute function public.cms_guard_service_translation();

drop policy if exists "Public can download published project media" on storage.objects;
create policy "Public can download published project and service media"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'nsomex-media'
    and (
      exists (
        select 1 from public.media_assets ma
        join public.project_media pm on pm.media_asset_id=ma.id
        join public.projects p on p.id=pm.project_id
        join public.divisions d on d.id=p.division_id
        where ma.bucket_name=storage.objects.bucket_id
          and ma.object_path=storage.objects.name
          and ma.status='published'
          and p.status='published'
          and d.is_active
      )
      or exists (
        select 1 from public.media_assets ma
        join public.service_media sm on sm.media_asset_id=ma.id
        join public.services s on s.id=sm.service_id
        join public.categories c on c.id=s.category_id
        join public.business_units bu on bu.id=c.business_unit_id
        join public.divisions d on d.id=bu.division_id
        where ma.bucket_name=storage.objects.bucket_id
          and ma.object_path=storage.objects.name
          and ma.status='published'
          and s.status='published'
          and s.is_active
          and c.is_active
          and bu.is_active
          and d.is_active
      )
    )
  );

create policy "CMS can remove service media links"
  on public.service_media for delete to authenticated
  using (
    exists (
      select 1 from public.services s
      join public.categories c on c.id=s.category_id
      join public.business_units bu on bu.id=c.business_unit_id
      where s.id=service_id
        and public.cms_has_permission('content.edit',bu.division_id)
    )
  );

commit;
