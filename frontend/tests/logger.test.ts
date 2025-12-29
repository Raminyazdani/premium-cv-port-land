import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger } from '@/lib/logger'

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleGroupSpy: ReturnType<typeof vi.spyOn>
  let consoleGroupEndSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {})
    consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleGroupSpy.mockRestore()
    consoleGroupEndSpy.mockRestore()
  })

  describe('logger.error', () => {
    it('should always log error messages', () => {
      logger.error('Test error message')
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Test error message'
      )
    })

    it('should include additional arguments', () => {
      logger.error('Test error', { detail: 'value' }, 123)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Test error',
        { detail: 'value' },
        123
      )
    })
  })

  describe('logger.warn', () => {
    it('should always log warning messages', () => {
      logger.warn('Test warning message')
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'Test warning message'
      )
    })
  })

  describe('logger.info', () => {
    it('should log info messages in development mode', () => {
      // In test environment, info logs are shown because we're in dev mode
      logger.info('Test info message')
      // In vitest, import.meta.env.DEV should be true
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'Test info message'
      )
    })
  })

  describe('logger.debug', () => {
    it('should not log debug messages when DEBUG_CV is not set', () => {
      // By default, debug logging is disabled
      logger.debug('Test debug message')
      // This should NOT log because VITE_DEBUG_CV is not set
      expect(consoleLogSpy).not.toHaveBeenCalled()
    })
  })

  describe('logger.getConfig', () => {
    it('should return configuration object', () => {
      const config = logger.getConfig()
      expect(config).toHaveProperty('debugEnabled')
      expect(config).toHaveProperty('isDev')
      expect(config).toHaveProperty('isProd')
      expect(typeof config.debugEnabled).toBe('boolean')
      expect(typeof config.isDev).toBe('boolean')
      expect(typeof config.isProd).toBe('boolean')
    })
  })

  describe('logger.isDebugEnabled', () => {
    it('should return boolean', () => {
      const result = logger.isDebugEnabled()
      expect(typeof result).toBe('boolean')
    })

    it('should return false by default (no VITE_DEBUG_CV set)', () => {
      expect(logger.isDebugEnabled()).toBe(false)
    })
  })

  describe('log level prefixes', () => {
    it('should include emoji prefix for error level', () => {
      logger.error('test')
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌'),
        'test'
      )
    })

    it('should include emoji prefix for warn level', () => {
      logger.warn('test')
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('⚠️'),
        'test'
      )
    })

    it('should include emoji prefix for info level', () => {
      logger.info('test')
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('ℹ️'),
        'test'
      )
    })
  })
})
