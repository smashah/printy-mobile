# Suggested Improvements for SmashStack Template

Generated: 2025-11-04

## Overview

These improvements focus on **reusability across personal projects** rather than open-source concerns. They target common patterns you'll need repeatedly, better error handling, and developer experience enhancements.

---

## Priority Order

If implementing incrementally, suggested order:

1. **Error handling & logging** - catches issues early
2. **API response standards** - consistency across projects
3. **Rate limiting** - security essential
4. **File upload helpers** - R2 is configured but unused
5. **Common validation schemas** - reuse across projects
6. **Test factories** - makes testing faster
7. **Background job templates** - patterns you'll reuse
8. **Database query helpers** - DRY up common patterns
9. Rest as needed

---

## 1. Error Handling & Observability

**Current issue:** Basic error handler at `apps/api/src/app.ts:101-118` just logs and returns generic messages.

### Add Structured Logging Package (`@printy-mobile/logger`)

Create a new package for consistent error handling across all apps.

**Location:** `packages/logger/src/index.ts`

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public meta?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const logger = {
  info: (msg: string, context?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      msg,
      ...context,
      timestamp: new Date().toISOString()
    }));
  },

  error: (msg: string, error: unknown, context?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      msg,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      ...context,
      timestamp: new Date().toISOString()
    }));
  },

  warn: (msg: string, context?: object) => {
    console.warn(JSON.stringify({
      level: 'warn',
      msg,
      ...context,
      timestamp: new Date().toISOString()
    }));
  }
};
```

### Integration Options

- **Sentry** for error tracking (add to middleware)
- **Axiom** for Cloudflare-native logs
- **Request ID middleware** to track requests across services

**Example middleware:**

```typescript
// apps/api/src/middleware/requestId.ts
import { createMiddleware } from 'hono/factory';

export const requestIdMiddleware = createMiddleware(async (c, next) => {
  const requestId = crypto.randomUUID();
  c.set('requestId', requestId);
  c.res.headers.set('X-Request-Id', requestId);
  await next();
});
```

---

## 2. API Response Standards

**Current issue:** Inconsistent response formats (some return arrays, some objects).

### Create Standardized Response Helpers

**Location:** `packages/common/src/api-response.ts`

```typescript
export const apiResponse = {
  success: <T>(data: T, meta?: object) => ({
    success: true,
    data,
    meta,
    timestamp: Date.now()
  }),

  error: (message: string, code: string, details?: unknown) => ({
    success: false,
    error: { message, code, details },
    timestamp: Date.now()
  }),

  paginated: <T>(data: T[], page: number, limit: number, total: number) => ({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    },
    timestamp: Date.now()
  }),

  created: <T>(data: T, location?: string) => ({
    success: true,
    data,
    timestamp: Date.now()
  })
};
```

**Usage example:**

```typescript
// In your routes
app.get("/posts", async (c) => {
  const posts = await db.select().from(schema.tPosts);
  const total = await db.select({ count: count() }).from(schema.tPosts);

  return c.json(apiResponse.paginated(posts, 1, 20, total[0].count));
});
```

---

## 3. Database Query Helpers

**Current issue:** Common patterns repeated across endpoints (pagination, soft deletes, etc.)

### Add Query Utilities

**Location:** `packages/db/src/utils/queries.ts`

```typescript
import { isNull } from 'drizzle-orm';

export const withPagination = (limit?: string, offset?: string) => ({
  limit: limit ? Number.parseInt(limit, 10) : 20,
  offset: offset ? Number.parseInt(offset, 10) : 0
});

export const withSoftDelete = <T extends { deletedAt: any }>(
  table: T
) => isNull(table.deletedAt);

// Common query patterns
export const findOneOrThrow = async <T>(
  query: Promise<T[]>,
  errorMsg = "Resource not found"
) => {
  const results = await query;
  if (results.length === 0) {
    throw new AppError(errorMsg, "NOT_FOUND", 404);
  }
  return results[0];
};

export const findManyWithCount = async <T>(
  query: Promise<T[]>,
  countQuery: Promise<{ count: number }[]>
) => {
  const [data, countResult] = await Promise.all([query, countQuery]);
  return {
    data,
    total: countResult[0].count
  };
};

// Soft delete helper
export const softDelete = (table: any, id: string) => {
  return db
    .update(table)
    .set({ deletedAt: new Date().toISOString() })
    .where(eq(table.id, id));
};
```

**Usage example:**

```typescript
app.get("/posts/:id", async (c) => {
  const { id } = c.req.param();

  const post = await findOneOrThrow(
    db.select().from(schema.tPosts).where(eq(schema.tPosts.id, id)),
    "Post not found"
  );

  return c.json(apiResponse.success(post));
});
```

---

## 4. Better Validation in `@printy-mobile/common`

**Current:** Validator is basic (`apps/api/src/middleware/validator.ts`)

### Enhanced Validation Utilities

**Location:** `packages/common/src/validation.ts`

```typescript
import { z } from 'zod';

// Sanitization helpers
export const sanitizers = {
  email: (email: string) => email.toLowerCase().trim(),
  slug: (str: string) => str.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
  phone: (phone: string) => phone.replace(/\D/g, ''),
  url: (url: string) => url.trim().replace(/\/$/, '')
};

// Common validation schemas
export const commonSchemas = {
  uuid: z.string().uuid(),

  email: z.string().email().transform(sanitizers.email),

  pagination: z.object({
    limit: z.coerce.number().min(1).max(100).default(20),
    offset: z.coerce.number().min(0).default(0),
    page: z.coerce.number().min(1).default(1)
  }),

  dateRange: z.object({
    from: z.coerce.date(),
    to: z.coerce.date()
  }).refine(data => data.from < data.to, {
    message: "'from' date must be before 'to' date"
  }),

  slug: z.string().min(1).transform(sanitizers.slug),

  url: z.string().url().transform(sanitizers.url),

  phoneNumber: z.string().transform(sanitizers.phone).refine(
    (phone) => phone.length >= 10 && phone.length <= 15,
    { message: "Invalid phone number" }
  )
};

// Schema composition helpers
export const withTimestamps = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return schema.extend({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  });
};

export const withPagination = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return schema.extend({
    limit: z.coerce.number().min(1).max(100).default(20),
    offset: z.coerce.number().min(0).default(0)
  });
};
```

---

## 5. Rate Limiting Middleware

**Current issue:** No rate limiting (critical for production APIs)

### Add Rate Limiting

**Requirements:** Install `@upstash/ratelimit` and `@upstash/redis`

**Location:** `apps/api/src/middleware/rateLimit.ts`

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

export const rateLimiter = (requests: number, windowSeconds: number) => {
  return createMiddleware(async (c, next) => {
    const redis = Redis.fromEnv(c.env);

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, `${windowSeconds}s`),
      analytics: true,
    });

    // Use user ID if authenticated, otherwise IP
    const identifier = c.var.user?.id ?? c.req.header("cf-connecting-ip") ?? "anonymous";

    const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

    // Add rate limit headers
    c.res.headers.set('X-RateLimit-Limit', limit.toString());
    c.res.headers.set('X-RateLimit-Remaining', remaining.toString());
    c.res.headers.set('X-RateLimit-Reset', reset.toString());

    if (!success) {
      throw new HTTPException(429, {
        message: "Too many requests. Please try again later."
      });
    }

    await next();
  });
};

// Preset rate limiters
export const strictRateLimit = rateLimiter(10, 60); // 10 requests per minute
export const standardRateLimit = rateLimiter(60, 60); // 60 requests per minute
export const lenientRateLimit = rateLimiter(300, 60); // 300 requests per minute
```

**Usage:**

```typescript
// In your app.ts
app.post("/api/users", strictRateLimit, async (c) => {
  // Handler
});
```

---

## 6. File Upload Utilities

**Current issue:** R2 is configured but no upload helpers exist

### Add R2 Upload Helpers

**Location:** `packages/common/src/storage.ts`

```typescript
export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export const uploadToR2 = async (
  r2: R2Bucket,
  file: File,
  options: {
    path?: string;
    maxSize?: number; // bytes
    allowedTypes?: string[];
  } = {}
): Promise<UploadResult> => {
  const { path = 'uploads', maxSize = 10 * 1024 * 1024, allowedTypes } = options;

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize} bytes`);
  }

  // Validate file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }

  // Generate unique key
  const ext = file.name.split('.').pop();
  const key = `${path}/${crypto.randomUUID()}.${ext}`;

  // Upload to R2
  await r2.put(key, file, {
    httpMetadata: {
      contentType: file.type
    },
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString()
    }
  });

  return {
    key,
    url: `https://your-r2-domain.com/${key}`, // TODO: Replace with your R2 domain
    size: file.size,
    contentType: file.type
  };
};

export const deleteFromR2 = async (r2: R2Bucket, key: string): Promise<void> => {
  await r2.delete(key);
};

export const getFromR2 = async (r2: R2Bucket, key: string): Promise<R2ObjectBody | null> => {
  return await r2.get(key);
};

// Image-specific helpers
export const uploadImage = async (r2: R2Bucket, file: File) => {
  return uploadToR2(r2, file, {
    path: 'images',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  });
};

// Document-specific helpers
export const uploadDocument = async (r2: R2Bucket, file: File) => {
  return uploadToR2(r2, file, {
    path: 'documents',
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  });
};
```

**Usage example:**

```typescript
app.post("/api/upload", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    throw new HTTPException(400, { message: "No file provided" });
  }

  const result = await uploadImage(c.env.MY_BUCKET, file);

  return c.json(apiResponse.success(result));
});
```

---

## 7. Background Jobs Patterns

**Current issue:** Trigger.dev is set up but no job templates exist

### Add Job Templates

**Location:** `packages/jobs/src/templates/email-jobs.ts`

```typescript
import { tasks } from "@trigger.dev/sdk/v3";

export const emailJobs = {
  sendWelcomeEmail: tasks.create({
    id: "send-welcome-email",
    retry: {
      maxAttempts: 3,
      factor: 2,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000
    },
    run: async (payload: { userId: string; email: string; name: string }) => {
      // Your email sending logic here
      console.log(`Sending welcome email to ${payload.email}`);

      // Example: Use Resend, SendGrid, or Mailgun
      // await resend.emails.send({
      //   from: 'onboarding@printy.mobile',
      //   to: payload.email,
      //   subject: 'Welcome!',
      //   html: `<h1>Welcome ${payload.name}!</h1>`
      // });

      return { success: true, emailSent: payload.email };
    }
  }),

  sendPasswordReset: tasks.create({
    id: "send-password-reset",
    run: async (payload: { userId: string; email: string; token: string }) => {
      console.log(`Sending password reset to ${payload.email}`);
      // Reset email logic
      return { success: true };
    }
  }),

  sendNotification: tasks.create({
    id: "send-notification",
    run: async (payload: { userId: string; message: string; type: 'email' | 'sms' }) => {
      // Multi-channel notification logic
      return { success: true };
    }
  })
};
```

**Location:** `packages/jobs/src/templates/cron-jobs.ts`

```typescript
import { schedules, tasks } from "@trigger.dev/sdk/v3";

export const cronJobs = {
  cleanupExpiredSessions: tasks.create({
    id: "cleanup-expired-sessions",
    trigger: schedules.cron("0 2 * * *"), // 2 AM daily
    run: async () => {
      console.log("Cleaning up expired sessions");
      // Your cleanup logic here
      return { deletedCount: 0 };
    }
  }),

  sendDailyDigest: tasks.create({
    id: "send-daily-digest",
    trigger: schedules.cron("0 8 * * *"), // 8 AM daily
    run: async () => {
      console.log("Sending daily digest emails");
      return { emailsSent: 0 };
    }
  }),

  generateReports: tasks.create({
    id: "generate-reports",
    trigger: schedules.cron("0 0 * * 0"), // Every Sunday at midnight
    run: async () => {
      console.log("Generating weekly reports");
      return { reportsGenerated: 0 };
    }
  })
};
```

**Location:** `packages/jobs/src/templates/data-jobs.ts`

```typescript
export const dataJobs = {
  processUpload: tasks.create({
    id: "process-upload",
    run: async (payload: { fileKey: string; userId: string }) => {
      // Process uploaded files (resize images, extract metadata, etc.)
      return { processed: true };
    }
  }),

  exportData: tasks.create({
    id: "export-data",
    run: async (payload: { userId: string; format: 'csv' | 'json' | 'xlsx' }) => {
      // Generate exports for users
      return { downloadUrl: '' };
    }
  }),

  syncExternalData: tasks.create({
    id: "sync-external-data",
    run: async (payload: { source: string; userId: string }) => {
      // Sync data from external APIs
      return { synced: true, recordCount: 0 };
    }
  })
};
```

---

## 8. Frontend API Client Enhancements

**Current issue:** Basic Hono client, no retry/caching strategy

### Enhanced API Client

**Location:** `apps/webapp/app/lib/api-client.ts`

```typescript
import { hc } from "hono/client";
import type { AppType } from "@api/app";
import { getApiHost } from "./config";

// Get auth token from storage
const getAuthToken = async (): Promise<string | null> => {
  // Your auth token retrieval logic
  return localStorage.getItem('auth_token');
};

// Retry logic with exponential backoff
const fetchWithRetry = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  maxRetries = 3
): Promise<Response> => {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(input, init);

      // Don't retry 4xx errors (client errors)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Retry 5xx errors
      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = 1000 * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
};

export const createApiClient = () => {
  const client = hc<AppType>(getApiHost(), {
    headers: async () => {
      const token = await getAuthToken();
      return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json'
      };
    },
    fetch: fetchWithRetry
  });

  return client;
};

// Singleton instance
let apiClient: ReturnType<typeof createApiClient> | null = null;

export const getApiClient = () => {
  if (!apiClient) {
    apiClient = createApiClient();
  }
  return apiClient;
};

// Invalidate client (useful after logout)
export const resetApiClient = () => {
  apiClient = null;
};
```

**Enhanced usage with React Query:**

```typescript
// apps/webapp/app/lib/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { getApiClient } from './api-client';

export const postsQueries = {
  all: () => ['posts'],
  list: (filters?: { limit?: number; offset?: number }) =>
    queryOptions({
      queryKey: [...postsQueries.all(), 'list', filters],
      queryFn: async () => {
        const client = getApiClient();
        const response = await client.api.posts.$get({
          query: filters
        });
        return response.json();
      }
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...postsQueries.all(), 'detail', id],
      queryFn: async () => {
        const client = getApiClient();
        const response = await client.api.posts[':id'].$get({
          param: { id }
        });
        return response.json();
      }
    })
};
```

---

## 9. Testing Infrastructure

**Current issue:** Good test example, but missing factories and helpers

### Test Factories

**Location:** `apps/api/tests/factories.ts`

```typescript
import { faker } from '@faker-js/faker';
import type { testClient } from 'hono/testing';

// Type-safe factory functions
export const userFactory = (overrides?: Partial<User>) => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  ...overrides
});

export const postFactory = (overrides?: Partial<Post>) => ({
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(3),
  isPublished: true,
  ...overrides
});

export const replyFactory = (overrides?: Partial<Reply>) => ({
  content: faker.lorem.paragraph(),
  ...overrides
});

// Helper to create test entities
export const createTestUser = async (client: any, overrides?: Partial<User>) => {
  const userData = userFactory(overrides);
  const response = await client.api.users.$post({ json: userData });
  return response.json();
};

export const createTestPost = async (client: any, userId: string, overrides?: Partial<Post>) => {
  const postData = postFactory({ userId, ...overrides });
  const response = await client.api.posts.$post({ json: postData });
  return response.json();
};

export const createTestReply = async (
  client: any,
  postId: string,
  userId: string,
  overrides?: Partial<Reply>
) => {
  const replyData = replyFactory({ postId, userId, ...overrides });
  const response = await client.api.replies.$post({ json: replyData });
  return response.json();
};

// Bulk creation helpers
export const createTestUsers = async (client: any, count: number) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await createTestUser(client));
  }
  return users;
};
```

### Test Helpers

**Location:** `apps/api/tests/helpers.ts`

```typescript
import { env } from "cloudflare:test";

export const setupTestDb = async () => {
  // Run migrations if needed
  // Seed essential data
};

export const cleanupTestDb = async (tables: string[]) => {
  // Clear specific tables between tests
  for (const table of tables) {
    await env.DB.prepare(`DELETE FROM ${table}`).run();
  }
};

export const expectValidUuid = (value: string) => {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  expect(value).toMatch(UUID_REGEX);
};

export const expectValidTimestamp = (value: string) => {
  const DATE_REGEX = /^\d{4}-[01]\d-[0-3]\d\s[0-2]\d:[0-5]\d:[0-5]\d$/;
  expect(value).toMatch(DATE_REGEX);
};

// API response matchers
export const expectSuccessResponse = (response: any) => {
  expect(response).toHaveProperty('success', true);
  expect(response).toHaveProperty('data');
  expect(response).toHaveProperty('timestamp');
};

export const expectErrorResponse = (response: any, code?: string) => {
  expect(response).toHaveProperty('success', false);
  expect(response).toHaveProperty('error');
  if (code) {
    expect(response.error.code).toBe(code);
  }
};

export const expectPaginatedResponse = (response: any) => {
  expectSuccessResponse(response);
  expect(response).toHaveProperty('pagination');
  expect(response.pagination).toHaveProperty('page');
  expect(response.pagination).toHaveProperty('limit');
  expect(response.pagination).toHaveProperty('total');
  expect(response.pagination).toHaveProperty('pages');
};
```

---

## 10. Environment Config Package

**Current issue:** No centralized config validation

### Create Config Package

**Location:** `packages/config/src/index.ts`

```typescript
import { z } from "zod";

// Define environment-specific schemas
const baseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
});

const apiEnvSchema = baseEnvSchema.extend({
  DATABASE_URL: z.string().url().optional(),
  API_PORT: z.coerce.number().default(7800),
  CORS_ORIGIN: z.string().url().optional(),

  // Auth
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // External services
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Trigger.dev
  TRIGGER_SECRET_KEY: z.string().optional(),
});

const webappEnvSchema = baseEnvSchema.extend({
  VITE_API_URL: z.string().url(),
  VITE_APP_URL: z.string().url(),
});

// Validate and parse
export const parseApiEnv = () => {
  try {
    return apiEnvSchema.parse(process.env);
  } catch (error) {
    console.error("Environment validation failed:", error);
    throw error;
  }
};

export const parseWebappEnv = () => {
  try {
    return webappEnvSchema.parse(import.meta.env);
  } catch (error) {
    console.error("Environment validation failed:", error);
    throw error;
  }
};

// Type exports
export type ApiConfig = z.infer<typeof apiEnvSchema>;
export type WebappConfig = z.infer<typeof webappEnvSchema>;
```

**Usage:**

```typescript
// In your API entry point
import { parseApiEnv } from '@printy-mobile/config';

const config = parseApiEnv();
// TypeScript knows all the config properties now
console.log(config.API_PORT);
```

---

## 11. Webhook Handler Pattern

**For integrations with Stripe, GitHub, etc.**

### Webhook Handlers

**Location:** `apps/api/src/webhooks/stripe.ts`

```typescript
import { Hono } from 'hono';
import Stripe from 'stripe';
import { logger } from '@printy-mobile/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

export const stripeWebhooks = new Hono();

stripeWebhooks.post('/stripe', async (c) => {
  const sig = c.req.header("stripe-signature");
  const body = await c.req.text();

  if (!sig) {
    throw new HTTPException(400, { message: "Missing signature" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      c.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    logger.error("Webhook signature verification failed", error);
    throw new HTTPException(400, { message: "Invalid signature" });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        logger.warn(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    logger.error("Error processing webhook", error);
    throw new HTTPException(500, { message: "Webhook processing failed" });
  }

  return c.json({ received: true });
});

// Handler implementations
const handlePaymentSuccess = async (paymentIntent: Stripe.PaymentIntent) => {
  logger.info("Payment succeeded", { paymentIntentId: paymentIntent.id });
  // Update your database, send confirmation email, etc.
};

const handlePaymentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  logger.error("Payment failed", { paymentIntentId: paymentIntent.id });
  // Notify user, update status, etc.
};

const handleSubscriptionCreated = async (subscription: Stripe.Subscription) => {
  logger.info("Subscription created", { subscriptionId: subscription.id });
  // Grant access, send welcome email, etc.
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  logger.info("Subscription deleted", { subscriptionId: subscription.id });
  // Revoke access, send confirmation, etc.
};
```

**Mount in your app:**

```typescript
// apps/api/src/app.ts
import { stripeWebhooks } from './webhooks/stripe';

app.route('/webhooks', stripeWebhooks);
```

---

## 12. Cache Middleware

**Add caching layer for expensive operations**

### KV Cache Middleware

**Location:** `apps/api/src/middleware/cache.ts`

```typescript
import { createMiddleware } from 'hono/factory';

interface CacheOptions {
  ttl: number; // seconds
  keyPrefix?: string;
  varyBy?: (c: any) => string; // Custom cache key generation
}

export const cacheMiddleware = (options: CacheOptions) => {
  return createMiddleware(async (c, next) => {
    const cache = c.env.CACHE; // KV binding

    if (!cache) {
      // No cache available, skip
      await next();
      return;
    }

    // Generate cache key
    const baseKey = c.req.path;
    const varyKey = options.varyBy ? options.varyBy(c) : '';
    const cacheKey = `${options.keyPrefix || 'api'}:${baseKey}${varyKey}`;

    // Try to get from cache
    const cached = await cache.get(cacheKey, { type: 'json' });
    if (cached) {
      return c.json(cached, 200, {
        'X-Cache': 'HIT'
      });
    }

    // Not in cache, execute request
    await next();

    // Cache successful responses
    if (c.res.status === 200) {
      const responseData = await c.res.clone().json();
      await cache.put(cacheKey, JSON.stringify(responseData), {
        expirationTtl: options.ttl
      });

      c.res.headers.set('X-Cache', 'MISS');
    }
  });
};

// Preset cache strategies
export const shortCache = cacheMiddleware({ ttl: 60 }); // 1 minute
export const mediumCache = cacheMiddleware({ ttl: 300 }); // 5 minutes
export const longCache = cacheMiddleware({ ttl: 3600 }); // 1 hour

// Cache with user-specific keys
export const userCache = (ttl: number) => cacheMiddleware({
  ttl,
  varyBy: (c) => c.var.user?.id || 'anonymous'
});
```

**Usage:**

```typescript
app.get("/api/posts", longCache, async (c) => {
  // This response will be cached for 1 hour
  const posts = await db.select().from(schema.tPosts);
  return c.json(posts);
});
```

---

## 13. Migration & Seed Scripts

**Make database setup easier across projects**

### Seed Script

**Location:** `packages/db/scripts/seed.ts`

```typescript
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../src/schema';

export const seedDatabase = async (db: ReturnType<typeof drizzle>) => {
  console.log('Starting database seed...');

  // Check if already seeded
  const existingUsers = await db.select().from(schema.tUsers);
  if (existingUsers.length > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  // Seed users
  const testUsers = await db.insert(schema.tUsers).values([
    {
      name: 'Admin User',
      email: 'admin@example.com',
    },
    {
      name: 'Test User',
      email: 'test@example.com',
    }
  ]).returning();

  console.log(`Created ${testUsers.length} users`);

  // Seed posts
  const testPosts = await db.insert(schema.tPosts).values([
    {
      userId: testUsers[0].id,
      title: 'Welcome Post',
      content: 'This is a sample post',
      isPublished: true
    }
  ]).returning();

  console.log(`Created ${testPosts.length} posts`);

  console.log('Database seed completed!');
};
```

**Add pnpm scripts:**

```json
// packages/db/package.json
{
  "scripts": {
    "db:seed": "tsx scripts/seed.ts",
    "db:reset": "pnpm db:drop && pnpm db:push && pnpm db:seed"
  }
}
```

---

## 14. API Versioning Strategy

**Prepare for future API changes**

### Version-based Routing

**Location:** `apps/api/src/app.ts`

```typescript
import { Hono } from 'hono';

// V1 routes
const v1 = new Hono()
  .get('/users', async (c) => { /* v1 logic */ })
  .get('/posts', async (c) => { /* v1 logic */ });

// V2 routes (when you need breaking changes)
const v2 = new Hono()
  .get('/users', async (c) => { /* v2 logic with different response format */ })
  .get('/posts', async (c) => { /* v2 logic */ });

// Mount versions
export const app = new Hono()
  .route("/api/v1", v1)
  .route("/api/v2", v2)
  // Default to latest
  .route("/api", v2);
```

**Alternative: Header-based versioning:**

```typescript
const versionMiddleware = createMiddleware(async (c, next) => {
  const version = c.req.header('API-Version') || '1';
  c.set('apiVersion', version);
  await next();
});

app.use('*', versionMiddleware);

app.get('/api/users', (c) => {
  const version = c.var.apiVersion;

  if (version === '2') {
    // V2 response format
    return c.json({ users: [] });
  }

  // V1 response format
  return c.json([]);
});
```

---

## 15. Development Utilities

**Quality of life improvements for faster development**

### Dev Tools

**Location:** `packages/common/src/dev-tools.ts`

```typescript
// Only available in development
export const devTools = {
  logRequest: (c: any) => {
    if (process.env.NODE_ENV !== 'development') return;

    console.log('\n=== REQUEST ===');
    console.log(`${c.req.method} ${c.req.url}`);
    console.log('Headers:', Object.fromEntries(c.req.headers));
    console.log('================\n');
  },

  logResponse: (data: any) => {
    if (process.env.NODE_ENV !== 'development') return;

    console.log('\n=== RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('================\n');
  },

  // Simulate network delay for testing loading states
  mockDelay: async (ms: number = 1000) => {
    if (process.env.NODE_ENV !== 'development') return;
    await new Promise(resolve => setTimeout(resolve, ms));
  },

  // Quick database reset for testing
  resetDb: async (db: any) => {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('resetDb only available in development');
    }

    console.log('Resetting database...');
    // Your reset logic here
  },

  // Generate fake data on demand
  generateMockData: {
    user: () => ({
      name: 'Mock User',
      email: `mock-${Date.now()}@example.com`
    }),
    post: () => ({
      title: 'Mock Post',
      content: 'This is mock content generated at ' + new Date().toISOString()
    })
  }
};

// Middleware to enable dev logging
export const devLoggingMiddleware = createMiddleware(async (c, next) => {
  if (process.env.NODE_ENV === 'development') {
    devTools.logRequest(c);
    await next();
    devTools.logResponse(await c.res.clone().json());
  } else {
    await next();
  }
});
```

---

## 16. Wrangler Script Consistency

**Current issue:** `apps/api/package.json:6` invokes bare `wrangler` inside `db:touchy`. Fresh machines without a global install hit `command not found` when Turbo kicks that script as part of `pnpm dev`.

### Recommended fix
- Swap the direct call for `pnpx wrangler …` (matching every other script in that file) or wrap it in `[ ! -d ./.wrangler ] && pnpx wrangler …`. This keeps the “touch if missing” behavior while ensuring the CLI resolves from the workspace.

```diff
- "db:touchy": "[ ! -d ./.wrangler ] && wrangler d1 execute printy-mobile-d1-database --local --command='SELECT 1' || true",
+ "db:touchy": "[ ! -d ./.wrangler ] && pnpx wrangler d1 execute printy-mobile-d1-database --local --command='SELECT 1' || true",
```

---

## 17. repo-init Configuration Coverage

**Current issue:** `repo-init.ts:388-399` filters target files by extension, but the list omits `.conf`/`.env`. After running `pnpm run init-project`, `repo.example.conf` still holds template identifiers, so downstream deploy configs drift from the rest of the replacements.

### Recommended fix
- Extend the extension allowlist to include `.conf` and `.env`, then (optionally) auto-copy `repo.example.conf` to `repo.conf` when none exists so the initializer can patch it in place.

```diff
      ".yaml",
      ".yml",
-    ].includes(ext) ||
+      ".conf",
+      ".env",
+    ].includes(ext) ||
```

---

## 18. Surface the Initializer in Docs

**Current issue:** `TEMPLATE_SETUP.md:1-118` walks readers through manual search-and-replace even though `package.json:12` already exposes `pnpm run init-project`. The missing call-out leads people to repeat work your initializer handles automatically.

### Recommended fix
- Add a “Step 0 – Run \`pnpm run init-project\`” section at the top of `TEMPLATE_SETUP.md`, noting the script’s prompts and linking to `repo.example.conf`. Keep the existing checklist as validation rather than the primary workflow.

---

## 19. Provide `.env.example` Templates

**Current issue:** The setup checklist (`TEMPLATE_SETUP.md:51`) tells contributors to copy `.env.example`, but `find . -maxdepth 4 -name '.env.example'` returns no files. New projects have to reverse-engineer required variables from notes.

### Recommended fix
- Commit minimal `.env.example` files in each app/package (e.g., `apps/api/.env.example` with `DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.) and point the checklist to them. Alternatively, update the doc to reference `notes/PRODUCTION_FIXES.md` if you prefer documentation-only guidance.

---

## 20. Fix System Architecture Doc Reference

**Current issue:** `TEMPLATE_SETUP.md:103` references `notes/sys-arch.md`, but the actual document is `notes/SYSTEM_ARCHITECTURE.md`. Following the link currently 404s during onboarding.

### Recommended fix
- Update the filename in the checklist (and any other docs) to the exact casing used in `notes/`.

---

## Implementation Checklist

Track your progress as you implement these improvements:

- [ ] 1. Error handling & logging package
- [ ] 2. API response standards
- [x] 3. Database query helpers
- [x] 4. Enhanced validation schemas
- [ ] 5. Rate limiting middleware
- [x] 6. File upload utilities (R2)
- [x] 7. Background job templates
- [ ] 8. Frontend API client enhancements
- [ ] 9. Testing factories & helpers
- [x] 10. Environment config package
- [ ] 11. Webhook handler pattern
- [ ] 12. Cache middleware
- [x] 13. Migration & seed scripts
- [ ] 14. API versioning strategy
- [ ] 15. Development utilities
- [ ] 16. Wrangler script consistency
- [x] 17. repo-init configuration coverage
- [x] 18. Template docs reference initializer
- [ ] 19. `.env.example` templates
- [x] 20. Fix system architecture doc reference

---

## Notes

- All improvements are designed for **personal template reuse**
- Focus on **DRY principles** across projects
- Prioritize **type safety** throughout
- Keep **Cloudflare-native** where possible
- Remember to update `repo-init.ts` if adding new template placeholders
- Consider creating a "minimal" branch without heavy features for simple projects

---

## Future Considerations

Additional improvements to consider later:

- **Monitoring dashboard** - Custom observability UI
- **Admin CLI** - Command-line tools for management
- **E2E testing** - Playwright setup for critical flows
- **Mobile app starter** - React Native or Expo integration
- **Email templates** - React Email or MJML setup
- **Feature flags** - LaunchDarkly or custom feature toggle system
- **Multi-tenancy helpers** - Tenant isolation patterns
- **Search integration** - ElasticSearch/Algolia patterns
- **Real-time features** - WebSocket patterns beyond auth
- **GraphQL layer** - Optional GraphQL wrapper over Hono
