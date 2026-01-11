#!/usr/bin/env tsx
/**
 * Database Reset Script
 *
 * Drops all tables, re-runs migrations, and seeds with fresh data.
 * Use this to get a clean database state for development.
 *
 * ⚠️  WARNING: This will DELETE ALL DATA in your database!
 *
 * Usage:
 *   pnpm db:reset              # Reset local development database
 *   ENVIRONMENT=production pnpm db:reset  # Reset production (NOT RECOMMENDED)
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import path from "node:path";
import fs from "node:fs";
import { config } from "dotenv";
import { sql } from "drizzle-orm";

/**
 * Main reset function
 */
async function main() {
  const isProd = process.env.ENVIRONMENT === "production";

  if (isProd) {
    console.error("\n⛔ DATABASE RESET ON PRODUCTION IS DISABLED");
    console.error("   This operation is too dangerous for production.");
    console.error("   If you really need to reset production:");
    console.error("   1. Backup your data first");
    console.error("   2. Manually drop tables via Cloudflare dashboard");
    console.error("   3. Run migrations: ENVIRONMENT=production pnpm db:migrate");
    console.error("   4. Seed if needed: ENVIRONMENT=production pnpm db:seed\n");
    process.exit(1);
  }

  console.log("\n⚠️  DATABASE RESET WARNING");
  console.log("   This will DELETE ALL DATA in your local database!");
  console.log("   Press Ctrl+C within 5 seconds to cancel...\n");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("🔄 Starting database reset...\n");

  try {
    const db = getLocalDb();

    // Step 1: Drop all tables
    console.log("🗑️  Step 1: Dropping all tables...");
    await dropAllTables(db);
    console.log("✅ All tables dropped\n");

    // Step 2: Run migrations
    console.log("📦 Step 2: Running migrations...");
    const migrationsFolder = path.resolve(__dirname, "../migrations");

    if (!fs.existsSync(migrationsFolder)) {
      console.error("❌ Migrations folder not found!");
      console.error("   Run 'pnpm db:generate' to create migrations first.");
      process.exit(1);
    }

    await migrate(db, { migrationsFolder });
    console.log("✅ Migrations complete\n");

    // Step 3: Seed database
    console.log("🌱 Step 3: Seeding database...");
    console.log("   (This will be handled by seed.ts)\n");

    console.log("✅ Database reset complete!");
    console.log("\n💡 Next steps:");
    console.log("   Run: pnpm db:seed");
    console.log("   This will populate your database with sample data.");
  } catch (error) {
    console.error("\n❌ Reset failed:", error);
    throw error;
  }
}

/**
 * Drop all tables in the database
 */
async function dropAllTables(db: any) {
  try {
    // Get all table names
    const tables = await db.all(sql`
      SELECT name FROM sqlite_master
      WHERE type='table'
      AND name NOT LIKE 'sqlite_%'
      AND name NOT LIKE '_cf_%'
      AND name NOT LIKE '__drizzle%'
    `);

    if (tables.length === 0) {
      console.log("   No tables to drop");
      return;
    }

    console.log(`   Found ${tables.length} table(s) to drop`);

    // Disable foreign key constraints temporarily
    await db.run(sql`PRAGMA foreign_keys = OFF`);

    // Drop each table
    for (const table of tables) {
      const tableName = table.name;
      console.log(`   Dropping table: ${tableName}`);
      await db.run(sql.raw(`DROP TABLE IF EXISTS "${tableName}"`));
    }

    // Re-enable foreign key constraints
    await db.run(sql`PRAGMA foreign_keys = ON`);

    console.log(`   Dropped ${tables.length} table(s)`);
  } catch (error) {
    console.error("   Error dropping tables:", error);
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

  console.log(`📁 Database: ${pathToDb}\n`);

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

// Run reset
main()
  .then(() => {
    console.log("\n✨ Reset complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Reset failed:", error);
    process.exit(1);
  });
