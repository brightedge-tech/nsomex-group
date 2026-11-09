-- NSOMEX Group core content foundation
-- Creates bilingual, relational content tables for divisions, business units,
-- nested categories, and services. Public clients can read published content only.
-- Content writes are reserved for trusted server-side/admin workflows.

BEGIN;

CREATE TABLE public.locales (
  code text PRIMARY KEY CHECK (code ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  name text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.locales (code, name, is_enabled)
VALUES ('en', 'English', true), ('fr', 'Français', true)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name, is_enabled = EXCLUDED.is_enabled;

CREATE TABLE public.divisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.division_translations (
  division_id uuid NOT NULL REFERENCES public.divisions(id) ON DELETE CASCADE,
  locale_code text NOT NULL REFERENCES public.locales(code) ON UPDATE CASCADE,
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 160),
  summary text CHECK (summary IS NULL OR length(summary) <= 500),
  description text,
  PRIMARY KEY (division_id, locale_code)
);

CREATE TABLE public.business_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id uuid NOT NULL REFERENCES public.divisions(id) ON DELETE RESTRICT,
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (division_id, slug),
  UNIQUE (id, division_id)
);

CREATE TABLE public.business_unit_translations (
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  locale_code text NOT NULL REFERENCES public.locales(code) ON UPDATE CASCADE,
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 160),
  summary text CHECK (summary IS NULL OR length(summary) <= 500),
  description text,
  PRIMARY KEY (business_unit_id, locale_code)
);

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id uuid NOT NULL REFERENCES public.divisions(id) ON DELETE RESTRICT,
  parent_category_id uuid,
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (division_id, slug),
  UNIQUE (id, division_id),
  CONSTRAINT categories_parent_same_division_fk
    FOREIGN KEY (parent_category_id, division_id)
    REFERENCES public.categories(id, division_id) ON DELETE RESTRICT,
  CONSTRAINT categories_cannot_parent_themselves
    CHECK (parent_category_id IS NULL OR parent_category_id <> id)
);

CREATE TABLE public.category_translations (
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  locale_code text NOT NULL REFERENCES public.locales(code) ON UPDATE CASCADE,
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 160),
  summary text CHECK (summary IS NULL OR length(summary) <= 500),
  description text,
  PRIMARY KEY (category_id, locale_code)
);

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);

CREATE TABLE public.service_translations (
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  locale_code text NOT NULL REFERENCES public.locales(code) ON UPDATE CASCADE,
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 160),
  summary text CHECK (summary IS NULL OR length(summary) <= 500),
  description text,
  PRIMARY KEY (service_id, locale_code)
);

-- Seed only the four confirmed NSOMEX Group divisions; no unverified services
-- or business-unit claims are added.
INSERT INTO public.divisions (slug, status, sort_order)
VALUES
  ('technology', 'published', 10),
  ('engineering', 'published', 20),
  ('renewable-energy', 'published', 30),
  ('global-business', 'published', 40)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.division_translations
  (division_id, locale_code, name)
SELECT d.id, v.locale_code, v.name
FROM (VALUES
  ('technology', 'en', 'NSOMEX Technology'),
  ('technology', 'fr', 'NSOMEX Technologie'),
  ('engineering', 'en', 'NSOMEX Engineering'),
  ('engineering', 'fr', 'NSOMEX Ingénierie'),
  ('renewable-energy', 'en', 'NSOMEX Renewable Energy'),
  ('renewable-energy', 'fr', 'NSOMEX Énergies renouvelables'),
  ('global-business', 'en', 'NSOMEX Global Business'),
  ('global-business', 'fr', 'NSOMEX Affaires mondiales')
) AS v(slug, locale_code, name)
JOIN public.divisions d ON d.slug = v.slug
ON CONFLICT (division_id, locale_code) DO UPDATE
SET name = EXCLUDED.name;

-- Indexes for common public content lookups and foreign-key joins.
CREATE INDEX business_units_division_status_order_idx
  ON public.business_units (division_id, status, sort_order);
CREATE INDEX categories_division_status_order_idx
  ON public.categories (division_id, status, sort_order);
CREATE INDEX categories_parent_idx
  ON public.categories (parent_category_id);
CREATE INDEX services_category_status_order_idx
  ON public.services (category_id, status, sort_order);

-- Enable RLS on every table exposed through the Supabase API.
ALTER TABLE public.locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.division_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_unit_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_translations ENABLE ROW LEVEL SECURITY;

-- Public read access is limited to enabled locales and published content.
CREATE POLICY "Public can read enabled locales"
  ON public.locales FOR SELECT TO anon, authenticated
  USING (is_enabled = true);

CREATE POLICY "Public can read published divisions"
  ON public.divisions FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Public can read published division translations"
  ON public.division_translations FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.divisions d
    WHERE d.id = division_id AND d.status = 'published'
  ));

CREATE POLICY "Public can read published business units"
  ON public.business_units FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.divisions d
      WHERE d.id = division_id AND d.status = 'published'
    )
  );

CREATE POLICY "Public can read published business unit translations"
  ON public.business_unit_translations FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.business_units bu
    JOIN public.divisions d ON d.id = bu.division_id
    WHERE bu.id = business_unit_id
      AND bu.status = 'published'
      AND d.status = 'published'
  ));

CREATE POLICY "Public can read published categories"
  ON public.categories FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.divisions d
      WHERE d.id = division_id AND d.status = 'published'
    )
    AND (
      parent_category_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.categories parent
        WHERE parent.id = parent_category_id
          AND parent.status = 'published'
      )
    )
  );

CREATE POLICY "Public can read published category translations"
  ON public.category_translations FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.categories c
    JOIN public.divisions d ON d.id = c.division_id
    WHERE c.id = category_id
      AND c.status = 'published'
      AND d.status = 'published'
  ));

CREATE POLICY "Public can read published services"
  ON public.services FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.categories c
      JOIN public.divisions d ON d.id = c.division_id
      WHERE c.id = category_id
        AND c.status = 'published'
        AND d.status = 'published'
    )
  );

CREATE POLICY "Public can read published service translations"
  ON public.service_translations FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.services s
    JOIN public.categories c ON c.id = s.category_id
    JOIN public.divisions d ON d.id = c.division_id
    WHERE s.id = service_id
      AND s.status = 'published'
      AND c.status = 'published'
      AND d.status = 'published'
  ));

-- No anon/authenticated write policies are created. Supabase service-role
-- operations bypass RLS and must remain server-side only.

COMMIT;
