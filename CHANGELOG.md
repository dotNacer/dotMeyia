# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Quick Note Taking Feature** (#8, closes #7)
  - Floating action button (FAB) for mobile quick access
  - Bottom sheet modal for rapid note input
  - Hybrid similarity detection using keyword matching + AI semantic analysis
  - Intelligent note merging with top 3 similar notes display
  - AI-powered automatic title generation
  - Keyboard shortcuts: `Cmd/Ctrl + K` to open, `Cmd/Ctrl + Enter` to save
  - Mobile-first responsive design
  - Comprehensive unit tests and documentation
  - Custom keyboard shortcut hook (`useKeyboardShortcut`)

### Changed
- Updated app layout to include quick note components
- Enhanced README with feature overview and usage instructions

### Technical
- Added similarity detection service with keyword extraction and semantic comparison
- Implemented remote procedures for quick note operations
- Added Vitest configuration and test setup
- Updated package.json with testing dependencies:
  - `vitest`
  - `@testing-library/svelte`
  - `@testing-library/jest-dom`
  - `@vitest/coverage-v8`
  - `jsdom`

## [0.0.1] - 2025-04-23

### Added
- Initial project setup
- SvelteKit framework with Svelte 5
- Authentication with Better Auth
- PostgreSQL database with Prisma ORM
- Google Gemini AI integration
- Note-taking functionality
- Context management
- PWA support
- Dark/Light theme
- Mobile-responsive sidebar

[Unreleased]: https://github.com/dotNacer/dotMeyia/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/dotNacer/dotMeyia/releases/tag/v0.0.1
