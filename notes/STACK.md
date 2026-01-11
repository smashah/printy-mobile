# Printy Mobile Technology Stack

## Overview

Printy Mobile uses a modern, TypeScript-based stack with a monorepo structure managed by Turborepo and pnpm, focusing on delivering a performant and scalable platform.

## Core Technologies

### Frontend
- **Framework**: TanStack Start (React + Vite)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Data Management**: TanStack Query for data fetching

### Backend
- **API Framework**: Hono API running on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Authentication**: Better-auth
- **Media Storage**: Cloudflare R2
- **Background Jobs**: Trigger.dev (future phases)

### Development Tools
- **Package Manager**: pnpm
- **Monorepo Tool**: Turborepo
- **Testing**: Vitest
- **Linting**: ESLint + Biome
- **Type Checking**: TypeScript

## Monorepo Structure

```
Printy Mobile/
├── apps/
│   ├── webapp/                 # Main TanStack Start web application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── api/                    # Hono API on Cloudflare Workers
│   │   ├── src/
│   │   ├── wrangler.toml
│   │   └── package.json
│   │
│   ├── backoffice/             # Admin panel (React + Refine)
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── web/                    # Marketing/landing site (Next.js)
│   │   ├── app/
│   │   └── package.json
│   │
│   └── docs/                   # Documentation site (Next.js)
│       ├── app/
│       └── package.json
│
├── packages/
│   ├── auth/                   # Better-auth configuration
│   │   ├── lib/
│   │   └── package.json
│   │
│   ├── db/                     # Database schemas and utilities
│   │   ├── src/
│   │   ├── migrations/
│   │   └── package.json
│   │
│   ├── ui/                     # Shared UI components (shadcn/ui)
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── common/                 # Shared utilities and types
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── eslint-config/          # Shared ESLint configurations
│   │   └── package.json
│   │
│   └── typescript-config/      # Shared TypeScript configurations
│       └── package.json
│
├── notes/                      # Project documentation
│   ├── PRD.md
│   ├── STACK.md
│   ├── TODO.md
│   └── DEVLOG.md
│
├── mockups/                    # UI/UX mockups to guide development
│   ├── README.md               # Structure & usage
│   ├── manifest.schema.json    # JSON schema for manifest
│   ├── manifest.json           # Optional, declares pages/flows
│   └── <slug>/                 # One folder per page/flow
│       ├── design.html         # Optional static HTML
│       ├── screenshot.png      # Optional screenshot(s)
│       ├── notes.md            # UX notes & acceptance criteria
│       └── assets/             # Supporting images/icons
│
└── package.json               # Root package.json
```

## Package Details

### Apps

#### `apps/webapp`
- Main TanStack Start application
- Trip logging and management
- Social feed and interactions
- User profiles and authentication
- Mobile-responsive design

#### `apps/api`
- Hono API on Cloudflare Workers
- RESTful endpoints for trips, users, feed
- Authentication middleware
- Image upload to Cloudflare R2
- Real-time features (future)

#### `apps/backoffice`
- Admin panel built with Refine
- User and content moderation
- Analytics and reporting
- System configuration

#### `apps/web`
- Marketing and landing pages
- Public trip galleries
- SEO-optimized content
- Authentication flows

#### `apps/docs`
- API documentation
- User guides
- Developer resources

### Packages

#### `packages/auth`
- Better-auth configuration
- Authentication providers
- Session management
- Role-based access control

#### `packages/db`
- Drizzle ORM schemas
- Database migrations
- Type-safe database utilities
- Seed data for development

#### `packages/ui`
- shadcn/ui components
- Custom trip and feed components
- Responsive design system
- Dark/light theme support

#### `packages/common`
- Shared TypeScript types
- Utility functions
- Constants and enums
- Validation schemas

#### `packages/eslint-config`
- Base ESLint configuration
- React-specific rules
- Next.js configuration
- TypeScript rules

#### `packages/typescript-config`
- Base TypeScript configuration
- Strict type checking
- Path mapping
- Build optimizations

## Development Phases

### Phase 1 (V-1): Super MVP
- Basic trip logging form
- No authentication required
- Simple list view of recent trips
- Minimal styling

### Phase 2 (V1): MVP
- User authentication system
- Trip creation and management
- Basic user profiles
- Following system

### Phase 3 (V2): Enhanced Social Platform
- Social feed implementation
- Like and comment system
- Search functionality
- Trip collaboration

### Phase 4 (V3): Gamification & Advanced Features
- Achievement system
- Leaderboards
- Map visualization
- Third-party integrations

### Phase 5 (V4): Monetization & Growth
- Premium features
- Trip planning tools
- Data export
- Recommendation engine

## Environment Setup

### Required Environment Variables

#### API (`apps/api`)
```env
DATABASE_URL=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
BETTER_AUTH_SECRET=
```

#### Webapp (`apps/webapp`)
```env
VITE_API_URL=
BETTER_AUTH_SECRET=
```

### Development Setup

1. Install pnpm: `npm install -g pnpm`
2. Clone repository
3. Install dependencies: `pnpm install`
4. Copy environment files: `cp .env.example .env` in relevant directories
5. Set up Cloudflare D1 database
6. Configure Cloudflare R2 bucket
7. Run development: `pnpm dev`

## Deployment

### Cloudflare Workers (API)
- Deploy via Wrangler CLI
- Environment variables via Cloudflare dashboard
- D1 database binding
- R2 bucket binding

### Static Sites (webapp, web, docs)
- Deploy to Cloudflare Pages
- Automatic builds from Git
- Preview deployments for PRs

## Development Guidelines

1. **TypeScript First**: All code written in TypeScript with strict mode
2. **Component-First**: Build reusable components in `packages/ui`
3. **Type Safety**: Use Drizzle ORM for type-safe database operations
4. **Testing**: Write tests for critical user flows
5. **Documentation**: Keep README.md updated in each package
6. **Commits**: Use conventional commits for changelog generation
7. **Code Style**: Consistent formatting with ESLint and Prettier

## Performance Targets

- **Page Load**: < 2 seconds on mobile networks
- **API Response**: < 200ms for standard queries
- **Image Upload**: Support up to 10MB images
- **Offline Support**: Basic trip logging when offline
- **Scalability**: Support thousands of concurrent users

## Security & Privacy

- **Authentication**: Secure session management with Better-auth
- **Data Protection**: GDPR compliance for user data
- **Content Moderation**: Admin tools for content management
- **Privacy Controls**: Granular privacy settings for trips
- **Rate Limiting**: API rate limiting to prevent abuse
