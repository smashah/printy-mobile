# Template Repo Retrospective

A comprehensive analysis of learnings from Printy Mobile that should be absorbed
back into the template repository. Based on analysis of 19 commits.

**Goal:** Ensure the next project hits the ground running without repeating foundational work.

---

## Document Structure

Each section includes:

- **Context:** Why this matters
- **Pattern/Implementation:** Code examples
- **Commit Reference:** Source commit(s)
- **Template Action:** What to add/change in template repo

---

## Table of Contents

- [Analysis Progress](#analysis-progress)
- [1. Infrastructure & Monorepo](#1-infrastructure--monorepo)
- [2. Database & Schema](#2-database--schema)
- [3. Mobile (Native)](#3-mobile-native)
- [4. API & Backend Patterns](#4-api--backend-patterns)
- [5. Capabilities & PDF Generation](#5-capabilities--pdf-generation)
- [Quick Reference: Anti-Patterns](#quick-reference-anti-patterns)
- [Template Implementation Checklist](#template-implementation-checklist)

---

## Analysis Progress

- [x] Commits 1-10 (Initial refactor to monorepo and core feature set)
- [x] Commits 11-19 (Shared packages, documentation, and refinement)

---

## 1. Infrastructure & Monorepo

### 1.1 Dedicated Port Mapping

**Context:** Running multiple services (API, Printer Service, Expo) in a monorepo often leads to port conflicts.

**Commit Reference:** `7e24248`

**Pattern:**

| App | Port | Notes |
|-----|------|-------|
| `apps/api` | 8930 | Main backend API |
| `apps/printer-api-service` | 8938 | PDF generation API |
| `apps/native` (Expo) | 8939 | Mobile dev server |

**Template Action:**
- [ ] Pre-configure unique ports in `package.json` and `wrangler.toml` for all template apps.
- [ ] Update `AGENTS.md` with a port registry table.

### 1.2 Wrangler Configuration Safety

**Context:** Placeholder values like `YOUR_DATABASE_ID` cause runtime failures and developer friction.

**Commit Reference:** `920de87`

**Anti-Pattern:**
```toml
# ❌ BAD: Placeholder remains
database_id = "YOUR_DATABASE_ID"
```

**Pattern:**
```toml
# ✅ GOOD: Actual ID or valid-looking dummy
database_id = "73fd0f92-7cd4-4052-9c72-5e3b9e46daf1"
```

**Template Action:**
- [ ] Provide valid-looking UUIDs for D1 databases in `wrangler.toml` by default.
- [ ] Add a `TODO` comment next to `account_id` and `database_id`.

---

## 2. Database & Schema

### 2.1 Modular Schema Design

**Context:** A monolithic `schema.ts` becomes unmanageable. Splitting by domain (auth, credits, subs) is cleaner.

**Commit Reference:** `5ad1a11`

**Pattern:**
```
packages/db/src/schema/
├── auth.ts
├── credits.ts
├── subscriptions.ts
└── webhooks.ts
```

**Template Action:**
- [ ] Refactor `packages/db` to use a modular directory structure for schema files.

### 2.2 Auth Schema Optimization

**Context:** Better-auth generated schemas can be verbose. Simplification improves performance and clarity.

**Commit Reference:** `920de87`

**Pattern:**
```typescript
// ✅ GOOD: Added indexes for performance
export const session = sqliteTable(
  "session",
  { ... },
  (table) => [index("session_userId_idx").on(table.userId)],
);
```

**Template Action:**
- [ ] Include performance indexes on `userId` in `account` and `session` tables in the template auth schema.

---

## 3. Mobile (Native)

### 3.1 NativeWind v4 Peer Dependencies

**Context:** NativeWind v4 fails silently without its required peer dependency `react-native-css-interop`.

**Commit Reference:** `7e24248`

**Pattern:**
```json
{
  "dependencies": {
    "nativewind": "^4.x",
    "react-native-css-interop": "^0.2.x"
  }
}
```

**Template Action:**
- [ ] Ensure `react-native-css-interop` is included in the native app's `package.json` in the template.

---

## 4. API & Backend Patterns

### 4.1 Dual Auth Middleware

**Context:** Supporting both browser sessions (Better-auth) and API keys requires a robust middleware strategy.

**Commit Reference:** `f65726d` (Implicit in PRD and route additions)

**Pattern:**
```typescript
// apps/api/src/middleware/auth.ts
// logic that checks for BOTH session and API key headers
```

**Template Action:**
- [ ] Implement a unified `auth` middleware that handles session-based and key-based authentication out of the box.

---

## 5. Capabilities & PDF Generation

### 5.1 Shared Capabilities Package

**Context:** PDF templates and service logic should be shared across API services and potentially local tools.

**Commit Reference:** `8d3b1a0`

**Pattern:**
- Create `packages/capabilities` for `@react-pdf/renderer` templates and dithering utilities.

**Template Action:**
- [ ] Add a `packages/capabilities` folder for complex shared business logic/templates.

---

## Quick Reference: Anti-Patterns

| Anti-Pattern | Why It's Bad | Do This Instead |
| ------------ | ------------ | --------------- |
| Port 8787 for all workers | Conflicts during `pnpm dev` | Assign unique ports (8930+) |
| `YOUR_DATABASE_ID` | Wrangler fails to start | Use real IDs or valid UUIDs |
| Business logic in Hono routes | Hard to test/reuse | Extract to `packages/capabilities` |
| Missing peer deps in native | Styles won't apply | Add `react-native-css-interop` |

---

## Template Implementation Checklist

### Phase 1: Core Infrastructure

- [ ] Unique port registry in root `package.json`
- [ ] Valid-looking dummy UUIDs in `wrangler.toml`
- [ ] Pnpm workspace catalog version pinning

### Phase 2: Database & Auth

- [ ] Modular Drizzle schema files
- [ ] Performance indexes for auth tables
- [ ] Better-auth dual-auth middleware

### Phase 3: Mobile

- [ ] NativeWind v4 boilerplate with interop
- [ ] Custom Metro resolver for pnpm symlinks

---

_Last Updated: 2026-01-12_
_Based on analysis of 19 commits from Printy Mobile_
