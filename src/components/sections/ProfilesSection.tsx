import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  GithubLogo,
  LinkedinLogo,
  GraduationCap,
  IdentificationBadge,
  Globe,
  DotsThree,
  Copy,
  Check,
} from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import { copyToClipboard } from '@/lib/clipboard'
import type { Profile } from '@/types/cv'

const iconMap: Record<string, typeof GithubLogo> = {
  github: GithubLogo,
  linkedin: LinkedinLogo,
  'google scholar': GraduationCap,
  scholar: GraduationCap,
  orcid: IdentificationBadge,
  orchid: IdentificationBadge,
  default: Globe,
}

function normalizeNetwork(network?: string | null): string {
  if (!network) return 'unknown'
  const normalized = network.toLowerCase().trim()
  if (normalized === 'orchid') return 'orcid'
  return normalized
}

function getIconForNetwork(network?: string | null): typeof GithubLogo {
  const normalized = normalizeNetwork(network)
  return iconMap[normalized] ?? iconMap.default
}

function ProfileLink({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false)
  const network = profile.network ?? 'Profile'
  const normalizedNetwork = normalizeNetwork(profile.network)
  const Icon = getIconForNetwork(profile.network)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (profile.url) {
      const success = await copyToClipboard(profile.url, `${network} link`)
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  if (!profile.url) return null

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              asChild
              className="hover:scale-105 transition-transform hover:border-primary hover:bg-primary/5"
            >
              <a
                href={profile.url}
                target="_blank"
                rel="me noopener noreferrer"
                aria-label={`Visit ${network} profile`}
              >
                <Icon size={20} weight="fill" />
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
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-accent"
            aria-label={`More options for ${network}`}
          >
            <DotsThree size={18} weight="bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
            {copied ? (
              <>
                <Check size={16} className="mr-2 text-green-600" weight="bold" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Copy link
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function ProfilesSection() {
  const cvData = getCVData()
  const profiles = cvData.profiles ?? []

  if (profiles.length === 0) {
    return (
      <section className="py-8" aria-labelledby="profiles-heading">
        <div className="container max-w-6xl px-4">
          <h2 id="profiles-heading" className="text-2xl font-bold mb-4">
            Professional Profiles
          </h2>
          <p className="text-muted-foreground">No profiles available</p>
        </div>
      </section>
    )
  }

  const priorityOrder = ['linkedin', 'github', 'google scholar', 'scholar', 'orcid', 'orchid']
  
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
    <section className="py-12 bg-muted/30" aria-labelledby="profiles-heading">
      <div className="container max-w-6xl px-4">
        <h2 id="profiles-heading" className="text-3xl font-bold mb-6 text-center">
          Connect With Me
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          {sortedProfiles.map((profile, idx) => (
            <ProfileLink key={idx} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  )
}
