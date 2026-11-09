-- NSOMEX Group CMS administrator, scoped authorization, revisions, and audit foundation.
-- All privileged writes are server-side. No admin accounts or credentials are seeded.

BEGIN;

CREATE TABLE public.cms_admin_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL
    CHECK (char_length(btrim(display_name)) BETWEEN 2 AND 120),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cms_role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL
    CHECK (role IN ('super_admin', 'division_admin', 'editor', 'reviewer')),
  division_id uuid REFERENCES public.divisions(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  reason text,
  CONSTRAINT cms_role_scope_check CHECK (
    (role = 'super_admin' AND division_id IS NULL)
    OR
    (role <> 'super_admin' AND division_id IS NOT NULL)
  ),
  CONSTRAINT cms_role_revocation_check CHECK (
    revoked_at IS NULL OR revoked_at >= granted_at
  )
);

CREATE UNIQUE INDEX cms_role_assignments_one_active_role_uidx
  ON public.cms_role_assignments (
    user_id,
    role,
    COALESCE(division_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  WHERE revoked_at IS NULL;

CREATE INDEX cms_role_assignments_user_active_idx
  ON public.cms_role_assignments (user_id, division_id)
  WHERE revoked_at IS NULL;

CREATE TABLE public.cms_role_permissions (
  role text NOT NULL
    CHECK (role IN ('super_admin', 'division_admin', 'editor', 'reviewer')),
  permission_key text NOT NULL
    CHECK (permission_key ~ '^[a-z][a-z0-9_.-]{1,100}$'),
  PRIMARY KEY (role, permission_key)
);

INSERT INTO public.cms_role_permissions (role, permission_key)
SELECT 'super_admin', permission_key
FROM unnest(ARRAY[
  'admin.manage',
  'content.read_draft',
  'content.create',
  'content.edit',
  'content.submit_review',
  'content.review',
  'content.publish',
  'content.archive',
  'media.manage',
  'careers.manage',
  'applications.review',
  'audit.read'
]::text[]) AS permission_key;

INSERT INTO public.cms_role_permissions (role, permission_key)
SELECT 'division_admin', permission_key
FROM unnest(ARRAY[
  'admin.manage',
  'content.read_draft',
  'content.create',
  'content.edit',
  'content.submit_review',
  'content.review',
  'content.publish',
  'content.archive',
  'media.manage',
  'careers.manage',
  'applications.review',
  'audit.read'
]::text[]) AS permission_key;

INSERT INTO public.cms_role_permissions (role, permission_key)
SELECT 'editor', permission_key
FROM unnest(ARRAY[
  'content.read_draft',
  'content.create',
  'content.edit',
  'content.submit_review',
  'media.manage'
]::text[]) AS permission_key;

INSERT INTO public.cms_role_permissions (role, permission_key)
SELECT 'reviewer', permission_key
FROM unnest(ARRAY[
  'content.read_draft',
  'content.review'
]::text[]) AS permission_key;

-- This SECURITY DEFINER helper reads assignments without triggering recursive RLS.
-- It is safe for authenticated callers: it only evaluates the current auth.uid().
CREATE OR REPLACE FUNCTION public.cms_has_permission(
  requested_permission text,
  requested_division_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.cms_role_assignments assignment
    JOIN public.cms_role_permissions permission
      ON permission.role = assignment.role
    WHERE assignment.user_id = auth.uid()
      AND assignment.revoked_at IS NULL
      AND permission.permission_key = requested_permission
      AND (
        assignment.role = 'super_admin'
        OR (
          requested_division_id IS NOT NULL
          AND assignment.division_id = requested_division_id
        )
      )
  );
$function$;

REVOKE ALL ON FUNCTION public.cms_has_permission(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cms_has_permission(text, uuid) TO authenticated;

CREATE TABLE public.cms_content_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL
    CHECK (entity_type IN (
      'division',
      'business_unit',
      'category',
      'service',
      'page',
      'page_section',
      'project',
      'article',
      'article_category',
      'job_opening'
    )),
  entity_id uuid NOT NULL,
  division_id uuid REFERENCES public.divisions(id) ON DELETE SET NULL,
  locale_code text REFERENCES public.locales(code) ON UPDATE CASCADE ON DELETE SET NULL,
  revision_number integer NOT NULL CHECK (revision_number > 0),
  snapshot jsonb NOT NULL CHECK (jsonb_typeof(snapshot) = 'object'),
  change_summary text
    CHECK (change_summary IS NULL OR char_length(change_summary) <= 1000),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entity_type, entity_id, locale_code, revision_number)
);

CREATE INDEX cms_content_revisions_entity_idx
  ON public.cms_content_revisions (entity_type, entity_id, revision_number DESC);

CREATE INDEX cms_content_revisions_division_created_idx
  ON public.cms_content_revisions (division_id, created_at DESC);

CREATE TABLE public.cms_audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL
    CHECK (action IN (
      'created',
      'updated',
      'submitted_for_review',
      'review_approved',
      'review_rejected',
      'published',
      'unpublished',
      'archived',
      'deleted',
      'role_granted',
      'role_revoked',
      'application_status_changed',
      'media_uploaded',
      'media_deleted'
    )),
  resource_type text NOT NULL
    CHECK (resource_type ~ '^[a-z][a-z0-9_]{1,80}$'),
  resource_id text,
  division_id uuid REFERENCES public.divisions(id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX cms_audit_logs_division_created_idx
  ON public.cms_audit_logs (division_id, created_at DESC);

CREATE INDEX cms_audit_logs_actor_created_idx
  ON public.cms_audit_logs (actor_user_id, created_at DESC);

ALTER TABLE public.cms_admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_audit_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
  public.cms_admin_profiles,
  public.cms_role_assignments,
  public.cms_role_permissions,
  public.cms_content_revisions,
  public.cms_audit_logs
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE
  public.cms_admin_profiles,
  public.cms_role_assignments,
  public.cms_content_revisions,
  public.cms_audit_logs
TO authenticated;

GRANT ALL ON TABLE
  public.cms_admin_profiles,
  public.cms_role_assignments,
  public.cms_role_permissions,
  public.cms_content_revisions,
  public.cms_audit_logs
TO service_role;

GRANT USAGE, SELECT ON SEQUENCE public.cms_audit_logs_id_seq TO service_role;

CREATE POLICY "Admins can read their own admin profile"
  ON public.cms_admin_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read their own role assignments"
  ON public.cms_role_assignments FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.cms_has_permission('admin.manage', division_id)
  );

CREATE POLICY "Authorized admins can read content revisions"
  ON public.cms_content_revisions FOR SELECT TO authenticated
  USING (
    public.cms_has_permission('content.read_draft', division_id)
  );

CREATE POLICY "Authorized admins can read audit history"
  ON public.cms_audit_logs FOR SELECT TO authenticated
  USING (
    public.cms_has_permission('audit.read', division_id)
  );

COMMENT ON TABLE public.cms_admin_profiles IS
  'Private CMS identity profile; authentication remains managed by Supabase Auth.';
COMMENT ON TABLE public.cms_role_assignments IS
  'Division-scoped CMS roles. Role changes are performed only by trusted server-side workflows.';
COMMENT ON TABLE public.cms_role_permissions IS
  'Allowlist mapping CMS roles to permission keys.';
COMMENT ON FUNCTION public.cms_has_permission(text, uuid) IS
  'Checks the current authenticated user permission globally for super admins or within one division.';
COMMENT ON TABLE public.cms_content_revisions IS
  'Immutable snapshots of CMS content versions; do not store applicant records or secrets here.';
COMMENT ON TABLE public.cms_audit_logs IS
  'Append-only audit events for privileged CMS activity; metadata must not contain secrets or unnecessary personal data.';

COMMIT;
