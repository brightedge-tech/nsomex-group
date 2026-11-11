-- Phase 2: bilingual service page publishing, structured sections and reusable media.
-- Existing catalogue entries remain public: status defaults to published.
-- New CMS-created services are explicitly inserted as drafts by the server action.

begin;

alter table public.services
  add column status text not null default 'published'
    check (status in ('draft','review','published','archived')),
  add column published_at timestamptz;

update public.services
set published_at = coalesce(published_at, updated_at, created_at)
where is_active and status = 'published';

alter table public.content_translations
  drop constraint if exists content_translations_field_name_check;
alter table public.content_translations
  add constraint content_translations_field_name_check
  check (field_name in ('name','summary','description','seo_title','seo_description'));

create table public.service_sections (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  section_key text not null check (section_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  section_type text not null check (section_type in ('text','image_text','feature_grid','process','faq','callout')),
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, section_key)
);

create table public.service_section_translations (
  section_id uuid not null references public.service_sections(id) on delete cascade,
  locale_code text not null references public.locales(code) on update cascade on delete restrict,
  title text check (title is null or char_length(title) <= 200),
  body text check (body is null or char_length(body) <= 12000),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  primary key (section_id, locale_code)
);

create table public.service_media (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  media_role text not null default 'gallery' check (media_role in ('cover','gallery')),
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  created_at timestamptz not null default now(),
  unique (service_id, media_asset_id)
);
create unique index service_media_one_cover_uidx
  on public.service_media(service_id) where media_role = 'cover';
create index service_sections_order_idx on public.service_sections(service_id, sort_order, id);
create index service_media_order_idx on public.service_media(service_id, sort_order, id);

create table public.service_media_translations (
  service_media_id uuid not null references public.service_media(id) on delete cascade,
  locale_code text not null references public.locales(code) on update cascade on delete restrict,
  alt_text text check (alt_text is null or char_length(alt_text) <= 300),
  caption text check (caption is null or char_length(caption) <= 500),
  primary key (service_media_id, locale_code)
);

alter table public.service_sections enable row level security;
alter table public.service_section_translations enable row level security;
alter table public.service_media enable row level security;
alter table public.service_media_translations enable row level security;

revoke all on public.service_sections, public.service_section_translations,
  public.service_media, public.service_media_translations from public, anon, authenticated;
grant select on public.service_sections, public.service_section_translations,
  public.service_media, public.service_media_translations to anon, authenticated;
grant insert, update, delete on public.service_sections, public.service_section_translations,
  public.service_media, public.service_media_translations to authenticated;

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read published active services"
  on public.services for select to anon, authenticated
  using (
    is_active and status = 'published'
    and exists (
      select 1 from public.categories c
      join public.business_units bu on bu.id = c.business_unit_id
      join public.divisions d on d.id = bu.division_id
      where c.id = category_id and c.is_active and bu.is_active and d.is_active
    )
  );

drop policy if exists "Public can read translations for active content" on public.content_translations;
create policy "Public can read translations for active content"
  on public.content_translations for select to anon, authenticated
  using (
    exists (select 1 from public.locales l where l.code = locale_code and l.is_enabled)
    and (
      (division_id is not null and exists (select 1 from public.divisions d where d.id = division_id and d.is_active))
      or (business_unit_id is not null and exists (select 1 from public.business_units bu join public.divisions d on d.id=bu.division_id where bu.id=business_unit_id and bu.is_active and d.is_active))
      or (category_id is not null and exists (select 1 from public.categories c join public.business_units bu on bu.id=c.business_unit_id join public.divisions d on d.id=bu.division_id where c.id=category_id and c.is_active and bu.is_active and d.is_active))
      or (service_id is not null and exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id join public.divisions d on d.id=bu.division_id where s.id=service_id and s.is_active and s.status='published' and c.is_active and bu.is_active and d.is_active))
    )
  );

create policy "Public can read published service sections"
  on public.service_sections for select to anon, authenticated
  using (is_active and exists (select 1 from public.services s where s.id=service_id and s.is_active and s.status='published'));
create policy "CMS can read service sections"
  on public.service_sections for select to authenticated
  using (exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where s.id=service_id and public.cms_has_permission('content.read_draft',bu.division_id)));
create policy "CMS can create service sections"
  on public.service_sections for insert to authenticated
  with check (exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where s.id=service_id and public.cms_has_permission('content.create',bu.division_id)));
create policy "CMS can update service sections"
  on public.service_sections for update to authenticated
  using (exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where s.id=service_id and public.cms_has_permission('content.edit',bu.division_id)))
  with check (exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where s.id=service_id and public.cms_has_permission('content.edit',bu.division_id)));
create policy "CMS can delete service sections"
  on public.service_sections for delete to authenticated
  using (exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where s.id=service_id and public.cms_has_permission('content.edit',bu.division_id)));

create policy "Public can read published service section translations"
  on public.service_section_translations for select to anon, authenticated
  using (exists (select 1 from public.service_sections ss join public.services s on s.id=ss.service_id where ss.id=section_id and ss.is_active and s.is_active and s.status='published')
    and exists (select 1 from public.locales l where l.code=locale_code and l.is_enabled));
create policy "CMS can read service section translations"
  on public.service_section_translations for select to authenticated
  using (exists (select 1 from public.service_sections ss join public.services s on s.id=ss.service_id join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where ss.id=section_id and public.cms_has_permission('content.read_draft',bu.division_id)));
create policy "CMS can create service section translations"
  on public.service_section_translations for insert to authenticated
  with check (exists (select 1 from public.service_sections ss join public.services s on s.id=ss.service_id join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where ss.id=section_id and public.cms_has_permission('content.edit',bu.division_id)));
create policy "CMS can update service section translations"
  on public.service_section_translations for update to authenticated
  using (exists (select 1 from public.service_sections ss join public.services s on s.id=ss.service_id join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where ss.id=section_id and public.cms_has_permission('content.edit',bu.division_id)))
  with check (exists (select 1 from public.service_sections ss join public.services s on s.id=ss.service_id join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where ss.id=section_id and public.cms_has_permission('content.edit',bu.division_id)));

create policy "Public can read media for published services"
  on public.service_media for select to anon, authenticated
  using (exists (select 1 from public.services s where s.id=service_id and s.is_active and s.status='published')
    and exists (select 1 from public.media_assets ma where ma.id=media_asset_id and ma.status='published'));
create policy "CMS can read service media"
  on public.service_media for select to authenticated
  using (exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where s.id=service_id and public.cms_has_permission('content.read_draft',bu.division_id)));
create policy "CMS can manage service media"
  on public.service_media for insert to authenticated
  with check (exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id join public.media_assets ma on ma.id=media_asset_id where s.id=service_id and ma.division_id=bu.division_id and public.cms_has_permission('content.edit',bu.division_id)));
create policy "CMS can update service media"
  on public.service_media for update to authenticated
  using (exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where s.id=service_id and public.cms_has_permission('content.edit',bu.division_id)))
  with check (exists (select 1 from public.services s join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id join public.media_assets ma on ma.id=media_asset_id where s.id=service_id and ma.division_id=bu.division_id and public.cms_has_permission('content.edit',bu.division_id)));

create policy "Public can read service media translations"
  on public.service_media_translations for select to anon, authenticated
  using (exists (select 1 from public.service_media sm join public.services s on s.id=sm.service_id join public.media_assets ma on ma.id=sm.media_asset_id where sm.id=service_media_id and s.status='published' and s.is_active and ma.status='published')
    and exists (select 1 from public.locales l where l.code=locale_code and l.is_enabled));
create policy "CMS can read service media translations"
  on public.service_media_translations for select to authenticated
  using (exists (select 1 from public.service_media sm join public.services s on s.id=sm.service_id join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where sm.id=service_media_id and public.cms_has_permission('content.read_draft',bu.division_id)));
create policy "CMS can manage service media translations"
  on public.service_media_translations for insert to authenticated
  with check (exists (select 1 from public.service_media sm join public.services s on s.id=sm.service_id join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where sm.id=service_media_id and public.cms_has_permission('content.edit',bu.division_id)));
create policy "CMS can update service media translations"
  on public.service_media_translations for update to authenticated
  using (exists (select 1 from public.service_media sm join public.services s on s.id=sm.service_id join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where sm.id=service_media_id and public.cms_has_permission('content.edit',bu.division_id)))
  with check (exists (select 1 from public.service_media sm join public.services s on s.id=sm.service_id join public.categories c on c.id=s.category_id join public.business_units bu on bu.id=c.business_unit_id where sm.id=service_media_id and public.cms_has_permission('content.edit',bu.division_id)));

create or replace function public.cms_guard_service_status()
returns trigger language plpgsql security invoker
set search_path = pg_catalog, public
as $function$
declare
  division_value uuid;
  permission_value text;
  names_count integer;
  descriptions_count integer;
begin
  select bu.division_id into division_value
  from public.categories c join public.business_units bu on bu.id=c.business_unit_id
  where c.id=new.category_id;
  if division_value is null then raise exception 'Service category is invalid' using errcode='23503'; end if;

  if tg_op='INSERT' then
    permission_value := case new.status when 'published' then 'content.publish' when 'review' then 'content.submit_review' else 'content.create' end;
  elsif old.status is distinct from new.status then
    permission_value := case new.status when 'published' then 'content.publish' when 'review' then 'content.submit_review' when 'archived' then 'content.archive' else 'content.edit' end;
  else
    permission_value := 'content.edit';
  end if;
  if not public.cms_has_permission(permission_value,division_value) then
    raise exception 'Insufficient permission for service operation' using errcode='42501';
  end if;

  if new.status='published' and (tg_op='INSERT' or old.status is distinct from 'published') then
    select count(*) filter (where field_name='name'), count(*) filter (where field_name='description')
    into names_count, descriptions_count
    from public.content_translations where service_id=new.id and locale_code in ('en','fr');
    if names_count < 2 or descriptions_count < 2 then
      raise exception 'English and French service names and descriptions are required before publishing' using errcode='23514';
    end if;
    if not new.is_active then raise exception 'Activate the service before publishing' using errcode='23514'; end if;
    new.published_at := coalesce(new.published_at,now());
  elsif new.status <> 'published' then
    new.published_at := null;
  end if;
  new.updated_at := now();
  return new;
end;
$function$;
create trigger cms_services_status_guard
  before insert or update on public.services
  for each row execute function public.cms_guard_service_status();

commit;
