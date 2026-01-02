/**
 * KEY MAPPING VALIDATION TEST
 * 
 * This test verifies that all key mappings in keyMappings.ts
 * match the actual keys in the locked JSON files.
 * 
 * Run with: npx tsx scripts/validateKeyMappings.ts
 */

import { SECTION_KEYS, EDUCATION_KEYS, EXPERIENCE_KEYS, PROJECT_KEYS, 
         PUBLICATION_KEYS, REFERENCE_KEYS, WORKSHOP_ISSUER_KEYS, WORKSHOP_CERT_KEYS } from '../src/config/keyMappings'
import cvDataEN from '../src/data/cv.json'
import cvDataDE from '../src/data/cv_de.json'
import cvDataFA from '../src/data/cv_fa.json'

console.log('🧪 KEY MAPPING VALIDATION TEST\n')
console.log('=' .repeat(80))

let totalErrors = 0
let totalWarnings = 0

function validateSection(
  sectionName: string,
  mapping: { en: string; de: string; fa: string }
) {
  const enExists = sectionName in cvDataEN
  const deExists = mapping.de in cvDataDE
  const faExists = mapping.fa in cvDataFA
  
  if (!enExists) {
    console.error(`❌ EN: Section "${sectionName}" not found`)
    totalErrors++
  }
  
  if (!deExists) {
    console.error(`❌ DE: Section "${mapping.de}" not found`)
    totalErrors++
  }
  
  if (!faExists) {
    console.error(`❌ FA: Section "${mapping.fa}" not found`)
    totalErrors++
  }
  
  if (enExists && deExists && faExists) {
    console.log(`✅ Section "${sectionName}" keys validated`)
  }
}

function validateFieldKeys(
  sectionName: string,
  fieldMappings: Record<string, { en: string; de: string; fa: string }>,
  enSection: string,
  deSection: string,
  faSection: string
) {
  const enData = (cvDataEN as any)[enSection]
  const deData = (cvDataDE as any)[deSection]
  const faData = (cvDataFA as any)[faSection]
  
  if (!enData || !deData || !faData) {
    console.warn(`⚠️  Skipping ${sectionName} - section not found`)
    totalWarnings++
    return
  }
  
  // Get first item from array or use object directly
  const enFirst = Array.isArray(enData) && enData.length > 0 ? enData[0] : enData
  const deFirst = Array.isArray(deData) && deData.length > 0 ? deData[0] : deData
  const faFirst = Array.isArray(faData) && faData.length > 0 ? faData[0] : faData
  
  if (!enFirst || !deFirst || !faFirst) {
    console.warn(`⚠️  Skipping ${sectionName} - no data in section`)
    totalWarnings++
    return
  }
  
  let sectionErrors = 0
  
  Object.entries(fieldMappings).forEach(([enKey, mapping]) => {
    const enHasKey = enKey in enFirst
    const deHasKey = mapping.de in deFirst
    const faHasKey = mapping.fa in faFirst
    
    if (!enHasKey) {
      console.error(`  ❌ EN field "${enKey}" not found in ${sectionName}`)
      sectionErrors++
    }
    
    if (!deHasKey) {
      console.error(`  ❌ DE field "${mapping.de}" not found in ${sectionName}`)
      sectionErrors++
    }
    
    if (!faHasKey) {
      console.error(`  ❌ FA field "${mapping.fa}" not found in ${sectionName}`)
      sectionErrors++
    }
  })
  
  if (sectionErrors === 0) {
    console.log(`✅ ${sectionName} field keys validated (${Object.keys(fieldMappings).length} fields)`)
  } else {
    totalErrors += sectionErrors
  }
}

console.log('\n📋 VALIDATING SECTION-LEVEL KEYS...\n')

Object.entries(SECTION_KEYS).forEach(([enKey, mapping]) => {
  validateSection(enKey, mapping)
})

console.log('\n📝 VALIDATING FIELD-LEVEL KEYS...\n')

validateFieldKeys(
  'education',
  EDUCATION_KEYS,
  'education',
  'ausbildung',
  'تحصیلات'
)

validateFieldKeys(
  'experiences',
  EXPERIENCE_KEYS,
  'experiences',
  'erfahrungen',
  'سوابق'
)

validateFieldKeys(
  'projects',
  PROJECT_KEYS,
  'projects',
  'projekte',
  'پروژه‌ها'
)

validateFieldKeys(
  'publications',
  PUBLICATION_KEYS,
  'publications',
  'veröffentlichungen',
  'انتشارات'
)

validateFieldKeys(
  'references',
  REFERENCE_KEYS,
  'references',
  'referenzen',
  'مراجع'
)

// Validate workshop/certification structure
const enWorkshops = cvDataEN.workshop_and_certifications
const deWorkshops = (cvDataDE as any).schulungen_und_zertifikate
const faWorkshops = (cvDataFA as any)['کارگاه‌ها_و_گواهینامه‌ها']

if (enWorkshops && deWorkshops && faWorkshops && 
    enWorkshops.length > 0 && deWorkshops.length > 0 && faWorkshops.length > 0) {
  
  // Validate issuer keys
  const enIssuer = enWorkshops[0]
  const deIssuer = deWorkshops[0]
  const faIssuer = faWorkshops[0]
  
  Object.entries(WORKSHOP_ISSUER_KEYS).forEach(([enKey, mapping]) => {
    const enHasKey = enKey in enIssuer
    const deHasKey = mapping.de in deIssuer
    const faHasKey = mapping.fa in faIssuer
    
    if (!enHasKey || !deHasKey || !faHasKey) {
      console.error(`❌ Workshop issuer key mismatch: ${enKey} / ${mapping.de} / ${mapping.fa}`)
      totalErrors++
    }
  })
  
  console.log(`✅ workshop_issuer field keys validated`)
  
  // Validate certification item keys
  if (enIssuer.certifications?.length > 0 && 
      deIssuer.zertifikate?.length > 0 &&
      faIssuer['گواهی‌ها']?.length > 0) {
    
    const enCert = enIssuer.certifications[0]
    const deCert = deIssuer.zertifikate[0]
    const faCert = faIssuer['گواهی‌ها'][0]
    
    Object.entries(WORKSHOP_CERT_KEYS).forEach(([enKey, mapping]) => {
      const enHasKey = enKey in enCert
      const deHasKey = mapping.de in deCert
      const faHasKey = mapping.fa in faCert
      
      if (!enHasKey || !deHasKey || !faHasKey) {
        console.error(`❌ Workshop cert key mismatch: ${enKey} / ${mapping.de} / ${mapping.fa}`)
        totalErrors++
      }
    })
    
    console.log(`✅ workshop_cert field keys validated`)
  }
}

console.log('\n' + '='.repeat(80))
console.log('VALIDATION COMPLETE')
console.log('='.repeat(80))

if (totalErrors === 0 && totalWarnings === 0) {
  console.log('\n✅ ALL KEY MAPPINGS ARE CORRECT!')
  console.log('✅ The normalization should now work for all languages.')
  process.exit(0)
} else {
  console.log(`\n⚠️  Total errors: ${totalErrors}`)
  console.log(`⚠️  Total warnings: ${totalWarnings}`)
  console.log('\nPlease fix the key mappings before running the app.')
  process.exit(1)
}
