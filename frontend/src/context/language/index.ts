/**
 * Language Context Module
 * 
 * This module provides a modular language system split by responsibility:
 * - LanguageStateContext: Core language state and persistence
 * - DirectionContext: RTL/LTR detection and DOM updates
 * - TranslationContext: UI translations and key label translations
 * - FormatterContext: Locale-aware formatting utilities
 * 
 * All hooks are re-exported for convenience.
 */

// Configuration
export { 
  LANGUAGE_METADATA, 
  SUPPORTED_LANGUAGES, 
  STORAGE_KEY,
  getAvailableLanguages,
  getLanguageDirection,
  isLanguageRTL
} from './languageConfig'

// State context
export { 
  LanguageStateProvider, 
  useLanguageState 
} from './LanguageStateContext'

// Direction context
export { 
  DirectionProvider, 
  useDirection 
} from './DirectionContext'

// Translation hooks
export { 
  useTranslation, 
  useT, 
  useKeyLabelTranslation,
  useSkillCategoryLabel
} from './TranslationContext'

// Formatter hooks
export { 
  useFormatters 
} from './FormatterContext'

// Combined provider
export { 
  LanguageProviders 
} from './LanguageProviders'
