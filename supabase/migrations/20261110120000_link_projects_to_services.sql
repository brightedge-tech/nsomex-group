-- Link portfolio projects to an optional catalogue service.
-- Existing projects remain valid and can continue to be grouped by business unit.
begin;

alter table public.projects
  add column service_id uuid references public.services(id) on delete set null;

create index projects_service_status_order_idx
  on public.projects (service_id, status, sort_order, updated_at desc)
  where service_id is not null;

comment on column public.projects.service_id is
  'Optional catalogue service this verified portfolio project demonstrates.';

commit;
