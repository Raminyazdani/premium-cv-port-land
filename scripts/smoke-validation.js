#!/usr/bin/env node

/**
 * Smoke Validation Script for EN/DE/FA
 * 
 * This script validates that all three language data files:
 * 1. Load without errors
 * 2. Have all required sections
 * 3. Have content in each section (not empty)
 * 
 * Used by CI to catch empty/undefined regressions.
 * Note: This is a lightweight check that validates raw JSON structure.
 * For deeper validation including normalization, see tests/language-content-verification.test.tsx
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(color, ...args) {
  console.log(color, ...args, colors.reset)
}

// Expected sections for each language
const LANGUAGE_SECTIONS = {
  en: [
    'basics', 'profiles', 'education', 'languages',
    'workshop_and_certifications', 'skills', 'experiences',
    'projects', 'publications', 'references'
  ],
  de: [
    'grunddaten', 'profile', 'ausbildung', 'sprachen',
    'schulungen_und_zertifikate', 'faehigkeiten', 'erfahrungen',
    'projekte', 'publikationen', 'referenzen'
  ],
  fa: [
    'اطلاعات_پایه', 'پروفایل‌ها', 'تحصیلات', 'زبان‌ها',
    'کارگاه‌ها_و_گواهی‌ها', 'مهارت‌ها', 'سوابق',
    'پروژه‌ها', 'انتشارات', 'معرف‌ها'
  ]
}

const LANGUAGE_FILES = {
  en: 'src/data/cv.json',
  de: 'src/data/ramin_de.json',
  fa: 'src/data/ramin_fa.json'
}

function validateLanguage(lang) {
  log(colors.bright + colors.blue, `\n=== Validating ${lang.toUpperCase()} ===`)
  
  const projectRoot = resolve(__dirname, '..')
  const filePath = resolve(projectRoot, LANGUAGE_FILES[lang])
  const expectedSections = LANGUAGE_SECTIONS[lang]
  
  let allPassed = true
  const errors = []
  const warnings = []
  
  try {
    // Load JSON file
    const content = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)
    
    log(colors.green, `✅ JSON loaded successfully`)
    
    // Check each expected section
    expectedSections.forEach(section => {
      if (!(section in data)) {
        errors.push(`Missing section: "${section}"`)
        allPassed = false
        return
      }
      
      const sectionData = data[section]
      
      // Check if section is empty
      if (Array.isArray(sectionData)) {
        if (sectionData.length === 0) {
          errors.push(`Section "${section}" is empty (0 items)`)
          allPassed = false
        }
      } else if (typeof sectionData === 'object' && sectionData !== null) {
        if (Object.keys(sectionData).length === 0) {
          errors.push(`Section "${section}" is empty (0 keys)`)
          allPassed = false
        }
      } else if (sectionData === null || sectionData === undefined) {
        errors.push(`Section "${section}" is null or undefined`)
        allPassed = false
      }
    })
    
    // Check for literal "undefined" or "null" strings in JSON
    if (content.includes(': "undefined"') || content.includes(':"undefined"')) {
      errors.push('Found literal "undefined" string in JSON')
      allPassed = false
    }
    
  } catch (error) {
    errors.push(`Exception: ${error.message}`)
    allPassed = false
  }
  
  // Report results
  if (errors.length > 0) {
    log(colors.red, `❌ FAILED with ${errors.length} error(s):`)
    errors.forEach(err => log(colors.red, `   - ${err}`))
  }
  
  if (warnings.length > 0) {
    log(colors.yellow, `⚠️  ${warnings.length} warning(s):`)
    warnings.forEach(warn => log(colors.yellow, `   - ${warn}`))
  }
  
  if (allPassed) {
    log(colors.green, '✅ PASSED - All sections exist and have content')
  }
  
  return allPassed
}

function main() {
  log(colors.bright, '\n🔍 Smoke Validation: EN/DE/FA Data Structure')
  log(colors.bright, '=============================================\n')
  
  const results = {
    en: validateLanguage('en'),
    de: validateLanguage('de'),
    fa: validateLanguage('fa')
  }
  
  // Final summary
  log(colors.bright + colors.blue, '\n=== FINAL SUMMARY ===')
  log(results.en ? colors.green : colors.red, `English (EN):  ${results.en ? '✅ PASSED' : '❌ FAILED'}`)
  log(results.de ? colors.green : colors.red, `German (DE):   ${results.de ? '✅ PASSED' : '❌ FAILED'}`)
  log(results.fa ? colors.green : colors.red, `Persian (FA):  ${results.fa ? '✅ PASSED' : '❌ FAILED'}`)
  
  const allPassed = results.en && results.de && results.fa
  
  if (allPassed) {
    log(colors.bright + colors.green, '\n✅ ALL SMOKE TESTS PASSED')
    log(colors.green, 'All three languages have valid structure with no empty sections.')
  } else {
    log(colors.bright + colors.red, '\n❌ SMOKE TESTS FAILED')
    log(colors.red, 'One or more languages have issues. See details above.')
  }
  
  process.exit(allPassed ? 0 : 1)
}

main()

