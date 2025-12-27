/**
 * Language Selector: Dropdown for switching languages
 */

import { Globe } from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import type { Language } from '@/utils/dataNormalizer'

const LANGUAGES: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const currentLanguage = LANGUAGES.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          aria-label="Select language"
        >
          <Globe size={18} weight="duotone" />
          <span className="hidden sm:inline">{currentLanguage?.nativeName}</span>
          <span className="sm:hidden">{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${
              language === lang.code ? 'bg-accent' : ''
            }`}
          >
            <span className="font-medium">{lang.nativeName}</span>
            <span className="text-muted-foreground ml-2 text-sm">
              ({lang.name})
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
