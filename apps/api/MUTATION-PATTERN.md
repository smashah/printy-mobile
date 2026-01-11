# Frontend Mutation Pattern with hono-rpc-query

This document explains the **correct pattern** for performing mutations (POST/PATCH/DELETE) from the frontend using the backend RPC client.

## 🔥 The Pattern

### 1. Setup (Already Complete)

```typescript
// apps/webapp/src/utils/api.ts
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

### 2. Using Mutations in Components

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient, MutationWrapper } from "~/utils/api";
import type { ApiKeyInsert } from "@printy-mobile/db/dtos";
import { toast } from "sonner";

function CreateKeyModal() {
  const queryClient = useQueryClient();

  // ✅ CORRECT: Use mutationOptions() from hono-rpc-query
  const createMutation = useMutation(
    backendClient.api["api-keys"].$post.mutationOptions()
  );

  const handleSubmit = (data: ApiKeyInsert) => {
    // ✅ CORRECT: Wrap data with MutationWrapper
    createMutation.mutate(MutationWrapper(data), {
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["api-keys"] });
        toast.success("API key created");
      },
      onError: (error) => {
        toast.error("Failed to create API key");
      },
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Creating..." : "Create API Key"}
      </Button>
    </form>
  );
}
```

## 📋 All HTTP Methods

### POST (Create)

```typescript
const createMutation = useMutation(
  backendClient.api.resources.$post.mutationOptions()
);

createMutation.mutate(MutationWrapper({ 
  name: "New Resource",
  description: "Description here"
}));
```

### PATCH (Update)

```typescript
const updateMutation = useMutation(
  backendClient.api.resources[":id"].$patch.mutationOptions()
);

updateMutation.mutate(MutationWrapper({ 
  param: { id: resourceId },
  json: { name: "Updated Name" }
}));
```

### DELETE

```typescript
const deleteMutation = useMutation(
  backendClient.api.resources[":id"].$delete.mutationOptions()
);

deleteMutation.mutate(MutationWrapper({ 
  param: { id: resourceId }
}));
```

## ✅ Benefits

1. **Full Type Safety**: Backend types automatically flow to frontend via `AppType`
2. **Autocomplete**: IDE suggests all available endpoints
3. **No Manual URLs**: No string concatenation or manual URL building
4. **Automatic Error Handling**: Built into React Query
5. **Loading States**: Access via `mutation.isPending`
6. **Callbacks**: Easy `onSuccess` and `onError` handlers

## ❌ Common Mistakes

### ❌ WRONG: Manual fetch

```typescript
// ❌ Don't do this
const response = await fetch('/api/api-keys', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### ❌ WRONG: Custom mutationFn

```typescript
// ❌ Don't do this
const mutation = useMutation({
  mutationFn: async (data) => {
    return await backendClient.api["api-keys"].$post({ json: data });
  },
});
```

### ❌ WRONG: Forgetting MutationWrapper

```typescript
// ❌ Don't do this
createMutation.mutate({ name: "Test" }); // Missing MutationWrapper!
```

### ✅ CORRECT: Use the pattern

```typescript
// ✅ Do this
const mutation = useMutation(
  backendClient.api["api-keys"].$post.mutationOptions()
);

mutation.mutate(MutationWrapper({ name: "Test" }));
```

## 🔗 Related Documentation

- **API Patterns**: `apps/api/API-PATTERNS.md`
- **Frontend Rules**: `.cursor/rules/frontend.mdc`
- **TanStack Builder**: `.cursor/commands/tanstack_builder.md`
- **Build Mockup**: `.cursor/commands/buildmockup.md`

## Example: Complete Form with Validation

```typescript
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ZApiKeyInsert, type ApiKeyInsert } from '@printy-mobile/db/dtos';
import { backendClient, MutationWrapper } from '~/utils/api';
import { toast } from 'sonner';

function CreateApiKeyForm() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(
    backendClient.api["api-keys"].$post.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      name: '',
      permissions: ['read', 'write'],
    },
    validators: {
      onChange: ZApiKeyInsert,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(MutationWrapper(value), {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['api-keys'] });
          toast.success('API key created');
          form.reset();
        },
        onError: (error) => {
          toast.error('Failed to create API key');
        },
      });
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field name="name">
        {(field) => (
          <div>
            <Label htmlFor={field.name}>Name</Label>
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
        {mutation.isPending ? 'Creating...' : 'Create API Key'}
      </Button>
    </form>
  );
}
```

## Quick Reference

| What              | How                                                               |
| ----------------- | ----------------------------------------------------------------- |
| **Setup**         | Use `hcQuery` wrapper                                             |
| **Import**        | `import { backendClient, MutationWrapper } from "~/utils/api"`    |
| **Create Hook**   | `useMutation(backendClient.api.resource.$post.mutationOptions())` |
| **Call Mutation** | `mutation.mutate(MutationWrapper(data))`                          |
| **Loading State** | `mutation.isPending`                                              |
| **Success**       | Use `onSuccess` callback                                          |
| **Error**         | Use `onError` callback                                            |
| **Refresh Data**  | `queryClient.invalidateQueries()`                                 |

