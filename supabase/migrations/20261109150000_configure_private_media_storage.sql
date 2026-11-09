-- NSOMEX Group: private media storage bucket and published-project read policy.
-- Draft uploads and all mutations remain server-side only.
-- Do not expose the bucket publicly: public buckets bypass object-level read policies.

BEGIN;

INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'nsomex-media',
  'nsomex-media',
  false,
  52428800,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'video/mp4',
    'application/pdf'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public can download published project media"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'nsomex-media'
    AND EXISTS (
      SELECT 1
      FROM public.media_assets ma
      JOIN public.project_media pm
        ON pm.media_asset_id = ma.id
      JOIN public.projects p
        ON p.id = pm.project_id
      JOIN public.divisions d
        ON d.id = p.division_id
      WHERE ma.bucket_name = storage.objects.bucket_id
        AND ma.object_path = storage.objects.name
        AND ma.status = 'published'
        AND pm.media_role IN ('cover', 'gallery', 'video', 'document')
        AND p.status = 'published'
        AND d.is_active
    )
  );

COMMENT ON POLICY "Public can download published project media"
  ON storage.objects IS
  'Allows anonymous/authenticated downloads only for media explicitly published and attached to a published project in an active division. No client upload, update, or delete policy is granted.';

COMMIT;
