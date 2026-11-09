-- NSOMEX Group CMS: page and reusable section content.
-- No speculative page content is seeded. Public access is read-only and published-only.

BEGIN;

CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  template_key text NOT NULL DEFAULT 'standard'
    CHECK (template_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  show_in_navigation boolean NOT NULL DEFAULT false,
  navigation_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.page_translations (
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  locale_code text NOT NULL REFERENCES public.locales(code) ON UPDATE CASCADE ON DELETE RESTRICT,
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 200),
  summary text CHECK (summary IS NULL OR char_length(summary) <= 600),
  seo_title text CHECK (seo_title IS NULL OR char_length(seo_title) <= 200),
  seo_description text CHECK (seo_description IS NULL OR char_length(seo_description) <= 320),
  PRIMARY KEY (page_id, locale_code)
);

CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_key text NOT NULL
    CHECK (section_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  section_type text NOT NULL
    CHECK (section_type ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, section_key)
);

CREATE TABLE public.page_section_translations (
  page_section_id uuid NOT NULL
    REFERENCES public.page_sections(id) ON DELETE CASCADE,
  locale_code text NOT NULL REFERENCES public.locales(code) ON UPDATE CASCADE ON DELETE RESTRICT,
  content jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(content) = 'object'),
  PRIMARY KEY (page_section_id, locale_code)
);

CREATE INDEX pages_status_navigation_idx
  ON public.pages (status, show_in_navigation, navigation_order, slug);
CREATE INDEX page_sections_page_status_order_idx
  ON public.page_sections (page_id, status, sort_order, id);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_section_translations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
  public.pages,
  public.page_translations,
  public.page_sections,
  public.page_section_translations
FROM anon, authenticated;

GRANT SELECT ON TABLE
  public.pages,
  public.page_translations,
  public.page_sections,
  public.page_section_translations
TO anon, authenticated;

GRANT ALL ON TABLE
  public.pages,
  public.page_translations,
  public.page_sections,
  public.page_section_translations
TO service_role;

CREATE POLICY "Public can read published pages"
  ON public.pages FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Public can read published page translations"
  ON public.page_translations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id AND p.status = 'published'
    )
    AND EXISTS (
      SELECT 1 FROM public.locales l
      WHERE l.code = locale_code AND l.is_enabled
    )
  );

CREATE POLICY "Public can read published page sections"
  ON public.page_sections FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_id AND p.status = 'published'
    )
  );

CREATE POLICY "Public can read published page section translations"
  ON public.page_section_translations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.page_sections ps
      JOIN public.pages p ON p.id = ps.page_id
      WHERE ps.id = page_section_id
        AND ps.status = 'published'
        AND p.status = 'published'
    )
    AND EXISTS (
      SELECT 1 FROM public.locales l
      WHERE l.code = locale_code AND l.is_enabled
    )
  );

COMMENT ON TABLE public.pages IS
  'Localized corporate website pages with draft and publishing lifecycle.';
COMMENT ON TABLE public.page_sections IS
  'Ordered reusable content sections belonging to a page.';
COMMENT ON COLUMN public.page_section_translations.content IS
  'Locale-specific structured section data; validate section_type payloads in the application.';

COMMIT;
