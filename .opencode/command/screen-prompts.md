# Screen Prompts Generator

Generate aesthetic language and individual screen prompts from a PRD, ready for implementation by the `frontend-ui-ux-engineer` agent.

## Usage

```
/screen-prompts path/to/PRD.md
```

## Input

- `$ARGUMENTS` - Path to the PRD.md file (e.g., `notes/PRD.md`)

## Agent Orchestration

**This command ALWAYS delegates screen implementation to `frontend-ui-ux-engineer`.**

After generating the aesthetic language and screen prompts:

1. Save all artifacts to `mockups/` directory
2. For each screen, prepare a detailed prompt
3. Invoke `frontend-ui-ux-engineer` with the prompt using the Task tool

```typescript
// Example delegation pattern
Task({
  subagent_type: "frontend-ui-ux-engineer",
  description: "Build [Screen Name] screen",
  prompt: `
    # Screen: [Screen Name]
    
    ## Aesthetic Language
    [Include the full aesthetic direction]
    
    ## Screen Prompt
    [Include the specific screen prompt]
    
    ## Implementation Notes
    - Use @repo/ui components exclusively
    - Follow existing route patterns in apps/webapp/src/routes
    - Match the aesthetic language precisely
  `,
});
```

## Process

### Phase 1: PRD Analysis

Read and analyze the PRD file to extract:

1. **App Identity**
   - App name and tagline
   - Target audience (B2B SaaS, Consumer, Enterprise, Creator, etc.)
   - Core value proposition
   - Key differentiators
   - Emotional positioning (professional, playful, luxury, minimal, etc.)

2. **Feature Inventory**
   - List all features mentioned
   - Categorize by: Core, Secondary, Nice-to-have
   - Map features to screens

3. **User Flows**
   - Group screens into logical "Flows" (Onboarding, Dashboard, Core Features, Settings, etc.)
   - Authentication flow (sign-up, sign-in, forgot password)
   - Onboarding flow (if any)
   - Primary user journey
   - Secondary user journeys

4. **Screen Inventory**
   - Extract every unique screen needed
   - Identify screen relationships (parent/child, modal, drawer)
   - Note which screens share layouts
   - Assign screen numbers within each flow

### Phase 2: Aesthetic Language Generation

Create a comprehensive aesthetic language document that captures the app's visual soul. This should read like a creative brief, not a technical spec.

```markdown
# [App Name] UI Generation Prompts

## Aesthetic Direction: "[Evocative Tagline]"

A 3-5 word phrase that captures the entire visual philosophy.
Examples:

- "Quiet Luxury Intelligence"
- "Warm Professional Minimalism"
- "Playful Precision Engineering"
- "Nordic Calm Productivity"

## Theme: "[Mode Name]" Mode

Describe the foundational visual treatment:

- Background approach (deep matte, warm cream, cool gray, etc.)
- Specific hex codes for backgrounds (e.g., #111111, #FAFAFA)
- What to avoid (harsh blacks, pure whites, neon colors, etc.)

## Surface Materials: "[Style Reference]"

Describe the tactile quality of UI surfaces:

- Glass effects (matte glass, frosted, glossy, none)
- Border treatments (ultra-thin, bold, none) with specific values (e.g., 0.5px, rgba values)
- Shadow philosophy (no shadows, subtle, prominent)
- Separation methods (borders, spacing, elevation, color)

## Typography

### Headings

- Style description (Editorial, Sharp, Soft, Bold, etc.)
- Font family recommendations (e.g., 'Geist', 'Inter Tight', 'Instrument Serif')
- Weight and tracking preferences

### Body

- Style description (Clean, Warm, Tight, etc.)
- Font family recommendations
- Line height and readability notes

### Data/Monospace

- When to use (timestamps, codes, signals, stats)
- Font family recommendations (e.g., 'Geist Mono', 'JetBrains Mono')
- Size and case treatments (small caps, uppercase, etc.)

## Colors

### Base Palette

- Primary background: [Name] ([hex])
- Secondary background: [Name] ([hex])
- Text primary: [hex]
- Text secondary: [hex]
- Text muted: [hex]

### Semantic Signals

- Action/CTA: '[Name]' ([hex]) - [when to use]
- Success/Growth: '[Name]' ([hex]) - [when to use]
- Warning: '[Name]' ([hex]) - [when to use]
- Error/Alert: '[Name]' ([hex]) - [when to use]
- Neutral/Info: '[Name]' ([hex]) - [when to use]

### Color Philosophy

What to embrace and what to avoid. Examples:

- "Monochromatic base with surgical accent colors"
- "No neon/RGB gamer colors"
- "Warm earth tones over cold blues"

## Layout Philosophy

- Density: [Spacious / Balanced / Dense / Ultra-dense]
- Grid approach: [description]
- Alignment philosophy: [description]
- Reference metaphor: "[X] meets [Y]" (e.g., "Bloomberg Terminal meets Vogue")

## UI Patterns

### Navigation

- Primary: [Sidebar / Top bar / Bottom tabs / Command palette]
- Secondary: [Breadcrumbs / Tabs / Segmented controls]
- Mobile adaptation approach

### Data Display

- Lists: [Card-based / Dense rows / Timeline]
- Tables: [When and how to use]
- Stats/Metrics: [Display approach]

### Forms

- Layout: [Stacked / Inline / Multi-column]
- Input styling: [Border style, focus states]
- Validation approach: [Inline / On-submit / Real-time]

### Feedback

- Notifications: [Position, style, duration]
- Modals: [Size, backdrop, animation]
- Loading: [Skeleton / Shimmer / Progress bar / Text-based]

## Reference Mood

Describe 2-3 existing apps/websites that have a similar aesthetic:

- [App 1]: "[What to draw from it]"
- [App 2]: "[What to draw from it]"
- [App 3]: "[What to draw from it]"
```

### Phase 3: Interaction & Motion Strategy

Create a motion philosophy document that guides all animations:

```markdown
## Interaction & Motion Strategy

### Core Philosophy: "[Metaphor]"

Describe how the interface should FEEL to interact with.
Examples:

- "Weight & Precision" - like interacting with a Leica camera
- "Fluid Grace" - like water flowing between containers
- "Mechanical Confidence" - like a well-oiled Swiss watch

### Transitions

#### Page Transitions

- How screens enter/exit
- Duration and easing preferences
- What NOT to do (e.g., "No flying elements from off-screen")

#### Element Transitions

- How elements appear/disappear
- Stacking and layering behavior
- Modal/overlay effects (scale, blur, backdrop)

#### Data Transitions

- Number changes (counter roll, crossfade, instant)
- List updates (animate in, shuffle, instant)
- State changes (morphing, fading, snapping)

### Micro-interactions

#### Haptics (Mobile)

- When to use haptic feedback
- Intensity preferences (sharp/soft, short/long)

#### Hover States (Desktop)

- Color shifts
- Scale changes
- Shadow/glow effects

#### Click/Tap Feedback

- Visual feedback type
- Duration

#### Scroll Behavior

- Inertia (light/heavy)
- Edge behavior (bounce, stop, fade)
- Sticky elements

### Loading States

- Primary loading indicator (progress bar, shimmer, text)
- What to AVOID (e.g., "No spinning circles")
- Skeleton screen approach
```

### Phase 4: Screen Prompts Generation

For EACH screen identified, generate a detailed prompt organized by Flow:

```markdown
---

## Flow [N]: [Flow Name]

### Screen [N]: [Screen Name]

**Prompt:**

Design a [screen type] for "[App Name]".

**Layout:** [Describe the overall layout structure]

**Visual Centerpiece:** [The main visual element or focal point]

**Typography:**
- [Heading treatment]
- [Body text treatment]
- [Special text elements]

**Key Elements:**
- [Element 1]: [Detailed description]
- [Element 2]: [Detailed description]
- [Element 3]: [Detailed description]

**Interaction Notes:**
- [Specific interaction behaviors]
- [Hover/tap states]
- [Transitions]

**States:**
- Loading: [How it looks while loading]
- Empty: [How it looks with no data]
- Error: [How it looks on failure]

**Vibe:** [One evocative sentence capturing the feeling]

**Animation Note:** [Specific animation guidance if needed]

---
```

### Phase 5: Output Structure

Create the output in `mockups/` directory:

```
mockups/
├── AESTHETIC_LANGUAGE.md      # Complete aesthetic language + motion strategy
├── SCREEN_INVENTORY.md        # Complete list of all screens by flow
└── screens/
    ├── flow-1-[name]/
    │   ├── screen-1-[name].md
    │   ├── screen-2-[name].md
    │   └── screen-3-[name].md
    ├── flow-2-[name]/
    │   ├── screen-4-[name].md
    │   └── screen-5-[name].md
    └── flow-N-[name]/
        └── ...
```

## Example Output

### AESTHETIC_LANGUAGE.md (excerpt)

```markdown
# Fintrack UI Generation Prompts

## Aesthetic Direction: "Warm Professional Clarity"

## Theme: "Paper" Mode

Warm off-white backgrounds (#FEFCF9), avoiding harsh pure white (#FFF).
Deep charcoal for text (#1A1A1A), never pure black.

## Surface Materials: "Tactile Minimalism"

- No glass effects or blur
- Subtle 1px borders in warm gray (rgba(0,0,0,0.06))
- Soft shadows (0 2px 8px rgba(0,0,0,0.04)) for elevation
- Cards lift slightly on hover

## Typography

- **Headings**: Confident and warm. 'Plus Jakarta Sans' or 'DM Sans' in semibold.
- **Body**: Readable and friendly. Same family, regular weight, generous line-height (1.6).
- **Data**: 'JetBrains Mono' for numbers and codes. Tabular figures for alignment.

## Colors

- **Background**: Warm White (#FEFCF9)
- **Card Background**: Pure White (#FFFFFF)
- **Primary Action**: 'Ocean Blue' (#2563EB)
- **Success**: 'Forest' (#16A34A)
- **Warning**: 'Amber' (#D97706)
- **Error**: 'Coral' (#DC2626)

## Layout Philosophy

Spacious, breathing room, generous padding. "Notion meets Linear."
```

### Screen Prompt Example

```markdown
## Flow 1: Onboarding

### Screen 1: Welcome

**Prompt:**

Design a Welcome screen for "Fintrack".

**Layout:** Centered single column, vertically centered on the viewport.

**Visual Centerpiece:** The app logo rendered in deep charcoal, simple and confident. No gradients, no effects.

**Typography:**

- Title "Welcome to Fintrack" in semibold, 28px
- Subtitle "Your finances, finally organized." in regular, 16px, muted gray

**Key Elements:**

- Logo: 48px, centered
- Primary CTA: "Get Started" button, full-width at bottom of content
- Secondary link: "Already have an account? Sign in" below CTA

**Vibe:** Calm confidence. Like opening a fresh notebook.

**Animation Note:** Content fades in with a subtle 200ms ease, no sliding.
```

### SCREEN_INVENTORY.md

```markdown
# Screen Inventory

Generated from: `notes/PRD.md`
Total Screens: 15
Total Flows: 4

## Flow 1: Onboarding (3 screens)

| #   | Screen  | Route           | Priority | Status  |
| --- | ------- | --------------- | -------- | ------- |
| 1   | Welcome | `/`             | P0       | Pending |
| 2   | Sign Up | `/auth/sign-up` | P0       | Pending |
| 3   | Sign In | `/auth/sign-in` | P0       | Pending |

## Flow 2: Setup (2 screens)

| #   | Screen          | Route             | Priority | Status  |
| --- | --------------- | ----------------- | -------- | ------- |
| 4   | Connect Bank    | `/setup/connect`  | P0       | Pending |
| 5   | Import Complete | `/setup/complete` | P0       | Pending |

## Flow 3: Core App (7 screens)

| #   | Screen       | Route               | Priority | Status  |
| --- | ------------ | ------------------- | -------- | ------- |
| 6   | Dashboard    | `/dashboard`        | P0       | Pending |
| 7   | Transactions | `/transactions`     | P0       | Pending |
| 8   | Transaction  | `/transactions/:id` | P1       | Pending |

...

## Flow 4: Settings (3 screens)

...

## Build Order

Recommended implementation order based on dependencies:

1. **Flow 1**: Onboarding (required for entry)
2. **Flow 2**: Setup (first-time user experience)
3. **Flow 3**: Core App - Dashboard first, then drill-down screens
4. **Flow 4**: Settings (can be built in parallel)
```

## Agent Instructions

When executing this command:

1. **Read the PRD thoroughly** - Don't skim. Extract every feature, user flow, and implied screen.

2. **Infer the aesthetic from the product** - Match the visual language to:
   - Target audience (B2B → professional, Consumer → approachable, Luxury → refined)
   - Product category (Finance → trust, Social → energy, Productivity → clarity)
   - Competitive positioning (Premium → restrained, Disruptor → bold)

3. **Infer missing screens** - PRDs often forget:
   - Error pages (404, 500, offline)
   - Empty states (first-time user, no results)
   - Loading states (skeleton screens)
   - Confirmation modals (delete, unsaved changes)
   - Settings subpages (profile, notifications, billing, security)

4. **Write evocative prompts** - Each prompt should:
   - Paint a picture, not list requirements
   - Include a "Vibe" sentence that captures the feeling
   - Reference specific typography, spacing, and color choices
   - Describe what it should NOT look like

5. **Organize by Flows** - Group related screens together to maintain context and ensure consistent treatment within user journeys.

6. **Create actionable outputs** - Each screen prompt should be implementable by `frontend-ui-ux-engineer` in isolation.

7. **Reference existing codebase patterns**:
   - Use `@repo/ui` components (shadcn/ui based)
   - Reference existing routes in `apps/webapp/src/routes`
   - Follow Tailwind CSS conventions

## Delegation Template

After generating all prompts, delegate each screen to `frontend-ui-ux-engineer`:

```
Task({
  subagent_type: "frontend-ui-ux-engineer",
  description: "Build [Screen Name] screen",
  prompt: `
# Build Screen: [Screen Name]

## Aesthetic Language Reference
[Paste the complete AESTHETIC_LANGUAGE.md content]

## This Screen's Prompt
[Paste the specific screen prompt]

## Technical Requirements

### Route
- Path: \`[route path]\`
- Parent layout: [layout reference]
- Access: [Public / Authenticated]

### Components to Use
- Use ONLY \`@repo/ui\` components (shadcn/ui based)
- Location: \`packages/ui/src/components/\`

### File Location
- Create at: \`apps/webapp/src/routes/[path].tsx\`

### Patterns to Follow
- Reference: \`apps/webapp/src/routes/\` for existing patterns
- Use TanStack Router file-based routing
- Use \`useSuspenseQuery\` for data fetching
- Follow existing Tailwind patterns

### MUST DO
- Match the aesthetic language PRECISELY
- Implement all states (loading, empty, error)
- Ensure mobile responsiveness
- Use semantic HTML

### MUST NOT DO
- Do NOT use external UI libraries
- Do NOT create custom CSS files
- Do NOT deviate from the aesthetic language
- Do NOT skip empty/error states
`
})
```

## Verification Checklist

Before completing, verify:

- [ ] AESTHETIC_LANGUAGE.md captures the app's visual soul
- [ ] All screens from PRD are accounted for
- [ ] Screens are organized into logical flows
- [ ] Each prompt includes: Layout, Elements, Typography, States, Vibe
- [ ] Motion strategy is defined
- [ ] Build order is specified
- [ ] Each prompt is detailed enough for standalone implementation
