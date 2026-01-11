#!/usr/bin/env tsx
/**
 * Database Migration Script
 *
 * Applies pending migrations to the database.
 * This script can run against local or production databases.
 *
 * Usage:
 *   pnpm db:migrate            # Migrate local development database
 *   ENVIRONMENT=production pnpm db:migrate  # Migrate production database
 *
 * Note: This uses Drizzle Kit's migration system.
 * Migrations should be generated with `pnpm db:generate` first.
 */

import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import path from "node:path";
import fs from "node:fs";
import { config } from "dotenv";

/**
 * Main migration function
 */
async function main() {
  const isProd = process.env.ENVIRONMENT === "production";

  if (isProd) {
    console.warn("⚠️  Running migrations on production database");
    console.warn("⚠️  This will modify your production database schema!");
    console.warn("⚠️  Press Ctrl+C within 5 seconds to cancel...\n");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log("🔄 Starting database migration...\n");

  try {
    const db = isProd ? await getProductionDb() : getLocalDb();
    const migrationsFolder = path.resolve(__dirname, "../migrations");

    // Check if migrations folder exists
    if (!fs.existsSync(migrationsFolder)) {
      console.error("❌ Migrations folder not found!");
      console.error("   Run 'pnpm db:generate' to create migrations first.");
      process.exit(1);
    }

    // Check if there are any migrations
    const migrationFiles = fs
      .readdirSync(migrationsFolder)
      .filter((file) => file.endsWith(".sql"));

    if (migrationFiles.length === 0) {
      console.log("✅ No pending migrations found.");
      console.log("   Run 'pnpm db:generate' if you've made schema changes.");
      return;
    }

    console.log(`📦 Found ${migrationFiles.length} migration(s)`);
    console.log(`   Location: ${migrationsFolder}\n`);

    // Run migrations
    await migrate(db, { migrationsFolder });

    console.log("\n✅ Migrations completed successfully!");
    console.log("\n💡 Next steps:");
    console.log("   - Review the changes in your database");
    console.log("   - Run 'pnpm db:studio' to inspect the database");
    console.log("   - Run 'pnpm db:seed' to populate with sample data");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  }
}

/**
 * Get local database connection
 */
function getLocalDb() {
  const pathToDb = getLocalD1dbPath();
  if (!pathToDb) {
    console.error(
      "❌ Local D1 database not found. Try running the dev server first."
    );
    process.exit(1);
  }

  console.log(`📁 Database: ${pathToDb}`);

  const client = createClient({
    url: `file:${pathToDb}`,
  });

  return drizzle(client, {
    casing: "snake_case",
  });
}

/**
 * Find local D1 database path
 */
function getLocalD1dbPath() {
  try {
    const basePath = path.resolve("../../apps/api/.wrangler/state/v3/d1");
    const files = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .filter((f) => f.endsWith(".sqlite"));

    files.sort((a, b) => {
      const statA = fs.statSync(path.join(basePath, a));
      const statB = fs.statSync(path.join(basePath, b));
      return statB.mtime.getTime() - statA.mtime.getTime();
    });

    const dbFile = files[0];
    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    return path.resolve(basePath, dbFile);
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Error resolving local D1 DB: ${err.message}`);
    }
  }
}

/**
 * Get production database connection
 */
async function getProductionDb() {
  config({ path: "../../apps/api/.prod.vars" });

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not set in .prod.vars");
    console.error("   Required for production migrations.");
    process.exit(1);
  }

  console.log(`🌐 Database: ${databaseUrl.split("@")[1] || "production"}`);

  const client = createClient({
    url: databaseUrl,
  });

  return drizzle(client, {
    casing: "snake_case",
  });
}

// Run migrations
main()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Failed:", error);
    process.exit(1);
  });
