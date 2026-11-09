-- NSOMEX Group CMS: bilingual news, insights, announcements, and editorial categories.
-- No article or category content is seeded; publish only approved company information.

BEGIN;

CREATE TABLE public.article_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.article_category_translations (
  category_id uuid NOT NULL
    REFERENCES public.article_categories(id) ON DELETE CASCADE,
  locale_code text NOT NULL
    REFERENCES public.locales(code) ON UPDATE CASCADE ON DELETE RESTRICT,
  name text NOT NULL
    CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  description text
    CHECK (description IS NULL OR char_length(description) <= 500),
  PRIMARY KEY (category_id, locale_code)
);

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id uuid
    REFERENCES public.divisions(id) ON DELETE SET NULL,
  article_type text NOT NULL DEFAULT 'news'
    CHECK (article_type IN ('news', 'insight', 'announcement')),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  cover_media_asset_id uuid
    REFERENCES public.media_assets(id) ON DELETE SET NULL,
  is_featured boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT articles_published_at_required
    CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE TABLE public.article_translations (
  article_id uuid NOT NULL
    REFERENCES public.articles(id) ON DELETE CASCADE,
  locale_code text NOT NULL
    REFERENCES public.locales(code) ON UPDATE CASCADE ON DELETE RESTRICT,
  slug text NOT NULL
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL
    CHECK (char_length(btrim(title)) BETWEEN 1 AND 200),
  excerpt text
    CHECK (excerpt IS NULL OR char_length(excerpt) <= 600),
  body jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(body) = 'object'),
  seo_title text
    CHECK (seo_title IS NULL OR char_length(seo_title) <= 200),
  seo_description text
    CHECK (seo_description IS NULL OR char_length(seo_description) <= 320),
  PRIMARY KEY (article_id, locale_code),
  UNIQUE (locale_code, slug)
);

CREATE TABLE public.article_category_assignments (
  article_id uuid NOT NULL
    REFERENCES public.articles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL
    REFERENCES public.article_categories(id) ON DELETE RESTRICT,
  PRIMARY KEY (article_id, category_id)
);

CREATE INDEX articles_public_listing_idx
  ON public.articles (status, article_type, is_featured, published_at DESC);

CREATE INDEX articles_division_listing_idx
  ON public.articles (division_id, status, published_at DESC)
  WHERE division_id IS NOT NULL;

CREATE INDEX article_category_assignments_category_idx
  ON public.article_category_assignments (category_id, article_id);

ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_category_assignments ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
  public.article_categories,
  public.article_category_translations,
  public.articles,
  public.article_translations,
  public.article_category_assignments
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE
  public.article_categories,
  public.article_category_translations,
  public.articles,
  public.article_translations,
  public.article_category_assignments
TO anon, authenticated;

GRANT ALL ON TABLE
  public.article_categories,
  public.article_category_translations,
  public.articles,
  public.article_translations,
  public.article_category_assignments
TO service_role;

CREATE POLICY "Public can read published article categories"
  ON public.article_categories FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Public can read published article category translations"
  ON public.article_category_translations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.article_categories ac
      WHERE ac.id = category_id AND ac.status = 'published'
    )
    AND EXISTS (
      SELECT 1 FROM public.locales l
      WHERE l.code = locale_code AND l.is_enabled
    )
  );

CREATE POLICY "Public can read published articles"
  ON public.articles FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND published_at <= now()
    AND (
      division_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.divisions d
        WHERE d.id = division_id AND d.is_active
      )
    )
  );

CREATE POLICY "Public can read published article translations"
  ON public.article_translations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.articles a
      WHERE a.id = article_id
        AND a.status = 'published'
        AND a.published_at <= now()
        AND (
          a.division_id IS NULL
          OR EXISTS (
            SELECT 1 FROM public.divisions d
            WHERE d.id = a.division_id AND d.is_active
          )
        )
    )
    AND EXISTS (
      SELECT 1 FROM public.locales l
      WHERE l.code = locale_code AND l.is_enabled
    )
  );

CREATE POLICY "Public can read categories assigned to published articles"
  ON public.article_category_assignments FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.articles a
      WHERE a.id = article_id
        AND a.status = 'published'
        AND a.published_at <= now()
    )
    AND EXISTS (
      SELECT 1 FROM public.article_categories ac
      WHERE ac.id = category_id AND ac.status = 'published'
    )
  );

-- The media bucket is private. This additional read policy exposes only an
-- explicitly published cover asset belonging to a published article.
CREATE POLICY "Public can download published article cover media"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'nsomex-media'
    AND EXISTS (
      SELECT 1
      FROM public.media_assets ma
      JOIN public.articles a
        ON a.cover_media_asset_id = ma.id
      WHERE ma.bucket_name = storage.objects.bucket_id
        AND ma.object_path = storage.objects.name
        AND ma.status = 'published'
        AND a.status = 'published'
        AND a.published_at <= now()
        AND (
          a.division_id IS NULL
          OR EXISTS (
            SELECT 1 FROM public.divisions d
            WHERE d.id = a.division_id AND d.is_active
          )
        )
    )
  );

COMMENT ON TABLE public.articles IS
  'Editorial content for company news, insights, and announcements.';
COMMENT ON COLUMN public.article_translations.body IS
  'Structured locale-specific article body; render only approved block types in the application.';
COMMENT ON TABLE public.article_category_assignments IS
  'Many-to-many relationship between articles and editorial categories.';

COMMIT;
