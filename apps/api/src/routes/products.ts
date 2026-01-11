import { Hono } from "hono";
import type { APIBindings } from "../middleware/type";

export const productsRoutes = new Hono<APIBindings>();

productsRoutes.get("/", (c) =>
  c.json({
    free: c.env.PRODUCT_ID_FREE,
    pro: c.env.PRODUCT_ID_PRO,
  })
);
