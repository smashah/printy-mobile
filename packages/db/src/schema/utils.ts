import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

/**
 * Utility for consistent timestamp handling across tables
 */
export const currentTimestamp = () => sql`(CURRENT_TIMESTAMP)`;

/**
 * Standard timestamp fields for all entities
 * Provides consistent created/updated tracking
 */
export const timestampFields = {
  createdAt: text("created_at").notNull().default(currentTimestamp()),
  updatedAt: text("updated_at").notNull().default(currentTimestamp()),
};

/**
 * Standard UUID primary key field
 */
export const uuidPrimaryKey = () => 
  text().primaryKey().$defaultFn(() => crypto.randomUUID());

/**
 * Helper for foreign key references with UUID
 */
export const uuidForeignKey = (tableName: string, columnName: string = "id") => 
  text().references(() => tableName[columnName] as any);

/**
 * Standard metadata JSON field for extensibility
 */
export const metadataField = () => 
  text("metadata", { mode: "json" })
    .$type<Record<string, any>>()
    .notNull()
    .default({});

/**
 * Optional soft delete field
 * Add to tables that need soft delete functionality
 * Use with withSoftDelete() query helper to filter out deleted records
 */
export const softDeleteField = () => 
  text("deleted_at");