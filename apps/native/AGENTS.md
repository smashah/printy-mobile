# NATIVE (Expo + NativeWind)

## OVERVIEW

React Native mobile app using Expo Router (file-based navigation), NativeWind (Tailwind for RN), and shared monorepo packages.

## STRUCTURE

```
app/
├── _layout.tsx           # Root layout (providers, theme)
├── (drawer)/
│   ├── _layout.tsx       # Drawer navigation
│   ├── index.tsx         # Home screen
│   └── (tabs)/           # Tab navigation (nested)
├── modal.tsx             # Modal screen
└── +not-found.tsx        # 404 screen
components/               # Shared RN components
lib/
├── use-color-scheme.ts   # Theme hook
└── ...
utils/
└── api.ts                # Hono RPC client (same pattern as webapp)
```

## NAVIGATION

Uses Expo Router with nested navigation:

- **Drawer** at root level
- **Tabs** nested inside drawer
- **Modals** presented over current screen

```typescript
// app/(drawer)/_layout.tsx
<Drawer>
  <Drawer.Screen name="index" options={{ title: "Home" }} />
  <Drawer.Screen name="(tabs)" options={{ title: "Tabs" }} />
</Drawer>
```

## NATIVEWIND (Tailwind)

Configured via:

- `babel.config.js` - jsxImportSource: "nativewind"
- `metro.config.js` - withNativeWind wrapper
- `tailwind.config.js` - nativewind preset

```typescript
// ✅ Use className prop directly
<View className="flex-1 bg-background p-4">
  <Text className="text-lg font-bold">Hello</Text>
</View>
```

## CODE SHARING

Shares with webapp via monorepo:

- `@printy-mobile/api` - Type-safe Hono RPC client
- `@printy-mobile/config` - Project constants
- `@printy-mobile/common` - Shared utilities

**Note:** Cannot share `@printy-mobile/ui` (web-only shadcn/ui). Native components are local.

## API CLIENT

Same pattern as webapp:

```typescript
// utils/api.ts
import { hc } from "hono/client";
import type { AppType } from "@printy-mobile/api/client";

const getApiHost = () =>
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

export const backendClient = hc<AppType>(getApiHost(), {
  init: { credentials: "include" },
});
```

## COMMANDS

```bash
pnpm start    # Expo dev server
pnpm ios      # iOS simulator
pnpm android  # Android emulator
```
