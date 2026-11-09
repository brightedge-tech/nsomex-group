# Architecture

## Guiding principle

Start with one well-structured Next.js application and Supabase. Keep module boundaries clear in code and data, but do not introduce separate services or infrastructure until a measurable need exists.

## Runtime shape

```text
Browser
  |
  v
Vercel-hosted Next.js application
  |-- Public localized pages (server-rendered where appropriate)
  |-- Private admin pages and server-side mutations
  |-- Route handlers for narrowly scoped server endpoints
  |
  +---- Supabase Auth
  +---- Supabase PostgreSQL (RLS)
  +---- Supabase Storage (private drafts / published media)
```

GitHub is the source of truth. Vercel builds preview deployments from branches/PRs and production from the approved production branch. Use ordinary build checks; no separate CI/CD platform is required.

## Application boundaries

Keep the code organized by responsibility:
- `src/app/`: route composition, layouts, route handlers.
- `src/components/`: shared presentation components.
- `src/features/`: domain modules (divisions, services, projects, media, enquiries, careers, insights, admin, localization).
- `src/lib/`: shared infrastructure (Supabase clients, validation, auth helpers, utilities).
- `src/locales/`: translation dictionaries and locale configuration.
- `src/types/`: shared domain and generated database types.
- `supabase/migrations/`: ordered SQL migrations.
- `docs/`: product, architecture, security, and operational decisions.

Avoid putting all domain logic in page components. Keep database access behind server-side feature/data-access modules.

## Content model direction

Use stable UUID primary keys and explicit relationships. Likely entities include:
- divisions
- business_units
- categories (self-referencing parent for hierarchy)
- services
- pages and page_sections
- projects and project_media
- media_assets
- locales and content_translations (or localized fields with a documented strategy)
- enquiries
- vacancies
- articles
- profiles, roles, scoped_role_assignments
- content_revisions, publication_events, audit_logs
- redirects and site_settings

Do not create every table in one speculative migration. Confirm the final schema, access patterns, ownership, translation model, and RLS policies before writing migrations. Use foreign keys, unique constraints, indexes, check constraints, and explicit status fields where appropriate.

## Localization

Use a stable locale strategy for URLs (for example `/en/...` and `/fr/...`). Centralize interface strings. Content translations must have explicit fallback behavior and translated SEO title/description. Do not concatenate translated fragments or assume English and French copy have identical lengths.

## Supabase integration

- Separate server and browser clients.
- Browser uses only the publishable/anon key and user session.
- Server-side privileged operations must be narrowly scoped and must never leak service-role/secret credentials.
- RLS is mandatory for tables exposed to clients.
- Storage access must be protected by bucket policies and ownership/role checks.
- Generate TypeScript database types from the reviewed schema/migrations.
- Never use production credentials for local development.

## Publishing and caching

Content should have explicit draft/review/published states and publication timestamps. Public queries must return published content only. Publishing should invalidate affected route caches/tags. Admin previews should use authenticated access to drafts, not public URLs.

## Deployment environments

- Local development: local `.env.local`, development Supabase project.
- Preview: Vercel preview deployments; use safe non-production data/configuration.
- Production: Vercel production deployment and production Supabase project.

Do not point preview branches at production storage or production data by default.
