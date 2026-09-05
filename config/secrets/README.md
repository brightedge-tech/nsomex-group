# NSOMEX Secrets

This directory contains documentation only. Do not place credentials here.

## Required values

Obtain these values from the Supabase Dashboard under **Project Settings > API**:

- `NEXT_PUBLIC_SUPABASE_URL`: the project URL. It is browser-safe.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the publishable/anon key. It is browser-safe and protected by RLS.
- `SUPABASE_SERVICE_ROLE_KEY`: the service-role key. Server-only; never expose it to client components, commit it, or use it in browser code.

Copy the placeholders from the repository `.env.example` into a local `.env.local` file and fill them with values from your own Supabase project. `.env.local` is ignored by Git.

The application remains on mock authentication and mock services until the two public Supabase values are present. The service-role key is not required for the current client/session flow and should only be added later for trusted server-side operations that genuinely need it.
