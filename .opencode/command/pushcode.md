---
description: Intelligently split uncommitted changes into grouped commits with gitmoji + conventional commit messages, then push
---

# /pushcode - Smart Commit Grouping and Push

Analyze all uncommitted changes (staged and unstaged), logically group them into atomic commits with proper gitmoji-prefixed conventional commit messages, then push to remote.

## Workflow

### Phase 1: Analyze Changes

1. **Get the full picture**:
   ```bash
   git status --porcelain
   git diff --stat
   git diff --cached --stat
   ```

2. **Identify change categories** by analyzing:
   - Which packages/apps are affected (`apps/api`, `packages/db`, etc.)
   - Type of change (feature, fix, refactor, docs, test, chore, etc.)
   - Logical groupings (related files that should be committed together)

### Phase 2: Group Changes Logically

Group changes based on these principles (in priority order):

1. **By Feature/Task**: Files that implement the same feature together
2. **By Package/App**: Changes within the same monorepo package
3. **By Change Type**: Similar change types across packages (e.g., all dependency updates)
4. **By File Type**: Configuration files, schema changes, etc.

**Grouping Heuristics**:
- Schema changes (`packages/db/src/schema/*`) + migrations = one commit
- API route + its tests = one commit
- Multiple files in same feature directory = one commit
- Config file updates (`.json`, `.toml`, `.yaml`) = group by purpose
- Documentation updates = separate commit
- Dependency changes (`package.json`, `pnpm-lock.yaml`) = separate commit

### Phase 3: Create Commits

For EACH logical group:

1. **Stage the files**:
   ```bash
   git add <file1> <file2> ...
   ```

2. **Craft the commit message** using:
   - **Gitmoji prefix** (unicode format for better visibility)
   - **Conventional Commit type** with optional scope
   - **Concise description** (imperative mood, max 72 chars)

   Format: `<gitmoji> <type>(<scope>): <description>`

3. **Commit**:
   ```bash
   git commit -m "<message>"
   ```

### Phase 4: Push

After all commits are created:
```bash
git push
```

If the branch has no upstream:
```bash
git push -u origin <branch-name>
```

---

## Commit Message Format

```
<gitmoji> <type>(<scope>): <description>

[optional body]

[optional footer]
```

### Examples:
- `✨ feat(api): add user authentication endpoints`
- `🐛 fix(webapp): resolve login redirect loop`
- `♻️ refactor(db): normalize user schema relations`
- `📝 docs: update API documentation`
- `⬆️ chore(deps): upgrade TanStack Query to v5.62`
- `🗃️ feat(db): add posts table with privacy levels`
- `✅ test(api): add auth middleware tests`

---

## Gitmoji Reference

| Emoji | Type | Description | Use When |
|-------|------|-------------|----------|
| ✨ | feat | Introduce new features | New package, new API endpoint, new component |
| 🐛 | fix | Fix a bug | Bug fixes |
| 🚑️ | fix | Critical hotfix | Production emergencies |
| ♻️ | refactor | Refactor code | Code restructuring without behavior change |
| 📝 | docs | Documentation | README, comments, API docs |
| 🎨 | style | Improve structure/format | Code formatting, linting fixes |
| ⚡️ | perf | Improve performance | Optimization |
| ✅ | test | Add/update tests | Test files |
| 🔧 | chore | Configuration files | Config changes |
| 🔨 | chore | Development scripts | Build scripts, tooling |
| ⬆️ | chore | Upgrade dependencies | Dependency updates |
| ⬇️ | chore | Downgrade dependencies | Dependency downgrades |
| ➕ | chore | Add dependency | New package |
| ➖ | chore | Remove dependency | Removed package |
| 🗃️ | feat/fix | Database changes | Schema, migrations, seeds |
| 💄 | style | UI/style changes | CSS, design tokens |
| 🏗️ | refactor | Architectural changes | Major structural changes |
| 🔥 | chore | Remove code/files | Deletions |
| 🚚 | refactor | Move/rename files | File reorganization |
| 🏷️ | feat | Add/update types | TypeScript types |
| 🔒️ | fix | Security fixes | Security patches |
| 👷 | chore | CI changes | GitHub Actions, pipelines |
| 💚 | fix | Fix CI | CI/CD fixes |
| 🚨 | style | Fix warnings | Linter/compiler warnings |
| 🩹 | fix | Simple fix | Minor non-critical fixes |
| 🧱 | chore | Infrastructure | Infra changes |
| 🌐 | feat | i18n/l10n | Internationalization |
| 💡 | docs | Comments | Source code comments |
| 🙈 | chore | Gitignore | .gitignore updates |
| 🔖 | chore | Release/version | Version tags |

### Gitmoji Selection Priority:
1. Use the most specific emoji that matches the change
2. **Avoid ✨ (sparkles)** unless truly introducing a new feature/package
3. For database changes, prefer 🗃️
4. For type-only changes, prefer 🏷️
5. For mixed changes, use the primary purpose

---

## Grouping Decision Tree

```
Is this a single cohesive change?
├── YES → Single commit
└── NO → Continue analysis
    │
    ├── Are changes in different packages?
    │   ├── YES → Likely separate commits per package
    │   └── NO → Check if same feature
    │
    ├── Are changes for the same feature?
    │   ├── YES → Single commit (even across packages)
    │   └── NO → Separate commits
    │
    ├── Are these just config/dependency updates?
    │   ├── YES → Group all config updates together
    │   └── NO → Continue
    │
    └── Are these unrelated fixes?
        ├── YES → Separate commit per fix
        └── NO → Use judgment
```

---

## Safety Rules

1. **Never commit**:
   - `.env` files or secrets
   - `node_modules/`
   - Build artifacts (unless intentional)
   - Lock files alone (include with corresponding package.json changes)

2. **Always verify**:
   - Run `git status` after each commit to confirm
   - Check that no sensitive files are staged

3. **Handle conflicts**:
   - If push fails due to conflicts, stop and inform user
   - Do NOT force push unless explicitly requested

4. **Branch awareness**:
   - Check current branch before pushing
   - Warn if pushing to main/master directly

---

## Example Session

Given these uncommitted changes:
```
M  apps/api/src/routes/users.ts
M  apps/api/src/routes/auth.ts
A  packages/db/src/schema/sessions.ts
M  packages/db/src/schema/index.ts
M  packages/db/drizzle.config.ts
A  apps/webapp/src/routes/login.tsx
M  apps/webapp/src/routes/index.tsx
M  package.json
M  pnpm-lock.yaml
```

**Grouping Analysis**:
1. **Database schema changes**: `sessions.ts`, `schema/index.ts` → 🗃️ feat(db)
2. **API auth changes**: `users.ts`, `auth.ts` → ✨ feat(api) or 🐛 fix(api)
3. **Frontend login**: `login.tsx`, `index.tsx` → ✨ feat(webapp)
4. **Dependencies**: `package.json`, `pnpm-lock.yaml` → ⬆️ chore(deps) or ➕ chore(deps)

**Resulting Commits**:
```bash
git add packages/db/src/schema/sessions.ts packages/db/src/schema/index.ts
git commit -m "🗃️ feat(db): add sessions table for auth persistence"

git add apps/api/src/routes/users.ts apps/api/src/routes/auth.ts
git commit -m "✨ feat(api): add user authentication endpoints"

git add apps/webapp/src/routes/login.tsx apps/webapp/src/routes/index.tsx
git commit -m "✨ feat(webapp): add login page with redirect handling"

git add package.json pnpm-lock.yaml
git commit -m "➕ chore(deps): add session management dependencies"

git push
```

---

## Execution Checklist

- [ ] Run `git status` to see all changes
- [ ] Run `git diff --stat` to understand scope
- [ ] Identify logical groupings
- [ ] For each group:
  - [ ] Stage relevant files
  - [ ] Craft gitmoji + conventional commit message
  - [ ] Commit
  - [ ] Verify with `git status`
- [ ] Push to remote
- [ ] Report summary to user
