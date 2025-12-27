export function setVHUnit() {
  function updateVH() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  updateVH()

  let resizeTimer: NodeJS.Timeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(updateVH, 150)
  })

  window.addEventListener('orientationchange', () => {
    setTimeout(updateVH, 100)
  })
}

export function preventLayoutShift() {
  const images = document.querySelectorAll('img:not([width]):not([height])')
  
  images.forEach((img) => {
    if (img instanceof HTMLImageElement && !img.complete) {
      img.addEventListener('load', function handleLoad() {
        if (img.naturalWidth && img.naturalHeight) {
          img.setAttribute('width', img.naturalWidth.toString())
          img.setAttribute('height', img.naturalHeight.toString())
        }
        img.removeEventListener('load', handleLoad)
      })
    }
  })
}

export function preventFontLoadingShift() {
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-loaded')
    })
  }
}

export function addSkeletonLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]')
  
  lazyImages.forEach((img) => {
    if (img instanceof HTMLImageElement && !img.complete) {
      const wrapper = img.parentElement
      if (wrapper && !wrapper.classList.contains('img-skeleton')) {
        wrapper.classList.add('img-skeleton')
        
        img.addEventListener('load', function handleLoad() {
          wrapper.classList.remove('img-skeleton')
          wrapper.classList.add('img-loaded')
          img.removeEventListener('load', handleLoad)
        })
      }
    }
  })
}

export function initLayoutStability() {
  setVHUnit()
  preventLayoutShift()
  preventFontLoadingShift()
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSkeletonLoading)
  } else {
    addSkeletonLoading()
  }
}
