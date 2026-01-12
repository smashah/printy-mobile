# Documentation Genericization Summary

## What Changed

I've updated all the Cursor command documentation to be **project-agnostic** and **reusable** across different projects.

## Key Changes

### 1. ✅ Created GENERIC_BACKEND_FIRST.md (NEW)

**Replaces**: The old BACKEND_FIRST_PRINCIPLE.md (deleted)

**Purpose**: Complete generic template for backend-first implementation

**Key Features**:

- Uses generic placeholders (`@printy-mobile/db`, `resources`, etc.)
- Includes TanStack Router loader pattern with `context.backendClient`
- Shows proper `useSuspenseQuery` usage
- Fully adaptable to any project

**Pattern Added** (from your example):

```typescript
export const Route = createFileRoute("/path")({
  loader: async ({ context, params }) => {
    const queryOptions = context.backendClient.api.users[
      ":username"
    ].$get.queryOptions({
      input: { param: { username: params.username } },
    });
    await context.queryClient.ensureQueryData(queryOptions);
    return { queryOptions };
  },
});

function Component() {
  const { queryOptions } = Route.useLoaderData();
  const { data } = useSuspenseQuery(queryOptions);
  // Use data
}
```

### 2. ✅ Updated buildmockup.md

**Changes**:

- Removed all `hypermile.club` specific references
- Changed `trips`, `vehicles` → `resources` (generic)
- Changed `@hypermile.club/*` → `@printy-mobile/*`
- Added TanStack Router loader pattern
- Added adaptation guide at the top
- Kept all patterns but made them generic

### 3. ✅ Updated tanstack_builder.md

**Changes**:

- References GENERIC_BACKEND_FIRST.md instead of old file
- Added adaptation requirements section
- Updated data management patterns with TanStack Router
- Replaced project-specific examples with generic ones
- Added `context.backendClient` pattern

### 4. ✅ Created README_COMMANDS.md (NEW)

**Purpose**: Guide for using the generic templates

**Includes**:

- Overview of all documentation files
- Adaptation instructions
- Key patterns quick reference
- Backend completion checklist
- Common mistakes to avoid
- Project-specific vs generic docs clarification

### 5. ✅ Updated LESSONS_LEARNED.md

**Changes**:

- Made generic where applicable
- Kept the learning points intact
- Updated examples to use generic placeholders

## Files Structure (After Changes)

```
.cursor/commands/
├── README_COMMANDS.md              # Guide to using these docs
├── GENERIC_BACKEND_FIRST.md        # Main reference (use this!)
├── buildmockup.md                  # Quick workflow guide (generic)
├── tanstack_builder.md             # Detailed guide (generic)
├── LESSONS_LEARNED.md              # What went wrong (generic)
└── GENERICIZATION_SUMMARY.md       # This file

Deleted:
├── ❌ BACKEND_FIRST_PRINCIPLE.md      # Replaced by GENERIC
└── ❌ DOCUMENTATION_UPDATE_SUMMARY.md # Replaced by README
```

## How to Use for Any Project

### Step 1: Identify Project Config

```typescript
const PRINTY_MOBILE = {
  dbPackage: "@printy-mobile/db",
  uiPackage: "@printy-mobile/ui",
  entities: ["posts", "products", "tasks"], // Not "trips", "vehicles"
  statusTypes: ["draft", "published"], // Your enums
  privacyLevels: ["public", "private"], // Your enums
};
```

### Step 2: Replace Placeholders

When reading the docs, mentally replace:

- `@printy-mobile/db` → `@acme/database`
- `@printy-mobile/ui` → `@acme/ui`
- `resources` → `posts` or `products` (your entity)
- Generic field names → Your actual schema fields

### Step 3: Follow the Workflow

1. Read `GENERIC_BACKEND_FIRST.md`
2. Use `buildmockup.md` for quick reference
3. Use `tanstack_builder.md` for detailed guidance
4. Complete backend checklist
5. Implement frontend with TanStack Router patterns

## TanStack Router Pattern (REQUIRED)

The documentation now enforces this pattern:

```typescript
// ✅ CORRECT: Use loader with backendClient
export const Route = createFileRoute('/(app)/resources/')({
  component: ResourcesPage,
  loader: async ({ context, params, search }) => {
    const queryOptions = context.backendClient.api.resources.$get.queryOptions({
      input: { query: search, param: params }
    });
    await context.queryClient.ensureQueryData(queryOptions);
    return { queryOptions };
  },
});

function ResourcesPage() {
  const { queryOptions } = Route.useLoaderData();
  const { data } = useSuspenseQuery(queryOptions);
  return <div>{data.data.map(...)}</div>;
}

// ❌ WRONG: Manual fetch calls
function ResourcesPage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/resources').then(r => r.json()).then(setData);
  }, []);
}
```

## What Stayed the Same

- ✅ Backend-first principle enforcement
- ✅ Phase-by-phase workflow
- ✅ Backend completion checklist
- ✅ All patterns and best practices
- ✅ Error handling approaches
- ✅ Privacy filtering patterns
- ✅ Response format standards

## What's Generic Now

- ✅ Package names (`@printy-mobile/*`)
- ✅ Entity names (`resources` instead of `trips`)
- ✅ Field names (generic examples)
- ✅ Enum values (adaptable)
- ✅ All code examples
- ✅ File paths (generic structure)

## Verification

To verify the docs are project-agnostic:

✅ No hardcoded `hypermile.club` references
✅ No hardcoded entity names (`trips`, `vehicles`)
✅ Uses placeholder package names
✅ Includes adaptation instructions
✅ Examples can apply to any domain
✅ Patterns work for any project structure

## Next Time You Build a Project

1. **Read**: Start with `README_COMMANDS.md`
2. **Adapt**: Identify your project specifics
3. **Follow**: Use `GENERIC_BACKEND_FIRST.md` as primary reference
4. **Reference**: Use `buildmockup.md` and `tanstack_builder.md` for workflows
5. **Check**: Complete backend checklist before frontend
6. **Pattern**: Use TanStack Router loader + useSuspenseQuery

## Summary

All documentation is now:

- ✅ **Generic** - Works for any project
- ✅ **Reusable** - Copy to other projects as-is
- ✅ **Complete** - Includes TanStack Router patterns
- ✅ **Enforcing** - Backend-first is mandatory
- ✅ **Type-safe** - Emphasizes importing backend types
- ✅ **Modern** - Uses latest patterns (loaders, suspense)

**These docs can now be used on ANY project with React + TanStack Router + Drizzle + Hono.**

Just replace the placeholders with your project specifics and follow the workflow!
