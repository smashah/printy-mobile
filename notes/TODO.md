# Printy Mobile Implementation TODO

## 1. Project Setup & Foundational Configuration

- [ ] Initialize Turborepo monorepo structure.
- [ ] Configure pnpm workspaces for `apps` and `packages`.
- [ ] Set up `apps/webapp` with TanStack Start (React + Vite).
- [ ] Set up `apps/api` with Hono for Cloudflare Workers.
- [ ] Create `packages/db` with Drizzle ORM configured for Cloudflare D1.
- [ ] Create `packages/ui` for Shadcn UI components.
- [ ] Configure `wrangler.toml` for both the API and the web app for Cloudflare deployment.
- [ ] Establish base environment variables (`.env.example`) for all apps.
- [ ] Integrate and theme Shadcn UI in the `webapp`.
- [ ] Set up base TypeScript configurations (`tsconfig.json`) across the monorepo.

## Phase 1: Super MVP (V-1) - Anonymous Trip Logging

- **Backend (`apps/api`)**
  - [ ] Define initial D1 database schema for anonymous trip logs.
  - [ ] Create API endpoint to submit a new trip log.
  - [ ] Create API endpoint to retrieve a list of recent trip logs.
  - [ ] Implement filtering logic on the retrieval endpoint (e.g., by vehicle type).
- **Frontend (`apps/webapp`)**
  - [ ] Create a simple, public form for submitting trip data (no auth required).
  - [ ] Implement client-side logic to calculate and display fuel efficiency on submission.
  - [ ] Build a component or page to display the list of recent trip logs.
  - [ ] Add a UI element (e.g., dropdown) to filter the trip log list.

## Phase 2: MVP (V1) - User Accounts & Basic Social Features

- **Authentication & Users**
  - [ ] Integrate `better-auth` for user registration (email/social) and login.
  - [ ] Implement backend middleware to protect API endpoints.
  - [ ] Set up protected routing in the frontend `webapp`.
  - [ ] Create user profile pages.
- **Database (`packages/db`)**
  - [ ] Extend D1 schema: `users`, `trips`, `trip_updates`, `followers`.
  - [ ] Define relationships between users, trips, and updates.
- **Backend (`apps/api`)**
  - [ ] Develop CRUD API endpoints for trips.
  - [ ] Create API endpoints for adding updates (fuel, checkpoint, story) to a trip.
  - [ ] Create API endpoints for managing user profiles.
  - [ ] Implement follow/unfollow API logic.
  - [ ] Set up Cloudflare R2 for media uploads and create endpoints for generating upload URLs.
- **Frontend (`apps/webapp`)**
  - [ ] Build registration and login forms/pages.
  - [ ] Create UI for creating and editing trips.
  - [ ] Develop components for adding different types of trip updates (including file uploads for photos).
  - [ ] Display trips on user profile pages.
  - [ ] Add "Follow" buttons and follower/following counts to profiles.

## Phase 3: Enhanced Social Platform (V2) - Feed & Interactions

- **Backend (`apps/api`)**
  - [ ] Design and implement API endpoint for a personalized activity feed.
  - [ ] Develop API endpoints for liking and commenting on trip updates.
  - [ ] Implement logic for sending and managing trip collaborator invitations.
  - [ ] Build robust search endpoints for users, trips, and vehicles.
- **Frontend (`apps/webapp`)**
  - [ ] Create the main feed UI to display updates from followed users.
  - [ ] Add like and comment components to trip updates in the feed.
  - [ ] Implement UI for trip owners to manage collaborators.
  - [ ] Build a global search bar and results page.
  - [ ] Create a dedicated statistics dashboard for trips.

## Phase 4: Gamification & Advanced Features (V3)

- **Backend (`apps/api`)**
  - [ ] Develop logic to award badges and achievements based on user activity.
  - [ ] Create and update leaderboards for various metrics (e.g., fuel efficiency).
  - [ ] Implement endpoints to provide data for map visualizations (trip routes, update locations).
  - [ ] Add schema and API endpoints to support EV-specific data.
- **Frontend (`apps/webapp`)**
  - [ ] Display badges and achievements on user profiles.
  - [ ] Create leaderboard pages with filtering options.
  - [ ] Integrate a mapping library (e.g., Mapbox, Leaflet) to visualize trip routes.
  - [ ] Add EV-specific fields to trip logging forms.
  - [ ] Implement user-facing privacy controls for trips and profiles.

## Phase 5: Monetization & Growth (V4)

- [ ] Design and implement subscription flow with a payment provider.
- [ ] Gate specific features for premium users.
- [ ] Develop a trip planning tool with route and cost estimates.
- [ ] Implement data export functionality (e.g., to CSV).
- [ ] Build a recommendation engine for suggesting new trips or users to follow.

## General & Ongoing Tasks

- **Testing**
  - [ ] Set up Vitest for unit and integration testing in all packages.
  - [ ] Write tests for critical API endpoints and UI components.
  - [ ] Plan for end-to-end testing strategy (e.g., with Playwright or Cypress).
- **Documentation**
  - [ ] Maintain `DEVLOG.md` with significant changes.
  - [ ] Add code comments and documentation where necessary.
  - [ ] Create a user guide as features are developed.
- **Deployment & DevOps**
- [x] Set up a CI/CD pipeline using GitHub Actions to deploy to Cloudflare.
  - [ ] Configure monitoring, logging, and error tracking for production.
