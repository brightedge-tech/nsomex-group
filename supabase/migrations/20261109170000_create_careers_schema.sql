-- NSOMEX Group CMS: bilingual career opportunities and confidential applications.
-- Applicant personal data is private and must be handled only by trusted server-side workflows.
-- No job vacancies or applicant records are seeded.

BEGIN;

CREATE TABLE public.job_openings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id uuid
    REFERENCES public.divisions(id) ON DELETE SET NULL,
  employment_type text NOT NULL
    CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'temporary', 'internship')),
  workplace_type text NOT NULL DEFAULT 'onsite'
    CHECK (workplace_type IN ('onsite', 'hybrid', 'remote')),
  location_name text,
  city text,
  region text,
  country_code text
    CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$'),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'closed', 'archived')),
  application_deadline date,
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_openings_published_at_required
    CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE TABLE public.job_opening_translations (
  job_opening_id uuid NOT NULL
    REFERENCES public.job_openings(id) ON DELETE CASCADE,
  locale_code text NOT NULL
    REFERENCES public.locales(code) ON UPDATE CASCADE ON DELETE RESTRICT,
  slug text NOT NULL
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL
    CHECK (char_length(btrim(title)) BETWEEN 1 AND 200),
  department text
    CHECK (department IS NULL OR char_length(department) <= 120),
  summary text
    CHECK (summary IS NULL OR char_length(summary) <= 800),
  description jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(description) = 'object'),
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb
    CHECK (jsonb_typeof(requirements) = 'array'),
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb
    CHECK (jsonb_typeof(benefits) = 'array'),
  seo_title text
    CHECK (seo_title IS NULL OR char_length(seo_title) <= 200),
  seo_description text
    CHECK (seo_description IS NULL OR char_length(seo_description) <= 320),
  PRIMARY KEY (job_opening_id, locale_code),
  UNIQUE (locale_code, slug)
);

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_opening_id uuid NOT NULL
    REFERENCES public.job_openings(id) ON DELETE RESTRICT,
  applicant_name text NOT NULL
    CHECK (char_length(btrim(applicant_name)) BETWEEN 2 AND 200),
  email text NOT NULL
    CHECK (char_length(btrim(email)) BETWEEN 3 AND 320),
  phone text
    CHECK (phone IS NULL OR char_length(phone) <= 40),
  cover_letter text
    CHECK (cover_letter IS NULL OR char_length(cover_letter) <= 10000),
  resume_bucket text NOT NULL DEFAULT 'nsomex-media'
    CHECK (resume_bucket = 'nsomex-media'),
  resume_object_path text
    CHECK (
      resume_object_path IS NULL
      OR (
        resume_object_path !~ '^/'
        AND resume_object_path !~ '(^|/)\.\.(/|$)'
      )
    ),
  status text NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'reviewing', 'shortlisted', 'rejected', 'withdrawn')),
  consent_given boolean NOT NULL DEFAULT false CHECK (consent_given = true),
  consented_at timestamptz NOT NULL DEFAULT now(),
  privacy_notice_version text NOT NULL
    CHECK (char_length(btrim(privacy_notice_version)) BETWEEN 1 AND 40),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX job_openings_public_listing_idx
  ON public.job_openings (status, published_at DESC, application_deadline);

CREATE INDEX job_openings_division_idx
  ON public.job_openings (division_id, status)
  WHERE division_id IS NOT NULL;

CREATE INDEX job_applications_job_submitted_idx
  ON public.job_applications (job_opening_id, submitted_at DESC);

CREATE INDEX job_applications_status_submitted_idx
  ON public.job_applications (status, submitted_at DESC);

ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_opening_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Public visitors may read published vacancies only.
-- Application submissions and all applicant data are handled through a validated,
-- rate-limited server endpoint using a server-only service-role credential.
REVOKE ALL ON TABLE
  public.job_openings,
  public.job_opening_translations,
  public.job_applications
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE
  public.job_openings,
  public.job_opening_translations
TO anon, authenticated;

GRANT ALL ON TABLE
  public.job_openings,
  public.job_opening_translations,
  public.job_applications
TO service_role;

CREATE POLICY "Public can read published job openings"
  ON public.job_openings FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND published_at <= now()
    AND (application_deadline IS NULL OR application_deadline >= CURRENT_DATE)
    AND (
      division_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.divisions d
        WHERE d.id = division_id AND d.is_active
      )
    )
  );

CREATE POLICY "Public can read published job opening translations"
  ON public.job_opening_translations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.job_openings j
      WHERE j.id = job_opening_id
        AND j.status = 'published'
        AND j.published_at <= now()
        AND (j.application_deadline IS NULL OR j.application_deadline >= CURRENT_DATE)
        AND (
          j.division_id IS NULL
          OR EXISTS (
            SELECT 1 FROM public.divisions d
            WHERE d.id = j.division_id AND d.is_active
          )
        )
    )
    AND EXISTS (
      SELECT 1 FROM public.locales l
      WHERE l.code = locale_code AND l.is_enabled
    )
  );

COMMENT ON TABLE public.job_openings IS
  'Career vacancies with English/French descriptions and publication lifecycle.';
COMMENT ON TABLE public.job_opening_translations IS
  'Localized job title, department, description, requirements, benefits, and SEO content.';
COMMENT ON TABLE public.job_applications IS
  'Confidential applicant personal data; never expose this table to public browser clients.';
COMMENT ON COLUMN public.job_applications.resume_object_path IS
  'Private object key in the nsomex-media bucket; never expose a public URL for applicant documents.';
COMMENT ON COLUMN public.job_applications.privacy_notice_version IS
  'Version of the privacy notice shown to the applicant at submission time.';

COMMIT;
