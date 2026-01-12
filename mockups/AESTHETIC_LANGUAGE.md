# Printy UI Generation Prompts

## Aesthetic Direction: "Industrial Pop"

## Theme: "Thermal Paper" Mode

The interface mimics the tactile nature of thermal printing but modernized for a digital screen. It's high-contrast, bold, and playful.

- **Background**: "Paper White" (#F5F5F0) or subtle noise texture. Not clinical white.
- **Dark Mode**: "Carbon Ribbon" (#1C1C1E). Deep, rich, ink-like.
- **Avoid**: Gradients, glassmorphism, blur effects, neomorphism.

## Surface Materials: "Raw & Framed"

- **Borders**: Thick, distinct 2px borders in Ink Black (#111111).
- **Shadows**: Hard-edge "brutalist" shadows (e.g., `box-shadow: 4px 4px 0px #000`). No blur.
- **Texture**: Subtle grain overlay on backgrounds to simulate paper fiber.

## Typography

### Headings (The "Machine")

- **Family**: 'JetBrains Mono' or 'Space Mono'.
- **Style**: Uppercase, tracked out slightly (letter-spacing: 0.05em).
- **Weight**: Bold / ExtraBold.
- **Usage**: Section headers, big stats, empty states.

### Body (The "Human")

- **Family**: 'Inter' or 'Public Sans'.
- **Style**: Clean, highly readable.
- **Weight**: Regular (400) and SemiBold (600).
- **Usage**: Instructions, form labels, long content.

## Colors

### Base Palette

- **Paper**: #F5F5F0 (Primary Background)
- **Ink**: #111111 (Primary Text/Borders)
- **Graphite**: #4A4A4A (Secondary Text)
- **Chalk**: #FFFFFF (Card Backgrounds)

### Semantic Signals (The "Highlighter")

- **Action**: 'Electric Blue' (#2952FF) - Buttons, Links.
- **Success**: 'Terminal Green' (#00C853) - Connected states, success messages.
- **Warning**: 'Caution Yellow' (#FFD600) - Alerts, warnings.
- **Error**: 'Ribbon Red' (#FF3D00) - Disconnects, errors.

## Layout Philosophy

- **Density**: Spacious but framed. Elements are contained in boxes.
- **Grid**: Visible, distinct grid lines in some sections.
- **Metaphor**: "Teenage Engineering meets Receipt Printer".
- **Alignment**: Strict alignment, purposeful whitespace.

## UI Patterns

### Navigation

- **Mobile**: Bottom tab bar with chunky icons. Active state has a hard underline or box.
- **Desktop**: Sidebar with monospace labels.

### Data Display

- **Cards**: White cards with 2px black borders and hard shadows.
- **Lists**: Monospaced rows with dividers.
- **Images**: Dithered previews (Floyd-Steinberg effect) even in the UI to show what it will look like printed.

### Forms

- **Inputs**: Rectangular, 2px border. Focus state thickens border or changes color to Electric Blue.
- **Buttons**: Rectangular, no rounded corners (or very slight radius like 2px). Hard shadow on hover.

## Interaction & Motion Strategy

### Core Philosophy: "Mechanical Click"

Interactions should feel snappy and mechanical, like pressing a physical button or tearing a receipt.

### Transitions

- **Page**: Instant or fast slide-over. No fades.
- **Elements**: Snap into place.
- **Buttons**: Depress visually (translate Y + reduce shadow) on active state.

### Micro-interactions

- **Haptics**: Heavy usage on mobile. A "thud" when printing starts. A "tick" when scrolling lists.
- **Loading**: A "printing" animation (paper feeding out) instead of a spinner.

## Reference Mood

- **Linear**: For the density and keyboard-centricity (Developer persona).
- **Teenage Engineering (Field)**: For the industrial, raw aesthetic.
- **Receipts**: For the layout of data and monospace usage.
