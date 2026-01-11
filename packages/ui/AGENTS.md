# UI PACKAGE (shadcn/ui)

## OVERVIEW

Shared component library based on shadcn/ui, Radix primitives, and Tailwind. Used by webapp and backoffice.

## STRUCTURE

```
src/
├── components/
│   ├── button.tsx       # Core primitives (80+ components)
│   ├── input.tsx
│   ├── card.tsx
│   ├── data-table.tsx   # Complex interactive table (808 lines)
│   ├── file-upload.tsx  # Multi-mode upload (1123 lines)
│   ├── sidebar.tsx      # Collapsible sidebar (774 lines)
│   ├── stepper.tsx      # Multi-step navigation
│   └── refine-ui/       # Refine-specific wrappers
│       ├── buttons/     # Refine action buttons
│       ├── layout/      # Refine layout components
│       ├── views/       # List/Show/Create/Edit views
│       └── data-table/  # Refine data table (filter: 977 lines)
├── hooks/               # Shared hooks
├── lib/                 # Utilities (cn, etc.)
└── globals.css          # Tailwind base styles
```

## COMPONENT PATTERN

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md...",
  {
    variants: {
      variant: { default: "...", destructive: "...", outline: "..." },
      size: { default: "h-10 px-4", sm: "h-9 px-3", lg: "h-11 px-8" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);

export { Button, buttonVariants };
```

## LARGE FILES (NOT GOD FILES)

These are legitimately complex, feature-rich components:

- `file-upload.tsx` (1123) - Multi-mode upload, drag-drop, progress
- `data-table-filter.tsx` (977) - Advanced filtering system
- `dropdrawer.tsx` (972) - Responsive dropdown/drawer hybrid
- `data-table.tsx` (808) - Full-featured interactive table
- `sidebar.tsx` (774) - Collapsible with keyboard shortcuts

**Don't split** - complexity matches functionality.

## CONVENTIONS

- Named exports (not default)
- Export both component and variants: `export { Button, buttonVariants }`
- Props extend HTML element attributes
- Use `cn()` for class merging
- PascalCase components, kebab-case files

## ADDING COMPONENTS

```bash
# Use shadcn CLI (from packages/ui)
npx shadcn@latest add [component]
```

Or manually create following the pattern above.
