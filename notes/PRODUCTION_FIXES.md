# Production Deployment Fixes & Learnings

This document contains all the critical fixes and patterns learned from deploying real projects to production. These fixes prevent common deployment issues and establish production-ready patterns.

## Critical Production Issues Fixed

### 1. Environment-Specific API Endpoints

**Issue**: Hard-coded localhost URLs break in production
**Fix**: Environment detection pattern in `apps/webapp/src/utils/api.ts`

```typescript
export const getApiHost = () =>
  import.meta.env.PROD ? `https://api.printy.mobile` : "http://localhost:8787";
```

### 2. CORS Configuration for Production

**Issue**: Missing production domains cause CORS errors
**Fix**: Include all domains in `apps/api/src/app.ts`

```typescript
origin: [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8787",
  "https://printy.mobile",
  "https://printy-mobile-webapp.printy.workers.dev",
];
```

### 3. Cloudflare Workers Deployment

**Issue**: Inconsistent wrangler commands and missing configurations
**Fixes**:

- Use `pnpx wrangler@latest` in all scripts
- Add `keep_vars = true` to wrangler.toml files
- Template placeholders for account_id and database names

### 4. Mobile Scrolling Issues

**Issue**: `overflow-hidden` in root layout prevents mobile scrolling
**Fix**: Remove overflow-hidden from main content containers in `__root.tsx`

```typescript
// Before:
<div className="flex flex-1 flex-col h-full overflow-hidden">
// After:
<div className="flex flex-1 flex-col h-full">
```

### 5. DaisyUI Component Requirements

**Issue**: `dock-active` class doesn't work on Link components
**Fix**: Wrap Links in button elements for proper styling

```typescript
<button className={`${tab.isActive ? 'dock-active text-primary' : ''}`}>
  <Link className="btn btn-ghost btn-sm flex-col gap-1">
```

### 6. Clickable Card Components

**Issue**: Overlapping interactive elements prevent card clicks
**Fix**: Use pointer-events CSS for proper layering

```typescript
<Link className="absolute inset-0 z-10">
<CardContent className="...pointer-events-none">
<Button className="...pointer-events-auto z-20">
```

### 7. Better Auth Configuration Issues

**Issue**: Auth breaking in production build due to `reactStartCookies()` plugin
**Root Cause**: The `reactStartCookies()` plugin from better-auth/react-start causes build failures in production
**Fix**: Comment out the plugin while preserving the code for future use

```typescript
// Before (breaks build):
plugins: [reactStartCookies()];

// After (build works):
// plugins: [reactStartCookies()] // WARNING: UNCOMMENTING THIS WILL BREAK BUILD
```

**Files affected**:

- `apps/webapp/src/lib/auth.ts` - Better Auth client configuration

**Key Learning**: The `reactStartCookies()` plugin causes build failures and must be commented out. Keep the import and commented code for future better-auth/react-start compatibility updates. Always test auth configuration in production builds before deployment.

### 8. Build Configuration & Missing Dependencies

**Issue**: Build failures due to missing dependencies and incorrect Cloudflare Workers configuration
**Root Cause**: Template was missing several production dependencies and build configurations discovered during real deployments
**Fixes Applied**:

- Added `@tanstack/zod-adapter` for TanStack Router validation integration
- Added `daisyui` to packages/ui for consistent UI framework
- Added `process.platform` definition in Vite config for Cloudflare compatibility
- Split build commands: `build` (fast) vs `build:full` (with typecheck)
- Environment detection for auth baseURL

**Files affected**:

- `apps/webapp/package.json` - Dependencies and build scripts
- `apps/webapp/vite.config.ts` - Build configuration with process.platform
- `apps/webapp/src/lib/auth.ts` - Environment-aware auth URL
- `packages/ui/package.json` - DaisyUI dependency
- `packages/ui/tailwind.config.ts` - DaisyUI plugin integration

**Key Learning**: Production dependencies and build configurations must be tested in real deployment scenarios. Missing packages or incorrect Vite configs cause deployment failures that don't appear in development.

## Development Patterns Established

### API Development

1. **Always use Zod validation** on all endpoints
2. **Environment detection** for API hosts
3. **Hono RPC client** instead of manual fetch
4. **Type-safe** end-to-end communication

### TanStack Router

1. **beforeLoad pattern** for data prefetching
2. **useSuspenseQuery** in components
3. **Query invalidation** on filter changes
4. **Route context** for shared dependencies

### Deployment

1. **pnpx wrangler@latest** for consistency
2. **keep_vars = true** for environment variables
3. **Production CORS** configuration
4. **Template placeholders** for project-specific values

## Component Patterns

### Clickable Cards with Buttons

```typescript
<Link className="absolute inset-0 z-10">
<CardContent className="...pointer-events-none">
  <Button className="...pointer-events-auto z-20"
    onClick={(e) => e.stopPropagation()}>
```

### Mobile-First Layouts

- Remove `overflow-hidden` from root containers
- Use flex layouts that allow scrolling
- Test mobile scrolling thoroughly

### Form Validation

- Zod schemas for all API endpoints
- Frontend validation matching backend
- Proper error message handling

## Key Files Updated

### API Configuration

- `apps/api/src/app.ts` - CORS and validation
- `apps/api/wrangler.toml` - Deployment config
- `apps/api/package.json` - Scripts with pnpx

### Frontend Configuration

- `apps/webapp/src/utils/api.ts` - Environment detection
- `apps/webapp/src/routes/__root.tsx` - Mobile scrolling
- `apps/webapp/wrangler.toml` - Deployment config

### Documentation

- `.cursor/rules/api.mdc` - API patterns
- `.claude/api.mdc` - AI assistant guidelines

## Deployment Checklist

Before deploying any project:

- [ ] Update API host environment detection
- [ ] Configure CORS with production domains
- [ ] Set wrangler.toml account_id and database names
- [ ] Test mobile scrolling on all pages
- [ ] Verify all API endpoints have Zod validation
- [ ] Check that buttons work in clickable card components
- [ ] Ensure `reactStartCookies()` plugin is commented out in auth.ts
- [ ] Run build to ensure no TypeScript errors

## Prevention Strategy

These fixes are now built into the template to prevent repeating the same issues:

1. **Template placeholders** for project-specific values
2. **Production-ready patterns** by default
3. **Comprehensive documentation** of all patterns
4. **Deployment scripts** using best practices

This ensures every new project starts with production-ready configuration and avoids the common pitfalls discovered during real deployments.
