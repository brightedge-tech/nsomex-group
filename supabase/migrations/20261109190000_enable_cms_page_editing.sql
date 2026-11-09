-- NSOMEX Group CMS: secure page editing, division scope, workflow guards, and revision history.
-- Pages without a division are group-wide and can only be managed by super admins.

BEGIN;

ALTER TABLE public.pages
  ADD COLUMN division_id uuid REFERENCES public.divisions(id) ON DELETE RESTRICT;

CREATE INDEX pages_division_status_idx
  ON public.pages (division_id, status, navigation_order, slug);

GRANT SELECT, INSERT, UPDATE ON TABLE
  public.pages,
  public.page_translations,
  public.page_sections,
  public.page_section_translations
TO authenticated;

-- Admin read access includes drafts, but only within the administrator's scope.
CREATE POLICY "Authorized CMS users can read pages"
  ON public.pages FOR SELECT TO authenticated
  USING (public.cms_has_permission('content.read_draft', division_id));

CREATE POLICY "Authorized CMS users can read page translations"
  ON public.page_translations FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id
        AND public.cms_has_permission('content.read_draft', p.division_id)
    )
  );

CREATE POLICY "Authorized CMS users can read page sections"
  ON public.page_sections FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id
        AND public.cms_has_permission('content.read_draft', p.division_id)
    )
  );

CREATE POLICY "Authorized CMS users can read page section translations"
  ON public.page_section_translations FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.page_sections ps
      JOIN public.pages p ON p.id = ps.page_id
      WHERE ps.id = page_section_id
        AND public.cms_has_permission('content.read_draft', p.division_id)
    )
  );

CREATE POLICY "Authorized CMS users can create pages"
  ON public.pages FOR INSERT TO authenticated
  WITH CHECK (public.cms_has_permission('content.create', division_id));

CREATE POLICY "Authorized CMS users can update pages"
  ON public.pages FOR UPDATE TO authenticated
  USING (
    public.cms_has_permission('content.edit', division_id)
    OR public.cms_has_permission('content.submit_review', division_id)
    OR public.cms_has_permission('content.review', division_id)
    OR public.cms_has_permission('content.publish', division_id)
    OR public.cms_has_permission('content.archive', division_id)
  )
  WITH CHECK (
    public.cms_has_permission('content.edit', division_id)
    OR public.cms_has_permission('content.submit_review', division_id)
    OR public.cms_has_permission('content.review', division_id)
    OR public.cms_has_permission('content.publish', division_id)
    OR public.cms_has_permission('content.archive', division_id)
  );

CREATE POLICY "Authorized CMS users can create page translations"
  ON public.page_translations FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id
        AND public.cms_has_permission('content.create', p.division_id)
    )
  );

CREATE POLICY "Authorized CMS users can update page translations"
  ON public.page_translations FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id
        AND (
          public.cms_has_permission('content.edit', p.division_id)
          OR public.cms_has_permission('content.submit_review', p.division_id)
          OR public.cms_has_permission('content.review', p.division_id)
          OR public.cms_has_permission('content.publish', p.division_id)
          OR public.cms_has_permission('content.archive', p.division_id)
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id
        AND (
          public.cms_has_permission('content.edit', p.division_id)
          OR public.cms_has_permission('content.submit_review', p.division_id)
          OR public.cms_has_permission('content.review', p.division_id)
          OR public.cms_has_permission('content.publish', p.division_id)
          OR public.cms_has_permission('content.archive', p.division_id)
        )
    )
  );

CREATE POLICY "Authorized CMS users can create page sections"
  ON public.page_sections FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id
        AND public.cms_has_permission('content.create', p.division_id)
    )
  );

CREATE POLICY "Authorized CMS users can update page sections"
  ON public.page_sections FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id
        AND (
          public.cms_has_permission('content.edit', p.division_id)
          OR public.cms_has_permission('content.submit_review', p.division_id)
          OR public.cms_has_permission('content.review', p.division_id)
          OR public.cms_has_permission('content.publish', p.division_id)
          OR public.cms_has_permission('content.archive', p.division_id)
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id
        AND (
          public.cms_has_permission('content.edit', p.division_id)
          OR public.cms_has_permission('content.submit_review', p.division_id)
          OR public.cms_has_permission('content.review', p.division_id)
          OR public.cms_has_permission('content.publish', p.division_id)
          OR public.cms_has_permission('content.archive', p.division_id)
        )
    )
  );

CREATE POLICY "Authorized CMS users can create page section translations"
  ON public.page_section_translations FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.page_sections ps
      JOIN public.pages p ON p.id = ps.page_id
      WHERE ps.id = page_section_id
        AND public.cms_has_permission('content.create', p.division_id)
    )
  );

CREATE POLICY "Authorized CMS users can update page section translations"
  ON public.page_section_translations FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.page_sections ps
      JOIN public.pages p ON p.id = ps.page_id
      WHERE ps.id = page_section_id
        AND (
          public.cms_has_permission('content.edit', p.division_id)
          OR public.cms_has_permission('content.submit_review', p.division_id)
          OR public.cms_has_permission('content.review', p.division_id)
          OR public.cms_has_permission('content.publish', p.division_id)
          OR public.cms_has_permission('content.archive', p.division_id)
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.page_sections ps
      JOIN public.pages p ON p.id = ps.page_id
      WHERE ps.id = page_section_id
        AND (
          public.cms_has_permission('content.edit', p.division_id)
          OR public.cms_has_permission('content.submit_review', p.division_id)
          OR public.cms_has_permission('content.review', p.division_id)
          OR public.cms_has_permission('content.publish', p.division_id)
          OR public.cms_has_permission('content.archive', p.division_id)
        )
    )
  );

-- Enforce status transitions in the database as well as in the CMS interface.
CREATE OR REPLACE FUNCTION public.cms_guard_page_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  required_permission text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    required_permission := CASE NEW.status
      WHEN 'published' THEN 'content.publish'
      WHEN 'review' THEN 'content.submit_review'
      WHEN 'archived' THEN 'content.archive'
      ELSE 'content.create'
    END;
  ELSE
    -- Any edit to a published page returns it to draft until it is reviewed and republished.
    IF OLD.status = 'published' AND (
      NEW.slug IS DISTINCT FROM OLD.slug
      OR NEW.template_key IS DISTINCT FROM OLD.template_key
      OR NEW.division_id IS DISTINCT FROM OLD.division_id
      OR NEW.show_in_navigation IS DISTINCT FROM OLD.show_in_navigation
      OR NEW.navigation_order IS DISTINCT FROM OLD.navigation_order
    ) THEN
      NEW.status := 'draft';
      NEW.published_at := NULL;
    END IF;

    IF OLD.status IS DISTINCT FROM NEW.status THEN
      required_permission := CASE NEW.status
        WHEN 'published' THEN 'content.publish'
        WHEN 'review' THEN 'content.submit_review'
        WHEN 'archived' THEN 'content.archive'
        ELSE 'content.edit'
      END;
    ELSE
      required_permission := 'content.edit';
    END IF;
  END IF;

  IF NOT public.cms_has_permission(required_permission, NEW.division_id) THEN
    RAISE EXCEPTION 'Insufficient permission for page operation'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_pages_status_guard
  BEFORE INSERT OR UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.cms_guard_page_status();

CREATE OR REPLACE FUNCTION public.cms_guard_page_section_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  parent_division_id uuid;
  required_permission text;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.page_id IS DISTINCT FROM NEW.page_id THEN
    RAISE EXCEPTION 'A section cannot be moved to another page'
      USING ERRCODE = '22000';
  END IF;

  SELECT division_id INTO parent_division_id
  FROM public.pages
  WHERE id = NEW.page_id;

  IF parent_division_id IS NULL AND NOT EXISTS (
    SELECT 1 FROM public.pages WHERE id = NEW.page_id
  ) THEN
    RAISE EXCEPTION 'Parent page does not exist'
      USING ERRCODE = '23503';
  END IF;

  IF TG_OP = 'INSERT' THEN
    required_permission := CASE NEW.status
      WHEN 'published' THEN 'content.publish'
      WHEN 'archived' THEN 'content.archive'
      ELSE 'content.create'
    END;
  ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
    required_permission := CASE NEW.status
      WHEN 'published' THEN 'content.publish'
      WHEN 'archived' THEN 'content.archive'
      ELSE 'content.edit'
    END;
  ELSE
    required_permission := 'content.edit';
  END IF;

  IF NOT public.cms_has_permission(required_permission, parent_division_id) THEN
    RAISE EXCEPTION 'Insufficient permission for page section operation'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_page_sections_status_guard
  BEFORE INSERT OR UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.cms_guard_page_section_status();

-- Keep updated_at current for editable page records.
CREATE OR REPLACE FUNCTION public.cms_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_pages_set_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.cms_set_updated_at();

CREATE TRIGGER cms_page_sections_set_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.cms_set_updated_at();

-- Record immutable snapshots and audit events for every page/section change.
CREATE OR REPLACE FUNCTION public.cms_record_page_revision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
DECLARE
  entity_kind text;
  entity_key uuid;
  entity_division_id uuid;
  entity_locale text;
  revision_no integer;
  snapshot_data jsonb := to_jsonb(NEW);
  audit_action text := 'updated';
BEGIN
  IF TG_TABLE_NAME = 'pages' THEN
    entity_kind := 'page';
    entity_key := NEW.id;
    entity_division_id := NEW.division_id;
  ELSIF TG_TABLE_NAME = 'page_translations' THEN
    entity_kind := 'page';
    entity_key := NEW.page_id;
    entity_locale := NEW.locale_code;
    SELECT division_id INTO entity_division_id
    FROM public.pages WHERE id = NEW.page_id;
  ELSIF TG_TABLE_NAME = 'page_sections' THEN
    entity_kind := 'page_section';
    entity_key := NEW.id;
    SELECT division_id INTO entity_division_id
    FROM public.pages WHERE id = NEW.page_id;
  ELSIF TG_TABLE_NAME = 'page_section_translations' THEN
    entity_kind := 'page_section';
    entity_key := NEW.page_section_id;
    entity_locale := NEW.locale_code;
    SELECT p.division_id INTO entity_division_id
    FROM public.page_sections ps
    JOIN public.pages p ON p.id = ps.page_id
    WHERE ps.id = NEW.page_section_id;
  ELSE
    RAISE EXCEPTION 'Unsupported revision source';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(entity_kind || ':' || entity_key::text || ':' || COALESCE(entity_locale, ''), 0)
  );

  SELECT COALESCE(MAX(revision_number), 0) + 1
  INTO revision_no
  FROM public.cms_content_revisions
  WHERE entity_type = entity_kind
    AND entity_id = entity_key
    AND locale_code IS NOT DISTINCT FROM entity_locale;

  INSERT INTO public.cms_content_revisions (
    entity_type, entity_id, division_id, locale_code,
    revision_number, snapshot, created_by
  ) VALUES (
    entity_kind, entity_key, entity_division_id, entity_locale,
    revision_no, snapshot_data, auth.uid()
  );

  IF TG_OP = 'INSERT' THEN
    audit_action := 'created';
  ELSIF TG_TABLE_NAME = 'pages' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      audit_action := CASE NEW.status
        WHEN 'published' THEN 'published'
        WHEN 'archived' THEN 'archived'
        WHEN 'review' THEN 'submitted_for_review'
        WHEN 'draft' THEN 'unpublished'
        ELSE 'updated'
      END;
    END IF;
  ELSIF TG_TABLE_NAME = 'page_sections' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      audit_action := CASE NEW.status
        WHEN 'published' THEN 'published'
        WHEN 'archived' THEN 'archived'
        WHEN 'draft' THEN 'unpublished'
        ELSE 'updated'
      END;
    END IF;
  END IF;

  INSERT INTO public.cms_audit_logs (
    actor_user_id, action, resource_type, resource_id, division_id
  ) VALUES (
    auth.uid(), audit_action, entity_kind, entity_key::text, entity_division_id
  );

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.cms_record_page_revision() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER cms_pages_revision
  AFTER INSERT OR UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.cms_record_page_revision();

CREATE TRIGGER cms_page_translations_revision
  AFTER INSERT OR UPDATE ON public.page_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_record_page_revision();

CREATE TRIGGER cms_page_sections_revision
  AFTER INSERT OR UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.cms_record_page_revision();

CREATE TRIGGER cms_page_section_translations_revision
  AFTER INSERT OR UPDATE ON public.page_section_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_record_page_revision();

-- Editing any part of a published page removes it from public delivery until republished.
-- This avoids silently changing live content without a fresh publish action.
CREATE OR REPLACE FUNCTION public.cms_unpublish_page_after_child_edit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  parent_page_id uuid;
BEGIN
  IF TG_TABLE_NAME = 'page_translations' THEN
    parent_page_id := NEW.page_id;
  ELSIF TG_TABLE_NAME = 'page_sections' THEN
    parent_page_id := NEW.page_id;
  ELSIF TG_TABLE_NAME = 'page_section_translations' THEN
    SELECT page_id INTO parent_page_id
    FROM public.page_sections
    WHERE id = NEW.page_section_id;
  END IF;

  UPDATE public.pages
  SET status = 'draft', published_at = NULL
  WHERE id = parent_page_id AND status = 'published';

  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_page_translations_unpublish_parent
  AFTER INSERT OR UPDATE ON public.page_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_unpublish_page_after_child_edit();

CREATE TRIGGER cms_page_sections_unpublish_parent
  AFTER INSERT OR UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.cms_unpublish_page_after_child_edit();

CREATE TRIGGER cms_page_section_translations_unpublish_parent
  AFTER INSERT OR UPDATE ON public.page_section_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_unpublish_page_after_child_edit();

REVOKE ALL ON FUNCTION public.cms_unpublish_page_after_child_edit() FROM PUBLIC, anon, authenticated;

COMMENT ON COLUMN public.pages.division_id IS
  'NULL means group-wide page (super-admin managed); otherwise content access is scoped to the assigned division.';

COMMIT;
