# Screen Inventory

Generated from: `notes/PRD.md`
Total Screens: 13
Total Flows: 4

## Flow 1: Foundation (Core Experience)

| #   | Screen          | Route            | Priority | Status  |
| --- | --------------- | ---------------- | -------- | ------- |
| 1   | Welcome         | `/welcome`       | P0       | Pending |
| 2   | Dashboard       | `/` (tabs)       | P0       | Pending |
| 3   | Device Scan     | `/device/scan`   | P0       | Pending |
| 4   | Template Editor | `/templates/:id` | P0       | Pending |

## Flow 2: Identity & Pro

| #   | Screen      | Route           | Priority | Status  |
| --- | ----------- | --------------- | -------- | ------- |
| 5   | Sign In     | `/auth/sign-in` | P1       | Pending |
| 6   | Pro Upgrade | `/pro/upgrade`  | P1       | Pending |
| 7   | Settings    | `/settings`     | P1       | Pending |

## Flow 3: Creative Studio (Consumer)

| #   | Screen        | Route               | Priority | Status  |
| --- | ------------- | ------------------- | -------- | ------- |
| 8   | AI Studio     | `/studio/ai`        | P2       | Pending |
| 9   | AI Preview    | `/studio/ai/result` | P2       | Pending |
| 10  | Recipe Import | `/studio/recipe`    | P2       | Pending |

## Flow 4: Developer Tools (Pro)

| #   | Screen      | Route           | Priority | Status  |
| --- | ----------- | --------------- | -------- | ------- |
| 11  | Webhooks    | `/pro/webhooks` | P2       | Pending |
| 12  | Bridge Mode | `/pro/bridge`   | P2       | Pending |
| 13  | Bridge Keys | `/pro/keys`     | P2       | Pending |

## Build Order

1. **Flow 1**: Dashboard & Device Scan (Must be able to print first).
2. **Flow 1**: Template Editor (Core utility).
3. **Flow 2**: Sign In & Settings (Persisting data).
4. **Flow 3**: Creative Studio (AI features).
5. **Flow 4**: Dev Tools (Advanced Pro features).
