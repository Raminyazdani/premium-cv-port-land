#!/usr/bin/env node

/**
 * Manual Language Verification Script
 * 
 * This script loads and validates all three language data files,
 * providing a quick sanity check without running the full test suite.
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
  cyan: '\x1b[36m',
}

function log(color, ...args) {
  console.log(color, ...args, colors.reset)
}

function loadJSON(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

function checkSection(data, sectionName) {
  const section = data[sectionName]
  
  if (Array.isArray(section)) {
    return {
      exists: true,
      type: 'array',
      count: section.length,
      hasContent: section.length > 0
    }
  } else if (typeof section === 'object' && section !== null) {
    const keys = Object.keys(section)
    return {
      exists: true,
      type: 'object',
      count: keys.length,
      hasContent: keys.length > 0
    }
  }
  
  return {
    exists: false,
    type: typeof section,
    count: 0,
    hasContent: false
  }
}

function verifyLanguage(lang, filePath, expectedKeys) {
  log(colors.bright + colors.cyan, `\n${'='.repeat(60)}`)
  log(colors.bright + colors.cyan, `Verifying ${lang.toUpperCase()}`)
  log(colors.bright + colors.cyan, `${'='.repeat(60)}`)
  
  const data = loadJSON(filePath)
  
  if (!data) {
    log(colors.red, '❌ Failed to load JSON file')
    return false
  }
  
  log(colors.green, `✅ JSON file loaded successfully`)
  log(colors.blue, `   File: ${filePath}`)
  log(colors.blue, `   Top-level keys: ${Object.keys(data).length}`)
  
  let allPassed = true
  
  // Check expected sections
  const sections = expectedKeys || [
    'basics', 'profiles', 'education', 'languages',
    'workshop_and_certifications', 'skills', 'experiences',
    'projects', 'publications', 'references'
  ]
  
  log(colors.bright, `\nSection Analysis:`)
  
  sections.forEach(sectionName => {
    const check = checkSection(data, sectionName)
    
    if (check.hasContent) {
      log(colors.green, `  ✅ ${sectionName.padEnd(30)} ${check.type}[${check.count}]`)
    } else if (check.exists) {
      log(colors.yellow, `  ⚠️  ${sectionName.padEnd(30)} ${check.type}[${check.count}] (EMPTY)`)
      allPassed = false
    } else {
      log(colors.red, `  ❌ ${sectionName.padEnd(30)} MISSING`)
      allPassed = false
    }
  })
  
  // Check basics content (all files now use canonical keys)
  if (data.basics && data.basics[0]) {
    log(colors.bright, `\nBasics Content:`)
    const basics = data.basics[0]
    log(colors.blue, `  First name: ${basics.fname || '(not found)'}`)
    log(colors.blue, `  Last name: ${basics.lname || '(not found)'}`)
    log(colors.blue, `  Email: ${basics.email || '(not found)'}`)
  }
  
  // Check education content (all files now use canonical keys)
  if (data.education && data.education[0]) {
    log(colors.bright, `\nEducation Content:`)
    const edu = data.education[0]
    log(colors.blue, `  First institution: ${edu.institution || '(not found)'}`)
  }
  
  // Check projects content (all files now use canonical keys)
  if (data.projects && data.projects.length > 0) {
    log(colors.bright, `\nProjects Content:`)
    const proj = data.projects[0]
    log(colors.blue, `  First project: ${proj.title || '(not found)'}`)
  }
  
  log(colors.bright, `\nOverall Status: ${allPassed ? colors.green + '✅ PASSED' : colors.red + '❌ FAILED'}`)
  
  return allPassed
}

function main() {
  log(colors.bright + colors.blue, '\n🔍 CV Language Data Verification')
  log(colors.bright + colors.blue, '================================\n')
  
  const projectRoot = resolve(__dirname, '..')
  
  // NOTE: As of Issue 01, all CV files use canonical English keys
  const canonicalSections = [
    'basics', 'profiles', 'education', 'languages',
    'workshop_and_certifications', 'skills', 'experiences',
    'projects', 'publications', 'references'
  ]
  
  const results = {
    en: verifyLanguage('English', resolve(projectRoot, 'src/data/cv.json'), canonicalSections),
    de: verifyLanguage('German', resolve(projectRoot, 'src/data/cv_de.json'), canonicalSections),
    fa: verifyLanguage('Persian', resolve(projectRoot, 'src/data/cv_fa.json'), canonicalSections)
  }
  
  log(colors.bright + colors.cyan, `\n${'='.repeat(60)}`)
  log(colors.bright + colors.cyan, 'FINAL SUMMARY')
  log(colors.bright + colors.cyan, `${'='.repeat(60)}`)
  
  const allPassed = results.en && results.de && results.fa
  
  log(results.en ? colors.green : colors.red, `English (EN):  ${results.en ? '✅ PASSED' : '❌ FAILED'}`)
  log(results.de ? colors.green : colors.red, `German (DE):   ${results.de ? '✅ PASSED' : '❌ FAILED'}`)
  log(results.fa ? colors.green : colors.red, `Persian (FA):  ${results.fa ? '✅ PASSED' : '❌ FAILED'}`)
  
  log(colors.bright, `\n${allPassed ? colors.green + '✅ ALL LANGUAGES VERIFIED SUCCESSFULLY!' : colors.red + '❌ SOME LANGUAGES FAILED VERIFICATION'}`)
  
  log(colors.bright + colors.blue, '\n💡 Next Steps:')
  log(colors.blue, '   1. Run full test suite: npm test')
  log(colors.blue, '   2. Run language tests: npm run test:language')
  log(colors.blue, '   3. Start dev server: npm run dev')
  log(colors.blue, '   4. Test in browser: http://localhost:5000')
  
  process.exit(allPassed ? 0 : 1)
}

main()
