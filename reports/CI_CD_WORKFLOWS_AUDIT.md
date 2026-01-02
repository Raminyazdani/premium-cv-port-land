# CI/CD Workflows Audit

**Report Date:** 2026-01-02  
**Report Version:** 1.0  
**Scope:** All GitHub Actions workflows in `.github/workflows/`  
**Mode:** REPORT-ONLY (no changes implemented)

---

## Executive Summary

This audit covers **13 workflow files** in the `.github/workflows/` directory plus a **Dependabot configuration**. The CI/CD infrastructure is comprehensive with dedicated workflows for linting, testing, building, visual QA, accessibility testing, Lighthouse performance audits, i18n validation, and deployment. However, several issues were identified:

### Key Findings

| Category | Status | Priority |
|----------|--------|----------|
| Action Version Pinning | ⚠️ Good (major versions) | P2 |
| TypeCheck Gate | ❌ Missing in CI | P1 |
| Format Check Gate | ❌ Missing in CI | P2 |
| Lint Continue-on-Error | ⚠️ Lint passes despite failures | P1 |
| Disabled Workflows | ⚠️ 2 workflows disabled by default | P3 |
| Redundant Setup Steps | ⚠️ Heavy duplication across workflows | P2 |
| Permissions | ✅ Generally well-scoped | - |
| Secret Scanning | ⚠️ Not enforced in workflows | P2 |

---

## 1. Summary Table: Finding → Priority → Impact → Where → Recommendation

| # | Finding | Priority | Impact | Where | Recommendation |
|---|---------|----------|--------|-------|----------------|
| 1 | No TypeScript type-checking gate in main CI | P1 | Type errors may slip into production | `ci.yml` | Add `npm run typecheck` step after lint |
| 2 | Lint step uses `continue-on-error: true` | P1 | Lint failures don't block merge | `ci.yml:L48` | Remove `continue-on-error` or add explicit failure reporting |
| 3 | No format check in CI | P2 | Inconsistent code formatting may merge | `ci.yml` | Add `npm run format:check` step |
| 4 | deploy-github-pages.yml globally disabled | P3 | GitHub Pages deployment not functional | `deploy-github-pages.yml:L19` | Remove `if: false` when ready for deployment |
| 5 | pr-preview.yml globally disabled | P3 | PR previews not available | `pr-preview.yml:L20` | Enable or remove workflow |
| 6 | Redundant dependency installation across workflows | P2 | Slower CI, increased compute costs | All UIQA workflows | Use reusable workflows or composite actions more effectively |
| 7 | Dependabot directory misconfigured | P2 | May not find `frontend/package-lock.json` | `.github/dependabot.yml:L4` | Change directory from `/` to `/frontend` |
| 8 | Sequential Copilot Automation uses PAT secret | P3 | Requires manual secret management | `sequential-copilot-automation.yml` | Document PAT requirements; consider using GITHUB_TOKEN if possible |
| 9 | Actions use major version tags (v4) instead of SHA pinning | P2 | Supply chain attack risk | All workflow files | Consider SHA-pinning critical actions |
| 10 | No integration or E2E tests in main CI gate | P2 | Only unit tests block merge; E2E runs but doesn't fail CI | `ci.yml:L100-102` | Remove `continue-on-error` from Playwright tests or add required gate |
| 11 | UIQA workflows have inconsistent timeout settings | P3 | Some may hang without limit | Various UIQA workflows | Standardize `timeout-minutes` across all jobs |
| 12 | No security scanning (CodeQL/Dependabot security) in CI | P2 | Vulnerabilities not automatically detected | Missing workflow | Add CodeQL analysis or GitHub Advanced Security workflow |
| 13 | Smoke validation runs verify-languages twice | P3 | Redundant execution in lint-and-test job | `ci.yml:L53-54, L139-157` | Remove duplicate in smoke-validation job or consolidate |

---

## 2. Workflow Index

### 2.1 Workflow File Summary

| File | Triggers | Jobs | Key Steps | Status | Notes |
|------|----------|------|-----------|--------|-------|
| `ci.yml` | push (main, develop, copilot/**), PR (main, develop), workflow_dispatch | lint-and-test, visual-proof, smoke-validation | checkout, setup-node, npm ci, lint, test, build, playwright | ✅ Active | Main CI pipeline |
| `copilot-setup-steps.yml` | workflow_dispatch | copilot-setup-steps | checkout, setup-node, npm ci, verify installation, cache | ✅ Active | Copilot agent environment prep |
| `deploy-github-pages.yml` | push (main), workflow_dispatch | build, deploy | checkout, setup-node, npm ci, test, build, upload to Pages | ⛔ Disabled | `if: false` at line 19 |
| `i18n-audit.yml` | PR (main, develop), workflow_dispatch | i18n-audit, language-switch-test | checkout, setup-node, npm ci, i18n-audit script, Playwright i18n tests | ✅ Active | i18n coverage reporting |
| `pr-preview.yml` | PR (opened, synchronize, reopened) | build-preview | checkout, setup-node, npm ci, test, build, upload artifact, comment | ⛔ Disabled | `if: false` at line 20 |
| `sequential-copilot-automation.yml` | PR (review_requested), workflow_dispatch | manual-start, auto-merge-and-assign-next | issue management, PR merging, issue assignment | ✅ Active | Copilot task automation |
| `_uiqa_bootstrap.yml` | workflow_call | bootstrap, downstream-ready | checkout, setup-node, npm ci, build, start server, health check, smoke tests | ✅ Active | Reusable UI QA foundation |
| `uiqa-a11y.yml` | PR (main, develop), workflow_dispatch | accessibility | checkout, setup-node, npm ci, playwright install, build, a11y tests (axe-core) | ✅ Active | WCAG compliance checks |
| `uiqa-contrast-visibility.yml` | PR (main, develop), workflow_dispatch | contrast-visibility | checkout, setup-node, npm ci, playwright install, build, contrast/focus tests | ✅ Active | Color contrast & focus visibility |
| `uiqa-foundation.yml` | PR (main, develop), workflow_dispatch | uiqa-bootstrap (reusable call), uiqa-summary | calls _uiqa_bootstrap.yml | ✅ Active | Entry point for UI QA foundation |
| `uiqa-lighthouse.yml` | PR (main, develop), workflow_dispatch | lighthouse | checkout, setup-node, npm ci, build, install Chrome, LHCI collect/assert/upload | ✅ Active | Performance/a11y/SEO audits |
| `uiqa-ui-states.yml` | PR (main, develop), workflow_dispatch | ui-states-qa | checkout, setup-node, npm ci, playwright install, build, UI state screenshots | ✅ Active | Scroll/layout/visibility QA |
| `uiqa-visual.yml` | PR (main, develop), workflow_dispatch | visual-qa | checkout, setup-node, npm ci, playwright install, build, visual screenshots | ✅ Active | Visual regression detection |

### 2.2 Workflow Dependency Graph

```
Main CI Flow:
┌─────────────┐
│   ci.yml    │
└──────┬──────┘
       │
       ├──► lint-and-test (blocking)
       │        └── lint, test, build, artifacts
       │
       ├──► visual-proof (needs: lint-and-test)
       │        └── Playwright screenshots
       │
       └──► smoke-validation (needs: lint-and-test)
                └── EN/DE/FA language validation

UIQA Workflows (all independent, triggered on PR):
┌─────────────────────────┐
│ _uiqa_bootstrap.yml     │ ◄── Reusable workflow
└───────────┬─────────────┘
            │
            └──► uiqa-foundation.yml (calls bootstrap)
            
┌─────────────────────────┐
│ uiqa-a11y.yml           │ (standalone)
├─────────────────────────┤
│ uiqa-contrast-visibility│ (standalone)
├─────────────────────────┤
│ uiqa-lighthouse.yml     │ (standalone)
├─────────────────────────┤
│ uiqa-ui-states.yml      │ (standalone)
├─────────────────────────┤
│ uiqa-visual.yml         │ (standalone)
└─────────────────────────┘
```

---

## 3. Validation Coverage Matrix

| Check Type | Enforced In | Blocks Merge? | Notes |
|------------|-------------|---------------|-------|
| **Linting (ESLint)** | `ci.yml:L46-48` | ❌ No (`continue-on-error: true`) | Runs but doesn't fail CI |
| **Formatting (Prettier)** | ❌ Not in CI | ❌ No | Script exists: `npm run format:check` |
| **Type Checking (TSC)** | ❌ Not in CI | ❌ No | Script exists: `npm run typecheck` |
| **Unit Tests (Vitest)** | `ci.yml:L50-51` | ✅ Yes | `npm run test` |
| **Language Verification** | `ci.yml:L53-54` | ✅ Yes | `npm run verify-languages` |
| **Build** | `ci.yml:L56-57` | ✅ Yes | `npm run build` |
| **Build Artifact Check** | `ci.yml:L59-65` | ✅ Yes | Verifies dist/index.html exists |
| **Locked Files Integrity** | `ci.yml:L38-44` | ✅ Yes (via tests) | SHA256 hashes computed, validated in tests |
| **E2E Tests (Playwright)** | `ci.yml:L100-102` | ❌ No (`continue-on-error: true`) | Runs but doesn't fail CI |
| **Accessibility (axe-core)** | `uiqa-a11y.yml` | ⚠️ Conditional | Separate workflow, requires manual review |
| **Lighthouse Performance** | `uiqa-lighthouse.yml` | ⚠️ Conditional | Assertion thresholds may pass/warn |
| **Visual Regression** | `uiqa-visual.yml` | ⚠️ Conditional | Captures screenshots for review |
| **Contrast/Focus** | `uiqa-contrast-visibility.yml` | ⚠️ Conditional | WCAG contrast checks |
| **i18n Completeness** | `i18n-audit.yml` | ⚠️ Conditional | Runs tests but `continue-on-error: true` on audit |

### Coverage Gaps

| Missing Gate | Script Available | Priority |
|--------------|------------------|----------|
| TypeScript type checking | `npm run typecheck` | P1 |
| Prettier format check | `npm run format:check` | P2 |
| Strict lint (blocking) | `npm run lint` | P1 |
| E2E as blocking gate | `npm run test:e2e` | P2 |
| Security scanning (SAST) | N/A | P2 |
| Dependency vulnerability scan | Dependabot (passive) | P2 |

---

## 4. Security Posture Notes

### 4.1 Action Version Pinning

| Action | Current Pinning | Risk | Recommendation |
|--------|-----------------|------|----------------|
| `actions/checkout` | `@v4` | Medium | Consider SHA pin: `@b4ffde65f46336ab88eb53be808477a3936bae11` |
| `actions/setup-node` | `@v4` | Medium | Consider SHA pin |
| `actions/upload-artifact` | `@v4` | Medium | Consider SHA pin |
| `actions/cache` | `@v4` | Medium | Consider SHA pin |
| `actions/configure-pages` | `@v4` | Medium | Consider SHA pin |
| `actions/upload-pages-artifact` | `@v3` | Medium | Consider SHA pin |
| `actions/deploy-pages` | `@v4` | Medium | Consider SHA pin |
| `actions/github-script` | `@v7` | Medium | Consider SHA pin |

**Evidence:** All workflow files use major version tags (e.g., `@v4`) instead of SHA pinning.

**Risk:** Major version tags can change without notice. A compromised action could be pushed under the same major version tag, leading to supply chain attacks.

**Recommendation:** For production repositories, consider pinning to exact SHA hashes and using Dependabot to update them.

### 4.2 Permissions

| Workflow | Permissions | Assessment |
|----------|-------------|------------|
| `ci.yml` | contents: read, checks: write, pull-requests: write | ✅ Appropriate |
| `copilot-setup-steps.yml` | contents: read | ✅ Minimal |
| `deploy-github-pages.yml` | contents: read, pages: write, id-token: write | ✅ Appropriate for Pages |
| `i18n-audit.yml` | contents: read, pull-requests: write | ✅ Appropriate |
| `pr-preview.yml` | contents: read, pull-requests: write | ✅ Appropriate |
| `sequential-copilot-automation.yml` | contents: write, pull-requests: write, issues: write | ⚠️ Broad but needed for automation |
| `_uiqa_bootstrap.yml` | contents: read | ✅ Minimal |
| `uiqa-a11y.yml` | contents: read, pull-requests: write, checks: write | ✅ Appropriate |
| `uiqa-contrast-visibility.yml` | contents: read, pull-requests: write, checks: write | ✅ Appropriate |
| `uiqa-foundation.yml` | contents: read, checks: write, pull-requests: write | ✅ Appropriate |
| `uiqa-lighthouse.yml` | contents: read, pull-requests: write, checks: write | ✅ Appropriate |
| `uiqa-ui-states.yml` | contents: read, pull-requests: write, checks: write | ✅ Appropriate |
| `uiqa-visual.yml` | contents: read, pull-requests: write, checks: write | ✅ Appropriate |

### 4.3 Secrets Usage

| Secret | Used In | Purpose | Risk |
|--------|---------|---------|------|
| `COPILOT_PAT` | `sequential-copilot-automation.yml` | Admin merge, issue management | ⚠️ PAT with elevated permissions |

**Assessment:** The `COPILOT_PAT` secret is used for automated PR merging with `--admin` flag and issue assignment. This requires a PAT with:
- `repo` scope (full control of private repositories)
- `write:org` or similar for issue management

**Recommendation:** Document required PAT scopes; consider using GitHub App authentication for better audit trails.

### 4.4 Missing Security Workflows

| Missing Component | Priority | Recommendation |
|-------------------|----------|----------------|
| CodeQL SAST scanning | P2 | Add `.github/workflows/codeql.yml` |
| Dependency review | P2 | Add `dependency-review-action` on PRs |
| Secret scanning alerts | P3 | Enable in repository settings |
| npm audit | P2 | Add `npm audit --audit-level=high` step |

---

## 5. Detailed Issue Analysis

### Issue 1: No TypeScript Type-Checking Gate in Main CI

**Symptom:** Type errors can be merged without detection.

**Root Cause:** The `ci.yml` workflow runs `npm run test` and `npm run build` but not `npm run typecheck`. The build command uses `tsc -b --noCheck` (see `package.json:L9`), which explicitly disables type checking.

**Where:** `ci.yml` - missing step between lint and test.

**Impact:** 
- Type errors may slip into production
- IDE errors won't be caught in CI
- Reduced code quality assurance

**Suggested Solution:**
```yaml
# Add after lint step in ci.yml
- name: Run type check
  run: npm run typecheck
```

**Priority:** P1

**Acceptance Criteria:**
- [ ] `npm run typecheck` runs in CI before tests
- [ ] TypeScript errors fail the CI pipeline
- [ ] PR cannot merge with type errors

---

### Issue 2: Lint Step Uses `continue-on-error: true`

**Symptom:** Lint failures are visible in logs but don't block merges.

**Root Cause:** The lint step in `ci.yml:L48` has `continue-on-error: true`.

**Where:** `.github/workflows/ci.yml:L46-48`
```yaml
- name: Run linter
  run: npm run lint
  continue-on-error: true # Don't fail CI on lint warnings
```

**Impact:**
- ESLint violations can be merged
- Code style inconsistencies accumulate
- Security-related lint rules may be bypassed

**Suggested Solution:**
Option A: Remove `continue-on-error: true` to block on lint failures.
Option B: Add separate "lint warning" vs "lint error" distinction with exit codes.

**Priority:** P1

**Acceptance Criteria:**
- [ ] ESLint errors fail the CI pipeline
- [ ] OR ESLint results are reported as check annotations with clear pass/fail status

---

### Issue 3: No Format Check in CI

**Symptom:** Inconsistently formatted code can be merged.

**Root Cause:** The `format:check` script exists but is not called in any CI workflow.

**Where:** `ci.yml` - missing step.

**Evidence:** `package.json:L14`:
```json
"format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\""
```

**Impact:**
- Code formatting inconsistencies
- Larger diffs due to formatting changes mixed with logic changes
- Reduced code readability

**Suggested Solution:**
```yaml
- name: Check formatting
  run: npm run format:check
```

**Priority:** P2

**Acceptance Criteria:**
- [ ] `npm run format:check` runs in CI
- [ ] Formatting violations fail the CI pipeline

---

### Issue 4: deploy-github-pages.yml Globally Disabled

**Symptom:** GitHub Pages deployment workflow never runs.

**Root Cause:** Line 19 contains `if: false` at the workflow level.

**Where:** `.github/workflows/deploy-github-pages.yml:L19`
```yaml
if: false
```

**Impact:**
- No automated GitHub Pages deployment
- Workflow file presence may confuse contributors

**Suggested Solution:**
- Remove `if: false` when ready to deploy
- OR delete workflow file if not planned for use
- OR add documentation explaining when to enable

**Priority:** P3

**Acceptance Criteria:**
- [ ] Workflow is either enabled and functional OR removed OR documented

---

### Issue 5: pr-preview.yml Globally Disabled

**Symptom:** PR preview workflow never runs.

**Root Cause:** Line 20 contains `if: false` at the workflow level.

**Where:** `.github/workflows/pr-preview.yml:L20`
```yaml
if: false
```

**Impact:**
- No PR preview artifacts
- Contributors must build locally to preview changes

**Suggested Solution:**
- Enable if artifact-based previews are wanted
- OR delete if using external preview services (Vercel, Netlify)
- The workflow comments suggest using external services for better experience

**Priority:** P3

**Acceptance Criteria:**
- [ ] Workflow is either enabled OR removed OR documented as deprecated

---

### Issue 6: Redundant Dependency Installation Across Workflows

**Symptom:** Every UIQA workflow independently installs dependencies, installs Playwright, and builds the app.

**Root Cause:** Each workflow is self-contained for reliability but leads to redundant compute.

**Where:** All UIQA workflows (`uiqa-a11y.yml`, `uiqa-contrast-visibility.yml`, `uiqa-lighthouse.yml`, `uiqa-ui-states.yml`, `uiqa-visual.yml`)

**Impact:**
- Increased CI minutes/costs
- Longer total CI time when all workflows run
- Inconsistent build outputs if source changes during parallel runs

**Suggested Solution:**
- Use the `_uiqa_bootstrap.yml` reusable workflow more effectively
- OR use job outputs/artifacts to share built application
- OR consider composite actions for shared setup steps

**Priority:** P2

**Acceptance Criteria:**
- [ ] Build artifacts are shared across UIQA workflows
- [ ] OR documented decision to accept redundancy for isolation

---

### Issue 7: Dependabot Directory Misconfigured

**Symptom:** Dependabot may not correctly discover dependencies.

**Root Cause:** The `directory` is set to `/` but `package.json` is in `/frontend`.

**Where:** `.github/dependabot.yml:L4`
```yaml
- package-ecosystem: "npm"
  directory: "/"
```

**Impact:**
- Dependabot may not update frontend dependencies
- Vulnerability alerts may be missed

**Suggested Solution:**
```yaml
- package-ecosystem: "npm"
  directory: "/frontend"
```

**Priority:** P2

**Acceptance Criteria:**
- [ ] Dependabot PRs appear for frontend dependencies
- [ ] OR directory is confirmed working with npm workspaces

---

### Issue 8: No Integration Tests Blocking Merge

**Symptom:** E2E/Playwright tests run but don't fail CI.

**Root Cause:** `ci.yml:L100-102` uses `continue-on-error: true` for Playwright tests.

**Where:** `.github/workflows/ci.yml:L100-102`
```yaml
- name: Run Playwright screenshot tests
  run: npx playwright test
  continue-on-error: true # Don't fail if screenshots don't match, just upload them
```

**Impact:**
- Broken E2E flows can be merged
- Visual regressions are not blocking
- Relies on manual artifact review

**Suggested Solution:**
- Remove `continue-on-error` for critical E2E tests
- OR separate "screenshot comparison" (optional) from "functional E2E" (required)

**Priority:** P2

**Acceptance Criteria:**
- [ ] Critical E2E test failures block merge
- [ ] Screenshot-only tests may remain advisory

---

## 6. Gaps + Recommended Future Gates

### 6.1 Missing CI Gates (Priority Order)

| Gate | Script | Priority | Effort |
|------|--------|----------|--------|
| TypeScript type check | `npm run typecheck` | P1 | Low |
| Strict lint (remove continue-on-error) | `npm run lint` | P1 | Low |
| Prettier format check | `npm run format:check` | P2 | Low |
| E2E functional tests (blocking) | `npm run test:e2e` | P2 | Medium |
| npm audit | `npm audit --audit-level=high` | P2 | Low |
| CodeQL security scan | N/A (new workflow) | P2 | Medium |
| Dependency review | `dependency-review-action` | P2 | Low |

### 6.2 Missing UIQA Gates

| Gate | Currently | Recommendation |
|------|-----------|----------------|
| Accessibility score threshold | Warning only | Consider failing on WCAG AA violations |
| Lighthouse performance threshold | 50% (warn) | Consider 70%+ for blocking |
| Visual regression baseline | Screenshot capture only | Consider pixel-diff comparison |

### 6.3 Recommended New Workflows

1. **CodeQL Security Analysis**
   - SAST scanning for JavaScript/TypeScript
   - Run on PR and push to main

2. **Dependency Review**
   - Block PRs that add vulnerable dependencies
   - Use `actions/dependency-review-action`

3. **Stale Workflow Cleanup**
   - Remove disabled workflows
   - OR document their purpose clearly

---

## 7. Fast Wins List

| # | Change | Effort | Impact | Priority |
|---|--------|--------|--------|----------|
| 1 | Add `npm run typecheck` step to ci.yml | 5 min | High | P1 |
| 2 | Remove `continue-on-error: true` from lint step | 1 min | High | P1 |
| 3 | Add `npm run format:check` step to ci.yml | 5 min | Medium | P2 |
| 4 | Fix Dependabot directory from `/` to `/frontend` | 1 min | Medium | P2 |
| 5 | Add `timeout-minutes: 20` to all jobs without timeouts | 5 min | Low | P3 |
| 6 | Add `npm audit` step after dependency install | 5 min | Medium | P2 |
| 7 | Remove duplicate verify-languages call in smoke-validation job | 5 min | Low | P3 |

---

## 8. Unknowns + Verification Plan

| Unknown | Why Unknown | Verification Steps |
|---------|-------------|-------------------|
| Whether Dependabot is actually updating dependencies | Cannot access Dependabot PR history | Check repository Settings → Security → Dependabot; review recent Dependabot PRs |
| Whether COPILOT_PAT secret has correct scopes | Secret values are not accessible | Review secret configuration in Settings → Secrets and variables; test workflow manually |
| Whether branch protection rules require CI passage | Cannot access repository settings | Check Settings → Branches → Branch protection rules for main/develop |
| Whether GitHub Advanced Security is enabled | Cannot access repository security settings | Check Settings → Security → Code security and analysis |
| Whether npm cache is effective | Cannot measure cache hit rates | Review CI logs for "cache restored" vs "cache miss" messages |
| Whether UIQA workflows are actually used/reviewed | Cannot see workflow run history | Check Actions tab for workflow run frequency; interview team |

---

## 9. Action Version Inventory

| Action | Version Used | Latest Stable | SHA (if pinning needed) |
|--------|--------------|---------------|-------------------------|
| `actions/checkout` | v4 | v4 | `b4ffde65f46336ab88eb53be808477a3936bae11` (4.1.7) |
| `actions/setup-node` | v4 | v4 | `60edb5dd545a775178f52524783378180af0d1f8` (4.0.3) |
| `actions/upload-artifact` | v4 | v4 | `5d5d22a31266ced268874388b861e4b58bb5c2f3` (4.3.4) |
| `actions/cache` | v4 | v4 | `0c45773b623bea8c8e75f6c82b208c3cf94ea4f9` (4.0.2) |
| `actions/configure-pages` | v4 | v5 | Consider updating |
| `actions/upload-pages-artifact` | v3 | v3 | Current |
| `actions/deploy-pages` | v4 | v4 | Current |
| `actions/github-script` | v7 | v7 | Current |

**Note:** SHA hashes are examples from known stable versions. Always verify against the official action repositories before pinning.

---

## 10. Appendix: Workflow Trigger Overlap

| Trigger | Workflows Activated |
|---------|---------------------|
| Push to main | ci.yml, deploy-github-pages.yml (disabled) |
| Push to develop | ci.yml |
| Push to copilot/** | ci.yml |
| PR to main | ci.yml, i18n-audit.yml, uiqa-foundation.yml, uiqa-a11y.yml, uiqa-contrast-visibility.yml, uiqa-lighthouse.yml, uiqa-ui-states.yml, uiqa-visual.yml, pr-preview.yml (disabled) |
| PR to develop | ci.yml, i18n-audit.yml, uiqa-foundation.yml, uiqa-a11y.yml, uiqa-contrast-visibility.yml, uiqa-lighthouse.yml, uiqa-ui-states.yml, uiqa-visual.yml |
| workflow_dispatch | All workflows except sequential-copilot-automation |
| PR review_requested | sequential-copilot-automation.yml |

**Observation:** PRs to main/develop trigger 9+ workflows simultaneously, which may lead to:
- Long total CI times
- High GitHub Actions minute consumption
- Potential rate limiting on artifact uploads

---

## Self-audit (task-level)

- [x] I created/used `/reports/` only.
- [x] I did not modify any existing file.
- [x] I produced the deliverables listed for this task (`CI_CD_WORKFLOWS_AUDIT.md`).
- [x] I did not leave determinable sections as "unknown".
- [x] For any remaining unknowns, I documented why and how to verify manually.

---

## Safety Checks

1. ✅ **No changes outside `/reports/`** - Only created `/reports/CI_CD_WORKFLOWS_AUDIT.md`
2. ✅ **No existing files were modified** - This is a new file
3. ✅ **The report file requested by this task exists** - `/reports/CI_CD_WORKFLOWS_AUDIT.md`
4. ✅ **No section is left "unknown" if determinable** - All determinable sections completed
5. ✅ **Unknown items documented** - See Section 8 for unknowns with verification plans
