# Database Query Helpers

Reusable utilities for common database query patterns in the SmashStack template.

## Overview

This package provides type-safe query helpers that work seamlessly with Drizzle ORM and D1 databases. These utilities eliminate boilerplate and ensure consistent patterns across your API endpoints.

## Installation

These utilities are exported from `@printy-mobile/db` and available throughout the monorepo:

```typescript
import {
  withPagination,
  withPagePagination,
  findOneOrThrow,
  findManyWithCount,
  softDelete,
  withOrderBy,
  getPaginationMeta,
} from "@printy-mobile/db";
```

## Query Helpers

### `withPagination(limit?, offset?)`

Converts string parameters to safe integers for database queries.

**Parameters:**
- `limit` (string | number, optional) - Number of records to return (default: 20)
- `offset` (string | number, optional) - Number of records to skip (default: 0)

**Returns:** `{ limit: number, offset: number }`

**Example:**
```typescript
const { limit, offset } = withPagination(c.req.query("limit"), c.req.query("offset"));

const posts = await db
  .select()
  .from(schema.posts)
  .limit(limit)
  .offset(offset);
```

---

### `withPagePagination(page?, limit?)`

Page-based pagination with automatic offset calculation.

**Parameters:**
- `page` (string | number, optional) - Page number (default: 1)
- `limit` (string | number, optional) - Records per page (default: 20)

**Returns:** `{ limit: number, offset: number, page: number }`

**Example:**
```typescript
const pagination = withPagePagination(c.req.query("page"), c.req.query("limit"));

const posts = await db
  .select()
  .from(schema.posts)
  .limit(pagination.limit)
  .offset(pagination.offset);
```

---

### `findOneOrThrow(query, errorMsg?)`

Finds a single record or throws a 404 error if not found.

**Parameters:**
- `query` (Promise<T[]>) - Drizzle query that returns an array
- `errorMsg` (string, optional) - Custom error message (default: "Resource not found")

**Returns:** Promise<T> - The first record from the query

**Throws:** Error with `statusCode: 404` and `code: "NOT_FOUND"`

**Example:**
```typescript
const post = await findOneOrThrow(
  db.select()
    .from(schema.posts)
    .where(eq(schema.posts.id, postId)),
  "Post not found"
);
```

**Error Handling:**
```typescript
try {
  const post = await findOneOrThrow(query, "Post not found");
  return c.json({ success: true, data: post });
} catch (error) {
  if ((error as any).statusCode === 404) {
    return c.json({ success: false, error: error.message }, 404);
  }
  throw error;
}
```

---

### `findManyWithCount(query, countQuery)`

Executes data and count queries in parallel for efficient pagination.

**Parameters:**
- `query` (Promise<T[]>) - Query for data records
- `countQuery` (Promise<{ count: number }[]>) - Query for total count

**Returns:** Promise<{ data: T[], total: number }>

**Example:**
```typescript
const postsQuery = db
  .select()
  .from(schema.posts)
  .limit(20)
  .offset(0);

const countQuery = db
  .select({ count: count() })
  .from(schema.posts);

const { data, total } = await findManyWithCount(postsQuery, countQuery);

return c.json({
  posts: data,
  total,
  hasMore: total > 20
});
```

---

### `softDelete(db, table, id)`

Soft deletes a record by setting the `deletedAt` timestamp.

**Parameters:**
- `db` - Drizzle database instance
- `table` - Table with `id` and `deletedAt` columns
- `id` (string) - Record ID to soft delete

**Returns:** Promise<void>

**Requirements:** Table must have a `deletedAt` column (use `softDeleteField()` helper)

**Example:**
```typescript
// In your schema (add to tables that need soft delete):
import { softDeleteField } from "@printy-mobile/db";

export const posts = sqliteTable("posts", {
  id: uuidPrimaryKey(),
  title: text().notNull(),
  deletedAt: softDeleteField(), // Add this
  ...timestampFields,
});

// In your route:
await softDelete(db, schema.posts, postId);
```

---

### `withSoftDelete(table)`

Creates a filter condition to exclude soft-deleted records.

**Parameters:**
- `table` - Table with `deletedAt` column

**Returns:** SQL condition

**Example:**
```typescript
const activePosts = await db
  .select()
  .from(schema.posts)
  .where(withSoftDelete(schema.posts));
```

---

### `withOrderBy(orderBy?, allowedColumns, defaultColumn, defaultDirection)`

Safely builds ORDER BY clauses with column validation to prevent SQL injection.

**Parameters:**
- `orderBy` (string, optional) - Sort parameter in format "column:direction" (e.g., "createdAt:desc")
- `allowedColumns` (readonly string[]) - Whitelist of sortable columns
- `defaultColumn` (string) - Fallback column (default: first allowed column)
- `defaultDirection` ("asc" | "desc") - Fallback direction (default: "desc")

**Returns:** `{ column: string, direction: "asc" | "desc" }`

**Example:**
```typescript
const allowedColumns = ["createdAt", "title", "likesCount"] as const;
const { column, direction } = withOrderBy(
  c.req.query("orderBy"),
  allowedColumns,
  "createdAt",
  "desc"
);

const posts = await db
  .select()
  .from(schema.posts)
  .orderBy(direction === "desc" ? desc(schema.posts[column]) : schema.posts[column]);
```

---

### `getPaginationMeta(total, page, limit)`

Calculates pagination metadata for API responses.

**Parameters:**
- `total` (number) - Total number of records
- `page` (number) - Current page number
- `limit` (number) - Records per page

**Returns:** 
```typescript
{
  page: number;
  limit: number;
  total: number;
  pages: number;      // Total number of pages
  hasNext: boolean;   // Whether there's a next page
  hasPrev: boolean;   // Whether there's a previous page
}
```

**Example:**
```typescript
const pagination = withPagePagination(page, limit);
const { data, total } = await findManyWithCount(query, countQuery);

return c.json({
  success: true,
  data,
  pagination: getPaginationMeta(total, pagination.page, pagination.limit)
});

// Response:
// {
//   "success": true,
//   "data": [...],
//   "pagination": {
//     "page": 2,
//     "limit": 20,
//     "total": 150,
//     "pages": 8,
//     "hasNext": true,
//     "hasPrev": true
//   }
// }
```

## Complete Example

Here's a complete API endpoint using multiple query helpers:

```typescript
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc, count } from "drizzle-orm";
import * as schema from "@printy-mobile/db/schema";
import {
  withPagePagination,
  withOrderBy,
  findManyWithCount,
  findOneOrThrow,
  getPaginationMeta,
} from "@printy-mobile/db";

const app = new Hono();

// List posts with pagination, sorting, and filtering
app.get("/api/posts", async (c) => {
  const db = c.var.db;
  const { page, limit, orderBy, userId } = c.req.query();

  // Setup pagination
  const pagination = withPagePagination(page, limit);

  // Setup sorting
  const allowedColumns = ["createdAt", "title", "likesCount"] as const;
  const sort = withOrderBy(orderBy, allowedColumns);

  // Build queries
  let query = db.select().from(schema.posts);
  let countQuery = db.select({ count: count() }).from(schema.posts);

  // Add filters
  if (userId) {
    query = query.where(eq(schema.posts.userId, userId));
    countQuery = countQuery.where(eq(schema.posts.userId, userId));
  }

  // Add sorting and pagination
  query = query
    .orderBy(sort.direction === "desc" 
      ? desc(schema.posts[sort.column]) 
      : schema.posts[sort.column])
    .limit(pagination.limit)
    .offset(pagination.offset);

  // Execute
  const { data, total } = await findManyWithCount(query, countQuery);

  return c.json({
    success: true,
    data,
    pagination: getPaginationMeta(total, pagination.page, pagination.limit),
  });
});

// Get single post
app.get("/api/posts/:id", async (c) => {
  const db = c.var.db;
  const { id } = c.req.param();

  try {
    const post = await findOneOrThrow(
      db.select()
        .from(schema.posts)
        .where(eq(schema.posts.id, id)),
      "Post not found"
    );

    return c.json({ success: true, data: post });
  } catch (error) {
    if ((error as any).statusCode === 404) {
      return c.json({ success: false, error: error.message }, 404);
    }
    throw error;
  }
});

export default app;
```

## Soft Delete Pattern

To enable soft deletes on a table:

1. **Add the field to your schema:**
```typescript
import { softDeleteField } from "@printy-mobile/db";

export const posts = sqliteTable("posts", {
  id: uuidPrimaryKey(),
  title: text().notNull(),
  deletedAt: softDeleteField(), // Add this line
  ...timestampFields,
});
```

2. **Use the helpers in your queries:**
```typescript
// Exclude deleted records
const activePosts = await db
  .select()
  .from(schema.posts)
  .where(withSoftDelete(schema.posts));

// Soft delete a record
await softDelete(db, schema.posts, postId);

// Include deleted records (just query normally)
const allPosts = await db.select().from(schema.posts);
```

## Best Practices

1. **Always validate user input** - These helpers sanitize numeric inputs but don't validate business logic
2. **Use allowlists for sorting** - `withOrderBy` prevents SQL injection but requires explicit column allowlists
3. **Combine with API response standards** - Pair these with the response helpers from improvement #2
4. **Type safety first** - All helpers preserve TypeScript types from Drizzle
5. **Error handling** - `findOneOrThrow` errors include `statusCode` and `code` for consistent error responses

## Future Improvements

When implementing improvement #1 (Error handling & logging), replace the Error in `findOneOrThrow` with `AppError`:

```typescript
// Current (temporary):
const error = new Error(errorMsg);
(error as any).statusCode = 404;
(error as any).code = "NOT_FOUND";
throw error;

// Future (with @printy-mobile/logger):
import { AppError } from "@printy-mobile/logger";
throw new AppError(errorMsg, "NOT_FOUND", 404);
```

## Related Documentation

- See `queries.example.ts` for more usage examples
- Improvement #2: API Response Standards (pairs well with these helpers)
- Improvement #1: Error Handling & Logging (future enhancement)

## Support

For issues or questions about query helpers, refer to:
- `packages/db/src/utils/queries.ts` - Source code
- `packages/db/src/utils/queries.example.ts` - Usage examples
- `ai_notes/suggested-improvements.md` - Original specification

