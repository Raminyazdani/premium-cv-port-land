#!/usr/bin/env node

/**
 * Accessibility Audit Script
 * 
 * This script checks for common accessibility issues in the codebase.
 * Run with: node scripts/accessibility-audit.js
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
}

const issues = []
const warnings = []

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`)
}

function findFiles(dir, pattern, fileList = []) {
  const files = readdirSync(dir)
  
  files.forEach(file => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build') {
        findFiles(filePath, pattern, fileList)
      }
    } else if (pattern.test(file)) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  lines.forEach((line, index) => {
    const lineNum = index + 1
    
    // Check for images without alt text
    if (/<img[^>]*src=/.test(line) && !/<img[^>]*alt=/.test(line)) {
      issues.push({
        file: filePath,
        line: lineNum,
        type: 'Missing alt attribute',
        message: 'Image element missing alt attribute'
      })
    }
    
    // Check for buttons without accessible labels
    if (/<button[^>]*>[\s]*<\/button>/.test(line)) {
      warnings.push({
        file: filePath,
        line: lineNum,
        type: 'Potentially empty button',
        message: 'Button may be empty or only contain icons without accessible labels'
      })
    }
    
    // Check for onclick without keyboard handler
    if (/onClick=/.test(line) && !/onKeyDown=/.test(line) && !/onKeyPress=/.test(line) && !/role=["']button["']/.test(line)) {
      if (!/^[\s]*<button/.test(line) && !/^[\s]*<a/.test(line)) {
        warnings.push({
          file: filePath,
          line: lineNum,
          type: 'Click handler without keyboard support',
          message: 'Element has onClick but may not be keyboard accessible'
        })
      }
    }
    
    // Check for aria-label usage
    if (/aria-label/.test(line)) {
      // This is good, just count them
    }
    
    // Check for role without proper ARIA attributes
    if (/role=["']dialog["']/.test(line) && !/aria-modal/.test(line)) {
      warnings.push({
        file: filePath,
        line: lineNum,
        type: 'Missing aria-modal',
        message: 'Dialog element missing aria-modal attribute'
      })
    }
    
    // Check for focusable elements with negative tabindex
    if (/tabIndex=\{?-1\}?/.test(line)) {
      warnings.push({
        file: filePath,
        line: lineNum,
        type: 'Negative tabIndex',
        message: 'Element has tabIndex=-1 which removes it from keyboard navigation'
      })
    }
  })
}

function main() {
  log(COLORS.blue, '\n=== Accessibility Audit ===\n')
  
  const srcDir = join(process.cwd(), 'src')
  const tsxFiles = findFiles(srcDir, /\.(tsx|jsx)$/)
  
  log(COLORS.blue, `Scanning ${tsxFiles.length} component files...\n`)
  
  tsxFiles.forEach(checkFile)
  
  // Print results
  if (issues.length === 0 && warnings.length === 0) {
    log(COLORS.green, '✓ No accessibility issues found!\n')
  } else {
    if (issues.length > 0) {
      log(COLORS.red, `\n❌ Found ${issues.length} critical issue(s):\n`)
      issues.forEach(issue => {
        log(COLORS.red, `  ${issue.file}:${issue.line}`)
        log(COLORS.reset, `    ${issue.type}: ${issue.message}\n`)
      })
    }
    
    if (warnings.length > 0) {
      log(COLORS.yellow, `\n⚠️  Found ${warnings.length} warning(s):\n`)
      warnings.forEach(warning => {
        log(COLORS.yellow, `  ${warning.file}:${warning.line}`)
        log(COLORS.reset, `    ${warning.type}: ${warning.message}\n`)
      })
    }
  }
  
  log(COLORS.blue, '\n=== Summary ===')
  log(COLORS.red, `Critical Issues: ${issues.length}`)
  log(COLORS.yellow, `Warnings: ${warnings.length}`)
  log(COLORS.green, `Files Scanned: ${tsxFiles.length}\n`)
  
  // Exit with error code if critical issues found
  if (issues.length > 0) {
    process.exit(1)
  }
}

main()
