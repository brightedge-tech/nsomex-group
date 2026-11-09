-- Enable scoped editing for the core NSOMEX business catalogue.
-- Writes remain authenticated and are constrained by cms_has_permission + RLS.
BEGIN;

GRANT INSERT, UPDATE ON TABLE
  public.divisions,
  public.business_units,
  public.categories,
  public.services,
  public.content_translations
TO authenticated;

CREATE POLICY "Authorized admins can create divisions"
  ON public.divisions FOR INSERT TO authenticated
  WITH CHECK (public.cms_has_permission('content.create', NULL));

CREATE POLICY "Authorized admins can update divisions"
  ON public.divisions FOR UPDATE TO authenticated
  USING (public.cms_has_permission('content.edit', id))
  WITH CHECK (public.cms_has_permission('content.edit', id));

CREATE POLICY "Authorized admins can create business units"
  ON public.business_units FOR INSERT TO authenticated
  WITH CHECK (public.cms_has_permission('content.create', division_id));

CREATE POLICY "Authorized admins can update business units"
  ON public.business_units FOR UPDATE TO authenticated
  USING (public.cms_has_permission('content.edit', division_id))
  WITH CHECK (public.cms_has_permission('content.edit', division_id));

CREATE POLICY "Authorized admins can create categories"
  ON public.categories FOR INSERT TO authenticated
  WITH CHECK (
    public.cms_has_permission(
      'content.create',
      (SELECT bu.division_id FROM public.business_units bu WHERE bu.id = business_unit_id)
    )
  );

CREATE POLICY "Authorized admins can update categories"
  ON public.categories FOR UPDATE TO authenticated
  USING (
    public.cms_has_permission(
      'content.edit',
      (SELECT bu.division_id FROM public.business_units bu WHERE bu.id = business_unit_id)
    )
  )
  WITH CHECK (
    public.cms_has_permission(
      'content.edit',
      (SELECT bu.division_id FROM public.business_units bu WHERE bu.id = business_unit_id)
    )
  );

CREATE POLICY "Authorized admins can create services"
  ON public.services FOR INSERT TO authenticated
  WITH CHECK (
    public.cms_has_permission(
      'content.create',
      (SELECT bu.division_id
       FROM public.categories c
       JOIN public.business_units bu ON bu.id = c.business_unit_id
       WHERE c.id = category_id)
    )
  );

CREATE POLICY "Authorized admins can update services"
  ON public.services FOR UPDATE TO authenticated
  USING (
    public.cms_has_permission(
      'content.edit',
      (SELECT bu.division_id
       FROM public.categories c
       JOIN public.business_units bu ON bu.id = c.business_unit_id
       WHERE c.id = category_id)
    )
  )
  WITH CHECK (
    public.cms_has_permission(
      'content.edit',
      (SELECT bu.division_id
       FROM public.categories c
       JOIN public.business_units bu ON bu.id = c.business_unit_id
       WHERE c.id = category_id)
    )
  );

CREATE POLICY "Authorized admins can create core translations"
  ON public.content_translations FOR INSERT TO authenticated
  WITH CHECK (
    public.cms_has_permission(
      'content.create',
      COALESCE(
        division_id,
        (SELECT bu.division_id FROM public.business_units bu WHERE bu.id = business_unit_id),
        (SELECT bu.division_id
         FROM public.categories c
         JOIN public.business_units bu ON bu.id = c.business_unit_id
         WHERE c.id = category_id),
        (SELECT bu.division_id
         FROM public.services s
         JOIN public.categories c ON c.id = s.category_id
         JOIN public.business_units bu ON bu.id = c.business_unit_id
         WHERE s.id = service_id)
      )
    )
  );

CREATE POLICY "Authorized admins can update core translations"
  ON public.content_translations FOR UPDATE TO authenticated
  USING (
    public.cms_has_permission(
      'content.edit',
      COALESCE(
        division_id,
        (SELECT bu.division_id FROM public.business_units bu WHERE bu.id = business_unit_id),
        (SELECT bu.division_id
         FROM public.categories c
         JOIN public.business_units bu ON bu.id = c.business_unit_id
         WHERE c.id = category_id),
        (SELECT bu.division_id
         FROM public.services s
         JOIN public.categories c ON c.id = s.category_id
         JOIN public.business_units bu ON bu.id = c.business_unit_id
         WHERE s.id = service_id)
      )
    )
  )
  WITH CHECK (
    public.cms_has_permission(
      'content.edit',
      COALESCE(
        division_id,
        (SELECT bu.division_id FROM public.business_units bu WHERE bu.id = business_unit_id),
        (SELECT bu.division_id
         FROM public.categories c
         JOIN public.business_units bu ON bu.id = c.business_unit_id
         WHERE c.id = category_id),
        (SELECT bu.division_id
         FROM public.services s
         JOIN public.categories c ON c.id = s.category_id
         JOIN public.business_units bu ON bu.id = c.business_unit_id
         WHERE s.id = service_id)
      )
    )
  );

-- Capture immutable snapshots and audit events for catalogue edits.
CREATE OR REPLACE FUNCTION public.cms_capture_core_content_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
DECLARE
  entity_kind text;
  entity_key uuid;
  owning_division uuid;
  locale_key text := NULL;
  revision_no integer;
  row_snapshot jsonb;
  action_key text;
BEGIN
  entity_kind := CASE TG_TABLE_NAME
    WHEN 'divisions' THEN 'division'
    WHEN 'business_units' THEN 'business_unit'
    WHEN 'categories' THEN 'category'
    WHEN 'services' THEN 'service'
    ELSE 'division'
  END;

  IF TG_TABLE_NAME = 'content_translations' THEN
    entity_key := COALESCE(NEW.division_id, NEW.business_unit_id, NEW.category_id, NEW.service_id);
    locale_key := NEW.locale_code;
    IF NEW.division_id IS NOT NULL THEN
      entity_kind := 'division';
      owning_division := NEW.division_id;
    ELSIF NEW.business_unit_id IS NOT NULL THEN
      entity_kind := 'business_unit';
      SELECT division_id INTO owning_division FROM public.business_units WHERE id = NEW.business_unit_id;
    ELSIF NEW.category_id IS NOT NULL THEN
      entity_kind := 'category';
      SELECT bu.division_id INTO owning_division
      FROM public.categories c JOIN public.business_units bu ON bu.id = c.business_unit_id
      WHERE c.id = NEW.category_id;
    ELSE
      entity_kind := 'service';
      SELECT bu.division_id INTO owning_division
      FROM public.services s
      JOIN public.categories c ON c.id = s.category_id
      JOIN public.business_units bu ON bu.id = c.business_unit_id
      WHERE s.id = NEW.service_id;
    END IF;
  ELSE
    entity_key := NEW.id;
    IF TG_TABLE_NAME = 'divisions' THEN
      owning_division := NEW.id;
    ELSIF TG_TABLE_NAME = 'business_units' THEN
      owning_division := NEW.division_id;
    ELSIF TG_TABLE_NAME = 'categories' THEN
      SELECT division_id INTO owning_division FROM public.business_units WHERE id = NEW.business_unit_id;
    ELSIF TG_TABLE_NAME = 'services' THEN
      SELECT bu.division_id INTO owning_division
      FROM public.categories c JOIN public.business_units bu ON bu.id = c.business_unit_id
      WHERE c.id = NEW.category_id;
    END IF;
  END IF;

  row_snapshot := to_jsonb(NEW);
  action_key := CASE
    WHEN TG_OP = 'INSERT' THEN 'created'
    WHEN COALESCE(NEW.is_active, true) = false AND COALESCE(OLD.is_active, true) = true THEN 'archived'
    ELSE 'updated'
  END;

  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO revision_no
  FROM public.cms_content_revisions
  WHERE entity_type = entity_kind
    AND entity_id = entity_key
    AND COALESCE(locale_code, '') = COALESCE(locale_key, '');

  INSERT INTO public.cms_content_revisions
    (entity_type, entity_id, division_id, locale_code, revision_number, snapshot, created_by)
  VALUES
    (entity_kind, entity_key, owning_division, locale_key, revision_no, row_snapshot, auth.uid());

  INSERT INTO public.cms_audit_logs
    (actor_user_id, action, resource_type, resource_id, division_id, metadata)
  VALUES
    (auth.uid(), action_key, entity_kind, entity_key::text, owning_division,
     jsonb_build_object('table', TG_TABLE_NAME));

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.cms_capture_core_content_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER cms_divisions_revision_audit
  AFTER INSERT OR UPDATE ON public.divisions
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_core_content_change();
CREATE TRIGGER cms_business_units_revision_audit
  AFTER INSERT OR UPDATE ON public.business_units
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_core_content_change();
CREATE TRIGGER cms_categories_revision_audit
  AFTER INSERT OR UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_core_content_change();
CREATE TRIGGER cms_services_revision_audit
  AFTER INSERT OR UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_core_content_change();
CREATE TRIGGER cms_core_translations_revision_audit
  AFTER INSERT OR UPDATE ON public.content_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_core_content_change();

COMMIT;
