/**
 * i18n: UI Text Translations
 * 
 * This module contains all UI-facing text (not CV content) in EN/DE/FA
 */

import type { Language } from '@/utils/dataNormalizer'

export interface UIStrings {
  // Navigation
  nav: {
    home: string
    about: string
    education: string
    experience: string
    projects: string
    publications: string
    skills: string
    languages: string
    certifications: string
    references: string
    contact: string
  }

  // Section Headings
  sections: {
    hero: string
    basics: string
    profiles: string
    education: string
    languages: string
    certifications: string
    skills: string
    experiences: string
    projects: string
    publications: string
    references: string
    contact: string
  }

  // Common Actions
  actions: {
    download_cv: string
    view_more: string
    view_less: string
    contact_me: string
    send_message: string
    book_call: string
    copy: string
    copied: string
    close: string
    expand: string
    collapse: string
    filter: string
    search: string
    clear: string
  }

  // Forms
  forms: {
    name: string
    email: string
    subject: string
    message: string
    send: string
    sending: string
    sent: string
    error: string
  }

  // Education
  education: {
    institution: string
    degree: string
    field: string
    location: string
    duration: string
    gpa: string
    present: string
  }

  // Experience
  experience: {
    role: string
    institution: string
    duration: string
    present: string
    responsibilities: string
  }

  // Projects
  projects: {
    view_project: string
    view_code: string
    demo: string
    no_projects: string
  }

  // Publications
  publications: {
    type: string
    status: string
    published: string
    submitted: string
    in_review: string
    waiting: string
    authors: string
    journal: string
    year: string
    doi: string
    isbn: string
  }

  // Skills
  skills: {
    proficiency: string
    years: string
    category: string
    all_skills: string
  }

  // Languages
  languages_section: {
    language: string
    proficiency: string
    native: string
    fluent: string
    professional: string
    intermediate: string
    beginner: string
    studying: string
    certification: string
  }

  // References
  references: {
    available_on_request: string
    position: string
    department: string
    institution: string
    email: string
    phone: string
    reference_letter: string
  }

  // Footer
  footer: {
    copyright: string
    made_with: string
    built_with: string
  }

  // Filters
  filters: {
    all: string
    programming: string
    bioinformatics: string
    biotechnology: string
    academic: string
    focus: string
  }

  // Empty States
  empty: {
    no_data: string
    no_results: string
    no_education: string
    no_experience: string
    no_projects: string
    no_publications: string
    no_skills: string
    no_languages: string
    no_certifications: string
    no_references: string
  }

  // Accessibility
  a11y: {
    skip_to_content: string
    menu: string
    close_menu: string
    select_language: string
    select_theme: string
    select_focus: string
    open_modal: string
    close_modal: string
  }
}

const translations: Record<Language, UIStrings> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      education: 'Education',
      experience: 'Experience',
      projects: 'Projects',
      publications: 'Publications',
      skills: 'Skills',
      languages: 'Languages',
      certifications: 'Certifications',
      references: 'References',
      contact: 'Contact'
    },
    sections: {
      hero: 'Welcome',
      basics: 'About Me',
      profiles: 'Connect With Me',
      education: 'Education',
      languages: 'Languages',
      certifications: 'Workshops & Certifications',
      skills: 'Skills & Expertise',
      experiences: 'Professional Experience',
      projects: 'Projects & Portfolio',
      publications: 'Publications & Research',
      references: 'References',
      contact: 'Get In Touch'
    },
    actions: {
      download_cv: 'Download CV',
      view_more: 'View More',
      view_less: 'View Less',
      contact_me: 'Contact Me',
      send_message: 'Send Message',
      book_call: 'Book a Call',
      copy: 'Copy',
      copied: 'Copied!',
      close: 'Close',
      expand: 'Expand',
      collapse: 'Collapse',
      filter: 'Filter',
      search: 'Search',
      clear: 'Clear'
    },
    forms: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      sent: 'Message sent!',
      error: 'An error occurred'
    },
    education: {
      institution: 'Institution',
      degree: 'Degree',
      field: 'Field of Study',
      location: 'Location',
      duration: 'Duration',
      gpa: 'GPA',
      present: 'Present'
    },
    experience: {
      role: 'Role',
      institution: 'Organization',
      duration: 'Duration',
      present: 'Present',
      responsibilities: 'Responsibilities'
    },
    projects: {
      view_project: 'View Project',
      view_code: 'View Code',
      demo: 'Live Demo',
      no_projects: 'No projects found'
    },
    publications: {
      type: 'Type',
      status: 'Status',
      published: 'Published',
      submitted: 'Submitted',
      in_review: 'In Review',
      waiting: 'Waiting for Submission',
      authors: 'Authors',
      journal: 'Journal',
      year: 'Year',
      doi: 'DOI',
      isbn: 'ISBN'
    },
    skills: {
      proficiency: 'Proficiency',
      years: 'Years of Experience',
      category: 'Category',
      all_skills: 'All Skills'
    },
    languages_section: {
      language: 'Language',
      proficiency: 'Proficiency',
      native: 'Native',
      fluent: 'Fluent',
      professional: 'Professional',
      intermediate: 'Intermediate',
      beginner: 'Beginner',
      studying: 'Studying',
      certification: 'Certification'
    },
    references: {
      available_on_request: 'References available upon request',
      position: 'Position',
      department: 'Department',
      institution: 'Institution',
      email: 'Email',
      phone: 'Phone',
      reference_letter: 'Reference Letter'
    },
    footer: {
      copyright: '© {year} {name}. All rights reserved.',
      made_with: 'Made with',
      built_with: 'Built with React & TypeScript'
    },
    filters: {
      all: 'All',
      programming: 'Programming',
      bioinformatics: 'Bioinformatics',
      biotechnology: 'Biotechnology',
      academic: 'Academic',
      focus: 'Focus'
    },
    empty: {
      no_data: 'No data available',
      no_results: 'No results found',
      no_education: 'No education entries',
      no_experience: 'No experience entries',
      no_projects: 'No projects',
      no_publications: 'No publications',
      no_skills: 'No skills listed',
      no_languages: 'No languages listed',
      no_certifications: 'No certifications',
      no_references: 'No references'
    },
    a11y: {
      skip_to_content: 'Skip to main content',
      menu: 'Menu',
      close_menu: 'Close menu',
      select_language: 'Select language',
      select_theme: 'Select theme',
      select_focus: 'Select focus',
      open_modal: 'Open modal',
      close_modal: 'Close modal'
    }
  },

  de: {
    nav: {
      home: 'Startseite',
      about: 'Über mich',
      education: 'Ausbildung',
      experience: 'Erfahrung',
      projects: 'Projekte',
      publications: 'Veröffentlichungen',
      skills: 'Fähigkeiten',
      languages: 'Sprachen',
      certifications: 'Zertifizierungen',
      references: 'Referenzen',
      contact: 'Kontakt'
    },
    sections: {
      hero: 'Willkommen',
      basics: 'Über mich',
      profiles: 'Vernetzen Sie sich mit mir',
      education: 'Ausbildung',
      languages: 'Sprachen',
      certifications: 'Workshops & Zertifizierungen',
      skills: 'Fähigkeiten & Expertise',
      experiences: 'Berufserfahrung',
      projects: 'Projekte & Portfolio',
      publications: 'Veröffentlichungen & Forschung',
      references: 'Referenzen',
      contact: 'Kontakt aufnehmen'
    },
    actions: {
      download_cv: 'Lebenslauf herunterladen',
      view_more: 'Mehr anzeigen',
      view_less: 'Weniger anzeigen',
      contact_me: 'Kontaktieren Sie mich',
      send_message: 'Nachricht senden',
      book_call: 'Anruf buchen',
      copy: 'Kopieren',
      copied: 'Kopiert!',
      close: 'Schließen',
      expand: 'Erweitern',
      collapse: 'Einklappen',
      filter: 'Filtern',
      search: 'Suchen',
      clear: 'Löschen'
    },
    forms: {
      name: 'Name',
      email: 'E-Mail',
      subject: 'Betreff',
      message: 'Nachricht',
      send: 'Senden',
      sending: 'Wird gesendet...',
      sent: 'Nachricht gesendet!',
      error: 'Ein Fehler ist aufgetreten'
    },
    education: {
      institution: 'Institution',
      degree: 'Abschluss',
      field: 'Studienrichtung',
      location: 'Ort',
      duration: 'Dauer',
      gpa: 'Notendurchschnitt',
      present: 'Gegenwart'
    },
    experience: {
      role: 'Rolle',
      institution: 'Organisation',
      duration: 'Dauer',
      present: 'Gegenwart',
      responsibilities: 'Verantwortlichkeiten'
    },
    projects: {
      view_project: 'Projekt ansehen',
      view_code: 'Code ansehen',
      demo: 'Live-Demo',
      no_projects: 'Keine Projekte gefunden'
    },
    publications: {
      type: 'Typ',
      status: 'Status',
      published: 'Veröffentlicht',
      submitted: 'Eingereicht',
      in_review: 'In Überprüfung',
      waiting: 'Wartet auf Einreichung',
      authors: 'Autoren',
      journal: 'Zeitschrift',
      year: 'Jahr',
      doi: 'DOI',
      isbn: 'ISBN'
    },
    skills: {
      proficiency: 'Kenntnisstand',
      years: 'Jahre Erfahrung',
      category: 'Kategorie',
      all_skills: 'Alle Fähigkeiten'
    },
    languages_section: {
      language: 'Sprache',
      proficiency: 'Kenntnisstand',
      native: 'Muttersprache',
      fluent: 'Fließend',
      professional: 'Beruflich',
      intermediate: 'Mittel',
      beginner: 'Anfänger',
      studying: 'In Ausbildung',
      certification: 'Zertifizierung'
    },
    references: {
      available_on_request: 'Referenzen auf Anfrage verfügbar',
      position: 'Position',
      department: 'Abteilung',
      institution: 'Institution',
      email: 'E-Mail',
      phone: 'Telefon',
      reference_letter: 'Referenzschreiben'
    },
    footer: {
      copyright: '© {year} {name}. Alle Rechte vorbehalten.',
      made_with: 'Erstellt mit',
      built_with: 'Erstellt mit React & TypeScript'
    },
    filters: {
      all: 'Alle',
      programming: 'Programmierung',
      bioinformatics: 'Bioinformatik',
      biotechnology: 'Biotechnologie',
      academic: 'Akademisch',
      focus: 'Fokus'
    },
    empty: {
      no_data: 'Keine Daten verfügbar',
      no_results: 'Keine Ergebnisse gefunden',
      no_education: 'Keine Ausbildungseinträge',
      no_experience: 'Keine Erfahrungseinträge',
      no_projects: 'Keine Projekte',
      no_publications: 'Keine Veröffentlichungen',
      no_skills: 'Keine Fähigkeiten aufgeführt',
      no_languages: 'Keine Sprachen aufgeführt',
      no_certifications: 'Keine Zertifizierungen',
      no_references: 'Keine Referenzen'
    },
    a11y: {
      skip_to_content: 'Zum Hauptinhalt springen',
      menu: 'Menü',
      close_menu: 'Menü schließen',
      select_language: 'Sprache auswählen',
      select_theme: 'Theme auswählen',
      select_focus: 'Fokus auswählen',
      open_modal: 'Modal öffnen',
      close_modal: 'Modal schließen'
    }
  },

  fa: {
    nav: {
      home: 'خانه',
      about: 'درباره',
      education: 'تحصیلات',
      experience: 'تجربیات',
      projects: 'پروژه‌ها',
      publications: 'انتشارات',
      skills: 'مهارت‌ها',
      languages: 'زبان‌ها',
      certifications: 'گواهینامه‌ها',
      references: 'مراجع',
      contact: 'تماس'
    },
    sections: {
      hero: 'خوش آمدید',
      basics: 'درباره من',
      profiles: 'ارتباط با من',
      education: 'تحصیلات',
      languages: 'زبان‌ها',
      certifications: 'کارگاه‌ها و گواهینامه‌ها',
      skills: 'مهارت‌ها و تخصص',
      experiences: 'تجربیات حرفه‌ای',
      projects: 'پروژه‌ها و نمونه‌کارها',
      publications: 'انتشارات و پژوهش',
      references: 'مراجع',
      contact: 'تماس بگیرید'
    },
    actions: {
      download_cv: 'دانلود رزومه',
      view_more: 'مشاهده بیشتر',
      view_less: 'مشاهده کمتر',
      contact_me: 'تماس با من',
      send_message: 'ارسال پیام',
      book_call: 'رزرو تماس',
      copy: 'کپی',
      copied: 'کپی شد!',
      close: 'بستن',
      expand: 'گسترش',
      collapse: 'جمع کردن',
      filter: 'فیلتر',
      search: 'جستجو',
      clear: 'پاک کردن'
    },
    forms: {
      name: 'نام',
      email: 'ایمیل',
      subject: 'موضوع',
      message: 'پیام',
      send: 'ارسال',
      sending: 'در حال ارسال...',
      sent: 'پیام ارسال شد!',
      error: 'خطایی رخ داد'
    },
    education: {
      institution: 'موسسه',
      degree: 'مدرک',
      field: 'رشته تحصیلی',
      location: 'موقعیت',
      duration: 'مدت',
      gpa: 'معدل',
      present: 'حال حاضر'
    },
    experience: {
      role: 'نقش',
      institution: 'سازمان',
      duration: 'مدت',
      present: 'حال حاضر',
      responsibilities: 'مسئولیت‌ها'
    },
    projects: {
      view_project: 'مشاهده پروژه',
      view_code: 'مشاهده کد',
      demo: 'نسخه آزمایشی',
      no_projects: 'پروژه‌ای یافت نشد'
    },
    publications: {
      type: 'نوع',
      status: 'وضعیت',
      published: 'منتشر شده',
      submitted: 'ارسال شده',
      in_review: 'در حال بررسی',
      waiting: 'در انتظار ارسال',
      authors: 'نویسندگان',
      journal: 'مجله',
      year: 'سال',
      doi: 'DOI',
      isbn: 'شابک'
    },
    skills: {
      proficiency: 'مهارت',
      years: 'سال تجربه',
      category: 'دسته',
      all_skills: 'تمام مهارت‌ها'
    },
    languages_section: {
      language: 'زبان',
      proficiency: 'مهارت',
      native: 'زبان مادری',
      fluent: 'روان',
      professional: 'حرفه‌ای',
      intermediate: 'متوسط',
      beginner: 'مبتدی',
      studying: 'در حال یادگیری',
      certification: 'گواهینامه'
    },
    references: {
      available_on_request: 'مراجع در صورت درخواست در دسترس هستند',
      position: 'موقعیت',
      department: 'بخش',
      institution: 'موسسه',
      email: 'ایمیل',
      phone: 'تلفن',
      reference_letter: 'نامه توصیه'
    },
    footer: {
      copyright: '© {year} {name}. تمام حقوق محفوظ است.',
      made_with: 'ساخته شده با',
      built_with: 'ساخته شده با React و TypeScript'
    },
    filters: {
      all: 'همه',
      programming: 'برنامه‌نویسی',
      bioinformatics: 'بیوانفورماتیک',
      biotechnology: 'زیست‌فناوری',
      academic: 'آکادمیک',
      focus: 'تمرکز'
    },
    empty: {
      no_data: 'داده‌ای موجود نیست',
      no_results: 'نتیجه‌ای یافت نشد',
      no_education: 'تحصیلاتی ثبت نشده',
      no_experience: 'تجربه‌ای ثبت نشده',
      no_projects: 'پروژه‌ای ثبت نشده',
      no_publications: 'انتشاراتی ثبت نشده',
      no_skills: 'مهارتی ثبت نشده',
      no_languages: 'زبانی ثبت نشده',
      no_certifications: 'گواهینامه‌ای ثبت نشده',
      no_references: 'مرجعی ثبت نشده'
    },
    a11y: {
      skip_to_content: 'پرش به محتوای اصلی',
      menu: 'منو',
      close_menu: 'بستن منو',
      select_language: 'انتخاب زبان',
      select_theme: 'انتخاب تم',
      select_focus: 'انتخاب تمرکز',
      open_modal: 'باز کردن مدال',
      close_modal: 'بستن مدال'
    }
  }
}

export function getUIStrings(lang: Language): UIStrings {
  return translations[lang] || translations.en
}

export function t(lang: Language, key: string): string {
  const strings = getUIStrings(lang)
  const keys = key.split('.')
  
  let value: any = strings
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }
  
  return typeof value === 'string' ? value : key
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''))
}
