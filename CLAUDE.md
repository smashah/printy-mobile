# CLAUDE.md

> 📚 **[Complete Documentation Index](./DOCS_INDEX.md)** | 🚀 **[Quick Start](./.cursor/commands/quick-start.md)** | 🎯 **[Critical Rules](./.cursor/commands/critical-rules.md)**

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Printy Mobile is Print labels anywhere with your mobile device. [Add your specific project description here]

**Important Documentation:**
- `notes/PRD.md` - Product Requirements Document with detailed user stories
- `notes/STACK.md` - Complete technology stack documentation
- `notes/TODO.md` - Current tasks and priorities
- `notes/DEVLOG.md` - Development log for tracking changes

## Monorepo Structure

This is a Turborepo monorepo using pnpm workspaces.

### Apps

- **`apps/webapp`** - Main user-facing TanStack Start application (React + Vite)
- **`apps/api`** - Hono API running on Cloudflare Workers
- **`apps/backoffice`** - Admin panel built with Refine for content moderation
- **`apps/web`** - Marketing/landing pages (Next.js)
- **`apps/docs`** - Documentation site (Next.js)

### Packages

- **`packages/auth`** - Better-auth configuration and authentication logic
- **`packages/db`** - Drizzle ORM schemas, migrations, and database utilities
- **`packages/ui`** - Shared shadcn/ui components
- **`packages/common`** - Shared TypeScript types and utilities
- **`packages/eslint-config`** - Shared ESLint configurations
- **`packages/typescript-config`** - Shared TypeScript configurations

## Development Commands

### Root Level Commands

```bash
# Install dependencies
pnpm install

# Run all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Lint all packages
pnpm lint

# Format code
pnpm format

# Type check all packages
pnpm check-types

# Generate code (auth + db schemas)
pnpm generate
```

### API (apps/api)

```bash
# Development with local D1 database
pnpm dev

# Deploy to Cloudflare Workers
pnpm deploy

# Database commands
pnpm db:generate        # Generate Drizzle migrations
pnpm db:migrate         # Run migrations
pnpm db:seed            # Seed database
pnpm db:setup           # Full setup: generate + migrate + seed
pnpm db:studio          # Open Drizzle Studio

# Cloudflare D1 specific
pnpm db:migrate:cf:local   # Migrate local D1
pnpm db:migrate:cf:remote  # Migrate remote D1
pnpm dev:reset             # Reset local D1 database

# Testing
pnpm test               # Run Vitest tests

# View logs
pnpm logs
```

### Webapp (apps/webapp)

```bash
# Development server
pnpm dev

# Build
pnpm build

# Deploy to Cloudflare Pages
pnpm deploy
```

### Backoffice (apps/backoffice)

```bash
# Development server
pnpm dev

# Build
pnpm build

# Production server
pnpm start
```

### Database Package (packages/db)

```bash
# Generate migrations
pnpm generate

# Push schema to database
pnpm db:push

# Pull schema from database
pnpm db:pull

# Open Drizzle Studio
pnpm db:studio

# Open Drizzle Studio for production
pnpm db:studio:prd
```

## Architecture Guidelines

### Frontend (apps/webapp)

- **Router**: TanStack Router for type-safe routing
- **Data Fetching**: TanStack Query for server state management
- **Forms**: TanStack Forms for form handling
- **State**: TanStack Store for global state (when needed)
- **UI Components**: shadcn/ui components from `packages/ui`
- **Styling**: Tailwind CSS
- **Authentication**: Better-auth with TanStack integration

**Key Patterns:**
- Use server-side rendering where possible with TanStack Start
- Implement proper error boundaries
- Handle loading states appropriately
- Use React.lazy for code splitting
- Implement proper memoization for performance

### Backend (apps/api)

- **Framework**: Hono running on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Authentication**: Better-auth middleware
- **Storage**: Cloudflare R2 for media files

**Key Patterns:**
- All routes are defined in `apps/api/src/app.ts`
- Database access is provided via `dbProvider` middleware
- Authentication is handled via `authMiddleware`
- Use Drizzle ORM for all database queries - type-safe queries only
- Implement proper error handling with HTTPException
- All routes should be under `/api` prefix
- Use `/auth/*` routes for authentication endpoints

**Middleware Stack:**
1. `dbProvider` - Provides Drizzle database instance
2. `authMiddleware` - Handles authentication and session
3. `cors` - CORS configuration for allowed origins

### Database (packages/db)

- **ORM**: Drizzle ORM
- **Schema Location**: `packages/db/src/db/`
  - `auth.ts` - Better-auth tables
  - `schema.ts` - Main application tables
- **DTOs**: `packages/db/src/dtos/` - Zod schemas for validation
- **Migrations**: Auto-generated in `packages/db/migrations/`

**Schema Organization:**
- Authentication tables are managed by better-auth
- Application tables use Drizzle's schema definitions
- Use drizzle-zod for automatic Zod schema generation
- All tables should have proper relations defined

### Authentication (packages/auth)

- **Library**: Better-auth
- **Adapter**: Drizzle adapter for D1
- **Configuration**: `packages/auth/lib/auth.ts`
- **Session Management**: Handled automatically by better-auth
- **Middleware**: Available in `apps/api/src/middleware/auth.ts`

**Integration:**
- API uses `authMiddleware` to inject `user` and `session` into context
- Webapp uses `@daveyplate/better-auth-tanstack` for TanStack integration
- Auth routes are exposed at `/auth/*` on the API

### Testing

- **Framework**: Vitest
- **API Tests**: Use `@cloudflare/vitest-pool-workers` for Cloudflare Workers environment
- **Location**: Tests are colocated with source files

## Code Generation Flow

**Important:** The `generate` command must run before `dev` due to Turborepo dependencies:

1. `@printy-mobile/auth#generate` - Generates auth types
2. `@printy-mobile/db#generate` - Generates Drizzle schema and migrations
3. `dev` - Starts development servers

This is configured in `turbo.json` and ensures type safety across the monorepo.

## Environment Variables

### API (apps/api)

Required in `apps/api/.env` or Cloudflare Workers secrets:

```
DATABASE_URL=               # For local development
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
BETTER_AUTH_SECRET=
```

### Webapp (apps/webapp)

Required in `apps/webapp/.env`:

```
VITE_API_URL=              # API endpoint URL
BETTER_AUTH_SECRET=
```

## Cloudflare Configuration

### Wrangler Files

- `apps/api/wrangler.toml` - API worker configuration
- `apps/webapp/wrangler.toml` - Webapp Pages configuration

**Bindings:**
- D1 database binding for API
- R2 bucket binding for media storage

## Development Workflow

1. **Update Documentation**: When making significant changes, update `notes/DEVLOG.md` with the current date and tick off items in `notes/TODO.md`

2. **Conventional Commits**: Use conventional commit format:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `refactor:` - Code refactoring
   - `docs:` - Documentation changes
   - `chore:` - Build/tooling changes

3. **Database Changes**:
   - Modify schemas in `packages/db/src/db/`
   - Run `pnpm db:generate` in packages/db
   - Run migrations: `pnpm db:migrate:cf:local` in apps/api
   - Test changes with `pnpm db:studio`

4. **TypeScript**: Use strict type checking - avoid `any` type

5. **Package Dependencies**: Use `catalog:` references in package.json for shared dependencies defined in pnpm-workspace.yaml

## Running Tests

```bash
# API tests (with Cloudflare Workers environment)
cd apps/api
pnpm test

# Run specific test file
pnpm test path/to/test.test.ts
```

## Deployment

### API to Cloudflare Workers

```bash
cd apps/api
pnpm deploy  # Runs migrations and deploys
```

### Webapp to Cloudflare Pages

```bash
cd apps/webapp
pnpm deploy  # Builds and deploys via wrangler
```

## Common Patterns

### Adding a New API Endpoint

1. Define Zod schema in `packages/db/src/dtos/`
2. Add route in `apps/api/src/app.ts`
3. Use `zValidator` middleware for request validation
4. Access database via `c.var.db`
5. Access authenticated user via `c.var.user` and `c.var.session`

### Adding a New Database Table

1. Define schema in `packages/db/src/db/schema.ts`
2. Export from `packages/db/src/db/index.ts`
3. Run `pnpm db:generate` in packages/db
4. Run `pnpm db:migrate:cf:local` in apps/api
5. Create corresponding Zod DTOs in `packages/db/src/dtos/`

### Adding a New UI Component

1. Create component in `packages/ui/src/components/`
2. Export from `packages/ui/src/index.ts`
3. Use in apps via `import { Component } from "@printy-mobile/ui"`
4. Follow shadcn/ui patterns and Tailwind CSS styling

## Phase-Based Development

The project follows a phased approach (see `notes/PRD.md` for details):

- **Phase 1 (V-1)**: Super MVP - Basic features without auth
- **Phase 2 (V1)**: MVP - User auth and core features
- **Phase 3 (V2)**: Enhanced features with social capabilities
- **Phase 4 (V3)**: Advanced features and integrations
- **Phase 5 (V4)**: Monetization and growth features

Consider the current phase when implementing features to avoid over-engineering.

## Key Technical Decisions

- **Cloudflare Stack**: All infrastructure runs on Cloudflare (Workers, D1, R2, Pages)
- **Type Safety**: End-to-end type safety from database to frontend
- **Monorepo**: Turborepo for coordinated builds and shared code
- **Modern React**: Using latest React 19 patterns and TanStack ecosystem
- **Edge-First**: API designed for edge computing with Cloudflare Workers
