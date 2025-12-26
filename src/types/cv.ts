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
  name?: string | null
  label?: string | null
  image?: string | null
  email?: string | null
  phone?: Phone | null
  url?: string | null
  summary?: string | null
  location?: Location | null
  profiles?: Profile[] | null
  birthDate?: string | null
  Pictures?: Picture[] | null
}

export interface Profile {
  network?: string | null
  username?: string | null
  url?: string | null
}

export interface TypeKey {
  name: string
  color?: string | null
}

export interface Education {
  institution?: string | null
  url?: string | null
  area?: string | null
  studyType?: string | null
  startDate?: string | null
  endDate?: string | null
  score?: string | null
  courses?: string[] | null
  type_key?: TypeKey[] | null
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

export interface Language {
  language?: string | null
  fluency?: string | null
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
  basics?: Basics | null
  work?: Work[] | null
  education?: Education[] | null
  skills?: Skill[] | null
  projects?: Project[] | null
  publications?: Publication[] | null
  languages?: Language[] | null
  workshop_and_certifications?: Certificate[] | null
  references?: Reference[] | null
}
