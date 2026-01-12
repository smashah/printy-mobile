# Cursor Commands Documentation

## Overview

This directory contains **reusable, project-agnostic** documentation for full-stack development with React, TanStack Router, Drizzle ORM, and Hono API.

## Core Files

### 🌟 GENERIC_BACKEND_FIRST.md

**Primary Reference Document** - Complete generic template for backend-first implementation.

Use this as your main reference. It contains:

- Generic database schema patterns
- DTO validation patterns
- API route patterns
- TanStack Router integration
- Frontend implementation with proper data fetching
- Testing workflows

**Adaptation Required**: Replace placeholders with your project specifics:

- `@your-project/db` → Your database package
- `@your-project/ui` → Your UI package
- `resources` → Your domain entities
- Field names → Your schema fields

### 📝 buildmockup.md

**Quick Reference** - Streamlined guide for building from mockups.

Follows 6-phase workflow:

1. Analyze Requirements
2. Database Schema
3. Validation DTOs
4. API Routes
5. Testing & Verification
6. Frontend Implementation

References GENERIC_BACKEND_FIRST.md for detailed patterns.

### 📘 tanstack_builder.md

**Comprehensive Guide** - Detailed implementation process.

Includes:

- Phase 0: Backend Verification (MANDATORY)
- Complete component architecture planning
- TanStack Router patterns
- Data management with React Query
- UI component standards

## Key Patterns Documented

### 1. Backend-First Workflow

```
Analyze → Schema → DTOs → API → Test → Frontend
```

Never skip backend. Never mock data.

### 2. TanStack Router Data Loading

```typescript
// Loader pattern (REQUIRED)
export const Route = createFileRoute("/path")({
  loader: async ({ context, params }) => {
    const queryOptions = context.backendClient.api.endpoint.$get.queryOptions({
      input: { param: params },
    });
    await context.queryClient.ensureQueryData(queryOptions);
    return { queryOptions };
  },
});

// Component usage
function Component() {
  const { queryOptions } = Route.useLoaderData();
  const { data } = useSuspenseQuery(queryOptions);
  // Use data
}
```

### 3. Type Safety

```typescript
// ✅ ALWAYS import types from backend
import type { ResourceSelect } from '@your-project/db/dtos';

// ❌ NEVER hand-write types
interface Resource { ... } // Wrong!
```

### 4. API Response Format

```typescript
// Standard format (use consistently)
{
  success: true,
  data: T | T[],
  message?: string,
  pagination?: {
    total: number,
    limit: number,
    offset: number,
    hasMore: boolean
  }
}
```

## Usage Instructions

### Starting a New Feature

1. **Read GENERIC_BACKEND_FIRST.md** first
2. Identify project-specific names to replace
3. Follow the 6-phase workflow in buildmockup.md
4. Use tanstack_builder.md for detailed guidance
5. Complete backend checklist before frontend
6. Test integration end-to-end

### Adapting for Your Project

Before using these docs, identify:

```typescript
// Your project configuration
const PROJECT_CONFIG = {
  dbPackage: "@your-project/db",
  uiPackage: "@your-project/ui",
  apiPath: "apps/api",
  webappPath: "apps/webapp",

  // Your domain entities
  entities: ["posts", "users", "products"],

  // Your enums
  statusTypes: ["draft", "published", "archived"],
  privacyLevels: ["public", "private", "friends"],
};
```

Replace all instances of:

- `@your-project/*` with your package names
- `resources` with your entity names
- Generic field names with your schema fields

## Backend Completion Checklist

**DO NOT proceed to frontend until:**

- [ ] ✅ Database schema exists for ALL entities
- [ ] ✅ Relations defined between entities
- [ ] ✅ Validation DTOs created with drizzle-zod
- [ ] ✅ API routes implement full CRUD
- [ ] ✅ Privacy/auth checks in place
- [ ] ✅ Error handling comprehensive
- [ ] ✅ Response formats consistent
- [ ] ✅ Migrations generated and applied
- [ ] ✅ API tested with curl/HTTPie
- [ ] ✅ Types exported from database package
- [ ] ✅ context.backendClient configured

## Testing Commands

```bash
# Generate migrations
pnpm --filter @your-project/api db:generate

# Apply migrations
pnpm --filter @your-project/api db:migrate

# Start dev server
pnpm --filter @your-project/api dev

# Test endpoints
curl http://localhost:8787/api/resources
curl -X POST http://localhost:8787/api/resources \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'

# Open database studio
pnpm --filter @your-project/api db:studio
```

## Common Mistakes to Avoid

### ❌ Frontend Before Backend

```typescript
// WRONG: Creating components without backend
function MyPage() {
  const [data, setData] = useState<any>([]); // No backend exists!
  return <div>{/* Empty shell */}</div>;
}
```

### ❌ Hand-Written Types

```typescript
// WRONG: Guessing at types
interface User {
  name: string; // Backend calls it "fullName"!
}
```

### ❌ Manual Fetch Calls

```typescript
// WRONG: Not using backendClient
const response = await fetch("/api/users");
const data = await response.json();
```

### ✅ Correct Pattern

```typescript
// RIGHT: Backend first, then frontend with types
import type { UserSelect } from '@your-project/db/dtos';

export const Route = createFileRoute('/users')({
  loader: async ({ context }) => {
    const queryOptions = context.backendClient.api.users.$get.queryOptions();
    await context.queryClient.ensureQueryData(queryOptions);
    return { queryOptions };
  },
});

function UsersPage() {
  const { queryOptions } = Route.useLoaderData();
  const { data } = useSuspenseQuery(queryOptions);
  return <UserList users={data.data} />;
}
```

## File Organization

```
.cursor/commands/
├── README_COMMANDS.md           # This file
├── GENERIC_BACKEND_FIRST.md     # Main reference (use this!)
├── buildmockup.md               # Quick workflow guide
├── tanstack_builder.md          # Detailed implementation guide
└── LESSONS_LEARNED.md           # What went wrong before
```

## Project-Specific Notes

**IMPORTANT**: These files are generic templates. The `hypermile.club` project may have additional project-specific documentation in the root `notes/` directory:

```
notes/
├── STACK.md                     # Project-specific stack
├── PRD.md                       # Product requirements
├── TODO.md                      # Current tasks
├── DEVLOG.md                    # Development log
└── TANSTACK_ROUTER_FILE_TREE.md # Route structure
```

Always read both:

1. `.cursor/commands/` - Generic patterns and workflows
2. `notes/` - Project-specific implementation details

## Support

If these templates don't match your project structure:

1. Identify the differences
2. Update the adaptation guide
3. Keep patterns consistent with project conventions
4. Document project-specific deviations

## Version

These templates are designed for:

- React 18/19+
- TanStack Router v1+
- TanStack Query v5+
- Drizzle ORM
- Hono API
- TypeScript 5+

Adapt as needed for your specific versions.

---

**Remember**: Backend first. No exceptions. Ever.
