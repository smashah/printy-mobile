## Flow 1: Foundation

### Screen 4: Template Editor

**Prompt:**

Design the Template Editor/Preview screen.

**Layout:**

- **Split View** (Desktop) or **Tabs** (Mobile: "Edit" / "Preview").
- **Preview Area**: Shows the live rendered PDF/Bitmap on a "Paper" background.
- **Form Area**: Inputs to customize the template.

**Visual Centerpiece:**
The Print Preview. It should look _exactly_ like the final thermal print (black and white, dithered).

**Key Elements:**

- **Preview**:
  - A white rectangle (aspect ratio of 4x6 label).
  - "Zoom" or "Pan" controls.
- **Form**:
  - "SSID" (Input).
  - "Password" (Input).
  - "Security" (Dropdown).
  - Labels in Monospace.
- **Print Action Bar** (Sticky Bottom):
  - "Copies" [- 1 +] stepper.
  - Big "PRINT" button (Electric Blue).

**Interaction Notes:**

- Typing in the form updates the preview instantly (debounced).
- "Print" button triggers the "Sending..." modal.

**Vibe:**
What You See Is What You Get. Productive and focused.
