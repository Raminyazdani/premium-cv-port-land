/**
 * Locked Files Integrity Test
 * 
 * This test ensures that the locked data files (cv.json, cv_de.json, cv_fa.json)
 * have not been modified. Any changes to these files will cause this test to fail.
 */

import { describe, it, expect } from 'vitest'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import lockedHashes from './locked_files_hashes.json'

function computeSHA256(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath)
  const hash = crypto.createHash('sha256')
  hash.update(fileBuffer)
  return hash.digest('hex')
}

describe('Locked Files Integrity', () => {
  const projectRoot = path.resolve(__dirname, '..')
  
  it('cv.json has not been modified', () => {
    const filePath = path.join(projectRoot, 'src', 'data', 'cv.json')
    const currentHash = computeSHA256(filePath)
    const expectedHash = lockedHashes.locked_files['src/data/cv.json'].hash
    
    if (expectedHash === 'PLACEHOLDER_HASH_TO_BE_GENERATED') {
      console.warn('⚠️  Hash not yet generated for cv.json. Run: npm run generate-hashes')
      return
    }
    
    expect(currentHash).toBe(expectedHash)
  })
  
  it('cv_de.json has not been modified', () => {
    const filePath = path.join(projectRoot, 'src', 'data', 'cv_de.json')
    const currentHash = computeSHA256(filePath)
    const expectedHash = lockedHashes.locked_files['src/data/cv_de.json'].hash
    
    if (expectedHash === 'PLACEHOLDER_HASH_TO_BE_GENERATED') {
      console.warn('⚠️  Hash not yet generated for cv_de.json. Run: npm run generate-hashes')
      return
    }
    
    expect(currentHash).toBe(expectedHash)
  })
  
  it('cv_fa.json has not been modified', () => {
    const filePath = path.join(projectRoot, 'src', 'data', 'cv_fa.json')
    const currentHash = computeSHA256(filePath)
    const expectedHash = lockedHashes.locked_files['src/data/cv_fa.json'].hash
    
    if (expectedHash === 'PLACEHOLDER_HASH_TO_BE_GENERATED') {
      console.warn('⚠️  Hash not yet generated for cv_fa.json. Run: npm run generate-hashes')
      return
    }
    
    expect(currentHash).toBe(expectedHash)
  })
})
