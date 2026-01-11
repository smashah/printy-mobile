import * as schema from "@printy-mobile/db/schema";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";
import type { APIBindings } from "./type";

export const dbProvider = createMiddleware<APIBindings>(async (c, next) => {
  const db = drizzle(c.env.DB, {
    schema,
    casing: "snake_case",
  });

  c.set("db", db as DrizzleD1Database<typeof schema>);
  await next();
});
