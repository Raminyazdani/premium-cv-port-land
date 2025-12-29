import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCV } from '@/context/CVDataContext'
import { copyToClipboard } from '@/lib/clipboard'
import { toast } from 'sonner'
import type { Profile } from '@/types/cv'
import { useTranslation } from '@/context/LanguageContext'
import { interpolate } from '@/lib/i18n'

function normalizeNetwork(network?: string | null): string {
  if (!network) return 'unknown'
  const normalized = network.toLowerCase().trim()
  if (normalized === 'orchid') return 'orcid'
  return normalized
}

function SocialIcon({ network }: { network: string }) {
  const iconClass = "w-5 h-5 inline-block"
  
  switch (network) {
    case 'github':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    case 'google scholar':
    case 'scholar':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0L1 8v16l11-6 11 6V8L12 0zm0 2.5l8.5 6.2v10.6L12 14.2l-8.5 5.1V8.7L12 2.5zm0 4.5c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 1.5c1.4 0 2.5 1.1 2.5 2.5S13.4 13.5 12 13.5 9.5 12.4 9.5 11 10.6 8.5 12 8.5z"/>
        </svg>
      )
    case 'orcid':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 4.078-1.312 4.078-3.722 0-2.403-1.719-3.722-4.078-3.722h-2.297z"/>
        </svg>
      )
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      )
  }
}

function ProfileLink({ profile, t }: { profile: Profile; t: ReturnType<typeof useTranslation> }) {
  const network = profile.network ?? 'Profile'
  const normalizedNetwork = normalizeNetwork(profile.network)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (profile.url) {
      const success = await copyToClipboard(profile.url, `${network} link`)
      if (success) {
        toast.success(`${network} link copied to clipboard`)
      }
    }
  }

  if (!profile.url) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="default"
          asChild
          className="gap-2 hover:scale-105 transition-transform hover:border-primary hover:bg-primary/5"
        >
          <a
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={interpolate(t.a11y.visit_profile, { network })}
            onContextMenu={handleCopy}
          >
            <SocialIcon network={normalizedNetwork} />
            <span className="text-sm font-medium">{network}</span>
            {profile.username && (
              <span className="text-xs text-muted-foreground hidden sm:inline">
                @{profile.username}
              </span>
            )}
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">
          {network}
          {profile.username && (
            <span className="text-muted-foreground ml-1">
              @{profile.username}
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">{t.profiles?.right_click_to_copy}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function ProfilesSection() {
  const cvData = useCV()
  const profiles = cvData.profiles ?? []
  const t = useTranslation()

  if (profiles.length === 0) {
    return (
      <section className="py-8" aria-labelledby="profiles-heading" id="profiles">
        <div className="container max-w-6xl px-4">
          <h2 id="profiles-heading" className="text-2xl font-bold mb-4">
            {t.sections.profiles}
          </h2>
          <p className="text-muted-foreground">{t.profiles?.no_profiles}</p>
        </div>
      </section>
    )
  }

  const priorityOrder = ['linkedin', 'github', 'google scholar', 'scholar', 'orcid']
  
  const sortedProfiles = [...profiles].sort((a, b) => {
    const aNetwork = normalizeNetwork(a.network)
    const bNetwork = normalizeNetwork(b.network)
    
    const aIndex = priorityOrder.indexOf(aNetwork)
    const bIndex = priorityOrder.indexOf(bNetwork)
    
    const aPriority = aIndex === -1 ? priorityOrder.length : aIndex
    const bPriority = bIndex === -1 ? priorityOrder.length : bIndex
    
    return aPriority - bPriority
  })

  return (
    <TooltipProvider delayDuration={300}>
      <section className="py-12 bg-muted/30" aria-labelledby="profiles-heading" id="profiles">
        <div className="container max-w-6xl px-4">
          <h2 id="profiles-heading" className="text-3xl font-bold mb-6 text-center">
            {t.sections.profiles}
          </h2>
          
          <div 
            className="flex flex-wrap items-center justify-center gap-3"
            role="list"
            aria-label={t.a11y?.social_profiles}
          >
            {sortedProfiles.map((profile, idx) => (
              <div key={idx} role="listitem">
                <ProfileLink profile={profile} t={t} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
