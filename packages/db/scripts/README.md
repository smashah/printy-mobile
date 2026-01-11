# Database Scripts

Comprehensive database management scripts for development and production workflows.

## Overview

This directory contains scripts for managing your database lifecycle:

- **seed.ts** - Populate database with sample data
- **migrate.ts** - Apply pending migrations
- **reset.ts** - Drop all tables and start fresh

All scripts work with both local (D1) and production databases.

## Quick Start

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations to local database
pnpm db:migrate

# Seed with sample data
pnpm db:seed

# Reset database (drop + migrate + seed)
pnpm db:reset
```

## Available Scripts

### `pnpm db:generate`

Generates migration files from your Drizzle schema changes.

```bash
pnpm db:generate
```

**What it does:**
- Compares your schema files with the current database
- Creates SQL migration files in `packages/db/migrations/`
- Names migrations with timestamp prefixes

**When to use:**
- After modifying any schema files in `packages/db/src/schema/`
- Before applying changes to the database

**Output:**
- Creates new `.sql` files in `migrations/` folder
- Generates a `meta/` folder with migration metadata

---

### `pnpm db:migrate`

Applies all pending migrations to the database.

```bash
# Local development
pnpm db:migrate

# Production (requires .prod.vars)
ENVIRONMENT=production pnpm db:migrate
```

**What it does:**
- Checks for pending migrations in `migrations/` folder
- Executes SQL migration files in order
- Tracks applied migrations to prevent re-running

**When to use:**
- After generating new migrations
- When deploying to production
- After pulling changes that include new migrations

**Safety:**
- Production runs include a 5-second cancellation window
- Automatically handles migration ordering
- Idempotent - safe to run multiple times

---

### `pnpm db:seed`

Populates the database with sample data for development.

```bash
# Local development
pnpm db:seed

# Production (NOT RECOMMENDED)
ENVIRONMENT=production pnpm db:seed
```

**What it creates:**
- **Users**: 10 users including admin and test accounts
- **Posts**: 20 posts distributed across users
- **Replies**: 50 replies including nested/threaded replies

**Sample accounts:**
- Admin: `admin@example.com`
- Test: `test@example.com`
- Users: `user3@example.com` through `user10@example.com`

**Safety:**
- Checks if database is already seeded
- Skips if users already exist
- Production seeding includes 5-second cancellation window

**Customization:**
Edit `SEED_CONFIG` in `seed.ts` to adjust:
- Number of users, posts, replies
- Sample data templates
- Nested reply probability

---

### `pnpm db:reset`

Completely resets the local database to a clean state.

```bash
pnpm db:reset
```

**What it does:**
1. Drops all tables (except SQLite system tables)
2. Runs all migrations to recreate schema
3. Seeds database with fresh sample data

**⚠️  WARNING:**
- **Deletes ALL data** in your local database
- Production resets are blocked for safety
- Includes 5-second cancellation window

**When to use:**
- When you want a completely fresh database
- After making breaking schema changes
- When sample data gets messy during development

---

### `pnpm db:studio`

Opens Drizzle Studio for visual database management.

```bash
pnpm db:studio
```

**Features:**
- Browse all tables and data
- Run queries with autocomplete
- Edit data directly in the UI
- View relationships and foreign keys

**Access:**
- Opens at `http://localhost:3003`
- Works with local development database

---

### `pnpm db:push`

Pushes schema changes directly to database without migrations.

```bash
pnpm db:push
```

**What it does:**
- Directly applies schema changes to database
- Skips creating migration files
- Faster for rapid development

**When to use:**
- During early development/prototyping
- When you don't need migration history
- For quick schema experiments

**⚠️  Warning:**
- Does NOT create migration files
- Not recommended for production
- Can cause data loss on breaking changes

---

### `pnpm db:pull`

Pulls existing database schema into Drizzle schema files.

```bash
pnpm db:pull
```

**What it does:**
- Introspects your database
- Generates Drizzle schema from existing tables
- Creates TypeScript schema files

**When to use:**
- Importing an existing database
- Reverse-engineering a schema
- Syncing schema from production

---

## Production Workflows

### Setting Up Production Database

1. **Create .prod.vars file** in `apps/api/`:

```bash
# apps/api/.prod.vars
CLOUDFLARE_D1_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_DATABASE_ID=your-database-id
DATABASE_URL=libsql://your-db-url
```

2. **Generate migration** from your schema:

```bash
pnpm db:generate
```

3. **Test locally first**:

```bash
pnpm db:reset
# Test your application thoroughly
```

4. **Apply to production**:

```bash
ENVIRONMENT=production pnpm db:migrate
```

### Production Migration Checklist

- [ ] Test migrations locally with `pnpm db:reset`
- [ ] Backup production database
- [ ] Review generated SQL in `migrations/` folder
- [ ] Run migration during low-traffic window
- [ ] Verify migration success with `pnpm db:studio:prd`
- [ ] Test critical application flows
- [ ] Monitor for errors

### Rolling Back Migrations

Drizzle doesn't have built-in rollback. To revert:

**Option 1: Manual Rollback**
```bash
# Create a new migration that reverses changes
pnpm db:generate
```

**Option 2: Restore from Backup**
```bash
# Use Cloudflare D1 backup/restore
# Or restore from your database snapshot
```

---

## Common Workflows

### Adding a New Table

```bash
# 1. Create schema file
# packages/db/src/schema/myTable.ts

# 2. Export from index
# packages/db/src/schema/index.ts

# 3. Generate migration
pnpm db:generate

# 4. Apply locally
pnpm db:migrate

# 5. Test with fresh data
pnpm db:seed

# 6. Deploy to production
ENVIRONMENT=production pnpm db:migrate
```

### Modifying Existing Schema

```bash
# 1. Update schema file
# packages/db/src/schema/posts.ts

# 2. Generate migration
pnpm db:generate

# 3. Review generated SQL
# Check migrations/ folder

# 4. Test locally
pnpm db:reset

# 5. If safe, apply to production
ENVIRONMENT=production pnpm db:migrate
```

### Getting Fresh Sample Data

```bash
# Quick reset with new data
pnpm db:reset

# Or just new data (keeps existing)
pnpm db:seed
```

---

## Seed Data Configuration

Edit `scripts/seed.ts` to customize sample data:

```typescript
const SEED_CONFIG = {
  users: {
    count: 10,              // Total users to create
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
    count: 20,              // Total posts to create
    minPerUser: 1,
    maxPerUser: 5,
  },
  replies: {
    count: 50,              // Total replies to create
    minPerPost: 0,
    maxPerPost: 10,
    nestedProbability: 0.3, // 30% chance of nested reply
  },
};
```

### Adding Custom Seed Data

Extend the seed script with your own data:

```typescript
// In scripts/seed.ts

async function seedCustomData(db: Any, users: Any[]) {
  // Add your custom seeding logic
  const products = await db.insert(schema.products).values([
    { name: "Product 1", price: 9.99 },
    { name: "Product 2", price: 19.99 },
  ]).returning();

  return products;
}

// Call in main()
const customData = await seedCustomData(db, users);
```

---

## Troubleshooting

### "Local D1 database not found"

**Problem:** Can't find `.wrangler` database file

**Solutions:**
```bash
# Start dev server first to create database
cd apps/api
pnpm dev

# Or manually touch database
pnpm run db:touch
```

### "Migrations folder not found"

**Problem:** No migrations exist yet

**Solution:**
```bash
# Generate initial migration from schema
pnpm db:generate
```

### "Database already seeded"

**Problem:** Seed script detects existing data

**Solutions:**
```bash
# Option 1: Reset and seed fresh
pnpm db:reset

# Option 2: Manually clear data
pnpm db:studio
# Delete records in UI
```

### Production migration fails

**Problem:** Migration fails on production

**Solutions:**
1. Check `.prod.vars` configuration
2. Verify API token has correct permissions
3. Review migration SQL for syntax errors
4. Test migration locally first with `pnpm db:reset`

### Foreign key constraint errors

**Problem:** Can't seed due to foreign key violations

**Solution:**
```bash
# Reset database completely
pnpm db:reset

# Or check seed order in seed.ts
# Ensure parent records are created before children
```

---

## Best Practices

### Development

1. **Always generate migrations** instead of using `db:push` for production-bound changes
2. **Test migrations locally** with `pnpm db:reset` before production
3. **Keep migrations small** - one logical change per migration
4. **Review generated SQL** before applying to production

### Production

1. **Never reset production** - it's disabled for safety
2. **Always backup** before running migrations
3. **Test in staging** if possible
4. **Monitor after deployment** for errors or performance issues
5. **Document breaking changes** in migration files

### Schema Design

1. **Use foreign keys** for referential integrity
2. **Add indexes** for frequently queried columns
3. **Use soft deletes** for important data (add `deletedAt` field)
4. **Keep migrations reversible** when possible

---

## File Structure

```
packages/db/
├── scripts/
│   ├── seed.ts       # Sample data seeding
│   ├── migrate.ts    # Migration runner
│   ├── reset.ts      # Database reset
│   └── README.md     # This file
├── migrations/       # Generated SQL migrations
├── src/
│   └── schema/       # Drizzle schema files
└── package.json      # Script definitions
```

---

## Related Documentation

- **Drizzle ORM**: https://orm.drizzle.team/
- **Cloudflare D1**: https://developers.cloudflare.com/d1/
- **Schema Documentation**: `packages/db/src/schema/README.md`
- **Query Helpers**: `packages/db/src/utils/README.md`

---

## Support

If you encounter issues:

1. Check this README for solutions
2. Review Drizzle documentation
3. Inspect database with `pnpm db:studio`
4. Check migration SQL files in `migrations/` folder

---

**Happy migrating! 🚀**
