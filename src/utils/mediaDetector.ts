export interface MediaInfo {
  url: string
  type: 'image' | 'pdf'
  source: string
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
const PDF_EXTENSION = '.pdf'

/**
 * Detects the media type based on URL file extension.
 * @param url - The URL to analyze
 * @returns 'image', 'pdf', or null if not a recognized media type
 */
export function detectMediaType(url: string): 'image' | 'pdf' | null {
  if (!url) return null
  
  const lowerUrl = url.toLowerCase()
  
  if (lowerUrl.includes(PDF_EXTENSION) || lowerUrl.endsWith(PDF_EXTENSION)) {
    return 'pdf'
  }
  
  for (const ext of IMAGE_EXTENSIONS) {
    if (lowerUrl.includes(ext) || lowerUrl.endsWith(ext)) {
      return 'image'
    }
  }
  
  return null
}

/**
 * Checks if a URL points to a supported media file.
 * @param url - The URL to check
 * @returns true if URL is a recognized image or PDF
 */
export function isMediaUrl(url: string): boolean {
  return detectMediaType(url) !== null
}

/**
 * Extracts media URLs (images and PDFs) from text content.
 * Useful for finding embedded media links in descriptions.
 * @param text - Text content to search
 * @returns Array of MediaInfo objects found in the text
 */
export function extractMediaFromText(text: string): MediaInfo[] {
  if (!text) return []
  
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const urls = text.match(urlPattern) || []
  
  return urls
    .map(url => {
      const type = detectMediaType(url)
      if (!type) return null
      return {
        url: url.replace(/[.,;!?]$/, ''),
        type,
        source: 'text'
      }
    })
    .filter((item): item is MediaInfo => item !== null)
}

/**
 * Recursively collects all media URLs from a data structure.
 * Traverses objects, arrays, and primitives to find all image and PDF URLs.
 * @param data - The data structure to traverse (can be object, array, or primitive)
 * @param source - Tracking label for the source of the media (used internally for debugging)
 * @returns Array of all MediaInfo objects found in the data structure
 */
export function collectAllMedia(data: unknown, source: string = 'unknown'): MediaInfo[] {
  const media: MediaInfo[] = []
  
  if (!data) return media
  
  if (typeof data === 'string') {
    const type = detectMediaType(data)
    if (type) {
      media.push({ url: data, type, source })
    }
  } else if (Array.isArray(data)) {
    data.forEach((item, index) => {
      media.push(...collectAllMedia(item, `${source}[${index}]`))
    })
  } else if (typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      const newSource = source === 'unknown' ? key : `${source}.${key}`
      media.push(...collectAllMedia(value, newSource))
    })
  }
  
  return media
}
