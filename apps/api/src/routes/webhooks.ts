import { zValidator } from "@hono/zod-validator";
import { webhooks } from "@printy-mobile/db/schema";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import type { APIBindings } from "../middleware/type";

export const webhooksRouter = new Hono<APIBindings>();

const webhookSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  eventTypes: z.array(z.string()).default(["*"]),
  active: z.boolean().default(true),
});

webhooksRouter.get("/", async (c) => {
  const db = c.var.db;
  const user = c.var.user;
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const result = await db
    .select()
    .from(webhooks)
    .where(eq(webhooks.userId, user.id));

  return c.json({ success: true, data: result });
});

webhooksRouter.post("/", zValidator("json", webhookSchema), async (c) => {
  const db = c.var.db;
  const user = c.var.user;
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { name, url, eventTypes, active } = c.req.valid("json");
  const secret = `whsec_${crypto.randomUUID().replace(/-/g, "")}`;

  const [webhook] = await db
    .insert(webhooks)
    .values({
      userId: user.id,
      name,
      url,
      secret,
      eventTypes: JSON.stringify(eventTypes),
      active,
    })
    .returning();

  return c.json({ success: true, data: webhook });
});

webhooksRouter.delete("/:id", async (c) => {
  const db = c.var.db;
  const user = c.var.user;
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { id } = c.req.param();

  await db
    .delete(webhooks)
    .where(and(eq(webhooks.id, id), eq(webhooks.userId, user.id)));

  return c.json({ success: true });
});
