# Project Constitution Addendum: Mockups Consumption

Effective Date: 2025-10-16

## Purpose

To codify how agents interpret and implement content from `mockups/` alongside `notes/PRD.md`, ensuring consistency with the design system and architectural standards.

## Articles

### Article 1 — Source of Truth Ordering

1. `notes/PRD.md` defines requirements and acceptance criteria.
2. `mockups/` defines structure and responsive layout for pages/flows.
3. Implementation must conform to the design system in `@printy-mobile/ui`.

When conflicts arise: PRD > Constitution > Mockups.

### Article 2 — Styling & Design System

- Agents must not attempt pixel-identical reproduction of mockup styling.
- Agents must exclusively use components from `@printy-mobile/ui` and existing utility patterns.
- Introduction of new UI libraries or ad-hoc CSS requires explicit approval.

### Article 3 — App Shell Scope

- Unless a mockup folder or `notes.md` explicitly states a shell change, ignore the global header, sidebar, and footer depicted in mockups.
- Scope each implementation to the specific page/flow content.

### Article 4 — Accessibility & Responsiveness

- All implementations must adhere to the Accessibility and Code Quality rules defined for the repository.
- Responsiveness inferred from mockups must be implemented using existing layout utilities and `@printy-mobile/ui` components.

### Article 5 — Planning via Manifest

- If `mockups/manifest.json` is present, plan work by its `pages[].priority`, `routeHint`, and `flows[]` ordering.
- Skip `status: "done"` entries; plan `todo` and `in-progress`.

### Article 6 — Enforcement

- PR reviewers should verify adherence to this addendum.
- Agents should load `.cursor/rules/mockups.mdc` prior to planning.

---

Amendments to this addendum require updating this document and referencing the effective date.
