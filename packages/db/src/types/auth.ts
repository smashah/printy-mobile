import type { user } from "../db/auth";

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
