import { type AnySQLiteColumn, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import * as auth from "../generated/auth";
import { timestampFields, uuidPrimaryKey } from "./utils";
import { posts } from "./post";

/**
 * Replies table for storing comments/replies to posts
 * Supports nested replies via parentReplyId
 */
export const replies = sqliteTable("replies", {
  id: uuidPrimaryKey(),
  
  // Post reference
  postId: text()
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  
  // Author reference
  userId: text()
    .references(() => auth.user.id, { onDelete: "cascade" })
    .notNull(),
  
  // Optional parent reply for nested/threaded replies
  parentReplyId: text().references((): AnySQLiteColumn => replies.id, {
    onDelete: "cascade",
  }),
  
  // Reply content
  content: text().notNull(),
  
  // Engagement metrics
  likesCount: integer().notNull().default(0),
  
  // Metadata
  ...timestampFields,
});

// Type exports
export type NewReply = typeof replies.$inferInsert;
export type Reply = typeof replies.$inferSelect;

