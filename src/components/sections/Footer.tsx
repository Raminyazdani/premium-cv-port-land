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
      className="hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${profile.network} profile`}
        className="flex items-center gap-2"
      >
        <Icon size={18} weight="bold" />
        <span className="text-sm">{profile.network}</span>
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
    <footer className="no-print bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {fullName}. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={handlePdfExport}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <FilePdf size={18} weight="bold" />
              <span>Export PDF</span>
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {profiles.map((profile) => (
                <SocialLink key={profile.network} profile={profile} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
