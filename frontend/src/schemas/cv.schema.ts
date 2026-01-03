/**
 * CV Data Schema - Zod validation schema for CV data
 * 
 * This module defines the shape of CV data using Zod for runtime validation.
 * The schema is based on the existing TypeScript types in @/types/cv.ts
 * but provides runtime validation and type inference.
 */

import { z } from 'zod'

// Picture schema
export const PictureSchema = z.object({
  type_of: z.string(),
  URL: z.string()
})

// Phone schema
export const PhoneSchema = z.object({
  countryCode: z.string().nullish(),
  number: z.string().nullish(),
  formatted: z.string().nullish()
}).passthrough()

// Location schema
export const LocationSchema = z.object({
  address: z.string().nullish(),
  postalCode: z.string().nullish(),
  city: z.string().nullish(),
  countryCode: z.string().nullish(),
  region: z.string().nullish(),
  country: z.string().nullish()
}).passthrough()

// Profile schema
export const ProfileSchema = z.object({
  network: z.string().nullish(),
  username: z.string().nullish(),
  url: z.string().nullish(),
  uuid: z.string().nullish()
}).passthrough()

// Basics schema
export const BasicsSchema = z.object({
  fname: z.string().nullish(),
  lname: z.string().nullish(),
  name: z.string().nullish(),
  label: z.union([z.string(), z.array(z.string())]).nullish(),
  image: z.string().nullish(),
  email: z.string().nullish(),
  phone: PhoneSchema.nullish(),
  url: z.string().nullish(),
  summary: z.string().nullish(),
  location: z.union([LocationSchema, z.array(LocationSchema)]).nullish(),
  profiles: z.array(ProfileSchema).nullish(),
  birthDate: z.string().nullish(),
  Pictures: z.array(PictureSchema).nullish()
}).passthrough()

// Education schema
export const EducationSchema = z.object({
  institution: z.string().nullish(),
  location: z.string().nullish(),
  url: z.string().nullish(),
  area: z.string().nullish(),
  studyType: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  gpa: z.string().nullish(),
  score: z.string().nullish(),
  logo_url: z.string().nullish(),
  courses: z.array(z.string()).nullish(),
  type_key: z.array(z.string()).nullish()
}).passthrough()

// SkillItem schema
export const SkillItemSchema = z.object({
  long_name: z.string(),
  short_name: z.string(),
  type_key: z.array(z.string())
}).passthrough()

// SkillCategory schema - nested object with string keys to SkillItem arrays
export const SkillCategorySchema = z.record(z.string(), z.array(SkillItemSchema))

// Skills schema - nested object structure
export const SkillsSchema = z.record(z.string(), SkillCategorySchema)

// Language certification schema
export const LanguageCertificationSchema = z.object({
  test: z.string().nullish(),
  organization: z.string().nullish(),
  overall: z.number().nullish(),
  reading: z.number().nullish(),
  writing: z.number().nullish(),
  listening: z.number().nullish(),
  speaking: z.number().nullish(),
  maxScore: z.number().nullish(),
  minScore: z.number().nullish(),
  examDate: z.string().nullish(),
  URL: z.string().nullish()
}).passthrough()

// Language proficiency schema
export const LanguageProficiencySchema = z.object({
  level: z.string().nullish(),
  CEFR: z.string().nullish(),
  status: z.string().nullish()
}).passthrough()

// Language schema
export const LanguageSchema = z.object({
  language: z.string().nullish(),
  fluency: z.string().nullish(),
  proficiency: LanguageProficiencySchema.nullish(),
  certifications: z.array(LanguageCertificationSchema).nullish()
}).passthrough()

// Certification schema
export const CertificationSchema = z.object({
  name: z.string().nullish(),
  date: z.string().nullish(),
  duration: z.string().nullish(),
  certificate: z.boolean().nullish(),
  URL: z.string().nullish(),
  type_key: z.array(z.string()).nullish(),
  date_parse_error: z.boolean().nullish()
}).passthrough()

// Workshop issuer schema
export const WorkshopIssuerSchema = z.object({
  issuer: z.string().nullish(),
  certifications: z.array(CertificationSchema).nullish()
}).passthrough()

// Experience schema
export const ExperienceSchema = z.object({
  role: z.string().nullish(),
  institution: z.string().nullish(),
  location: z.string().nullish(),
  duration: z.string().nullish(),
  primaryFocus: z.string().nullish(),
  description: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  type_key: z.array(z.string()).nullish()
}).passthrough()

// Project case study schema
export const ProjectCaseStudySchema = z.object({
  problem: z.string().nullish(),
  solution: z.string().nullish(),
  process: z.string().nullish(),
  results: z.string().nullish(),
  technologies: z.array(z.string()).nullish(),
  images: z.array(z.string()).nullish(),
  links: z.array(z.object({ label: z.string(), url: z.string() })).nullish(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).nullish()
}).passthrough()

// Project schema
export const ProjectSchema = z.object({
  title: z.string().nullish(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  highlights: z.array(z.string()).nullish(),
  keywords: z.array(z.string()).nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  url: z.string().nullish(),
  roles: z.array(z.string()).nullish(),
  entity: z.string().nullish(),
  type: z.string().nullish(),
  type_key: z.array(z.string()).nullish(),
  caseStudy: ProjectCaseStudySchema.nullish()
}).passthrough()

// TypeKey schema (for publications that use object format)
export const TypeKeySchema = z.object({
  name: z.string(),
  color: z.string().nullish()
})

// Publication identifiers schema
export const PublicationIdentifiersSchema = z.object({
  doi: z.string().nullish(),
  isbn: z.string().nullish(),
  issn: z.string().nullish(),
  pmid: z.string().nullish(),
  pmcid: z.string().nullish(),
  arxiv: z.string().nullish()
}).passthrough()

// Author structured schema
export const AuthorStructuredSchema = z.object({
  literal: z.string().nullish(),
  given: z.string().nullish(),
  family: z.string().nullish()
}).passthrough()

// Publication schema
export const PublicationSchema = z.object({
  title: z.string().nullish(),
  name: z.string().nullish(),
  authors: z.array(z.string()).nullish(),
  authors_structured: z.array(AuthorStructuredSchema).nullish(),
  type: z.string().nullish(),
  status: z.string().nullish(),
  year: z.number().nullish(),
  month: z.number().nullish(),
  day: z.number().nullish(),
  date: z.string().nullish(),
  journal: z.string().nullish(),
  volume: z.string().nullish(),
  issue: z.string().nullish(),
  pages: z.string().nullish(),
  article_number: z.string().nullish(),
  doi: z.string().nullish(),
  issn: z.string().nullish(),
  url: z.string().nullish(),
  URL: z.string().nullish(),
  access_date: z.string().nullish(),
  language: z.string().nullish(),
  publisher: z.string().nullish(),
  place: z.string().nullish(),
  editors: z.array(z.string()).nullish(),
  book_title: z.string().nullish(),
  chapter_pages: z.string().nullish(),
  edition: z.string().nullish(),
  conference: z.string().nullish(),
  degree_type: z.string().nullish(),
  repository_url: z.string().nullish(),
  correspondent: z.string().nullish(),
  supervisors: z.array(z.string()).nullish(),
  institution: z.string().nullish(),
  faculty: z.string().nullish(),
  school: z.string().nullish(),
  isbn: z.string().nullish(),
  submissionDate: z.string().nullish(),
  identifiers: PublicationIdentifiersSchema.nullish(),
  notes: z.string().nullish(),
  releaseDate: z.string().nullish(),
  summary: z.string().nullish(),
  type_key: z.union([z.array(z.string()), z.array(TypeKeySchema)]).nullish()
}).passthrough()

// Reference schema
export const ReferenceSchema = z.object({
  name: z.string().nullish(),
  position: z.string().nullish(),
  department: z.string().nullish(),
  institution: z.string().nullish(),
  location: z.string().nullish(),
  email: z.array(z.string()).nullish(),
  phone: z.union([z.array(PhoneSchema), z.string()]).nullish(),
  URL: z.string().nullish(),
  type_key: z.array(z.string()).nullish()
}).passthrough()

// Main CV Data schema
export const CVDataSchema = z.object({
  basics: z.union([z.array(BasicsSchema), BasicsSchema]).nullish(),
  profiles: z.array(ProfileSchema).nullish(),
  work: z.array(z.unknown()).nullish(),
  education: z.array(EducationSchema).nullish(),
  skills: z.union([SkillsSchema, z.array(z.unknown())]).nullish(),
  projects: z.array(ProjectSchema).nullish(),
  publications: z.array(PublicationSchema).nullish(),
  languages: z.array(LanguageSchema).nullish(),
  workshop_and_certifications: z.array(WorkshopIssuerSchema).nullish(),
  references: z.array(ReferenceSchema).nullish(),
  experiences: z.array(ExperienceSchema).nullish(),
  testimonials: z.array(z.unknown()).nullish(),
  articles: z.array(z.unknown()).nullish(),
  videoIntro: z.unknown().nullish()
}).passthrough()

// Type inference from schema
export type CVDataFromSchema = z.infer<typeof CVDataSchema>
export type BasicsFromSchema = z.infer<typeof BasicsSchema>
export type EducationFromSchema = z.infer<typeof EducationSchema>
export type SkillItemFromSchema = z.infer<typeof SkillItemSchema>
export type ProjectFromSchema = z.infer<typeof ProjectSchema>
export type PublicationFromSchema = z.infer<typeof PublicationSchema>
export type ExperienceFromSchema = z.infer<typeof ExperienceSchema>
export type ReferenceFromSchema = z.infer<typeof ReferenceSchema>

/**
 * Validates CV data against the schema
 * Returns the validated data with proper types, or throws on validation failure
 */
export function validateCVDataSchema(data: unknown): CVDataFromSchema {
  return CVDataSchema.parse(data)
}

/**
 * Safely validates CV data against the schema
 * Returns a result object with success status and data or error
 */
export function safeParseCVData(data: unknown): z.SafeParseReturnType<unknown, CVDataFromSchema> {
  return CVDataSchema.safeParse(data)
}

/**
 * Type guard to check if a value is a valid CV data object
 */
export function isCVData(data: unknown): data is CVDataFromSchema {
  return CVDataSchema.safeParse(data).success
}
