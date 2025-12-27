export const LAYOUT_CONSTANTS = {
  HEADER_SCROLL_OFFSET: 80,
  HEADER_HEIGHT_MOBILE: 56,
  HEADER_HEIGHT_DESKTOP: 80,
  SCROLL_THRESHOLD: 20,
} as const

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const

export const STORAGE_KEYS = {
  FOCUS_FILTER: 'cv-focus-filter',
  LANGUAGE: 'cv-language',
  THEME: 'cv-theme',
} as const

export const DEFAULT_VALUES = {
  FOCUS: 'Full CV',
  LANGUAGE: 'en',
  THEME: 'normal',
  UNKNOWN_NAME: 'Unknown',
  FALLBACK_INITIALS: '?',
} as const

export const TOUCH_TARGET_MIN_SIZE = 44

export const ACCESSIBILITY = {
  MIN_CONTRAST_RATIO_NORMAL: 4.5,
  MIN_CONTRAST_RATIO_LARGE: 3.0,
  TOUCH_TARGET_MIN: TOUCH_TARGET_MIN_SIZE,
} as const
