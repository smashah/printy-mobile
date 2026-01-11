# API Development Patterns - SmashStack Template

> 📚 **[Documentation Index](../../DOCS_INDEX.md)** | 🎯 **[Critical Rules](../../.cursor/commands/critical-rules.md)** | 🚀 **[Quick Start](../../.cursor/commands/quick-start.md)**

This document outlines the **required patterns** for all API route development in this project.

## 🔥 CRITICAL PATTERNS (MUST FOLLOW)

### 1. Route Type Bindings

**✅ ALWAYS Use `APIBindings`:**

```typescript
import type { APIBindings } from "../middleware/type";

// ✅ CORRECT: Provides full type safety for all middleware vars
export const resourcesRoutes = new Hono<APIBindings>();
```

**❌ NEVER Use Custom Env Types:**

```typescript
// ❌ WRONG: Bypasses middleware, loses type safety
type Env = {
  DB: D1Database;
};
export const resourcesRoutes = new Hono<{ Bindings: Env }>();
```

### 2. Database Access

**✅ ALWAYS Use Middleware DB Client:**

```typescript
resourcesRoutes.post("/", zValidator("json", ZResourceInsert), async (c) => {
  const db = c.var.db;  // ✅ CORRECT: From dbProvider middleware
  const user = c.var.user;  // ✅ CORRECT: From authMiddleware

  // Use db directly - already configured with schema and relations
  const [resource] = await db.insert(schema.resources).values(data).returning();
});
```

**❌ NEVER Recreate Drizzle Client:**

```typescript
// ❌ WRONG: Wasteful, recreates client on every request
const db = drizzle(c.env.DB, { schema: { ...schema, ...relations } });
```

**Why this matters:**
- Middleware provides a singleton DB client with schema and relations pre-configured
- Recreating the client is wasteful and error-prone
- Middleware pattern ensures consistency across all routes
- Access to all context vars: `c.var.db`, `c.var.user`, `c.var.session`, `c.var.auth`, etc.

### 3. Validation

**✅ CORRECT Import:**

```typescript
import { zValidator } from "@hono/zod-validator";  // ✅ Note: zValidator, not zodValidator
```

**✅ CORRECT Usage:**

```typescript
resourcesRoutes.post("/", zValidator("json", ZResourceInsert), async (c) => {
  const data = c.req.valid("json");  // Validated and typed
});

resourcesRoutes.get("/", zValidator("query", ZResourcesQuery), async (c) => {
  const query = c.req.valid("query");  // Validated and typed
});
```

### 4. Schema Imports

**✅ CORRECT Import:**

```typescript
import * as schema from "@printy-mobile/db/schema";
```

**❌ WRONG Imports:**

```typescript
// ❌ Don't import from internal paths
import * as schema from "@printy-mobile/db/schema/index";
import * as relations from "@printy-mobile/db/schema/relations";
```

### 5. Route File Organization

```
apps/api/src/routes/
├── index.ts              ✅ Combined router export
├── resources.routes.ts   ✅ Direct in routes/
├── users.routes.ts       ✅ Direct in routes/
└── uploads.ts            ✅ Direct in routes/
```

**❌ NEVER Create Project-Scoped Subfolders:**

```
apps/api/src/routes/
└── myproject/            ❌ WRONG: Unnecessary nesting
    ├── resources.routes.ts   ❌ WRONG
    └── users.routes.ts       ❌ WRONG
```

---

## Complete Route Template

Use this as a starting point for all new route files:

```typescript
/**
 * [Feature] Routes
 * [Description of what this route handles]
 *
 * Endpoints:
 * - POST   /resources              Create resource
 * - GET    /resources              List resources
 * - GET    /resources/:id          Get resource details
 * - PATCH  /resources/:id          Update resource
 * - DELETE /resources/:id          Delete resource
 */

import { eq, desc, and, count, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";

import * as schema from "@printy-mobile/db/schema";
import {
  ZResourceInsert,
  ZResourceUpdate,
  ZResourcesQuery,
} from "@printy-mobile/db/dtos/validation";
import type { APIBindings } from "../middleware/type";

export const resourcesRoutes = new Hono<APIBindings>();

/**
 * POST /resources
 * Create a new resource
 * REQUIRES AUTHENTICATION
 */
resourcesRoutes.post("/", zValidator("json", ZResourceInsert), async (c) => {
  const db = c.var.db;
  const user = c.var.user;

  if (!user) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  const data = c.req.valid("json");

  try {
    const [resource] = await db
      .insert(schema.resources)
      .values({
        ...data,
        userId: user.id,
      })
      .returning();

    return c.json(
      { success: true, data: resource, message: "Resource created" },
      201
    );
  } catch (error) {
    console.error("Error creating resource:", error);
    throw new HTTPException(500, { message: "Failed to create resource" });
  }
});

/**
 * GET /resources
 * List resources with filtering
 */
resourcesRoutes.get("/", zValidator("query", ZResourcesQuery), async (c) => {
  const db = c.var.db;
  const query = c.req.valid("query");
  const currentUser = c.var.user;

  try {
    const conditions = [];

    // Add filtering logic
    if (query.status) {
      conditions.push(eq(schema.resources.status, query.status));
    }

    const resources = await db.query.resources.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
      limit: query.limit,
      offset: query.offset,
      orderBy: desc(schema.resources.createdAt),
    });

    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.resources)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return c.json({
      success: true,
      data: resources,
      pagination: {
        total,
        limit: query.limit,
        offset: query.offset,
        hasMore: query.offset + query.limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    throw new HTTPException(500, { message: "Failed to fetch resources" });
  }
});

/**
 * GET /resources/:id
 * Get resource details
 */
resourcesRoutes.get("/:id", async (c) => {
  const db = c.var.db;
  const { id } = c.req.param();
  const currentUser = c.var.user;

  try {
    const resource = await db.query.resources.findFirst({
      where: eq(schema.resources.id, id),
      with: {
        user: true,
      },
    });

    if (!resource) {
      throw new HTTPException(404, { message: "Resource not found" });
    }

    // Privacy check if needed
    if (resource.privacy === "private" && (!currentUser || resource.userId !== currentUser.id)) {
      throw new HTTPException(403, { message: "Access denied" });
    }

    return c.json({ success: true, data: resource });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error("Error fetching resource:", error);
    throw new HTTPException(500, { message: "Failed to fetch resource" });
  }
});

/**
 * PATCH /resources/:id
 * Update resource
 * REQUIRES AUTHENTICATION & OWNERSHIP
 */
resourcesRoutes.patch(
  "/:id",
  zValidator("json", ZResourceUpdate),
  async (c) => {
    const db = c.var.db;
    const { id } = c.req.param();
    const user = c.var.user;

    if (!user) {
      throw new HTTPException(401, { message: "Authentication required" });
    }

    const data = c.req.valid("json");

    try {
      // Check ownership
      const existing = await db.query.resources.findFirst({
        where: eq(schema.resources.id, id),
      });

      if (!existing) {
        throw new HTTPException(404, { message: "Resource not found" });
      }

      if (existing.userId !== user.id) {
        throw new HTTPException(403, { message: "Not authorized" });
      }

      // Update
      const [updated] = await db
        .update(schema.resources)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.resources.id, id))
        .returning();

      return c.json({
        success: true,
        data: updated,
        message: "Resource updated",
      });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      console.error("Error updating resource:", error);
      throw new HTTPException(500, { message: "Failed to update resource" });
    }
  }
);

/**
 * DELETE /resources/:id
 * Delete resource
 * REQUIRES AUTHENTICATION & OWNERSHIP
 */
resourcesRoutes.delete("/:id", async (c) => {
  const db = c.var.db;
  const { id } = c.req.param();
  const user = c.var.user;

  if (!user) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  try {
    // Check ownership
    const existing = await db.query.resources.findFirst({
      where: eq(schema.resources.id, id),
    });

    if (!existing) {
      throw new HTTPException(404, { message: "Resource not found" });
    }

    if (existing.userId !== user.id) {
      throw new HTTPException(403, { message: "Not authorized" });
    }

    // Delete
    await db.delete(schema.resources).where(eq(schema.resources.id, id));

    return c.json({ success: true, message: "Resource deleted" });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error("Error deleting resource:", error);
    throw new HTTPException(500, { message: "Failed to delete resource" });
  }
});
```

---

## Checklist for New Routes

### Backend Checklist

Before considering a route file complete, verify:

- [ ] ✅ Uses `APIBindings` type (not custom Env)
- [ ] ✅ Uses `c.var.db` (not recreating Drizzle client)
- [ ] ✅ Uses `c.var.user` for auth checks
- [ ] ✅ Uses `zValidator` (correct name, not zodValidator)
- [ ] ✅ Imports from `@printy-mobile/db/schema` (not internal paths)
- [ ] ✅ File placed directly in `src/routes/` (no subfolders)
- [ ] ✅ Consistent response format: `{ success, data, message?, pagination? }`
- [ ] ✅ Proper error handling with `HTTPException`
- [ ] ✅ Auth checks before protected operations
- [ ] ✅ Ownership checks before updates/deletes
- [ ] ✅ Privacy filtering on GET endpoints
- [ ] ✅ Proper HTTP status codes (201, 404, 403, 500)

### Frontend Checklist

Before considering a frontend feature complete, verify:

- [ ] ✅ Uses `backendClient` from `~/utils/api` (not manual fetch)
- [ ] ✅ Uses `mutationOptions()` for mutations
- [ ] ✅ Wraps mutation data with `MutationWrapper()`
- [ ] ✅ Uses `useSuspenseQuery` for data loading (not `useQuery`)
- [ ] ✅ Imports types from `@printy-mobile/db/dtos`
- [ ] ✅ Handles loading states (`mutation.isPending`)
- [ ] ✅ Invalidates queries on success
- [ ] ✅ Shows error/success toasts
- [ ] ✅ Handles all states (loading/error/empty/success)
- [ ] ✅ Components properly co-located in `-components/` folder
- [ ] ✅ Uses project UI components (`@printy-mobile/ui/*`)
- [ ] ✅ Responsive design (mobile/tablet/desktop)

---

## Available Context Variables (from APIBindings)

When using `APIBindings`, you have access to:

```typescript
// From middleware/type.ts
type APIBindings = {
  Bindings: {
    DB: D1Database;
    MEDIA_BUCKET: R2Bucket;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    // ... all environment variables
  };
  Variables: {
    user: User | null;              // From authMiddleware
    session: Session | null;        // From authMiddleware
    db: DrizzleD1Database;          // From dbProvider
    auth: BetterAuth;               // From authMiddleware
    setupTasks: () => Tasks;        // From jobsMiddleware
    aws: AwsClient;                 // From dbProvider
    awsUrl: (path: string) => string;
    p3: PicoS3;                     // From dbProvider
  };
};
```

Access these via:

```typescript
const db = c.var.db;           // Database client
const user = c.var.user;       // Authenticated user (or null)
const session = c.var.session; // User session (or null)
const auth = c.var.auth;       // Better-auth instance
const bucket = c.env.MEDIA_BUCKET;  // R2 bucket for uploads
const setupTasks = c.var.setupTasks;  // Trigger.dev jobs
```

---

## Frontend Integration (RPC Client)

### Setup (apps/webapp/src/utils/api.ts)

```typescript
import type { AppType } from "@printy-mobile/api/client";
import { hc } from "hono/client";
import { hcQuery } from "hono-rpc-query";

export const backendClient = hcQuery(
  hc<AppType>(getApiHost(), {
    init: {
      credentials: "include", // Required for cookies
    },
  }),
);

// Helper to wrap mutation data
export const MutationWrapper = (data: any) => ({
  json: data,
});
```

### Query Pattern (GET requests)

```typescript
import { useSuspenseQuery } from "@tanstack/react-query";
import { backendClient } from "~/utils/api";

function ResourcesPage() {
  const { queryOptions } = Route.useLoaderData();
  const { data } = useSuspenseQuery(queryOptions);
  
  return <ResourceList resources={data.data} />;
}

// In route loader:
export const Route = createFileRoute('/(app)/resources/')({
  loader: async ({ context }) => {
    const queryOptions = context.backendClient.api.resources.$get.queryOptions({
      input: { query: { status: "active" } }
    });
    await context.queryClient.ensureQueryData(queryOptions);
    return { queryOptions };
  },
});
```

### Mutation Pattern (POST/PATCH/DELETE)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient, MutationWrapper } from "~/utils/api";
import type { ResourceInsert } from "@printy-mobile/db/dtos";

function CreateResourceForm() {
  const queryClient = useQueryClient();
  
  // ✅ CORRECT: Use mutationOptions() from hono-rpc-query
  const createMutation = useMutation(
    backendClient.api.resources.$post.mutationOptions()
  );
  
  const handleSubmit = (data: ResourceInsert) => {
    // ✅ CORRECT: Wrap data with MutationWrapper
    createMutation.mutate(MutationWrapper(data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["resources"] });
        toast.success("Resource created");
      },
      onError: (error) => {
        toast.error("Failed to create resource");
      },
    });
  };
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
```

### Update/Delete Pattern

```typescript
// PATCH /resources/:id
const updateMutation = useMutation(
  backendClient.api.resources[":id"].$patch.mutationOptions()
);

updateMutation.mutate(MutationWrapper({ 
  param: { id: resourceId },
  json: { name: "Updated Name" }
}));

// DELETE /resources/:id
const deleteMutation = useMutation(
  backendClient.api.resources[":id"].$delete.mutationOptions()
);

deleteMutation.mutate(MutationWrapper({ 
  param: { id: resourceId }
}));
```

**Key Points:**
- ✅ Use `mutationOptions()` from `hono-rpc-query`
- ✅ Wrap all mutation data with `MutationWrapper(data)`
- ✅ Use callbacks (`onSuccess`, `onError`) for side effects
- ✅ Invalidate queries on success to refresh data
- ✅ Handle loading state with `mutation.isPending`

---

## Response Format Standards

### Success Response (Single Item)

```typescript
return c.json({
  success: true,
  data: resource,
  message: "Resource created successfully",  // Optional
}, 201);  // Appropriate status code
```

### Success Response (List with Pagination)

```typescript
return c.json({
  success: true,
  data: resources,
  pagination: {
    total: 100,
    limit: 20,
    offset: 0,
    hasMore: true,
  },
});
```

### Error Response

```typescript
// Use HTTPException for consistent error handling
throw new HTTPException(404, { message: "Resource not found" });
throw new HTTPException(401, { message: "Authentication required" });
throw new HTTPException(403, { message: "Not authorized" });
throw new HTTPException(500, { message: "Failed to create resource" });
```

---

## Common Patterns

### Authentication Check

```typescript
const user = c.var.user;

if (!user) {
  throw new HTTPException(401, { message: "Authentication required" });
}

// Continue with authenticated user
```

### Ownership Check

```typescript
const existing = await db.query.resources.findFirst({
  where: eq(schema.resources.id, id),
});

if (!existing) {
  throw new HTTPException(404, { message: "Resource not found" });
}

if (existing.userId !== user.id) {
  throw new HTTPException(403, { message: "Not authorized" });
}

// Continue with owned resource
```

### Privacy Filtering

```typescript
const conditions = [];

if (!currentUser) {
  // Anonymous users: only public
  conditions.push(eq(schema.resources.privacy, "public"));
} else if (query.userId === currentUser.id) {
  // Own resources: all privacy levels
  conditions.push(eq(schema.resources.userId, currentUser.id));
} else {
  // Other users' resources: only public
  conditions.push(eq(schema.resources.privacy, "public"));
}
```

### Incrementing Counters

```typescript
// Use SQL expressions for safe increments
await db
  .update(schema.users)
  .set({
    resourceCount: sql`${schema.users.resourceCount} + 1`,
  })
  .where(eq(schema.users.id, user.id));
```

### Fetching with Relations

```typescript
const resource = await db.query.resources.findFirst({
  where: eq(schema.resources.id, resourceId),
  with: {
    user: {
      columns: {
        id: true,
        username: true,
        name: true,
        image: true,
      },
    },
    relatedItems: {
      orderBy: desc(schema.relatedItems.createdAt),
    },
  },
});
```

---

## Directory Structure

```
apps/api/src/
├── app.ts                     # Main app configuration
├── middleware/
│   ├── type.ts                # APIBindings definition ⭐
│   ├── auth.ts                # authMiddleware
│   ├── dbProvider.ts          # dbProvider (provides c.var.db)
│   └── jobs.ts                # jobsMiddleware
└── routes/
    ├── index.ts               # Combined router export
    ├── resources.routes.ts    # Resource CRUD
    ├── users.routes.ts        # User management
    └── uploads.ts             # File uploads
```

---

## Quick Reference

### Backend (API Routes)

| Pattern | ✅ CORRECT | ❌ WRONG |
|---------|-----------|----------|
| Type | `new Hono<APIBindings>()` | `new Hono<{ Bindings: Env }>()` |
| DB Access | `c.var.db` | `drizzle(c.env.DB, ...)` |
| Auth | `c.var.user` | `c.env.AUTH_USER` |
| Validator | `zValidator` | `zodValidator` |
| Schema | `@printy-mobile/db/schema` | `.../db/schema/index` |
| Location | `src/routes/resources.routes.ts` | `src/routes/myproject/resources.routes.ts` |

### Frontend (React Components)

| Pattern | ✅ CORRECT | ❌ WRONG |
|---------|-----------|----------|
| Queries | `backendClient.api.posts.$get.queryOptions()` | `fetch('/api/posts')` |
| Mutations | `useMutation(backendClient.api.posts.$post.mutationOptions())` | `useMutation({ mutationFn: ... })` |
| Data Wrapper | `MutationWrapper({ name: "Test" })` | `{ name: "Test" }` |
| Query Hook | `useSuspenseQuery(queryOptions)` | `useQuery(queryOptions)` |
| Types | `import type { PostSelect } from '@printy-mobile/db/dtos'` | Manual type definitions |
| Import | `import { backendClient, MutationWrapper } from '~/utils/api'` | Direct fetch calls |

---

## Documentation References

- **API Type Definitions**: `apps/api/src/middleware/type.ts`
- **Database Schema**: `packages/db/src/schema/`
- **Validation DTOs**: `packages/db/src/dtos/validation.ts`
- **API Rules**: `.cursor/rules/api.mdc`
- **Backend Rules**: `.cursor/rules/backend.mdc`

---

## Complete Backend-to-Frontend Workflow

### Step 1: Backend API Route

```typescript
// apps/api/src/routes/posts.routes.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { APIBindings } from "../middleware/type";
import * as schema from "@printy-mobile/db/schema";
import { ZPostInsert } from "@printy-mobile/db/dtos/validation";

export const postsRoutes = new Hono<APIBindings>();

postsRoutes.post("/", zValidator("json", ZPostInsert), async (c) => {
  const db = c.var.db;
  const user = c.var.user;
  const data = c.req.valid("json");
  
  const [post] = await db.insert(schema.posts).values({
    ...data,
    userId: user.id,
  }).returning();
  
  return c.json({ success: true, data: post }, 201);
});
```

### Step 2: Frontend RPC Setup (Already Done)

```typescript
// apps/webapp/src/utils/api.ts
import { hcQuery } from "hono-rpc-query";
import { hc } from "hono/client";
import type { AppType } from "@printy-mobile/api/client";

export const backendClient = hcQuery(
  hc<AppType>(getApiHost(), {
    init: { credentials: "include" }
  })
);

export const MutationWrapper = (data: any) => ({ json: data });
```

### Step 3: Frontend Component

```typescript
// apps/webapp/src/routes/(app)/posts/-components/CreatePostModal.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient, MutationWrapper } from "~/utils/api";
import type { PostInsert } from "@printy-mobile/db/dtos";

export function CreatePostModal() {
  const queryClient = useQueryClient();
  
  // Use mutationOptions from backend RPC client
  const createMutation = useMutation(
    backendClient.api.posts.$post.mutationOptions()
  );
  
  const handleSubmit = (data: PostInsert) => {
    // Wrap data with MutationWrapper
    createMutation.mutate(MutationWrapper(data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post created");
      },
    });
  };
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
      <Button disabled={createMutation.isPending}>
        {createMutation.isPending ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
}
```

### Why This Pattern?

**✅ Type Safety:**
- Backend types automatically flow to frontend via `AppType`
- No manual type definitions needed
- Compile-time errors if API changes

**✅ DX Benefits:**
- Autocomplete for all API endpoints
- No manual URL construction
- Automatic error handling
- Built-in loading states

**✅ Performance:**
- Middleware provides singleton DB client
- React Query handles caching
- Optimistic updates supported

---

## Remember

✅ **Use `APIBindings`** - Full type safety for middleware vars  
✅ **Use `c.var.db`** - No redundant client creation  
✅ **Use `zValidator`** - Correct validator name  
✅ **Direct in `routes/`** - No project subfolders  
✅ **Import from main exports** - Not internal paths  
✅ **Use `mutationOptions()`** - For all mutations  
✅ **Wrap with `MutationWrapper`** - Required for mutation data  
✅ **Use `useSuspenseQuery`** - For data loading  
✅ **Import types from `@printy-mobile/db/dtos`** - Shared types  

These patterns ensure consistency, performance, and type safety across the entire API.
