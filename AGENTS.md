# Printy Mobile

**Status:** Ported from printy PoC | **Structure:** Monorepo (pnpm workspaces)

## OVERVIEW

Mobile-first thermal printing application for generating labels, tickets, and documents. Uses Hono on Cloudflare Workers for the API and React Native for the upcoming mobile app.

## STRUCTURE

```
.
├── apps/
│   ├── printer-api-service/  # PDF Generation API (Cloudflare Workers) ⭐
│   ├── api/                  # Main Backend API (Auth, DB, D1)
│   └── native/               # Expo + NativeWind mobile app
├── packages/
│   ├── capabilities/         # Shared PDF templates, services, and utils ⭐
│   ├── auth/                 # Better Auth configuration
│   ├── common/               # Shared utilities
│   ├── config/               # Environment + project globals
│   ├── db/                   # Drizzle schema + migrations
│   ├── ui/                   # shadcn/ui components (web)
│   └── typescript-config/    # Shared TS configs
├── mockups/                  # Design artifacts
└── notes/                    # PRD, architecture, devlog
```

## WHERE TO LOOK

| Task                  | Location                               | Notes                |
| --------------------- | -------------------------------------- | -------------------- |
| Add PDF Template      | `packages/capabilities/src/templates/` | React PDF components |
| Add Data Service      | `packages/capabilities/src/services/`  | API fetching logic   |
| Modify Printer API    | `apps/printer-api-service/src/routes/` | Hono route handlers  |
| Add Mobile Screen     | `apps/native/src/screens/`             | Expo / React Native  |
| Add Main API endpoint | `apps/api/src/routes/`                 | See API-PATTERNS.md  |

## CONVENTIONS

### PDF Generation

- Use `@react-pdf/renderer` for templates.
- Standard thermal label size: `[288, 432]` points (4x6 inches).
- Always use dithering for images to ensure clarity on thermal prints via `packages/capabilities/src/utils/dithering.ts`.

### Monorepo

- Use `pnpm` exclusively.
- Run commands using Turborepo filters: `pnpm --filter @printy-mobile/printer-api-service dev`.

## COMMANDS

```bash
# Development
pnpm dev                            # All apps (TUI mode)
pnpm --filter @printy-mobile/printer-api-service dev  # Only printer API

# Type Checking
pnpm check-types                    # Check all packages

# Formatting
pnpm format                         # Format all with Biome/Prettier
```

## DEV SERVER PORTS

Each app runs on a dedicated port to avoid conflicts:

| App | Port | Notes |
|-----|------|-------|
| `apps/api` | 8930 | Main backend API |
| `apps/printer-api-service` | 8938 | PDF generation API |
| `apps/native` (Expo) | 8939 | Mobile dev server |

**CRITICAL:** When adding new apps, assign unique ports and document them here.

## WRANGLER CONFIGURATION

Before deploying or running Cloudflare Workers locally:

1. **`account_id`** - Must be set in `wrangler.toml` (get from Cloudflare dashboard)
2. **`database_id`** - Must be a valid D1 database ID (run `wrangler d1 create <name>` to create)
3. **`keep_vars`** - Comment out if causing issues with local dev

```toml
# apps/api/wrangler.toml - REQUIRED fields
account_id = "your-account-id"

[[d1_databases]]
database_id = "your-d1-database-id"  # NOT "YOUR_DATABASE_ID"
```

## ANTI-PATTERNS

- **NEVER** use `any`, `@ts-ignore` in `packages/capabilities`.
- **NEVER** add business logic to `printer-api-service`; keep it in `packages/capabilities/services`.
- **NEVER** modify `pnpm-lock.yaml` manually.
- **NEVER** leave placeholder values like `YOUR_DATABASE_ID` in config files.
- **NEVER** use conflicting ports across apps.
