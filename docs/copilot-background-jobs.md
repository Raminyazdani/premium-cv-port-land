# Copilot Background Jobs - Environment Setup & Configuration

This document explains how to configure and use GitHub Copilot coding agent environment for this CV website project.

## Table of Contents

- [Overview](#overview)
- [Setup Workflow](#setup-workflow)
- [Environment Variables](#environment-variables)
- [Firewall Configuration](#firewall-configuration)
- [Troubleshooting](#troubleshooting)

## Overview

GitHub Copilot coding agents can execute tasks in a sandboxed environment. This project includes setup steps to preinstall dependencies and make background jobs faster and more reliable.

### Key Features

- **Deterministic setup**: Same environment every time
- **Faster execution**: Pre-installed dependencies
- **Validated configuration**: Automated checks for required files
- **Ubuntu x64**: Only supported platform for Copilot coding agents

## Setup Workflow

### Location

`.github/workflows/copilot-setup-steps.yml`

### How It Works

1. **Must be on default branch**: The workflow only applies when it's merged to your default branch (usually `main`)
2. **Job name is critical**: The job MUST be named exactly `copilot-setup-steps`
3. **Runs on agent creation**: Executes when a Copilot coding agent starts work
4. **Caches dependencies**: Node modules and build artifacts are cached

### Manual Testing

You can manually trigger the setup workflow to verify it works:

```bash
# Via GitHub CLI
gh workflow run copilot-setup-steps.yml

# Or via GitHub web UI:
# 1. Go to Actions tab
# 2. Select "Copilot Setup Steps" workflow
# 3. Click "Run workflow" button
```

### What Gets Installed

The setup workflow installs:
- Node.js 20 (LTS)
- npm dependencies via `npm ci`
- Vite (build tool)
- Vitest (test runner)
- All project dependencies from package.json

### Verification Steps

The workflow verifies:
- ✅ Node.js version
- ✅ npm version
- ✅ Vite availability
- ✅ Vitest availability
- ✅ Test files exist
- ✅ Locked CV data files exist

## Environment Variables

### Available in Copilot Environment

The Copilot coding agent environment supports environment variables and secrets. Configure them via GitHub settings.

#### How to Set Environment Variables

**Option 1: Repository Secrets (Recommended)**
```
1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Add name and value
5. Copilot agents can access via process.env
```

**Option 2: Workflow Environment Variables**
```yaml
# In .github/workflows/copilot-setup-steps.yml
env:
  NODE_ENV: production
  VITE_API_URL: https://api.example.com
```

### Common Environment Variables

This project uses:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment (development/production) | `production` |
| `CI` | CI environment flag | `true` in CI |

### DO NOT Store in Environment

⚠️ **Never store these in environment variables:**
- Locked CV data files content
- User personal information
- Private keys without proper secret management

## Firewall Configuration

### Firewall Behavior

GitHub Copilot coding agents have a firewall that restricts network access:

- **Applies to**: Commands run via Bash by the agent
- **Does NOT apply to**: 
  - MCP (Model Context Protocol) servers
  - Setup workflow steps
  - GitHub API calls

### What's Allowed by Default

✅ **Allowed:**
- npm registry (registry.npmjs.org)
- GitHub (github.com, api.github.com)
- Common CDNs (unpkg.com, cdn.jsdelivr.net)

### Handling Blocked Dependencies

If a dependency fails to install due to firewall:

#### Option 1: Request Allowlist (Recommended)

```bash
# If you see:
# Error: connect ECONNREFUSED xxx.xxx.xxx.xxx:443

# The domain is blocked. Solutions:
# 1. Ask the user to allowlist the domain
# 2. Use alternative dependency from allowed registry
# 3. Bundle dependency if it's small
```

#### Option 2: Use Setup Workflow

Move dependency installation to `.github/workflows/copilot-setup-steps.yml`:

```yaml
- name: Install special dependency
  run: npm install special-package
```

**Why this works**: Setup workflows are NOT subject to firewall restrictions.

#### Option 3: Use MCP Server

If you need external data:
- Copilot has GitHub MCP server enabled by default (read-only)
- MCP servers bypass the firewall
- Good for: Reading GitHub data, code, issues, PRs

### Example: Handling Blocked CDN

```bash
# ❌ This might be blocked in agent Bash:
curl https://some-cdn.com/package.tgz

# ✅ Instead, use npm or add to setup workflow:
npm install package-name

# ✅ Or if it's in GitHub:
# Use GitHub MCP tools to download
```

### Firewall Best Practices

1. **Prefer npm packages**: Use official npm registry when possible
2. **Test in setup workflow**: Put complex installs in copilot-setup-steps.yml
3. **Document allowlist needs**: If a new dependency needs allowlisting, document why
4. **Don't disable firewall**: It's a security feature - work with it, not around it

## Troubleshooting

### Issue: Setup workflow doesn't run

**Symptoms**: Agent doesn't have dependencies pre-installed

**Solution**:
1. Check workflow is on default branch
2. Verify job name is exactly `copilot-setup-steps`
3. Manually trigger workflow to test: `gh workflow run copilot-setup-steps.yml`

### Issue: Dependency installation fails

**Symptoms**: `npm ci` fails in setup or agent environment

**Solution**:
```bash
# Check if package-lock.json is up to date
npm install
git diff package-lock.json

# If there are changes, commit them:
git add package-lock.json
git commit -m "Update package-lock.json"
```

### Issue: Tests fail in agent but pass locally

**Symptoms**: CI passes but agent tests fail

**Possible causes**:
1. **Missing locked file hashes**: Run `npm run generate-hashes`
2. **Environment differences**: Check Node version matches (20.x)
3. **Timezone issues**: Use UTC for date comparisons
4. **File paths**: Use absolute paths or path.resolve()

**Debug**:
```bash
# In agent environment, run:
npm run test -- --reporter=verbose

# Check specific test:
npm run test -- tests/locked-files-integrity.test.ts
```

### Issue: Firewall blocks dependency

**Symptoms**: Network error when installing package

**Solution**:
1. Check if package is on npm registry (preferred)
2. If custom registry, request allowlist from user
3. If not critical, consider alternative package
4. If critical for setup, add to copilot-setup-steps.yml

### Issue: Build fails in agent

**Symptoms**: `npm run build` fails but works locally

**Debug steps**:
```bash
# Check build in clean environment
rm -rf node_modules dist
npm ci
npm run build

# Check for environment-specific code
grep -r "process.env" src/

# Check for missing TypeScript types
npx tsc --noEmit
```

## Additional Resources

### Official Documentation

- [Copilot Coding Agent Environment](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment)
- [Copilot Firewall Configuration](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)

### Project Documentation

- [Copilot Instructions](../.github/copilot-instructions.md)
- [Agent Runbook](../AGENTS.md)
- [CI Workflow](../.github/workflows/ci.yml)

## Feedback & Improvements

If you encounter issues not covered here:
1. Check [GitHub Copilot documentation](https://docs.github.com/copilot)
2. Update this document with your solution
3. Consider if it should be a setup workflow step
