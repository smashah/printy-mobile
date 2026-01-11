import type * as schema from "@printy-mobile/db/schema";
import type { betterAuth } from "better-auth";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";
import type { BlankInput } from "hono/types";
import type { Resend } from "resend";
import type { AwsClient } from "aws4fetch";
import type { PicoS3 } from "pico-s3";
import type { Polar } from "@polar-sh/sdk";

export type BetterAuth = ReturnType<typeof betterAuth>;

export type ApiBindings = {
  Bindings: {
    DB: D1Database;
    MEDIA_BUCKET: R2Bucket;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    AUTH_GOOGLE_CLIENT_ID: string;
    AUTH_GOOGLE_CLIENT_SECRET: string;
    AUTH_GITHUB_CLIENT_ID: string;
    AUTH_GITHUB_CLIENT_SECRET: string;
    AUTH_DISCORD_CLIENT_ID: string;
    AUTH_DISCORD_CLIENT_SECRET: string;
    BACK_OFFICE_HOST: string;
    WEB_APP_HOST: string;
    AWS_BUCKET: string;
    AWS_ENDPOINT: string;
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    S3_PROVIDER: string;
    MEDIA_BUCKET_URL: string;
    DISCORD_WEBHOOK_URL: string;
    RESEND_API_KEY: string;
    POLAR_ACCESS_TOKEN: string;
    POLAR_WEBHOOK_SECRET: string;
    PRODUCT_ID_FREE: string;
    PRODUCT_ID_PRO: string;
    ENVIRONMENT: string;
  };
  Variables: {
    user: BetterAuth["$Infer"]["Session"]["user"] | null;
    session: BetterAuth["$Infer"]["Session"]["session"] | null;
    db: DrizzleD1Database<typeof schema>;
    auth: BetterAuth;
    aws: AwsClient;
    awsUrl: (path: string) => string;
    p3: PicoS3;
    resend: Resend;
    polar: Polar;
    addCredits: (amount: number, reason?: string) => Promise<void>;
    spendCredits: (amount: number, eventName: string) => Promise<void>;
    getBalance: () => Promise<number>;
    hasSufficientBalance: (amount: number) => Promise<boolean>;
  };
};

// Legacy alias for backwards compatibility
export type APIBindings = ApiBindings;

export type ApiContext = Context<ApiBindings, "/", BlankInput>;

// Legacy alias for backwards compatibility
export type APIContext = ApiContext;
