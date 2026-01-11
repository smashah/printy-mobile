import type { post, reply } from "../db/feed";

export type Post = typeof post.$inferSelect;
export type Reply = typeof reply.$inferSelect;

export type NewPost = typeof post.$inferInsert;
export type NewReply = typeof reply.$inferInsert;
