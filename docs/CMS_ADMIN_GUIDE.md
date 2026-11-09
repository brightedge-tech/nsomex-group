# CMS administrator foundation

## What this phase adds

- Supabase Auth remains the identity provider. There is no public admin registration.
- A private CMS profile is separate from authentication metadata.
- Roles are assigned globally only for `super_admin`, or to a specific division for all other roles.
- Permissions are centrally mapped to roles and checked with `cms_has_permission(permission, division_id)`.
- Content revisions store version snapshots. Audit logs record privileged actions.
- Authenticated users can read only the admin data their policies permit. All privileged writes remain server-side.

## Initial role model

| Role | Scope | Main authority |
|---|---|---|
| `super_admin` | Entire group | Manage administrators, all content, publishing, audit |
| `division_admin` | One assigned division | Manage that division's content, team assignments, publishing and audit |
| `editor` | One assigned division | Create/edit content, manage media, submit for review |
| `reviewer` | One assigned division | Read drafts and review submitted content |

A division administrator must not be able to grant `super_admin` or grant roles outside their division. Enforce that rule in the server-side role-management endpoint; do not rely on the UI.

## First administrator bootstrap

The migration intentionally creates no admin account and no password.

1. In the confirmed development Supabase project, invite or create the first administrator through Supabase Auth using the owner's chosen email address.
2. Locate that user's Auth UUID in the Supabase dashboard. Do not copy or share a password, access token, or service-role key.
3. In the SQL Editor for the development project only, insert the admin profile and one global `super_admin` assignment. Use the same Auth UUID as both `user_id` and `granted_by` for the initial bootstrap.

```sql
-- Replace the UUID and display name with the owner-approved values.
-- Run only after the CMS migration has been reviewed and applied to development.
INSERT INTO public.cms_admin_profiles (user_id, display_name, created_by)
VALUES (
  'REPLACE-WITH-AUTH-USER-UUID',
  'CMS Administrator',
  'REPLACE-WITH-AUTH-USER-UUID'
);

INSERT INTO public.cms_role_assignments (
  user_id, role, division_id, granted_by, reason
)
VALUES (
  'REPLACE-WITH-AUTH-USER-UUID',
  'super_admin',
  NULL,
  'REPLACE-WITH-AUTH-USER-UUID',
  'Initial owner-approved CMS administrator bootstrap'
);
```

Do not put real credentials or UUIDs in Git. After bootstrap, all role grants and revocations should go through a server-side endpoint that authenticates the current user, checks `admin.manage` for the target division, prevents privilege escalation, and writes an audit event.

## Server-side authorization requirements

- Protect every `/admin` route and every mutation with a verified Supabase Auth session.
- Check permissions on the server for every action. Hiding a button is not authorization.
- Use the user's session-bound Supabase client to verify identity and call `cms_has_permission`.
- Use a server-only service-role client only after the session and permission checks succeed. Never send its key to the browser.
- Do not trust user IDs, role names, division IDs, or storage object paths supplied by the browser.
- Log role changes, content edits, review decisions, publishing, archive/delete actions, and application-status changes.
- Keep applicant data and CVs out of content revision snapshots and general audit metadata.
- Make audit logs and revisions append-only through the application; authenticated clients receive no write grants.
- Add MFA for privileged accounts where supported, session expiry, rate limits, and security monitoring before production launch.

## Publishing workflow

Use the existing content statuses consistently:

1. Editor saves a draft and its revision.
2. Editor submits the item for review.
3. Reviewer records an approval or rejection decision.
4. A division administrator or super administrator publishes approved content.
5. The server updates the content status and publication timestamp, invalidates relevant Next.js cache tags/routes, and appends audit events.

The database status columns already exist in the pages, projects, articles, and careers modules. The application must enforce valid state transitions and required translations before publishing. A status value alone is not proof that the workflow checks were performed.

## Migration safety

- Review the complete migration sequence before applying it.
- Apply only to the confirmed development Supabase project after a dry run.
- Do not run this against production.
- Generate fresh TypeScript database types after the schema is applied.
