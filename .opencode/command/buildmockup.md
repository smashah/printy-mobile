---
description: Build a complete feature from mockup with backend-first workflow
---

> 📚 **[Documentation Index](../../DOCS_INDEX.md)** | 🚀 **[Quick Start](./quick-start.md)** | 🎯 **[Critical Rules](./critical-rules.md)**

You are an expert full-stack developer. Build complete features from mockups following strict backend-first workflow.

## 🚨 CARDINAL RULE: Backend First, Always

**NEVER write frontend code before the backend exists and is tested.**

## Your Task

The user will provide:

1. A mockup (HTML file, image, or description)
2. A target route path (e.g., `apps/webapp/src/routes/(app)/posts/index.tsx`)

## Process (Follow Strictly)

### Phase 1: Analyze (5 min)

Read mockup and identify:

- What entities? (posts, users, comments, etc.)
- What relationships? (post belongs to user, etc.)
- What actions? (create, read, update, delete, like, etc.)
- What filtering? (by date, by user, by status, etc.)

### Phase 2: Backend Implementation (60-90 min)

**Reference Files:**

- `@patterns/backend/schema.md` - Database schema patterns
- `@patterns/backend/dtos.md` - Validation patterns
- `@patterns/backend/api-routes.md` - API route patterns
- `@critical-rules.md` - MUST follow these 6 rules

**Steps:**

1. Create database schema in `packages/db/src/schema/[entity].ts`
2. Define relations in `packages/db/src/schema/relations/`
3. Create DTOs in `packages/db/src/dtos/validation.ts` using drizzle-zod
4. Create API routes in `apps/api/src/routes/[entity].routes.ts`

**Critical Patterns (From `@critical-rules.md`):**

```typescript
// ✅ ALWAYS use these
import type { APIBindings } from "../middleware/type";
export const postsRoutes = new Hono<APIBindings>();

postsRoutes.post("/", zValidator("json", ZPostInsert), async (c) => {
  const db = c.var.db; // ✅ From middleware
  const user = c.var.user; // ✅ From auth middleware
  // ... implementation
});
```

**❌ NEVER do these:**

- Custom Env types instead of `APIBindings`
- Recreate DB client instead of `c.var.db`
- Wrong validator name: `zodValidator` (correct: `zValidator`)

### Phase 3: Test Backend (15 min)

```bash
# Generate migrations
pnpm --filter @repo/api db:generate

# Apply migrations
pnpm --filter @repo/api db:migrate:local

# Test with curl
curl http://localhost:8787/api/posts
curl -X POST http://localhost:8787/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello"}'
```

**Checklist (ALL must pass before frontend):**

- [ ] Schema exists in database
- [ ] Relations defined
- [ ] DTOs created
- [ ] API routes respond correctly
- [ ] Migrations applied
- [ ] curl tests successful

### Phase 4: Frontend Implementation (45-60 min)

**Reference Files:**

- `@patterns/frontend/tanstack-router.md` - Router & data loading
- `@patterns/frontend/data-fetching.md` - React Query patterns
- `@patterns/frontend/forms.md` - Form handling

**TanStack Router Pattern (REQUIRED):**

```typescript
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PostSelect } from '@repo/db/dtos';
import { backendClient, MutationWrapper } from '~/utils/api';

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
  const queryClient = useQueryClient();

  // ✅ CORRECT: Mutation pattern
  const deleteMutation = useMutation(
    backendClient.api.posts[":id"].$delete.mutationOptions()
  );

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(MutationWrapper({ param: { id: postId } }), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        toast.success('Post deleted');
      },
    });
  };

  if (!data?.data.length) return <EmptyState />;
  return <PostList posts={data.data} onDelete={handleDelete} />;
}
```

**Component Structure:**

```
routes/(app)/posts/
├── index.tsx              # Main route
├── -components/           # Route-specific components
│   ├── PostList.tsx
│   ├── PostCard.tsx
│   └── PostFilters.tsx
└── -hooks/                # Route-specific hooks
    └── usePosts.ts
```

## Response Format

Provide implementation in this order:

1. **Analysis Summary**
   - Entities identified
   - Relationships
   - Actions needed

2. **Backend Code**
   - Schema files
   - DTO files
   - API route files

3. **Migration Command**

   ```bash
   pnpm --filter @repo/api db:generate
   ```

4. **Test Commands**

   ```bash
   curl commands to verify backend
   ```

5. **Frontend Code** (only after backend is done)
   - Route file
   - Component files
   - Hook files (if needed)

## Key Reminders

✅ **DO:**

- Use `APIBindings` for routes
- Use `c.var.db` for database
- Use `c.var.user` for auth
- Import from `@repo/db/schema`
- Use `zValidator` (correct name!)
- Test backend before writing frontend
- Use `mutationOptions()` for mutations
- Wrap mutation data with `MutationWrapper()`
- Use `useSuspenseQuery` for data loading
- Import types from `@repo/db/dtos`

❌ **DON'T:**

- Create frontend before backend works
- Use custom Env types
- Recreate DB client
- Use `zodValidator` (wrong name!)
- Skip testing phase
- Use manual `fetch()` for API calls
- Forget to wrap mutation data
- Use `useQuery` instead of `useSuspenseQuery`

## Need Help?

- Backend patterns → Read `@patterns/backend/*.md`
- Frontend patterns → Read `@patterns/frontend/*.md`
- Critical rules → Read `@critical-rules.md`
- Quick reference → Read `@quick-start.md`

**Now build the feature following this exact workflow.**
