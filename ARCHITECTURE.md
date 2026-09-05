# NSOMEX Frontend Architecture

## Stack and routing

NSOMEX is a Next.js App Router application using React, TypeScript, and Tailwind CSS. Routes live under `app/`; shared UI and workspace components live under `components/`.

Primary route areas include marketplace discovery, buyer account/procurement, supplier workspace, admin operations, RFQs, orders, checkout, logistics, messaging, disputes, reviews, and authentication/onboarding.

## Roles and session

The mock session is centralized in `components/auth/AuthProvider.tsx` and `lib/mock-auth.ts`. Supported roles are `guest`, `buyer`, `supplier`, and `admin`. `components/layout/global-layout.tsx` and `components/auth/RouteGuard.tsx` provide frontend-only route protection. This is not backend authorization.

## Data and domain models

Existing UI fixtures remain in `lib/data/`. Backend-facing contracts are defined in `lib/types/domain.ts` and API result/error shapes are in `lib/types/api.ts`. `lib/data/domains.ts` adapts existing procurement fixtures into typed users, suppliers, RFQs, quotes, orders, shipments, notifications, and disputes.

New mock data should be added to a domain data module and exposed through a service rather than embedded in route components.

## Services

`lib/services/` is the replacement boundary for future API or Supabase integration. Product, supplier, user, RFQ, quote, order, shipment, payment, messaging, notification, review, dispute, and file-upload operations currently return mock data through `mock-service.ts`. Future implementations can replace these modules without changing page components.

Supabase integration lives under `lib/supabase/` and `lib/services/authService.ts`. The browser client uses the publishable key, the server client uses request cookies, and the admin client requires the server-only service-role key. When public Supabase variables are absent, the current mock session remains active so local frontend work continues.

Apply `supabase/migrations/20260905000000_initial_nsomex.sql` with the Supabase CLI (`supabase db push`) or the SQL Editor after linking the intended project. The migration creates the core marketplace tables, foreign keys, indexes, profile trigger, and RLS policies. Review policies in the project before production launch.

## Configuration and secrets

`lib/config.ts` is the single configuration entry point. Browser-safe values use `NEXT_PUBLIC_` variables. Server-only secrets must not use that prefix and must never be imported into client components. `.env.example` contains placeholders only; local secret values belong in an ignored `.env.local` file.

Secret placement and the exact Dashboard locations are documented in `config/secrets/README.md`. No Supabase project URL, key, password, or service-role secret is committed in this repository.

## Shared UI and state

`components/ui/async-state.tsx` contains reusable loading, empty, and error states. `components/ui/ToastProvider.tsx` provides global success, error, warning, and information notifications. `components/ui/FileUpload.tsx` is a mock upload boundary for future object storage.

## Validation and backend seams

`lib/validation.ts` contains shared Zod schemas for authentication, registration, RFQs, and reviews. Add schemas before wiring new forms. Supabase Auth owns passwords and sessions; the database migration owns profile roles and RLS. The backend must remain the final authority for authorization, persistence, validation enforcement, file security, payments, and secret handling. The profile trigger ignores `admin` signup metadata; administrator promotion must happen through a trusted operator workflow.
