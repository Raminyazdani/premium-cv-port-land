export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: 'auto:low' | 'auto:good' | 'auto:best' | number
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'limit' | 'scale'
}

const CLOUDINARY_BASE = 'res.cloudinary.com'

export function isCloudinaryUrl(url: string): boolean {
  return url.includes(CLOUDINARY_BASE)
}

export function optimizeCloudinaryImage(
  url: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!isCloudinaryUrl(url)) {
    return url
  }

  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit',
  } = options

  const transformations: string[] = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (crop) transformations.push(`c_${crop}`)
  
  transformations.push(`f_${format}`)
  
  if (typeof quality === 'number') {
    transformations.push(`q_${quality}`)
  } else {
    transformations.push(`q_${quality}`)
  }

  const transformString = transformations.join(',')

  return url.replace('/upload/', `/upload/${transformString}/`)
}

export function generateResponsiveSrcSet(
  url: string,
  widths: number[] = [400, 800, 1200, 1600]
): string {
  if (!isCloudinaryUrl(url)) {
    return `${url} 1x`
  }

  return widths
    .map(width => {
      const optimizedUrl = optimizeCloudinaryImage(url, { width })
      return `${optimizedUrl} ${width}w`
    })
    .join(', ')
}

export function generateSizesAttribute(
  breakpoints: Array<{ maxWidth: string; size: string }>
): string {
  const sizes = breakpoints.map(bp => `(max-width: ${bp.maxWidth}) ${bp.size}`)
  sizes.push('100vw')
  return sizes.join(', ')
}

export const COMMON_SIZES = {
  hero: generateSizesAttribute([
    { maxWidth: '640px', size: '400px' },
    { maxWidth: '1024px', size: '800px' },
  ]),
  avatar: generateSizesAttribute([
    { maxWidth: '640px', size: '100px' },
    { maxWidth: '1024px', size: '200px' },
  ]),
  thumbnail: generateSizesAttribute([
    { maxWidth: '640px', size: '150px' },
    { maxWidth: '1024px', size: '200px' },
  ]),
  fullWidth: generateSizesAttribute([
    { maxWidth: '640px', size: '100vw' },
    { maxWidth: '1024px', size: '90vw' },
  ]),
}

export const COMMON_WIDTHS = {
  avatar: [100, 200, 300, 400],
  thumbnail: [150, 200, 300, 400],
  hero: [400, 800, 1200, 1600],
  fullWidth: [640, 768, 1024, 1280, 1536, 1920],
}
