-- NSOMEX Group public contact enquiry submissions.
-- Apply manually in the Supabase SQL Editor after reviewing this migration.

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (char_length(trim(email)) between 3 and 254),
  organization text check (organization is null or char_length(organization) <= 160),
  country text check (country is null or char_length(country) <= 100),
  enquiry_type text not null default 'general'
    check (enquiry_type in ('general', 'partnership', 'project', 'supplier', 'other')),
  message text not null check (char_length(trim(message)) between 10 and 5000),
  locale text not null default 'en' check (locale in ('en', 'fr')),
  created_at timestamptz not null default now()
);

alter table public.contact_enquiries enable row level security;

revoke all on table public.contact_enquiries from anon, authenticated;
grant insert on table public.contact_enquiries to anon, authenticated;

drop policy if exists "Public can submit contact enquiries" on public.contact_enquiries;

create policy "Public can submit contact enquiries"
  on public.contact_enquiries
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT, UPDATE, or DELETE policy is created for public visitors.
