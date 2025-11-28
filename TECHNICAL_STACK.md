# Technical Stack - DotMeyia

## Architecture Overview

DotMeyia uses a modern full-stack architecture based on SvelteKit with a JAMstack approach, integrating cutting-edge technologies to deliver optimal user experience and high performance.

## Frontend

### Core Framework
- **SvelteKit 2.16+** : Modern full-stack framework with server-side rendering (SSR)
- **Svelte 5.0+** : Reactive framework with new runes syntax (`$state`, `$derived`, `$props`)
- **TypeScript 5.0+** : Static typing for code safety and better DX

### Build Tools and Bundler
- **Vite 6.2+** : Ultra-fast bundler with HMR (Hot Module Replacement)
- **PostCSS** : CSS post-processor with autoprefixer
- **Tailwind CSS 3.4+** : Utility-first CSS framework for rapid and consistent styling

### Styling and UI
- **Tailwind CSS** : Utility-first CSS framework
  - `tailwindcss-animate` : Ready-to-use CSS animations
  - `tailwind-merge` : Intelligent Tailwind class merging
  - `tailwind-variants` : Component variant creation
- **Bits UI** : Headless UI components for Svelte
- **clsx** : Utility for managing conditional CSS classes

### Animations and Interactions
- **GSAP 3.13+** : Advanced animation library
- **Svelte Transitions** : Native Svelte animations (`fly`, `flip`, etc.)
- **Svelte Sonner** : Modern toast notifications

### Icons
- **Lucide Svelte 0.488+** : Modern and consistent SVG icons
- **@lucide/svelte** : Official Svelte version

## Backend and API

### Backend Framework
- **SvelteKit API Routes** : Integrated REST API
- **Server Hooks** : Middleware for authentication and session management

### Database
- **PostgreSQL** : Robust relational database
- **Prisma 6.6+** : Modern ORM with type safety
  - `@prisma/client` : Auto-generated client
  - Automatic migrations
  - Schema-first development

### Authentication
- **Better Auth 1.2+** : Modern authentication solution
  - Multi-provider support (OAuth, credentials)
  - Secure session management
  - Built-in CSRF protection

## Artificial Intelligence

### SDK and Integrations
- **Google AI SDK 1.2+** : Official integration with Google AI models
- **AI SDK 4.3+** : Framework for AI applications
- **@ai-sdk/svelte 2.1+** : Svelte components for AI

### AI Utilities
- **Marked 15.0+** : Markdown parser for AI content rendering
- **Crypto 1.0+** : Cryptography utilities for security

## Development Tools

### Linting and Formatting
- **ESLint 9.18+** : JavaScript/TypeScript linter
  - `@eslint/js` : Modern JavaScript configuration
  - `eslint-plugin-svelte` : Svelte-specific rules
  - `typescript-eslint` : Advanced TypeScript support
- **Prettier 3.4+** : Code formatter
  - `prettier-plugin-svelte` : Svelte support
  - `prettier-plugin-tailwindcss` : Automatic Tailwind class sorting

### Type Checking
- **Svelte Check 4.0+** : Type checking for Svelte
- **TypeScript** : Compiler and type checker

### Development Mode
- **Mode Watcher 1.0+** : Mode change monitoring (dark/light)

## Dependency Management

### Package Managers
- **npm** : Primary package manager
- **Bun** : Fast alternative (lock file present)

### Configuration
- **components.json** : UI components configuration
- **.npmrc** : npm configuration
- **nixpacks.toml** : Deployment configuration

## Folder Structure

```
src/
├── lib/
│   ├── components/     # Reusable components
│   │   ├── ui/        # Base UI components
│   │   ├── auth/      # Authentication components
│   │   ├── dashboard/ # Dashboard components
│   │   └── ...
│   ├── stores/        # Svelte stores for global state
│   ├── server/        # Server-side code
│   └── utils.ts       # Shared utilities
├── routes/            # SvelteKit routes
│   ├── (app)/         # Protected routes
│   ├── (auth)/        # Authentication routes
│   └── api/           # API routes
└── app.html           # Main HTML template
```

## Tool Configuration

### Tailwind CSS
- Custom configuration with extended theme
- Animation and transition support
- Integrated dark/light mode

### Prisma
- Schema with complex relationships
- Automatic migrations
- TypeScript-generated client

### Vite
- Optimized configuration for SvelteKit
- Fast HMR
- Production-optimized build

## Technical Best Practices

### Performance
- **Code splitting** automatic with SvelteKit
- **Lazy loading** of components
- **Image and asset optimization**
- **Bundle analysis** for size optimization

### Security
- **Robust authentication** with better-auth
- **Built-in CSRF protection**
- **Server-side data validation**
- **Secure API key management**

### Development
- **Type safety** with TypeScript
- **Strict linting** with ESLint
- **Automatic formatting** with Prettier
- **Automated testing** (to be implemented)

## Deployment

### Environments
- **Development** : Local server with Vite
- **Production** : Auto-detected adapter with SvelteKit
- **Preview** : Preview build

### Configuration
- **Environment variables** for secrets
- **PostgreSQL database** in production
- **CDN** for static assets

## Scalability

### Scalability
- **Modular architecture** with SvelteKit
- **Extensible REST API**
- **Robust relational database**
- **Performance optimization and caching**

### Maintenance
- **Dependencies** up to date with npm audit
- **Performance monitoring**
- **Structured logging**
- **Automatic database backup**