# Template Setup Guide

This template contains placeholder values that need to be replaced with your project-specific information. Follow this guide to customize the template for your project.

## 🚀 Quick Start - Automated Setup

### Step 0: Run the Project Initializer

**The fastest way to set up your project is to use the automated initializer:**

```bash
pnpm run init-project
```

This interactive script will prompt you for:

- Project name
- Project slogan/tagline
- Cloudflare account ID
- D1 database ID
- Production domain names

The initializer automatically replaces all template placeholders throughout the codebase, including:

- Configuration files (`wrangler.toml`, `package.json`)
- Documentation files (`README.md`, `PRD.md`, etc.)
- Source code files (API routes, auth configuration)
- Environment configuration

**Configuration File:**

- The initializer reads from `repo.example.conf` (if present)
- You can pre-fill values in this file to skip prompts
- After running, verify changes and commit them to your repository

**After running the initializer:**

- Review the changes made (use `git diff` to see all replacements)
- Complete any remaining manual steps below
- Use the checklist below as validation rather than manual search-and-replace

---

## 🔄 Required Replacements (Manual Reference)

### 1. Project Identity Placeholders

Search and replace these placeholders throughout the codebase:

| Placeholder                                     | Replace With             | Description                                  |
| ----------------------------------------------- | ------------------------ | -------------------------------------------- |
| `Printy Mobile`                                 | Your project name        | Used in titles, package names, documentation |
| `Print labels anywhere with your mobile device` | Your project tagline     | Used in meta descriptions and titles         |
| `[DESCRIBE YOUR PROJECT PURPOSE]`               | Your project description | Main project summary in PRD.md               |
| `[USER_TYPE_2]`                                 | Your second user type    | User persona in PRD.md                       |
| `[DESCRIBE YOUR SECOND USER TYPE]`              | User type description    | User persona details in PRD.md               |
| `[DESCRIBE CHARACTERISTICS AND INTERESTS]`      | User characteristics     | Detailed user persona info                   |

### 2. Infrastructure Placeholders

Update these in configuration files:

| Placeholder                                       | Replace With               | Files                                                         |
| ------------------------------------------------- | -------------------------- | ------------------------------------------------------------- |
| `YOUR_ACCOUNT_ID`                                 | Your Cloudflare account ID | `apps/api/wrangler.toml`, `apps/webapp/wrangler.toml`         |
| `YOUR_DATABASE_ID`                                | Your D1 database ID        | `apps/api/wrangler.toml`                                      |
| `printy-mobile-api`                               | Your API worker name       | `apps/api/wrangler.toml`                                      |
| `printy-mobile-webapp`                            | Your webapp worker name    | `apps/webapp/wrangler.toml`                                   |
| `printy-mobile-d1-database`                       | Your database name         | `apps/api/wrangler.toml`, `apps/api/package.json`             |
| `https://api.printy.mobile`                       | Your production API domain | `apps/webapp/src/utils/api.ts`, `apps/webapp/src/lib/auth.ts` |
| `https://printy.mobile`                           | Your production domain     | `apps/api/src/app.ts`                                         |
| `https://printy-mobile-webapp.printy.workers.dev` | Your Pages domain          | `apps/api/src/app.ts`                                         |

## 📋 Setup Checklist

### Step 1: Project Branding

- [ ] Replace `Printy Mobile` with your project name
- [ ] Replace `Print labels anywhere with your mobile device` with your project tagline
- [ ] Update project description in `notes/PRD.md`
- [ ] Update user personas in `notes/PRD.md`

### Step 2: Infrastructure Configuration

- [ ] Set your Cloudflare account ID in wrangler.toml files
- [ ] Create and configure your D1 database
- [ ] Update database name and ID in configuration files
- [ ] Set your production domain names
- [ ] Update CORS origins in `apps/api/src/app.ts`

### Step 3: Environment Setup

- [ ] Copy `.env.example` to `.env` in relevant directories
- [ ] Configure environment variables for development
- [ ] Set up Cloudflare Workers environment variables

### Step 4: Development Testing

- [ ] Run `pnpm install` to install dependencies
- [ ] Run `pnpm dev` to start development servers
- [ ] Test API endpoints are accessible
- [ ] Verify frontend connects to API correctly

### Step 5: Deployment Preparation

- [ ] Update deployment domains in CORS configuration
- [ ] Test build process with `pnpm build`
- [ ] Configure production environment variables
- [ ] Test deployment to staging environment

## 🛠 Quick Replace Commands

You can use these commands to quickly replace placeholders:

```bash
# Replace project name (run from template root)
find . -type f -name "*.md" -o -name "*.json" -o -name "*.toml" -o -name "*.ts" -o -name "*.tsx" -o -name "*.html" | \
  xargs sed -i '' 's/Printy Mobile/MyAwesomeProject/g'

# Replace project slogan
find . -type f -name "*.md" -o -name "*.json" -o -name "*.toml" -o -name "*.ts" -o -name "*.tsx" -o -name "*.html" | \
  xargs sed -i '' 's/Print labels anywhere with your mobile device/My Amazing App/g'

# Note: Update the replacement values above with your actual project name and slogan
```

## 📁 Files to Update

The following files contain placeholders that need manual review and updates:

### Configuration Files

- `apps/api/wrangler.toml` - Cloudflare Workers configuration
- `apps/webapp/wrangler.toml` - Cloudflare Pages configuration
- `apps/api/package.json` - Database references in scripts
- `package.json` - Root package name

### Code Files

- `apps/webapp/src/utils/api.ts` - API endpoint configuration
- `apps/api/src/app.ts` - CORS configuration
- `apps/webapp/src/routes/__root.tsx` - Meta tags and SEO

### Documentation Files

- `notes/PRD.md` - Product requirements and user personas
- `notes/STACK.md` - Technology stack documentation
- `notes/TODO.md` - Implementation todos
- `notes/DEVLOG.md` - Development log
- `notes/SYSTEM_ARCHITECTURE.md` - System architecture
- `README.md` - Main project documentation

### UI Files

- `apps/backoffice/index.html` - Meta tags and title
- `apps/backoffice/public/locales/en/common.json` - Localization strings

## ✅ Verification

After completing the setup:

1. **Search for remaining placeholders**: `grep -r "PRINTY_MOBILE" .`
2. **Check for placeholder brackets**: `grep -r "\[.*\]" notes/`
3. **Verify build works**: `pnpm build`
4. **Test development**: `pnpm dev`
5. **Check configuration**: Review all wrangler.toml files

## 🎉 Ready to Go!

Once you've completed all replacements and verifications, your template is ready for development. Remove this `TEMPLATE_SETUP.md` file and start building your amazing project!

For additional help, refer to the comprehensive documentation in the `notes/` directory and the main `README.md`.
