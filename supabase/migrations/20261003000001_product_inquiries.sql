create table if not exists public.product_inquiries (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  supplier_company_id uuid not null references public.supplier_companies(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  subject text not null check (char_length(subject) between 3 and 120),
  message text not null check (char_length(message) between 10 and 2000),
  quantity numeric(14, 2) not null check (quantity > 0),
  status text not null default 'pending' check (status in ('pending', 'viewed', 'responded', 'closed')),
  response_text text check (response_text is null or char_length(response_text) <= 4000),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists product_inquiries_buyer_created_idx
  on public.product_inquiries (buyer_id, created_at desc);
create index if not exists product_inquiries_supplier_created_idx
  on public.product_inquiries (supplier_company_id, created_at desc);
create index if not exists product_inquiries_product_idx
  on public.product_inquiries (product_id);
create index if not exists product_inquiries_status_created_idx
  on public.product_inquiries (status, created_at desc);

alter table public.product_inquiries enable row level security;

revoke all on public.product_inquiries from PUBLIC, anon, authenticated;
grant select, insert, update on public.product_inquiries to authenticated;

drop policy if exists product_inquiries_participant_read on public.product_inquiries;
create policy product_inquiries_participant_read on public.product_inquiries
  for select to authenticated
  using (
    buyer_id = auth.uid()
    or exists (
      select 1 from public.supplier_companies sc
      where sc.id = supplier_company_id and sc.owner_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists product_inquiries_buyer_insert on public.product_inquiries;
create policy product_inquiries_buyer_insert on public.product_inquiries
  for insert to authenticated
  with check (
    buyer_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'buyer'
    )
  );

drop policy if exists product_inquiries_participant_update on public.product_inquiries;
create policy product_inquiries_participant_update on public.product_inquiries
  for update to authenticated
  using (
    buyer_id = auth.uid()
    or exists (
      select 1 from public.supplier_companies sc
      where sc.id = supplier_company_id and sc.owner_id = auth.uid()
    )
    or public.is_admin()
  )
  with check (
    buyer_id = auth.uid()
    or exists (
      select 1 from public.supplier_companies sc
      where sc.id = supplier_company_id and sc.owner_id = auth.uid()
    )
    or public.is_admin()
  );

create or replace function public.guard_product_inquiry()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  product_supplier_id uuid;
  supplier_is_verified boolean;
  recent_count integer;
begin
  if tg_op = 'INSERT' then
    if auth.uid() is null or new.buyer_id <> auth.uid() then
      raise exception 'Inquiry buyer must be the authenticated user';
    end if;

    select p.supplier_company_id, sc.verification_status = 'verified'
      into product_supplier_id, supplier_is_verified
      from public.products p
      join public.supplier_companies sc on sc.id = p.supplier_company_id
      where p.id = new.product_id and p.status = 'published';

    if product_supplier_id is null or not coalesce(supplier_is_verified, false) then
      raise exception 'Product is unavailable for inquiries';
    end if;
    new.supplier_company_id := product_supplier_id;

    perform pg_advisory_xact_lock(hashtextextended(new.buyer_id::text, 0));

    select count(*) into recent_count
      from public.product_inquiries pi
      where pi.buyer_id = new.buyer_id
        and pi.created_at >= now() - interval '10 minutes';
    if recent_count >= 5 then
      raise exception 'Inquiry rate limit reached';
    end if;

    if exists (
      select 1 from public.product_inquiries pi
      where pi.buyer_id = new.buyer_id
        and pi.product_id = new.product_id
        and lower(trim(pi.message)) = lower(trim(new.message))
        and pi.created_at >= now() - interval '24 hours'
    ) then
      raise exception 'Duplicate inquiry';
    end if;
    return new;
  end if;

  if public.is_admin() then
    new.updated_at := timezone('utc', now());
    return new;
  end if;

  if new.id is distinct from old.id
    or new.buyer_id is distinct from old.buyer_id
    or new.supplier_company_id is distinct from old.supplier_company_id
    or new.product_id is distinct from old.product_id
    or new.subject is distinct from old.subject
    or new.message is distinct from old.message
    or new.quantity is distinct from old.quantity
    or new.created_at is distinct from old.created_at
  then
    raise exception 'Inquiry details cannot be changed after submission';
  end if;

  if auth.uid() = old.buyer_id then
    if new.status <> 'closed' or new.response_text is distinct from old.response_text then
      raise exception 'Buyers may only close their own inquiries';
    end if;
  elsif exists (
    select 1 from public.supplier_companies sc
    where sc.id = old.supplier_company_id and sc.owner_id = auth.uid()
  ) then
    if new.status not in ('viewed', 'responded', 'closed') then
      raise exception 'Invalid supplier inquiry status';
    end if;
    if old.status = 'closed' and new.status <> 'closed' then
      raise exception 'Closed inquiries cannot be reopened';
    end if;
    if old.status = 'responded' and new.status in ('pending', 'viewed') then
      raise exception 'Responded inquiries cannot return to an earlier status';
    end if;
    if new.status = 'responded' and (new.response_text is null or length(trim(new.response_text)) = 0) then
      raise exception 'A supplier response is required for responded inquiries';
    end if;
    if new.response_text is distinct from old.response_text and new.status <> 'responded' then
      raise exception 'Supplier responses must be submitted with responded status';
    end if;
  else
    raise exception 'Only an inquiry participant may update it';
  end if;

  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists product_inquiries_guard on public.product_inquiries;
create trigger product_inquiries_guard
  before insert or update on public.product_inquiries
  for each row execute function public.guard_product_inquiry();

create or replace function public.notify_product_inquiry_participants()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  supplier_owner_id uuid;
  product_name text;
begin
  if tg_op = 'INSERT' then
    select sc.owner_id, p.name
      into supplier_owner_id, product_name
      from public.supplier_companies sc
      join public.products p on p.supplier_company_id = sc.id
      where sc.id = new.supplier_company_id and p.id = new.product_id;
    if supplier_owner_id is not null then
      insert into public.notifications (user_id, title, body)
      values (supplier_owner_id, 'New product inquiry', 'A buyer sent an inquiry about ' || product_name || '.');
    end if;
  elsif old.status is distinct from new.status and new.status = 'responded' then
    insert into public.notifications (user_id, title, body)
    values (new.buyer_id, 'Supplier response received', 'A supplier responded to your inquiry: ' || new.subject || '.');
  end if;
  return new;
end;
$$;

drop trigger if exists product_inquiries_notify_participants on public.product_inquiries;
create trigger product_inquiries_notify_participants
  after insert or update on public.product_inquiries
  for each row execute function public.notify_product_inquiry_participants();
