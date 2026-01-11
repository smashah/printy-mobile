import { Hono } from "hono";
import { cors } from "hono/cors";
import printRoutes from "./routes/print";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:8930",
      "http://localhost:8931",
      "http://localhost:8932",
      "http://localhost:3000",
      "https://printy.mobile",
      "https://api.printy.mobile",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.get("/", (c) => {
  return c.json({
    name: "Printy Mobile Printer API",
    version: "1.0.0",
    endpoints: [
      "POST /print/github",
      "POST /print/linear",
      "POST /print/recipe",
      "POST /print/coloring",
      "POST /print/wifi",
      "POST /print/asset",
      "POST /print/pr",
      "POST /print/release",
      "POST /print/build",
      "POST /print/todo",
    ],
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.route("/print", printRoutes);

export default app;
