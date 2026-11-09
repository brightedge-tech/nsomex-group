# NSOMEX Group — Project Brief

## 1. Purpose and identity

**Tagline:** Connecting Global Business to Global Opportunity.

NSOMEX Group is a technology-driven global business company focused on connecting businesses, products, services, talent, and opportunities across markets. It works across technology, global trade, business development, engineering, renewable energy, and digital transformation.

The website must communicate credibility, capability, trust, international reach, and execution. It should serve prospective clients, business partners, suppliers, talent, and other stakeholders.

## 2. Approved technology and operating model

| Layer | Approved choice |
|---|---|
| Web application | Next.js App Router, React, TypeScript |
| Data and backend services | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Hosting and deployment | Vercel |
| Source control | GitHub |
| Localization | English and French initially |
| Architecture | Modular application; no distributed microservices |

Do not add AWS, a separate NestJS backend, a complex CI/CD platform, or infrastructure that does not solve a demonstrated requirement. Use the native GitHub/Vercel integration and sensible build checks.

## 3. Product scope

### Included
- Public corporate website with a premium, responsive design.
- Pages for the group, its four divisions, business units, categories, services, projects, industries, partnerships, insights, careers, and contact.
- Dynamic, database-backed content with nested navigation and detail pages.
- Full private administration/CMS for managing public content.
- Media library and upload workflow for images, video, and relevant documents.
- Business enquiry capture and administration.
- English and French content, navigation, forms, and metadata.
- Search-engine metadata, sitemap, canonical URLs, and multilingual SEO.
- Secure admin authentication, role-based permissions, publishing workflow, revisions, and audit history.

### Explicitly excluded
- Customer marketplace.
- Online payments or checkout.
- Complex supplier transaction systems.
- AI assistants.
- Distributed microservices.
- Mobile applications as a separate product.
- Multi-tenant customer portals.

Do not quietly add excluded functionality as a future roadmap item.

## 4. Group divisions and illustrative service taxonomy

The following is an initial content taxonomy, not a claim that every service is already operational. The owner must verify service availability and company claims before publication.

### NSOMEX Technology
- Cloud: cloud hosting, migration, infrastructure, DevOps, managed cloud, cloud security, disaster recovery.
- Cybersecurity: network security, penetration testing, security monitoring, risk management.
- Software: web applications, enterprise software, API development.
- AI & Data: AI/ML services, analytics, data engineering.
- Networks: enterprise networking and connectivity.
- Digital: digital transformation, automation, IT consulting.

### NSOMEX Engineering
- Construction: residential, commercial, industrial, institutional, renovation, turnkey.
- Civil Engineering: roads, bridges, drainage, structural works.
- Mechanical Engineering: industrial machinery and mechanical systems.
- Electrical Engineering: electrical installations and power systems.
- Structural Engineering: building structures, foundations, design.
- Project Management: planning, supervision, procurement, execution.
- Infrastructure: transport, utilities, industrial infrastructure.

Construction content may be organized as type → project detail. Project records should support location, description, type, status, dates, specifications, gallery, video, documents, and enquiry CTA. Do not invent completed projects or project credentials.

### NSOMEX Renewable Energy
- Solar Energy: residential, commercial, and industrial solar.
- Energy Storage: batteries and storage systems.
- Wind Energy.
- Power Systems.
- Energy Consulting.
- Renewable Projects.

### NSOMEX Global Business
- International Trade.
- Global Sourcing.
- Import and Export.
- Supply Chain Management.
- Logistics and Distribution.
- Business Development.
- Strategic Partnerships.
- Market Entry and Expansion.
- Product Distribution.
- Supplier and Buyer Connections.

The website describes group capabilities and captures enquiries; it does not execute supplier transactions.

## 5. Public website information architecture

Initial routes:
- `/` — Home
- `/about`
- `/divisions`
- `/divisions/[divisionSlug]`
- `/services`
- `/services/[...slug]`
- `/industries`
- `/projects`
- `/projects/[slug]`
- `/partnerships`
- `/insights` and `/insights/[slug]`
- `/careers` and `/careers/[slug]`
- `/contact`
- Localized equivalents for English and French.

Navigation must support nested divisions → business units/categories → services → detail pages. Engineering projects require browsable categories and individual project pages.

## 6. Administration scope

The private admin should ultimately support:
- Dashboard overview.
- Divisions, business units, nested categories, and services.
- Pages and reusable page sections.
- Projects and project galleries.
- Media library: upload, preview, reorder, captions, alt text, replacement, deletion, reuse, search, tags, and collections.
- News/insights.
- Business enquiries.
- Careers and vacancies.
- English/French translations and translated SEO metadata.
- Users, roles, scoped permissions, publishing approvals, revisions, and audit logs.
- Site settings and SEO controls.

Proposed roles: Super Administrator, Group Administrator, Division Manager, Content Editor, Project Manager, Media Manager, Translator, and Viewer. Implement only the minimum permissions needed for each release and enforce them server-side.

## 7. Media workflow — required acceptance behavior

1. An authorized administrator selects a division, business unit/category, and project/page.
2. The administrator selects or drags files from their computer into the browser.
3. The server verifies identity, role, file type, size, and allowed destination.
4. Files upload to Supabase Storage using controlled paths and least-privilege policies.
5. Metadata and content associations are stored in PostgreSQL.
6. Draft media remains private and can be previewed only by authorized users.
7. An authorized publisher publishes the associated content.
8. Public pages show only published media.
9. Authorized users can reorder, caption, replace, reuse, or remove media with appropriate audit history.

Support common image formats (JPEG, PNG, WebP, AVIF), video (MP4), and PDFs where relevant. Validate actual file content, not only filename extensions or browser MIME claims. Use private storage for drafts and signed preview URLs. Do not place secrets in client code.

## 8. Design direction

- Premium, dark corporate visual identity.
- Deep navy/charcoal foundations, white typography, restrained gold accents.
- Strong editorial typography, spacious layouts, professional photography, and clear calls to action.
- Responsive desktop, tablet, and mobile layouts.
- Avoid generic template appearance, excessive gradients, clutter, and fabricated company statistics.
- Images used during design development must be replaceable through the admin media workflow.

## 9. Quality and acceptance

- English/French from the beginning; no hardcoded interface copy.
- Accessible semantic UI with keyboard support and WCAG 2.2 AA as the target.
- Secure server-side authorization and Supabase RLS.
- Draft/review/publish flow and revision history.
- Responsive and performant pages, optimized images, metadata, sitemap, and multilingual SEO.
- Public contact forms with validation, spam protection, and rate limiting before production.
- Tests for critical authorization and publishing paths.
- Production build, typecheck, and lint pass before release.
- No deployment or production database change without an explicit release step and approval.

## 10. Open inputs (do not guess)

Before production content and deployment, obtain verified:
- Official logo and brand assets.
- Company registration/legal details and approved corporate wording.
- Official addresses, phone numbers, and email addresses.
- Verified projects, locations, photos, and service claims.
- Domain and DNS access.
- Supabase project and region; separate development/staging and production projects.
- Named initial administrators and their roles.
- Privacy, cookie, and terms wording reviewed by the owner/advisor.
