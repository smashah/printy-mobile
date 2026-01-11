import { getLocalDrizzleDB } from "@printy-mobile/db/utils"; // your drizzle instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { defaultBetterAuthConfig } from "./defaults";

export const auth = betterAuth({
  database: drizzleAdapter(await getLocalDrizzleDB(), {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  ...defaultBetterAuthConfig,
});
