export function safeString(value: unknown, fallback: string = ''): string {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return fallback
}

export function safeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value
  return []
}

export function safeObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T
): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as T
  }
  return fallback
}

export function isValidDate(dateStr: unknown): boolean {
  if (!dateStr) return false
  if (typeof dateStr !== 'string' && typeof dateStr !== 'number') return false
  
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

export function formatDateSafe(
  dateStr: unknown,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' }
): string {
  if (!dateStr) return ''
  
  if (typeof dateStr === 'string' && dateStr.toLowerCase() === 'present') {
    return 'Present'
  }
  
  try {
    const date = new Date(dateStr as string | number)
    if (isNaN(date.getTime())) {
      return `${dateStr} (Invalid Date)`
    }
    return date.toLocaleDateString('en-US', options)
  } catch {
    return `${dateStr} (Invalid Date)`
  }
}

export function formatDateRangeSafe(
  startDate: unknown,
  endDate: unknown
): string {
  const start = formatDateSafe(startDate)
  
  if (!endDate || endDate === 'present') {
    return start ? `${start} – Present` : ''
  }
  
  const end = formatDateSafe(endDate)
  
  if (!start && !end) return ''
  if (!start) return end
  if (!end) return `${start} – Present`
  
  return `${start} – ${end}`
}

export function parseDateSafe(dateStr: unknown): Date | null {
  if (!dateStr) return null
  
  if (typeof dateStr === 'string' && dateStr.toLowerCase() === 'present') {
    return new Date()
  }
  
  try {
    const date = new Date(dateStr as string | number)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

export function safeUrl(url: unknown): string | null {
  if (!url) return null
  if (typeof url !== 'string') return null
  
  try {
    const urlObj = new URL(url)
    return urlObj.href
  } catch {
    if (url.startsWith('/') || url.startsWith('./')) {
      return url
    }
    return null
  }
}

export function safeTypeKey(typeKey: unknown): string[] {
  if (!typeKey) return []
  if (Array.isArray(typeKey)) {
    return typeKey.filter((key): key is string => typeof key === 'string')
  }
  return []
}

export function hasContent(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

export function isEmpty(value: unknown): boolean {
  return !hasContent(value)
}

export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '?'
  
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || typeof text !== 'string') return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function isImageUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
}

export function isPdfUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false
  return /\.pdf$/i.test(url)
}

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''
  
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}
