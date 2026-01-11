# Printy - Product Requirements Document

## 1. Title and Overview
### 1.1 Document Title & Version
**Product Requirements Document for Printy Mobile** - Version 2.0

### 1.2 Product Summary
**Printy** is a mobile and web application that bridges the digital and physical worlds via thermal printing. It transforms a standard utility tool into a creative platform for two distinct audiences: **Families** (AI coloring pages, recipes) and **Developers** (physical tickets, boarding passes, asset tags).

The goal is to move from a CLI-only tool to a paid, subscription-based ecosystem ($5/mo) that offers "Print as a Service" features, including AI generation and cloud-triggered printing.

### 1.3 Product Principles
*   **Tactile Utility:** Every output must feel valuable to hold.
*   **Instant Magic:** The time from "Idea" to "Printing" should be under 10 seconds.
*   **Industrial Pop:** The aesthetic blends the roughness of thermal paper with the playfulness of a creative tool.

## 2. User Personas
### 2.1 Key User Types
1.  **The Maker Family (Consumer)**
2.  **The Power Developer (Pro)**

### 2.2 Persona Details
*   **The Maker Family:** Parents and kids who want to generate instant, physical fun or utility without ink cartridges. They value ease of use, fun content, and "screen-free" activities generated from screens.
    *   *Use Cases:* AI coloring pages, mazes, recipes (Cooklang import), daily checklists, meal plans, wifi cards.
*   **The Power Developer:** Engineers, PMs, and managers who want physical artifacts of their digital work. They value automation, aesthetic functionalism, and "desk toys" that track their productivity.
    *   *Use Cases:* GitHub PRs on their desk, asset tags for devices, Linear tickets for physical kanban boards, build receipts.

### 2.3 Role-based Access
*   **Guest/Free User:** Local features only. Can print static templates (Wifi, Todo). Manual printing.
*   **Pro Subscriber:** Access to AI generation (credits), Cloud features (Bridge), and Premium integrations (GitHub/Linear).

## 3. User Stories

### Phase 1: The Foundation (Core Local Experience)
**Goal:** Establish the mobile app, connect to printers, and verify the local rendering engine.

#### Device Connection & Printing
*   **ID:** US-101
    *   **Title:** Connect Thermal Printer (BLE)
    *   **Description:** As a user, I want to scan and connect to a standard 4x6 thermal printer (e.g., PM-241-BT) via Bluetooth.
    *   **Acceptance Criteria:**
        *   App requests Bluetooth permissions.
        *   Scans for nearby BLE devices.
        *   Successful handshake and status display ("Connected").
*   **ID:** US-102
    *   **Title:** Print Client-Side PDF
    *   **Description:** As a user, I want to print a generated PDF directly from my phone to the thermal printer.
    *   **Acceptance Criteria:**
        *   PDF generated locally using `@react-pdf/renderer`.
        *   Converted to bitmap/raster format suitable for printer.
        *   Sent via BLE chunks without buffer overflow.

#### Template Hub (Static)
*   **ID:** US-103
    *   **Title:** Browse Template Library
    *   **Description:** As a user, I want to browse a gallery of basic templates.
    *   **Acceptance Criteria:**
        *   Grid view of "Blueprints" (Wifi Card, Todo List, Kanban Ticket).
        *   Thumbnail previews.
*   **ID:** US-104
    *   **Title:** Customize Static Template
    *   **Description:** As a user, I want to fill in data (e.g., Wifi SSID/Pass) and see a live preview.
    *   **Acceptance Criteria:**
        *   Form inputs update the React-PDF preview in real-time.
        *   "Print" button triggers US-102.

### Phase 2: The Business (Identity & AI)
**Goal:** Monetize the platform with Auth, Subscriptions, and AI features.

#### Identity & Subscription
*   **ID:** US-201
    *   **Title:** User Authentication
    *   **Description:** As a user, I want to sign up/login to save my history and access Pro features.
    *   **Acceptance Criteria:**
        *   Better-Auth integration (Email, Google, GitHub).
        *   Session persistence.
*   **ID:** US-202
    *   **Title:** Pro Subscription Flow
    *   **Description:** As a user, I want to upgrade to Pro ($5/mo) to unlock AI and Cloud features.
    *   **Acceptance Criteria:**
        *   Integration with RevenueCat (Mobile) / Polar.sh (Web).
        *   Entitlement synced to D1 database (`is_pro` flag).

#### Creative Studio (AI)
*   **ID:** US-203
    *   **Title:** Generate AI Coloring Page
    *   **Description:** As a Pro user, I want to generate a coloring page from a text prompt.
    *   **Acceptance Criteria:**
        *   Input prompt ("A cute dinosaur eating pizza").
        *   Backend triggers image generation (Flux/SD).
        *   Image processed with edge detection/dithering for thermal print optimization.
        *   Deducts 1 Credit from user balance.
*   **ID:** US-204
    *   **Title:** Recipe Import (Cooklang)
    *   **Description:** As a user, I want to paste a URL and get a formatted recipe card.
    *   **Acceptance Criteria:**
        *   Scrape and parse URL.
        *   Format into "Recipe Card" template.

### Phase 3: The Cloud (Bridge & Automation)
**Goal:** "Print as a Service" - connecting webhooks to physical devices.

#### The Bridge
*   **ID:** US-301
    *   **Title:** Enable Mobile Bridge Mode
    *   **Description:** As a user, I want my phone to act as a gateway for cloud print jobs while the app is open.
    *   **Acceptance Criteria:**
        *   App connects to Cloudflare Durable Object WebSocket.
        *   Listens for incoming binary print jobs.
        *   Forwards jobs to connected BLE printer automatically.
*   **ID:** US-302
    *   **Title:** Desktop Bridge (CLI)
    *   **Description:** As a Pro user, I want a headless CLI tool to run on a Raspberry Pi for 24/7 printing.
    *   **Acceptance Criteria:**
        *   Node/Bun script.
        *   Authenticates via "Bridge Key".
        *   Connects to USB printer and Cloud WebSocket.

#### Cloud & Webhooks
*   **ID:** US-303
    *   **Title:** Configure Webhooks
    *   **Description:** As a Pro user, I want to generate a webhook URL to trigger prints from external services.
    *   **Acceptance Criteria:**
        *   Web Dashboard allows creating a Webhook Source (e.g., "GitHub PRs").
        *   Provides unique URL `https://api.printy.app/webhooks/{id}`.
*   **ID:** US-304
    *   **Title:** Automated GitHub Printing
    *   **Description:** As a developer, I want a physical ticket printed whenever a PR is merged.
    *   **Acceptance Criteria:**
        *   Hono API validates GitHub HMAC signature.
        *   Extracts PR title, author, and stats.
        *   Renders "Boarding Pass" template via Trigger.dev.
        *   Pushes PDF to user's active Bridge.

## 4. Technical Requirements & Architecture

### 4.1 Platform Stack
*   **Mobile:** [Expo](https://expo.dev) (React Native).
*   **Web:** [TanStack Start](https://tanstack.com/start) (SSR, unified routing).
*   **Backend API:** [Hono](https://hono.dev) on **Cloudflare Workers**.
*   **Realtime:** **Cloudflare Durable Objects** (WebSockets for Bridge).
*   **Compute:** **Trigger.dev** (Node.js container for `sharp` / headless generation).
*   **Database:** **Cloudflare D1** (SQLite) + [Drizzle ORM](https://orm.drizzle.team).
*   **Storage:** **Cloudflare R2** (PDF artifacts).
*   **Auth:** [Better-Auth](https://better-auth.com).

### 4.2 Hybrid Rendering Strategy
*   **Mode A: Interactive (Client-Side)**
    *   Zero latency, offline capable.
    *   Engine: `@react-pdf/renderer` in React Native runtime.
    *   Best for: Simple forms, text-based templates.
*   **Mode B: Background (Server-Side)**
    *   High-fidelity, automated.
    *   Engine: Trigger.dev (Node.js).
    *   Best for: Webhooks, heavy image processing (dithering), automated jobs.

### 4.3 Data Flow (Cloud-to-Print)
`[Event Source]` -> `(HMAC Verify) Hono API` -> `Trigger.dev (Render)` -> `Durable Object (Hub)` -> `(WebSocket)` -> `[Bridge Client]` -> `(BLE/USB)` -> `[Printer]`

## 5. Monetization & Entitlements
### 5.1 Pricing
*   **Freemium:** Manual printing, static templates.
*   **Pro ($5/mo):** 100 AI credits/mo, Cloud Bridge access, Webhook integrations.

### 5.2 Entitlement Schema (D1)
*   **`users`**: `id`, `email`, `is_pro`.
*   **`subscriptions`**: Tracks Polar/RevenueCat status (`active`, `past_due`).
*   **`credit_balance`**: Tracks AI generation quota.
*   **`credit_transactions`**: Audit log of usage/refills.

## 6. Non-Functional Requirements
### 6.1 Usability
*   **Latency:** Local generation < 200ms. Cloud print delivery < 5s (network dependent).
*   **Offline:** App must allow browsing and printing local templates without internet.
*   **Clarity:** All images must be dithered (Floyd-Steinberg) to ensure legibility on 1-bit thermal paper.

### 6.2 Security
*   **Webhook Verification:** All incoming webhooks must be verified via HMAC-SHA256 signatures.
*   **Bridge Isolation:** Bridge keys only grant **read** access to the print queue; they cannot trigger prints or read user data.
*   **Job Scoping:** Durable Objects must enforce strict user isolation; user A cannot print to user B's bridge.

### 6.3 Reliability
*   **Durable Objects:** Handle WebSocket reconnection gracefully.
*   **Queueing:** If no bridge is connected, print jobs should be queued (TTL 24h) or rejected with specific error.

## 7. Migration Plan & Roadmap
*   **Templates:** Port existing `templates/` to shared package (Done).
*   **Services:** Move AI logic to Trigger.dev (Phase 3).
*   **CLI:** Maintain current CLI as "Desktop Bridge" client (Phase 3).

### Roadmap
*   **Phase 1:** Monorepo setup, Expo BLE, Basic Templates.
*   **Phase 2:** Better-Auth, Database Sync, Payment integration.
*   **Phase 3:** Cloudflare Workers + Durable Objects + Trigger.dev pipeline.
