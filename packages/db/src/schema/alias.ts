import * as schemas from "./index";

// Table aliases with 't' prefix for cleaner queries
// Usage: import { tUsers, tSessions } from "@printy-mobile/db/schema/alias"
export const tUsers = schemas.user;
export const tSessions = schemas.session;
export const tAccounts = schemas.account;
export const tVerifications = schemas.verification;
export const tOrganizations = schemas.organization;
export const tMembers = schemas.member;
export const tInvitations = schemas.invitation;
export const tApiKeys = schemas.apikey;

export const tPosts = schemas.posts;
export const tReplies = schemas.replies;
