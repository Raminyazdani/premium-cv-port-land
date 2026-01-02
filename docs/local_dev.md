# Local Development Guide

Complete guide for setting up and running this CV/Portfolio website locally.

---

## Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/Raminyazdani/premium-cv-port-land.git
cd premium-cv-port-land

# 2. Navigate to frontend directory
cd frontend

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

Open your browser to **http://localhost:5173**

✅ **Done!** The application should now be running locally.

---

## Prerequisites

### Required Software

| Tool | Version | Check Command | Installation |
|------|---------|---------------|--------------|
| **Node.js** | 20.x or higher | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x or higher | `npm --version` | Included with Node.js |
| **Git** | Any recent | `git --version` | [git-scm.com](https://git-scm.com/) |

### Optional Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| **VS Code** | Recommended editor | [code.visualstudio.com](https://code.visualstudio.com/) |
| **VS Code Extensions** | TypeScript, ESLint, Tailwind CSS IntelliSense | Install from Extensions marketplace |

---

## Initial Setup

### 1. Clone Repository

```bash
# Via HTTPS
git clone https://github.com/Raminyazdani/premium-cv-port-land.git

# Via SSH (if you have SSH keys configured)
git clone git@github.com:Raminyazdani/premium-cv-port-land.git

# Navigate to project directory
cd premium-cv-port-land
```

### 2. Navigate to Frontend

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

**What this does**:
- Reads `package.json` and `package-lock.json`
- Downloads all dependencies to `node_modules/`
- Takes 1-3 minutes depending on internet speed

**Expected output**:
```
added 362 packages, and audited 363 packages in 45s

142 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### 4. Verify Installation

```bash
# Check that build works
npm run build

# Should see output ending with:
# ✓ built in X.XXs
```

---

## Development Commands

### Start Development Server

```bash
npm run dev
```

**What this does**:
- Starts Vite development server
- Enables hot module replacement (HMR)
- Serves application on http://localhost:5173
- Auto-reloads on file changes

**Expected output**:
```
  VITE v7.2.6  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Development features**:
- ⚡ Hot Module Replacement (instant updates)
- 🔍 Source maps for debugging
- 📝 TypeScript type checking in editor
- 🎨 Tailwind CSS with JIT compilation

**To stop the server**: Press `Ctrl+C`

---

## Essential Commands

### Linting

```bash
# Run ESLint to check code quality
npm run lint
```

**What this checks**:
- TypeScript/JavaScript syntax errors
- React best practices
- Code style consistency
- Potential bugs

**Fix auto-fixable issues**:
```bash
npm run lint -- --fix
```

### Testing

```bash
# Run all tests once
npm run test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run only language verification tests
npm run test:language
```

**Test categories**:
- Unit tests: Component and utility tests
- Integration tests: Data loading and normalization
- Language tests: EN/DE/FA data validation
- Locked file integrity tests: Ensure CV data unchanged

### Building

```bash
# Build for production
npm run build
```

**What this does**:
- Compiles TypeScript to JavaScript
- Bundles all dependencies
- Minifies code and assets
- Optimizes for production
- Outputs to `dist/` directory

**Build artifacts**:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── [component chunks].js
```

**Preview production build**:
```bash
# Start local server for production build
npm run preview
```

Open http://localhost:4173 to test the production build locally.

### Language Verification

```bash
# Quick smoke test for all languages (EN/DE/FA)
npm run verify-languages
```

**What this checks**:
- English data loads without errors
- German data loads without errors
- Persian data loads without errors
- No empty sections
- No undefined/null values

### Lighthouse CI (Performance Auditing)

```bash
# Run full Lighthouse CI audit (build + collect + assert + upload)
npm run lhci

# Or run individual steps:
npm run build              # Build the app first
npm run lhci:collect       # Collect Lighthouse reports
npm run lhci:assert        # Check score thresholds
npm run lhci:upload        # Save reports to lighthouse-reports/
```

**What Lighthouse measures**:
- **Performance** - Load times, Core Web Vitals (threshold: 70%)
- **Accessibility** - WCAG compliance, keyboard navigation (threshold: 90%)
- **Best Practices** - Security, modern APIs (threshold: 80%)
- **SEO** - Search engine optimization (threshold: 80%)

**Routes tested**:
- `http://localhost:4173/?lang=en` (English)
- `http://localhost:4173/?lang=de` (German)
- `http://localhost:4173/?lang=fa` (Persian)

**Reports location**: `frontend/lighthouse-reports/`

**Threshold configuration**: Edit `frontend/.lighthouserc.cjs` to adjust score thresholds.

---

## Development Workflow

### Typical Development Session

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Make changes to code
# (Files in src/ directory)

# 5. Test changes
# (Browser auto-refreshes via HMR)

# 6. Run tests
npm run test

# 7. Lint code
npm run lint

# 8. Commit changes
git add .
git commit -m "Your commit message"
git push origin your-branch
```

### File Watching

**Automatic reloading** is enabled for:
- ✅ React components (`src/components/**/*.tsx`)
- ✅ TypeScript files (`src/**/*.ts`, `src/**/*.tsx`)
- ✅ CSS files (`src/**/*.css`)
- ✅ Configuration changes (vite.config.ts, tailwind.config.js)
- ❌ Data files (requires manual refresh)

### Hot Module Replacement (HMR)

**When you save a file**:
1. Vite detects the change
2. Only changed modules are updated
3. Browser updates without full reload
4. React state is preserved (when possible)

**When full reload is triggered**:
- Changes to `index.html`
- Changes to data files (`src/data/*.json`)
- Changes to configuration files

---

## Project Structure

### Key Directories

```
/
├── frontend/                 # Frontend application
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   │   ├── ui/           # Reusable UI components (Shadcn)
│   │   │   └── sections/     # Page sections (Hero, Education, etc.)
│   │   ├── context/          # React Context providers
│   │   │   ├── CVDataContext.tsx      # CV data state
│   │   │   ├── LanguageContext.tsx    # Language state
│   │   │   └── FilterContext.tsx      # Filter state
│   │   ├── data/             # CV data files (JSON)
│   │   │   ├── cv.json       # English data (LOCKED)
│   │   │   ├── ramin_de.json # German data (LOCKED)
│   │   │   └── ramin_fa.json # Persian data (LOCKED)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries
│   │   │   └── i18n.ts       # UI translations
│   │   ├── utils/            # Utility functions
│   │   │   ├── dataLoader.ts          # Data loading logic
│   │   │   ├── dataNormalizer.ts      # Language normalization
│   │   │   └── dataValidator.ts       # Data validation
│   │   ├── types/            # TypeScript type definitions
│   │   ├── styles/           # Global styles
│   │   ├── main.tsx          # Application entry point
│   │   └── App.tsx           # Root component
│   │
│   ├── tests/                # Unit tests
│   ├── e2e/                  # End-to-end tests
│   ├── public/               # Static assets (served as-is)
│   │
│   ├── index.html            # HTML entry point
│   ├── vite.config.ts        # Vite configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── vitest.config.ts      # Test configuration
│   └── package.json          # Project manifest
│
├── backend/                  # Backend (placeholder - not yet implemented)
│   └── README.md
│
├── docs/                     # Documentation
│   ├── archive/              # Historical implementation reports
│   └── ...                   # Active documentation
│
├── .github/                  # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml            # CI/CD pipeline
│
├── README.md                 # Project overview
└── LICENSE                   # License file
```

### Important Files

| File | Purpose | Edit? |
|------|---------|-------|
| `frontend/src/data/cv.json` | English CV data | ⚠️ LOCKED - DO NOT EDIT |
| `frontend/src/data/ramin_de.json` | German CV data | ⚠️ LOCKED - DO NOT EDIT |
| `frontend/src/data/ramin_fa.json` | Persian CV data | ⚠️ LOCKED - DO NOT EDIT |
| `frontend/src/App.tsx` | Main application component | ✅ Yes |
| `frontend/src/components/**/*.tsx` | UI components | ✅ Yes |
| `frontend/vite.config.ts` | Build configuration | ⚠️ Carefully |
| `frontend/tailwind.config.js` | Styling configuration | ✅ Yes |
| `frontend/package.json` | Dependencies and scripts | ⚠️ Carefully |

---

## Editing CV Data

### ⚠️ CRITICAL: Locked Data Files

The following files are **LOCKED** and protected by CI integrity checks:

- `frontend/src/data/cv.json`
- `frontend/src/data/ramin_de.json`
- `frontend/src/data/ramin_fa.json`

**DO NOT EDIT THESE FILES** unless you:
1. Have explicit permission from the repository owner
2. Understand you must regenerate hashes afterward:
   ```bash
   cd frontend
   npm run generate-hashes
   ```
3. Are prepared to update tests that verify file integrity

**Why are they locked?**
- These contain production CV data
- Past modifications caused data corruption
- Hash-based tests ensure integrity
- Any changes will fail CI/CD pipeline

### Creating Your Own CV

If you want to use this template for your own CV:

1. **Fork the repository** (don't modify locked files)
2. **Replace the data files** with your own:
   ```bash
   # Edit these files with your data
   frontend/src/data/cv.json
   frontend/src/data/cv_de.json  # or remove if not needed
   frontend/src/data/cv_fa.json  # or remove if not needed
   ```
3. **Regenerate integrity hashes**:
   ```bash
   cd frontend
   npm run generate-hashes
   ```
4. **Update tests** to reflect your data
5. **Commit and deploy**

---

## Environment Variables

### Current Configuration

This application **does not require environment variables** for local development or basic functionality.

### Optional Environment Variables

Create a `.env` file in the frontend directory for optional features:

```env
# Optional: Analytics (not implemented yet)
VITE_GA_ID=
VITE_PLAUSIBLE_DOMAIN=

# Optional: Feature toggles
VITE_ENABLE_CONTACT_FORM=false
VITE_ENABLE_BOOKING=false

# Optional: Development
VITE_BUNDLE_ANALYZER=false
```

**Note**: Environment variables **must** be prefixed with `VITE_` to be accessible in the application.

---

## Troubleshooting

### Port 5173 Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Option 1: Kill the process using port 5173
npm run kill  # Uses fuser to kill process on port 5000
# Note: This kills port 5000, not 5173. You may need to manually find and kill the process.

# Option 2: Use a different port
npm run dev -- --port 3000

# Option 3: Find and kill the process manually
# On Linux/Mac:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Module Not Found Errors

**Error**: `Cannot find module 'xyz'`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Error**: TypeScript compilation errors

**Solutions**:
```bash
# 1. Check for TypeScript errors
npm run build

# 2. Restart your editor (VS Code)
# Command Palette (Ctrl+Shift+P): "TypeScript: Restart TS Server"

# 3. Clear TypeScript cache
rm -rf node_modules/.tmp
npm run build
```

### Build Fails

**Error**: Build fails with errors

**Solutions**:
```bash
# 1. Check for linting errors
npm run lint

# 2. Check for TypeScript errors
tsc --noEmit

# 3. Clear build cache
rm -rf dist node_modules/.vite
npm run build

# 4. Check for dependency issues
npm audit
npm audit fix
```

### Tests Failing

**Error**: Tests fail unexpectedly

**Solutions**:
```bash
# 1. Run tests with verbose output
npm run test -- --reporter=verbose

# 2. Run specific test file
npm run test -- tests/your-test.test.ts

# 3. Update test snapshots (if using snapshots)
npm run test -- -u

# 4. Clear test cache
npm run test -- --clearCache
```

### HMR Not Working

**Symptom**: Changes not reflected in browser

**Solutions**:
1. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Check browser console for errors
3. Restart dev server: `Ctrl+C` then `npm run dev`
4. Clear browser cache

### Locked File Modification

**Error**: CI fails with "Locked files modified" error

**Solution**:
```bash
# If you accidentally edited locked files:

# 1. Check which files changed
git status

# 2. Revert the locked files
git checkout HEAD -- frontend/src/data/cv.json frontend/src/data/cv_de.json frontend/src/data/cv_fa.json

# 3. If you intentionally modified them, regenerate hashes
cd frontend
npm run generate-hashes

# 4. Commit the hash changes
git add tests/locked_files_hashes.json
git commit -m "Update locked file hashes"
```

---

## Development Tips

### VS Code Configuration

**Recommended extensions**:
- ESLint (`dbaeumer.vscode-eslint`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- TypeScript Vue Plugin (Volar) (`Vue.vscode-typescript-vue-plugin`)
- Prettier (`esbenp.prettier-vscode`)

**Recommended settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "css.validate": false,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Performance Tips

**For faster development**:
1. Use `npm run dev` instead of `npm run build` for development
2. Utilize HMR - don't refresh the page manually
3. Keep dev server running while editing
4. Use `npm run test:watch` for continuous testing

**For faster builds**:
1. Ensure you have latest Node.js version
2. Close unnecessary applications
3. Use SSD for project directory
4. Consider increasing Node.js memory:
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096 npm run build
   ```

### Code Organization

**Best practices**:
- One component per file
- Use TypeScript interfaces for props
- Extract reusable logic to custom hooks
- Keep components small and focused
- Use React Context for global state
- Lazy load heavy components

**Component structure**:
```tsx
// 1. Imports
import { useState } from 'react'
import { MyType } from '@/types'

// 2. Types/Interfaces
interface MyComponentProps {
  data: MyType
}

// 3. Component
export function MyComponent({ data }: MyComponentProps) {
  // Hooks
  const [state, setState] = useState()
  
  // Handlers
  const handleClick = () => {}
  
  // Render
  return <div>...</div>
}
```

### Debugging

**Browser DevTools**:
- Use React DevTools extension for component inspection
- Use Redux DevTools for state inspection (if using Redux)
- Use Network tab to debug data loading
- Use Console for logs and errors

**VS Code Debugging**:
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

---

## Language Development

### Testing Different Languages

**Via URL parameter**:
```
http://localhost:5173/?lang=en  # English
http://localhost:5173/?lang=de  # German
http://localhost:5173/?lang=fa  # Persian
```

**Via browser**:
1. Open application
2. Click language selector in header
3. Select EN/DE/FA

### Adding New UI Translations

**Edit**: `frontend/src/lib/i18n.ts`

```typescript
export const uiStrings = {
  en: {
    sections: {
      education: 'Education',
      // Add your translations here
    }
  },
  de: {
    sections: {
      education: 'Ausbildung',
      // Add your translations here
    }
  },
  fa: {
    sections: {
      education: 'تحصیلات',
      // Add your translations here
    }
  }
}
```

### RTL Development (Persian)

**How RTL works**:
- Automatically applied when language is `fa`
- Uses `dir="rtl"` on document root
- Tailwind CSS has RTL-aware utilities
- Custom RTL styles in components

**Testing RTL**:
1. Switch to Persian: http://localhost:5173/?lang=fa
2. Verify layout flips correctly
3. Check text alignment
4. Test interactive components

---

## Next Steps

Now that you have the application running locally:

1. **Explore the codebase**: Start with `frontend/src/App.tsx` and follow the component tree
2. **Make a small change**: Edit a component and see HMR in action
3. **Run tests**: `npm run test` to ensure everything works
4. **Build for production**: `npm run build` to create production bundle
5. **Read deployment docs**: See `docs/deploy_production.md` for deployment

---

## Getting Help

### Documentation
- **Stack Detection**: `docs/stack_detection.md`
- **Deployment**: `docs/deploy_production.md`, `docs/deploy_preview_pr.md`
- **CI/CD**: `docs/ci.md`
- **Main README**: `README.md`
- **Quick Start**: `QUICK_START.md`

### Common Issues
- Check existing GitHub issues
- Search repository documentation
- Check Vite documentation: https://vitejs.dev
- Check React documentation: https://react.dev

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

---

*Happy coding! 🚀*
