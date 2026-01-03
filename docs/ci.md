# CI/CD Pipeline Documentation

Overview of the continuous integration and deployment pipeline for this CV/Portfolio website.

---

## Overview

This repository uses **GitHub Actions** for continuous integration (CI) and continuous deployment (CD). The CI pipeline ensures code quality, runs tests, and validates builds before deployment.

**Pipeline Triggers**:
- Push to `main`, `develop`, or `copilot/**` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

---

## Workflow Files

### Main CI Workflow

**File**: `.github/workflows/ci.yml`

**Purpose**: Lint, test, build, and validate the application

**Jobs**:
1. **lint-and-test** - Code quality and unit tests
2. **visual-proof** - Screenshot testing with Playwright
3. **smoke-validation** - Language-specific validation

---

## Job 1: Lint and Test

### Steps

| Step | Command | Purpose | Duration |
|------|---------|---------|----------|
| **Checkout** | `actions/checkout@v4` | Clone repository | 5s |
| **Setup Node.js** | `actions/setup-node@v4` | Install Node.js 20 | 10s |
| **Install Dependencies** | `npm ci` | Install exact dependencies | 30-60s |
| **Verify Locked Files** | `md5sum src/data/*.json` | Display file hashes | 1s |
| **Run Linter** | `npm run lint` | ESLint code quality check | 5-10s |
| **Run Tests** | `npm run test` | Vitest unit tests | 10-30s |
| **Language Validation** | `npm run verify-languages` | Verify EN/DE/FA data | 5s |
| **Production Build** | `npm run build` | Build for production | 10-15s |
| **Verify Build** | Check `dist/` contents | Ensure build success | 1s |
| **Upload Artifacts** | `actions/upload-artifact@v4` | Save build output | 10s |

**Total Duration**: ~2-3 minutes

### Success Criteria

- ✅ Linter passes (warnings OK, errors block)
- ✅ All tests pass
- ✅ Language validation passes (EN/DE/FA)
- ✅ Build completes without errors
- ✅ Build artifacts exist (`dist/index.html`, `dist/assets/`)

### Failure Conditions

- ❌ Tests fail
- ❌ Build fails
- ❌ Language validation fails (empty sections, undefined values)
- ❌ Build artifacts missing

---

## Job 2: Visual Proof

### Steps

| Step | Command | Purpose | Duration |
|------|---------|---------|----------|
| **Checkout** | `actions/checkout@v4` | Clone repository | 5s |
| **Setup Node.js** | `actions/setup-node@v4` | Install Node.js 20 | 10s |
| **Install Dependencies** | `npm ci` | Install exact dependencies | 30-60s |
| **Install Playwright** | `npx playwright install --with-deps chromium` | Install browser | 20-30s |
| **Build** | `npm run build` | Production build | 10-15s |
| **Run E2E Tests** | `npx playwright test` | Screenshot tests | 30-60s |
| **Upload Report** | `actions/upload-artifact@v4` | Save test report | 5s |
| **Upload Screenshots** | `actions/upload-artifact@v4` | Save screenshots | 10s |

**Total Duration**: ~2-4 minutes

**Artifacts**:
- `playwright-report/` - HTML test report
- `screenshots/` - Screenshot images

**Note**: This job continues even if tests fail (generates visual proof).

---

## Job 3: Smoke Validation

### Steps

Validates that all three languages (EN/DE/FA) load correctly without errors.

| Step | Purpose | Check |
|------|---------|-------|
| **English Validation** | Verify EN data | No errors, no empty sections |
| **German Validation** | Verify DE data | No errors, no empty sections |
| **Persian Validation** | Verify FA data | No errors, RTL support |

**Duration**: ~30-60 seconds

### Validation Checks

For each language:
- ✅ Data loads without errors
- ✅ All sections have content
- ✅ No `undefined` or `null` in output
- ✅ Basics section populated (name, email)
- ✅ Education section populated
- ✅ Experience section populated
- ✅ Projects section populated

---

## Locked File Integrity

### Purpose

Protects critical CV data files from accidental modification:
- `src/data/cv.json` (English)
- `src/data/ramin_de.json` (German)
- `src/data/ramin_fa.json` (Persian)

### Current Implementation

**Method**: MD5 checksums displayed in CI logs

**File**: `.github/workflows/ci.yml`, step "Verify locked files integrity"

```bash
md5sum src/data/cv.json src/data/cv_de.json src/data/cv_fa.json
```

**Output Example**:
```
5a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p  src/data/cv.json
6b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q  src/data/ramin_de.json
7c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r  src/data/ramin_fa.json
```

### Improved Implementation (SHA256)

**Why SHA256?**
- More secure than MD5
- Industry standard
- Better collision resistance
- Required for compliance

**New Implementation**: Automated SHA256 validation (see [Locked File Validation Workflow](#locked-file-validation-workflow) below)

### Test-Based Validation

**File**: `tests/locked-files-integrity.test.ts`

**Purpose**: Fail tests if locked files are modified

**Reference Hashes**: `tests/locked_files_hashes.json`

**How it works**:
1. Test computes SHA256 hash of each locked file
2. Compares with reference hash in `locked_files_hashes.json`
3. Test fails if hashes don't match

**Regenerate hashes** (when intentionally editing locked files):
```bash
npm run generate-hashes
```

---

## Test Categories

### Unit Tests (Vitest)

**Location**: `tests/*.test.ts`, `tests/*.test.tsx`

**Categories**:

| Test File | Purpose | Coverage |
|-----------|---------|----------|
| `data-normalization.test.ts` | Data loading & normalization | EN/DE/FA key mapping |
| `language-content-verification.test.tsx` | Language data validation | All sections populated |
| `language-switching.test.tsx` | Language switcher | UI language updates |
| `i18n-integration.test.tsx` | i18n integration | Translations work |
| `locked-files-integrity.test.ts` | File integrity | Hash validation |

**Run Locally**:
```bash
npm run test              # All tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
npm run test:language     # Language tests only
```

### E2E Tests (Playwright)

**Location**: `e2e/*.spec.ts`

**Purpose**: Full user flow testing with screenshots

**Scenarios**:
- Page loads successfully
- All sections render
- Language switching works
- Theme switching works
- Filter functionality works
- Responsive design at different breakpoints

**Run Locally**:
```bash
npx playwright install    # Install browsers (first time)
npm run build            # Build first
npx playwright test      # Run tests
npx playwright test --ui # Run with UI
```

### Smoke Tests (Node.js Scripts)

**Location**: `scripts/verify-languages.js`, `scripts/smoke-validation.js`

**Purpose**: Quick validation of core functionality

**Run Locally**:
```bash
npm run verify-languages    # Verify EN/DE/FA data loads
npm run smoke-validation    # Full smoke test
```

---

## CI Performance

### Typical Execution Times

| Job | Duration | Parallel | Total |
|-----|----------|----------|-------|
| Lint and Test | 2-3 min | No | 2-3 min |
| Visual Proof | 2-4 min | Yes (after lint-and-test) | +2-4 min |
| Smoke Validation | 30-60s | Yes (after lint-and-test) | +1 min |
| **Total Pipeline** | - | - | **4-7 minutes** |

### Optimization Tips

**For faster CI**:
- Use `npm ci` instead of `npm install` (exact versions)
- Cache `node_modules` with `actions/setup-node` cache
- Run independent jobs in parallel
- Use `continue-on-error` for non-blocking checks (linter)

---

## Artifact Storage

### Build Artifacts

**Retention**: 7 days

**Contents**:
- `dist/index.html` - Entry HTML file
- `dist/assets/` - Bundled JavaScript and CSS
- Static assets (images, fonts, etc.)

**Use Cases**:
- Download and test build locally
- Deploy to hosting platform manually
- Debug build issues

**Download**:
1. Go to "Actions" tab
2. Click workflow run
3. Scroll to "Artifacts" section
4. Download "build-artifacts"

### Playwright Reports

**Retention**: 7 days

**Contents**:
- HTML test report with screenshots
- Test results and logs
- Visual regression data

**Download**:
1. Go to "Actions" tab
2. Click workflow run
3. Download "playwright-report" or "screenshots"

---

## CI/CD Best Practices

### Branch Protection

**Recommended settings** for `main` branch:
- ✅ Require PR reviews before merging
- ✅ Require status checks to pass (CI workflow)
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ❌ Don't allow force pushes
- ❌ Don't allow deletions

### PR Requirements

**Before merging**:
- ✅ All CI checks pass
- ✅ Code review approved
- ✅ No merge conflicts
- ✅ Branch up to date with main

### Commit Practices

**Good commits**:
```bash
git commit -m "feat: Add education section animation"
git commit -m "fix: Resolve RTL layout issue in Persian"
git commit -m "test: Add unit tests for data normalization"
git commit -m "docs: Update deployment guide"
```

**Commit message format**:
```
type: Brief description

Optional longer description with context.

Fixes #123
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `style`

---

## Troubleshooting CI

### CI Fails on Linting

**Symptom**: Linter step fails

**Solutions**:
```bash
# Run locally
npm run lint

# Auto-fix issues
npm run lint -- --fix

# Commit fixes
git add .
git commit -m "fix: Resolve linting issues"
git push
```

### CI Fails on Tests

**Symptom**: Unit tests fail

**Solutions**:
```bash
# Run tests locally
npm run test

# Run specific test
npm run test -- tests/your-test.test.ts

# Debug with verbose output
npm run test -- --reporter=verbose

# Fix issues and commit
git add .
git commit -m "fix: Resolve test failures"
git push
```

### CI Fails on Build

**Symptom**: Build step fails

**Solutions**:
```bash
# Test build locally
npm run build

# Check for TypeScript errors
tsc --noEmit

# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm ci
npm run build

# Fix and commit
git add .
git commit -m "fix: Resolve build errors"
git push
```

### CI Fails on Locked Files

**Symptom**: Locked file integrity check fails

**Solutions**:
```bash
# Check which files changed
git status

# Revert locked files (if accidental)
git checkout HEAD -- src/data/cv.json
git checkout HEAD -- src/data/cv_de.json
git checkout HEAD -- src/data/cv_fa.json

# Or regenerate hashes (if intentional)
npm run generate-hashes
git add tests/locked_files_hashes.json
git commit -m "chore: Update locked file hashes"
git push
```

### CI is Slow

**Symptom**: CI takes >10 minutes

**Solutions**:
- Check if external dependencies are slow (npm registry)
- Verify Node.js cache is working (`actions/setup-node` cache)
- Consider reducing test scope (if too many tests)
- Check GitHub Actions status page for outages

---

## CI Workflow Enhancements

### UI QA Foundation Workflow (NEW)

**File**: `.github/workflows/uiqa-foundation.yml`

**Purpose**: Provides a reusable CI foundation for UI quality checks

**Features**:
- Deterministic dependency installation (`npm ci`)
- Production build with artifact verification
- Preview server with health-check waiting
- HTTP-based smoke tests for EN/DE/FA
- RTL verification for Persian (FA)
- Logs/artifacts upload on failure

**Reusable Workflow**: `.github/workflows/_uiqa_bootstrap.yml`

**Usage** (in other workflows):
```yaml
jobs:
  setup:
    uses: ./.github/workflows/_uiqa_bootstrap.yml
    with:
      run-smoke-tests: true
      server-port: '4173'
```

**Outputs**:
- `base-url`: The URL where the app is served
- `server-ready`: Boolean indicating if server started successfully

**Local Equivalent**:
```bash
cd frontend
npm ci                          # Install dependencies
npm run build                   # Build for production
npm run ci:preview &            # Start preview server (background)
npm run ci:smoke                # Run HTTP smoke tests
```

### UI QA Lighthouse Workflow (NEW)

**File**: `.github/workflows/uiqa-lighthouse.yml`

**Purpose**: Runs Lighthouse CI against EN/DE/FA language routes to measure and enforce quality thresholds

**Features**:
- Runs Lighthouse audits on all three language routes
- Enforces minimum score thresholds for Performance, Accessibility, Best Practices, and SEO
- Uploads HTML and JSON reports as artifacts
- Generates step summary with route scores

**Configuration**: `frontend/.lighthouserc.cjs`

**Thresholds**:
| Category | Minimum Score | Threshold Type |
|----------|---------------|----------------|
| Performance | 50% | Warning |
| Accessibility | 90% | Error |
| Best Practices | 80% | Warning |
| SEO | 80% | Warning |

**Routes Tested**:
- `http://localhost:4173/?lang=en` (English)
- `http://localhost:4173/?lang=de` (German)
- `http://localhost:4173/?lang=fa` (Persian)

**Artifacts**:
- `lighthouse-reports/` - HTML and JSON reports for each route (14-day retention)

**Local Equivalent**:
```bash
cd frontend
npm run lhci                    # Full Lighthouse CI run (build + collect + assert + upload)

# Or individual steps:
npm run build                   # Build application
npm run lhci:collect            # Collect Lighthouse reports
npm run lhci:assert             # Check score thresholds
npm run lhci:upload             # Save reports to lighthouse-reports/
```

**Adjusting Thresholds**:
Edit `frontend/.lighthouserc.cjs` and modify the `assert.assertions` section:
```javascript
assertions: {
  'categories:performance': ['warn', { minScore: 0.50 }],
  'categories:accessibility': ['error', { minScore: 0.90 }],
  'categories:best-practices': ['warn', { minScore: 0.80 }],
  'categories:seo': ['warn', { minScore: 0.80 }],
}
```

### Locked File Validation Workflow

**Proposed**: Add automated SHA256 validation

**Benefits**:
- Stronger security than MD5
- Automatic failure on modification
- Clear error messages
- Industry standard

**Implementation**: See [Locked File Validation](#locked-file-integrity) section

### Deployment Workflow

**Proposed**: Add automatic deployment to GitHub Pages or other platform

**Benefits**:
- Automatic production deployment
- No manual steps
- Faster time to production

**Implementation**: See [Production Deployment Guide](./deploy_production.md)

### PR Preview Workflow

**Proposed**: Add PR preview deployment workflow

**Benefits**:
- Unique preview URL per PR
- Test before merging
- Share with stakeholders

**Implementation**: See [PR Preview Deployment Guide](./deploy_preview_pr.md)

---

## CI Status Badges

Add to README.md:

```markdown
![CI Status](https://github.com/Raminyazdani/premium-cv-port-land/workflows/CI/badge.svg)
```

Displays:
- ✅ Green: All checks passing
- ❌ Red: Some checks failing
- ⚪ Gray: No recent runs

---

## Monitoring & Notifications

### GitHub Notifications

**Automatic notifications for**:
- Failed CI runs (if you have repository access)
- Required reviews
- Merge conflicts

**Configure**: GitHub Settings → Notifications

### Email Notifications

**Setup**:
1. Go to repository "Settings" → "Notifications"
2. Add email addresses
3. Choose notification types

### Slack Integration (Optional)

**Setup**:
1. Install GitHub app in Slack
2. Subscribe to repository: `/github subscribe Raminyazdani/premium-cv-port-land`
3. Configure alerts: `/github subscribe Raminyazdani/premium-cv-port-land workflows`

---

## CI Security

> **For comprehensive security workflow documentation, see [SECURITY_WORKFLOWS.md](./SECURITY_WORKFLOWS.md)**

### Security Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| **CodeQL** | `.github/workflows/codeql.yml` | Static security analysis (SAST) |
| **Dependency Review** | `.github/workflows/dependency-review.yml` | Vulnerability scanning for dependency changes |

These workflows run automatically on PRs and pushes, providing:
- ✅ Automated vulnerability detection
- ✅ Security alerts in GitHub Security tab
- ✅ PR comments for dependency issues
- ✅ Weekly scheduled scans

### Secrets Management

**Current**: No secrets required for CI

**If needed**:
1. Go to repository "Settings" → "Secrets and variables" → "Actions"
2. Add secrets (e.g., API keys, tokens)
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

**Best practices**:
- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Limit secret scope (repository vs organization)

### Dependency Security

**Dependabot** (enabled):
- Automatic security updates
- PR created for vulnerable dependencies
- Configure: `.github/dependabot.yml`

**Dependency Review** (enabled):
- Scans PRs for vulnerable dependencies
- Blocks high/critical severity issues
- See [SECURITY_WORKFLOWS.md](./SECURITY_WORKFLOWS.md) for details

**npm audit** in CI:
- Runs during `npm ci`
- Warns about vulnerabilities
- Doesn't block CI (informational)

---

## Next Steps

1. ✅ **Understand CI pipeline** (this document)
2. ✅ **Monitor CI runs** (GitHub Actions tab)
3. ✅ **Fix CI failures** promptly
4. ✅ **Keep dependencies updated** (Dependabot PRs)
5. ✅ **Add deployment workflow** (see deployment guides)

---

## Running CI Steps Locally

You can run the same CI steps locally to debug issues or verify changes before pushing.

### Quick CI Reproduction

```bash
# Navigate to frontend directory
cd frontend

# 1. Install dependencies (same as CI)
npm ci

# 2. Run linter
npm run lint

# 3. Run tests
npm run test

# 4. Verify language data
npm run verify-languages

# 5. Build for production
npm run build

# 6. Start preview server (background)
npm run ci:preview &

# 7. Wait for server (in CI this is automatic)
sleep 5

# 8. Run HTTP smoke tests
npm run ci:smoke

# 9. Stop the server when done
pkill -f "vite preview"
```

### Running UI QA Foundation Locally

The UI QA Foundation workflow can be simulated locally:

```bash
cd frontend

# Install and build
npm ci
npm run build

# Start preview server
npm run ci:preview &
SERVER_PID=$!

# Wait for server
for i in {1..30}; do
  if curl -s http://localhost:4173 > /dev/null; then
    echo "Server ready!"
    break
  fi
  sleep 1
done

# Run smoke tests
npm run ci:smoke

# Cleanup
kill $SERVER_PID
```

### Environment Variables

The smoke test script supports configuration:

```bash
# Test against a different URL
CI_BASE_URL=http://localhost:5173 npm run ci:smoke
```

---

## Additional Resources

- **Production Deployment**: `docs/deploy_production.md`
- **PR Previews**: `docs/deploy_preview_pr.md`
- **Local Development**: `docs/local_dev.md`
- **Stack Detection**: `docs/stack_detection.md`

### GitHub Actions Documentation

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Contexts and Expressions](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions)

---

*Keep the build green! 🟢*
