import { toast } from 'sonner'

export async function copyToClipboard(text: string, label: string = 'Text'): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
      return true
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      textArea.remove()
      
      if (successful) {
        toast.success(`${label} copied to clipboard`)
        return true
      } else {
        throw new Error('Copy command failed')
      }
    }
  } catch (error) {
    console.error('Failed to copy:', error)
    toast.error(`Failed to copy ${label.toLowerCase()}`)
    return false
  }
}
