## Flow 4: Developer Tools

### Screen 11: Webhooks

**Prompt:**

Design the Webhook Management screen.

**Layout:**

- **List View**: Active webhooks.
- **Detail View (Drawer)**: Webhook configuration.

**Visual Centerpiece:**
The URL. It should look like a secret key.

**Key Elements:**

- **Add Button**: "+ New Webhook".
- **Webhook Item**:
  - Title: "GitHub PRs".
  - URL: `https://api.printy.app/wh/...` (Truncated).
  - Status: "Active" (Green dot).
  - "Copy" button.
- **Logs**: "Recent Deliveries" (200 OK, 400 Bad Request) mini-graph.

**Typography:**

- URLs in JetBrains Mono, small size.

**Interaction Notes:**

- Tapping a row expands details (Events, Secret).
- Swipe to delete.

**Vibe:**
Server admin panel. AWS Console but good looking.
