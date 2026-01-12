import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { subscriptions } from "@printy-mobile/db/schema";
import type { APIBindings } from "../middleware/type";

export const subscriptionsRouter = new Hono<APIBindings>();

const UNAUTHORIZED = 401;

subscriptionsRouter.get("/", async (c) => {
  const db = c.var.db;
  const user = c.var.user;
  if (!user) {
    return c.json({ error: "Unauthorized" }, UNAUTHORIZED);
  }

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id));

  return c.json({ success: true, data: result });
});
