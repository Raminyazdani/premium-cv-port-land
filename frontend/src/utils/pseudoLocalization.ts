/**
 * Pseudo-Localization Utility
 * 
 * Transforms strings to help QA identify:
 * 1. Untranslated text (strings without markers)
 * 2. Text truncation/overflow issues (expanded length)
 * 3. Missing internationalization (hardcoded strings)
 * 
 * Usage:
 * - Enable via query param: ?pseudo=true
 * - Or via env var: VITE_PSEUDO_LOC=true
 * - Only affects UI strings, not CV data
 * 
 * Example:
 * "Hello World" → "[!!! Ħëľľö Ŵöŕľð !!!]"
 */

// Character mapping for pseudo-localization
// Uses characters that look similar but are visually distinct
const PSEUDO_CHAR_MAP: Record<string, string> = {
  'a': 'ȧ', 'A': 'Ȧ',
  'b': 'ƀ', 'B': 'Ɓ',
  'c': 'ƈ', 'C': 'Ƈ',
  'd': 'ḓ', 'D': 'Ḓ',
  'e': 'ë', 'E': 'Ë',
  'f': 'ƒ', 'F': 'Ƒ',
  'g': 'ğ', 'G': 'Ğ',
  'h': 'ħ', 'H': 'Ħ',
  'i': 'ï', 'I': 'Ï',
  'j': 'ĵ', 'J': 'Ĵ',
  'k': 'ķ', 'K': 'Ķ',
  'l': 'ľ', 'L': 'Ľ',
  'm': 'ɱ', 'M': 'Ṁ',
  'n': 'ñ', 'N': 'Ñ',
  'o': 'ö', 'O': 'Ö',
  'p': 'ƥ', 'P': 'Ƥ',
  'q': 'ǫ', 'Q': 'Ǫ',
  'r': 'ŕ', 'R': 'Ŕ',
  's': 'ş', 'S': 'Ş',
  't': 'ŧ', 'T': 'Ŧ',
  'u': 'ü', 'U': 'Ü',
  'v': 'ṽ', 'V': 'Ṽ',
  'w': 'ŵ', 'W': 'Ŵ',
  'x': 'ẍ', 'X': 'Ẍ',
  'y': 'ÿ', 'Y': 'Ÿ',
  'z': 'ẑ', 'Z': 'Ẑ',
}

// Length expansion factor (simulate longer translations)
const EXPANSION_FACTOR = 0.3 // 30% longer

// Markers to clearly identify pseudo-localized text
const PREFIX = '[!!! '
const SUFFIX = ' !!!]'

/**
 * Check if pseudo-localization is enabled
 */
export function isPseudoLocEnabled(): boolean {
  // Check URL parameter first
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('pseudo') === 'true') {
      return true
    }
  }
  
  // Check environment variable
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PSEUDO_LOC === 'true') {
    return true
  }
  
  // Check for localStorage preference (for persistent testing)
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('pseudo-loc') === 'true'
    } catch {
      // localStorage not available
    }
  }
  
  return false
}

/**
 * Apply pseudo-localization transformation to a string
 * 
 * @param text - The original text to transform
 * @param options - Configuration options
 * @returns Pseudo-localized text
 */
export function pseudoLocalize(
  text: string,
  options: {
    expand?: boolean     // Add expansion characters (default: true)
    markers?: boolean    // Add prefix/suffix markers (default: true)
    transform?: boolean  // Transform characters (default: true)
  } = {}
): string {
  const { expand = true, markers = true, transform = true } = options
  
  if (!text || typeof text !== 'string') {
    return text
  }
  
  // Don't transform if it looks like a technical string
  if (text.startsWith('http') || text.startsWith('/') || text.startsWith('#')) {
    return text
  }
  
  // Don't transform placeholders like {count} or {name}
  const placeholderPattern = /\{[^}]+\}/g
  const placeholders: string[] = []
  let placeholderIndex = 0
  
  // Extract placeholders - use markers with digits only (digits aren't transformed)
  const textWithoutPlaceholders = text.replace(placeholderPattern, (match) => {
    placeholders.push(match)
    return `<<${placeholderIndex++}>>`  // Use << >> as delimiters (not in transform map)
  })
  
  let result = textWithoutPlaceholders
  
  // Transform characters
  if (transform) {
    result = result.split('').map(char => PSEUDO_CHAR_MAP[char] || char).join('')
  }
  
  // Restore placeholders - << and >> are not in the char map so they remain unchanged
  placeholders.forEach((ph, idx) => {
    result = result.replace(`<<${idx}>>`, ph)
  })
  
  // Add expansion (simulate longer translated text)
  if (expand) {
    const expansionLength = Math.ceil(text.length * EXPANSION_FACTOR)
    const expansionChars = '~'.repeat(expansionLength)
    result = result + expansionChars
  }
  
  // Add markers
  if (markers) {
    result = PREFIX + result + SUFFIX
  }
  
  return result
}

/**
 * Recursively apply pseudo-localization to a translation object
 * 
 * @param obj - The translation object to transform
 * @returns Transformed translation object
 */
export function pseudoLocalizeObject<T>(obj: T): T {
  // Handle strings directly
  if (typeof obj === 'string') {
    return pseudoLocalize(obj) as T
  }
  
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => pseudoLocalizeObject(item)) as T
  }
  
  const result: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === 'string') {
      result[key] = pseudoLocalize(value)
    } else if (typeof value === 'object' && value !== null) {
      result[key] = pseudoLocalizeObject(value)
    } else {
      result[key] = value
    }
  }
  
  return result as T
}

/**
 * Enable/disable pseudo-localization via localStorage
 */
export function setPseudoLocEnabled(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    try {
      if (enabled) {
        localStorage.setItem('pseudo-loc', 'true')
      } else {
        localStorage.removeItem('pseudo-loc')
      }
    } catch {
      // localStorage not available
    }
  }
}

/**
 * Toggle pseudo-localization on/off
 */
export function togglePseudoLoc(): boolean {
  const current = isPseudoLocEnabled()
  setPseudoLocEnabled(!current)
  return !current
}
