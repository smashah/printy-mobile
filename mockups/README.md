# Mockups

This directory holds UI/UX mockups that guide vibe-driven implementation alongside the PRD.

## How to organize

- One subfolder per page or flow: `mockups/<slug>/`
- Include any of the following:
  - `design.html` — exported static HTML (optional)
  - `screenshot.png` or `*.jpg/webp` — screenshots (optional)
  - `notes.md` — key UX notes, flows, edge cases (recommended)
  - `assets/` — images, icons, or supporting files

Example:

```
mockups/
  landing-page/
    design.html
    screenshot.png
    notes.md
    assets/
      hero.png
```

## Naming conventions

- Use lowercase-kebab-case for folders: `trip-create`, `profile-settings`
- Prefer concise slugs that map to routes when possible

## Agent consumption

- The vibe coding agent scans `mockups/` and the PRD (`notes/PRD.md`).
- For each folder, it will:
  - Parse `design.html` when present to extract layout and components
  - Use `notes.md` to clarify behaviors and edge cases
  - Fall back to image heuristics when only screenshots exist

## Optional manifest

- You can add a `manifest.json` in this directory to declare priorities and routing hints.
- See `manifest.schema.json` for supported fields.

## Agent Policy (must follow)

- Structure over styling: treat mockups as layout/responsiveness references; do not replicate pixel-exact styles unless explicitly requested.
- UI components only: use components exported by `@printy-mobile/ui` and do not introduce other UI libraries.
- App shell scope: ignore headers/sidebars/footers unless the mockup folder or `notes.md` explicitly indicates an app shell change.
- A11y + responsive: preserve accessibility and implement responsive behavior implied by the mockup without bespoke CSS.
- Minimal custom CSS: prefer existing utilities; avoid new styling unless required by existing patterns.

See also: `.cursor/rules/mockups.mdc` for full agent rules.
