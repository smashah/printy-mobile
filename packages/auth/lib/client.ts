import {
  adminClient,
  apiKeyClient,
  inferAdditionalFields,
  lastLoginMethodClient,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
    adminClient(),
    apiKeyClient(),
    organizationClient(),
    lastLoginMethodClient(),
  ],
  baseURL: (
    import.meta?.env?.PROD || 
    typeof window !== "undefined" && (
      window.location.hostname.includes("pages.dev") ||
      window.location.hostname !== "localhost"
    ) ||
    process.env.NODE_ENV === "production"
  )
    ? `${typeof window !== "undefined" ? window.location.origin : "https://api.example.com"}/api/auth`
    : "http://localhost:3000/api/auth",
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  forgetPassword,
  resetPassword,
} = authClient;

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
