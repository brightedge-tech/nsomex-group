-- NSOMEX Group initial bilingual CMS content foundation.
-- Creates the core hierarchy only; no speculative business units or services are seeded.
-- Public clients can read active content. Writes remain server-side until CMS roles are implemented.

begin;

create table public.locales (
  code text primary key check (code ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  name text not null check (char_length(trim(name)) between 2 and 80),
  is_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.locales (code, name, is_enabled)
values
  ('en', 'English', true),
  ('fr', 'Français', true);

create table public.divisions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_units (
  id uuid primary key default gen_random_uuid(),
  division_id uuid not null references public.divisions(id) on delete cascade,
  code text not null check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_units_division_code_key unique (division_id, code),
  constraint business_units_division_slug_key unique (division_id, slug)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  business_unit_id uuid not null references public.business_units(id) on delete cascade,
  parent_id uuid,
  code text not null check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_business_unit_code_key unique (business_unit_id, code),
  constraint categories_business_unit_slug_key unique (business_unit_id, slug),
  constraint categories_id_business_unit_key unique (id, business_unit_id),
  constraint categories_parent_same_business_unit_fkey
    foreign key (parent_id, business_unit_id)
    references public.categories (id, business_unit_id)
    on delete cascade
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  code text not null check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_category_code_key unique (category_id, code),
  constraint services_category_slug_key unique (category_id, slug)
);

-- A translation belongs to exactly one content record. Separate nullable FK columns
-- preserve referential integrity without an unsafe polymorphic entity_id.
create table public.content_translations (
  id uuid primary key default gen_random_uuid(),
  division_id uuid references public.divisions(id) on delete cascade,
  business_unit_id uuid references public.business_units(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  locale_code text not null references public.locales(code) on update cascade on delete restrict,
  field_name text not null check (field_name in ('name', 'summary', 'description')),
  content text not null check (char_length(btrim(content)) between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_translations_exactly_one_parent_check
    check (num_nonnulls(division_id, business_unit_id, category_id, service_id) = 1)
);

create unique index content_translations_division_locale_field_uidx
  on public.content_translations (division_id, locale_code, field_name)
  where division_id is not null;
create unique index content_translations_business_unit_locale_field_uidx
  on public.content_translations (business_unit_id, locale_code, field_name)
  where business_unit_id is not null;
create unique index content_translations_category_locale_field_uidx
  on public.content_translations (category_id, locale_code, field_name)
  where category_id is not null;
create unique index content_translations_service_locale_field_uidx
  on public.content_translations (service_id, locale_code, field_name)
  where service_id is not null;

create index business_units_active_order_idx
  on public.business_units (division_id, sort_order, id)
  where is_active;
create index categories_active_order_idx
  on public.categories (business_unit_id, parent_id, sort_order, id)
  where is_active;
create index services_active_order_idx
  on public.services (category_id, sort_order, id)
  where is_active;

-- Seed only the four confirmed NSOMEX Group divisions. Business units, categories,
-- and services remain empty until their actual content is approved.
insert into public.divisions (id, code, slug, sort_order, is_active)
values
  ('10000000-0000-4000-8000-000000000001', 'technology', 'technology', 1, true),
  ('10000000-0000-4000-8000-000000000002', 'engineering', 'engineering', 2, true),
  ('10000000-0000-4000-8000-000000000003', 'renewable-energy', 'renewable-energy', 3, true),
  ('10000000-0000-4000-8000-000000000004', 'global-business', 'global-business', 4, true);

insert into public.content_translations (division_id, locale_code, field_name, content)
values
  ('10000000-0000-4000-8000-000000000001', 'en', 'name', 'NSOMEX Technology'),
  ('10000000-0000-4000-8000-000000000001', 'fr', 'name', 'NSOMEX Technology'),
  ('10000000-0000-4000-8000-000000000002', 'en', 'name', 'NSOMEX Engineering'),
  ('10000000-0000-4000-8000-000000000002', 'fr', 'name', 'NSOMEX Engineering'),
  ('10000000-0000-4000-8000-000000000003', 'en', 'name', 'NSOMEX Renewable Energy'),
  ('10000000-0000-4000-8000-000000000003', 'fr', 'name', 'NSOMEX Énergies renouvelables'),
  ('10000000-0000-4000-8000-000000000004', 'en', 'name', 'NSOMEX Global Business'),
  ('10000000-0000-4000-8000-000000000004', 'fr', 'name', 'NSOMEX Global Business');

-- All CMS tables use RLS. Public access is read-only and limited to active content.
alter table public.locales enable row level security;
alter table public.divisions enable row level security;
alter table public.business_units enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.content_translations enable row level security;

revoke all on table
  public.locales,
  public.divisions,
  public.business_units,
  public.categories,
  public.services,
  public.content_translations
from anon, authenticated;

grant select on table
  public.locales,
  public.divisions,
  public.business_units,
  public.categories,
  public.services,
  public.content_translations
to anon, authenticated;

create policy "Public can read enabled locales"
  on public.locales for select to anon, authenticated
  using (is_enabled);

create policy "Public can read active divisions"
  on public.divisions for select to anon, authenticated
  using (is_active);

create policy "Public can read active business units"
  on public.business_units for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.divisions d
      where d.id = division_id and d.is_active
    )
  );

create policy "Public can read active categories"
  on public.categories for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1
      from public.business_units bu
      join public.divisions d on d.id = bu.division_id
      where bu.id = business_unit_id
        and bu.is_active
        and d.is_active
    )
  );

create policy "Public can read active services"
  on public.services for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1
      from public.categories c
      join public.business_units bu on bu.id = c.business_unit_id
      join public.divisions d on d.id = bu.division_id
      where c.id = category_id
        and c.is_active
        and bu.is_active
        and d.is_active
    )
  );

create policy "Public can read translations for active content"
  on public.content_translations for select to anon, authenticated
  using (
    exists (
      select 1 from public.locales l
      where l.code = locale_code and l.is_enabled
    )
    and (
      (division_id is not null and exists (
        select 1 from public.divisions d
        where d.id = division_id and d.is_active
      ))
      or
      (business_unit_id is not null and exists (
        select 1
        from public.business_units bu
        join public.divisions d on d.id = bu.division_id
        where bu.id = business_unit_id and bu.is_active and d.is_active
      ))
      or
      (category_id is not null and exists (
        select 1
        from public.categories c
        join public.business_units bu on bu.id = c.business_unit_id
        join public.divisions d on d.id = bu.division_id
        where c.id = category_id and c.is_active and bu.is_active and d.is_active
      ))
      or
      (service_id is not null and exists (
        select 1
        from public.services s
        join public.categories c on c.id = s.category_id
        join public.business_units bu on bu.id = c.business_unit_id
        join public.divisions d on d.id = bu.division_id
        where s.id = service_id
          and s.is_active
          and c.is_active
          and bu.is_active
          and d.is_active
      ))
    )
  );

comment on table public.locales is 'Enabled languages used by NSOMEX Group content.';
comment on table public.divisions is 'Top-level NSOMEX Group business divisions.';
comment on table public.business_units is 'Business units owned by a division.';
comment on table public.categories is 'Hierarchical categories within a business unit.';
comment on table public.services is 'Services listed under a category.';
comment on table public.content_translations is 'English, French, and future locale values for CMS content fields.';

commit;
