# InveFlux

InveFlux is a full-stack inventory & financial insights dashboard designed to help operations and finance teams monitor stock health, velocity, vendor risk, and financial performance.

Key features
- Real-time stock pulse and inventory health metrics
- Inventory velocity and risk product tracking
- Vendor performance and payables insights
- Financial dashboards (revenue, margins, profit flows)

High level architecture
- Backend: Java (Maven) Spring Boot service providing REST APIs (located in `backend/`).
- Frontend: React + TypeScript app built with Vite (located in `frontend/`).
- Database: migrations live under `backend/src/main/resources/db/migration`.
- Docs and artifacts: `docs/` contains API design, ER diagrams and other references.

Tech stack
- Backend: Java, Spring Boot, Maven
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Charts: Recharts
- Testing: JUnit (backend), Vitest / Testing Library (recommended for frontend)

Quickstart

1) Backend (run from repo root)

```bash
cd backend
# build
mvn clean package
# run (development)
mvn spring-boot:run
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Notes: the frontend expects the backend APIs to be available under `/api` or the configured base URL (see `frontend/src/app/services/*` for endpoints). Adjust proxy or environment variables as needed.

Linting, formatting & quality
- Frontend uses ESLint + Prettier. Run:

```bash
cd frontend
npm run lint
npm run lint:fix
npm run format
```

- Backend: run `mvn verify` to run tests and checks.

Design tokens & theming
- JS tokens: `frontend/src/styles/tokens.ts` — import these in components for consistent color/spacing.
- CSS variables: `frontend/src/styles/theme.css` contains CSS custom properties mapped to tokens and tailwind.
- Tailwind config: `frontend/tailwind.config.ts` maps CSS vars to utility colors.
- Migration helper: `frontend/scripts/migrate-to-css-vars.js` can replace common hex literals with CSS variables.

Developer workflow suggestions
- Use the `pages -> components -> all` staged migration approach when replacing hardcoded values.
- Add CI checks to run `npm run lint`, `npm run test`, and `mvn -q -DskipTests=false verify` on PRs.
- Use `husky` + `lint-staged` for pre-commit formatting.

Contributing
- Create feature branches from `main` and open pull requests with meaningful titles and short descriptions of changes.
- Add tests for non-trivial logic and update docs in `docs/` when changing API contracts or data models.

Contact
- For questions about the codebase or architecture, open an issue or ping the maintainer in the repo.
