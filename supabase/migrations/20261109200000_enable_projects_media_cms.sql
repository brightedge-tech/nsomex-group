-- NSOMEX Group CMS: secure project portfolio and private media management.
-- Division-scoped writes; public reads remain limited to published projects and media.
-- No sample projects, assets, or company claims are seeded.

BEGIN;

ALTER TABLE public.media_assets
  ADD COLUMN division_id uuid REFERENCES public.divisions(id) ON DELETE RESTRICT;

CREATE INDEX media_assets_division_status_idx
  ON public.media_assets (division_id, status, created_at DESC);

GRANT SELECT, INSERT, UPDATE ON TABLE
  public.projects,
  public.project_translations,
  public.project_media,
  public.project_media_translations,
  public.media_assets
TO authenticated;

CREATE POLICY "Authorized CMS users can read project drafts"
  ON public.projects FOR SELECT TO authenticated
  USING (public.cms_has_permission('content.read_draft', division_id));

CREATE POLICY "Authorized CMS users can create projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (public.cms_has_permission('content.create', division_id));

CREATE POLICY "Authorized CMS users can update projects"
  ON public.projects FOR UPDATE TO authenticated
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

CREATE POLICY "Authorized CMS users can read project translations"
  ON public.project_translations FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id
      AND public.cms_has_permission('content.read_draft', p.division_id)
  ));

CREATE POLICY "Authorized CMS users can create project translations"
  ON public.project_translations FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id
      AND public.cms_has_permission('content.create', p.division_id)
  ));

CREATE POLICY "Authorized CMS users can update project translations"
  ON public.project_translations FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id
      AND (
        public.cms_has_permission('content.edit', p.division_id)
        OR public.cms_has_permission('content.submit_review', p.division_id)
        OR public.cms_has_permission('content.review', p.division_id)
        OR public.cms_has_permission('content.publish', p.division_id)
        OR public.cms_has_permission('content.archive', p.division_id)
      )
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id
      AND (
        public.cms_has_permission('content.edit', p.division_id)
        OR public.cms_has_permission('content.submit_review', p.division_id)
        OR public.cms_has_permission('content.review', p.division_id)
        OR public.cms_has_permission('content.publish', p.division_id)
        OR public.cms_has_permission('content.archive', p.division_id)
      )
  ));

CREATE POLICY "Authorized CMS users can read project media links"
  ON public.project_media FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id
      AND public.cms_has_permission('content.read_draft', p.division_id)
  ));

CREATE POLICY "Authorized CMS users can manage project media links"
  ON public.project_media FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.projects p
    JOIN public.media_assets ma ON ma.id = media_asset_id
    WHERE p.id = project_id
      AND ma.division_id = p.division_id
      AND public.cms_has_permission('content.edit', p.division_id)
  ));

CREATE POLICY "Authorized CMS users can update project media links"
  ON public.project_media FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id
      AND public.cms_has_permission('content.edit', p.division_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.projects p
    JOIN public.media_assets ma ON ma.id = media_asset_id
    WHERE p.id = project_id
      AND ma.division_id = p.division_id
      AND public.cms_has_permission('content.edit', p.division_id)
  ));

CREATE POLICY "Authorized CMS users can read project media translations"
  ON public.project_media_translations FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM public.project_media pm
    JOIN public.projects p ON p.id = pm.project_id
    WHERE pm.id = project_media_id
      AND public.cms_has_permission('content.read_draft', p.division_id)
  ));

CREATE POLICY "Authorized CMS users can create project media translations"
  ON public.project_media_translations FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.project_media pm
    JOIN public.projects p ON p.id = pm.project_id
    WHERE pm.id = project_media_id
      AND public.cms_has_permission('content.edit', p.division_id)
  ));

CREATE POLICY "Authorized CMS users can update project media translations"
  ON public.project_media_translations FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM public.project_media pm
    JOIN public.projects p ON p.id = pm.project_id
    WHERE pm.id = project_media_id
      AND public.cms_has_permission('content.edit', p.division_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.project_media pm
    JOIN public.projects p ON p.id = pm.project_id
    WHERE pm.id = project_media_id
      AND public.cms_has_permission('content.edit', p.division_id)
  ));

CREATE POLICY "Authorized CMS users can read media metadata"
  ON public.media_assets FOR SELECT TO authenticated
  USING (division_id IS NOT NULL AND public.cms_has_permission('media.manage', division_id));

CREATE POLICY "Authorized CMS users can register media metadata"
  ON public.media_assets FOR INSERT TO authenticated
  WITH CHECK (division_id IS NOT NULL AND public.cms_has_permission('media.manage', division_id));

CREATE POLICY "Authorized CMS users can update media metadata"
  ON public.media_assets FOR UPDATE TO authenticated
  USING (division_id IS NOT NULL AND public.cms_has_permission('media.manage', division_id))
  WITH CHECK (division_id IS NOT NULL AND public.cms_has_permission('media.manage', division_id));

CREATE OR REPLACE FUNCTION public.cms_storage_division_id(object_name text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog
AS $function$
  SELECT CASE
    WHEN split_part(object_name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN split_part(object_name, '/', 1)::uuid
    ELSE NULL
  END;
$function$;

REVOKE ALL ON FUNCTION public.cms_storage_division_id(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cms_storage_division_id(text) TO authenticated;

CREATE POLICY "Authorized CMS users can upload private media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'nsomex-media'
    AND public.cms_has_permission('media.manage', public.cms_storage_division_id(name))
  );

CREATE POLICY "Authorized CMS users can read their private media"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'nsomex-media'
    AND public.cms_has_permission('media.manage', public.cms_storage_division_id(name))
  );

CREATE OR REPLACE FUNCTION public.cms_touch_media_asset_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.cms_touch_media_asset_updated_at();

CREATE OR REPLACE FUNCTION public.cms_guard_project_status()
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
    IF OLD.status IN ('published', 'review') AND (
      NEW.slug IS DISTINCT FROM OLD.slug
      OR NEW.division_id IS DISTINCT FROM OLD.division_id
      OR NEW.business_unit_id IS DISTINCT FROM OLD.business_unit_id
      OR NEW.project_type IS DISTINCT FROM OLD.project_type
      OR NEW.location_name IS DISTINCT FROM OLD.location_name
      OR NEW.city IS DISTINCT FROM OLD.city
      OR NEW.region IS DISTINCT FROM OLD.region
      OR NEW.country_code IS DISTINCT FROM OLD.country_code
      OR NEW.started_on IS DISTINCT FROM OLD.started_on
      OR NEW.completed_on IS DISTINCT FROM OLD.completed_on
      OR NEW.is_featured IS DISTINCT FROM OLD.is_featured
      OR NEW.sort_order IS DISTINCT FROM OLD.sort_order
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
    RAISE EXCEPTION 'Insufficient permission for project operation'
      USING ERRCODE = '42501';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_projects_status_guard
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.cms_guard_project_status();

CREATE OR REPLACE FUNCTION public.cms_guard_project_translation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  project_division uuid;
BEGIN
  SELECT division_id INTO project_division
  FROM public.projects WHERE id = NEW.project_id;
  IF project_division IS NULL
    OR NOT public.cms_has_permission(
      CASE WHEN TG_OP = 'INSERT' THEN 'content.create' ELSE 'content.edit' END,
      project_division
    )
  THEN
    RAISE EXCEPTION 'Insufficient permission for project translation'
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.projects
  SET status = CASE WHEN status IN ('published', 'review') THEN 'draft' ELSE status END,
      published_at = CASE WHEN status IN ('published', 'review') THEN NULL ELSE published_at END,
      updated_at = now()
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_project_translation_guard
  BEFORE INSERT OR UPDATE ON public.project_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_guard_project_translation();

CREATE OR REPLACE FUNCTION public.cms_capture_project_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
DECLARE
  snapshot_value jsonb;
  next_revision integer;
  division_value uuid;
  action_value text;
BEGIN
  snapshot_value := to_jsonb(NEW);
  division_value := NEW.division_id;
  SELECT COALESCE(MAX(revision_number), 0) + 1
    INTO next_revision
    FROM public.cms_content_revisions
    WHERE entity_type = 'project' AND entity_id = NEW.id AND locale_code IS NULL;

  INSERT INTO public.cms_content_revisions (
    entity_type, entity_id, division_id, locale_code, revision_number, snapshot, created_by
  ) VALUES (
    'project', NEW.id, division_value, NULL, next_revision, snapshot_value, auth.uid()
  );

  action_value := CASE
    WHEN TG_OP = 'INSERT' THEN 'created'
    WHEN NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published' THEN 'published'
    WHEN NEW.status = 'archived' AND OLD.status IS DISTINCT FROM 'archived' THEN 'archived'
    ELSE 'updated'
  END;

  INSERT INTO public.cms_audit_logs (
    actor_user_id, action, resource_type, resource_id, division_id, metadata
  ) VALUES (
    auth.uid(), action_value, 'project', NEW.id::text, division_value,
    jsonb_build_object('status', NEW.status, 'slug', NEW.slug)
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_projects_revision_audit
  AFTER INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_project_change();

CREATE OR REPLACE FUNCTION public.cms_capture_media_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
BEGIN
  INSERT INTO public.cms_audit_logs (
    actor_user_id, action, resource_type, resource_id, division_id, metadata
  ) VALUES (
    auth.uid(), 'media_uploaded', 'media_asset', NEW.id::text, NEW.division_id,
    jsonb_build_object('mime_type', NEW.mime_type, 'byte_size', NEW.byte_size, 'object_path', NEW.object_path)
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_media_upload_audit
  AFTER INSERT ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_media_upload();

COMMIT;
