/**
 * NORMALIZATION TEST
 * 
 * This file can be run to test normalization without starting the full app.
 * Run with: npx tsx src/utils/testNormalization.ts
 * (requires tsx: npm install -D tsx)
 */

import { normalizeCVData } from './dataNormalizer'
import type { Language } from './dataNormalizer'

// Import JSON files (adjust paths if needed)
import cvDataEN from '../data/cv.json'
import cvDataDE from '../data/ramin_de.json'
import cvDataFA from '../data/ramin_fa.json'

console.log('🧪 NORMALIZATION TEST SUITE\n')

function testLanguage(lang: Language, rawData: any) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Testing ${lang.toUpperCase()}`)
  console.log('='.repeat(60))
  
  console.log('\n📥 RAW DATA:')
  console.log('- typeof:', typeof rawData)
  console.log('- is null:', rawData === null)
  console.log('- top-level keys:', Object.keys(rawData))
  
  // Check raw data content
  Object.keys(rawData).forEach(key => {
    const value = rawData[key]
    if (Array.isArray(value)) {
      console.log(`  - ${key}: array[${value.length}]`)
      if (value.length > 0 && typeof value[0] === 'object') {
        console.log(`    → First item keys: ${Object.keys(value[0]).join(', ')}`)
      }
    } else if (typeof value === 'object' && value !== null) {
      console.log(`  - ${key}: object with keys: ${Object.keys(value).join(', ')}`)
    } else {
      console.log(`  - ${key}: ${typeof value}`)
    }
  })
  
  console.log('\n🔄 NORMALIZING...')
  let normalized
  try {
    normalized = normalizeCVData(rawData, lang)
    console.log('✅ Normalization succeeded')
  } catch (error) {
    console.error('❌ Normalization failed with error:', error)
    return
  }
  
  console.log('\n📤 NORMALIZED DATA:')
  console.log('- typeof:', typeof normalized)
  console.log('- is null:', normalized === null)
  console.log('- top-level keys:', Object.keys(normalized))
  
  // Expected canonical keys
  const expectedKeys = [
    'basics',
    'profiles',
    'education',
    'languages',
    'workshop_and_certifications',
    'skills',
    'experiences',
    'projects',
    'publications',
    'references'
  ]
  
  console.log('\n🔍 VALIDATION:')
  
  // Check for missing keys
  const missingKeys = expectedKeys.filter(key => !(key in normalized))
  if (missingKeys.length > 0) {
    console.error(`❌ Missing keys: ${missingKeys.join(', ')}`)
  } else {
    console.log('✅ All expected keys present')
  }
  
  // Check extra keys
  const actualKeys = Object.keys(normalized)
  const extraKeys = actualKeys.filter(key => !expectedKeys.includes(key))
  if (extraKeys.length > 0) {
    console.warn(`⚠️  Extra keys (might be OK): ${extraKeys.join(', ')}`)
  }
  
  // Check each section in detail
  console.log('\n📋 SECTION DETAILS:')
  
  expectedKeys.forEach(key => {
    const value = normalized[key]
    
    if (value === undefined || value === null) {
      console.error(`  ❌ ${key}: undefined or null`)
      return
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        console.warn(`  ⚠️  ${key}: EMPTY ARRAY`)
      } else {
        console.log(`  ✅ ${key}: array[${value.length}]`)
        if (typeof value[0] === 'object' && value[0] !== null) {
          console.log(`     → First item keys: ${Object.keys(value[0]).join(', ')}`)
        }
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      const objKeys = Object.keys(value)
      if (objKeys.length === 0) {
        console.warn(`  ⚠️  ${key}: EMPTY OBJECT`)
      } else {
        console.log(`  ✅ ${key}: object[${objKeys.length} keys]`)
        console.log(`     → Keys: ${objKeys.slice(0, 5).join(', ')}${objKeys.length > 5 ? '...' : ''}`)
      }
    } else {
      console.error(`  ❌ ${key}: unexpected type ${typeof value}`)
    }
  })
  
  // Specific critical checks
  console.log('\n🎯 CRITICAL CHECKS:')
  
  if (Array.isArray(normalized.education)) {
    if (normalized.education.length > 0) {
      console.log(`✅ education: ${normalized.education.length} entries`)
      const firstEdu = normalized.education[0]
      const hasInstitution = 'institution' in firstEdu
      const hasArea = 'area' in firstEdu
      console.log(`   - Has 'institution' key: ${hasInstitution ? '✅' : '❌'}`)
      console.log(`   - Has 'area' key: ${hasArea ? '✅' : '❌'}`)
      if (!hasInstitution || !hasArea) {
        console.log(`   - Actual keys: ${Object.keys(firstEdu).join(', ')}`)
      }
    } else {
      console.error('❌ education: EMPTY!')
    }
  } else {
    console.error(`❌ education: NOT AN ARRAY (${typeof normalized.education})`)
  }
  
  if (Array.isArray(normalized.projects)) {
    if (normalized.projects.length > 0) {
      console.log(`✅ projects: ${normalized.projects.length} entries`)
      const firstProj = normalized.projects[0]
      const hasTitle = 'title' in firstProj
      const hasDescription = 'description' in firstProj
      console.log(`   - Has 'title' key: ${hasTitle ? '✅' : '❌'}`)
      console.log(`   - Has 'description' key: ${hasDescription ? '✅' : '❌'}`)
      if (!hasTitle || !hasDescription) {
        console.log(`   - Actual keys: ${Object.keys(firstProj).join(', ')}`)
      }
    } else {
      console.error('❌ projects: EMPTY!')
    }
  } else {
    console.error(`❌ projects: NOT AN ARRAY (${typeof normalized.projects})`)
  }
  
  if (normalized.skills && typeof normalized.skills === 'object' && !Array.isArray(normalized.skills)) {
    const skillCategories = Object.keys(normalized.skills)
    if (skillCategories.length > 0) {
      console.log(`✅ skills: ${skillCategories.length} categories`)
    } else {
      console.error('❌ skills: EMPTY!')
    }
  } else {
    console.error(`❌ skills: WRONG TYPE (${typeof normalized.skills})`)
  }
}

// Run tests
console.log('Starting normalization tests for all languages...\n')

testLanguage('en', cvDataEN)
testLanguage('de', cvDataDE)
testLanguage('fa', cvDataFA)

console.log('\n' + '='.repeat(60))
console.log('TEST SUITE COMPLETE')
console.log('='.repeat(60))
console.log('\nIf you see ❌ errors above, that indicates the normalization issue.')
console.log('If you see ✅ for all sections, the bug is elsewhere (sanitization or UI).')
