# Dotmeyia Project Context

## Project Overview
Dotmeyia is a SvelteKit web application built with TypeScript. It functions as a note-taking and context management platform, likely integrating AI capabilities for content generation or organization. The project uses a modern stack focusing on performance, type safety, and a component-driven UI.

## Tech Stack
*   **Framework:** SvelteKit (Svelte 5)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Tailwind Variants, `clsx`
*   **UI Components:** Likely Shadcn-svelte / Bits UI (found in `src/lib/components/ui`)
*   **Database:** PostgreSQL (via Prisma ORM)
*   **Authentication:** Better Auth (with Google provider)
*   **AI Integration:** Vercel AI SDK (`@ai-sdk/google`, `@ai-sdk/svelte`)
*   **PWA:** `@vite-pwa/sveltekit` for Progressive Web App capabilities
*   **State Management:** Svelte stores (found in `src/lib/stores`)
*   **Deployment:** Node.js adapter, configured with Nixpacks

## Project Structure
*   `src/routes`: File-based routing for pages and API endpoints.
    *   `(app)`: Main application routes (protected).
    *   `(auth)`: Authentication routes (login).
    *   `api`: Backend API endpoints.
*   `src/lib`: Shared utilities and components.
    *   `server`: Server-side only logic (Auth, Prisma client).
    *   `components`: Reusable UI components.
    *   `stores`: Global state management (`theme`, `notes`, `contexts`).
    *   `hooks`: Custom Svelte hooks/runes (e.g., `is-mobile.svelte.ts`).
*   `prisma`: Database schema and migrations.
*   `static`: Static assets (favicon, manifest).

## Key Commands

### Development
```bash
npm run dev        # Start development server
npm run check      # Run Svelte check (types)
npm run format     # Format code with Prettier
npm run lint       # Lint code with ESLint
```

### Database (Prisma)
```bash
npx prisma generate # Generate Prisma client
npx prisma db push  # Push schema changes to the database
# Note: Check package.json for other potential custom scripts
```

### Build & Production
```bash
npm run build      # Build for production
npm run preview    # Preview production build
```

## Configuration Highlights

### SvelteKit Config (`svelte.config.js`)
*   Uses `@sveltejs/adapter-node`.
*   Configured with `vitePreprocess`.
*   Enables experimental remote functions and async compiler options.

### Vite Config (`vite.config.ts`)
*   Includes `SvelteKitPWA` plugin for offline support and installation.
*   Defines `global` as `globalThis` (polyfill).
*   SSR configurations for AI SDK.

### Authentication (`src/lib/server/auth.ts`)
*   Implemented using `better-auth`.
*   Uses Prisma adapter for persistence.
*   Configured with Google OAuth (requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`).

### Deployment (`nixpacks.toml`)
*   Builds using Node.js and Python providers.
*   Build command: `npx prisma generate && npm run build`.
*   Start command: `node build`.

## coding Conventions
*   **Svelte 5:** The codebase uses Svelte 5 features, specifically runes (e.g., `$props()` in `+layout.svelte`, `.svelte.ts` files in `hooks`).
*   **Tailwind:** Utility-first styling with `tailwind-merge` and `clsx` for class composition.
*   **Imports:** Uses path aliases (e.g., `$lib`) extensively.
