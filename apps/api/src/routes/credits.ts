import { creditBalance } from "@printy-mobile/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import type { APIBindings } from "../middleware/type";

export const creditsRouter = new Hono<APIBindings>();

const UNAUTHORIZED = 401;

creditsRouter.get("/", async (c) => {
  const db = c.var.db;
  const user = c.var.user;
  if (!user) {
    return c.json({ error: "Unauthorized" }, UNAUTHORIZED);
  }

  const result = await db
    .select()
    .from(creditBalance)
    .where(eq(creditBalance.userId, user.id));

  const balance = result[0]?.balance ?? 0;

  return c.json({ success: true, data: { balance } });
});

const addCreditsSchema = z.object({
  amount: z.number().int().positive(),
});

creditsRouter.post("/add", zValidator("json", addCreditsSchema), async (c) => {
  const user = c.var.user;
  const addCredits = c.var.addCredits;

  if (!user) {
    return c.json({ error: "Unauthorized" }, UNAUTHORIZED);
  }

  const { amount } = c.req.valid("json");

  await addCredits(amount, "manual_refill");

  return c.json({ success: true, message: `Added ${amount} credits` });
});
