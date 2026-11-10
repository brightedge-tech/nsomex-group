-- Global landing-page image slots, independent of division content.
-- Public image delivery is intentional: these files are displayed on the public website.
-- Only global CMS administrators can upload, replace, or remove these assets.

BEGIN;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'nsomex-website',
  'nsomex-website',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/avif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE TABLE public.landing_page_media (
  slot text PRIMARY KEY CHECK (slot IN (
    'hero',
    'corporate',
    'technology',
    'engineering',
    'renewable-energy',
    'global-business'
  )),
  object_path text NOT NULL UNIQUE
    CHECK (object_path LIKE 'landing/%' AND object_path !~ '(^|/)\.\.(/|$)'),
  original_filename text NOT NULL
    CHECK (char_length(btrim(original_filename)) BETWEEN 1 AND 255),
  mime_type text NOT NULL CHECK (mime_type IN ('image/jpeg','image/png','image/webp','image/avif')),
  byte_size bigint NOT NULL CHECK (byte_size > 0 AND byte_size <= 10485760),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_page_media ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.landing_page_media FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.landing_page_media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.landing_page_media TO authenticated;

CREATE POLICY "Public can read landing page image settings"
  ON public.landing_page_media FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Global admins can create landing page image settings"
  ON public.landing_page_media FOR INSERT TO authenticated
  WITH CHECK (public.cms_has_permission('media.manage', NULL));

CREATE POLICY "Global admins can update landing page image settings"
  ON public.landing_page_media FOR UPDATE TO authenticated
  USING (public.cms_has_permission('media.manage', NULL))
  WITH CHECK (public.cms_has_permission('media.manage', NULL));

CREATE POLICY "Global admins can delete landing page image settings"
  ON public.landing_page_media FOR DELETE TO authenticated
  USING (public.cms_has_permission('media.manage', NULL));

CREATE POLICY "Public can view website image files"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'nsomex-website');

CREATE POLICY "Global admins can upload website image files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'nsomex-website'
    AND name LIKE 'landing/%'
    AND public.cms_has_permission('media.manage', NULL)
  );

CREATE POLICY "Global admins can replace website image files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'nsomex-website'
    AND name LIKE 'landing/%'
    AND public.cms_has_permission('media.manage', NULL)
  )
  WITH CHECK (
    bucket_id = 'nsomex-website'
    AND name LIKE 'landing/%'
    AND public.cms_has_permission('media.manage', NULL)
  );

CREATE POLICY "Global admins can remove old website image files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'nsomex-website'
    AND name LIKE 'landing/%'
    AND public.cms_has_permission('media.manage', NULL)
  );

COMMENT ON TABLE public.landing_page_media IS
  'Global homepage image slots; not division-scoped. Public images are delivered from the nsomex-website bucket.';

COMMIT;
