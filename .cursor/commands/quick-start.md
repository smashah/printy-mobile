---
description: Quick start guide for building features - Read this FIRST
---

> 📚 **[Documentation Index](../../DOCS_INDEX.md)** | 🎯 **[Critical Rules](./critical-rules.md)** | 🤖 **[Use /buildmockup](./buildmockup.md)**

# Quick Start: Building a Feature

**Time to implement a complete feature: 2-4 hours**

## The Rule: Backend First, Always

**NEVER write frontend code before the backend exists and is tested.**

## The 5-Step Process

### 1. Analyze (10 min)

- Read mockup/requirements
- List what data entities you need (users, posts, comments, etc.)
- List what actions users can do (create, read, update, delete)

### 2. Database Schema (30 min)

```typescript
// packages/db/src/schema/posts.ts
export const posts = sqliteTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
```

👉 For detailed patterns: Read `backend-patterns/schema.md`

### 3. Create DTOs (15 min)

```typescript
// packages/db/src/dtos/validation.ts
import { createInsertSchema } from "drizzle-zod";

export const ZPostInsert = createInsertSchema(schema.posts, {
  title: z.string().min(1).max(200),
}).omit({ id: true, createdAt: true });
```

👉 For detailed patterns: Read `backend-patterns/dtos.md`

### 4. Create API Routes (45 min)

```typescript
// apps/api/src/routes/posts.routes.ts
import type { APIBindings } from "../middleware/type"; // ✅ CRITICAL

export const postsRoutes = new Hono<APIBindings>();

postsRoutes.post("/", zValidator("json", ZPostInsert), async (c) => {
  const db = c.var.db; // ✅ Use middleware DB
  const user = c.var.user; // ✅ From auth middleware
  // ... implementation
});
```

👉 For detailed patterns: Read `backend-patterns/api-routes.md`

### 5. Test Backend (15 min)

```bash
# Generate & run migrations
pnpm --filter @printy-mobile/api db:generate
pnpm --filter @printy-mobile/api db:migrate:local

# Test with curl
curl http://localhost:8787/api/posts
curl -X POST http://localhost:8787/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello"}'
```

### 6. Build Frontend (1-2 hours)

```typescript
// apps/webapp/src/routes/(app)/posts/index.tsx
import type { PostSelect } from '@printy-mobile/db/dtos';

export const Route = createFileRoute('/(app)/posts/')({
  loader: async ({ context }) => {
    const queryOptions = context.backendClient.api.posts.$get.queryOptions();
    await context.queryClient.ensureQueryData(queryOptions);
    return { queryOptions };
  },
  component: PostsPage,
});

function PostsPage() {
  const { queryOptions } = Route.useLoaderData();
  const { data } = useSuspenseQuery(queryOptions);
  return <PostList posts={data.data} />;
}
```

👉 For detailed patterns: Read `frontend-patterns/tanstack-router.md`

---

## Critical Rules (Read Once, Remember Forever)

### ✅ ALWAYS Do This:

```typescript
// 1. Use APIBindings
export const routes = new Hono<APIBindings>();

// 2. Use middleware DB
const db = c.var.db;

// 3. Import from @printy-mobile
import * as schema from "@printy-mobile/db/schema";
import { ZPostInsert } from "@printy-mobile/db/dtos/validation";

// 4. Use correct validator name
import { zValidator } from "@hono/zod-validator"; // NOT zodValidator!
```

### ❌ NEVER Do This:

```typescript
// 1. Custom Env type
export const routes = new Hono<{ Bindings: { DB: D1Database } }>();

// 2. Recreate DB client
const db = drizzle(c.env.DB, { schema });

// 3. Hand-write types
interface Post {
  title: string;
} // Backend has different fields!

// 4. Wrong validator name
import { zodValidator } from "@hono/zod-validator"; // WRONG!
```

---

## Checklist Before Moving to Frontend

- [ ] ✅ Database tables exist
- [ ] ✅ Relations defined
- [ ] ✅ DTOs created
- [ ] ✅ API routes work (tested with curl)
- [ ] ✅ Migrations applied
- [ ] ✅ Types exported from database package

**If ANY box is unchecked, DO NOT write frontend code.**

---

## Need More Detail?

This quick start covers the essentials. For deeper patterns:

**Backend:**

- `backend-patterns/schema.md` - Database schema patterns
- `backend-patterns/dtos.md` - Validation schemas
- `backend-patterns/api-routes.md` - Complete CRUD examples
- `backend-patterns/testing.md` - Testing strategies

**Frontend:**

- `frontend-patterns/tanstack-router.md` - Routing & data loading
- `frontend-patterns/data-fetching.md` - React Query patterns
- `frontend-patterns/forms.md` - Form handling with TanStack Form
- `frontend-patterns/components.md` - UI component patterns

**Critical Reference:**

- `critical-rules.md` - All the must-know patterns in one place

---

**Remember:** Backend first. No exceptions. Ever. 🛡️
