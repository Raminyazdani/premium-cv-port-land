/**
 * KEY EXTRACTION UTILITY
 * 
 * This script extracts the actual keys from the locked JSON files
 * to identify mismatches with keyMappings.ts
 * 
 * Run with: npx tsx scripts/extractActualKeys.ts
 */

import cvDataEN from '../src/data/cv.json'
import cvDataDE from '../src/data/cv_de.json'
import cvDataFA from '../src/data/cv_fa.json'

console.log('🔍 EXTRACTING ACTUAL KEYS FROM LOCKED FILES\n')
console.log('=' .repeat(80))

// Helper to get keys from first item in array
function getKeysFromFirstItem(arr: unknown[]): string[] {
  if (!Array.isArray(arr) || arr.length === 0) return []
  const first = arr[0]
  if (!first || typeof first !== 'object') return []
  return Object.keys(first)
}

// Compare section
function compareSection(sectionNameEN: string, sectionNameDE: string, sectionNameFA: string) {
  console.log(`\n📋 SECTION: ${sectionNameEN}`)
  console.log('-'.repeat(80))
  
  const enData = cvDataEN[sectionNameEN]
  const deData = cvDataDE[sectionNameDE]
  const faData = cvDataFA[sectionNameFA]
  
  if (!enData) {
    console.log(`❌ EN section "${sectionNameEN}" not found`)
    return
  }
  if (!deData) {
    console.log(`❌ DE section "${sectionNameDE}" not found`)
    return
  }
  if (!faData) {
    console.log(`❌ FA section "${sectionNameFA}" not found`)
    return
  }
  
  const enKeys = Array.isArray(enData) ? getKeysFromFirstItem(enData) : Object.keys(enData)
  const deKeys = Array.isArray(deData) ? getKeysFromFirstItem(deData) : Object.keys(deData)
  const faKeys = Array.isArray(faData) ? getKeysFromFirstItem(faData) : Object.keys(faData)
  
  console.log(`EN keys (${enKeys.length}): ${enKeys.join(', ')}`)
  console.log(`DE keys (${deKeys.length}): ${deKeys.join(', ')}`)
  console.log(`FA keys (${faKeys.length}): ${faKeys.join(', ')}`)
  
  // Create mapping object
  console.log('\n💡 Suggested KeyMapping:')
  console.log(`export const ${sectionNameEN.toUpperCase()}_KEYS: Record<string, KeyMapping> = {`)
  
  enKeys.forEach((enKey, index) => {
    const deKey = deKeys[index] || enKey
    const faKey = faKeys[index] || enKey
    
    console.log(`  ${enKey}: {`)
    console.log(`    en: '${enKey}',`)
    console.log(`    de: '${deKey}',`)
    console.log(`    fa: '${faKey}'`)
    console.log(`  }${index < enKeys.length - 1 ? ',' : ''}`)
  })
  
  console.log('}')
}

// Top-level sections
console.log('\n🗂️  TOP-LEVEL SECTIONS')
console.log('EN sections:', Object.keys(cvDataEN))
console.log('DE sections:', Object.keys(cvDataDE))
console.log('FA sections:', Object.keys(cvDataFA))

// Compare each section
compareSection('basics', 'grunddaten', 'اطلاعات_پایه')
compareSection('profiles', 'profile', 'پروفایل‌ها')
compareSection('education', 'ausbildung', 'تحصیلات')
compareSection('experiences', 'erfahrungen', 'تجربیات')
compareSection('projects', 'projekte', 'پروژه‌ها')
compareSection('publications', 'veröffentlichungen', 'انتشارات')
compareSection('languages', 'sprachen', 'زبان‌ها')
compareSection('skills', 'faehigkeiten', 'مهارت‌ها')
compareSection('workshop_and_certifications', 'schulungen_und_zertifikate', 'کارگاه‌ها_و_گواهینامه‌ها')
compareSection('references', 'referenzen', 'مراجع')

console.log('\n' + '='.repeat(80))
console.log('KEY EXTRACTION COMPLETE')
console.log('Copy the suggested mappings above to fix keyMappings.ts')
