# @printy-mobile/config

Centralized environment configuration and validation for the SmashStack monorepo.

## Overview

This package provides type-safe environment configuration validation using Zod schemas. It ensures that all required environment variables are present and properly formatted before your application starts, preventing runtime errors from misconfiguration.

## Features

- ✅ Type-safe environment variables with TypeScript
- ✅ Validation using Zod schemas
- ✅ Separate schemas for API and webapp environments
- ✅ Cloudflare Workers bindings support (D1, R2, KV)
- ✅ Helpful error messages for missing or invalid env vars
- ✅ Safe parsing options that don't throw
- ✅ Environment-specific configuration helpers
- ✅ Production/development/staging checks

## Installation

This package is already part of the monorepo. To use it in your apps:

```json
{
  "dependencies": {
    "@printy-mobile/config": "workspace:*"
  }
}
```

## Usage

### API (Cloudflare Workers / Hono)

```typescript
import { parseApiEnv, type ApiConfig } from "@printy-mobile/config";

// In your Cloudflare Worker entry point
export default {
  async fetch(request: Request, env: any) {
    // Validate environment on startup
    const config = parseApiEnv(env);

    // Now you have fully typed config
    console.log(config.API_PORT); // TypeScript knows this is a number
    console.log(config.BETTER_AUTH_SECRET); // string (required, min 32 chars)
    console.log(config.STRIPE_SECRET_KEY); // string | undefined (optional)

    // Use in your app
    const app = new Hono();
    // ... your routes

    return app.fetch(request, env);
  },
};
```

### Webapp (React + Vite)

```typescript
import { parseWebappEnv, type WebappConfig } from "@printy-mobile/config";

// In your main.tsx or app entry point
const config = parseWebappEnv(import.meta.env);

console.log(config.VITE_API_URL); // string (required URL)
console.log(config.VITE_ENABLE_ANALYTICS); // boolean | undefined
```

### Safe Parsing (No Exceptions)

If you don't want validation errors to throw:

```typescript
import { safeParseApiEnv } from "@printy-mobile/config";

const result = safeParseApiEnv(env);

if (result.success) {
  // Validation passed
  const config = result.data;
  console.log(config.API_PORT);
} else {
  // Validation failed
  console.error("Environment validation failed:");
  result.error.errors.forEach((err) => {
    console.error(`  ${err.path.join(".")}: ${err.message}`);
  });
}
```

## Environment Variables

### API Environment Variables

#### Required

| Variable             | Type                  | Description                                                          |
| -------------------- | --------------------- | -------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET` | string (min 32 chars) | Secret key for Better Auth (generate with `openssl rand -base64 32`) |
| `BETTER_AUTH_URL`    | URL                   | Base URL for Better Auth endpoints                                   |

#### Optional

**OAuth Providers:**

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` - Discord OAuth

**Database:**

- `DATABASE_URL` - Database connection string (for local development)

**Redis:**

- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST API token

**Background Jobs:**

- `TRIGGER_SECRET_KEY` - Trigger.dev secret key
- `TRIGGER_API_URL` - Trigger.dev API URL

**Email Services (choose one):**

- `RESEND_API_KEY` - Resend email service
- `SENDGRID_API_KEY` - SendGrid email service
- `MAILGUN_API_KEY` - Mailgun email service

**Payments:**

- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

**AI Services:**

- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key

**Monitoring:**

- `SENTRY_DSN` - Sentry error tracking DSN
- `AXIOM_TOKEN` - Axiom logging token
- `AXIOM_DATASET` - Axiom dataset name

### Webapp Environment Variables

All webapp env vars must be prefixed with `VITE_` to be exposed to the frontend.

#### Required

| Variable       | Type | Description          |
| -------------- | ---- | -------------------- |
| `VITE_API_URL` | URL  | API base URL         |
| `VITE_APP_URL` | URL  | Application base URL |

#### Optional

| Variable                      | Type    | Description                                |
| ----------------------------- | ------- | ------------------------------------------ |
| `VITE_BETTER_AUTH_URL`        | URL     | Better Auth URL (usually same as API URL)  |
| `VITE_ENABLE_ANALYTICS`       | boolean | Enable analytics                           |
| `VITE_ENABLE_SENTRY`          | boolean | Enable Sentry error tracking               |
| `VITE_STRIPE_PUBLISHABLE_KEY` | string  | Stripe publishable key (safe for frontend) |
| `VITE_GOOGLE_ANALYTICS_ID`    | string  | Google Analytics ID                        |
| `VITE_POSTHOG_KEY`            | string  | PostHog analytics key                      |
| `VITE_POSTHOG_HOST`           | URL     | PostHog host URL                           |
| `VITE_SENTRY_DSN`             | URL     | Sentry DSN for frontend                    |

### Cloudflare Bindings

These are automatically injected by Cloudflare Workers runtime and configured in `wrangler.toml`:

- `DB` - D1 Database binding
- `MEDIA_BUCKET` - R2 Bucket for media storage
- `CACHE` - KV Namespace for caching
- `ANALYTICS` - Analytics Engine binding
- `AI` - AI binding (Cloudflare AI)

## Helper Functions

### Environment Checks

```typescript
import { isProduction, isDevelopment, isStaging } from "@printy-mobile/config";

if (isProduction()) {
  // Production-specific logic
}

if (isDevelopment()) {
  console.log("Running in development mode");
}
```

### Environment-Specific Config

```typescript
import { getEnvSpecific } from "@printy-mobile/config";

const apiUrl = getEnvSpecific({
  development: "http://localhost:7800",
  staging: "https://api-staging.example.com",
  production: "https://api.example.com",
});
```

### Missing Variables Check

```typescript
import { getMissingEnvVars } from "@printy-mobile/config";

const required = ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL"];
const missing = getMissingEnvVars(process.env, required);

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}
```

## Setting Up Environment Variables

### Development

Create a `.dev.vars` file in your app directory (e.g., `apps/api/.dev.vars`):

```bash
# .dev.vars (for Cloudflare Workers local development)
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:7800

# Optional OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

For Vite apps, create `.env` or `.env.local`:

```bash
# .env.local (for Vite apps)
VITE_API_URL=http://localhost:7800
VITE_APP_URL=http://localhost:5173
```

### Production

Set environment variables in:

**Cloudflare Workers:**

```bash
# Using Wrangler CLI
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put STRIPE_SECRET_KEY

# Or via Cloudflare Dashboard
# Workers & Pages → Your Worker → Settings → Variables
```

**Cloudflare Pages (for webapp):**

```bash
# Via Cloudflare Dashboard
# Workers & Pages → Your Pages project → Settings → Environment variables
```

## Extending Configuration

### Adding New Variables

1. **Add to schema** in `packages/config/src/index.ts`:

```typescript
export const apiEnvSchema = baseEnvSchema.extend({
  // ... existing fields

  // Add your new field
  NEW_API_KEY: z.string().optional(),
  NEW_REQUIRED_FIELD: z.string().min(1, "NEW_REQUIRED_FIELD is required"),
});
```

2. **TypeScript will automatically infer** the new types in `ApiConfig` type.

3. **Use in your app**:

```typescript
const config = parseApiEnv(env);
console.log(config.NEW_API_KEY); // TypeScript knows this exists!
```

### Creating Custom Schemas

For specialized apps or services:

```typescript
import { baseEnvSchema } from "@printy-mobile/config";
import { z } from "zod";

const myServiceEnvSchema = baseEnvSchema.extend({
  MY_SERVICE_API_KEY: z.string(),
  MY_SERVICE_TIMEOUT: z.coerce.number().default(5000),
});

export type MyServiceConfig = z.infer<typeof myServiceEnvSchema>;

export const parseMyServiceEnv = (env: Record<string, unknown>) => {
  return myServiceEnvSchema.parse(env);
};
```

## Best Practices

### 1. Validate Early

Validate environment at application startup, not at runtime:

```typescript
// ✅ Good - fails fast at startup
export default {
  async fetch(request: Request, env: any) {
    const config = parseApiEnv(env); // Throws if invalid
    // ... rest of app
  },
};

// ❌ Bad - validates on every request
export default {
  async fetch(request: Request, env: any) {
    app.get("/endpoint", (c) => {
      const config = parseApiEnv(c.env); // Slow and redundant
    });
  },
};
```

### 2. Use Type Exports

Export and reuse types for consistency:

```typescript
import type { ApiConfig } from "@printy-mobile/config";

function doSomething(config: ApiConfig) {
  // TypeScript enforces correct config shape
}
```

### 3. Don't Expose Secrets in Frontend

Never use sensitive values in `VITE_*` variables:

```bash
# ❌ BAD - secrets in frontend
VITE_STRIPE_SECRET_KEY=sk_live_xxx

# ✅ GOOD - only public keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### 4. Provide Defaults

Use `.default()` for non-critical variables:

```typescript
API_PORT: z.coerce.number().default(7800),
NODE_ENV: z.enum(['development', 'production']).default('development'),
```

### 5. Document Required Variables

Keep this README updated when adding new required variables.

## Troubleshooting

### "Environment validation failed"

Read the error message carefully. It shows exactly which variables are missing or invalid:

```
❌ API Environment validation failed:
  - BETTER_AUTH_SECRET: String must contain at least 32 character(s)
  - BETTER_AUTH_URL: Invalid url
```

### Variables Not Loading

**Cloudflare Workers:**

- Check `.dev.vars` file exists and has correct variables
- Restart `wrangler dev` after changing `.dev.vars`
- For secrets, use `wrangler secret put` in production

**Vite Apps:**

- Env variables must start with `VITE_`
- Restart dev server after changing `.env` files
- Check `.env.local` is not in `.gitignore`

### TypeScript Errors

If TypeScript doesn't recognize new config properties:

1. Ensure you've added the field to the schema
2. Restart TypeScript server (VS Code: Cmd+Shift+P → "Restart TS Server")
3. Check `ApiConfig` or `WebappConfig` types are exported

## Migration Guide

### From Manual Env Vars to @printy-mobile/config

**Before:**

```typescript
const apiKey = process.env.API_KEY; // string | undefined
const port = Number(process.env.PORT || 3000); // manual parsing
```

**After:**

```typescript
import { parseApiEnv } from "@printy-mobile/config";

const config = parseApiEnv(env);
const apiKey = config.API_KEY; // validated and typed
const port = config.API_PORT; // already a number with default
```

## Related Packages

- `@printy-mobile/common` - Shared utilities and validation schemas
- `@printy-mobile/db` - Database schemas and utilities
- `@printy-mobile/auth` - Authentication configuration

## License

Part of SmashStack template - use freely in your projects.
