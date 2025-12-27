import { Button } from '@/components/ui/button'
import {
  LinkedinLogo,
  GithubLogo,
  FilePdf,
  GraduationCap,
  Link as LinkIcon,
} from '@phosphor-icons/react'
import { getBasics, getFullName, getProfiles } from '@/lib/cv-data'
import type { Profile } from '@/types/cv'

const iconMap: Record<string, typeof LinkedinLogo> = {
  linkedin: LinkedinLogo,
  github: GithubLogo,
  'google scholar': GraduationCap,
  orchid: LinkIcon,
  orcid: LinkIcon,
}

function SocialLink({ profile }: { profile: Profile }) {
  const network = profile.network?.toLowerCase() ?? ''
  const Icon = iconMap[network]
  
  if (!Icon || !profile.url) return null
  
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="hover:bg-accent hover:text-accent-foreground transition-colors h-9 sm:h-10 px-2 sm:px-3 touch-manipulation"
    >
      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${profile.network} profile`}
        className="flex items-center gap-1.5 sm:gap-2"
      >
        <Icon size={16} weight="bold" className="sm:w-[18px] sm:h-[18px]" />
        <span className="text-xs sm:text-sm">{profile.network}</span>
      </a>
    </Button>
  )
}

export function Footer() {
  const basics = getBasics()
  const profiles = getProfiles()
  const fullName = getFullName(basics)
  const currentYear = new Date().getFullYear()

  const handlePdfExport = () => {
    // TODO: Replace with backend API call for LaTeX PDF generation
    // Current implementation uses browser's native print-to-PDF functionality
    // Future enhancement: POST CV data to server-side LaTeX renderer
    // Expected API endpoint: POST /api/generate-pdf
    // Request body: { cvData: CVData, language: string, theme: string }
    // Response: PDF file download
    window.print()
  }

  return (
    <footer className="no-print bg-card border-t border-border mt-12 sm:mt-16">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center md:text-left order-2 md:order-1">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {currentYear} {fullName}. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:gap-4 order-1 md:order-2 w-full md:w-auto">
            <Button
              onClick={handlePdfExport}
              variant="default"
              size="sm"
              className="flex items-center gap-2 h-10 sm:h-9 w-full sm:w-auto min-w-[140px] touch-manipulation"
            >
              <FilePdf size={18} weight="bold" />
              <span className="text-sm sm:text-base">Export PDF</span>
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              {profiles.map((profile, index) => {
                const profileData = profile as Profile
                return (
                  <SocialLink 
                    key={profileData?.network || `profile-${index}`} 
                    profile={profileData} 
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
