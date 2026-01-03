/**
 * Shared domain utilities for CV sections.
 * Provides canonical domain parsing, normalization, and filtering helpers.
 * 
 * This module consolidates domain-related logic that was previously duplicated
 * across ProjectsSection, SkillsSection, and other components.
 */

import { getDomainLabel, normalizeDomainKey } from '@/i18n'
import type { Language } from '@/utils/dataNormalizer'

// Re-export Language type for convenience
export type { Language } from '@/utils/dataNormalizer'

/**
 * All recognized canonical domain keys.
 */
export const DOMAIN_KEYS = [
  'programming',
  'bioinformatics',
  'biotechnology',
  'academic',
  'industry',
  'robotics',
  'embedded_systems',
  'student_projects',
] as const

export type DomainKey = typeof DOMAIN_KEYS[number]

/**
 * Maps a type_key value to a translated domain label.
 * Returns null if the key is not a recognized domain.
 * 
 * @param key - Raw type_key value from CV data
 * @param language - Current language for translation
 * @returns Translated domain label or null if not recognized
 * 
 * @example
 * ```ts
 * mapTypeKeyToDomainLabel('programming', 'de') // 'Programmierung'
 * mapTypeKeyToDomainLabel('unknown', 'en') // null
 * ```
 */
export function mapTypeKeyToDomainLabel(key: string, language: Language): string | null {
  const canonicalKey = normalizeDomainKey(key)
  if (!canonicalKey) return null
  return getDomainLabel(canonicalKey, language)
}

/**
 * Extracts unique domain labels from an array of type_key values.
 * Filters out unrecognized keys and returns translated labels.
 * 
 * @param typeKeys - Array of type_key values
 * @param language - Current language for translation
 * @returns Array of unique translated domain labels
 * 
 * @example
 * ```ts
 * getUniqueDomainLabels(['programming', 'academic'], 'en')
 * // ['Programming', 'Academic']
 * ```
 */
export function getUniqueDomainLabels(
  typeKeys: string[] | undefined | null,
  language: Language
): string[] {
  if (!typeKeys || typeKeys.length === 0) return []
  
  const labels = new Set<string>()
  
  for (const key of typeKeys) {
    const label = mapTypeKeyToDomainLabel(key, language)
    if (label) labels.add(label)
  }
  
  return Array.from(labels)
}

/**
 * Collects all unique domain labels from a list of items with type_key.
 * Useful for building filter options from CV data.
 * 
 * @param items - Array of items with optional type_key arrays
 * @param language - Current language for translation
 * @returns Sorted array of unique domain labels
 * 
 * @example
 * ```ts
 * const projects = [{ type_key: ['programming'] }, { type_key: ['academic'] }]
 * collectAllDomainLabels(projects, 'en') // ['Academic', 'Programming']
 * ```
 */
export function collectAllDomainLabels<T extends { type_key?: string[] | null }>(
  items: T[],
  language: Language
): string[] {
  const allLabels = new Set<string>()
  
  for (const item of items) {
    const labels = getUniqueDomainLabels(item.type_key, language)
    for (const label of labels) {
      allLabels.add(label)
    }
  }
  
  return Array.from(allLabels).sort()
}

/**
 * Filters items by selected domain labels.
 * Returns all items if no domains are selected.
 * 
 * @param items - Array of items with optional type_key arrays
 * @param selectedLabels - Set of domain labels to filter by
 * @param language - Current language for translation
 * @returns Filtered array of items
 */
export function filterByDomainLabels<T extends { type_key?: string[] | null }>(
  items: T[],
  selectedLabels: Set<string>,
  language: Language
): T[] {
  if (selectedLabels.size === 0) return items
  
  return items.filter(item => {
    const itemLabels = getUniqueDomainLabels(item.type_key, language)
    return itemLabels.some(label => selectedLabels.has(label))
  })
}

/**
 * Checks if an item matches any of the selected domain labels.
 * Returns true if no domains are selected (show all).
 * 
 * @param typeKeys - Array of type_key values from an item
 * @param selectedLabels - Set of domain labels to check against
 * @param language - Current language for translation
 * @returns true if item should be shown
 */
export function matchesDomainFilter(
  typeKeys: string[] | undefined | null,
  selectedLabels: Set<string>,
  language: Language
): boolean {
  if (selectedLabels.size === 0) return true
  
  const itemLabels = getUniqueDomainLabels(typeKeys, language)
  return itemLabels.some(label => selectedLabels.has(label))
}
