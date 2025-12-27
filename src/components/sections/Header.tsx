import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { List, X } from '@phosphor-icons/react'
import { getBasics, getFullName } from '@/lib/cv-data'
import { ThemeSelector } from '@/components/ThemeSelector'
import { LanguageSelector } from '@/components/LanguageSelector'
import { FocusFilterSelector } from '@/components/FocusFilterSelector'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Publications', href: '#publications' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const basics = getBasics()
  const fullName = getFullName(basics)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <header
      className={`no-print fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="text-base sm:text-lg lg:text-xl font-bold font-heading hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-none"
          >
            {fullName || 'Portfolio'}
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-3 xl:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-2 ml-2">
              <FocusFilterSelector />
              <LanguageSelector />
              <ThemeSelector />
            </div>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <div className="hidden sm:flex items-center gap-1.5">
              <FocusFilterSelector />
              <LanguageSelector />
            </div>
            <ThemeSelector />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="h-9 w-9 sm:h-10 sm:w-10">
                  <List size={20} weight="bold" className="sm:w-6 sm:h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex sm:hidden flex-col gap-3 pb-4 border-b border-border">
                    <FocusFilterSelector />
                    <LanguageSelector />
                  </div>
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
