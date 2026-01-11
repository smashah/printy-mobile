import { z } from "zod";

/**
 * Environment Config Package
 *
 * Centralized environment variable validation and type-safe configuration
 * for all apps in the monorepo.
 *
 * Usage:
 * ```typescript
 * import { parseApiEnv, parseWebappEnv } from '@printy-mobile/config';
 *
 * const config = parseApiEnv(env);
 * // TypeScript knows all config properties with proper types
 * console.log(config.API_PORT);
 * ```
 */

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Base environment schema shared across all apps
 */
const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
});

// ============================================================================
// API Environment Schema
// ============================================================================

/**
 * Environment schema for API/Backend (apps/api)
 * Includes database, auth, external services, and Cloudflare bindings
 */
export const apiEnvSchema = baseEnvSchema.extend({
  // API Configuration
  API_PORT: z.coerce.number().default(8930),
  API_HOST: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),

  // Better Auth Configuration
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),

  // OAuth Providers (all optional, enable as needed)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),

  // Database (D1)
  // Note: D1 binding is handled by Cloudflare Workers, not env vars
  DATABASE_URL: z.string().url().optional(), // For local development

  // Redis (Upstash)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Trigger.dev
  TRIGGER_SECRET_KEY: z.string().optional(),
  TRIGGER_API_URL: z.string().url().optional(),

  // Email Service (choose one)
  RESEND_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  MAILGUN_API_KEY: z.string().optional(),

  // Payment Services
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // External APIs
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),

  // Monitoring & Analytics
  SENTRY_DSN: z.string().url().optional(),
  AXIOM_TOKEN: z.string().optional(),
  AXIOM_DATASET: z.string().optional(),
});

// ============================================================================
// Webapp Environment Schema
// ============================================================================

/**
 * Environment schema for Web App (apps/webapp)
 * Includes frontend-specific configuration with Vite prefix
 */
export const webappEnvSchema = baseEnvSchema.extend({
  // App URLs
  VITE_API_URL: z.string().url("VITE_API_URL must be a valid URL"),
  VITE_APP_URL: z.string().url("VITE_APP_URL must be a valid URL"),

  // Better Auth (frontend needs these for client)
  VITE_BETTER_AUTH_URL: z
    .string()
    .url("VITE_BETTER_AUTH_URL must be a valid URL")
    .optional(),

  // Feature Flags
  VITE_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  VITE_ENABLE_SENTRY: z
    .string()
    .transform((val) => val === "true")
    .optional(),

  // Public Keys (safe to expose in frontend)
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  VITE_GOOGLE_ANALYTICS_ID: z.string().optional(),
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_POSTHOG_HOST: z.string().url().optional(),

  // Sentry (frontend)
  VITE_SENTRY_DSN: z.string().url().optional(),
});

// ============================================================================
// Cloudflare Bindings Schema
// ============================================================================

/**
 * Schema for Cloudflare Worker bindings (D1, R2, KV, etc.)
 * These are injected by Cloudflare Workers runtime, not from .env
 */
export const cloudflareBindingsSchema = z.object({
  // D1 Database
  DB: z.any().optional(), // D1Database type from @cloudflare/workers-types

  // R2 Buckets
  MEDIA_BUCKET: z.any().optional(), // R2Bucket type

  // KV Namespaces
  CACHE: z.any().optional(), // KVNamespace type

  // Analytics Engine
  ANALYTICS: z.any().optional(),

  // AI Bindings
  AI: z.any().optional(),

  // Durable Objects
  // Add your durable object bindings here
});

// ============================================================================
// Combined API Environment (Runtime + Bindings)
// ============================================================================

/**
 * Complete API environment including both env vars and Cloudflare bindings
 */
export const apiCompleteEnvSchema = apiEnvSchema.merge(cloudflareBindingsSchema);

// ============================================================================
// Type Exports
// ============================================================================

export type ApiConfig = z.infer<typeof apiEnvSchema>;
export type WebappConfig = z.infer<typeof webappEnvSchema>;
export type CloudflareBindings = z.infer<typeof cloudflareBindingsSchema>;
export type ApiCompleteConfig = z.infer<typeof apiCompleteEnvSchema>;

// ============================================================================
// Parsing Functions
// ============================================================================

/**
 * Parse and validate API environment variables
 *
 * @param env - Environment object (process.env or Cloudflare env)
 * @param options - Parsing options
 * @returns Validated and typed configuration
 * @throws ZodError if validation fails
 *
 * @example
 * ```typescript
 * // In Cloudflare Worker
 * const config = parseApiEnv(env);
 *
 * // In Node.js/local dev
 * const config = parseApiEnv(process.env);
 * ```
 */
export const parseApiEnv = (
  env: Record<string, unknown>,
  options: { strict?: boolean } = {}
) => {
  try {
    if (options.strict) {
      return apiCompleteEnvSchema.parse(env);
    }
    return apiEnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ API Environment validation failed:");
      console.error(
        error.errors
          .map(
            (err) =>
              `  - ${err.path.join(".")}: ${err.message}`
          )
          .join("\n")
      );
    }
    throw error;
  }
};

/**
 * Parse and validate webapp environment variables
 *
 * @param env - Environment object (import.meta.env or process.env)
 * @returns Validated and typed configuration
 * @throws ZodError if validation fails
 *
 * @example
 * ```typescript
 * // In Vite app
 * const config = parseWebappEnv(import.meta.env);
 * ```
 */
export const parseWebappEnv = (env: Record<string, unknown>) => {
  try {
    return webappEnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Webapp Environment validation failed:");
      console.error(
        error.errors
          .map(
            (err) =>
              `  - ${err.path.join(".")}: ${err.message}`
          )
          .join("\n")
      );
    }
    throw error;
  }
};

/**
 * Safely parse environment without throwing
 * Returns result object with success/error
 *
 * @example
 * ```typescript
 * const result = safeParseApiEnv(env);
 * if (result.success) {
 *   console.log(result.data.API_PORT);
 * } else {
 *   console.error(result.error.errors);
 * }
 * ```
 */
export const safeParseApiEnv = (env: Record<string, unknown>) => {
  return apiEnvSchema.safeParse(env);
};

/**
 * Safely parse webapp environment without throwing
 */
export const safeParseWebappEnv = (env: Record<string, unknown>) => {
  return webappEnvSchema.safeParse(env);
};

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Check if required environment variables are set
 * Useful for startup checks
 *
 * @example
 * ```typescript
 * const required = ['BETTER_AUTH_SECRET', 'BETTER_AUTH_URL'];
 * const missing = getMissingEnvVars(env, required);
 * if (missing.length > 0) {
 *   console.error(`Missing required env vars: ${missing.join(', ')}`);
 *   process.exit(1);
 * }
 * ```
 */
export const getMissingEnvVars = (
  env: Record<string, unknown>,
  required: string[]
): string[] => {
  return required.filter((key) => !env[key]);
};

/**
 * Get environment-specific configuration
 * Returns different values based on NODE_ENV
 *
 * @example
 * ```typescript
 * const apiUrl = getEnvSpecific({
 *   development: 'http://localhost:8930',
 *   staging: 'https://api-staging.example.com',
 *   production: 'https://api.example.com'
 * });
 * ```
 */
export const getEnvSpecific = <T>(config: {
  development: T;
  staging: T;
  production: T;
}): T => {
  const env = process.env.NODE_ENV || "development";
  return config[env as keyof typeof config];
};

/**
 * Check if running in production
 */
export const isProduction = () => process.env.NODE_ENV === "production";

/**
 * Check if running in development
 */
export const isDevelopment = () =>
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === undefined;

/**
 * Check if running in staging
 */
export const isStaging = () => process.env.NODE_ENV === "staging";
