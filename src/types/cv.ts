export interface Picture {
  type_of: string
  URL: string
}

export interface Phone {
  countryCode?: string | null
  number?: string | null
  formatted?: string | null
}

export interface Location {
  address?: string | null
  postalCode?: string | null
  city?: string | null
  countryCode?: string | null
  region?: string | null
  country?: string | null
}

export interface Basics {
  fname?: string | null
  lname?: string | null
  name?: string | null
  label?: string | string[] | null
  image?: string | null
  email?: string | null
  phone?: Phone | null
  url?: string | null
  summary?: string | null
  location?: Location | Location[] | null
  profiles?: Profile[] | null
  birthDate?: string | null
  Pictures?: Picture[] | null
}

export interface Profile {
  network?: string | null
  username?: string | null
  url?: string | null
  uuid?: string | null
}

export interface TypeKey {
  name: string
  color?: string | null
}

export interface Education {
  institution?: string | null
  location?: string | null
  url?: string | null
  area?: string | null
  studyType?: string | null
  startDate?: string | null
  endDate?: string | null
  gpa?: string | null
  score?: string | null
  logo_url?: string | null
  courses?: string[] | null
  type_key?: string[] | null
}

export interface SkillItem {
  long_name: string
  short_name: string
  type_key: string[]
}

export interface SkillSubcategory {
  [subcategoryName: string]: SkillItem[]
}

export interface SkillCategory {
  [categoryName: string]: SkillSubcategory
}

export interface Skills {
  [topCategoryName: string]: SkillCategory
}

export interface Skill {
  name?: string | null
  level?: string | null
  keywords?: string[] | null
  type_key?: TypeKey[] | null
}

export interface Work {
  name?: string | null
  position?: string | null
  url?: string | null
  startDate?: string | null
  endDate?: string | null
  summary?: string | null
  highlights?: string[] | null
  type_key?: TypeKey[] | null
}

export interface Project {
  name?: string | null
  description?: string | null
  highlights?: string[] | null
  keywords?: string[] | null
  startDate?: string | null
  endDate?: string | null
  url?: string | null
  roles?: string[] | null
  entity?: string | null
  type?: string | null
  type_key?: TypeKey[] | null
}

export interface Publication {
  name?: string | null
  publisher?: string | null
  releaseDate?: string | null
  url?: string | null
  summary?: string | null
  type_key?: TypeKey[] | null
}

export interface LanguageProficiency {
  level?: string | null
  CEFR?: string | null
  status?: string | null
}

export interface LanguageCertification {
  test?: string | null
  organization?: string | null
  overall?: number | null
  reading?: number | null
  writing?: number | null
  listening?: number | null
  speaking?: number | null
  maxScore?: number | null
  minScore?: number | null
  examDate?: string | null
  URL?: string | null
}

export interface Language {
  language?: string | null
  fluency?: string | null
  proficiency?: LanguageProficiency | null
  certifications?: LanguageCertification[] | null
}

export interface Certification {
  name?: string | null
  date?: string | null
  duration?: string | null
  certificate?: boolean | null
  URL?: string | null
  type_key?: string[] | null
  date_parse_error?: boolean | null
}

export interface WorkshopIssuer {
  issuer?: string | null
  certifications?: Certification[] | null
}

export interface Certificate {
  name?: string | null
  date?: string | null
  issuer?: string | null
  url?: string | null
  type_key?: TypeKey[] | null
}

export interface Reference {
  name?: string | null
  reference?: string | null
  email?: string | null
  phone?: string | null
}

export interface CVData {
  basics?: Basics[] | Basics | null
  profiles?: Profile[] | null
  work?: Work[] | null
  education?: Education[] | null
  skills?: Skills | Skill[] | null
  projects?: Project[] | null
  publications?: Publication[] | null
  languages?: Language[] | null
  workshop_and_certifications?: WorkshopIssuer[] | null
  references?: Reference[] | null
  experiences?: Work[] | null
}
