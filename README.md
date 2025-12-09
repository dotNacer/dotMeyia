# dotMeyia

A modern note-taking application built with SvelteKit, featuring AI-powered contextual note merging and intelligent organization.

## Features

- 📝 **Smart Note Taking**: Capture notes quickly with intelligent title generation
- 🤖 **AI-Powered Merging**: Automatically detect and merge similar notes
- 🔍 **Hybrid Similarity Detection**: Combines keyword matching with semantic AI analysis
- ⌨️ **Keyboard Shortcuts**: Fast access with Cmd/Ctrl+K
- 📱 **Mobile-First**: Optimized floating action button and bottom sheet UI
- 🔐 **Secure Authentication**: Better Auth with Google OAuth
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn-svelte components
- 🌙 **Dark Mode**: Full theme support

## Quick Note Feature

The Quick Note feature allows rapid note capture with intelligent contextual merging:

- **Mobile**: Tap the '+' floating button
- **Desktop/Mobile**: Press `Cmd/Ctrl + K`
- **Smart Detection**: Automatically finds similar notes and suggests merging
- **AI Title Generation**: Creates meaningful titles automatically

[Learn more about the Quick Note feature →](./docs/QUICK_NOTE_FEATURE.md)

## Tech Stack

- **Framework**: SvelteKit (Svelte 5 with Runes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **AI**: Google Gemini (Vercel AI SDK)
- **Testing**: Vitest + Testing Library
- **PWA**: Vite PWA Plugin

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database
- Google OAuth credentials (for auth)
- Google AI API key (for Gemini)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dotNacer/dotMeyia.git
cd dotMeyia
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL`: Your PostgreSQL connection string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials
- `GOOGLE_GENERATIVE_AI_API_KEY`: Gemini API key

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type checking
npm run format       # Format code
npm run lint         # Lint code
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Project Structure

```
src/
├── lib/
│   ├── components/       # Reusable UI components
│   │   ├── quick-note/  # Quick note feature components
│   │   └── ui/          # shadcn-svelte components
│   ├── server/          # Server-side utilities
│   │   └── similarity.ts # AI-powered similarity detection
│   ├── stores/          # Svelte stores for state management
│   ├── hooks/           # Custom Svelte hooks
│   └── *.remote.ts      # Remote procedures (API calls)
├── routes/
│   ├── (app)/          # Authenticated app routes
│   ├── (auth)/         # Authentication routes
│   └── api/            # API endpoints
└── test-setup.ts       # Test configuration

prisma/
└── schema.prisma       # Database schema

docs/
└── QUICK_NOTE_FEATURE.md # Feature documentation
```

## Testing

The project uses Vitest for unit testing:

```bash
# Run all tests
npm run test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

The project is configured for deployment with:

- **Adapter**: Node.js
- **Build Tool**: Nixpacks (Railway/similar platforms)
- **PWA**: Offline support and installability

See `nixpacks.toml` for deployment configuration.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Contact

Nacer Berkane - [@dotNacer](https://github.com/dotNacer)

Project Link: [https://github.com/dotNacer/dotMeyia](https://github.com/dotNacer/dotMeyia)
