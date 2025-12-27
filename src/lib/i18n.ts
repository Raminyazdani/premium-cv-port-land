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
    get_in_touch: string
    contact: string
    learn_more: string
    read_more: string
    show_less: string
    show_phone: string
    hide_phone: string
    email: string
    phone: string
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
    success_message: string
    error_message: string
    contact_description: string
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
    no_profile_data: string
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

  // Booking Widget
  booking: {
    title: string
    description: string
    meeting_type: string
    video_call: string
    phone_call: string
    in_person: string
    video_description: string
    phone_description: string
    in_person_description: string
    select_date: string
    select_time: string
    book_call: string
    booking: string
    clear_selection: string
    your_selection: string
    success_title: string
    success_description: string
    error_title: string
    error_description: string
    select_date_time: string
    selection_cleared: string
    unavailable: string
  }

  // Validation Messages
  validation: {
    required: string
    invalid_email: string
    min_length_2: string
    min_length_3: string
    min_length_10: string
  }

  // Loading States
  loading: {
    loading: string
    please_wait: string
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
      clear: 'Clear',
      get_in_touch: 'Get in Touch',
      contact: 'Contact',
      learn_more: 'Learn More',
      read_more: 'Read more',
      show_less: 'Show less',
      show_phone: 'Show phone',
      hide_phone: 'Hide phone',
      email: 'Email',
      phone: 'Phone'
    },
    forms: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      sent: 'Message sent!',
      error: 'An error occurred',
      success_message: 'Thank you for reaching out. I\'ll get back to you as soon as possible.',
      error_message: 'There was a problem sending your message. Please try again later or email directly.',
      contact_description: 'Send me a message and I\'ll get back to you as soon as possible'
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
      no_references: 'No references',
      no_profile_data: 'No profile data available'
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
    },
    booking: {
      title: 'Schedule a Call',
      description: 'Choose your preferred meeting type and select a time that works for you',
      meeting_type: 'Meeting Type',
      video_call: 'Video Call',
      phone_call: 'Phone Call',
      in_person: 'In Person',
      video_description: 'Meet via Zoom, Google Meet, or Microsoft Teams',
      phone_description: 'Direct phone conversation',
      in_person_description: 'Meet at a specified location',
      select_date: 'Select Date',
      select_time: 'Select Time',
      book_call: 'Book a Call',
      booking: 'Booking...',
      clear_selection: 'Clear Selection',
      your_selection: 'Your Selection:',
      success_title: 'Call booked!',
      success_description: 'Your {type} is scheduled for {date} at {time}.',
      error_title: 'Booking failed',
      error_description: 'There was a problem booking your call. Please try again later.',
      select_date_time: 'Please select a date and time',
      selection_cleared: 'Selection cleared',
      unavailable: 'unavailable'
    },
    validation: {
      required: '{field} is required',
      invalid_email: 'Please enter a valid email address',
      min_length_2: '{field} must be at least 2 characters',
      min_length_3: '{field} must be at least 3 characters',
      min_length_10: '{field} must be at least 10 characters'
    },
    loading: {
      loading: 'Loading...',
      please_wait: 'Please wait'
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
      clear: 'Löschen',
      get_in_touch: 'Kontakt aufnehmen',
      contact: 'Kontakt',
      learn_more: 'Mehr erfahren',
      read_more: 'Mehr lesen',
      show_less: 'Weniger anzeigen',
      show_phone: 'Telefon anzeigen',
      hide_phone: 'Telefon ausblenden',
      email: 'E-Mail',
      phone: 'Telefon'
    },
    forms: {
      name: 'Name',
      email: 'E-Mail',
      subject: 'Betreff',
      message: 'Nachricht',
      send: 'Senden',
      sending: 'Wird gesendet...',
      sent: 'Nachricht gesendet!',
      error: 'Ein Fehler ist aufgetreten',
      success_message: 'Vielen Dank für Ihre Nachricht. Ich werde mich so schnell wie möglich bei Ihnen melden.',
      error_message: 'Beim Senden Ihrer Nachricht ist ein Problem aufgetreten. Bitte versuchen Sie es später erneut oder senden Sie eine direkte E-Mail.',
      contact_description: 'Senden Sie mir eine Nachricht und ich werde mich so schnell wie möglich bei Ihnen melden'
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
      no_references: 'Keine Referenzen',
      no_profile_data: 'Keine Profildaten verfügbar'
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
    },
    booking: {
      title: 'Anruf vereinbaren',
      description: 'Wählen Sie Ihre bevorzugte Besprechungsart und wählen Sie eine passende Zeit',
      meeting_type: 'Besprechungsart',
      video_call: 'Videoanruf',
      phone_call: 'Telefonanruf',
      in_person: 'Persönlich',
      video_description: 'Treffen per Zoom, Google Meet oder Microsoft Teams',
      phone_description: 'Direktes Telefongespräch',
      in_person_description: 'Treffen an einem festgelegten Ort',
      select_date: 'Datum auswählen',
      select_time: 'Uhrzeit auswählen',
      book_call: 'Anruf buchen',
      booking: 'Wird gebucht...',
      clear_selection: 'Auswahl löschen',
      your_selection: 'Ihre Auswahl:',
      success_title: 'Anruf gebucht!',
      success_description: 'Ihr {type} ist für {date} um {time} geplant.',
      error_title: 'Buchung fehlgeschlagen',
      error_description: 'Bei der Buchung Ihres Anrufs ist ein Problem aufgetreten. Bitte versuchen Sie es später erneut.',
      select_date_time: 'Bitte wählen Sie ein Datum und eine Uhrzeit',
      selection_cleared: 'Auswahl gelöscht',
      unavailable: 'nicht verfügbar'
    },
    validation: {
      required: '{field} ist erforderlich',
      invalid_email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      min_length_2: '{field} muss mindestens 2 Zeichen lang sein',
      min_length_3: '{field} muss mindestens 3 Zeichen lang sein',
      min_length_10: '{field} muss mindestens 10 Zeichen lang sein'
    },
    loading: {
      loading: 'Wird geladen...',
      please_wait: 'Bitte warten'
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
      clear: 'پاک کردن',
      get_in_touch: 'تماس بگیرید',
      contact: 'تماس',
      learn_more: 'اطلاعات بیشتر',
      read_more: 'ادامه مطلب',
      show_less: 'کمتر نمایش بده',
      show_phone: 'نمایش تلفن',
      hide_phone: 'مخفی کردن تلفن',
      email: 'ایمیل',
      phone: 'تلفن'
    },
    forms: {
      name: 'نام',
      email: 'ایمیل',
      subject: 'موضوع',
      message: 'پیام',
      send: 'ارسال',
      sending: 'در حال ارسال...',
      sent: 'پیام ارسال شد!',
      error: 'خطایی رخ داد',
      success_message: 'از تماس شما متشکرم. در اسرع وقت پاسخ خواهم داد.',
      error_message: 'مشکلی در ارسال پیام شما به وجود آمد. لطفاً بعداً دوباره تلاش کنید یا مستقیماً ایمیل بزنید.',
      contact_description: 'پیام خود را برای من بفرستید و من در اسرع وقت پاسخ خواهم داد'
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
      no_references: 'مرجعی ثبت نشده',
      no_profile_data: 'اطلاعات پروفایل موجود نیست'
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
    },
    booking: {
      title: 'رزرو تماس',
      description: 'نوع جلسه مورد نظر خود را انتخاب کرده و زمان مناسب را برگزینید',
      meeting_type: 'نوع جلسه',
      video_call: 'تماس تصویری',
      phone_call: 'تماس تلفنی',
      in_person: 'حضوری',
      video_description: 'جلسه از طریق Zoom، Google Meet یا Microsoft Teams',
      phone_description: 'مکالمه مستقیم تلفنی',
      in_person_description: 'ملاقات در محل مشخص شده',
      select_date: 'انتخاب تاریخ',
      select_time: 'انتخاب زمان',
      book_call: 'رزرو تماس',
      booking: 'در حال رزرو...',
      clear_selection: 'پاک کردن انتخاب',
      your_selection: 'انتخاب شما:',
      success_title: 'تماس رزرو شد!',
      success_description: '{type} شما برای {date} در ساعت {time} برنامه‌ریزی شد.',
      error_title: 'رزرو ناموفق',
      error_description: 'مشکلی در رزرو تماس شما به وجود آمد. لطفاً بعداً دوباره تلاش کنید.',
      select_date_time: 'لطفاً یک تاریخ و زمان انتخاب کنید',
      selection_cleared: 'انتخاب پاک شد',
      unavailable: 'غیر قابل دسترس'
    },
    validation: {
      required: '{field} الزامی است',
      invalid_email: 'لطفاً یک آدرس ایمیل معتبر وارد کنید',
      min_length_2: '{field} باید حداقل ۲ کاراکتر باشد',
      min_length_3: '{field} باید حداقل ۳ کاراکتر باشد',
      min_length_10: '{field} باید حداقل ۱۰ کاراکتر باشد'
    },
    loading: {
      loading: 'در حال بارگذاری...',
      please_wait: 'لطفاً صبر کنید'
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
