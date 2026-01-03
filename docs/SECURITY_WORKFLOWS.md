# Security Workflows Documentation

This document describes the automated security workflows configured for this repository.

---

## Overview

This repository uses GitHub Actions for automated security scanning:

| Workflow | Purpose | Trigger | Permissions |
|----------|---------|---------|-------------|
| **CodeQL** | Static Application Security Testing (SAST) | PR, Push, Weekly | `contents: read`, `security-events: write`, `actions: read` |
| **Dependency Review** | Vulnerability detection in dependencies | PR (lockfile changes) | `contents: read`, `pull-requests: write` |
| **npm Audit** | Detailed vulnerability reporting | PR, Weekly | `contents: read` |

---

## CodeQL Security Analysis

**File**: `.github/workflows/codeql.yml`

### What It Does

CodeQL performs static analysis of JavaScript/TypeScript code to identify:
- Security vulnerabilities (SQL injection, XSS, path traversal, etc.)
- Code quality issues
- Coding errors and anti-patterns

### When It Runs

| Trigger | Branches | Path Filters |
|---------|----------|--------------|
| Push | `main`, `develop` | `frontend/src/**`, `frontend/package.json`, `frontend/package-lock.json` |
| Pull Request | `main`, `develop` | Same as above |
| Schedule | N/A | Weekly (Sundays at 1:00 AM UTC) |
| Manual | Any | None |

### Configuration

```yaml
languages: javascript-typescript
queries: security-extended  # Includes additional security queries
```

### Viewing Results

1. Go to the **Security** tab in GitHub
2. Click **Code scanning alerts**
3. Review and triage findings

### Permissions (Least Privilege)

| Permission | Purpose |
|------------|---------|
| `contents: read` | Read repository code |
| `security-events: write` | Upload SARIF results to Security tab |
| `actions: read` | Read workflow runs for analysis context |

### Best Practices

- ✅ Review all high/critical findings promptly
- ✅ Dismiss false positives with a comment explaining why
- ✅ Use `.github/codeql/codeql-config.yml` to customize queries if needed
- ✅ Scheduled weekly scans catch issues in unchanged code

---

## Dependency Review

**File**: `.github/workflows/dependency-review.yml`

### What It Does

Scans pull requests for vulnerable dependency changes:
- Detects known vulnerabilities in new/updated dependencies
- Checks transitive dependencies
- Provides actionable comments on PRs

### When It Runs

| Trigger | Branches | Path Filters |
|---------|----------|--------------|
| Pull Request | `main`, `develop` | `frontend/package.json`, `frontend/package-lock.json` |

### Configuration

```yaml
fail-on-severity: high          # Blocks PRs with high/critical vulnerabilities
comment-summary-in-pr: always   # Posts summary comment on every PR
```

### Severity Levels

| Severity | Action |
|----------|--------|
| Critical | ❌ Blocks PR |
| High | ❌ Blocks PR |
| Medium | ⚠️ Warning (does not block) |
| Low | ⚠️ Warning (does not block) |

### Viewing Results

1. Open the PR
2. Check the **Checks** tab for "Review Dependencies" status
3. Read the comment posted by the action for detailed findings

### Permissions (Least Privilege)

| Permission | Purpose |
|------------|---------|
| `contents: read` | Read lockfiles for analysis |
| `pull-requests: write` | Post summary comments on PRs |

### Handling Blocked PRs

If the dependency review fails:

1. **Update the vulnerable dependency**:
   ```bash
   cd frontend
   npm update <package-name>
   ```

2. **If no fix is available**, assess the risk:
   - Check if the vulnerability affects your usage
   - Consider alternative packages
   - Document the risk acceptance

3. **To temporarily allow a specific advisory** (use sparingly):
   Add to the workflow:
   ```yaml
   allow-ghsas: GHSA-xxxx-xxxx-xxxx
   ```

---

## npm Audit (Report-Only)

**File**: `.github/workflows/npm-audit.yml`

### What It Does

Runs npm audit and provides detailed vulnerability information:
- Generates a summary report in the GitHub Actions job summary
- Counts vulnerabilities by severity (critical, high, moderate, low)
- Emits warnings for high/critical findings (as annotations)
- **Does not block PRs** - report-only mode for visibility

### When It Runs

| Trigger | Branches | Path Filters |
|---------|----------|--------------|
| Pull Request | `main`, `develop` | `frontend/package.json`, `frontend/package-lock.json` |
| Schedule | N/A | Weekly (Mondays at 2:00 AM UTC) |
| Manual | Any | None |

### Policy

This workflow follows a **report-only** policy:
- ✅ All vulnerabilities are reported with severity counts
- ✅ High/critical findings generate warning annotations
- ✅ PRs are **not blocked** (use dependency-review for blocking)
- ✅ Weekly scans ensure ongoing visibility

### Viewing Results

1. Go to the **Actions** tab
2. Click the "npm Audit" workflow run
3. View the **Summary** section for the vulnerability report

### Local Usage

```bash
cd frontend
npm audit                    # View all vulnerabilities
npm audit --audit-level=high # Only show high/critical
npm audit fix                # Auto-fix where possible
```

---

## Security Best Practices

### For Developers

1. **Keep dependencies updated** - Merge Dependabot PRs promptly
2. **Review security alerts** - Check the Security tab regularly
3. **Don't ignore warnings** - Investigate all findings
4. **Use exact versions** - Use `npm ci` instead of `npm install` in CI

### For Maintainers

1. **Enable branch protection** - Require security checks to pass
2. **Review Dependabot config** - Ensure it covers all ecosystems
3. **Set up notifications** - Get alerts for new vulnerabilities
4. **Rotate secrets** - If any tokens are exposed, rotate immediately

---

## Workflow Dependencies

These workflows use the following GitHub Actions:

| Action | Version | Purpose |
|--------|---------|---------|
| `actions/checkout` | v4 | Clone repository |
| `github/codeql-action/init` | v3 | Initialize CodeQL |
| `github/codeql-action/autobuild` | v3 | Build code for analysis |
| `github/codeql-action/analyze` | v3 | Run CodeQL analysis |
| `actions/dependency-review-action` | v4 | Dependency vulnerability scanning |
| `actions/setup-node` | v4 | Setup Node.js for npm audit |

All actions are from official GitHub repositories and require no additional secrets.

---

## Troubleshooting

### CodeQL Takes Too Long

**Symptom**: CodeQL analysis times out (>30 minutes)

**Solutions**:
- CodeQL has a 30-minute timeout configured
- Large codebases may need timeout adjustment
- Check if the repository has excessive generated code

### Dependency Review Fails Unexpectedly

**Symptom**: PR blocked but no obvious vulnerable dependency

**Solutions**:
1. Check transitive dependencies (`npm ls <package>`)
2. Review the comment posted by the action
3. Ensure `package-lock.json` is committed
4. Try regenerating lockfile: `rm package-lock.json && npm install`

### No Security Alerts Showing

**Symptom**: Security tab shows no alerts despite code issues

**Solutions**:
1. Verify the workflow ran successfully (Actions tab)
2. Check if code paths are being filtered out
3. Ensure `security-events: write` permission is set
4. Wait for analysis to complete (can take 10-30 minutes)

---

## Related Documentation

- **[ci.md](./ci.md)** - Main CI pipeline documentation
- **[SECURITY.md](./SECURITY.md)** - Security vulnerability reporting policy
- **[dependabot.yml](../.github/dependabot.yml)** - Dependabot configuration

---

## Changelog

| Date | Change |
|------|--------|
| 2025-01 | Initial documentation |

---

*Security is everyone's responsibility. Report issues promptly!*
