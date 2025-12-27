export interface MediaInfo {
  url: string
  type: 'image' | 'pdf'
  source: string
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
const PDF_EXTENSION = '.pdf'

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

export function isMediaUrl(url: string): boolean {
  return detectMediaType(url) !== null
}

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

export function collectAllMedia(data: any, source: string = 'unknown'): MediaInfo[] {
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
