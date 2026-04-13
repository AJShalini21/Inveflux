# Tooling & Recommended Configs (Frontend)

Goal
- Provide minimal, production-ready tooling and sample configs to enforce quality and consistency.

Essentials
- TypeScript: `strict` mode enabled in `tsconfig.json`.
- ESLint: React + TypeScript rules, with code-style rules aligned to Prettier.
- Prettier: single source of formatting.
- Husky + lint-staged: run lint/format on staged files.
- Tailwind (if used): centralized `tailwind.config.ts` theme tokens.
- Storybook (optional): component dev and visual tests.
- Vitest + Testing Library: unit tests; Cypress/Playwright for E2E.

Quick setup commands (npm):

```bash
cd frontend
npm init -y
npm install -D typescript eslint prettier husky lint-staged @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-config-prettier eslint-plugin-jsx-a11y vite vitest @testing-library/react
npx tsc --init
npx husky install
```

Minimal config snippets

- `tsconfig.json` (important bits)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["DOM", "ES2022"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

- `.eslintrc.cjs` (core rules)

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};
```

- `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "all",
  "arrowParens": "always"
}
```

Husky + lint-staged example in `package.json`:

```json
"husky": {
  "hooks": {
    "pre-commit": "npx lint-staged"
  }
},
"lint-staged": {
  "src/**/*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]
}
```

Tailwind notes
- If using Tailwind, define colors and spacing in `tailwind.config.ts` and keep `src/styles/tokens.ts` in sync.

Verification steps
- Run `npm run build`, `npm run lint`, and `npm run test` in CI for PRs.

Next actions I can take
- Add the minimal `tsconfig.json`, `.eslintrc.cjs`, `.prettierrc`, and `lint-staged` entries to `package.json`.
- Add `src/styles/tokens.ts` (starter tokens) and update a few components to use them.
- Run an automated fix pass (ESLint --fix + Prettier) and produce a patch.

Tell me which of the next actions you'd like me to perform.