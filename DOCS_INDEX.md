# Documentation Index

**Complete reference of all documentation files in this project.**

> 💡 **Tip:** When looking for guidance, check this index first to find the right file.

---

## 🚀 Getting Started

**Start here for setup and overview:**

| File                                       | Description                   | Audience      |
| ------------------------------------------ | ----------------------------- | ------------- |
| [`README.md`](./README.md)                 | Project overview and setup    | Everyone      |
| [`TEMPLATE_SETUP.md`](./TEMPLATE_SETUP.md) | Template initialization guide | New projects  |
| [`CLAUDE.md`](./CLAUDE.md)                 | Claude Code integration guide | AI assistants |
| [`AGENTS.md`](./AGENTS.md)                 | AI agent configurations       | AI assistants |

---

## 📚 Project Documentation

**Core project documentation in `/notes/`:**

| File                                                             | Description              | When to Read               |
| ---------------------------------------------------------------- | ------------------------ | -------------------------- |
| [`notes/AI_READ_THIS.md`](./notes/AI_READ_THIS.md)               | Essential AI context     | AI assistants              |
| [`notes/STACK.md`](./notes/STACK.md)                             | Technology stack details | Understanding architecture |
| [`notes/PRD.md`](./notes/PRD.md)                                 | Product requirements     | Planning features          |
| [`notes/TODO.md`](./notes/TODO.md)                               | Current task list        | Planning work              |
| [`notes/DEVLOG.md`](./notes/DEVLOG.md)                           | Development changelog    | Tracking progress          |
| [`notes/CONSTITUTION.md`](./notes/CONSTITUTION.md)               | Project principles       | Setting standards          |
| [`notes/SYSTEM_ARCHITECTURE.md`](./notes/SYSTEM_ARCHITECTURE.md) | System design            | Understanding structure    |
| [`notes/PRODUCTION_FIXES.md`](./notes/PRODUCTION_FIXES.md)       | Production issues log    | Troubleshooting            |
| [`notes/12F.md`](./notes/12F.md)                                 | 12-Factor App compliance | Best practices             |

---

## 🤖 Cursor Commands (Slash Commands)

**Use these in Cursor chat with `/command`:**

### Primary Commands

| Command             | File                                                                             | Description                                 | Lines |
| ------------------- | -------------------------------------------------------------------------------- | ------------------------------------------- | ----- |
| `/buildmockup`      | [`.cursor/commands/buildmockup.md`](./.cursor/commands/buildmockup.md)           | Build complete feature (backend + frontend) | ~250  |
| `/tanstack_builder` | [`.cursor/commands/tanstack_builder.md`](./.cursor/commands/tanstack_builder.md) | Build TanStack Router pages                 | ~250  |
| `/db`               | [`.cursor/commands/db.md`](./.cursor/commands/db.md)                             | Database architecture expert                | ~130  |

### Supporting Commands

| Command            | File                                                                           | Description             |
| ------------------ | ------------------------------------------------------------------------------ | ----------------------- |
| `/plan`            | [`.cursor/commands/plan.md`](./.cursor/commands/plan.md)                       | Project planning agent  |
| `/implement`       | [`.cursor/commands/implement.md`](./.cursor/commands/implement.md)             | Implementation agent    |
| `/specify`         | [`.cursor/commands/specify.md`](./.cursor/commands/specify.md)                 | Specification writer    |
| `/tasks`           | [`.cursor/commands/tasks.md`](./.cursor/commands/tasks.md)                     | Task breakdown agent    |
| `/dba`             | [`.cursor/commands/dba.md`](./.cursor/commands/dba.md)                         | Database administrator  |
| `/gc`              | [`.cursor/commands/gc.md`](./.cursor/commands/gc.md)                           | Git commit helper       |
| `/mockupnotes`     | [`.cursor/commands/mockupnotes.md`](./.cursor/commands/mockupnotes.md)         | Mockup analyzer         |
| `/route_architect` | [`.cursor/commands/route_architect.md`](./.cursor/commands/route_architect.md) | Route structure planner |

### SpecKit Commands

| Command                 | File                                                                                     | Description                |
| ----------------------- | ---------------------------------------------------------------------------------------- | -------------------------- |
| `/speckit.analyze`      | [`.cursor/commands/speckit.analyze.md`](./.cursor/commands/speckit.analyze.md)           | Analyze requirements       |
| `/speckit.plan`         | [`.cursor/commands/speckit.plan.md`](./.cursor/commands/speckit.plan.md)                 | Create implementation plan |
| `/speckit.specify`      | [`.cursor/commands/speckit.specify.md`](./.cursor/commands/speckit.specify.md)           | Write specifications       |
| `/speckit.implement`    | [`.cursor/commands/speckit.implement.md`](./.cursor/commands/speckit.implement.md)       | Implement features         |
| `/speckit.checklist`    | [`.cursor/commands/speckit.checklist.md`](./.cursor/commands/speckit.checklist.md)       | Generate checklists        |
| `/speckit.clarify`      | [`.cursor/commands/speckit.clarify.md`](./.cursor/commands/speckit.clarify.md)           | Clarify requirements       |
| `/speckit.tasks`        | [`.cursor/commands/speckit.tasks.md`](./.cursor/commands/speckit.tasks.md)               | Break down tasks           |
| `/speckit.constitution` | [`.cursor/commands/speckit.constitution.md`](./.cursor/commands/speckit.constitution.md) | Project constitution       |

### Quick References

| File                                                                         | Description               | Lines |
| ---------------------------------------------------------------------------- | ------------------------- | ----- |
| [`.cursor/commands/README.md`](./.cursor/commands/README.md)                 | Command navigation guide  | ~190  |
| [`.cursor/commands/quick-start.md`](./.cursor/commands/quick-start.md)       | 5-step feature workflow   | ~100  |
| [`.cursor/commands/critical-rules.md`](./.cursor/commands/critical-rules.md) | 6 essential API patterns  | ~250  |
| [`.cursor/commands/constitution.md`](./.cursor/commands/constitution.md)     | Command system principles | N/A   |

### Reference Materials

| File                                                                                         | Description            |
| -------------------------------------------------------------------------------------------- | ---------------------- |
| [`.cursor/commands/LESSONS_LEARNED.md`](./.cursor/commands/LESSONS_LEARNED.md)               | What went wrong before |
| [`.cursor/commands/GENERICIZATION_SUMMARY.md`](./.cursor/commands/GENERICIZATION_SUMMARY.md) | Documentation history  |
| [`.cursor/commands/README_COMMANDS.md`](./.cursor/commands/README_COMMANDS.md)               | Legacy command guide   |

---

## 🎯 Cursor Rules (Always Active)

**Automatic guidance applied to all AI interactions:**

| File                                                           | Scope           | Description                   |
| -------------------------------------------------------------- | --------------- | ----------------------------- |
| [`.cursor/rules/general.mdc`](./.cursor/rules/general.mdc)     | All files       | General coding standards      |
| [`.cursor/rules/backend.mdc`](./.cursor/rules/backend.mdc)     | Backend code    | Backend development patterns  |
| [`.cursor/rules/api.mdc`](./.cursor/rules/api.mdc)             | API routes      | API endpoint patterns         |
| [`.cursor/rules/frontend.mdc`](./.cursor/rules/frontend.mdc)   | Frontend code   | Frontend development patterns |
| [`.cursor/rules/jobs.mdc`](./.cursor/rules/jobs.mdc)           | Background jobs | Trigger.dev patterns          |
| [`.cursor/rules/mockups.mdc`](./.cursor/rules/mockups.mdc)     | Mockup work     | Mockup implementation         |
| [`.cursor/rules/ai.mdc`](./.cursor/rules/ai.mdc)               | AI interactions | AI coding guidelines          |
| [`.cursor/rules/ultracite.mdc`](./.cursor/rules/ultracite.mdc) | Full-stack      | Comprehensive patterns        |

---

## 🏗️ Architecture & Patterns

### API Documentation

| File                                                     | Description                        |
| -------------------------------------------------------- | ---------------------------------- |
| [`apps/api/README.md`](./apps/api/README.md)             | API overview and commands          |
| [`apps/api/API-PATTERNS.md`](./apps/api/API-PATTERNS.md) | Critical API patterns (must read!) |
| [`apps/api/D1-explained.md`](./apps/api/D1-explained.md) | Cloudflare D1 database guide       |

### Frontend Documentation

| File                                               | Description     |
| -------------------------------------------------- | --------------- |
| [`apps/webapp/README.md`](./apps/webapp/README.md) | Webapp overview |

---

## 📦 Package Documentation

### Database Package

| File                                                                                                                                                     | Description               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| [`packages/db/README.md`](./packages/db/README.md)                                                                                                       | Database package overview |
| [`packages/db/CLAUDE.md`](./packages/db/CLAUDE.md)                                                                                                       | Database package AI guide |
| [`packages/db/scripts/README.md`](./packages/db/scripts/README.md)                                                                                       | Database scripts          |
| [`packages/db/src/utils/README.md`](./packages/db/src/utils/README.md)                                                                                   | Database utilities        |
| **Rule:** [`packages/db/.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`](./packages/db/.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc) | Bun usage guide           |

### Auth Package

| File                                                                                                                                                         | Description           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| [`packages/auth/README.md`](./packages/auth/README.md)                                                                                                       | Auth package overview |
| [`packages/auth/CLAUDE.md`](./packages/auth/CLAUDE.md)                                                                                                       | Auth package AI guide |
| **Rule:** [`packages/auth/.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`](./packages/auth/.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc) | Bun usage guide       |

### Common Package

| File                                                                                                                                                             | Description               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| [`packages/common/README.md`](./packages/common/README.md)                                                                                                       | Common utilities overview |
| [`packages/common/CLAUDE.md`](./packages/common/CLAUDE.md)                                                                                                       | Common package AI guide   |
| **Rule:** [`packages/common/.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`](./packages/common/.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc) | Bun usage guide           |

### Other Packages

| File                                                                           | Description          |
| ------------------------------------------------------------------------------ | -------------------- |
| [`packages/ui/README.md`](./packages/ui/README.md)                             | UI components        |
| [`packages/config/README.md`](./packages/config/README.md)                     | Shared configuration |
| [`packages/eslint-config/README.md`](./packages/eslint-config/README.md)       | ESLint configs       |
| [`packages/jobs/src/trigger/README.md`](./packages/jobs/src/trigger/README.md) | Background jobs      |

---

## 🎨 Mockups

| File                                                                               | Description          |
| ---------------------------------------------------------------------------------- | -------------------- |
| [`mockups/README.md`](./mockups/README.md)                                         | Mockup system guide  |
| [`mockups/example-landing-page/notes.md`](./mockups/example-landing-page/notes.md) | Example mockup notes |

---

## 🔧 Tool Configurations

### Claude Code

| File                                   | Description           |
| -------------------------------------- | --------------------- |
| [`.claude/api.mdc`](./.claude/api.mdc) | Claude Code API rules |

### GitHub Copilot

| File                                                                   | Description          |
| ---------------------------------------------------------------------- | -------------------- |
| [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Copilot instructions |

### Specify AI

| File                                                                                       | Description          |
| ------------------------------------------------------------------------------------------ | -------------------- |
| [`.specify/memory/constitution.md`](./.specify/memory/constitution.md)                     | Specify constitution |
| [`.specify/templates/agent-file-template.md`](./.specify/templates/agent-file-template.md) | Agent template       |
| [`.specify/templates/checklist-template.md`](./.specify/templates/checklist-template.md)   | Checklist template   |
| [`.specify/templates/plan-template.md`](./.specify/templates/plan-template.md)             | Plan template        |
| [`.specify/templates/spec-template.md`](./.specify/templates/spec-template.md)             | Spec template        |
| [`.specify/templates/tasks-template.md`](./.specify/templates/tasks-template.md)           | Tasks template       |

---

## 💡 AI Notes

| File                                                                         | Description               |
| ---------------------------------------------------------------------------- | ------------------------- |
| [`ai_notes/suggested-improvements.md`](./ai_notes/suggested-improvements.md) | AI-suggested improvements |

---

## 📍 Quick Navigation

### By Task:

- **Starting new project** → [`TEMPLATE_SETUP.md`](./TEMPLATE_SETUP.md)
- **Understanding architecture** → [`notes/STACK.md`](./notes/STACK.md)
- **Building a feature** → [`.cursor/commands/buildmockup.md`](./.cursor/commands/buildmockup.md)
- **Creating API routes** → [`apps/api/API-PATTERNS.md`](./apps/api/API-PATTERNS.md)
- **Building frontend** → [`.cursor/commands/tanstack_builder.md`](./.cursor/commands/tanstack_builder.md)
- **Database work** → [`.cursor/commands/db.md`](./.cursor/commands/db.md)
- **Quick reference** → [`.cursor/commands/critical-rules.md`](./.cursor/commands/critical-rules.md)

### By Role:

- **Developer** → Start with [`CLAUDE.md`](./CLAUDE.md) + [`.cursor/commands/quick-start.md`](./.cursor/commands/quick-start.md)
- **AI Assistant** → Read [`notes/AI_READ_THIS.md`](./notes/AI_READ_THIS.md) + [`.cursor/commands/README.md`](./.cursor/commands/README.md)
- **Product Manager** → Check [`notes/PRD.md`](./notes/PRD.md) + [`notes/TODO.md`](./notes/TODO.md)
- **DevOps** → Review [`notes/SYSTEM_ARCHITECTURE.md`](./notes/SYSTEM_ARCHITECTURE.md) + [`notes/12F.md`](./notes/12F.md)

---

## 📊 Documentation Stats

- **Total documentation files:** 80+
- **Slash commands:** 17
- **Cursor rules:** 8
- **Package docs:** 15+
- **Quick references:** 3

---

## 🔄 Keeping This Index Updated

When adding new documentation:

1. **Add file to appropriate section above**
2. **Update stats at bottom**
3. **Add to quick navigation if frequently used**

---

**💡 Can't find what you need? Check [`.cursor/commands/README.md`](./.cursor/commands/README.md) for guidance on using slash commands.**
