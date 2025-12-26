import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  LinkedinLogo,
  GithubLogo,
  EnvelopeSimple,
  Heart,
} from '@phosphor-icons/react'
import { getBasics, getFullName, getProfiles } from '@/lib/cv-data'
import type { Profile } from '@/types/cv'

const iconMap: Record<string, typeof LinkedinLogo> = {
  linkedin: LinkedinLogo,
  github: GithubLogo,
}

function SocialLink({ profile }: { profile: Profile }) {
  const network = profile.network?.toLowerCase() ?? ''
  const Icon = iconMap[network]
  
  if (!Icon || !profile.url) return null
  
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="hover:scale-105 hover:bg-accent transition-all"
    >
      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${profile.network} profile`}
      >
        <Icon size={20} weight="fill" />
      </a>
    </Button>
  )
}

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
]

export function Footer() {
  const basics = getBasics()
  const profiles = getProfiles()
  const fullName = getFullName(basics)
  const currentYear = new Date().getFullYear()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
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
    <footer id="contact" className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading">{fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {basics?.label?.[0] || 'Professional Portfolio'}
            </p>
            {basics?.email && (
              <div className="flex items-center gap-2 text-sm">
                <EnvelopeSimple size={16} weight="fill" className="text-muted-foreground" />
                <a
                  href={`mailto:${basics.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {basics.email}
                </a>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading">Connect</h3>
            <div className="flex items-center gap-2">
              {profiles.slice(0, 2).map((profile) => (
                <SocialLink key={profile.network} profile={profile} />
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} {fullName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={16} weight="fill" className="text-red-500" /> using React & TypeScript
          </p>
        </div>
      </div>
    </footer>
  )
}
