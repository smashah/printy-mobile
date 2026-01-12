import { defaultBetterAuthConfig } from "@printy-mobile/auth";
import * as schema from "@printy-mobile/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { deepmerge } from "deepmerge-ts";
import { createMiddleware } from "hono/factory";
import type { APIBindings, APIContext } from "./type";
import { Resend } from "resend";

export const auth = (c: APIContext): ReturnType<typeof betterAuth> => {
  const db = c.get("db");
  return betterAuth(
    deepmerge(defaultBetterAuthConfig, {
      database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
        debugLogs: true,
      }),
      baseURL: c.env.BETTER_AUTH_URL,
      secret: c.env.BETTER_AUTH_SECRET,
      socialProviders: {
        github: {
          clientId: c.env.AUTH_GITHUB_CLIENT_ID,
          clientSecret: c.env.AUTH_GITHUB_CLIENT_SECRET,
          scope: ["repo"],
        },
        discord: {
          clientId: c.env.AUTH_DISCORD_CLIENT_ID,
          clientSecret: c.env.AUTH_DISCORD_CLIENT_SECRET,
        },
        google: {
          clientId: c.env.AUTH_GOOGLE_CLIENT_ID,
          clientSecret: c.env.AUTH_GOOGLE_CLIENT_SECRET,
        },
      },
      trustedOrigins: [c.env.WEB_APP_HOST, c.env.BACK_OFFICE_HOST],
    }),
  );
};

export const authMiddleware = createMiddleware<APIBindings>(async (c, next) => {
  const session = await auth(c).api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  c.set("resend", new Resend(c.env.RESEND_API_KEY));
  c.set("auth", auth(c));
  // If the path looks like this then forward to the webapp host with the redirect path /auth/callback?redirectTo=/account/security
  const url = new URL(c.req.url, `http://${c.req.header("host")}`);
  const redirectTo = url.searchParams.get("redirectTo");
  if (c.req.path.startsWith("/auth/callback") && redirectTo) {
    console.log("REDIRECTING TO WEBAPP", `${c.env.WEB_APP_HOST}${redirectTo}`);
    return c.redirect(`${c.env.WEB_APP_HOST}${redirectTo}`);
  }
  //if the path is `/cb/...` then redirect to the callback URL in the respective app (e.g cb/backoffice/... will go to c.env.BACK_OFFICE_HOST/... and cb/webapp/... will go to c.env.WEB_APP_HOST/...)
  console.log(
    "🚀 ~ c.req.path:",
    c.req.path,
    c.env.BACK_OFFICE_HOST,
    c.env.WEB_APP_HOST,
  );
  if (c.req.path.startsWith("/api/auth/cb/backoffice/")) {
    const path = c.req.path.replace("/api/auth/cb/backoffice/", "");
    console.log(
      "REDIRECTING TO BACKOFFICE",
      `${c.env.BACK_OFFICE_HOST}/${path}`,
    );
    return c.redirect(`${c.env.BACK_OFFICE_HOST}/${path}`);
  } else if (c.req.path.startsWith("/api/auth/cb/webapp/")) {
    const path = c.req.path.replace("/api/auth/cb/webapp/", "");
    console.log("REDIRECTING TO WEBAPP", `${c.env.WEB_APP_HOST}/${path}`);
    return c.redirect(`${c.env.WEB_APP_HOST}/${path}`);
  }
  return next();
});
