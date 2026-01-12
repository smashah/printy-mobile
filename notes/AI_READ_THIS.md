# AI Development Guidelines: Lessons from Making Code Runnable

> 📚 **[Complete Documentation Index](../DOCS_INDEX.md)** | 🎯 **[Critical Rules](../.cursor/commands/critical-rules.md)** | 🚀 **[Quick Start](../.cursor/commands/quick-start.md)**

This document outlines critical lessons learned from fixing AI-generated code to make it production-ready. These are real issues that prevented the codebase from running and required manual fixes.

---

## 🚨 CRITICAL ISSUES TO AVOID

### 1. **NEVER Create Duplicate Directory Structures**

**Problem:** AI created files in `srcsrc/` paths instead of `src/`

- `apps/api/srcsrc/routes/` (WRONG)
- `apps/webapp/srcsrc/routes/` (WRONG)

**Impact:** Files were completely inaccessible, routes didn't load, build failed

**Lesson:**

- Always verify the existing directory structure before creating files
- Use absolute paths or verify relative paths carefully
- If you see `srcsrc`, you've made a critical error
- Check the working directory and existing folder structure first

**How to Avoid:**

```bash
# ALWAYS do this first:
ls -la apps/api/src/routes/  # Check what exists
pwd                           # Verify current location
```

---

### 2. **Import Paths Must Match Package Structure**

**Problem:** Inconsistent import paths for UI components across the codebase

**Wrong Patterns Found:**

```typescript
// ❌ TOO SPECIFIC - breaks barrel exports
import { Button } from "@onboarding-chat/ui/src/components/ui/button";

// ❌ WRONG ALIAS - not configured
import { Button } from "@/components/ui/button";
```

**Correct Pattern:**

```typescript
// ✅ CORRECT - uses barrel exports from package
import { Button } from "@onboarding-chat/ui/button";
import { Card } from "@onboarding-chat/ui/card";
import { Input } from "@onboarding-chat/ui/input";
```

**Lesson:**

- Monorepo packages should export components at the package level
- Don't hardcode internal package structure in imports
- Use barrel exports (index.ts) for cleaner imports
- Be consistent across ALL files

**How to Fix:**

1. Check `packages/ui/package.json` for export paths
2. Use the shortest valid import path
3. Apply the same pattern everywhere

---

### 3. **Package.json Dependencies Must Use Workspace Catalog**

**Problem:** Hardcoded version numbers instead of using pnpm workspace catalog

**Wrong:**

```json
{
  "dependencies": {
    "zod": "4.1.11" // ❌ Hardcoded version
  }
}
```

**Correct:**

```json
{
  "dependencies": {
    "zod": "catalog:" // ✅ Uses workspace catalog
  }
}
```

**Lesson:**

- Monorepos often use centralized version management
- Check for `catalog:`, `workspace:*`, or similar patterns
- Look at other packages to understand the pattern
- Never assume standard versioning applies

---

### 4. **TypeScript Generic Type Constraints**

**Problem:** Overly restrictive type constraints caused validation to fail

**Wrong:**

```typescript
export const zodValidator = <
  Target extends keyof ValidationTargets,
  Schema extends z.AnyZodObject, // ❌ Too restrictive
>(
  target: Target,
  schema: Schema,
) => {
  // ...
};
```

**Correct:**

```typescript
export const zodValidator = <
  Target extends keyof ValidationTargets,
  Schema extends z.Schema, // ✅ Allows all Zod schemas
>(
  target: Target,
  schema: Schema,
) => {
  // ...
};
```

**Lesson:**

- `z.AnyZodObject` only accepts object schemas
- `z.Schema` accepts all schema types (strings, numbers, arrays, etc.)
- Use the most flexible type that maintains safety
- Test with different input types

---

### 5. **Type Bindings Must Match Runtime Environment**

**Problem:** Wrong database type binding for the runtime environment

**Wrong:**

```typescript
export type APIBindings = {
  Bindings: {
    DB: D1Database; // ❌ Raw D1 binding
    // ...
  };
};
```

**Correct:**

```typescript
export type APIBindings = {
  Bindings: {
    DB: DrizzleD1Database<typeof schema>; // ✅ Drizzle-wrapped type
    // ...
  };
};
```

**Lesson:**

- Check how the database is actually initialized in the codebase
- Type bindings must match the actual runtime objects
- Look for ORM/query builder wrappers (Drizzle, Prisma, etc.)
- The raw Cloudflare binding vs. the wrapped version matters

---

### 6. **Configuration File Imports**

**Problem:** Package name inconsistencies in configuration files

**Wrong:**

```javascript
// postcss.config.mjs
export { default } from "@printy-mobile/ui/postcss.config";

// tailwind.config.mjs
import config from "@printy-mobile/ui/tailwind.config";

// App.css
@source '../../node_modules/@printy-mobile/ui';
@import "@printy-mobile/ui/globals.css";
```

**Correct:**

```javascript
// postcss.config.mjs
export { default } from "@onboarding-chat/ui/postcss.config";

// tailwind.config.mjs
import config from "@onboarding-chat/ui/tailwind.config";

// App.css
@source '../../node_modules/@onboarding-chat/ui';
@import "@onboarding-chat/ui/globals.css";
```

**Lesson:**

- Package names must be consistent everywhere
- Check `package.json` `name` field for the actual package name
- Search and replace ALL occurrences when fixing
- Configuration files are just as important as code

---

### 7. **Don't Duplicate Vite Plugin Configuration**

**Problem:** Tailwind plugin configured twice with conflicting options

**Wrong:**

```typescript
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    tailwindcss({
      // ❌ Duplicate configuration
      content: ["./src/**/*.{js,jsx,ts,tsx}"],
    }),
  ],
});
```

**Correct:**

```typescript
export default defineConfig({
  plugins: [
    tailwindcss(), // ✅ Single configuration
    tanstackStart(),
    viteReact(),
  ],
});
```

**Lesson:**

- Vite plugins should only be registered once
- Check existing config before adding plugins
- Conflicts cause build failures
- Let plugins use their defaults unless you need customization

---

### 8. **TypeScript Ignore Comments**

**Problem:** Incorrect placement and syntax of TypeScript suppression comments

**Wrong:**

```typescript
//@ts-expect-error
console.log(session);
const username = session?.user?.username ?? undefined;
```

**Correct:**

```typescript
console.log(session);
//@ts-ignore
const username = session?.user?.["username"] ?? undefined;
```

**Lesson:**

- Place `@ts-ignore` on the line BEFORE the error
- Use bracket notation for dynamic/uncertain properties
- `@ts-expect-error` expects an error (fails if no error)
- `@ts-ignore` suppresses errors unconditionally

---

### 9. **Icon/Component Import Names**

**Problem:** Using incorrect or non-existent component names

**Wrong:**

```typescript
import { PaintBrush } from 'lucide-react'  // ❌ Doesn't exist

<PaintBrush className="h-4 w-4" />
```

**Correct:**

```typescript
import { Brush } from 'lucide-react'  // ✅ Correct name

<Brush className="h-4 w-4" />
```

**Lesson:**

- Verify icon names exist in the library
- Check the library documentation for exact names
- Icon libraries may have different naming conventions
- Don't assume naming patterns - verify first

---

### 10. **CSS Custom Property Updates**

**Problem:** Generated inconsistent CSS custom properties for theming

**Issue:** The AI generated CSS custom properties but they didn't match the theme system:

- Shadow variables had wrong structure
- Color values were inconsistent with the design system
- Font stacks didn't match project conventions

**Lesson:**

- CSS custom properties for themes require careful coordination
- Don't randomly generate color values
- Preserve existing shadow/animation systems
- Theme changes affect the entire application

---

## ✅ VERIFICATION CHECKLIST FOR AI

Before submitting code, verify:

### File System

- [ ] No duplicate directory paths (`srcsrc`, `srcssrc`, etc.)
- [ ] All files in correct locations matching existing structure
- [ ] New files follow existing naming conventions

### Imports & Dependencies

- [ ] All import paths match package structure
- [ ] No hardcoded `/src/components/` paths unless verified
- [ ] Package versions use workspace conventions (`catalog:`, `workspace:*`)
- [ ] Icon/component names verified in library documentation

### TypeScript

- [ ] Type constraints aren't overly restrictive
- [ ] Generic types allow necessary flexibility
- [ ] Runtime types match actual objects (not just interfaces)
- [ ] `@ts-ignore` comments properly placed and justified

### Configuration

- [ ] Package names consistent across all config files
- [ ] No duplicate plugin configurations
- [ ] Config imports use correct package names
- [ ] CSS imports reference correct packages

### Build & Runtime

- [ ] Code can actually build (`pnpm build`)
- [ ] No TypeScript compilation errors
- [ ] All routes are accessible
- [ ] Database types match ORM setup

---

## 🎯 BEST PRACTICES

### 1. **Explore Before Creating**

```bash
# Always explore first
find . -name "*.ts" -type f | head -10
ls -la apps/*/src/
cat package.json | grep "name"
```

### 2. **Follow Existing Patterns**

- Read 2-3 similar files before creating new ones
- Copy import patterns exactly
- Match the code style you see
- Don't introduce new patterns without reason

### 3. **Verify Third-Party Resources**

- Check actual documentation for icon names
- Verify component exports in library source
- Don't assume API surface - verify it

### 4. **Test Your Assumptions**

- If you think a type should work, verify it compiles
- If you think a path exists, verify it
- If you think an export exists, check the file

### 5. **Be Consistent**

- If you change an import pattern, change ALL of them
- If you update a package name, search for ALL references
- Half-fixes are worse than no fixes

---

## 📊 IMPACT SUMMARY

From the git diff statistics:

- **60 files modified**
- **943 insertions, 800 deletions**
- **Multiple critical fixes** to make code runnable

### Key Areas Fixed:

1. **Removed 5 duplicate route files** in wrong directories
2. **Fixed 40+ import paths** across components
3. **Corrected 4 configuration files** (Vite, Tailwind, PostCSS, CSS)
4. **Fixed TypeScript types** in 3 critical files
5. **Updated 200+ lines** of CSS custom properties
6. **Removed duplicate plugin** configuration
7. **Fixed package dependency** version format

---

## 🔑 GOLDEN RULE

**"Make it work first, make it pretty second"**

A codebase that doesn't run is worthless, no matter how clean the code looks. Focus on:

1. ✅ **Does it build?**
2. ✅ **Does it run?**
3. ✅ **Do imports resolve?**
4. ✅ **Do types compile?**
5. ⭐ Is it clean/optimal? (Nice to have)

---

## 🚀 CONCLUSION

The difference between AI code and production code is attention to:

- **Real file system structure** (not assumed)
- **Actual package exports** (not guessed)
- **Existing patterns** (not invented)
- **Build requirements** (not theoretical)

**AI should verify, not assume.** Every tool is available to check before committing to a path.
