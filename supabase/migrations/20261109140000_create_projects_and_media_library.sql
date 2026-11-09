-- NSOMEX Group: project portfolio and reusable media metadata.
-- Storage bucket creation/upload policies are intentionally handled in a separate reviewed migration.
-- No project examples or unverified company credentials are seeded.

BEGIN;

CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name text NOT NULL DEFAULT 'nsomex-media'
    CHECK (bucket_name ~ '^[a-z0-9][a-z0-9._-]*$'),
  object_path text NOT NULL
    CHECK (object_path !~ '^/' AND object_path !~ '(^|/)\.\.(/|$)'),
  original_filename text NOT NULL
    CHECK (char_length(btrim(original_filename)) BETWEEN 1 AND 255),
  mime_type text NOT NULL
    CHECK (mime_type IN (
      'image/jpeg', 'image/png', 'image/webp', 'image/avif',
      'video/mp4', 'application/pdf'
    )),
  byte_size bigint NOT NULL CHECK (byte_size > 0),
  width integer CHECK (width IS NULL OR width > 0),
  height integer CHECK (height IS NULL OR height > 0),
  duration_seconds numeric(10,2)
    CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bucket_name, object_path)
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id uuid NOT NULL,
  business_unit_id uuid,
  slug text NOT NULL
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  project_type text NOT NULL DEFAULT 'general'
    CHECK (project_type ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  location_name text,
  city text,
  region text,
  country_code text
    CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$'),
  started_on date,
  completed_on date,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT projects_division_fk
    FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE RESTRICT,
  CONSTRAINT projects_business_unit_division_fk
    FOREIGN KEY (business_unit_id, division_id)
    REFERENCES public.business_units(id, division_id) ON DELETE RESTRICT,
  CONSTRAINT projects_division_slug_key UNIQUE (division_id, slug),
  CONSTRAINT projects_date_order_check
    CHECK (started_on IS NULL OR completed_on IS NULL OR completed_on >= started_on)
);

CREATE TABLE public.project_translations (
  project_id uuid NOT NULL
    REFERENCES public.projects(id) ON DELETE CASCADE,
  locale_code text NOT NULL
    REFERENCES public.locales(code) ON UPDATE CASCADE ON DELETE RESTRICT,
  title text NOT NULL
    CHECK (char_length(btrim(title)) BETWEEN 1 AND 200),
  summary text
    CHECK (summary IS NULL OR char_length(summary) <= 600),
  description text,
  seo_title text
    CHECK (seo_title IS NULL OR char_length(seo_title) <= 200),
  seo_description text
    CHECK (seo_description IS NULL OR char_length(seo_description) <= 320),
  PRIMARY KEY (project_id, locale_code)
);

CREATE TABLE public.project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL
    REFERENCES public.projects(id) ON DELETE CASCADE,
  media_asset_id uuid NOT NULL
    REFERENCES public.media_assets(id) ON DELETE RESTRICT,
  media_role text NOT NULL DEFAULT 'gallery'
    CHECK (media_role IN ('cover', 'gallery', 'document', 'video')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, media_asset_id)
);

CREATE UNIQUE INDEX project_media_one_cover_uidx
  ON public.project_media (project_id)
  WHERE media_role = 'cover';

CREATE TABLE public.project_media_translations (
  project_media_id uuid NOT NULL
    REFERENCES public.project_media(id) ON DELETE CASCADE,
  locale_code text NOT NULL
    REFERENCES public.locales(code) ON UPDATE CASCADE ON DELETE RESTRICT,
  alt_text text
    CHECK (alt_text IS NULL OR char_length(alt_text) <= 300),
  caption text
    CHECK (caption IS NULL OR char_length(caption) <= 500),
  PRIMARY KEY (project_media_id, locale_code)
);

CREATE INDEX projects_public_listing_idx
  ON public.projects (division_id, status, is_featured, sort_order, published_at DESC);

CREATE INDEX projects_business_unit_idx
  ON public.projects (business_unit_id)
  WHERE business_unit_id IS NOT NULL;

CREATE INDEX project_media_project_order_idx
  ON public.project_media (project_id, sort_order, id);

CREATE INDEX project_media_asset_idx
  ON public.project_media (media_asset_id);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media_translations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
  public.media_assets,
  public.projects,
  public.project_translations,
  public.project_media,
  public.project_media_translations
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE
  public.media_assets,
  public.projects,
  public.project_translations,
  public.project_media,
  public.project_media_translations
TO anon, authenticated;

GRANT ALL ON TABLE
  public.media_assets,
  public.projects,
  public.project_translations,
  public.project_media,
  public.project_media_translations
TO service_role;

CREATE POLICY "Public can read published media metadata"
  ON public.media_assets FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Public can read published projects"
  ON public.projects FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.divisions d
      WHERE d.id = division_id AND d.is_active
    )
  );

CREATE POLICY "Public can read published project translations"
  ON public.project_translations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published'
    )
    AND EXISTS (
      SELECT 1 FROM public.locales l
      WHERE l.code = locale_code AND l.is_enabled
    )
  );

CREATE POLICY "Public can read media attached to published projects"
  ON public.project_media FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published'
    )
    AND EXISTS (
      SELECT 1 FROM public.media_assets ma
      WHERE ma.id = media_asset_id AND ma.status = 'published'
    )
  );

CREATE POLICY "Public can read published project media translations"
  ON public.project_media_translations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.project_media pm
      JOIN public.projects p ON p.id = pm.project_id
      JOIN public.media_assets ma ON ma.id = pm.media_asset_id
      WHERE pm.id = project_media_id
        AND p.status = 'published'
        AND ma.status = 'published'
    )
    AND EXISTS (
      SELECT 1 FROM public.locales l
      WHERE l.code = locale_code AND l.is_enabled
    )
  );

COMMENT ON TABLE public.media_assets IS
  'Reusable media metadata; file bytes live in Supabase Storage.';
COMMENT ON TABLE public.projects IS
  'NSOMEX project portfolio entries associated with a confirmed group division.';
COMMENT ON TABLE public.project_media IS
  'Ordered reusable media associations for project covers, galleries, videos, and documents.';
COMMENT ON COLUMN public.media_assets.object_path IS
  'Storage object key only; upload and download access are governed by Storage policies.';

COMMIT;
