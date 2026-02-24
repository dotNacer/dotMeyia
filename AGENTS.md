# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Dotmeyia is a single SvelteKit full-stack application (frontend + backend in one service). It is an AI-powered note-taking app with Google OAuth login, Prisma ORM over PostgreSQL, and Google Gemini AI integration. The UI is in French.

### Services

| Service | How to run |
|---|---|
| **SvelteKit dev server** | `npm run dev` (port 5173) |
| **PostgreSQL** | Must be running on localhost:5432 before the app starts. Start with `sudo pg_ctlcluster 16 main start` |

### Key commands

- **Lint**: `npm run lint` (runs Prettier check + ESLint). Pre-existing formatting/lint warnings exist in the codebase.
- **Type check**: `npm run check` (runs `svelte-kit sync && svelte-check`). Two pre-existing type errors exist (better-auth API compat, virtual:pwa-register module).
- **Build**: `npm run build`
- **Dev server**: `npm run dev`
- **Prisma generate**: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dotmeyia npx prisma generate`
- **Prisma push schema**: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dotmeyia npx prisma db push`

### Non-obvious caveats

- **Prisma requires `DATABASE_URL` as an environment variable** (not just in `.env`). The `prisma.config.ts` uses `@prisma/config`'s `env()` which reads from process environment, not dotenv. Either export `DATABASE_URL` or prefix Prisma commands with it.
- **`.env` file** must be created from `.env.example`. The `DATABASE_URL` should be `postgresql://postgres:postgres@localhost:5432/dotmeyia`. Other secrets (`BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_API_KEY`) are injected as environment variables from Cursor Cloud secrets.
- **PostgreSQL database** named `dotmeyia` must exist. Create with: `sudo -u postgres psql -c "CREATE DATABASE dotmeyia;"`.
- **Google OAuth** is required for browser-based login. For API testing without OAuth, create a test user and API key directly in the database, then use `Authorization: Bearer <token>` header.
- **Package manager**: Use `npm` (lockfile is `package-lock.json`). A `bun.lock` also exists but npm is canonical (`.npmrc` has `engine-strict=true`).
- **Node.js >= 20** is required (specified in `engines` field).
