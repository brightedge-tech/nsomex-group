-- Safe development seed: this creates no auth users and no credentials.
-- Run after the initial migration and after creating a supplier account in Supabase Auth.

insert into public.categories (name, slug, description) values
  ('Industrial Equipment', 'industrial-equipment', 'Equipment for industrial operations.'),
  ('Construction Equipment', 'construction-equipment', 'Machinery and tools for construction.'),
  ('Renewable Energy', 'renewable-energy', 'Solar, storage, and clean energy products.'),
  ('Electrical Equipment', 'electrical-equipment', 'Electrical and industrial control equipment.')
on conflict (slug) do nothing;

-- Supplier/product demo rows are intentionally tied to an existing authenticated supplier profile.
insert into public.supplier_companies (owner_id, company_name, slug, country, business_type, verification_status)
select id, company, lower(regexp_replace(coalesce(company, 'supplier-' || id::text), '[^a-zA-Z0-9]+', '-', 'g')), country, 'Manufacturer', 'pending'
from public.profiles
where role = 'supplier' and company is not null
on conflict (slug) do nothing;

insert into public.products (supplier_company_id, category_id, name, slug, description, currency, minimum_order_quantity, unit, status)
select sc.id, c.id, 'Development Sample Product', 'development-sample-' || sc.id::text, 'A development-only sample product linked to an existing supplier account.', 'USD', 1, 'unit', 'draft'
from public.supplier_companies sc
join public.categories c on c.slug = 'industrial-equipment'
where not exists (select 1 from public.products p where p.slug = 'development-sample-' || sc.id::text);
