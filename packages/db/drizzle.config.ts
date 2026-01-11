import { exec, execSync } from "child_process";
import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";

export function getLocalD1DB() {
  const basePath = path.resolve("../../apps/api/.wrangler");
  const dbf = () => {
    const dbFile = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .find((f) => f.endsWith(".sqlite"));
    return dbFile;
  };
  try {
    let dbFile = dbf();
    if (!dbFile) {
      console.log("Cannot find db file, touching DB");
      console.log(execSync("pnpm run --filter @printy-mobileapi db:touch"));
      dbFile = dbf();
      if (!dbFile) throw new Error(`.sqlite file not found in ${basePath}`);
    }

    const url = path.resolve(basePath, dbFile);
    console.log("🚀 ~ SQLITE FILE ~ url:", url);
    return url;
  } catch (err) {
    console.log(`Error  ${err.message}`);
  }
}

export default defineConfig({
  casing: "snake_case",
  dialect: "sqlite", // "postgresql" | "mysql"
  // driver: "turso" // optional and used only if `aws-data-api`, `turso`, `d1-http`(WIP) or `expo` are used
  out: "migrations",
  schema: "./src/schema/index.ts",
  ...(process.env.NODE_ENV === "production"
    ? {
        driver: "d1-http",
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID,
          databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
          token: process.env.CLOUDFLARE_D1_API_TOKEN,
        },
      }
    : {
        dbCredentials: {
          url: getLocalD1DB(),
        },
      }),
});
