import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { auth, authMiddleware } from "./middleware/auth";
import { dbProvider } from "./middleware/dbProvider";
import { initPaymentSdk, paymentsMiddleware } from "./middleware/payments";
import { creditsRouter } from "./routes/credits";
import { subscriptionsRouter } from "./routes/subscriptions";
import { uploadsRouter } from "./routes/uploads";
import { webhooksRouter } from "./routes/webhooks";
import type { APIBindings } from "./middleware/type";

const INTERNAL_SERVER_ERROR = 500;

export const api = new Hono<APIBindings>()
  .use("*", dbProvider)
  .use("*", initPaymentSdk)
  .use(
    "*",
    createMiddleware<APIBindings>(async (c, next) => {
      const url = new URL(c.req.url, `http://${c.req.header("host")}`);
      const redirectTo = url.searchParams.get("redirectTo");

      if (c.req.path.startsWith("/auth/callback") && redirectTo) {
        return c.redirect(`${c.env.WEB_APP_HOST}${redirectTo}`);
      }

      if (c.req.path.startsWith("/api/auth/cb/backoffice/")) {
        const path = c.req.path.replace("/api/auth/cb/backoffice/", "");
        return c.redirect(`${c.env.BACK_OFFICE_HOST}/${path}`);
      }

      if (c.req.path.startsWith("/api/auth/cb/webapp/")) {
        const path = c.req.path.replace("/api/auth/cb/webapp/", "onboarding");
        return c.redirect(`${c.env.WEB_APP_HOST}/${path}`);
      }

      await next();
    }),
  )
  .use(
    "*",
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:9010",
        "http://localhost:9011",
        "http://localhost:9012",
        "http://localhost:9013",
        "http://localhost:9014",
        "http://localhost:3005",
        "http://localhost:8787",
        "http://localhost:7803",
        "https://printy.mobile",
        "https://printy-mobile-webapp.printy.workers.dev",
      ],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT", "PATCH"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .on(["POST", "GET", "OPTIONS"], "/auth/*", (c) => auth(c).handler(c.req.raw))
  .use("*", authMiddleware)
  .use("*", paymentsMiddleware)
  .route("/subscriptions", subscriptionsRouter)
  .route("/webhooks", webhooksRouter)
  .route("/credits", creditsRouter)
  .route("/uploads", uploadsRouter);

export const app = new Hono<APIBindings>()
  .get("/", (c) => c.text("Printy Mobile API"))
  .get("/health", (c) => c.text("OK"))
  .route("/auth", api)
  .route("/api", api);

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      {
        message: error.message,
      },
      error.status,
    );
  }

  return c.json(
    {
      message: "Something went wrong",
    },
    INTERNAL_SERVER_ERROR,
  );
});

app.get("/openapi.json", (c) =>
  c.json(
    createOpenAPISpec(app, {
      info: {
        title: "Printy Mobile API",
        version: "1.0.0",
      },
    }),
  ),
);

app.use(
  "/fp/*",
  createFiberplane({
    app,
    openapi: { url: "/openapi.json" },
  }),
);

export default app;
