import { getLocalDrizzleDB } from "@printy-mobile/db/utils";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { defaultBetterAuthConfig } from "./lib/defaults";

export const betterAuthConfig: BetterAuthOptions = {
  database: drizzleAdapter(await getLocalDrizzleDB(), {
    provider: "sqlite",
  }),
  ...defaultBetterAuthConfig,
};

export const auth = betterAuth(betterAuthConfig);
