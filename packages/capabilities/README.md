# @printy-mobile/capabilities

Shared PDF templates, data services, and utilities for the Printy Mobile ecosystem.

## Structure

- `src/templates/`: React components for @react-pdf/renderer (thermal labels, receipts, etc.)
- `src/services/`: Data fetchers and parsers (GitHub, Linear, Recipe parsing, AI generation)
- `src/utils/`: Image processing (dithering) and other helpers
- `src/types.ts`: Shared data interfaces used across templates and services

## Usage

### Using Templates

```tsx
import { GithubIssueLabel } from "@printy-mobile/capabilities/templates";
import { renderToStream } from "@react-pdf/renderer";

const element = <GithubIssueLabel issue={data} />;
const stream = await renderToStream(element);
```

### Using Services

```ts
import { fetchGithubIssue } from "@printy-mobile/capabilities/services";

const data = await fetchGithubIssue("https://github.com/owner/repo/issues/1");
```

### Image Dithering

Thermal printers handle grayscale poorly. Use dithering to convert images to high-contrast 1-bit patterns.

```ts
import { ditherImage } from "@printy-mobile/capabilities/utils";

const ditheredBase64 = await ditherImage(imageUrl, 60, 60);
```

## Adding a New Template

1. Define the data interface in `src/types.ts`.
2. Create the `.tsx` component in `src/templates/` using `@react-pdf/renderer`.
3. Export the component in `src/templates/index.ts`.
4. Export the component in the root `src/index.ts`.
5. Add a corresponding endpoint in `apps/printer-api-service`.
