import { useState } from 'react'

export function useMediaModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const [currentAlt, setCurrentAlt] = useState<string>('')
  const [mediaList, setMediaList] = useState<Array<{ url: string; alt?: string }>>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const openModal = (url: string, alt?: string, list?: Array<{ url: string; alt?: string }>) => {
    setCurrentUrl(url)
    setCurrentAlt(alt || '')
    if (list && list.length > 0) {
      setMediaList(list)
      const index = list.findIndex(item => item.url === url)
      setCurrentIndex(index >= 0 ? index : 0)
    } else {
      setMediaList([{ url, alt }])
      setCurrentIndex(0)
    }
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const navigateToIndex = (index: number) => {
    if (index >= 0 && index < mediaList.length) {
      setCurrentIndex(index)
      setCurrentUrl(mediaList[index].url)
      setCurrentAlt(mediaList[index].alt || '')
    }
  }

  return {
    isOpen,
    currentUrl,
    currentAlt,
    mediaList,
    currentIndex,
    openModal,
    closeModal,
    navigateToIndex
  }
}
