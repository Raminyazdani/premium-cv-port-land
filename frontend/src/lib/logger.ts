/**
 * Logging utility for controlled log output
 *
 * Provides log levels (error/warn/info/debug) with:
 * - Production: Only error/warn logs (critical issues)
 * - Development: All levels enabled by default
 * - Debug mode: Controlled via VITE_DEBUG_CV environment variable
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.debug('Detailed info')  // Only in dev mode with DEBUG_CV=true
 *   logger.info('General info')    // Only in dev mode
 *   logger.warn('Warning')         // Always visible
 *   logger.error('Error')          // Always visible
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LoggerConfig {
  /** Whether debug logs are enabled (set via VITE_DEBUG_CV env var) */
  debugEnabled: boolean
  /** Whether we're in development mode */
  isDev: boolean
  /** Whether we're in production mode */
  isProd: boolean
}

/**
 * Determines if the current environment is production
 */
function isProduction(): boolean {
  // In Vite, import.meta.env.PROD is true in production builds
  try {
    return import.meta.env.PROD === true
  } catch {
    // Fallback for non-Vite environments (e.g., tests)
    return process.env.NODE_ENV === 'production'
  }
}

/**
 * Determines if the current environment is development
 */
function isDevelopment(): boolean {
  try {
    return import.meta.env.DEV === true
  } catch {
    return process.env.NODE_ENV !== 'production'
  }
}

/**
 * Checks if debug logging is explicitly enabled
 * Can be enabled via VITE_DEBUG_CV=true environment variable
 */
function isDebugEnabled(): boolean {
  try {
    // Check Vite environment variable
    const debugEnv = import.meta.env.VITE_DEBUG_CV
    if (debugEnv === 'true' || debugEnv === true) {
      return true
    }
  } catch {
    // Fallback for non-Vite environments
  }

  // Check process.env for Node.js/test environments
  try {
    if (typeof process !== 'undefined' && process.env?.DEBUG_CV === 'true') {
      return true
    }
  } catch {
    // Ignore
  }

  return false
}

/**
 * Get current logger configuration
 */
function getConfig(): LoggerConfig {
  return {
    debugEnabled: isDebugEnabled(),
    isDev: isDevelopment(),
    isProd: isProduction()
  }
}

/**
 * Check if a log level should be output based on current configuration
 */
function shouldLog(level: LogLevel, config: LoggerConfig): boolean {
  switch (level) {
    case 'error':
    case 'warn':
      // Always show errors and warnings
      return true
    case 'info':
      // Show info logs in development mode only
      return config.isDev
    case 'debug':
      // Show debug logs only when explicitly enabled via VITE_DEBUG_CV
      return config.debugEnabled
    default:
      return false
  }
}

/**
 * Format log prefix with timestamp and level
 */
function formatPrefix(level: LogLevel): string {
  const levelIcons: Record<LogLevel, string> = {
    error: '❌',
    warn: '⚠️',
    info: 'ℹ️',
    debug: '🔍'
  }
  return `${levelIcons[level]} [${level.toUpperCase()}]`
}

/**
 * Logger instance with log level methods
 */
export const logger = {
  /**
   * Log an error message (always visible)
   */
  error(message: string, ...args: unknown[]): void {
    console.error(formatPrefix('error'), message, ...args)
  },

  /**
   * Log a warning message (always visible)
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(formatPrefix('warn'), message, ...args)
  },

  /**
   * Log an info message (development mode only)
   */
  info(message: string, ...args: unknown[]): void {
    const config = getConfig()
    if (shouldLog('info', config)) {
      console.log(formatPrefix('info'), message, ...args)
    }
  },

  /**
   * Log a debug message (only when VITE_DEBUG_CV=true)
   */
  debug(message: string, ...args: unknown[]): void {
    const config = getConfig()
    if (shouldLog('debug', config)) {
      console.log(formatPrefix('debug'), message, ...args)
    }
  },

  /**
   * Create a console group (development mode only, debug level)
   */
  group(label: string): void {
    const config = getConfig()
    if (shouldLog('debug', config)) {
      console.group(label)
    }
  },

  /**
   * End a console group (development mode only, debug level)
   */
  groupEnd(): void {
    const config = getConfig()
    if (shouldLog('debug', config)) {
      console.groupEnd()
    }
  },

  /**
   * Log a table (development mode only, debug level)
   */
  table(data: unknown): void {
    const config = getConfig()
    if (shouldLog('debug', config)) {
      console.table(data)
    }
  },

  /**
   * Get current logger configuration (for testing/debugging)
   */
  getConfig,

  /**
   * Check if debug logging is currently enabled
   */
  isDebugEnabled(): boolean {
    return isDebugEnabled()
  }
}

export default logger
