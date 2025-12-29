/**
 * SEO Utilities
 * 
 * Provides utilities for dynamic meta tags, structured data,
 * and SEO optimization for multilingual CV portfolio.
 */

import type { CVData, Basics, Skills } from '@/types/cv'
import type { Language } from '@/utils/dataNormalizer'
import { getUIStrings } from '@/lib/i18n'

export interface SEOConfig {
  siteUrl: string
  siteName: string
  defaultImage: string
  twitterHandle?: string
}

export interface PageMeta {
  title: string
  description: string
  keywords: string[]
  author: string
  url: string
  image: string
  type: 'website' | 'profile'
  locale: string
}

// Default configuration - can be overridden
// Note: defaultImage URL returns 404 and should be updated with a valid image URL
// or update image URLs in CV data files:
//   - frontend/src/data/cv.json (basics[0].Pictures[].URL)
//   - frontend/src/data/ramin_de.json (grunddaten[0].bilder[].url)
//   - frontend/src/data/ramin_fa.json (اطلاعات_پایه[0].تصاویر[].نشانی_وب)
const DEFAULT_CONFIG: SEOConfig = {
  siteUrl: 'https://your-domain.com',
  siteName: 'Ramin Yazdani - Portfolio',
  defaultImage: '', // Cloudinary URL removed - returns 404. Update CV data or provide valid URL
  twitterHandle: '@raminyazdani'
}

/**
 * Extract full name from basics data
 */
export function getFullName(basics: Basics | Basics[] | undefined): string {
  if (!basics) return 'Ramin Yazdani'
  
  const basic = Array.isArray(basics) ? basics[0] : basics
  if (!basic) return 'Ramin Yazdani'
  
  const fname = basic.fname || ''
  const lname = basic.lname || ''
  const name = basic.name || ''
  
  if (fname && lname) return `${fname} ${lname}`
  if (name) return name
  if (fname) return fname
  return 'Ramin Yazdani'
}

/**
 * Get job titles/labels from basics
 */
export function getJobTitles(basics: Basics | Basics[] | undefined): string[] {
  if (!basics) return ['Bioinformatician', 'Data Scientist']
  
  const basic = Array.isArray(basics) ? basics[0] : basics
  if (!basic?.label) return ['Bioinformatician', 'Data Scientist']
  
  if (Array.isArray(basic.label)) {
    return basic.label.filter(Boolean) as string[]
  }
  
  return basic.label ? [basic.label] : ['Bioinformatician', 'Data Scientist']
}

/**
 * Get summary/description from basics
 */
export function getSummary(basics: Basics | Basics[] | undefined): string {
  if (!basics) return ''
  
  const basic = Array.isArray(basics) ? basics[0] : basics
  return basic?.summary || ''
}

/**
 * Get profile image URL from basics
 */
export function getProfileImage(basics: Basics | Basics[] | undefined): string {
  if (!basics) return DEFAULT_CONFIG.defaultImage
  
  const basic = Array.isArray(basics) ? basics[0] : basics
  if (!basic) return DEFAULT_CONFIG.defaultImage
  
  // Try Pictures array first
  if (basic.Pictures && basic.Pictures.length > 0) {
    const profilePic = basic.Pictures.find(p => p.type_of === 'profile' || p.type_of === 'main')
    if (profilePic?.URL) return profilePic.URL
    if (basic.Pictures[0]?.URL) return basic.Pictures[0].URL
  }
  
  // Fallback to image field
  if (basic.image) return basic.image
  
  return DEFAULT_CONFIG.defaultImage
}

/**
 * Extract all skill keywords from skills data
 */
export function getSkillKeywords(skills: Skills | undefined): string[] {
  if (!skills || typeof skills !== 'object') return []
  
  const keywords: string[] = []
  
  Object.values(skills).forEach(category => {
    if (typeof category === 'object' && category !== null) {
      Object.values(category).forEach(skillList => {
        if (Array.isArray(skillList)) {
          skillList.forEach(skill => {
            if (skill.short_name) keywords.push(skill.short_name)
            if (skill.long_name && skill.long_name !== skill.short_name) {
              keywords.push(skill.long_name)
            }
          })
        }
      })
    }
  })
  
  // Remove duplicates and limit
  return [...new Set(keywords)].slice(0, 30)
}

/**
 * Get locale string for meta tags
 */
export function getLocale(language: Language): string {
  const locales: Record<Language, string> = {
    en: 'en_US',
    de: 'de_DE',
    fa: 'fa_IR'
  }
  return locales[language] || 'en_US'
}

/**
 * Get alternate locales for hreflang
 */
export function getAlternateLocales(_currentLang: Language): { lang: Language; locale: string; hreflang: string }[] {
  const all: Language[] = ['en', 'de', 'fa']
  
  return all.map(lang => ({
    lang,
    locale: getLocale(lang),
    hreflang: lang === 'fa' ? 'fa' : lang
  }))
}

/**
 * Build page title from SEO translations or fallback to dynamic title
 */
function buildPageTitle(
  seo: { name: string; separator: string; title: string } | undefined,
  fullName: string,
  jobTitles: string[]
): string {
  if (seo) {
    return `${seo.name}${seo.separator}${seo.title}`
  }
  return `${fullName} - ${jobTitles.slice(0, 2).join(' & ')}`
}

/**
 * Build page description from SEO translations or fallback to dynamic description
 */
function buildPageDescription(
  seo: { description: string } | undefined,
  summary: string,
  fullName: string,
  jobTitles: string[],
  skillKeywords: string[]
): string {
  if (seo?.description) {
    return seo.description
  }
  if (summary) {
    return summary.slice(0, 160)
  }
  return `CV and portfolio of ${fullName} - ${jobTitles.join(', ')} specializing in ${skillKeywords.slice(0, 5).join(', ')}.`
}

/**
 * Generate page meta data from CV data
 */
export function generatePageMeta(
  cvData: CVData,
  language: Language,
  config: Partial<SEOConfig> = {}
): PageMeta {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const basics = cvData.basics
  const uiStrings = getUIStrings(language)
  
  const fullName = getFullName(basics)
  const jobTitles = getJobTitles(basics)
  const summary = getSummary(basics)
  const image = getProfileImage(basics)
  const skillKeywords = getSkillKeywords(cvData.skills as Skills)
  
  const seo = uiStrings.seo
  const title = buildPageTitle(seo, fullName, jobTitles)
  const description = buildPageDescription(seo, summary, fullName, jobTitles, skillKeywords)
  
  // Build keywords
  const keywords = [
    ...jobTitles,
    ...skillKeywords.slice(0, 20),
    fullName,
    'CV',
    'Portfolio',
    'Resume'
  ]
  
  return {
    title,
    description,
    keywords,
    author: seo?.name || fullName,
    url: cfg.siteUrl,
    image,
    type: 'profile',
    locale: getLocale(language)
  }
}

/**
 * Generate JSON-LD structured data for Person schema
 */
export function generatePersonJsonLd(
  cvData: CVData,
  config: Partial<SEOConfig> = {}
): object {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const basics = cvData.basics
  const basicData = Array.isArray(basics) ? basics[0] : basics
  
  const fullName = getFullName(basics)
  const jobTitles = getJobTitles(basics)
  const image = getProfileImage(basics)
  
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    url: cfg.siteUrl,
    jobTitle: jobTitles[0] || 'Professional',
    description: getSummary(basics) || `${fullName} - ${jobTitles.join(', ')}`
  }
  
  // Only add image if we have a valid URL to prevent 404 errors in JSON-LD
  if (image && image.trim() !== '') {
    jsonLd.image = image
  }
  
  // Add email if available
  if (basicData?.email) {
    jsonLd.email = basicData.email
  }
  
  // Add social profiles
  if (cvData.profiles && cvData.profiles.length > 0) {
    const sameAs: string[] = []
    cvData.profiles.forEach(profile => {
      if (profile.url) {
        sameAs.push(profile.url)
      }
    })
    if (sameAs.length > 0) {
      jsonLd.sameAs = sameAs
    }
  }
  
  // Add knows about (skills)
  const skills = getSkillKeywords(cvData.skills as Skills)
  if (skills.length > 0) {
    jsonLd.knowsAbout = skills.slice(0, 20)
  }
  
  // Add alumni of (education)
  if (cvData.education && cvData.education.length > 0) {
    const alumniOf = cvData.education
      .filter(edu => edu.institution)
      .map(edu => ({
        '@type': 'EducationalOrganization',
        name: edu.institution
      }))
    if (alumniOf.length > 0) {
      jsonLd.alumniOf = alumniOf
    }
  }
  
  // Add works for (experiences)
  if (cvData.experiences && cvData.experiences.length > 0) {
    const currentWork = cvData.experiences.find(exp => 
      exp.duration?.toLowerCase().includes('present') ||
      exp.duration?.toLowerCase().includes('current') ||
      exp.endDate === 'Present' ||
      !exp.endDate
    )
    if (currentWork?.institution) {
      jsonLd.worksFor = {
        '@type': 'Organization',
        name: currentWork.institution
      }
    }
  }
  
  return jsonLd
}

/**
 * Update document head with meta tags
 * Call this function when language or data changes
 */
export function updateMetaTags(meta: PageMeta, config: Partial<SEOConfig> = {}): void {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  
  // Update title
  document.title = meta.title
  
  // Helper to update or create meta tag
  const setMeta = (name: string, content: string, property = false) => {
    const attr = property ? 'property' : 'name'
    let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute(attr, name)
      document.head.appendChild(tag)
    }
    tag.content = content
  }
  
  // Primary meta tags
  setMeta('description', meta.description)
  setMeta('keywords', meta.keywords.join(', '))
  setMeta('author', meta.author)
  
  // Helper to check if image URL is valid (not empty or whitespace)
  const hasValidImage = meta.image && meta.image.trim() !== ''
  
  // Open Graph tags
  setMeta('og:title', meta.title, true)
  setMeta('og:description', meta.description, true)
  // Only set og:image if we have a valid image URL to prevent 404 errors
  if (hasValidImage) {
    setMeta('og:image', meta.image, true)
  }
  setMeta('og:url', meta.url, true)
  setMeta('og:type', meta.type, true)
  setMeta('og:locale', meta.locale, true)
  setMeta('og:site_name', cfg.siteName, true)
  
  // Twitter tags
  setMeta('twitter:card', hasValidImage ? 'summary_large_image' : 'summary')
  setMeta('twitter:title', meta.title)
  setMeta('twitter:description', meta.description)
  // Only set twitter:image if we have a valid image URL to prevent 404 errors
  if (hasValidImage) {
    setMeta('twitter:image', meta.image)
  }
  if (cfg.twitterHandle) {
    setMeta('twitter:creator', cfg.twitterHandle)
  }
  
  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = meta.url
}

/**
 * Update hreflang tags for language alternates
 */
export function updateHreflangTags(
  currentLang: Language,
  config: Partial<SEOConfig> = {}
): void {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const alternates = getAlternateLocales(currentLang)
  
  // Remove existing hreflang tags
  document.querySelectorAll('link[hreflang]').forEach(el => el.remove())
  
  // Add new hreflang tags
  alternates.forEach(({ lang, hreflang }) => {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = hreflang
    link.href = `${cfg.siteUrl}?lang=${lang}`
    document.head.appendChild(link)
  })
  
  // Add x-default
  const defaultLink = document.createElement('link')
  defaultLink.rel = 'alternate'
  defaultLink.hreflang = 'x-default'
  defaultLink.href = cfg.siteUrl
  document.head.appendChild(defaultLink)
}

/**
 * Inject JSON-LD script into document head
 */
export function injectJsonLd(jsonLd: object): void {
  // Remove existing JSON-LD
  const existing = document.querySelector('script[type="application/ld+json"]')
  if (existing) {
    existing.remove()
  }
  
  // Create new script element
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(jsonLd)
  document.head.appendChild(script)
}

/**
 * Initialize all SEO features
 * Call this on app load and when language changes
 */
export function initializeSEO(
  cvData: CVData,
  language: Language,
  config: Partial<SEOConfig> = {}
): void {
  const meta = generatePageMeta(cvData, language, config)
  
  updateMetaTags(meta, config)
  updateHreflangTags(language, config)
  
  const jsonLd = generatePersonJsonLd(cvData, config)
  injectJsonLd(jsonLd)
}
