/**
 * Usage Examples for Database Query Helpers
 *
 * These examples demonstrate how to use the query utilities
 * in your API routes for common database patterns.
 */

import { drizzle } from "drizzle-orm/d1";
import { eq, count, desc } from "drizzle-orm";
import * as schema from "../db/schema";
import {
  withPagination,
  withPagePagination,
  findOneOrThrow,
  findManyWithCount,
  getPaginationMeta,
  withOrderBy,
} from "./queries";

// Example 1: Simple pagination
export const getPaginatedPosts = async (
  db: ReturnType<typeof drizzle>,
  limit?: string,
  offset?: string,
) => {
  const { limit: limitNum, offset: offsetNum } = withPagination(limit, offset);

  const posts = await db
    .select()
    .from(schema.posts)
    .limit(limitNum)
    .offset(offsetNum);

  return posts;
};

// Example 2: Page-based pagination with count
export const getPostsPage = async (
  db: ReturnType<typeof drizzle>,
  page?: string,
  limit?: string,
) => {
  const pagination = withPagePagination(page, limit);

  const postsQuery = db
    .select()
    .from(schema.posts)
    .limit(pagination.limit)
    .offset(pagination.offset)
    .orderBy(desc(schema.posts.createdAt));

  const countQuery = db.select({ count: count() }).from(schema.posts);

  const { data, total } = await findManyWithCount(postsQuery, countQuery);

  return {
    posts: data,
    pagination: getPaginationMeta(total, pagination.page, pagination.limit),
  };
};

// Example 3: Find one post or throw error
export const getPostById = async (
  db: ReturnType<typeof drizzle>,
  postId: string,
) => {
  const post = await findOneOrThrow(
    db.select().from(schema.posts).where(eq(schema.posts.id, postId)),
    "Post not found",
  );

  return post;
};

// Example 4: Filtered query with pagination
export const getPublishedPosts = async (
  db: ReturnType<typeof drizzle>,
  userId: string,
  page?: string,
  limit?: string,
) => {
  const pagination = withPagePagination(page, limit);

  const postsQuery = db
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.userId, userId))
    .limit(pagination.limit)
    .offset(pagination.offset);

  const countQuery = db
    .select({ count: count() })
    .from(schema.posts)
    .where(eq(schema.posts.userId, userId));

  const { data, total } = await findManyWithCount(postsQuery, countQuery);

  return {
    posts: data,
    pagination: getPaginationMeta(total, pagination.page, pagination.limit),
  };
};

// Example 5: Using withOrderBy for safe sorting
export const getSortedPosts = async (
  db: ReturnType<typeof drizzle>,
  orderBy?: string,
) => {
  const allowedColumns = ["createdAt", "title", "likesCount"] as const;
  const { column, direction } = withOrderBy(
    orderBy,
    allowedColumns,
    "createdAt",
    "desc",
  );

  const posts = await db
    .select()
    .from(schema.posts)
    .orderBy(
      direction === "desc" ? desc(schema.posts[column]) : schema.posts[column],
    );

  return posts;
};

// Example 6: Complete API endpoint pattern
export const listPostsEndpoint = async (
  db: ReturnType<typeof drizzle>,
  params: {
    page?: string;
    limit?: string;
    orderBy?: string;
    userId?: string;
  },
) => {
  const pagination = withPagePagination(params.page, params.limit);
  const allowedColumns = ["createdAt", "title", "likesCount"] as const;
  const sort = withOrderBy(params.orderBy, allowedColumns);

  // Build base query
  let query = db.select().from(schema.posts);
  let countQuery = db.select({ count: count() }).from(schema.posts);

  // Add filters
  if (params.userId) {
    query = query.where(eq(schema.posts.userId, params.userId));
    countQuery = countQuery.where(eq(schema.posts.userId, params.userId));
  }

  // Add sorting and pagination
  query = query
    .orderBy(
      sort.direction === "desc"
        ? desc(schema.posts[sort.column])
        : schema.posts[sort.column],
    )
    .limit(pagination.limit)
    .offset(pagination.offset);

  const { data, total } = await findManyWithCount(query, countQuery);

  return {
    success: true,
    data,
    pagination: getPaginationMeta(total, pagination.page, pagination.limit),
  };
};

/* Example usage in Hono route:

app.get("/api/posts", async (c) => {
  const { page, limit, orderBy, userId } = c.req.query();
  const db = c.var.db;

  const result = await listPostsEndpoint(db, {
    page,
    limit,
    orderBy,
    userId,
  });

  return c.json(result);
});

app.get("/api/posts/:id", async (c) => {
  const { id } = c.req.param();
  const db = c.var.db;

  try {
    const post = await getPostById(db, id);
    return c.json({ success: true, data: post });
  } catch (error) {
    if ((error as any).statusCode === 404) {
      return c.json({ success: false, error: error.message }, 404);
    }
    throw error;
  }
});

*/
