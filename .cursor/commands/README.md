# Cursor Commands - Navigation Guide

> 📚 **[Complete Documentation Index](../../DOCS_INDEX.md)** - All 80+ docs in one place

**Use slash commands in Cursor chat to invoke specialized agents for building features.**

## 🚀 Quick Start

### Type these commands in Cursor chat:

- **`/buildmockup`** - Build complete feature from mockup (backend + frontend)
- **`/tanstack_builder`** - Build TanStack Router pages (frontend only)
- **`/db`** - Database architecture expert

### First time here?
1. **Read:** `quick-start.md` (5 min) - Understand the workflow
2. **Memorize:** `critical-rules.md` (10 min) - Avoid 90% of bugs
3. **Use commands** - Let agents guide you

---

## 📚 Documentation Structure

### 🤖 Slash Commands (Agents)
Use these in Cursor chat with `/command`:
- **`/buildmockup`** - Build complete feature (backend + frontend)
- **`/tanstack_builder`** - Build TanStack Router pages
- **`/db`** - Database architecture expert

### 📖 Quick References
- **`quick-start.md`** - Complete feature workflow (~100 lines)
- **`critical-rules.md`** - 6 non-negotiable patterns (~250 lines)

### 📁 Pattern Files (Referenced by agents)
Pattern files agents reference for detailed implementations:

**Backend:**
- `patterns/backend/schema.md` - Database schema patterns
- `patterns/backend/dtos.md` - Validation with Zod
- `patterns/backend/api-routes.md` - Complete CRUD examples

**Frontend:**
- `patterns/frontend/tanstack-router.md` - Routing & data loading
- `patterns/frontend/data-fetching.md` - React Query patterns
- `patterns/frontend/forms.md` - TanStack Form patterns
- `patterns/frontend/components.md` - UI component standards

### 📜 Reference Materials
- **`LESSONS_LEARNED.md`** - What went wrong before
- **`README_COMMANDS.md`** - Legacy navigation guide

---

## 🎯 Common Tasks

### "I need to add a new feature from a mockup"
→ Use `/buildmockup` in Cursor chat

### "I need to build a frontend page"
→ Use `/tanstack_builder` in Cursor chat

### "I need database schema help"
→ Use `/db` in Cursor chat

### "I keep getting type errors"
→ Read `critical-rules.md` #1, #2, #5

### "My API route isn't working"
→ Read `critical-rules.md` ALL rules

### "I want to understand the workflow"
→ Read `quick-start.md` (100 lines)

### "I need specific pattern details"
→ Check `patterns/backend/` or `patterns/frontend/` files

---

## 📖 Usage Strategy

### For AI-Powered Development:
**Just use slash commands!** The agents handle the details.

1. Type `/buildmockup` in Cursor chat
2. Provide mockup and target path
3. Agent reads pattern files and builds feature

### For Manual Development:
1. Read `quick-start.md` (100 lines) - Understand workflow
2. Read `critical-rules.md` (250 lines) - Memorize patterns
3. Reference `patterns/` files as needed (~150-250 lines each)

**Total reading: ~500 lines max for any task**

---

## 🔍 File Organization

```
.cursor/commands/
├── README.md                    # This file (navigation guide)
│
├── 🤖 Slash Commands (invoke in Cursor)
│   ├── buildmockup.md          # Build complete feature
│   ├── tanstack_builder.md     # Build frontend pages
│   └── db.md                   # Database expert
│
├── 📖 Quick References
│   ├── quick-start.md          # Workflow guide (~100 lines)
│   └── critical-rules.md       # 6 essential patterns (~250 lines)
│
└── 📁 patterns/                 # Detailed patterns (agents reference these)
    ├── backend/
    │   ├── schema.md           # Database patterns
    │   ├── dtos.md             # Validation patterns
    │   └── api-routes.md       # API patterns
    └── frontend/
        ├── tanstack-router.md  # Router patterns
        ├── data-fetching.md    # React Query patterns
        ├── forms.md            # Form patterns
        └── components.md       # UI patterns
```

---

## 🎓 Learning Path

### Day 1: Get Started (30 min)
1. Read `quick-start.md` - Understand the workflow
2. Read `critical-rules.md` - Memorize the 6 rules
3. Try `/buildmockup` - Build your first feature

### Week 1: Master the Tools
- Use `/buildmockup` to build 2-3 features
- Agent will follow the patterns automatically
- Reference `critical-rules.md` when you see errors

### Week 2+: Deep Understanding
Read pattern files to understand WHY:
- `patterns/backend/` - Database, validation, API design
- `patterns/frontend/` - Routing, data fetching, forms

**Pro tip:** Let agents do the work, read docs to understand the "why"

---

## 🆘 Troubleshooting

### Agent Issues
- **"Type errors everywhere"** → Read `critical-rules.md` rules #1, #2, #5
- **"Validator not found"** → It's `zValidator` not `zodValidator` (rule #4)
- **"Auth not working"** → Use `c.var.user` not headers (rule #3)

### Manual Issues
- **"Where do I start?"** → Read `quick-start.md`
- **"What patterns to use?"** → Read `critical-rules.md`
- **"Need specific example?"** → Check `patterns/` files

---

## 💡 Best Practices

### Using Slash Commands:
1. **Be specific** - Provide mockup file path and target route path
2. **Let it work** - Agent will read pattern files and apply rules
3. **Review output** - Check against `critical-rules.md` for correctness

### File Organization:
- **Command files** (~200-300 lines) - Agent prompts with workflow
- **Pattern files** (~150-250 lines) - Detailed implementations
- **Quick refs** (~100-250 lines) - Essential knowledge

**Maximum file size: ~300 lines** (keeps AI focused and fast)

---

## 🔄 Maintaining These Docs

When you discover improvements:
1. **Critical pattern?** → Add to `critical-rules.md`
2. **Workflow change?** → Update command file (`buildmockup.md`, etc.)
3. **Implementation detail?** → Update pattern file in `patterns/`

Keep files concise - split if over 300 lines!

---

**🚀 Ready to build? Type `/buildmockup` in Cursor chat!**
