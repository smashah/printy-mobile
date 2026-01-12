// import { D1Database, D1DatabaseAPI } from "@miniflare/d1";
// import type { D1Database as D1DatabaseType } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import fs from "fs";
import path from "path";
import * as schema from "../db/schema";

export function getLocalD1DB() {
  try {
    const basePath = path.resolve("../../apps/api/.wrangler");
    const dbFile = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .find((f) => f.endsWith(".sqlite"));

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    const url = path.resolve(basePath, dbFile);
    console.log("🚀 ~ SQLITE FILE ~ url:", url);
    return url;
  } catch (err) {
    console.log(
      `Error  ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }
}

export const getLocalDrizzleDB = async () => {
  const localDb = null; //await createSQLiteDB(getLocalD1DB()!);
  //@ts-expect-error
  const db = {}; //new D1Database(new D1DatabaseAPI(local_db)) as unknown as D1DatabaseType;
  // @ts-expect-error
  return drizzle(db, { schema });
};

// Export query helpers
export * from "./queries";
