---
description: Critical rules that prevent common mistakes - Memorize these
---

> 📚 **[Documentation Index](../../DOCS_INDEX.md)** | 🚀 **[Quick Start](./quick-start.md)** | 📖 **[API Patterns](../../apps/api/API-PATTERNS.md)**

# Critical Rules: API Development

**Read this once. Remember forever. These patterns prevent 90% of bugs.**

## 🔥 The 6 Non-Negotiable Rules

### 1. ✅ ALWAYS Use `APIBindings`

```typescript
import type { APIBindings } from "../middleware/type";

// ✅ CORRECT
export const postsRoutes = new Hono<APIBindings>();

// ❌ WRONG
type Env = { DB: D1Database };
export const postsRoutes = new Hono<{ Bindings: Env }>();
```

**Why:** `APIBindings` provides access to ALL middleware variables (`c.var.db`, `c.var.user`, `c.var.session`, etc.)

---

### 2. ✅ ALWAYS Use `c.var.db` (Never Recreate Client)

```typescript
// ✅ CORRECT
postsRoutes.post("/", async (c) => {
  const db = c.var.db;  // From dbProvider middleware
  await db.insert(schema.posts).values(data);
});

// ❌ WRONG
postsRoutes.post("/", async (c) => {
  const db = drizzle(c.env.DB, { schema });  // Wasteful!
  await db.insert(schema.posts).values(data);
});
```

**Why:** Middleware provides a singleton DB client with schema and relations pre-configured.

---

### 3. ✅ ALWAYS Use `c.var.user` for Auth

```typescript
// ✅ CORRECT
postsRoutes.post("/", async (c) => {
  const user = c.var.user;  // From authMiddleware

  if (!user) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  // Use user.id
});

// ❌ WRONG
postsRoutes.post("/", async (c) => {
  const userId = c.req.header("user-id");  // Insecure!
});
```

**Why:** Auth middleware validates tokens and provides verified user object.

---

### 4. ✅ Use `zValidator` (Correct Name!)

```typescript
import { zValidator } from "@hono/zod-validator";  // ✅ CORRECT

// ✅ CORRECT
postsRoutes.post("/", zValidator("json", ZPostInsert), async (c) => {
  const data = c.req.valid("json");  // Typed and validated!
});

// ❌ WRONG
import { zodValidator } from "@hono/zod-validator";  // Doesn't exist!
```

**Why:** It's `zValidator`, not `zodValidator`. This trips up AI assistants constantly.

---

### 5. ✅ Import from Main Package Exports

```typescript
// ✅ CORRECT
import * as schema from "@printy-mobile/db/schema";
import { ZPostInsert, type PostSelect } from "@printy-mobile/db/dtos/validation";

// ❌ WRONG
import * as schema from "@printy-mobile/db/schema/index";
import * as schema from "@printy-mobile/db/src/schema/posts";
```

**Why:** Use the package's main exports. Don't reach into internal file structure.

---

### 6. ✅ Place Routes Directly in `src/routes/`

```
apps/api/src/routes/
├── posts.routes.ts      ✅ CORRECT
├── users.routes.ts      ✅ CORRECT
└── comments.routes.ts   ✅ CORRECT

apps/api/src/routes/
└── myproject/           ❌ WRONG (no subfolders!)
    └── posts.routes.ts
```

**Why:** Flat structure is simpler and prevents unnecessary nesting.

---

## 🎯 Available Context Variables

When using `APIBindings`, you have access to:

```typescript
c.var.db            // Drizzle DB client (with schema & relations)
c.var.user          // Authenticated user (or null)
c.var.session       // User session (or null)
c.var.auth          // Better-auth instance
c.var.setupTasks    // Trigger.dev jobs (if using)

c.env.DB            // Raw D1 database
c.env.MEDIA_BUCKET  // R2 bucket for uploads
// ... all environment variables
```

---

## 📋 Standard Response Format

**Always use this format:**

```typescript
// Success (single item)
return c.json({
  success: true,
  data: post,
  message: "Post created"  // Optional
}, 201);

// Success (list with pagination)
return c.json({
  success: true,
  data: posts,
  pagination: {
    total: 100,
    limit: 20,
    offset: 0,
    hasMore: true
  }
});

// Error (use HTTPException)
throw new HTTPException(404, { message: "Post not found" });
throw new HTTPException(401, { message: "Authentication required" });
throw new HTTPException(403, { message: "Not authorized" });
throw new HTTPException(500, { message: "Failed to create post" });
```

---

## 🛡️ Common Patterns

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
const post = await db.query.posts.findFirst({
  where: eq(schema.posts.id, postId),
});

if (!post) {
  throw new HTTPException(404, { message: "Post not found" });
}

if (post.userId !== user.id) {
  throw new HTTPException(403, { message: "Not authorized" });
}
// Continue with owned resource
```

### Privacy Filtering
```typescript
const conditions = [];

if (!currentUser) {
  // Anonymous: only public
  conditions.push(eq(schema.posts.privacy, "public"));
} else if (query.userId === currentUser.id) {
  // Owner: all their posts
  conditions.push(eq(schema.posts.userId, currentUser.id));
} else {
  // Others: only public
  conditions.push(eq(schema.posts.privacy, "public"));
}

const posts = await db.query.posts.findMany({
  where: conditions.length > 0 ? and(...conditions) : undefined,
});
```

### Error Handling
```typescript
try {
  // ... operation
  return c.json({ success: true, data: result });
} catch (error) {
  if (error instanceof HTTPException) throw error;
  console.error("Error creating post:", error);
  throw new HTTPException(500, { message: "Failed to create post" });
}
```

---

## 📚 Quick Reference

| Pattern | ✅ Correct | ❌ Wrong |
|---------|-----------|----------|
| Type | `new Hono<APIBindings>()` | `new Hono<{ Bindings: Env }>()` |
| DB Access | `c.var.db` | `drizzle(c.env.DB, ...)` |
| Auth | `c.var.user` | `c.req.header("user-id")` |
| Validator | `zValidator` | `zodValidator` |
| Imports | `@printy-mobile/db/schema` | `.../db/schema/index` |
| Location | `src/routes/posts.routes.ts` | `src/routes/myproject/posts.routes.ts` |

---

**These 6 rules + patterns prevent 90% of implementation errors. Memorize them.** 🎯
