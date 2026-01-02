#!/usr/bin/env node
/**
 * i18n Audit Script
 * 
 * Detects:
 * 1. Missing translation keys across EN/DE/FA
 * 2. Unused translation keys (optional)
 * 3. Hardcoded strings in JSX/TSX components (best-effort)
 * 
 * Outputs: i18n-audit-report.md
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FRONTEND_ROOT = path.resolve(__dirname, '..')
const SRC_DIR = path.resolve(FRONTEND_ROOT, 'src')
const COMPONENTS_DIR = path.resolve(SRC_DIR, 'components')
const I18N_FILE = path.resolve(SRC_DIR, 'lib', 'i18n.ts')

// Patterns for detecting hardcoded strings
const ALLOWED_PATTERNS = [
  // Punctuation and formatting
  /^[–|:,./\\+×✓✕•…&*#()[\]{}<>=!?%$^~`"'@\n\t\s-]+$/,
  // URLs, paths, CSS classes
  /^(https?:|mailto:|tel:|data:|#|\/)/i,
  /^(text-|bg-|border-|rounded-|p-|m-|w-|h-|flex|grid|gap-|space-|font-)/,
  // Empty or whitespace-only
  /^\s*$/,
  // Single characters
  /^.$/,
  // Numbers only
  /^\d+$/,
  // Technical identifiers
  /^(id|type|name|value|placeholder|className|style|src|href|alt|aria-|data-|role)/i,
  // HTML entities
  /^&[a-z]+;$/i,
  // Test IDs
  /^test-|testid$/i,
]

// Keywords that are likely not user-visible text
const TECHNICAL_STRINGS = [
  'div', 'span', 'button', 'input', 'form', 'section', 'article', 'header',
  'footer', 'nav', 'main', 'aside', 'ul', 'ol', 'li', 'a', 'p', 'h1', 'h2',
  'h3', 'h4', 'h5', 'h6', 'img', 'svg', 'path', 'circle', 'rect', 'line',
  'polyline', 'polygon', 'ellipse', 'text', 'g', 'defs', 'use', 'symbol',
  'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
  'onClick', 'onChange', 'onSubmit', 'onBlur', 'onFocus', 'onKeyDown',
  'default', 'export', 'import', 'from', 'as', 'const', 'let', 'var',
  'function', 'return', 'if', 'else', 'switch', 'case', 'break', 'continue',
  'for', 'while', 'do', 'try', 'catch', 'finally', 'throw', 'new', 'this',
  'class', 'extends', 'super', 'static', 'get', 'set', 'async', 'await',
  'yield', 'typeof', 'instanceof', 'in', 'of', 'delete', 'void',
]

/**
 * Recursively get all keys from a nested object
 */
function getAllKeys(obj, prefix = '') {
  const keys = []
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        keys.push(...getAllKeys(value, fullKey))
      } else {
        keys.push(fullKey)
      }
    }
  }
  return keys
}

/**
 * Parse the i18n.ts file to extract translation objects
 */
function parseI18nFile() {
  const content = fs.readFileSync(I18N_FILE, 'utf-8')
  
  // Simple extraction: find the translations object for each language
  const languages = ['en', 'de', 'fa']
  const translations = {}
  
  for (const lang of languages) {
    // Find the section for this language
    const langRegex = new RegExp(`${lang}:\\s*\\{`, 'g')
    const match = langRegex.exec(content)
    
    if (match) {
      // Find matching braces to extract the object
      let depth = 1
      let start = match.index + match[0].length
      let end = start
      
      while (depth > 0 && end < content.length) {
        if (content[end] === '{') depth++
        if (content[end] === '}') depth--
        end++
      }
      
      const objContent = content.substring(start, end - 1)
      
      // Extract keys from the object
      translations[lang] = extractKeysFromObject(objContent)
    }
  }
  
  return translations
}

/**
 * Extract translation keys from an object string (simplified parser)
 */
function extractKeysFromObject(objContent, prefix = '') {
  const keys = []
  
  // Match key: value patterns (handles both string and nested object values)
  const keyRegex = /(\w+)\s*:\s*(?:'[^']*'|"[^"]*"|`[^`]*`|\{)/g
  let match
  
  while ((match = keyRegex.exec(objContent)) !== null) {
    const key = match[1]
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    // Check if it's a nested object
    if (match[0].endsWith('{')) {
      // Find the matching closing brace
      let depth = 1
      let start = match.index + match[0].length
      let end = start
      
      while (depth > 0 && end < objContent.length) {
        if (objContent[end] === '{') depth++
        if (objContent[end] === '}') depth--
        end++
      }
      
      const nestedContent = objContent.substring(start, end - 1)
      keys.push(...extractKeysFromObject(nestedContent, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  
  return keys
}

/**
 * Find all t. or t().access patterns in source files
 */
function findUsedTranslationKeys() {
  const usedKeys = new Set()
  
  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Match patterns like:
    // t.section.key
    // t.section?.key
    // t['section']['key']
    // getUIStrings(lang).section.key
    
    // Pattern 1: t.path.to.key
    const dotAccessPattern = /\bt\.(\w+(?:\??\.\w+)*)/g
    let match
    while ((match = dotAccessPattern.exec(content)) !== null) {
      // Clean up optional chaining
      const key = match[1].replace(/\?/g, '')
      usedKeys.add(key)
    }
    
    // Pattern 2: strings.section.key (where strings = useTranslation())
    const stringsPattern = /\bstrings\.(\w+(?:\??\.\w+)*)/g
    while ((match = stringsPattern.exec(content)) !== null) {
      const key = match[1].replace(/\?/g, '')
      usedKeys.add(key)
    }
  }
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        walkDir(filePath)
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        // Skip i18n.ts itself
        if (!filePath.endsWith('i18n.ts')) {
          scanFile(filePath)
        }
      }
    }
  }
  
  walkDir(SRC_DIR)
  return usedKeys
}

/**
 * Find hardcoded strings in JSX/TSX files
 */
function findHardcodedStrings() {
  const hardcodedStrings = []
  
  function isAllowedString(str) {
    // Check against allowed patterns
    for (const pattern of ALLOWED_PATTERNS) {
      if (pattern.test(str)) {
        return true
      }
    }
    
    // Check against technical strings
    if (TECHNICAL_STRINGS.includes(str.toLowerCase())) {
      return true
    }
    
    // Short strings (< 2 chars) are usually not translatable text
    if (str.trim().length < 2) {
      return true
    }
    
    return false
  }
  
  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    const relativePath = path.relative(FRONTEND_ROOT, filePath)
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1
      
      // Skip imports, comments, and type definitions
      if (line.trim().startsWith('import ') ||
          line.trim().startsWith('//') ||
          line.trim().startsWith('*') ||
          line.trim().startsWith('type ') ||
          line.trim().startsWith('interface ') ||
          line.trim().startsWith('export type') ||
          line.trim().startsWith('export interface')) {
        return
      }
      
      // Look for string literals in JSX context
      // Pattern: >text<, >{`text`}<, >"text"<, >'text'<
      
      // Direct text content: >Some text<
      const directTextPattern = />([^<>{}"'`\n]+)</g
      let match
      while ((match = directTextPattern.exec(line)) !== null) {
        const text = match[1].trim()
        if (text && !isAllowedString(text)) {
          // Check if it's likely a variable reference
          if (!text.startsWith('{') && !text.includes('{')) {
            hardcodedStrings.push({
              file: relativePath,
              line: lineNumber,
              text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
              snippet: line.trim().substring(0, 80)
            })
          }
        }
      }
      
      // Template literals or strings in JSX: {`text`} or {"text"} or {'text'}
      // Only flag if they look like user-visible text (contain letters)
      const jsxStringPattern = /\{[`"']([^`"'\n]+)[`"']\}/g
      while ((match = jsxStringPattern.exec(line)) !== null) {
        const text = match[1].trim()
        if (text && !isAllowedString(text) && /[a-zA-Z]/.test(text)) {
          hardcodedStrings.push({
            file: relativePath,
            line: lineNumber,
            text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
            snippet: line.trim().substring(0, 80)
          })
        }
      }
    })
  }
  
  function walkDir(dir) {
    // Check if path exists first
    if (!fs.existsSync(dir)) {
      console.warn(`  Warning: Path does not exist: ${dir}`)
      return
    }
    
    // Handle case where the path is a file, not a directory
    const stat = fs.statSync(dir)
    if (!stat.isDirectory()) {
      if (dir.endsWith('.tsx')) {
        scanFile(dir)
      }
      return
    }
    
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const fileStat = fs.statSync(filePath)
      
      if (fileStat.isDirectory()) {
        // Skip ui directory (generated components)
        if (file !== 'ui' && file !== '__tests__' && file !== 'node_modules') {
          walkDir(filePath)
        }
      } else if (file.endsWith('.tsx')) {
        scanFile(filePath)
      }
    }
  }
  
  walkDir(COMPONENTS_DIR)
  // Also scan the App.tsx file directly
  const appTsxPath = path.join(SRC_DIR, 'App.tsx')
  if (fs.existsSync(appTsxPath)) {
    scanFile(appTsxPath)
  }
  
  return hardcodedStrings
}

/**
 * Generate the markdown report
 */
function generateReport(missingKeys, unusedKeys, hardcodedStrings) {
  const timestamp = new Date().toISOString()
  
  let report = `# i18n Audit Report

Generated: ${timestamp}

## Summary

| Category | Count |
|----------|-------|
| Missing Keys | ${missingKeys.length} |
| Unused Keys | ${unusedKeys.length} |
| Hardcoded Strings | ${hardcodedStrings.length} |

---

## Missing Translation Keys

These keys are referenced in code but missing in one or more languages.

`

  if (missingKeys.length === 0) {
    report += '✅ No missing keys detected.\n\n'
  } else {
    report += '| Key | Missing In |\n|-----|------------|\n'
    for (const { key, missingIn } of missingKeys) {
      report += `| \`${key}\` | ${missingIn.join(', ')} |\n`
    }
    report += '\n'
  }

  report += `---

## Unused Translation Keys (Optional Check)

These keys exist in the translation files but were not found in the codebase.
Note: This may include false positives due to dynamic key access.

`

  if (unusedKeys.length === 0) {
    report += '✅ No unused keys detected.\n\n'
  } else if (unusedKeys.length > 50) {
    report += `Found ${unusedKeys.length} potentially unused keys. Showing first 50:\n\n`
    for (const key of unusedKeys.slice(0, 50)) {
      report += `- \`${key}\`\n`
    }
    report += '\n'
  } else {
    for (const key of unusedKeys) {
      report += `- \`${key}\`\n`
    }
    report += '\n'
  }

  report += `---

## Hardcoded Strings in Components

These strings appear to be hardcoded and may need translation.
**Note:** This is a best-effort detection. Some entries may be false positives.

`

  if (hardcodedStrings.length === 0) {
    report += '✅ No hardcoded strings detected.\n\n'
  } else {
    report += '| File | Line | Text |\n|------|------|------|\n'
    for (const item of hardcodedStrings) {
      // Escape markdown table special characters: | \ and newlines
      const escapedText = item.text
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/\|/g, '\\|')   // Escape pipe characters
        .replace(/\n/g, ' ')     // Replace newlines with spaces
      report += `| ${item.file} | ${item.line} | ${escapedText} |\n`
    }
    report += '\n'
  }

  report += `---

## Recommendations

1. **Add missing translations:** Update \`src/lib/i18n.ts\` with missing keys
2. **Review hardcoded strings:** Consider moving them to the i18n system
3. **Verify unused keys:** Remove or document intentionally unused keys
4. **Run ESLint:** Use \`npm run lint\` to catch \`react/jsx-no-literals\` warnings

## Related Commands

\`\`\`bash
# Run linter to catch hardcoded strings
npm run lint

# Run unit tests for i18n
npm run test:language

# Verify language switching
npm run verify-languages
\`\`\`
`

  return report
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Running i18n audit...\n')
  
  // Step 1: Parse i18n.ts to get all translation keys per language
  console.log('📖 Parsing translation files...')
  const translationsByLang = parseI18nFile()
  
  const enKeys = new Set(translationsByLang.en || [])
  const deKeys = new Set(translationsByLang.de || [])
  const faKeys = new Set(translationsByLang.fa || [])
  
  console.log(`  EN: ${enKeys.size} keys`)
  console.log(`  DE: ${deKeys.size} keys`)
  console.log(`  FA: ${faKeys.size} keys`)
  
  // Step 2: Find keys that are missing in some languages
  console.log('\n🔎 Checking for missing keys...')
  const allKeys = new Set([...enKeys, ...deKeys, ...faKeys])
  const missingKeys = []
  
  for (const key of allKeys) {
    const missingIn = []
    if (!enKeys.has(key)) missingIn.push('EN')
    if (!deKeys.has(key)) missingIn.push('DE')
    if (!faKeys.has(key)) missingIn.push('FA')
    
    if (missingIn.length > 0 && missingIn.length < 3) {
      missingKeys.push({ key, missingIn })
    }
  }
  
  console.log(`  Found ${missingKeys.length} missing keys`)
  
  // Step 3: Find used translation keys in source files
  console.log('\n📂 Scanning source files for used keys...')
  const usedKeys = findUsedTranslationKeys()
  console.log(`  Found ${usedKeys.size} key references in source files`)
  
  // Step 4: Find unused keys (keys in translations but not in code)
  const unusedKeys = [...enKeys].filter(key => !usedKeys.has(key))
  console.log(`  Found ${unusedKeys.length} potentially unused keys`)
  
  // Step 5: Find hardcoded strings
  console.log('\n🔍 Scanning for hardcoded strings...')
  const hardcodedStrings = findHardcodedStrings()
  console.log(`  Found ${hardcodedStrings.length} potential hardcoded strings`)
  
  // Step 6: Generate report
  console.log('\n📝 Generating report...')
  const report = generateReport(missingKeys, unusedKeys, hardcodedStrings)
  
  const reportPath = path.join(FRONTEND_ROOT, 'i18n-audit-report.md')
  fs.writeFileSync(reportPath, report)
  console.log(`  Report saved to: ${reportPath}`)
  
  // Step 7: Also output JSON for CI
  const jsonOutput = {
    timestamp: new Date().toISOString(),
    missingKeys,
    unusedKeys,
    hardcodedStrings,
    summary: {
      missingKeysCount: missingKeys.length,
      unusedKeysCount: unusedKeys.length,
      hardcodedStringsCount: hardcodedStrings.length
    }
  }
  
  const jsonPath = path.join(FRONTEND_ROOT, 'i18n-audit-report.json')
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2))
  console.log(`  JSON output saved to: ${jsonPath}`)
  
  // Summary
  console.log('\n✅ i18n audit complete!')
  console.log(`  Missing keys: ${missingKeys.length}`)
  console.log(`  Unused keys: ${unusedKeys.length}`)
  console.log(`  Hardcoded strings: ${hardcodedStrings.length}`)
  
  // Exit with warning code if there are missing keys (use exit code 0 to not fail CI)
  // Set I18N_AUDIT_STRICT=true to fail on missing keys
  if (missingKeys.length > 0) {
    console.log('\n⚠️  Warning: Missing translation keys detected.')
    if (process.env.I18N_AUDIT_STRICT === 'true') {
      process.exit(1)
    }
  }
}

main().catch(err => {
  console.error('Error running i18n audit:', err)
  process.exit(1)
})
