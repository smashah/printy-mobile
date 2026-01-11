# Printy Mobile

> Print labels anywhere with your mobile device

Mobile-first thermal printing application for generating labels, tickets, and documents on the go.

## Overview

Printy Mobile is a monorepo that provides:
- **Printer API Service** - REST API for generating PDF labels from various data sources
- **Capabilities Package** - Shared PDF templates and data fetching logic
- **Native App** (Future) - iOS/Android mobile app for printing on the go

## Features

- **GitHub Issue Labels** - Generate printable labels from GitHub issues
- **Linear Issue Labels** - Create labels from Linear issues
- **Pull Request Boarding Passes** - Print boarding pass-style PR summaries
- **Release Deployment Tags** - Generate deployment tags for releases
- **Build Receipts** - Print build confirmation receipts
- **WiFi Access Cards** - Create QR code WiFi connection cards
- **Asset Device Tags** - Generate inventory/asset tags with QR codes
- **Daily Todo Lists** - Print structured daily task lists
- **Recipes** - Generate recipe cards (CookLang compatible)
- **Coloring Pages** - AI-generated coloring pages for kids

## Project Structure

```
printy-mobile/
├── apps/
│   ├── printer-api-service/  # Hono API for PDF generation
│   ├── api/                  # Main API (auth, database)
│   └── native/               # Expo mobile app (future)
├── packages/
│   ├── capabilities/         # PDF templates, services, utilities
│   ├── auth/                 # Better Auth configuration
│   ├── common/               # Shared utilities
│   ├── config/               # Environment configuration
│   ├── db/                   # Drizzle ORM schema
│   └── ui/                   # shadcn/ui components
└── notes/                    # Documentation
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development (all services)
pnpm dev

# Start only printer API
pnpm --filter @printy-mobile/printer-api-service dev
```

## API Endpoints

The Printer API Service exposes the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/print/github` | POST | Generate GitHub issue label |
| `/print/linear` | POST | Generate Linear issue label |
| `/print/recipe` | POST | Generate recipe card |
| `/print/coloring` | POST | Generate AI coloring page |
| `/print/wifi` | POST | Generate WiFi access card |
| `/print/asset` | POST | Generate asset device tag |
| `/print/pr` | POST | Generate PR boarding pass |
| `/print/release` | POST | Generate release deployment tag |
| `/print/build` | POST | Generate build receipt |
| `/print/todo` | POST | Generate daily todo list |

### Example Usage

```bash
# Generate GitHub issue label
curl -X POST http://localhost:8930/print/github \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/owner/repo/issues/123"}'

# Generate WiFi access card
curl -X POST http://localhost:8930/print/wifi \
  -H "Content-Type: application/json" \
  -d '{"ssid": "MyWiFi", "password": "secret123", "security": "WPA"}'
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub API token (optional, increases rate limits) |
| `LINEAR_API_KEY` | Linear GraphQL API key |
| `GEMINI_API_KEY` | Google Gemini API for AI coloring pages |

## Development

```bash
# Type check all packages
pnpm check-types

# Lint all packages
pnpm lint

# Format code
pnpm format
```

## Tech Stack

- **API**: Hono + TypeScript
- **PDF Generation**: @react-pdf/renderer
- **Monorepo**: Turborepo + pnpm workspaces
- **Deployment**: Cloudflare Workers
- **Mobile** (Future): React Native + Expo

## License

MIT
