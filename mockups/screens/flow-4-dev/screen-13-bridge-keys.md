## Flow 4: Developer Tools

### Screen 13: Bridge Keys

**Prompt:**

Design the Bridge Key Management screen (for Desktop/CLI).

**Layout:**

- **Info**: "Use these keys to connect a headless device (Raspberry Pi)."
- **Key Display**: Hidden by default.

**Visual Centerpiece:**
The API Key.

**Key Elements:**

- **Key Field**: `pk_live_...` with "Reveal" eye icon and "Copy" button.
- **Instructions**:
  - "Run: `npx printy-bridge start --key ...`"
- **Revoke Button**: "Roll Key" (Destructive).

**Typography:**

- Code block for the command.

**Interaction Notes:**

- Revealing key requires re-auth (optional thought).
- Copying triggers "Copied!" toast.

**Vibe:**
Secret Agent. Secure.
