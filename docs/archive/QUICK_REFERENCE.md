# Frontend Development - Quick Reference

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5000)
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check for linting issues
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format all code
npm run format:check     # Check code formatting
npm run typecheck        # Run TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
```

## Prerequisites

- Node.js ≥ 18.0.0 (tested with v20.19.6)
- npm ≥ 9.0.0 (tested with v10.8.2)

## Tech Stack

- **Build**: Vite v7.2.6
- **Framework**: React v19.0.0
- **Language**: TypeScript v5.7.2
- **Linting**: ESLint v9 (flat config)
- **Formatting**: Prettier v3.4.2
- **Testing**: Vitest v4.0.16 + Testing Library
- **Styling**: Tailwind CSS v4

## Project Structure

```
src/
├── components/     # React components
├── context/        # React Context
├── hooks/          # Custom hooks
├── types/          # TypeScript types
├── utils/          # Utilities
├── data/           # CV JSON data
└── styles/         # Global styles
```

## Code Quality Rules

### ESLint
- No unused variables (`error`)
- No explicit `any` types (`error`)
- React Hooks rules enforced
- Prettier integrated

### TypeScript
- Full strict mode enabled
- No implicit any
- Strict null checks
- No unused locals/parameters

### Prettier
- Single quotes
- Semicolons
- 2-space indentation
- 100 char line width
- ES5 trailing commas

## Common Workflows

### Starting Development
```bash
npm install
npm run dev
# Open http://localhost:5000
```

### Before Committing
```bash
npm run lint:fix      # Fix auto-fixable issues
npm run format        # Format code
npm run typecheck     # Check types
npm run test          # Run tests
```

### Building for Production
```bash
npm run build
npm run preview       # Test production build locally
```

## Troubleshooting

### Port Already in Use
```bash
npm run kill          # Kill process on port 5000
# or: fuser -k 5000/tcp
```

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Build Cache
```bash
rm -rf dist node_modules/.vite
npm run build
```

## Resources

- [Full Setup Guide](./FRONTEND_ENVIRONMENT_SETUP.md)
- [Project README](./README.md)
- [Vite Docs](https://vitejs.dev/)
- [React 19 Docs](https://react.dev/)
