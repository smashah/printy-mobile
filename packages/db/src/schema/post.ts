import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import * as auth from "../generated/auth";
import { timestampFields, uuidPrimaryKey } from "./utils";

/**
 * Posts table for storing user-generated posts
 * Core content entity for the application
 */
export const posts = sqliteTable("posts", {
  id: uuidPrimaryKey(),
  
  // Author reference
  userId: text()
    .references(() => auth.user.id, { onDelete: "cascade" })
    .notNull(),
  
  // Post content
  title: text().notNull(),
  content: text().notNull(),
  
  // Engagement metrics
  likesCount: integer().notNull().default(0),
  repliesCount: integer().notNull().default(0),
  viewsCount: integer().notNull().default(0),
  
  // Post visibility
  isPublished: integer({ mode: "boolean" }).notNull().default(true),
  
  // Metadata
  ...timestampFields,
});

// Type exports
export type NewPost = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;

