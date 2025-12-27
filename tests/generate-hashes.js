#!/usr/bin/env node
/**
 * Generate SHA256 hashes for locked data files
 * 
 * Usage: node tests/generate-hashes.js
 */

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function computeSHA256(filePath) {
  const fileBuffer = fs.readFileSync(filePath)
  const hash = crypto.createHash('sha256')
  hash.update(fileBuffer)
  return hash.digest('hex')
}

const projectRoot = path.resolve(__dirname, '..')
const hashesFilePath = path.join(__dirname, 'locked_files_hashes.json')

const files = {
  'src/data/cv.json': {
    description: 'English CV data - locked up to and including \'projects\' section',
    hash: ''
  },
  'src/data/ramin_de.json': {
    description: 'German CV data - locked up to and including \'projects\' section',
    hash: ''
  },
  'src/data/ramin_fa.json': {
    description: 'Persian CV data - locked up to and including \'projects\' section',
    hash: ''
  }
}

console.log('🔒 Generating hashes for locked data files...\n')

for (const [relativePath, fileInfo] of Object.entries(files)) {
  const fullPath = path.join(projectRoot, relativePath)
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${relativePath}`)
    process.exit(1)
  }
  
  const hash = computeSHA256(fullPath)
  files[relativePath].hash = hash
  
  console.log(`✅ ${relativePath}`)
  console.log(`   ${hash}\n`)
}

const output = {
  description: 'SHA256 hashes of locked data files. DO NOT MODIFY. Changes to these files will cause tests to fail.',
  locked_files: files,
  instructions: 'To regenerate hashes after intentional file changes, run: npm run generate-hashes',
  generated_at: new Date().toISOString()
}

fs.writeFileSync(hashesFilePath, JSON.stringify(output, null, 2))

console.log(`✅ Hashes written to: ${path.relative(projectRoot, hashesFilePath)}`)
console.log('\n⚠️  IMPORTANT: Commit this file to version control.')
console.log('Tests will now fail if any locked data files are modified.')

