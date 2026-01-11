import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";
import { ZUserByIDParams, ZUserInsert } from "@printy-mobile/db/dtos";
import * as schema from "@printy-mobile/db/alias";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import * as z from "zod";
import { auth, authMiddleware } from "./middleware/auth";
import { dbProvider } from "./middleware/dbProvider";
import { initPaymentSdk, paymentsMiddleware } from "./middleware/payments";
import { zodValidator } from "./middleware/validator";
import { uploadsRouter } from "./routes/uploads";
import { productsRoutes } from "./routes/products";
import type { APIBindings } from "./middleware/type";

const postsQuerySchema = z.object({
  limit: z.string().optional(),
  offset: z.string().optional(),
  category: z.string().optional(),
});

const createPostSchema = z.object({
  body: z.string().min(1, "Post body is required"),
  username: z.string().min(1, "Username is required"),
});

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

      return next();
    })
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
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .on(["POST", "GET", "OPTIONS"], "/auth/*", (c) => auth(c).handler(c.req.raw))
  .use("*", authMiddleware)
  .use("*", paymentsMiddleware)
  .get("/users", async (c) => {
    const db = c.var.db;
    const users = await db.select().from(schema.tUsers);
    return c.json(users);
  })
  .get("/posts", zodValidator("query", postsQuerySchema), async (c) => {
    const db = c.var.db;
    const query = db.select().from(schema.tPosts);
    const posts = await query;
    return c.json(posts);
  })
  .get("/posts/:id", async (c) => {
    const db = c.var.db;
    const { id } = c.req.param();
    const post = await db
      .select()
      .from(schema.tPosts)
      .where(eq(schema.tPosts.id, id));
    return c.json(post);
  })
  .post("/posts", zodValidator("json", createPostSchema), async (c) => {
    const db = c.var.db;
    const { body, username } = c.req.valid("json");
    const post = await db.insert(schema.tPosts).values({ body, username });
    return c.json(post);
  })
  .post("/replies", async (c) => {
    const db = c.var.db;
    const { postId, body } = await c.req.json();
    const reply = await db.insert(schema.tReplies).values({ postId, body });
    return c.json(reply);
  });

export const app = new Hono<APIBindings>()
  .get("/", (c) => c.text("Honc from above!"))
  .get("/health", (c) => c.text("OK"))
  .route("/auth", api)
  .route("/api", api)
  .route("/api/uploads", uploadsRouter)
  .route("/api/products", productsRoutes);

app.onError((error, c) => {
  console.error(error);
  if (error instanceof HTTPException) {
    return c.json(
      {
        message: error.message,
      },
      error.status
    );
  }

  return c.json(
    {
      message: "Something went wrong",
    },
    500
  );
});

app.get("/openapi.json", (c) =>
  c.json(
    createOpenAPISpec(app, {
      info: {
        title: "Honc D1 App",
        version: "1.0.0",
      },
    })
  )
);

app.use(
  "/fp/*",
  createFiberplane({
    app,
    openapi: { url: "/openapi.json" },
  })
);

export default app;
