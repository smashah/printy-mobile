import { legalConsent } from "@better-auth-kit/legal-consent";
import { reverify } from "@better-auth-kit/reverify";
import {
  polar,
  checkout,
  portal,
  webhooks,
  usage,
} from "@polar-sh/better-auth";
import type { Polar } from "@polar-sh/sdk";
import { jwt } from "better-auth/plugins";
import {
  admin,
  anonymous,
  apiKey,
  lastLoginMethod,
  organization,
  username,
} from "better-auth/plugins";

export const AuthCallbackDefaults = (app: "webapp" | "backoffice") => ({
  /**
   * A URL to redirect after the user authenticates with the provider
   * @default "/"
   */
  callbackURL: `/api/auth/cb/${app}/`,
  /**
   * A URL to redirect if an error occurs during the sign in process
   */
  errorCallbackURL: `/api/auth/cb/${app}/error`,
  /**
   * A URL to redirect if the user is newly registered
   */
  newUserCallbackURL: `/api/auth/cb/${app}/onboarding`,
  /**
   * disable the automatic redirect to the provider.
   * @default false
   */
  disableRedirect: true,
});

/**
 * Polar payment integration config
 *
 * @param client - Polar SDK client instance
 * @param webhookSecret - Optional webhook secret for verification (can be overridden in API)
 *
 * Products are configured via env vars: PRODUCT_ID_FREE, PRODUCT_ID_PRO
 * The frontend fetches these dynamically from /api/products
 */
export const polarConfig = (client: Polar, webhookSecret?: string) => {
  return polar({
    client,
    createCustomerOnSignUp: true, // Auto-create Polar customer when user signs up
    enableCustomerPortal: true, // Enable customer self-service portal
    use: [
      usage(), // Enable usage/credits tracking
      checkout({
        // Products are configured dynamically - add your product IDs here or fetch from env
        // Example products (replace with actual Polar product IDs):
        products: [
          // {
          //   productId: "YOUR_PRO_PRODUCT_ID",
          //   slug: "pro", // URL-friendly slug: /api/auth/checkout/pro
          // },
          // {
          //   productId: "YOUR_FREE_PRODUCT_ID",
          //   slug: "free",
          // },
        ],
        successUrl: "/billing/success?checkout_id={CHECKOUT_ID}",
        authenticatedUsersOnly: true,
      }),
      portal(), // Customer self-service portal for managing subscriptions
      webhooks({
        secret: webhookSecret ?? "",
      }),
    ],
  });
};

/**
 * Default better-auth configuration
 *
 * @param options.withoutPayments - If true, excludes Polar payment integration (simpler setup)
 * @param options.polarClient - Polar SDK client instance (required if withoutPayments is false)
 * @param options.polarWebhookSecret - Webhook secret for Polar (optional, can be set in API)
 */
export const defaultBetterAuthConfig = (options?: {
  withoutPayments?: boolean;
  polarClient?: Polar;
  polarWebhookSecret?: string;
}) => {
  const plugins = [
    jwt({
      jwks: {
        rotationInterval: 60 * 60 * 24 * 30,
        gracePeriod: 60 * 60 * 24 * 30,
      },
    }),
    username(),
    organization({
      schema: {
        organization: {
          additionalFields: {
            metadata: { type: "json", input: true, required: false },
            subscriptionTier: { type: "string", input: true, required: false },
            usageLimit: { type: "number", input: true, required: false },
          },
        },
      },
    }),
    lastLoginMethod(),
    admin(),
    apiKey(),
    anonymous(),
    reverify(),
    legalConsent({
      requireTOS: false,
      requirePrivacyPolicy: false,
      requireMarketingConsent: false,
      requireCookieConsent: false,
    }),
  ];

  // Add Polar payment plugin if enabled and client provided
  if (!options?.withoutPayments && options?.polarClient) {
    plugins.push(
      polarConfig(options.polarClient, options.polarWebhookSecret) as any
    );
  }

  return {
    experimental: {
      joins: true,
    },
    account: {
      accountLinking: {
        updateUserInfoOnLink: true,
        trustedProviders: ["google", "github", "discord"],
      },
    },
    socialProviders: {
      google: {
        clientId: "YOUR_GOOGLE_CLIENT_ID",
        clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
        ...AuthCallbackDefaults("webapp"),
      },
      github: {
        clientId: "process.env.GITHUB_CLIENT_ID as string",
        clientSecret: "process.env.GITHUB_CLIENT_SECRET as string",
        ...AuthCallbackDefaults("webapp"),
      },
      discord: {
        clientId: "process.env.DISCORD_CLIENT_ID as string",
        clientSecret: "process.env.DISCORD_CLIENT_SECRET as string",
        ...AuthCallbackDefaults("webapp"),
      },
    },
    plugins,
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://localhost:3005",
      "http://localhost:7803",
    ],
  };
};
