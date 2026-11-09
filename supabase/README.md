# Supabase

This directory is reserved for version-controlled Supabase configuration and SQL migrations.

## Safety rules
- Do not link or migrate a production project until its identity and environment are confirmed.
- Use a separate development/staging project first.
- Never commit `.env.local`, database passwords, access tokens, or service-role/secret keys.
- Review every migration before applying it.
- Keep RLS enabled and policies least-privilege for all exposed tables.
- Do not use `supabase db reset` against a linked production project.

## Planned next steps
1. Confirm the development Supabase project and region.
2. Install/pin the Supabase CLI as a development dependency or document the approved CLI workflow.
3. Define the initial content schema and RLS policy matrix.
4. Add reviewed timestamped migrations.
5. Generate TypeScript database types from the migrated development schema.
