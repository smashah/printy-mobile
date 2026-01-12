## Flow 1: Foundation

### Screen 3: Device Scan

**Prompt:**

Design the Bluetooth Device Scanning screen.

**Layout:**

- **Header**: "CONNECT PRINTER". Back button.
- **Main Area**: A radar-like list of discovered devices.
- **Footer**: "Troubleshoot" link.

**Visual Centerpiece:**
The scanning animation. A radar sweep or a list that populates with a "terminal" typing effect.

**Key Elements:**

- **Status Text**: "SCANNING..." blinking cursor.
- **Device List**:
  - Rows with device names (e.g., "PM-241-BT", "Unknown Device").
  - Signal strength indicator (bars).
  - "Connect" button on the right of each row.
- **Empty State**: "No devices found. Ensure Bluetooth is ON."

**Typography:**

- Monospace heavy. Looks like a system diagnostic tool.

**Interaction Notes:**

- Tapping "Connect" shows a "Pairing..." spinner (ASCII style if possible).
- Success state turns the row Green and shows "CONNECTED".

**Vibe:**
Hacker terminal / Diagnostic tool. Precise and technical.
