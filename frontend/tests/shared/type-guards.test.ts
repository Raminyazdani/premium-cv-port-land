/**
 * Tests for Shared Type Guards
 */

import { describe, it, expect } from 'vitest'
import {
  isObject,
  isArray,
  isNonEmptyArray,
  isString,
  isNonEmptyString,
  isNumber,
  isBoolean,
  ensureArray,
  ensureStringArray,
  isNil,
  isDefined,
  getString,
  getNumber,
} from '@/shared/types/guards'

describe('isObject', () => {
  it('returns true for plain object', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ key: 'value' })).toBe(true)
  })

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('returns false for array', () => {
    expect(isObject([])).toBe(false)
  })

  it('returns false for primitives', () => {
    expect(isObject('string')).toBe(false)
    expect(isObject(42)).toBe(false)
    expect(isObject(true)).toBe(false)
  })
})

describe('isArray', () => {
  it('returns true for array', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1, 2, 3])).toBe(true)
  })

  it('returns false for object', () => {
    expect(isArray({})).toBe(false)
  })

  it('returns false for null', () => {
    expect(isArray(null)).toBe(false)
  })
})

describe('isNonEmptyArray', () => {
  it('returns true for non-empty array', () => {
    expect(isNonEmptyArray([1])).toBe(true)
  })

  it('returns false for empty array', () => {
    expect(isNonEmptyArray([])).toBe(false)
  })

  it('returns false for non-array', () => {
    expect(isNonEmptyArray({})).toBe(false)
  })
})

describe('isString', () => {
  it('returns true for string', () => {
    expect(isString('hello')).toBe(true)
    expect(isString('')).toBe(true)
  })

  it('returns false for number', () => {
    expect(isString(42)).toBe(false)
  })
})

describe('isNonEmptyString', () => {
  it('returns true for non-empty string', () => {
    expect(isNonEmptyString('hello')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(isNonEmptyString('')).toBe(false)
  })

  it('returns false for whitespace only', () => {
    expect(isNonEmptyString('   ')).toBe(false)
  })
})

describe('isNumber', () => {
  it('returns true for number', () => {
    expect(isNumber(42)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber(-1.5)).toBe(true)
  })

  it('returns false for NaN', () => {
    expect(isNumber(NaN)).toBe(false)
  })

  it('returns false for string', () => {
    expect(isNumber('42')).toBe(false)
  })
})

describe('isBoolean', () => {
  it('returns true for boolean', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
  })

  it('returns false for truthy/falsy values', () => {
    expect(isBoolean(1)).toBe(false)
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean('')).toBe(false)
  })
})

describe('ensureArray', () => {
  it('returns array as-is', () => {
    const arr = [1, 2, 3]
    expect(ensureArray(arr)).toBe(arr)
  })

  it('returns empty array for non-array', () => {
    expect(ensureArray(null)).toEqual([])
    expect(ensureArray(undefined)).toEqual([])
    expect(ensureArray('string')).toEqual([])
  })
})

describe('ensureStringArray', () => {
  it('returns string array as-is', () => {
    expect(ensureStringArray(['a', 'b'])).toEqual(['a', 'b'])
  })

  it('filters out non-strings', () => {
    expect(ensureStringArray(['a', 1, 'b', null])).toEqual(['a', 'b'])
  })

  it('returns empty array for non-array', () => {
    expect(ensureStringArray(null)).toEqual([])
  })
})

describe('isNil', () => {
  it('returns true for null', () => {
    expect(isNil(null)).toBe(true)
  })

  it('returns true for undefined', () => {
    expect(isNil(undefined)).toBe(true)
  })

  it('returns false for other values', () => {
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
    expect(isNil(false)).toBe(false)
  })
})

describe('isDefined', () => {
  it('returns false for null', () => {
    expect(isDefined(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isDefined(undefined)).toBe(false)
  })

  it('returns true for other values', () => {
    expect(isDefined(0)).toBe(true)
    expect(isDefined('')).toBe(true)
    expect(isDefined(false)).toBe(true)
  })
})

describe('getString', () => {
  it('returns string value', () => {
    expect(getString('hello')).toBe('hello')
  })

  it('converts number to string', () => {
    expect(getString(42)).toBe('42')
  })

  it('returns fallback for null', () => {
    expect(getString(null, 'default')).toBe('default')
  })

  it('returns empty string as default fallback', () => {
    expect(getString(null)).toBe('')
  })
})

describe('getNumber', () => {
  it('returns number value', () => {
    expect(getNumber(42)).toBe(42)
  })

  it('parses string to number', () => {
    expect(getNumber('42')).toBe(42)
    expect(getNumber('3.14')).toBe(3.14)
  })

  it('returns fallback for null', () => {
    expect(getNumber(null, 0)).toBe(0)
  })

  it('returns fallback for invalid string', () => {
    expect(getNumber('not-a-number', 0)).toBe(0)
  })

  it('returns 0 as default fallback', () => {
    expect(getNumber(null)).toBe(0)
  })
})
