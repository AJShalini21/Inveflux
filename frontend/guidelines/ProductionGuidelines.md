# Frontend Production Guidelines

Purpose
- Provide a concise checklist and reference for making frontend code production-ready and maintainable.

Principles
- Consistency: single source of truth for tokens, spacing, and component patterns.
- Predictability: clear folder structure and naming conventions.
- Safety: explicit types, null-safety, and defensive coding.
- Performance & accessibility by default.

Checklist (core items)

- Architecture & Folder Structure:
  - Keep `src/` organized by feature or domain (pages, components, services).
  - Reusable UI components live under `src/app/components` and follow single-responsibility.
  - Keep side-effect code (API, storage) in `services` or `hooks`.

- Styling & Design Tokens:
  - Centralize design tokens (colors, typography, spacing) in a single source (e.g., `src/styles/tokens.ts` or Tailwind config).
  - Never scatter raw hex/rgb values in components — import token names.
  - Use semantic token names (e.g., `color-bg-primary`, `color-text-muted`).
  - If using Tailwind, define theme colors and spacing in `tailwind.config.ts`.

- Spacing & Layout:
  - Use tokenized spacing (e.g., `space-4`, `spacing.md`) instead of arbitrary pixel values.
  - Follow a 4px or 8px grid and document exceptions.

- Components & Props:
  - Small, focused components with explicit prop types (`interface Props` in TypeScript).
  - Default props or safe destructuring with default values to avoid `undefined`.
  - Use composition (slots/children) over large boolean prop switches.
  - Keep presentational logic separate from business logic.

- TypeScript & Null Safety:
  - Enable `strict` mode in `tsconfig.json`.
  - Avoid `any` — prefer precise types, union types, and generics where suitable.
  - Prefer optional chaining (`?.`) and nullish coalescing (`??`) for safety.
  - Use non-null assertions (`!`) only when provably safe.

- State Management & Side Effects:
  - Keep local UI state in components; shared state via a single store or context.
  - Side effects in `useEffect` with well-defined dependencies.
  - Avoid deeply nested state; normalize shapes for collections.

- Error Handling & Boundaries:
  - Use React Error Boundaries for top-level component trees.
  - Gracefully handle API errors with clear UI states (loading, empty, error).

- Accessibility (A11y):
  - Use semantic HTML and ARIA attributes where necessary.
  - Ensure keyboard navigation and focus management for interactive components.
  - Run automated checks (axe, Lighthouse) and address failures.

- Performance:
  - Code-split routes and lazy-load heavy components.
  - Memoize pure components and expensive calculations (`React.memo`, `useMemo`).
  - Avoid unnecessary re-renders — prefer immutable updates.

- Testing:
  - Unit tests for components and utilities (Vitest / Jest + Testing Library).
  - Integration / E2E tests for critical flows (Cypress / Playwright).
  - Snapshot tests for stable presentation logic when appropriate.

- Linting, Formatting & Pre-commit:
  - Enforce ESLint and Prettier with consistent rules.
  - Use `husky` + `lint-staged` to run format/lint on commit.
  - Optional: commit-msg linting and PR template.

- CI / Quality Gates:
  - Run typecheck, lint, tests, and build in CI on PRs.
  - Fail PRs with breaking type/lint/test errors.

- Documentation & Onboarding:
  - Keep small README or `CONTRIBUTING.md` for frontend developer setup.
  - Document design token usage and component patterns.

Recommended Tooling
- TypeScript with `strict` mode
- ESLint (with recommended React + TypeScript rules)
- Prettier for formatting
- Tailwind CSS or Design Token library + `style-dictionary` for multi-platform tokens
- Storybook for isolated component development
- Vitest / Jest + Testing Library for unit tests
- Cypress / Playwright for E2E tests
- Lighthouse / PageSpeed / Web Vitals for performance monitoring
- Husky + lint-staged for pre-commit checks

Examples and snippets

- Color tokens (example `src/styles/tokens.ts`):

```ts
export const colors = {
  'color-bg-primary': '#0f172a',
  'color-bg-secondary': '#0b1220',
  'color-text-primary': '#e6eef8',
  'color-text-muted': '#9aa7bf',
};
```

- Spacing tokens (example):

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

- Component template (TypeScript + safe defaults):

```tsx
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick = () => {}, disabled = false }) => {
  return (
    <button disabled={disabled} onClick={onClick} aria-disabled={disabled}>
      {label}
    </button>
  );
};
```

Next steps (recommended)
- Add centralized tokens file (`src/styles/tokens.ts`) and replace raw colors.
- Run ESLint + TypeScript checks and fix errors.
- Optionally, I can scan the frontend for hardcoded color literals, inline styles, and unsafe `any` usage.

If you want, I can run a scan now and produce a per-folder report of issues and suggested changes.
