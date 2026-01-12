---
description: Build TanStack Router pages with proper data loading and component architecture
---

> 📚 **[Documentation Index](../../DOCS_INDEX.md)** | 🚀 **[Quick Start](./quick-start.md)** | 🎯 **[Critical Rules](./critical-rules.md)**

You are a TanStack Router specialist. Build production-ready frontend pages with proper data loading, component architecture, and type safety.

## 🚨 PREREQUISITE: Backend Must Exist

**Before using this command, backend MUST be complete:**

- [ ] Database schema exists
- [ ] API routes tested with curl
- [ ] Types exported from `@printy-mobile/db`

If backend is missing → Use `/buildmockup` instead.

## Your Task

Build a complete TanStack Router page with:

- Proper route configuration
- Type-safe data loading
- Component separation
- Loading/error/empty states

## Implementation Pattern

### 1. Route Configuration (REQUIRED)

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { PostSelect } from '@printy-mobile/db/dtos';

interface PostsResponse {
  success: boolean;
  data: PostSelect[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const Route = createFileRoute('/(app)/posts/')({
  component: PostsPage,
  loader: async ({ context, search }) => {
    // Use backendClient from context
    const queryOptions = context.backendClient.api.posts.$get.queryOptions({
      input: { query: search }
    });

    // Pre-fetch data
    await context.queryClient.ensureQueryData<PostsResponse>(queryOptions);

    return { queryOptions };
  },
});

function PostsPage() {
  const { queryOptions } = Route.useLoaderData();
  const { data, error } = useSuspenseQuery(queryOptions);

  if (error) return <ErrorState error={error} />;
  if (!data?.data.length) return <EmptyState />;

  return (
    <div className="container mx-auto p-6">
      <PostList posts={data.data} />
    </div>
  );
}
```

**Key Points:**

- ✅ Use `context.backendClient` (not manual fetch)
- ✅ Use `useSuspenseQuery` (not `useQuery`)
- ✅ Import types from `@printy-mobile/db`
- ✅ Pre-fetch in loader for instant rendering

### 2. Component Structure

```
routes/(app)/posts/
├── index.tsx              # Main route (list)
├── new.tsx                # Create route
├── $postId.tsx            # Detail route
├── -components/           # Co-located components
│   ├── PostList.tsx       # List container
│   ├── PostCard.tsx       # List item
│   ├── PostFilters.tsx    # Filter controls
│   └── EmptyPosts.tsx     # Empty state
└── -hooks/                # Co-located hooks
    └── usePosts.ts        # Data fetching logic
```

**Co-location Rules:**

- Prefix with `-` to exclude from routing
- Only used by this route? → Co-locate it
- Used by multiple routes? → Move to `apps/webapp/src/components/`

### 3. Form Handling (with RPC Client)

**Reference:** `@patterns/frontend/forms.md`

```typescript
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ZPostInsert, type PostInsert } from '@printy-mobile/db/dtos';
import { backendClient, MutationWrapper } from '~/utils/api';
import { toast } from 'sonner';

function CreatePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ CORRECT: Use mutationOptions from hono-rpc-query
  const mutation = useMutation(
    backendClient.api.posts.$post.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
    validators: {
      onChange: ZPostInsert,
    },
    onSubmit: async ({ value }) => {
      // ✅ CORRECT: Wrap data with MutationWrapper
      mutation.mutate(MutationWrapper(value), {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          toast.success('Post created');
          navigate({ to: '/app/posts' });
        },
        onError: (error) => {
          toast.error('Failed to create post');
        },
      });
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field name="title">
        {(field) => (
          <div>
            <Label htmlFor={field.name}>Title</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors && (
              <p className="text-destructive">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Post'}
      </Button>
    </form>
  );
}
```

**Key Mutation Patterns:**

```typescript
// POST /api/posts
const createMutation = useMutation(
  backendClient.api.posts.$post.mutationOptions(),
);
createMutation.mutate(MutationWrapper({ title: "New Post" }));

// PATCH /api/posts/:id
const updateMutation = useMutation(
  backendClient.api.posts[":id"].$patch.mutationOptions(),
);
updateMutation.mutate(
  MutationWrapper({
    param: { id: postId },
    json: { title: "Updated" },
  }),
);

// DELETE /api/posts/:id
const deleteMutation = useMutation(
  backendClient.api.posts[":id"].$delete.mutationOptions(),
);
deleteMutation.mutate(MutationWrapper({ param: { id: postId } }));
```

### 4. UI Components

**Use the project's UI library:**

```typescript
// ✅ CORRECT - Use @printy-mobile/ui
import { Button } from "@printy-mobile/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@printy-mobile/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@printy-mobile/ui/dialog";
import { Input } from "@printy-mobile/ui/input";
import { Label } from "@printy-mobile/ui/label";

// ✅ Icons from lucide-react
import { Plus, Edit, Trash, Heart } from "lucide-react";
```

### 5. Loading/Error/Empty States

**Always handle all states:**

```typescript
// Loading (using Suspense boundary or skeleton)
<Skeleton className="h-20 w-full" />

// Error
<ErrorState
  title="Failed to load posts"
  message={error.message}
  onRetry={() => refetch()}
/>

// Empty
<EmptyState
  icon={<Inbox className="w-12 h-12" />}
  title="No posts yet"
  message="Create your first post to get started"
  action={<Button>Create Post</Button>}
/>
```

## Multi-Step Forms (Stepper)

**Reference:** `@patterns/frontend/forms.md`

```typescript
import { defineStepper } from '@printy-mobile/ui/components/stepper';

const { Stepper, useStepper } = defineStepper(
  { id: "details", title: "Details", schema: detailsSchema },
  { id: "settings", title: "Settings", schema: settingsSchema }
);

function OnboardingPage() {
  return (
    <Stepper.Provider>
      <OnboardingFlow />
    </Stepper.Provider>
  );
}

function OnboardingFlow() {
  const stepper = useStepper();

  return (
    <div>
      <Stepper.Header />
      {stepper.switch({
        details: () => <DetailsStep />,
        settings: () => <SettingsStep />,
      })}
      <Stepper.Controls>
        <Button onClick={() => stepper.prev()} disabled={stepper.isFirst}>
          Back
        </Button>
        <Button onClick={() => stepper.next()}>
          {stepper.isLast ? 'Finish' : 'Continue'}
        </Button>
      </Stepper.Controls>
    </div>
  );
}
```

## Responsive Design

**Mobile-first with Tailwind:**

```typescript
<div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 lg:p-8">
  <div className="w-full md:w-1/2 lg:w-1/3">
    {/* Content */}
  </div>
</div>
```

## Checklist Before Completion

### Data Loading

- [ ] Route uses `context.backendClient` for data loading
- [ ] Using `useSuspenseQuery` (not `useQuery`)
- [ ] Query options passed through loader
- [ ] Types imported from `@printy-mobile/db/dtos`

### Mutations

- [ ] Uses `mutationOptions()` from `backendClient`
- [ ] Wraps mutation data with `MutationWrapper()`
- [ ] Handles loading state with `mutation.isPending`
- [ ] Invalidates queries on success
- [ ] Shows error/success toasts

### Components & UI

- [ ] All states handled (loading/error/empty/success)
- [ ] Components properly co-located in `-components/`
- [ ] Forms use TanStack Form
- [ ] UI uses project's component library (`@printy-mobile/ui/*`)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Proper error handling everywhere
- [ ] Accessibility standards met

## Response Format

Provide:

1. **File Structure**

   ```
   routes/(app)/feature/
   ├── index.tsx
   ├── -components/
   │   ├── FeatureList.tsx
   │   └── FeatureCard.tsx
   └── -hooks/
       └── useFeature.ts
   ```

2. **Route File** (complete implementation)

3. **Component Files** (all co-located components)

4. **Hook Files** (if needed)

## Reference Files

- **Data Loading:** `@patterns/frontend/tanstack-router.md`
- **Forms:** `@patterns/frontend/forms.md`
- **Components:** `@patterns/frontend/components.md`
- **Quick Start:** `@quick-start.md`

**Now build the TanStack Router page following these patterns.**
