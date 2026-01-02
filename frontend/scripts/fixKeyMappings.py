#!/usr/bin/env python3
"""
Key Mapping Fixer

This script reads the actual keys from the locked JSON files
and generates a corrected keyMappings.ts file.

Run with: python3 scripts/fixKeyMappings.py
"""

import json
import sys
from pathlib import Path

# Load the three data files
project_root = Path(__file__).parent.parent
data_dir = project_root / 'src' / 'data'

with open(data_dir / 'cv.json', 'r', encoding='utf-8') as f:
    cv_en = json.load(f)

with open(data_dir / 'cv_de.json', 'r', encoding='utf-8') as f:
    cv_de = json.load(f)

with open(data_dir / 'cv_fa.json', 'r', encoding='utf-8') as f:
    cv_fa = json.load(f)

print("🔍 Analyzing locked JSON files for key mismatches...\n")

# Section name mappings
print("=" * 80)
print("TOP-LEVEL SECTION KEYS")
print("=" * 80)

section_mappings = {}
en_sections = list(cv_en.keys())
de_sections = list(cv_de.keys())
fa_sections = list(cv_fa.keys())

if len(en_sections) != len(de_sections) or len(en_sections) != len(fa_sections):
    print(f"⚠️  WARNING: Different number of sections!")
    print(f"   EN: {len(en_sections)}, DE: {len(de_sections)}, FA: {len(fa_sections)}")

for i, en_section in enumerate(en_sections):
    de_section = de_sections[i] if i < len(de_sections) else en_section
    fa_section = fa_sections[i] if i < len(fa_sections) else en_section
    
    section_mappings[en_section] = {
        'en': en_section,
        'de': de_section,
        'fa': fa_section
    }
    
    print(f"{en_section}:")
    print(f"  EN: '{en_section}'")
    print(f"  DE: '{de_section}'")
    print(f"  FA: '{fa_section}'")

# Field mappings for each section
field_mappings = {}

def get_first_item_keys(data):
    """Get keys from first item in array, or object keys if not array"""
    if isinstance(data, list) and len(data) > 0:
        return list(data[0].keys()) if isinstance(data[0], dict) else []
    elif isinstance(data, dict):
        return list(data.keys())
    return []

print("\n" + "=" * 80)
print("FIELD-LEVEL KEYS FOR EACH SECTION")
print("=" * 80)

for en_section in en_sections:
    de_section = section_mappings[en_section]['de']
    fa_section = section_mappings[en_section]['fa']
    
    en_data = cv_en.get(en_section)
    de_data = cv_de.get(de_section)
    fa_data = cv_fa.get(fa_section)
    
    if not en_data or not de_data or not fa_data:
        print(f"\n⚠️  Skipping {en_section} - missing in one or more files")
        continue
    
    en_keys = get_first_item_keys(en_data)
    de_keys = get_first_item_keys(de_data)
    fa_keys = get_first_item_keys(fa_data)
    
    if not en_keys:
        print(f"\n⚠️  Skipping {en_section} - no keys found")
        continue
    
    print(f"\n{en_section.upper()}:")
    print(f"  EN keys ({len(en_keys)}): {en_keys}")
    print(f"  DE keys ({len(de_keys)}): {de_keys}")
    print(f"  FA keys ({len(fa_keys)}): {fa_keys}")
    
    if len(en_keys) != len(de_keys) or len(en_keys) != len(fa_keys):
        print(f"  ⚠️  WARNING: Key count mismatch!")
    
    field_mappings[en_section] = {}
    for i, en_key in enumerate(en_keys):
        de_key = de_keys[i] if i < len(de_keys) else en_key
        fa_key = fa_keys[i] if i < len(fa_keys) else en_key
        
        field_mappings[en_section][en_key] = {
            'en': en_key,
            'de': de_key,
            'fa': fa_key
        }

# Generate TypeScript code
print("\n" + "=" * 80)
print("GENERATING keyMappings.ts")
print("=" * 80)

output_lines = []
output_lines.append("/**")
output_lines.append(" * Key Mappings: English (canonical) → German → Farsi")
output_lines.append(" * ")
output_lines.append(" * This file maps all JSON keys across the three language files.")
output_lines.append(" * English keys are the canonical internal schema.")
output_lines.append(" * AUTO-GENERATED from locked data files - DO NOT MANUALLY EDIT.")
output_lines.append(" */")
output_lines.append("")
output_lines.append("export interface KeyMapping {")
output_lines.append("  en: string")
output_lines.append("  de: string")
output_lines.append("  fa: string")
output_lines.append("}")
output_lines.append("")

# Section keys
output_lines.append("/**")
output_lines.append(" * Top-level section keys")
output_lines.append(" */")
output_lines.append("export const SECTION_KEYS: Record<string, KeyMapping> = {")
for en_section, mapping in section_mappings.items():
    output_lines.append(f"  {en_section}: {{")
    output_lines.append(f"    en: '{mapping['en']}',")
    output_lines.append(f"    de: '{mapping['de']}',")
    output_lines.append(f"    fa: '{mapping['fa']}'")
    output_lines.append("  },")
output_lines[-1] = output_lines[-1].rstrip(',')  # Remove trailing comma from last item
output_lines.append("}")
output_lines.append("")

# Field keys for each section
section_name_map = {
    'basics': 'BASICS',
    'profiles': 'PROFILE',
    'education': 'EDUCATION',
    'languages': 'LANGUAGE',
    'workshop_and_certifications': 'WORKSHOP_ISSUER',  # Top level issuer
    'skills': 'SKILL',  # Individual skill item
    'experiences': 'EXPERIENCE',
    'projects': 'PROJECT',
    'publications': 'PUBLICATION',
    'references': 'REFERENCE'
}

for en_section, fields in field_mappings.items():
    if en_section in ['skills']:  # Skip skills as it has nested structure
        continue
        
    const_name = section_name_map.get(en_section, en_section.upper())
    
    output_lines.append("/**")
    output_lines.append(f" * {en_section.replace('_', ' ').title()} field keys")
    output_lines.append(" */")
    output_lines.append(f"export const {const_name}_KEYS: Record<string, KeyMapping> = {{")
    
    for en_key, mapping in fields.items():
        output_lines.append(f"  {en_key}: {{")
        output_lines.append(f"    en: '{mapping['en']}',")
        output_lines.append(f"    de: '{mapping['de']}',")
        output_lines.append(f"    fa: '{mapping['fa']}'")
        output_lines.append("  },")
    
    output_lines[-1] = output_lines[-1].rstrip(',')  # Remove trailing comma
    output_lines.append("}")
    output_lines.append("")

# Add helper functions (keep originals)
output_lines.append("/**")
output_lines.append(" * Helper function to get key in target language")
output_lines.append(" */")
output_lines.append("export function getKey(")
output_lines.append("  keyMap: Record<string, KeyMapping>,")
output_lines.append("  enKey: string,")
output_lines.append("  targetLang: 'en' | 'de' | 'fa'")
output_lines.append("): string {")
output_lines.append("  const mapping = keyMap[enKey]")
output_lines.append("  if (!mapping) return enKey")
output_lines.append("  return mapping[targetLang]")
output_lines.append("}")
output_lines.append("")
output_lines.append("/**")
output_lines.append(" * Helper function to get English key from any language")
output_lines.append(" */")
output_lines.append("export function getEnglishKey(")
output_lines.append("  keyMap: Record<string, KeyMapping>,")
output_lines.append("  key: string,")
output_lines.append("  sourceLang: 'en' | 'de' | 'fa'")
output_lines.append("): string {")
output_lines.append("  if (sourceLang === 'en') return key")
output_lines.append("  ")
output_lines.append("  const entry = Object.entries(keyMap).find(([_, mapping]) => mapping[sourceLang] === key)")
output_lines.append("  return entry ? entry[0] : key")
output_lines.append("}")

# Write to file
output_file = project_root / 'src' / 'config' / 'keyMappings.ts'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print(f"\n✅ Generated: {output_file}")
print("✅ Key mappings have been updated to match the actual locked files!")
print("\nNow you can run the app and the normalization should work correctly.")
