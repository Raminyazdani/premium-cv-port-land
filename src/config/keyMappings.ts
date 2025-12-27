/**
 * Key Mappings: English (canonical) → German → Farsi
 * 
 * This file maps all JSON keys across the three language files.
 * English keys are the canonical internal schema.
 * DO NOT MODIFY - Generated from locked data files.
 */

export interface KeyMapping {
  en: string
  de: string
  fa: string
}

/**
 * Top-level section keys
 */
export const SECTION_KEYS: Record<string, KeyMapping> = {
  basics: {
    en: 'basics',
    de: 'grunddaten',
    fa: 'اطلاعات_پایه'
  },
  profiles: {
    en: 'profiles',
    de: 'profile',
    fa: 'پروفایل‌ها'
  },
  education: {
    en: 'education',
    de: 'ausbildung',
    fa: 'تحصیلات'
  },
  languages: {
    en: 'languages',
    de: 'sprachen',
    fa: 'زبان‌ها'
  },
  workshop_and_certifications: {
    en: 'workshop_and_certifications',
    de: 'schulungen_und_zertifikate',
    fa: 'کارگاه‌ها_و_گواهینامه‌ها'
  },
  skills: {
    en: 'skills',
    de: 'faehigkeiten',
    fa: 'مهارت‌ها'
  },
  experiences: {
    en: 'experiences',
    de: 'erfahrungen',
    fa: 'سوابق'
  },
  projects: {
    en: 'projects',
    de: 'projekte',
    fa: 'پروژه‌ها'
  },
  publications: {
    en: 'publications',
    de: 'veröffentlichungen',
    fa: 'انتشارات'
  },
  references: {
    en: 'references',
    de: 'referenzen',
    fa: 'مراجع'
  }
}

/**
 * Basics section field keys
 */
export const BASICS_KEYS: Record<string, KeyMapping> = {
  fname: {
    en: 'fname',
    de: 'vorname',
    fa: 'نام_کوچک'
  },
  lname: {
    en: 'lname',
    de: 'nachname',
    fa: 'نام_خانوادگی'
  },
  label: {
    en: 'label',
    de: 'bezeichnungen',
    fa: 'عناوین'
  },
  email: {
    en: 'email',
    de: 'e_mail',
    fa: 'ایمیل'
  },
  phone: {
    en: 'phone',
    de: 'telefon',
    fa: 'تلفن'
  },
  birthDate: {
    en: 'birthDate',
    de: 'geburtsdatum',
    fa: 'تاریخ_تولد'
  },
  summary: {
    en: 'summary',
    de: 'zusammenfassung',
    fa: 'خلاصه'
  },
  location: {
    en: 'location',
    de: 'standort',
    fa: 'موقعیت'
  },
  Pictures: {
    en: 'Pictures',
    de: 'bilder',
    fa: 'تصاویر'
  }
}

/**
 * Phone field keys
 */
export const PHONE_KEYS: Record<string, KeyMapping> = {
  countryCode: {
    en: 'countryCode',
    de: 'landesvorwahl',
    fa: 'کد_کشور'
  },
  number: {
    en: 'number',
    de: 'nummer',
    fa: 'شماره'
  },
  formatted: {
    en: 'formatted',
    de: 'formatiert',
    fa: 'قالب_بندی_شده'
  }
}

/**
 * Location field keys
 */
export const LOCATION_KEYS: Record<string, KeyMapping> = {
  address: {
    en: 'address',
    de: 'adresse',
    fa: 'نشانی'
  },
  postalCode: {
    en: 'postalCode',
    de: 'postleitzahl',
    fa: 'کد_پستی'
  },
  city: {
    en: 'city',
    de: 'stadt',
    fa: 'شهر'
  },
  region: {
    en: 'region',
    de: 'bundesland',
    fa: 'استان_یا_ایالت'
  },
  country: {
    en: 'country',
    de: 'land',
    fa: 'کشور'
  }
}

/**
 * Pictures field keys
 */
export const PICTURES_KEYS: Record<string, KeyMapping> = {
  type_of: {
    en: 'type_of',
    de: 'typ_auf',
    fa: 'نوع_مورد'
  },
  URL: {
    en: 'URL',
    de: 'url',
    fa: 'نشانی_وب'
  }
}

/**
 * Profile field keys
 */
export const PROFILE_KEYS: Record<string, KeyMapping> = {
  network: {
    en: 'network',
    de: 'netzwerk',
    fa: 'شبکه'
  },
  username: {
    en: 'username',
    de: 'benutzername',
    fa: 'نام_کاربری'
  },
  url: {
    en: 'url',
    de: 'link',
    fa: 'پیوند'
  },
  uuid: {
    en: 'uuid',
    de: 'uuid',
    fa: 'uuid'
  }
}

/**
 * Education field keys
 */
export const EDUCATION_KEYS: Record<string, KeyMapping> = {
  institution: {
    en: 'institution',
    de: 'institution',
    fa: 'مؤسسه'
  },
  location: {
    en: 'location',
    de: 'standort',
    fa: 'موقعیت'
  },
  area: {
    en: 'area',
    de: 'fachgebiet',
    fa: 'رشته'
  },
  studyType: {
    en: 'studyType',
    de: 'abschlussart',
    fa: 'مقطع'
  },
  startDate: {
    en: 'startDate',
    de: 'startdatum',
    fa: 'تاریخ_شروع'
  },
  endDate: {
    en: 'endDate',
    de: 'enddatum',
    fa: 'تاریخ_پایان'
  },
  gpa: {
    en: 'gpa',
    de: 'note',
    fa: 'معدل'
  },
  logo_url: {
    en: 'logo_url',
    de: 'logo_url',
    fa: 'آدرس_لوگو'
  },
  type_key: {
    en: 'type_key',
    de: 'typ_schluessel',
    fa: 'کلید_نوع'
  }
}

/**
 * Language field keys
 */
export const LANGUAGE_KEYS: Record<string, KeyMapping> = {
  language: {
    en: 'language',
    de: 'sprache',
    fa: 'زبان'
  },
  proficiency: {
    en: 'proficiency',
    de: 'kenntnisstand',
    fa: 'مهارت'
  },
  certifications: {
    en: 'certifications',
    de: 'zertifizierungen',
    fa: 'گواهینامه‌ها'
  }
}

/**
 * Proficiency field keys
 */
export const PROFICIENCY_KEYS: Record<string, KeyMapping> = {
  level: {
    en: 'level',
    de: 'niveau',
    fa: 'سطح'
  },
  CEFR: {
    en: 'CEFR',
    de: 'CEFR',
    fa: 'CEFR'
  },
  status: {
    en: 'status',
    de: 'status',
    fa: 'وضعیت'
  }
}

/**
 * Certification field keys (for languages and workshops)
 */
export const CERTIFICATION_KEYS: Record<string, KeyMapping> = {
  test: {
    en: 'test',
    de: 'test',
    fa: 'آزمون'
  },
  organization: {
    en: 'organization',
    de: 'organisation',
    fa: 'سازمان'
  },
  overall: {
    en: 'overall',
    de: 'gesamt',
    fa: 'کلی'
  },
  reading: {
    en: 'reading',
    de: 'lesen',
    fa: 'خواندن'
  },
  writing: {
    en: 'writing',
    de: 'schreiben',
    fa: 'نوشتن'
  },
  listening: {
    en: 'listening',
    de: 'hören',
    fa: 'شنیدن'
  },
  speaking: {
    en: 'speaking',
    de: 'sprechen',
    fa: 'صحبت_کردن'
  },
  maxScore: {
    en: 'maxScore',
    de: 'maximalpunktzahl',
    fa: 'حداکثر_امتیاز'
  },
  minScore: {
    en: 'minScore',
    de: 'minimalpunktzahl',
    fa: 'حداقل_امتیاز'
  },
  examDate: {
    en: 'examDate',
    de: 'prüfungsdatum',
    fa: 'تاریخ_آزمون'
  },
  URL: {
    en: 'URL',
    de: 'URL',
    fa: 'نشانی_وب'
  }
}

/**
 * Workshop/Certification issuer keys
 */
export const WORKSHOP_ISSUER_KEYS: Record<string, KeyMapping> = {
  issuer: {
    en: 'issuer',
    de: 'anbieter',
    fa: 'برگزارکننده'
  },
  certifications: {
    en: 'certifications',
    de: 'zertifikate',
    fa: 'گواهی‌ها'
  }
}

/**
 * Workshop certification item keys
 */
export const WORKSHOP_CERT_KEYS: Record<string, KeyMapping> = {
  name: {
    en: 'name',
    de: 'name',
    fa: 'نام'
  },
  date: {
    en: 'date',
    de: 'datum',
    fa: 'تاریخ'
  },
  duration: {
    en: 'duration',
    de: 'dauer',
    fa: 'مدت'
  },
  certificate: {
    en: 'certificate',
    de: 'zertifikat',
    fa: 'گواهی_دارد'
  },
  URL: {
    en: 'URL',
    de: 'url',
    fa: 'نشانی_وب'
  },
  type_key: {
    en: 'type_key',
    de: 'typ_schluessel',
    fa: 'کلید_نوع'
  }
}

/**
 * Skill item keys
 */
export const SKILL_KEYS: Record<string, KeyMapping> = {
  long_name: {
    en: 'long_name',
    de: 'voller_name',
    fa: 'نام_کامل'
  },
  short_name: {
    en: 'short_name',
    de: 'kurzer_name',
    fa: 'نام_کوتاه'
  },
  type_key: {
    en: 'type_key',
    de: 'typ_schluessel',
    fa: 'کلید_نوع'
  }
}

/**
 * Experience field keys
 */
export const EXPERIENCE_KEYS: Record<string, KeyMapping> = {
  role: {
    en: 'role',
    de: 'rolle',
    fa: 'نقش'
  },
  institution: {
    en: 'institution',
    de: 'institution',
    fa: 'مؤسسه'
  },
  duration: {
    en: 'duration',
    de: 'dauer',
    fa: 'مدت'
  },
  description: {
    en: 'description',
    de: 'beschreibung',
    fa: 'توضیحات'
  },
  primaryFocus: {
    en: 'primaryFocus',
    de: 'hauptfokus',
    fa: 'تمرکز_اصلی'
  },
  type_key: {
    en: 'type_key',
    de: 'typ_schluessel',
    fa: 'کلید_نوع'
  }
}

/**
 * Project field keys
 */
export const PROJECT_KEYS: Record<string, KeyMapping> = {
  title: {
    en: 'title',
    de: 'titel',
    fa: 'عنوان'
  },
  description: {
    en: 'description',
    de: 'beschreibung',
    fa: 'توضیحات'
  },
  url: {
    en: 'url',
    de: 'link',
    fa: 'پیوند'
  },
  type_key: {
    en: 'type_key',
    de: 'typ_schluessel',
    fa: 'کلید_نوع'
  }
}

/**
 * Publication field keys
 */
export const PUBLICATION_KEYS: Record<string, KeyMapping> = {
  title: {
    en: 'title',
    de: 'titel',
    fa: 'عنوان'
  },
  authors: {
    en: 'authors',
    de: 'autoren',
    fa: 'نویسندگان'
  },
  authors_structured: {
    en: 'authors_structured',
    de: 'autoren_strukturiert',
    fa: 'نویسندگان_ساخت‌یافته'
  },
  type: {
    en: 'type',
    de: 'typ',
    fa: 'نوع'
  },
  status: {
    en: 'status',
    de: 'status',
    fa: 'وضعیت'
  },
  year: {
    en: 'year',
    de: 'jahr',
    fa: 'سال'
  },
  month: {
    en: 'month',
    de: 'monat',
    fa: 'ماه'
  },
  day: {
    en: 'day',
    de: 'tag',
    fa: 'روز'
  },
  date: {
    en: 'date',
    de: 'datum',
    fa: 'تاریخ'
  },
  journal: {
    en: 'journal',
    de: 'zeitschrift',
    fa: 'مجله'
  },
  volume: {
    en: 'volume',
    de: 'band',
    fa: 'جلد'
  },
  issue: {
    en: 'issue',
    de: 'ausgabe',
    fa: 'شماره'
  },
  pages: {
    en: 'pages',
    de: 'seiten',
    fa: 'صفحات'
  },
  doi: {
    en: 'doi',
    de: 'doi',
    fa: 'doi'
  },
  url: {
    en: 'url',
    de: 'url',
    fa: 'پیوند'
  },
  publisher: {
    en: 'publisher',
    de: 'verlag',
    fa: 'ناشر'
  },
  correspondent: {
    en: 'correspondent',
    de: 'korrespondent',
    fa: 'مسئول_مکاتبه'
  },
  supervisors: {
    en: 'supervisors',
    de: 'betreuer',
    fa: 'استادان_راهنما'
  },
  institution: {
    en: 'institution',
    de: 'institution',
    fa: 'مؤسسه'
  },
  faculty: {
    en: 'faculty',
    de: 'fakultät',
    fa: 'دانشکده'
  },
  school: {
    en: 'school',
    de: 'schule',
    fa: 'مدرسه'
  },
  isbn: {
    en: 'isbn',
    de: 'isbn',
    fa: 'شابک'
  },
  degree_type: {
    en: 'degree_type',
    de: 'abschlusstyp',
    fa: 'نوع_مدرک'
  },
  submissionDate: {
    en: 'submissionDate',
    de: 'einreichungsdatum',
    fa: 'تاریخ_ارسال'
  },
  identifiers: {
    en: 'identifiers',
    de: 'kennungen',
    fa: 'شناسه‌ها'
  },
  URL: {
    en: 'URL',
    de: 'URL',
    fa: 'نشانی_وب'
  },
  type_key: {
    en: 'type_key',
    de: 'typ_schluessel',
    fa: 'کلید_نوع'
  }
}

/**
 * Reference field keys
 */
export const REFERENCE_KEYS: Record<string, KeyMapping> = {
  name: {
    en: 'name',
    de: 'name',
    fa: 'نام'
  },
  position: {
    en: 'position',
    de: 'position',
    fa: 'موقعیت'
  },
  department: {
    en: 'department',
    de: 'abteilung',
    fa: 'بخش'
  },
  institution: {
    en: 'institution',
    de: 'institution',
    fa: 'مؤسسه'
  },
  location: {
    en: 'location',
    de: 'ort',
    fa: 'موقعیت'
  },
  email: {
    en: 'email',
    de: 'e_mail',
    fa: 'ایمیل'
  },
  phone: {
    en: 'phone',
    de: 'telefon',
    fa: 'تلفن'
  },
  URL: {
    en: 'URL',
    de: 'URL',
    fa: 'نشانی_وب'
  },
  type_key: {
    en: 'type_key',
    de: 'typ_schluessel',
    fa: 'کلید_نوع'
  }
}

/**
 * Helper function to get key in target language
 */
export function getKey(
  keyMap: Record<string, KeyMapping>,
  enKey: string,
  targetLang: 'en' | 'de' | 'fa'
): string {
  const mapping = keyMap[enKey]
  if (!mapping) return enKey
  return mapping[targetLang]
}

/**
 * Helper function to get English key from any language
 */
export function getEnglishKey(
  keyMap: Record<string, KeyMapping>,
  key: string,
  sourceLang: 'en' | 'de' | 'fa'
): string {
  if (sourceLang === 'en') return key
  
  const entry = Object.entries(keyMap).find(([_, mapping]) => mapping[sourceLang] === key)
  return entry ? entry[0] : key
}
