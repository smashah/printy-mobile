import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

const currentTimestamp = () => sql`(CURRENT_TIMESTAMP)`;

export const post = sqliteTable(
  "post",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    body: text("body").notNull(),
    createdAt: text("created_at").notNull().default(currentTimestamp()),
    updatedAt: text("updated_at").notNull().default(currentTimestamp()),
    isAdmin: integer("is_admin", { mode: "boolean" }).default(false).notNull(),
    username: text("username").references(() => user.username, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("post_body_idx").on(table.body),
    index("post_username_idx").on(table.username),
  ],
);

// Reply schema
export const reply = sqliteTable("reply", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull().default(currentTimestamp()),
  postId: text("post_id")
    .notNull()
    .references(() => post.id, { onDelete: "cascade" }),
  username: text("username").references(() => user.username, {
    onDelete: "set null",
  }),
});
