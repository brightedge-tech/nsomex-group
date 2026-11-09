# NSOMEX Group

**Connecting Global Business to Global Opportunity.**

NSOMEX Group is a technology-driven global business company connecting businesses, products, services, talent, and opportunities across markets. The group operates across technology, engineering, renewable energy, and global business.

## Project

This repository contains the NSOMEX Group corporate website and its private administration system.

- **Web application:** Next.js App Router, React, TypeScript
- **Database, authentication and media storage:** Supabase
- **Hosting and deployment:** Vercel
- **Source control:** GitHub
- **Languages:** English and French from the beginning

The application is a corporate website and content-management platform. It is not a customer marketplace, payment platform, supplier transaction system, mobile application, or microservices platform.

## Development

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site starts at http://localhost:3000.

Do not add real credentials to the repository. Keep `.env.local` out of Git. See [AGENTS.md](./AGENTS.md), [the project brief](./docs/PROJECT_BRIEF.md), [architecture](./docs/ARCHITECTURE.md), and [security rules](./docs/SECURITY.md) before making changes.

## Delivery approach

Work in small, reviewable changes. Database changes must be versioned migrations, reviewed before execution, and tested against a non-production Supabase project first. Production publishing and destructive database operations require explicit approval.
