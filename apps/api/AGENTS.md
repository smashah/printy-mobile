# API (Hono on Cloudflare Workers)

## OVERVIEW

Type-safe Hono API with D1 database, Better Auth, and Trigger.dev jobs. Deployed to Cloudflare Workers.

## STRUCTURE

```
src/
├── app.ts              # Main app, route composition, CORS
├── index.ts            # Worker entry point
├── client.ts           # RPC type export for frontend
├── middleware/
│   ├── type.ts         # APIBindings definition ⭐
│   ├── auth.ts         # authMiddleware (user/session)
│   ├── dbProvider.ts   # dbProvider (Drizzle client)
│   ├── jobs.ts         # jobsMiddleware (Trigger.dev)
│   └── validator.ts    # Zod validator wrapper
└── routes/
    ├── uploads.ts      # File upload handling
    └── [feature].ts    # Feature routes (flat, no subfolders)
```

## CRITICAL PATTERNS

### Route Creation (MUST FOLLOW)

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"; // Note: zValidator
import type { APIBindings } from "../middleware/type";
import * as schema from "@printy-mobile/db/schema";

export const resourcesRoutes = new Hono<APIBindings>(); // ALWAYS APIBindings

resourcesRoutes.post("/", zValidator("json", ZResourceInsert), async (c) => {
  const db = c.var.db; // ✅ From middleware
  const user = c.var.user; // ✅ From authMiddleware
  const data = c.req.valid("json");

  // Use db directly - already configured with schema
  const [resource] = await db.insert(schema.resources).values(data).returning();
  return c.json({ success: true, data: resource }, 201);
});
```

### Available Context Variables

```typescript
c.var.db; // Drizzle D1 client (singleton)
c.var.user; // Authenticated user | null
c.var.session; // User session | null
c.var.auth; // Better-auth instance
c.var.setupTasks; // Trigger.dev jobs
c.env.MEDIA_BUCKET; // R2 bucket for uploads
```

### Response Format

```typescript
// Success
return c.json({ success: true, data: resource, message?: "..." }, 201);

// List with pagination
return c.json({ success: true, data: items, pagination: { total, limit, offset, hasMore } });

// Errors - use HTTPException
throw new HTTPException(401, { message: "Authentication required" });
throw new HTTPException(404, { message: "Not found" });
```

## ANTI-PATTERNS

- ❌ `new Hono<{ Bindings: Env }>()` - bypasses middleware types
- ❌ `drizzle(c.env.DB, ...)` - recreates client per request
- ❌ `zodValidator` - wrong name, use `zValidator`
- ❌ `src/routes/myproject/` - no project subfolders
- ❌ `@printy-mobile/db/schema/index` - use `@printy-mobile/db/schema`

## COMMANDS

```bash
pnpm dev              # Local dev with Wrangler
pnpm test             # Vitest with Workers pool
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Apply migrations locally
pnpm db:studio        # Open Drizzle Studio
pnpm deploy           # Deploy to Cloudflare
```

## SEE ALSO

- [API-PATTERNS.md](./API-PATTERNS.md) - Complete patterns reference
- [MUTATION-PATTERN.md](./MUTATION-PATTERN.md) - Frontend mutation integration
