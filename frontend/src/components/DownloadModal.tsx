/**
 * Download Modal Component
 * 
 * Provides options to download CV in different formats
 * with customization for included sections
 */

import { useState, useMemo, useCallback } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FilePdf, 
  FileJs, 
  FileText, 
  DownloadSimple,
  Printer,
  Check,
  Spinner
} from '@phosphor-icons/react'
import { useCVData } from '@/context/CVDataContext'
import { useTranslation, useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import type { CVData } from '@/types/cv'

interface DownloadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DownloadFormat = 'pdf' | 'json' | 'markdown'

interface SectionOption {
  key: keyof CVData
  label: string
  enabled: boolean
}

const formatIcons: Record<DownloadFormat, typeof FilePdf> = {
  pdf: FilePdf,
  json: FileJs,
  markdown: FileText,
}

export function DownloadModal({ open, onOpenChange }: DownloadModalProps) {
  const { data } = useCVData()
  const t = useTranslation()
  const { language } = useLanguage()
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('pdf')
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [includeContact, setIncludeContact] = useState(true)
  const [includeReferences, setIncludeReferences] = useState(true)

  // Section options
  const [sections, setSections] = useState<SectionOption[]>([
    { key: 'basics', label: 'About', enabled: true },
    { key: 'education', label: 'Education', enabled: true },
    { key: 'experiences', label: 'Experience', enabled: true },
    { key: 'projects', label: 'Projects', enabled: true },
    { key: 'publications', label: 'Publications', enabled: true },
    { key: 'skills', label: 'Skills', enabled: true },
    { key: 'languages', label: 'Languages', enabled: true },
    { key: 'workshop_and_certifications', label: 'Certifications', enabled: true },
  ])

  const toggleSection = useCallback((key: keyof CVData) => {
    setSections(prev => prev.map(s => 
      s.key === key ? { ...s, enabled: !s.enabled } : s
    ))
  }, [])

  const selectAll = useCallback(() => {
    setSections(prev => prev.map(s => ({ ...s, enabled: true })))
  }, [])

  const deselectAll = useCallback(() => {
    setSections(prev => prev.map(s => ({ ...s, enabled: false })))
  }, [])

  // Filter data based on selected sections
  const filteredData = useMemo(() => {
    if (!data) return null
    
    const result: Partial<CVData> = {}
    
    for (const section of sections) {
      if (section.enabled && data[section.key] !== undefined) {
        (result as Record<string, unknown>)[section.key] = data[section.key]
      }
    }
    
    // Handle contact/references separately
    if (!includeContact && result.basics) {
      const basics = Array.isArray(result.basics) ? result.basics[0] : result.basics
      if (basics) {
        const { email: _email, phone: _phone, ...rest } = basics
        void _email
        void _phone
        result.basics = [{ ...rest }]
      }
    }
    
    if (!includeReferences) {
      delete result.references
    } else if (sections.find(s => s.key === 'references')?.enabled) {
      result.references = data.references
    }
    
    return result
  }, [data, sections, includeContact, includeReferences])

  // Generate Markdown content
  const generateMarkdown = useCallback((cvData: Partial<CVData>): string => {
    const lines: string[] = []
    
    // Basics
    if (cvData.basics) {
      const basics = Array.isArray(cvData.basics) ? cvData.basics[0] : cvData.basics
      if (basics) {
        const name = [basics.fname, basics.lname].filter(Boolean).join(' ') || basics.name || 'CV'
        lines.push(`# ${name}\n`)
        
        if (basics.label) {
          const labels = Array.isArray(basics.label) ? basics.label : [basics.label]
          lines.push(`**${labels.join(' | ')}**\n`)
        }
        
        if (includeContact) {
          if (basics.email) lines.push(`📧 ${basics.email}`)
          if (basics.phone?.formatted) lines.push(`📞 ${basics.phone.formatted}`)
        }
        
        if (basics.summary) {
          lines.push(`\n## Summary\n${basics.summary}\n`)
        }
      }
    }
    
    // Education
    if (cvData.education && cvData.education.length > 0) {
      lines.push('\n## Education\n')
      for (const edu of cvData.education) {
        const degree = [edu.studyType, edu.area].filter(Boolean).join(' in ')
        lines.push(`### ${edu.institution || 'Unknown Institution'}`)
        if (degree) lines.push(`**${degree}**`)
        if (edu.startDate || edu.endDate) {
          lines.push(`*${edu.startDate || ''} - ${edu.endDate || t.education.present}*`)
        }
        if (edu.location) lines.push(`📍 ${edu.location}`)
        if (edu.gpa) lines.push(`GPA: ${edu.gpa}`)
        lines.push('')
      }
    }
    
    // Experience
    if (cvData.experiences && cvData.experiences.length > 0) {
      lines.push('\n## Experience\n')
      for (const exp of cvData.experiences) {
        lines.push(`### ${exp.role || 'Role'}`)
        lines.push(`**${exp.institution || ''}** ${exp.location ? `(${exp.location})` : ''}`)
        if (exp.duration) lines.push(`*${exp.duration}*`)
        if (exp.description) lines.push(`\n${exp.description}`)
        lines.push('')
      }
    }
    
    // Projects
    if (cvData.projects && cvData.projects.length > 0) {
      lines.push('\n## Projects\n')
      for (const proj of cvData.projects) {
        lines.push(`### ${proj.title || proj.name || 'Project'}`)
        if (proj.description) lines.push(proj.description)
        if (proj.url) lines.push(`🔗 [View Project](${proj.url})`)
        if (proj.highlights && proj.highlights.length > 0) {
          lines.push('\n**Highlights:**')
          for (const h of proj.highlights) {
            lines.push(`- ${h}`)
          }
        }
        lines.push('')
      }
    }
    
    // Skills
    if (cvData.skills && typeof cvData.skills === 'object' && !Array.isArray(cvData.skills)) {
      lines.push('\n## Skills\n')
      for (const [category, subcategories] of Object.entries(cvData.skills)) {
        lines.push(`### ${category}`)
        if (subcategories && typeof subcategories === 'object') {
          for (const [subcat, skills] of Object.entries(subcategories)) {
            if (Array.isArray(skills)) {
              const skillNames = skills.map(s => s.long_name || s.short_name).filter(Boolean)
              if (skillNames.length > 0) {
                lines.push(`**${subcat}:** ${skillNames.join(', ')}`)
              }
            }
          }
        }
        lines.push('')
      }
    }
    
    // Publications
    if (cvData.publications && cvData.publications.length > 0) {
      lines.push('\n## Publications\n')
      for (const pub of cvData.publications) {
        lines.push(`- **${pub.title || pub.name || 'Publication'}**`)
        if (pub.authors && pub.authors.length > 0) {
          lines.push(`  Authors: ${pub.authors.join(', ')}`)
        }
        if (pub.journal) lines.push(`  ${pub.journal}`)
        if (pub.year) lines.push(`  (${pub.year})`)
        if (pub.doi) lines.push(`  DOI: ${pub.doi}`)
      }
      lines.push('')
    }
    
    // Languages
    if (cvData.languages && cvData.languages.length > 0) {
      lines.push('\n## Languages\n')
      for (const lang of cvData.languages) {
        lines.push(`- **${lang.language}**: ${lang.fluency || ''}`)
      }
      lines.push('')
    }
    
    // References
    if (includeReferences && cvData.references && cvData.references.length > 0) {
      lines.push('\n## References\n')
      for (const ref of cvData.references) {
        lines.push(`### ${ref.name || 'Reference'}`)
        if (ref.position) lines.push(`**${ref.position}**`)
        if (ref.institution) lines.push(`${ref.institution}`)
        if (ref.email && ref.email.length > 0) lines.push(`📧 ${ref.email[0]}`)
        lines.push('')
      }
    }
    
    return lines.join('\n')
  }, [includeContact, includeReferences, t])

  // Download handlers
  const handleDownload = useCallback(async () => {
    if (!filteredData) return
    
    setIsDownloading(true)
    setDownloadSuccess(false)
    
    try {
      switch (selectedFormat) {
        case 'pdf':
          // Use browser print dialog
          window.print()
          break
          
        case 'json': {
          const jsonContent = JSON.stringify(filteredData, null, 2)
          const blob = new Blob([jsonContent], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `cv-${language}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          break
        }
          
        case 'markdown': {
          const mdContent = generateMarkdown(filteredData)
          const blob = new Blob([mdContent], { type: 'text/markdown' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `cv-${language}.md`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          break
        }
      }
      
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 2000)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }, [filteredData, selectedFormat, language, generateMarkdown])

  const FormatIcon = formatIcons[selectedFormat]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" closeLabel={t.a11y?.close_modal || t.actions.close}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DownloadSimple size={24} weight="bold" />
            {t.download?.title || 'Download CV'}
          </DialogTitle>
          <DialogDescription>
            {t.download?.description || 'Choose your preferred format and customize the content'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as DownloadFormat)} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FilePdf size={18} />
              PDF
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-2">
              <FileJs size={18} />
              JSON
            </TabsTrigger>
            <TabsTrigger value="markdown" className="flex items-center gap-2">
              <FileText size={18} />
              Markdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="mt-4 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Printer size={24} className="text-primary shrink-0" />
              <div>
                <h4 className="font-medium">{t.download?.pdf_browser || 'PDF (Browser Print)'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t.download?.pdf_browser_desc || 'Use browser print dialog to save as PDF'}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="json" className="mt-4 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <FileJs size={24} className="text-primary shrink-0" />
              <div>
                <h4 className="font-medium">{t.download?.json_export || 'JSON Export'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t.download?.json_export_desc || 'Raw data in JSON format'}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="mt-4 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <FileText size={24} className="text-primary shrink-0" />
              <div>
                <h4 className="font-medium">{t.download?.markdown || 'Markdown'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t.download?.markdown_desc || 'Plain text readable format'}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Section Selection */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{t.download?.sections || 'Sections to Include'}</h4>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll}>
                {t.download?.select_all || 'Select All'}
              </Button>
              <Button variant="ghost" size="sm" onClick={deselectAll}>
                {t.download?.deselect_all || 'Deselect All'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {sections.map((section) => (
              <div key={section.key} className="flex items-center gap-2">
                <Checkbox
                  id={`section-${section.key}`}
                  checked={section.enabled}
                  onCheckedChange={() => toggleSection(section.key)}
                />
                <Label 
                  htmlFor={`section-${section.key}`}
                  className="text-sm cursor-pointer"
                >
                  {section.label}
                </Label>
              </div>
            ))}
          </div>

          {/* Privacy Options */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-contact"
                checked={includeContact}
                onCheckedChange={(checked) => setIncludeContact(checked === true)}
              />
              <Label htmlFor="include-contact" className="text-sm cursor-pointer">
                {t.download?.include_contact || 'Include Contact Info'}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-references"
                checked={includeReferences}
                onCheckedChange={(checked) => setIncludeReferences(checked === true)}
              />
              <Label htmlFor="include-references" className="text-sm cursor-pointer">
                {t.download?.include_references || 'Include References'}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t.actions.close}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading || sections.every(s => !s.enabled)}
            className={cn(
              "gap-2 min-w-[140px]",
              downloadSuccess && "bg-green-600 hover:bg-green-700"
            )}
          >
            {isDownloading ? (
              <>
                <Spinner size={18} className="animate-spin" />
                {t.download?.downloading || 'Downloading...'}
              </>
            ) : downloadSuccess ? (
              <>
                <Check size={18} weight="bold" />
                {t.download?.success || 'Success!'}
              </>
            ) : (
              <>
                <FormatIcon size={18} />
                {t.download?.download || 'Download'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
