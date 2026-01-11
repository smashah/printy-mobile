---
description: Analyze commit history and create a retrospective document capturing learnings for template repo absorption.
---

# Template Repo Retrospective Command

Analyze the project's commit history to identify patterns, implementations, and learnings that should be transferred back to the template repository.

## User Input

$ARGUMENTS

If arguments provided, parse as:

- `--commits N` or `-c N`: Number of commits to analyze (default: 96)
- `--output FILE` or `-o FILE`: Output file path (default: `notes/template-repo-retro.md`)
- `--append` or `-a`: Append to existing file instead of overwriting

## Execution Steps

### Phase 1: Setup & Context Gathering

1. **Check for existing learnings documentation:**

   ```bash
   # Look for existing patterns
   ls notes/learnings.md notes/template-repo-retro.md 2>/dev/null
   ```

2. **Get commit count and history:**

   ```bash
   # Get commit summary
   git log --oneline -${COMMITS:-96}

   # Count total available
   git log --oneline | wc -l
   ```

3. **Read existing patterns (if any):**
   - `notes/learnings.md` - Existing project patterns
   - `notes/template-repo-retro.md` - Previous retrospective

### Phase 2: Commit Analysis

For each batch of 10 commits (oldest to newest), analyze:

1. **Get commit details:**

   ```bash
   git show COMMIT_HASH --stat --name-only
   ```

2. **For significant commits, get diff:**

   ```bash
   git show COMMIT_HASH -p -- "relevant/files/*"
   ```

3. **Categorize changes into:**
   - **Infrastructure**: Monorepo, CI/CD, dependency management
   - **Database/Schema**: Migrations, schema patterns
   - **Authentication**: Better-auth, sessions, API keys
   - **Payments**: Polar.sh, Stripe, billing
   - **Frontend**: TanStack Router, React Query, components
   - **API**: Hono, middleware, routes
   - **Deployment**: Cloudflare, Sentry, monitoring
   - **Developer Experience**: AI rules, commands, tooling

4. **Track evolution:**
   - What was added then later removed? (e.g., custom schemas → better-auth)
   - What patterns were refined over time?
   - What mistakes were made and corrected?

### Phase 3: Document Structure

Create/update the retrospective document with this structure:

````markdown
# Template Repo Retrospective

A comprehensive analysis of learnings from [PROJECT_NAME] that should be absorbed
back into the template repository. Based on analysis of [N] commits.

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

[Generate based on categories found]

---

## Analysis Progress

- [ ] Commits 1-10 (Description)
- [ ] Commits 11-20 (Description)
      [Continue for all batches]

---

## 1. [Category Name]

### 1.1 [Specific Pattern/Feature]

**Context:** [Why this matters]

**Commit Reference:** `abc1234`, `def5678`

**Anti-Pattern (if applicable):**

```typescript
// ❌ BAD: [Description]
[Code that was removed/changed]
```
````

**Pattern:**

```typescript
// ✅ GOOD: [Description]
[Code to include in template]
```

**Template Action:**

- [ ] [Specific action to take]
- [ ] [Files to add/modify]
- [ ] [Documentation to update]

---

[Continue for all patterns]

---

## Quick Reference: Anti-Patterns

| Anti-Pattern | Why It's Bad | Do This Instead |
| ------------ | ------------ | --------------- |
| [Pattern]    | [Reason]     | [Solution]      |

---

## Template Implementation Checklist

### Phase 1: [Category]

- [ ] [Action item]
- [ ] [Action item]

[Continue for all phases]

---

_Last Updated: [DATE]_
_Based on analysis of [N] commits from [PROJECT_NAME]_

````

### Phase 4: Key Areas to Analyze

When examining commits, pay special attention to:

#### Authentication & Authorization
- Better-auth configuration
- Session handling
- API key management
- OAuth callbacks
- SSR cookie forwarding

#### Payment Integration
- Payment provider setup (Polar, Stripe, etc.)
- Middleware order for payments
- Dynamic product IDs
- Subscription guards
- Credit/usage tracking

#### API Middleware
- Middleware chain order (CRITICAL)
- Database provider
- Auth middleware
- Payment middleware
- CORS configuration

#### Frontend Patterns
- TanStack Router loaders vs useEffect
- beforeLoad guards
- SSR cookie forwarding in clients
- Mutation patterns with MutationWrapper
- Component organization (-components/)

#### Infrastructure
- pnpm catalog for dependencies
- .pnpmfile.cjs for heavy deps
- wrangler.toml configuration
- Environment-specific configs

### Phase 5: Evolution Tracking

Document the evolution of key systems:

```markdown
### [Feature] Evolution

| Commit | Change | Reason |
|--------|--------|--------|
| abc123 | Added custom user schema | Initial implementation |
| def456 | Removed custom schema | Switched to better-auth generated |
| ghi789 | Added Polar plugin | Payment integration |

**Final State:** [Description of current implementation]
**Template Should Include:** [What the template needs]
````

### Phase 6: Incremental Updates

After analyzing each batch of commits:

1. **Update the document immediately** (don't wait until the end)
2. **Mark progress** in the Analysis Progress section
3. **Cross-reference** with earlier findings (patterns may evolve)
4. **Update anti-patterns** when you find a better solution was discovered later

### Phase 7: Template Action Items

At the end, consolidate all Template Actions into a prioritized checklist:

```markdown
## Template Implementation Checklist

### Phase 1: Core Infrastructure (Must Have)

- [ ] pnpm workspace catalog with version pinning
- [ ] .pnpmfile.cjs for CI optimization
- [ ] GitHub workflows (deploy-production, deploy-staging, deploy-pr-previews)

### Phase 2: Database & Auth (Must Have)

- [ ] better-auth package with defaults.ts
- [ ] Schema structure (auth-schema + project tables)
- [ ] Auth middleware with dual auth (session + API key)

### Phase 3: Payment Integration (Optional)

- [ ] Polar plugin configuration
- [ ] Payment middleware (credits system)
- [ ] Products endpoint for dynamic IDs
- [ ] Onboarding page template

### Phase 4: Frontend (Must Have)

- [ ] SSR cookie forwarding in api.ts and auth.ts
- [ ] MutationWrapper helper
- [ ] Protected route layouts
- [ ] Auth flow components

[Continue...]
```

## Output Requirements

1. **Create/update** the retrospective document at the specified path
2. **Include code examples** for all patterns (copy from actual commits)
3. **Reference specific commits** for traceability
4. **Mark analysis progress** after each batch
5. **Provide actionable Template Actions** for each section

## Example Usage

```
/template-retro
/template-retro --commits 50
/template-retro --commits 100 --output notes/retro-v2.md
/template-retro --append
```

## Notes

- Analyze commits **oldest to newest** to understand evolution
- Pay attention to **removed code** - it often indicates lessons learned
- Look for **middleware order changes** - they're always significant
- Track **dependency changes** in pnpm-workspace.yaml
- Note **environment variable additions** - they indicate configuration patterns
