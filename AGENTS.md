# Engineering instructions

These rules apply to every contributor and coding agent working in this repository.

## Before changing code
1. Read this file and the relevant documents in `docs/`.
2. Inspect the current implementation and git diff before editing. Do not assume a file is empty or replace a working implementation without understanding it.
3. Keep changes small, cohesive, and reviewable. Explain the reason for architectural changes.
4. Do not invent company facts, client names, project credentials, certifications, addresses, or contact details. Use clearly marked content placeholders until the owner supplies verified facts.

## Product boundaries
- Build the NSOMEX Group corporate website and its administration/CMS.
- The four divisions are NSOMEX Technology, NSOMEX Engineering, NSOMEX Renewable Energy, and NSOMEX Global Business.
- English and French are required from the start.
- Do not add customer marketplace functionality, online payments, supplier transaction systems, AI assistants, microservices, mobile apps, or multi-tenant customer portals. These are explicitly out of scope.
- Keep the implementation cost-conscious: Next.js + Supabase + Vercel + GitHub. Do not introduce AWS, a separate NestJS backend, or a complex CI/CD platform without a new, explicit business requirement.

## Data and database safety
- Never run destructive SQL, reset a database, drop/rename production objects, or apply migrations to production without explicit user approval.
- Every schema change must be a timestamped Supabase migration under `supabase/migrations/`.
- Review migration SQL for data loss, locking, foreign keys, indexes, RLS, grants, and rollback implications.
- Test migrations on a separate development/staging Supabase project first.
- Enable and verify Row Level Security on exposed tables. Policies must follow least privilege.
- Never expose Supabase service-role/secret keys, database passwords, GitHub tokens, or other secrets in browser code, logs, commits, issues, or chat.
- Only public/publishable Supabase configuration may use `NEXT_PUBLIC_*` variables.

## Application security
- Treat all browser input, uploaded files, URL parameters, and database content as untrusted.
- Enforce authorization on the server and in database policies; hiding a UI control is not authorization.
- Validate input on the server, use parameterized database operations, and avoid unsafe HTML rendering.
- Protect admin routes and mutations. Add rate limiting and anti-spam controls to public forms before production.
- Keep drafts and unpublished media private. Public delivery must be limited to published content.
- Do not claim security certification or compliance without an independent assessment.

## Quality gates
- Use TypeScript strict mode.
- Prefer server components; add client components only for actual browser interactivity.
- Provide accessible labels, keyboard interaction, visible focus, semantic landmarks, and sufficient contrast.
- Avoid hardcoded UI strings. Public and admin interface text must use the shared localization strategy.
- Verify lint, typecheck, and production build before declaring a phase complete. If a check could not be run, say so clearly.
- Never claim that code was deployed, tested, or connected to Supabase unless the relevant operation actually succeeded.

## Git workflow
- Work on a feature or development branch, not directly on `main`.
- Do not force-push, rewrite history, or delete existing user work.
- Keep secrets and local environment files out of commits.
- Summarize changed files, checks performed, known limitations, and the next safe step after each phase.
