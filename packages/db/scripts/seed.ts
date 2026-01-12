#!/usr/bin/env tsx
/**
 * Database Seed Script
 *
 * Populates the database with sample data for development and testing.
 * Can be run against local or production databases.
 *
 * Usage:
 *   pnpm db:seed              # Seed local development database
 *   ENVIRONMENT=production pnpm db:seed  # Seed production database
 *
 * Note: Production seeding requires .prod.vars file with:
 *   - CLOUDFLARE_D1_TOKEN
 *   - CLOUDFLARE_ACCOUNT_ID
 *   - CLOUDFLARE_DATABASE_ID
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import * as schema from "../src/schema";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import {
  type AsyncBatchRemoteCallback,
  type AsyncRemoteCallback,
  drizzle as drizzleSqLiteProxy,
  type SqliteRemoteDatabase,
} from "drizzle-orm/sqlite-proxy";
import { eq } from "drizzle-orm";

// biome-ignore lint/suspicious/noExplicitAny: Database results typing
type Any = any;

// Configuration
const SEED_CONFIG = {
  users: {
    count: 10,
    admin: {
      email: "admin@example.com",
      name: "Admin User",
    },
    test: {
      email: "test@example.com",
      name: "Test User",
    },
  },
  posts: {
    count: 20,
    minPerUser: 1,
    maxPerUser: 5,
  },
  replies: {
    count: 50,
    minPerPost: 0,
    maxPerPost: 10,
    nestedProbability: 0.3, // 30% chance of being a nested reply
  },
};

// Sample data generators
const SAMPLE_TITLES = [
  "Getting Started with Cloudflare Workers",
  "Building a Modern Web App",
  "The Future of Edge Computing",
  "Best Practices for API Design",
  "Understanding Database Migrations",
  "Performance Optimization Tips",
  "Scaling Your Application",
  "Security Best Practices",
  "Testing Strategies for Production",
  "Debugging Like a Pro",
  "Code Review Guidelines",
  "Continuous Integration Setup",
  "Deployment Automation",
  "Monitoring and Observability",
  "Error Handling Patterns",
  "Authentication and Authorization",
  "Building RESTful APIs",
  "GraphQL vs REST",
  "Microservices Architecture",
  "Serverless Computing Guide",
];

const SAMPLE_CONTENT = [
  "This is a comprehensive guide covering all the essential concepts you need to know.",
  "In this post, I'll share my learnings and best practices from real-world experience.",
  "Let's dive deep into the technical details and explore different approaches.",
  "Here are some practical tips that have helped me improve my workflow significantly.",
  "This tutorial will walk you through the entire process step by step.",
  "I've compiled a list of resources and tools that you might find useful.",
  "After working on this for months, here are my key takeaways and recommendations.",
  "This approach has saved me countless hours and I hope it helps you too.",
  "Let me break down this complex topic into easy-to-understand concepts.",
  "Here's what I wish I knew when I first started learning about this.",
];

const SAMPLE_REPLIES = [
  "Great post! Thanks for sharing this.",
  "This is exactly what I was looking for. Very helpful!",
  "Interesting perspective. I never thought about it that way.",
  "Could you elaborate more on this point?",
  "I disagree with some of your conclusions, but overall great analysis.",
  "This saved me so much time. Thank you!",
  "Have you considered the alternative approach?",
  "Excellent write-up. Looking forward to more content like this.",
  "I tried this and it worked perfectly. Much appreciated!",
  "This is now my go-to resource for this topic.",
];

/**
 * Main seed function
 */
async function main() {
  const isProd = process.env.ENVIRONMENT === "production";
  const db = isProd ? await getProductionDatabase() : getLocalD1Db();

  if (isProd) {
    console.warn("⚠️  Seeding production database");
    console.warn("⚠️  This will add sample data to your production database!");
    console.warn("⚠️  Press Ctrl+C within 5 seconds to cancel...\n");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log("🌱 Starting database seed...\n");

  try {
    // Check if already seeded
    const existingUsers = await db.select().from(schema.user);
    if (existingUsers.length > 0) {
      console.log("⚠️  Database already contains users.");
      console.log("   Run 'pnpm db:reset' to clear and re-seed.\n");
      return;
    }

    // Seed users (uses Better Auth user table)
    console.log("👥 Seeding users...");
    const users = await seedUsers(db);
    console.log(`✅ Created ${users.length} users\n`);

    // Seed posts
    console.log("📝 Seeding posts...");
    const posts = await seedPosts(db, users);
    console.log(`✅ Created ${posts.length} posts\n`);

    // Seed replies
    console.log("💬 Seeding replies...");
    const replies = await seedReplies(db, posts, users);
    console.log(`✅ Created ${replies.length} replies\n`);

    console.log("🎉 Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Users: ${users.length}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Replies: ${replies.length}`);
    console.log("\n🔐 Test Accounts:");
    console.log(`   Admin: ${SEED_CONFIG.users.admin.email}`);
    console.log(`   Test:  ${SEED_CONFIG.users.test.email}`);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    throw error;
  }
}

/**
 * Seed users using Better Auth user table
 */
async function seedUsers(db: Any) {
  const users = [];

  // Create admin user
  const adminUser = await db
    .insert(schema.user)
    .values({
      email: SEED_CONFIG.users.admin.email,
      name: SEED_CONFIG.users.admin.name,
      emailVerified: true,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
    })
    .returning();
  users.push(adminUser[0]);

  // Create test user
  const testUser = await db
    .insert(schema.user)
    .values({
      email: SEED_CONFIG.users.test.email,
      name: SEED_CONFIG.users.test.name,
      emailVerified: true,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=test`,
    })
    .returning();
  users.push(testUser[0]);

  // Create additional random users
  for (let i = 3; i <= SEED_CONFIG.users.count; i++) {
    const randomUser = await db
      .insert(schema.user)
      .values({
        email: `user${i}@example.com`,
        name: `User ${i}`,
        emailVerified: Math.random() > 0.3,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
      })
      .returning();
    users.push(randomUser[0]);
  }

  return users;
}

/**
 * Seed posts
 */
async function seedPosts(db: Any, users: Any[]) {
  const posts = [];

  for (let i = 0; i < SEED_CONFIG.posts.count; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomTitle =
      SAMPLE_TITLES[Math.floor(Math.random() * SAMPLE_TITLES.length)];
    const randomContent =
      SAMPLE_CONTENT[Math.floor(Math.random() * SAMPLE_CONTENT.length)];

    const post = await db
      .insert(schema.posts)
      .values({
        userId: randomUser.id,
        title: `${randomTitle} ${i + 1}`,
        content: randomContent,
        isPublished: Math.random() > 0.1, // 90% published
        likesCount: Math.floor(Math.random() * 100),
        viewsCount: Math.floor(Math.random() * 1000),
        repliesCount: 0, // Will be updated later
      })
      .returning();

    posts.push(post[0]);
  }

  return posts;
}

/**
 * Seed replies (including nested replies)
 */
async function seedReplies(db: Any, posts: Any[], users: Any[]) {
  const replies = [];

  for (let i = 0; i < SEED_CONFIG.replies.count; i++) {
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomContent =
      SAMPLE_REPLIES[Math.floor(Math.random() * SAMPLE_REPLIES.length)];

    // Decide if this should be a nested reply
    const isNested =
      replies.length > 0 &&
      Math.random() < SEED_CONFIG.replies.nestedProbability;
    const parentReply = isNested
      ? replies[Math.floor(Math.random() * replies.length)]
      : null;

    const reply = await db
      .insert(schema.replies)
      .values({
        postId: randomPost.id,
        userId: randomUser.id,
        content: randomContent,
        parentReplyId: parentReply?.id || null,
        likesCount: Math.floor(Math.random() * 50),
      })
      .returning();

    replies.push(reply[0]);

    // Update post reply count
    await db
      .update(schema.posts)
      .set({
        repliesCount: randomPost.repliesCount + 1,
      })
      .where(eq(schema.posts.id, randomPost.id));
  }

  return replies;
}

/**
 * Get local D1 database connection
 */
function getLocalD1Db() {
  const pathToDb = getLocalD1dbPath();
  if (!pathToDb) {
    console.error(
      "❌ Local D1 database not found. Try running `pnpm run db:touch` to create one.",
    );
    process.exit(1);
  }

  const client = createClient({
    url: `file:${pathToDb}`,
  });

  return drizzle(client, {
    casing: "snake_case",
    schema,
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
async function getProductionDatabase(): Promise<
  SqliteRemoteDatabase<Record<string, never>>
> {
  config({ path: "../../apps/api/.prod.vars" });

  const apiToken = process.env.CLOUDFLARE_D1_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;

  if (!(apiToken && accountId && databaseId)) {
    console.error(
      "❌ Database seed failed: production environment variables not set",
    );
    console.error("   Make sure you have a .prod.vars file in apps/api/");
    process.exit(1);
  }

  return createProductionD1Connection(accountId, databaseId, apiToken);
}

/**
 * Create production D1 connection
 */
function createProductionD1Connection(
  accountId: string,
  databaseId: string,
  apiToken: string,
) {
  async function executeCloudflareD1Query(
    accountId: string,
    databaseId: string,
    apiToken: string,
    sql: string,
    params: Any[],
    method: string,
  ): Promise<{ rows: Any[][] }> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params, method }),
    });

    const data: Any = await res.json();

    if (res.status !== 200) {
      throw new Error(
        `Error from sqlite proxy server: ${res.status} ${res.statusText}\n${JSON.stringify(data)}`,
      );
    }

    if (data.errors.length > 0 || !data.success) {
      throw new Error(
        `Error from sqlite proxy server: \n${JSON.stringify(data)}`,
      );
    }

    const qResult = data?.result?.[0];
    if (!qResult?.success) {
      throw new Error(
        `Error from sqlite proxy server: \n${JSON.stringify(data)}`,
      );
    }

    return { rows: qResult.results.map((r: Any) => Object.values(r)) };
  }

  const queryClient: AsyncRemoteCallback = async (sql, params, method) =>
    executeCloudflareD1Query(
      accountId,
      databaseId,
      apiToken,
      sql,
      params,
      method,
    );

  const batchQueryClient: AsyncBatchRemoteCallback = async (queries) => {
    const results: { rows: Any[][] }[] = [];
    for (const query of queries) {
      const { sql, params, method } = query;
      const result = await executeCloudflareD1Query(
        accountId,
        databaseId,
        apiToken,
        sql,
        params,
        method,
      );
      results.push(result);
    }
    return results;
  };

  return drizzleSqLiteProxy(queryClient, batchQueryClient, {
    casing: "snake_case",
    schema,
  });
}

// Run the seed
main()
  .then(() => {
    console.log("\n✨ Seed complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  });
