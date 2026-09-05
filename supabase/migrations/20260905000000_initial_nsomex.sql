create extension if not exists pgcrypto;

create type public.app_role as enum ('buyer', 'supplier', 'admin');
create type public.account_status as enum ('active', 'pending', 'suspended', 'disabled');
create type public.verification_status as enum ('pending', 'under_review', 'verified', 'rejected', 'suspended');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  country text,
  preferred_language text not null default 'en',
  company text,
  avatar_url text,
  role public.app_role not null default 'buyer',
  status public.account_status not null default 'pending',
  verification_status public.verification_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.supplier_companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  slug text not null unique,
  description text,
  country text,
  address text,
  website text,
  contact_email text,
  contact_phone text,
  business_type text,
  years_in_business integer check (years_in_business is null or years_in_business >= 0),
  logo_url text,
  verification_status public.verification_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.supplier_verifications (
  id uuid primary key default gen_random_uuid(),
  supplier_company_id uuid not null references public.supplier_companies(id) on delete cascade,
  status public.verification_status not null default 'pending',
  reviewer_id uuid references public.profiles(id) on delete set null,
  notes text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  supplier_company_id uuid not null references public.supplier_companies(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(14, 2),
  currency text not null default 'USD',
  minimum_order_quantity numeric(14, 2) not null default 1 check (minimum_order_quantity > 0),
  stock numeric(14, 2) not null default 0 check (stock >= 0),
  unit text not null default 'unit',
  specifications jsonb not null default '{}'::jsonb,
  shipping_information text,
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'suspended')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.rfqs (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category_id uuid references public.categories(id) on delete set null,
  quantity numeric(14, 2) not null check (quantity > 0),
  requirements text,
  destination text,
  status text not null default 'draft' check (status in ('draft', 'published', 'receiving_quotes', 'negotiating', 'closed')),
  deadline date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.rfq_items (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text not null,
  quantity numeric(14, 2) not null check (quantity > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  supplier_company_id uuid not null references public.supplier_companies(id) on delete restrict,
  rfq_id uuid references public.rfqs(id) on delete set null,
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null default 'USD',
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'under_review')),
  order_status text not null default 'awaiting_payment' check (order_status in ('awaiting_payment', 'processing', 'completed', 'cancelled', 'disputed')),
  shipping_status text not null default 'preparing' check (shipping_status in ('preparing', 'in_transit', 'customs', 'delivered')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity numeric(14, 2) not null check (quantity > 0),
  unit_price numeric(14, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  tracking_number text unique,
  carrier text,
  origin text,
  destination text,
  status text not null default 'preparing' check (status in ('preparing', 'in_transit', 'customs', 'delivered')),
  estimated_delivery date,
  tracking_events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, product_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  supplier_company_id uuid references public.supplier_companies(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'published', 'hidden')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  opened_by uuid not null references public.profiles(id) on delete cascade,
  issue text not null,
  description text not null,
  status text not null default 'open' check (status in ('open', 'under_review', 'resolved', 'rejected')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index products_category_idx on public.products(category_id);
create index products_supplier_idx on public.products(supplier_company_id);
create index rfqs_buyer_idx on public.rfqs(buyer_id);
create index orders_buyer_idx on public.orders(buyer_id);
create index orders_supplier_idx on public.orders(supplier_company_id);
create index messages_recipient_idx on public.messages(recipient_id);
create index notifications_user_idx on public.notifications(user_id);

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger supplier_companies_updated_at before update on public.supplier_companies for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger rfqs_updated_at before update on public.rfqs for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger shipments_updated_at before update on public.shipments for each row execute function public.set_updated_at();
create trigger reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create trigger disputes_updated_at before update on public.disputes for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, company, country, role, status)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email, new.raw_user_meta_data ->> 'company', new.raw_user_meta_data ->> 'country', case when new.raw_user_meta_data ->> 'role' = 'supplier' then 'supplier'::public.app_role else 'buyer'::public.app_role end, 'pending');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.supplier_companies enable row level security;
alter table public.supplier_verifications enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipments enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;
alter table public.disputes enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create policy profiles_read_own on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
create policy categories_public_read on public.categories for select using (true);
create policy products_public_read on public.products for select using (status = 'published' or public.is_admin() or exists (select 1 from public.supplier_companies sc where sc.id = supplier_company_id and sc.owner_id = auth.uid()));
create policy supplier_public_read on public.supplier_companies for select using (verification_status = 'verified' or owner_id = auth.uid() or public.is_admin());
create policy supplier_owner_manage on public.supplier_companies for all using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
create policy product_owner_manage on public.products for all using (public.is_admin() or exists (select 1 from public.supplier_companies sc where sc.id = supplier_company_id and sc.owner_id = auth.uid())) with check (public.is_admin() or exists (select 1 from public.supplier_companies sc where sc.id = supplier_company_id and sc.owner_id = auth.uid()));
create policy product_images_public_read on public.product_images for select using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin() or exists (select 1 from public.supplier_companies sc where sc.id = p.supplier_company_id and sc.owner_id = auth.uid()))));
create policy product_images_owner_manage on public.product_images for all using (public.is_admin() or exists (select 1 from public.products p join public.supplier_companies sc on sc.id = p.supplier_company_id where p.id = product_id and sc.owner_id = auth.uid())) with check (public.is_admin() or exists (select 1 from public.products p join public.supplier_companies sc on sc.id = p.supplier_company_id where p.id = product_id and sc.owner_id = auth.uid()));
create policy buyer_rfqs_manage on public.rfqs for all using (buyer_id = auth.uid() or public.is_admin()) with check (buyer_id = auth.uid() or public.is_admin());
create policy rfq_items_participant_manage on public.rfq_items for all using (public.is_admin() or exists (select 1 from public.rfqs r where r.id = rfq_id and r.buyer_id = auth.uid())) with check (public.is_admin() or exists (select 1 from public.rfqs r where r.id = rfq_id and r.buyer_id = auth.uid()));
create policy buyer_orders_read on public.orders for select using (buyer_id = auth.uid() or public.is_admin() or exists (select 1 from public.supplier_companies sc where sc.id = supplier_company_id and sc.owner_id = auth.uid()));
create policy order_items_participant_read on public.order_items for select using (public.is_admin() or exists (select 1 from public.orders o where o.id = order_id and (o.buyer_id = auth.uid() or exists (select 1 from public.supplier_companies sc where sc.id = o.supplier_company_id and sc.owner_id = auth.uid()))));
create policy supplier_verification_participant_read on public.supplier_verifications for select using (public.is_admin() or exists (select 1 from public.supplier_companies sc where sc.id = supplier_company_id and sc.owner_id = auth.uid()));
create policy supplier_verification_admin_manage on public.supplier_verifications for all using (public.is_admin()) with check (public.is_admin());
create policy own_favorites_manage on public.favorites for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy own_notifications_read on public.notifications for select using (user_id = auth.uid() or public.is_admin());
create policy own_messages_read on public.messages for select using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_admin());
create policy own_reviews_manage on public.reviews for all using (author_id = auth.uid() or public.is_admin()) with check (author_id = auth.uid() or public.is_admin());
create policy own_disputes_manage on public.disputes for all using (opened_by = auth.uid() or public.is_admin()) with check (opened_by = auth.uid() or public.is_admin());
create policy shipment_order_participant_read on public.shipments for select using (public.is_admin() or exists (select 1 from public.orders o where o.id = order_id and (o.buyer_id = auth.uid() or exists (select 1 from public.supplier_companies sc where sc.id = o.supplier_company_id and sc.owner_id = auth.uid()))));
