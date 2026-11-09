-- NSOMEX Group CMS: division-scoped editorial permissions and audited news/article workflows.
-- Existing public policies remain in place; no sample content is seeded and no hard deletes are enabled.

BEGIN;

GRANT SELECT, INSERT, UPDATE ON TABLE
  public.article_categories,
  public.article_category_translations,
  public.articles,
  public.article_translations,
  public.article_category_assignments
TO authenticated;

GRANT DELETE ON TABLE public.article_category_assignments TO authenticated;

CREATE POLICY "CMS users can read article drafts"
  ON public.articles FOR SELECT TO authenticated
  USING (public.cms_has_permission('content.read_draft', division_id));

CREATE POLICY "CMS users can create articles"
  ON public.articles FOR INSERT TO authenticated
  WITH CHECK (public.cms_has_permission('content.create', division_id));

CREATE POLICY "CMS users can update articles"
  ON public.articles FOR UPDATE TO authenticated
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

CREATE POLICY "CMS users can read article translations"
  ON public.article_translations FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.articles a
    WHERE a.id = article_id
      AND public.cms_has_permission('content.read_draft', a.division_id)
  ));

CREATE POLICY "CMS users can create article translations"
  ON public.article_translations FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.articles a
    WHERE a.id = article_id
      AND public.cms_has_permission('content.create', a.division_id)
  ));

CREATE POLICY "CMS users can update article translations"
  ON public.article_translations FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.articles a
    WHERE a.id = article_id
      AND (
        public.cms_has_permission('content.edit', a.division_id)
        OR public.cms_has_permission('content.submit_review', a.division_id)
        OR public.cms_has_permission('content.review', a.division_id)
        OR public.cms_has_permission('content.publish', a.division_id)
        OR public.cms_has_permission('content.archive', a.division_id)
      )
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.articles a
    WHERE a.id = article_id
      AND (
        public.cms_has_permission('content.edit', a.division_id)
        OR public.cms_has_permission('content.submit_review', a.division_id)
        OR public.cms_has_permission('content.review', a.division_id)
        OR public.cms_has_permission('content.publish', a.division_id)
        OR public.cms_has_permission('content.archive', a.division_id)
      )
  ));

-- Editorial categories are group-wide, so only the super administrator can manage them.
CREATE POLICY "Super admins can read editorial category drafts"
  ON public.article_categories FOR SELECT TO authenticated
  USING (public.cms_has_permission('content.read_draft', NULL));

CREATE POLICY "Super admins can create editorial categories"
  ON public.article_categories FOR INSERT TO authenticated
  WITH CHECK (public.cms_has_permission('content.create', NULL));

CREATE POLICY "Super admins can update editorial categories"
  ON public.article_categories FOR UPDATE TO authenticated
  USING (
    public.cms_has_permission('content.edit', NULL)
    OR public.cms_has_permission('content.publish', NULL)
    OR public.cms_has_permission('content.archive', NULL)
  )
  WITH CHECK (
    public.cms_has_permission('content.edit', NULL)
    OR public.cms_has_permission('content.publish', NULL)
    OR public.cms_has_permission('content.archive', NULL)
  );

CREATE POLICY "Super admins can read editorial category translations"
  ON public.article_category_translations FOR SELECT TO authenticated
  USING (public.cms_has_permission('content.read_draft', NULL));

CREATE POLICY "Super admins can create editorial category translations"
  ON public.article_category_translations FOR INSERT TO authenticated
  WITH CHECK (public.cms_has_permission('content.create', NULL));

CREATE POLICY "Super admins can update editorial category translations"
  ON public.article_category_translations FOR UPDATE TO authenticated
  USING (public.cms_has_permission('content.edit', NULL))
  WITH CHECK (public.cms_has_permission('content.edit', NULL));

CREATE POLICY "CMS users can read article category assignments"
  ON public.article_category_assignments FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.articles a
    WHERE a.id = article_id
      AND public.cms_has_permission('content.read_draft', a.division_id)
  ));

CREATE POLICY "CMS users can assign article categories"
  ON public.article_category_assignments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.articles a
    WHERE a.id = article_id
      AND public.cms_has_permission('content.edit', a.division_id)
  ) AND EXISTS (
    SELECT 1 FROM public.article_categories c
    WHERE c.id = category_id
      AND (
        c.status = 'published'
        OR public.cms_has_permission('content.read_draft', NULL)
      )
  ));

CREATE POLICY "CMS users can remove article category assignments"
  ON public.article_category_assignments FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.articles a
    WHERE a.id = article_id
      AND public.cms_has_permission('content.edit', a.division_id)
  ));

CREATE OR REPLACE FUNCTION public.cms_guard_article_status()
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
      NEW.division_id IS DISTINCT FROM OLD.division_id
      OR NEW.article_type IS DISTINCT FROM OLD.article_type
      OR NEW.cover_media_asset_id IS DISTINCT FROM OLD.cover_media_asset_id
      OR NEW.is_featured IS DISTINCT FROM OLD.is_featured
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
    RAISE EXCEPTION 'Insufficient permission for article operation'
      USING ERRCODE = '42501';
  END IF;

  IF NEW.cover_media_asset_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.media_assets ma
      WHERE ma.id = NEW.cover_media_asset_id
        AND ma.status = 'published'
        AND ma.division_id IS NOT DISTINCT FROM NEW.division_id
    ) THEN
      RAISE EXCEPTION 'Article cover media must be published and belong to the same division'
        USING ERRCODE = '23514';
    END IF;
  END IF;

  IF NEW.status = 'published' THEN
    NEW.published_at := COALESCE(NEW.published_at, now());
  ELSE
    NEW.published_at := NULL;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_articles_status_guard
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.cms_guard_article_status();

CREATE OR REPLACE FUNCTION public.cms_guard_article_translation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  article_division uuid;
BEGIN
  SELECT division_id INTO article_division
  FROM public.articles WHERE id = NEW.article_id;

  IF NOT FOUND OR NOT public.cms_has_permission(
    CASE WHEN TG_OP = 'INSERT' THEN 'content.create' ELSE 'content.edit' END,
    article_division
  ) THEN
    RAISE EXCEPTION 'Insufficient permission for article translation'
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.articles
  SET status = CASE WHEN status IN ('published', 'review') THEN 'draft' ELSE status END,
      published_at = CASE WHEN status IN ('published', 'review') THEN NULL ELSE published_at END,
      updated_at = now()
  WHERE id = NEW.article_id;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_article_translation_guard
  BEFORE INSERT OR UPDATE ON public.article_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_guard_article_translation();

CREATE OR REPLACE FUNCTION public.cms_guard_article_category_status()
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

  IF NOT public.cms_has_permission(required_permission, NULL) THEN
    RAISE EXCEPTION 'Only a super administrator can manage editorial categories'
      USING ERRCODE = '42501';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_article_categories_status_guard
  BEFORE INSERT OR UPDATE ON public.article_categories
  FOR EACH ROW EXECUTE FUNCTION public.cms_guard_article_category_status();

CREATE OR REPLACE FUNCTION public.cms_guard_article_category_translation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
BEGIN
  IF NOT public.cms_has_permission(
    CASE WHEN TG_OP = 'INSERT' THEN 'content.create' ELSE 'content.edit' END,
    NULL
  ) THEN
    RAISE EXCEPTION 'Only a super administrator can manage editorial category translations'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_article_category_translation_guard
  BEFORE INSERT OR UPDATE ON public.article_category_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_guard_article_category_translation();

CREATE OR REPLACE FUNCTION public.cms_capture_article_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
DECLARE
  revision integer;
  event_action text;
BEGIN
  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO revision
  FROM public.cms_content_revisions
  WHERE entity_type = 'article' AND entity_id = NEW.id AND locale_code IS NULL;

  INSERT INTO public.cms_content_revisions (
    entity_type, entity_id, division_id, locale_code, revision_number, snapshot, created_by
  ) VALUES (
    'article', NEW.id, NEW.division_id, NULL, revision, to_jsonb(NEW), auth.uid()
  );

  event_action := CASE
    WHEN TG_OP = 'INSERT' THEN 'created'
    WHEN NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published' THEN 'published'
    WHEN NEW.status = 'review' AND OLD.status IS DISTINCT FROM 'review' THEN 'submitted_for_review'
    WHEN OLD.status = 'published' AND NEW.status IS DISTINCT FROM 'published' THEN 'unpublished'
    WHEN NEW.status = 'archived' AND OLD.status IS DISTINCT FROM 'archived' THEN 'archived'
    ELSE 'updated'
  END;

  INSERT INTO public.cms_audit_logs (
    actor_user_id, action, resource_type, resource_id, division_id, metadata
  ) VALUES (
    auth.uid(), event_action, 'article', NEW.id::text, NEW.division_id,
    jsonb_build_object('type', NEW.article_type, 'status', NEW.status)
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_articles_revision_audit
  AFTER INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_article_change();

CREATE OR REPLACE FUNCTION public.cms_capture_article_translation_revision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
DECLARE
  revision integer;
  article_division uuid;
BEGIN
  SELECT division_id INTO article_division
  FROM public.articles WHERE id = NEW.article_id;

  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO revision
  FROM public.cms_content_revisions
  WHERE entity_type = 'article' AND entity_id = NEW.article_id AND locale_code = NEW.locale_code;

  INSERT INTO public.cms_content_revisions (
    entity_type, entity_id, division_id, locale_code, revision_number, snapshot, created_by
  ) VALUES (
    'article', NEW.article_id, article_division, NEW.locale_code, revision, to_jsonb(NEW), auth.uid()
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_article_translations_revision
  AFTER INSERT OR UPDATE ON public.article_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_article_translation_revision();

CREATE OR REPLACE FUNCTION public.cms_capture_article_category_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
DECLARE
  revision integer;
  event_action text;
BEGIN
  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO revision
  FROM public.cms_content_revisions
  WHERE entity_type = 'article_category' AND entity_id = NEW.id AND locale_code IS NULL;

  INSERT INTO public.cms_content_revisions (
    entity_type, entity_id, division_id, locale_code, revision_number, snapshot, created_by
  ) VALUES (
    'article_category', NEW.id, NULL, NULL, revision, to_jsonb(NEW), auth.uid()
  );

  event_action := CASE
    WHEN TG_OP = 'INSERT' THEN 'created'
    WHEN NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published' THEN 'published'
    WHEN NEW.status = 'archived' AND OLD.status IS DISTINCT FROM 'archived' THEN 'archived'
    ELSE 'updated'
  END;

  INSERT INTO public.cms_audit_logs (
    actor_user_id, action, resource_type, resource_id, division_id, metadata
  ) VALUES (
    auth.uid(), event_action, 'article_category', NEW.id::text, NULL,
    jsonb_build_object('status', NEW.status, 'slug', NEW.slug)
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_article_categories_revision_audit
  AFTER INSERT OR UPDATE ON public.article_categories
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_article_category_change();

CREATE OR REPLACE FUNCTION public.cms_capture_article_category_translation_revision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
DECLARE
  revision integer;
BEGIN
  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO revision
  FROM public.cms_content_revisions
  WHERE entity_type = 'article_category'
    AND entity_id = NEW.category_id
    AND locale_code = NEW.locale_code;

  INSERT INTO public.cms_content_revisions (
    entity_type, entity_id, division_id, locale_code, revision_number, snapshot, created_by
  ) VALUES (
    'article_category', NEW.category_id, NULL, NEW.locale_code, revision, to_jsonb(NEW), auth.uid()
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_article_category_translations_revision
  AFTER INSERT OR UPDATE ON public.article_category_translations
  FOR EACH ROW EXECUTE FUNCTION public.cms_capture_article_category_translation_revision();

CREATE OR REPLACE FUNCTION public.cms_touch_article_assignment_parent()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $function$
DECLARE
  target_article_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_article_id := OLD.article_id;
  ELSE
    target_article_id := NEW.article_id;
  END IF;
  UPDATE public.articles SET updated_at = now()
  WHERE id = target_article_id;
  RETURN NULL;
END;
$function$;

CREATE TRIGGER cms_article_category_assignment_touch
  AFTER INSERT OR DELETE ON public.article_category_assignments
  FOR EACH ROW EXECUTE FUNCTION public.cms_touch_article_assignment_parent();

COMMIT;
