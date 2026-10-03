alter table public.categories
  add column if not exists is_active boolean not null default true;

alter table public.products
  add column if not exists search_document tsvector generated always as (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) stored;

create index if not exists products_status_created_at_idx
  on public.products(status, created_at desc);
create index if not exists products_search_document_idx
  on public.products using gin(search_document);
create index if not exists categories_parent_id_idx
  on public.categories(parent_id);
create index if not exists product_images_product_sort_idx
  on public.product_images(product_id, sort_order);
create index if not exists supplier_verifications_company_idx
  on public.supplier_verifications(supplier_company_id);
create index if not exists rfq_items_rfq_idx
  on public.rfq_items(rfq_id);
create index if not exists order_items_order_idx
  on public.order_items(order_id);
create index if not exists shipments_order_idx
  on public.shipments(order_id);
create index if not exists messages_thread_created_idx
  on public.messages(thread_id, created_at desc);
create index if not exists favorites_product_idx
  on public.favorites(product_id);
create index if not exists reviews_supplier_idx
  on public.reviews(supplier_company_id);
create index if not exists disputes_order_idx
  on public.disputes(order_id);

create unique index if not exists supplier_companies_owner_id_unique
  on public.supplier_companies(owner_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.app_role;
  company_name text;
begin
  requested_role := case
    when new.raw_user_meta_data ->> 'role' = 'supplier' then 'supplier'::public.app_role
    else 'buyer'::public.app_role
  end;
  company_name := nullif(trim(new.raw_user_meta_data ->> 'company'), '');

  insert into public.profiles (id, full_name, email, phone, company, country, role, status)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    new.email,
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    company_name,
    nullif(trim(new.raw_user_meta_data ->> 'country'), ''),
    requested_role,
    'pending'
  )
  on conflict (id) do nothing;

  if requested_role = 'supplier' and company_name is not null then
    insert into public.supplier_companies (owner_id, company_name, slug, country, verification_status)
    values (
      new.id,
      company_name,
      trim(both '-' from lower(regexp_replace(company_name, '[^a-zA-Z0-9]+', '-', 'g'))) || '-' || left(new.id::text, 8),
      nullif(trim(new.raw_user_meta_data ->> 'country'), ''),
      'pending'
    )
    on conflict (owner_id) do nothing;
  end if;

  return new;
end;
$$;

create or replace function public.guard_profile_privilege_changes()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is not null
    and old.id = auth.uid()
    and not public.is_admin()
    and (new.role is distinct from old.role
      or new.status is distinct from old.status
      or new.verification_status is distinct from old.verification_status)
  then
    raise exception 'Profile privilege fields cannot be changed by the profile owner';
  end if;
  if auth.uid() is not null and old.id = auth.uid() and not public.is_admin() then
    new.email := old.email;
  end if;
  return new;
end;
$$;

create trigger profiles_guard_privileges
  before update on public.profiles
  for each row execute function public.guard_profile_privilege_changes();

create or replace function public.guard_supplier_verification_changes()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is not null
    and old.owner_id = auth.uid()
    and not public.is_admin()
    and (new.verification_status is distinct from old.verification_status
      or new.owner_id is distinct from old.owner_id)
  then
    raise exception 'Supplier ownership and verification can only be changed by an administrator';
  end if;
  return new;
end;
$$;

create trigger supplier_companies_guard_verification
  before update on public.supplier_companies
  for each row execute function public.guard_supplier_verification_changes();

create or replace function public.guard_product_publication()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  supplier_verified boolean;
begin
  if new.status = 'published'
    and auth.uid() is not null
    and not public.is_admin()
    and exists (select 1 from public.supplier_companies sc where sc.id = new.supplier_company_id and sc.owner_id = auth.uid())
  then
    select sc.verification_status = 'verified'
      into supplier_verified
      from public.supplier_companies sc
      where sc.id = new.supplier_company_id;
    if not coalesce(supplier_verified, false) then
      raise exception 'Only verified suppliers may publish products';
    end if;
  end if;
  return new;
end;
$$;

create trigger products_guard_publication
  before insert or update of status, supplier_company_id on public.products
  for each row execute function public.guard_product_publication();

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select using (is_active or public.is_admin());

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (
    (status = 'published' and exists (
      select 1 from public.supplier_companies sc
      where sc.id = supplier_company_id and sc.verification_status = 'verified'
    ))
    and (category_id is null or exists (
      select 1 from public.categories c where c.id = category_id and c.is_active
    ))
    or public.is_admin()
    or exists (
      select 1 from public.supplier_companies sc
      where sc.id = supplier_company_id and sc.owner_id = auth.uid()
    )
  );

drop policy if exists product_images_public_read on public.product_images;
create policy product_images_public_read on public.product_images
  for select using (exists (
    select 1 from public.products p
    join public.supplier_companies sc on sc.id = p.supplier_company_id
    where p.id = product_id and (
      (p.status = 'published' and sc.verification_status = 'verified')
      or public.is_admin()
      or sc.owner_id = auth.uid()
    )
  ));

revoke select on table public.supplier_companies from anon, authenticated;
grant select (
  id, company_name, slug, description, country, address, website,
  business_type, years_in_business, logo_url, verification_status, created_at, updated_at
) on table public.supplier_companies to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('supplier-logos', 'supplier-logos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('user-avatars', 'user-avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy product_images_storage_read on storage.objects
  for select using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.products p
      join public.supplier_companies sc on sc.id = p.supplier_company_id
      where p.id::text = split_part(name, '/', 1)
        and ((p.status = 'published' and sc.verification_status = 'verified')
          or sc.owner_id = auth.uid() or public.is_admin())
    )
  );
create policy product_images_storage_insert on storage.objects
  for insert with check (
    bucket_id = 'product-images'
    and (public.is_admin() or exists (
      select 1 from public.products p
      join public.supplier_companies sc on sc.id = p.supplier_company_id
      where p.id::text = split_part(name, '/', 1) and sc.owner_id = auth.uid()
    ))
  );
create policy product_images_storage_update on storage.objects
  for update using (
    bucket_id = 'product-images'
    and (public.is_admin() or exists (
      select 1 from public.products p
      join public.supplier_companies sc on sc.id = p.supplier_company_id
      where p.id::text = split_part(name, '/', 1) and sc.owner_id = auth.uid()
    ))
  ) with check (
    bucket_id = 'product-images'
    and (public.is_admin() or exists (
      select 1 from public.products p
      join public.supplier_companies sc on sc.id = p.supplier_company_id
      where p.id::text = split_part(name, '/', 1) and sc.owner_id = auth.uid()
    ))
  );
create policy product_images_storage_delete on storage.objects
  for delete using (
    bucket_id = 'product-images'
    and (public.is_admin() or exists (
      select 1 from public.products p
      join public.supplier_companies sc on sc.id = p.supplier_company_id
      where p.id::text = split_part(name, '/', 1) and sc.owner_id = auth.uid()
    ))
  );

create policy supplier_logos_storage_read on storage.objects
  for select using (
    bucket_id = 'supplier-logos'
    and exists (
      select 1 from public.supplier_companies sc
      where sc.id::text = split_part(name, '/', 1)
        and (sc.verification_status = 'verified' or sc.owner_id = auth.uid() or public.is_admin())
    )
  );
create policy supplier_logos_storage_insert on storage.objects
  for insert with check (
    bucket_id = 'supplier-logos'
    and (public.is_admin() or exists (
      select 1 from public.supplier_companies sc
      where sc.id::text = split_part(name, '/', 1) and sc.owner_id = auth.uid()
    ))
  );
create policy supplier_logos_storage_update on storage.objects
  for update using (
    bucket_id = 'supplier-logos'
    and (public.is_admin() or exists (
      select 1 from public.supplier_companies sc
      where sc.id::text = split_part(name, '/', 1) and sc.owner_id = auth.uid()
    ))
  ) with check (
    bucket_id = 'supplier-logos'
    and (public.is_admin() or exists (
      select 1 from public.supplier_companies sc
      where sc.id::text = split_part(name, '/', 1) and sc.owner_id = auth.uid()
    ))
  );
create policy supplier_logos_storage_delete on storage.objects
  for delete using (
    bucket_id = 'supplier-logos'
    and (public.is_admin() or exists (
      select 1 from public.supplier_companies sc
      where sc.id::text = split_part(name, '/', 1) and sc.owner_id = auth.uid()
    ))
  );

create policy user_avatars_storage_read on storage.objects
  for select using (bucket_id = 'user-avatars' and (split_part(name, '/', 1) = auth.uid()::text or public.is_admin()));
create policy user_avatars_storage_insert on storage.objects
  for insert with check (bucket_id = 'user-avatars' and (split_part(name, '/', 1) = auth.uid()::text or public.is_admin()));
create policy user_avatars_storage_update on storage.objects
  for update using (bucket_id = 'user-avatars' and (split_part(name, '/', 1) = auth.uid()::text or public.is_admin()))
  with check (bucket_id = 'user-avatars' and (split_part(name, '/', 1) = auth.uid()::text or public.is_admin()));
create policy user_avatars_storage_delete on storage.objects
  for delete using (bucket_id = 'user-avatars' and (split_part(name, '/', 1) = auth.uid()::text or public.is_admin()));
