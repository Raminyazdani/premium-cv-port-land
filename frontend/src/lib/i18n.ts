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
    expand_all: string
    collapse_all: string
    back_to_top: string
    retry: string
    open_pdf: string
    theme: string
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
    skills_across_domains: string
    no_skills_matching: string
    search_placeholder: string
    more_categories: string
    skills_count: string
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
    description: string
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
    konami_hint: string
  }

  // Contact section
  contact: {
    title: string
    description: string
    tab_message: string
    tab_booking: string
  }

  // Error messages
  errors: {
    something_went_wrong: string
    error_occurred: string
    error_details: string
    try_again: string
    runtime_error: string
    unexpected: string
    error_details_label: string
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
    required: string
    scroll_to_top: string
    quick_actions: string
    language_carousel: string
    language_selection: string
    loading_image: string
    toggle_sidebar: string
    pagination: string
    previous_page: string
    next_page: string
    breadcrumb: string
    filter_focus: string
    testimonial_nav: string
    media_viewer: string
    previous_media: string
    next_media: string
    scroll_to_about: string
    certified: string
    workshop: string
    search_certifications: string
    search_skills: string
    clear_search: string
    list_view: string
    carousel_view: string
    search_publications: string
    visit_profile: string
    page_scroll_progress: string
    previous_skill_category: string
    next_skill_category: string
    skill_category_nav: string
    go_to_slide: string
    close_quick_actions: string
    open_quick_actions: string
    social_profiles: string
  }

  // Media
  media: {
    failed_to_load: string
    image_could_not_load: string
    click_to_open_pdf: string
    pdf_document: string
  }

  // Profiles
  profiles: {
    right_click_to_copy: string
    no_profiles: string
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

  // PWA
  pwa?: {
    install_app: string
    installed: string
    offline_mode: string
    update_available: string
    update_now: string
  }

  // Download Modal
  download?: {
    title: string
    description: string
    format: string
    pdf_browser: string
    pdf_browser_desc: string
    json_export: string
    json_export_desc: string
    markdown: string
    markdown_desc: string
    sections: string
    select_all: string
    deselect_all: string
    include_contact: string
    include_references: string
    preview: string
    download: string
    downloading: string
    success: string
    error: string
  }

  // Articles Section
  articles?: {
    title: string
    featured: string
    read_time: string
    external_link: string
    no_articles: string
    filter_by_tag: string
    all_tags: string
  }

  // Video Section
  video?: {
    play: string
    pause: string
    mute: string
    unmute: string
    fullscreen: string
    exit_fullscreen: string
    loading: string
  }

  // Accessibility
  accessibility?: {
    high_contrast: string
    font_size: string
    increase_font: string
    decrease_font: string
    reset_font: string
    dyslexia_font: string
    reduced_motion: string
  }

  // Case Study (ProjectCaseStudy.tsx)
  caseStudy?: {
    viewCaseStudy: string
    collapse: string
    problem: string
    solution: string
    process: string
    results: string
    technologies: string
    gallery: string
    links: string
    metrics: string
    viewProject: string
    viewCode: string
    liveDemo: string
    close: string
    of: string
    previous: string
    next: string
  }

  // Cookie Consent (CookieConsentBanner.tsx)
  cookies?: {
    title: string
    message: string
    accept: string
    decline: string
    dntMessage: string
    privacyPolicy: string
    close: string
  }

  // Testimonials (TestimonialsSection.tsx)
  testimonials?: {
    title: string
    subtitle: string
    linkedIn: string
    noTestimonials: string
    previous: string
    next: string
    pause: string
    play: string
    of: string
  }

  // SEO (seo.ts) - fully translated titles and descriptions per language
  seo?: {
    name: string
    title: string
    description: string
    separator: string
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
      phone: 'Phone',
      expand_all: 'Expand All',
      collapse_all: 'Collapse All',
      back_to_top: 'Back to top',
      retry: 'Retry',
      open_pdf: 'Open PDF',
      theme: 'Theme'
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
      all_skills: 'All Skills',
      skills_across_domains: '{count} skills across {domains} domains',
      no_skills_matching: 'No skills found matching "{query}"',
      search_placeholder: 'Search skills...',
      more_categories: '+{count} more categories',
      skills_count: '{count} skills'
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
      certification: 'Certification',
      description: 'Communication skills across multiple languages'
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
      built_with: 'Built with React & TypeScript',
      konami_hint: 'Try the Konami code 🎮'
    },
    contact: {
      title: "Let's Connect",
      description: 'Whether you want to send a message or schedule a call, I\'m here to help',
      tab_message: 'Send Message',
      tab_booking: 'Book a Call'
    },
    errors: {
      something_went_wrong: 'Something went wrong',
      error_occurred: 'An error occurred while loading the application',
      error_details: 'Error details',
      try_again: 'Try again',
      runtime_error: 'This spark has encountered a runtime error',
      unexpected: 'Something unexpected happened while running the application. The error details are shown below. Contact the spark author and let them know about this issue.',
      error_details_label: 'Error Details:'
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
      close_modal: 'Close modal',
      required: 'required',
      scroll_to_top: 'Page corner - click to scroll to top',
      quick_actions: 'Quick actions',
      language_carousel: 'Language selector carousel',
      language_selection: 'Language selection',
      loading_image: 'Loading image',
      toggle_sidebar: 'Toggle Sidebar',
      pagination: 'pagination',
      previous_page: 'Go to previous page',
      next_page: 'Go to next page',
      breadcrumb: 'breadcrumb',
      filter_focus: 'Filter content focus',
      testimonial_nav: 'Testimonial navigation',
      media_viewer: 'Media viewer',
      previous_media: 'Previous media',
      next_media: 'Next media',
      scroll_to_about: 'Scroll to about section',
      certified: 'Certified',
      workshop: 'Workshop',
      search_certifications: 'Search certifications',
      search_skills: 'Search skills',
      clear_search: 'Clear search',
      list_view: 'List view',
      carousel_view: 'Carousel view',
      search_publications: 'Search publications',
      visit_profile: 'Visit {network} profile',
      page_scroll_progress: 'Page scroll progress',
      previous_skill_category: 'Previous skill category',
      next_skill_category: 'Next skill category',
      skill_category_nav: 'Skill category navigation',
      go_to_slide: 'Go to slide {number}',
      close_quick_actions: 'Close quick actions',
      open_quick_actions: 'Open quick actions',
      social_profiles: 'Social media profiles'
    },
    media: {
      failed_to_load: 'Failed to load image',
      image_could_not_load: 'The image could not be loaded',
      click_to_open_pdf: 'Click below to open in a new tab',
      pdf_document: 'PDF Document'
    },
    profiles: {
      right_click_to_copy: 'Right-click to copy link',
      no_profiles: 'No profiles available'
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
    },
    pwa: {
      install_app: 'Install App',
      installed: 'App installed',
      offline_mode: 'You are offline',
      update_available: 'Update available',
      update_now: 'Update now'
    },
    download: {
      title: 'Download CV',
      description: 'Choose your preferred format and customize the content',
      format: 'Format',
      pdf_browser: 'PDF (Browser Print)',
      pdf_browser_desc: 'Use browser print dialog to save as PDF',
      json_export: 'JSON Export',
      json_export_desc: 'Raw data in JSON format',
      markdown: 'Markdown',
      markdown_desc: 'Plain text readable format',
      sections: 'Sections to Include',
      select_all: 'Select All',
      deselect_all: 'Deselect All',
      include_contact: 'Include Contact Info',
      include_references: 'Include References',
      preview: 'Preview',
      download: 'Download',
      downloading: 'Downloading...',
      success: 'Download complete',
      error: 'Download failed'
    },
    articles: {
      title: 'Articles & Blog',
      featured: 'Featured',
      read_time: '{minutes} min read',
      external_link: 'External article',
      no_articles: 'No articles available',
      filter_by_tag: 'Filter by tag',
      all_tags: 'All'
    },
    video: {
      play: 'Play video',
      pause: 'Pause video',
      mute: 'Mute',
      unmute: 'Unmute',
      fullscreen: 'Fullscreen',
      exit_fullscreen: 'Exit fullscreen',
      loading: 'Loading video...'
    },
    accessibility: {
      high_contrast: 'High contrast mode',
      font_size: 'Font size',
      increase_font: 'Increase font size',
      decrease_font: 'Decrease font size',
      reset_font: 'Reset font size',
      dyslexia_font: 'Dyslexia-friendly font',
      reduced_motion: 'Reduced motion'
    },
    caseStudy: {
      viewCaseStudy: 'View Case Study',
      collapse: 'Collapse',
      problem: 'Problem',
      solution: 'Solution',
      process: 'Process',
      results: 'Results',
      technologies: 'Technologies',
      gallery: 'Gallery',
      links: 'Links',
      metrics: 'Key Metrics',
      viewProject: 'View Project',
      viewCode: 'View Code',
      liveDemo: 'Live Demo',
      close: 'Close',
      of: 'of',
      previous: 'Previous image',
      next: 'Next image'
    },
    cookies: {
      title: 'Cookie Consent',
      message: 'We use cookies to analyze site traffic and improve your experience. You can opt out at any time.',
      accept: 'Accept',
      decline: 'Decline',
      dntMessage: 'We detected that you have Do Not Track enabled. Analytics tracking is disabled.',
      privacyPolicy: 'Privacy Policy',
      close: 'Close'
    },
    testimonials: {
      title: 'Testimonials & Recommendations',
      subtitle: 'What colleagues and clients say',
      linkedIn: 'View on LinkedIn',
      noTestimonials: 'No testimonials available',
      previous: 'Previous testimonial',
      next: 'Next testimonial',
      pause: 'Pause auto-rotation',
      play: 'Resume auto-rotation',
      of: 'of'
    },
    seo: {
      name: 'Ramin Yazdani',
      title: 'Biotechnologist & Developer',
      description: 'CV of Ramin Yazdani - Biotechnologist and Software Developer',
      separator: ' - '
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
      phone: 'Telefon',
      expand_all: 'Alle erweitern',
      collapse_all: 'Alle einklappen',
      back_to_top: 'Nach oben',
      retry: 'Erneut versuchen',
      open_pdf: 'PDF öffnen',
      theme: 'Design'
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
      all_skills: 'Alle Fähigkeiten',
      skills_across_domains: '{count} Fähigkeiten in {domains} Bereichen',
      no_skills_matching: 'Keine Fähigkeiten gefunden für "{query}"',
      search_placeholder: 'Fähigkeiten suchen...',
      more_categories: '+{count} weitere Kategorien',
      skills_count: '{count} Fähigkeiten'
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
      certification: 'Zertifizierung',
      description: 'Kommunikationsfähigkeiten in mehreren Sprachen'
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
      built_with: 'Erstellt mit React & TypeScript',
      konami_hint: 'Versuchen Sie den Konami-Code 🎮'
    },
    contact: {
      title: 'Kontaktieren Sie mich',
      description: 'Ob Sie eine Nachricht senden oder einen Anruf vereinbaren möchten, ich bin hier um zu helfen',
      tab_message: 'Nachricht senden',
      tab_booking: 'Anruf buchen'
    },
    errors: {
      something_went_wrong: 'Etwas ist schief gelaufen',
      error_occurred: 'Beim Laden der Anwendung ist ein Fehler aufgetreten',
      error_details: 'Fehlerdetails',
      try_again: 'Erneut versuchen',
      runtime_error: 'Dieser Spark hat einen Laufzeitfehler festgestellt',
      unexpected: 'Beim Ausführen der Anwendung ist etwas Unerwartetes passiert. Die Fehlerdetails werden unten angezeigt. Kontaktieren Sie den Spark-Autor und informieren Sie ihn über dieses Problem.',
      error_details_label: 'Fehlerdetails:'
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
      close_modal: 'Modal schließen',
      required: 'erforderlich',
      scroll_to_top: 'Seitenecke - zum Scrollen nach oben klicken',
      quick_actions: 'Schnellaktionen',
      language_carousel: 'Sprachauswahl-Karussell',
      language_selection: 'Sprachauswahl',
      loading_image: 'Bild wird geladen',
      toggle_sidebar: 'Seitenleiste umschalten',
      pagination: 'Seitennummerierung',
      previous_page: 'Zur vorherigen Seite',
      next_page: 'Zur nächsten Seite',
      breadcrumb: 'Brotkrümelnavigation',
      filter_focus: 'Inhaltsfokus filtern',
      testimonial_nav: 'Testimonial-Navigation',
      media_viewer: 'Medienbetrachter',
      previous_media: 'Vorheriges Medium',
      next_media: 'Nächstes Medium',
      scroll_to_about: 'Zum Über-Bereich scrollen',
      certified: 'Zertifiziert',
      workshop: 'Workshop',
      search_certifications: 'Zertifizierungen durchsuchen',
      search_skills: 'Fähigkeiten durchsuchen',
      clear_search: 'Suche löschen',
      list_view: 'Listenansicht',
      carousel_view: 'Karussellansicht',
      search_publications: 'Veröffentlichungen durchsuchen',
      visit_profile: '{network}-Profil besuchen',
      page_scroll_progress: 'Seitenfortschritt',
      previous_skill_category: 'Vorherige Fähigkeitskategorie',
      next_skill_category: 'Nächste Fähigkeitskategorie',
      skill_category_nav: 'Navigation der Fähigkeitskategorien',
      go_to_slide: 'Zu Folie {number} gehen',
      close_quick_actions: 'Schnellaktionen schließen',
      open_quick_actions: 'Schnellaktionen öffnen',
      social_profiles: 'Social-Media-Profile'
    },
    media: {
      failed_to_load: 'Bild konnte nicht geladen werden',
      image_could_not_load: 'Das Bild konnte nicht geladen werden',
      click_to_open_pdf: 'Klicken Sie unten, um in einem neuen Tab zu öffnen',
      pdf_document: 'PDF-Dokument'
    },
    profiles: {
      right_click_to_copy: 'Rechtsklick zum Kopieren des Links',
      no_profiles: 'Keine Profile verfügbar'
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
    },
    pwa: {
      install_app: 'App installieren',
      installed: 'App installiert',
      offline_mode: 'Sie sind offline',
      update_available: 'Update verfügbar',
      update_now: 'Jetzt aktualisieren'
    },
    download: {
      title: 'Lebenslauf herunterladen',
      description: 'Wählen Sie Ihr bevorzugtes Format und passen Sie den Inhalt an',
      format: 'Format',
      pdf_browser: 'PDF (Browser-Druck)',
      pdf_browser_desc: 'Verwenden Sie den Browser-Druckdialog zum Speichern als PDF',
      json_export: 'JSON-Export',
      json_export_desc: 'Rohdaten im JSON-Format',
      markdown: 'Markdown',
      markdown_desc: 'Lesbares Klartextformat',
      sections: 'Einzubeziehende Abschnitte',
      select_all: 'Alle auswählen',
      deselect_all: 'Alle abwählen',
      include_contact: 'Kontaktdaten einbeziehen',
      include_references: 'Referenzen einbeziehen',
      preview: 'Vorschau',
      download: 'Herunterladen',
      downloading: 'Wird heruntergeladen...',
      success: 'Download abgeschlossen',
      error: 'Download fehlgeschlagen'
    },
    articles: {
      title: 'Artikel & Blog',
      featured: 'Empfohlen',
      read_time: '{minutes} Min. Lesezeit',
      external_link: 'Externer Artikel',
      no_articles: 'Keine Artikel verfügbar',
      filter_by_tag: 'Nach Tag filtern',
      all_tags: 'Alle'
    },
    video: {
      play: 'Video abspielen',
      pause: 'Video pausieren',
      mute: 'Stumm schalten',
      unmute: 'Ton einschalten',
      fullscreen: 'Vollbild',
      exit_fullscreen: 'Vollbild beenden',
      loading: 'Video wird geladen...'
    },
    accessibility: {
      high_contrast: 'Hoher Kontrast',
      font_size: 'Schriftgröße',
      increase_font: 'Schrift vergrößern',
      decrease_font: 'Schrift verkleinern',
      reset_font: 'Schriftgröße zurücksetzen',
      dyslexia_font: 'Legasthenie-freundliche Schrift',
      reduced_motion: 'Reduzierte Bewegung'
    },
    caseStudy: {
      viewCaseStudy: 'Fallstudie ansehen',
      collapse: 'Einklappen',
      problem: 'Problem',
      solution: 'Lösung',
      process: 'Prozess',
      results: 'Ergebnisse',
      technologies: 'Technologien',
      gallery: 'Galerie',
      links: 'Links',
      metrics: 'Wichtige Kennzahlen',
      viewProject: 'Projekt ansehen',
      viewCode: 'Code ansehen',
      liveDemo: 'Live-Demo',
      close: 'Schließen',
      of: 'von',
      previous: 'Vorheriges Bild',
      next: 'Nächstes Bild'
    },
    cookies: {
      title: 'Cookie-Zustimmung',
      message: 'Wir verwenden Cookies, um den Website-Traffic zu analysieren und Ihre Erfahrung zu verbessern. Sie können jederzeit ablehnen.',
      accept: 'Akzeptieren',
      decline: 'Ablehnen',
      dntMessage: 'Wir haben erkannt, dass Sie Do Not Track aktiviert haben. Analytics-Tracking ist deaktiviert.',
      privacyPolicy: 'Datenschutzrichtlinie',
      close: 'Schließen'
    },
    testimonials: {
      title: 'Empfehlungen & Testimonials',
      subtitle: 'Was Kollegen und Kunden sagen',
      linkedIn: 'Auf LinkedIn ansehen',
      noTestimonials: 'Keine Empfehlungen verfügbar',
      previous: 'Vorherige Empfehlung',
      next: 'Nächste Empfehlung',
      pause: 'Automatische Rotation pausieren',
      play: 'Automatische Rotation fortsetzen',
      of: 'von'
    },
    seo: {
      name: 'Ramin Yazdani',
      title: 'Biotechnologe & Entwickler',
      description: 'Lebenslauf von Ramin Yazdani - Biotechnologe und Softwareentwickler',
      separator: ' - '
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
      phone: 'تلفن',
      expand_all: 'گسترش همه',
      collapse_all: 'جمع کردن همه',
      back_to_top: 'بازگشت به بالا',
      retry: 'تلاش مجدد',
      open_pdf: 'باز کردن PDF',
      theme: 'تم'
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
      all_skills: 'تمام مهارت‌ها',
      skills_across_domains: '{count} مهارت در {domains} حوزه',
      no_skills_matching: 'مهارتی با "{query}" یافت نشد',
      search_placeholder: 'جستجوی مهارت‌ها...',
      more_categories: '+{count} دسته بیشتر',
      skills_count: '{count} مهارت'
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
      certification: 'گواهینامه',
      description: 'مهارت‌های ارتباطی در چند زبان'
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
      built_with: 'ساخته شده با React و TypeScript',
      konami_hint: 'کد کونامی را امتحان کنید 🎮'
    },
    contact: {
      title: 'با من در ارتباط باشید',
      description: 'چه بخواهید پیام بفرستید یا تماس بگیرید، من اینجا هستم تا کمک کنم',
      tab_message: 'ارسال پیام',
      tab_booking: 'رزرو تماس'
    },
    errors: {
      something_went_wrong: 'مشکلی پیش آمد',
      error_occurred: 'خطایی در هنگام بارگذاری برنامه رخ داد',
      error_details: 'جزئیات خطا',
      try_again: 'دوباره تلاش کنید',
      runtime_error: 'این Spark با یک خطای زمان اجرا مواجه شده است',
      unexpected: 'هنگام اجرای برنامه اتفاق غیرمنتظره‌ای رخ داد. جزئیات خطا در زیر نشان داده شده است. با نویسنده Spark تماس بگیرید و او را از این مشکل آگاه کنید.',
      error_details_label: 'جزئیات خطا:'
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
      close_modal: 'بستن مدال',
      required: 'الزامی',
      scroll_to_top: 'گوشه صفحه - برای اسکرول به بالا کلیک کنید',
      quick_actions: 'اقدامات سریع',
      language_carousel: 'کاروسل انتخاب زبان',
      language_selection: 'انتخاب زبان',
      loading_image: 'بارگذاری تصویر',
      toggle_sidebar: 'تغییر وضعیت نوار کناری',
      pagination: 'صفحه‌بندی',
      previous_page: 'برو به صفحه قبلی',
      next_page: 'برو به صفحه بعدی',
      breadcrumb: 'مسیر صفحه',
      filter_focus: 'فیلتر تمرکز محتوا',
      testimonial_nav: 'ناوبری نظرات',
      media_viewer: 'نمایشگر رسانه',
      previous_media: 'رسانه قبلی',
      next_media: 'رسانه بعدی',
      scroll_to_about: 'اسکرول به بخش درباره',
      certified: 'تایید شده',
      workshop: 'کارگاه',
      search_certifications: 'جستجوی گواهینامه‌ها',
      search_skills: 'جستجوی مهارت‌ها',
      clear_search: 'پاک کردن جستجو',
      list_view: 'نمای لیست',
      carousel_view: 'نمای کاروسل',
      search_publications: 'جستجوی انتشارات',
      visit_profile: 'بازدید از پروفایل {network}',
      page_scroll_progress: 'پیشرفت اسکرول صفحه',
      previous_skill_category: 'دسته مهارت قبلی',
      next_skill_category: 'دسته مهارت بعدی',
      skill_category_nav: 'ناوبری دسته‌های مهارت',
      go_to_slide: 'رفتن به اسلاید {number}',
      close_quick_actions: 'بستن اقدامات سریع',
      open_quick_actions: 'باز کردن اقدامات سریع',
      social_profiles: 'پروفایل‌های شبکه‌های اجتماعی'
    },
    media: {
      failed_to_load: 'بارگذاری تصویر ناموفق بود',
      image_could_not_load: 'تصویر بارگذاری نشد',
      click_to_open_pdf: 'برای باز کردن در تب جدید کلیک کنید',
      pdf_document: 'سند PDF'
    },
    profiles: {
      right_click_to_copy: 'راست‌کلیک برای کپی لینک',
      no_profiles: 'پروفایلی موجود نیست'
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
    },
    pwa: {
      install_app: 'نصب برنامه',
      installed: 'برنامه نصب شده',
      offline_mode: 'آفلاین هستید',
      update_available: 'به‌روزرسانی موجود است',
      update_now: 'الان به‌روز کنید'
    },
    download: {
      title: 'دانلود رزومه',
      description: 'فرمت مورد نظر خود را انتخاب کرده و محتوا را سفارشی کنید',
      format: 'فرمت',
      pdf_browser: 'PDF (چاپ مرورگر)',
      pdf_browser_desc: 'از گفتگوی چاپ مرورگر برای ذخیره به عنوان PDF استفاده کنید',
      json_export: 'خروجی JSON',
      json_export_desc: 'داده‌های خام در فرمت JSON',
      markdown: 'Markdown',
      markdown_desc: 'فرمت متن ساده خوانا',
      sections: 'بخش‌های مورد نظر',
      select_all: 'انتخاب همه',
      deselect_all: 'لغو انتخاب همه',
      include_contact: 'شامل اطلاعات تماس',
      include_references: 'شامل مراجع',
      preview: 'پیش‌نمایش',
      download: 'دانلود',
      downloading: 'در حال دانلود...',
      success: 'دانلود کامل شد',
      error: 'دانلود ناموفق'
    },
    articles: {
      title: 'مقالات و وبلاگ',
      featured: 'ویژه',
      read_time: '{minutes} دقیقه مطالعه',
      external_link: 'مقاله خارجی',
      no_articles: 'مقاله‌ای موجود نیست',
      filter_by_tag: 'فیلتر بر اساس تگ',
      all_tags: 'همه'
    },
    video: {
      play: 'پخش ویدیو',
      pause: 'توقف ویدیو',
      mute: 'بی‌صدا',
      unmute: 'صدادار',
      fullscreen: 'تمام صفحه',
      exit_fullscreen: 'خروج از تمام صفحه',
      loading: 'در حال بارگذاری ویدیو...'
    },
    accessibility: {
      high_contrast: 'حالت کنتراست بالا',
      font_size: 'اندازه فونت',
      increase_font: 'افزایش اندازه فونت',
      decrease_font: 'کاهش اندازه فونت',
      reset_font: 'بازنشانی اندازه فونت',
      dyslexia_font: 'فونت مناسب دیسلکسی',
      reduced_motion: 'حرکت کمتر'
    },
    caseStudy: {
      viewCaseStudy: 'مشاهده مطالعه موردی',
      collapse: 'جمع کردن',
      problem: 'مسئله',
      solution: 'راه‌حل',
      process: 'فرآیند',
      results: 'نتایج',
      technologies: 'فناوری‌ها',
      gallery: 'گالری',
      links: 'لینک‌ها',
      metrics: 'معیارهای کلیدی',
      viewProject: 'مشاهده پروژه',
      viewCode: 'مشاهده کد',
      liveDemo: 'نسخه آزمایشی',
      close: 'بستن',
      of: 'از',
      previous: 'تصویر قبلی',
      next: 'تصویر بعدی'
    },
    cookies: {
      title: 'رضایت کوکی',
      message: 'ما از کوکی‌ها برای تحلیل ترافیک سایت و بهبود تجربه شما استفاده می‌کنیم. شما می‌توانید هر زمان انصراف دهید.',
      accept: 'پذیرفتن',
      decline: 'رد کردن',
      dntMessage: 'ما تشخیص دادیم که شما Do Not Track را فعال کرده‌اید. ردیابی تحلیلی غیرفعال است.',
      privacyPolicy: 'سیاست حفظ حریم خصوصی',
      close: 'بستن'
    },
    testimonials: {
      title: 'توصیه‌ها و نظرات',
      subtitle: 'نظر همکاران و مشتریان',
      linkedIn: 'مشاهده در لینکدین',
      noTestimonials: 'توصیه‌ای موجود نیست',
      previous: 'توصیه قبلی',
      next: 'توصیه بعدی',
      pause: 'توقف چرخش خودکار',
      play: 'ادامه چرخش خودکار',
      of: 'از'
    },
    seo: {
      name: 'رامین یزدانی',
      title: 'زیست‌فناور و توسعه‌دهنده',
      description: 'رزومه رامین یزدانی - زیست‌فناور و توسعه‌دهنده نرم‌افزار',
      separator: ' - '
    }
  }
}

// Pseudo-localization support for QA
import { isPseudoLocEnabled, pseudoLocalizeObject } from '@/utils/pseudoLocalization'

export function getUIStrings(lang: Language): UIStrings {
  const strings = translations[lang] || translations.en
  
  // Apply pseudo-localization if enabled
  if (isPseudoLocEnabled()) {
    return pseudoLocalizeObject(strings)
  }
  
  return strings
}

export function t(lang: Language, key: string): string {
  const strings = getUIStrings(lang)
  const keys = key.split('.')
  
  let value: unknown = strings
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key
    }
  }
  
  return typeof value === 'string' ? value : key
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''))
}

// ============================================================================
// KEY LABEL TRANSLATIONS (from lang.json)
// ============================================================================

/**
 * Load lang.json for structural key label translations
 */
import langLabels from '@/data/lang.json'

/**
 * Translate a structural key label using lang.json
 * 
 * This is for CV data field/section labels, NOT UI strings.
 * For UI strings, use `getUIStrings()` or `t()`.
 * 
 * @param keyName - The canonical English key name (e.g., "basics", "education", "fname")
 * @param lang - Target language (en/de/fa)
 * @returns Translated label, with fallback chain: lang → en → keyName
 * 
 * @example
 * tl('basics', 'de')  // → "Grunddaten"
 * tl('fname', 'fa')   // → "نام_کوچک"
 * tl('email', 'en')   // → "email"
 */
export function tl(keyName: string, lang: Language): string {
  // Type assertion for lang.json structure
  const labels = langLabels as Record<string, Record<Language, string>>
  
  if (!labels[keyName]) {
    // Key not in lang.json, return as-is
    return keyName
  }
  
  // Try requested language
  if (labels[keyName][lang]) {
    return labels[keyName][lang]
  }
  
  // Fallback to English
  if (labels[keyName].en) {
    return labels[keyName].en
  }
  
  // Final fallback: return the key itself
  return keyName
}

// ============================================================================
// LOCALE-AWARE FORMATTING UTILITIES
// ============================================================================

/**
 * Language to locale mapping for Intl APIs
 */
const localeMap: Record<Language, string> = {
  en: 'en-US',
  de: 'de-DE',
  fa: 'fa-IR'
}

/**
 * Date formatting options presets
 */
export const dateFormatPresets = {
  short: { year: 'numeric', month: 'short' } as Intl.DateTimeFormatOptions,
  long: { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions,
  full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' } as Intl.DateTimeFormatOptions,
  monthYear: { year: 'numeric', month: 'long' } as Intl.DateTimeFormatOptions,
  yearOnly: { year: 'numeric' } as Intl.DateTimeFormatOptions
}

/**
 * Format a date according to the specified language's locale.
 * 
 * Examples:
 * - EN: "January 15, 2024"
 * - DE: "15. Januar 2024"
 * - FA: "۱۵ دی ۱۴۰۲" (with Persian calendar)
 * 
 * @param date - Date to format (string, Date, or number)
 * @param language - Target language
 * @param options - Intl.DateTimeFormat options (defaults to 'long' preset)
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  language: Language,
  options: Intl.DateTimeFormatOptions = dateFormatPresets.long
): string {
  if (!date) return ''

  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    
    if (isNaN(dateObj.getTime())) {
      return ''
    }

    const locale = localeMap[language]
    
    // For Persian, optionally use Persian calendar
    // Note: Using Gregorian calendar by default for consistency
    // To use Persian calendar, uncomment the calendar option below
    const formatOptions: Intl.DateTimeFormatOptions = {
      ...options,
      // calendar: language === 'fa' ? 'persian' : 'gregory'
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj)
  } catch {
    return ''
  }
}

/**
 * Format a date for display, handling special cases like "present"
 * 
 * @param date - Date to format
 * @param language - Target language
 * @param options - Formatting options
 * @returns Formatted date or "Present" translation
 */
export function formatDateDisplay(
  date: Date | string | number | null | undefined,
  language: Language,
  options: Intl.DateTimeFormatOptions = dateFormatPresets.monthYear
): string {
  if (!date) return ''
  
  // Handle "present" case
  if (typeof date === 'string') {
    const lowerDate = date.toLowerCase()
    if (lowerDate === 'present' || lowerDate === 'gegenwart' || 
        lowerDate === 'تاکنون' || lowerDate === 'حال حاضر') {
      const strings = getUIStrings(language)
      return strings.education.present
    }
  }
  
  return formatDate(date, language, options)
}

/**
 * Format a date range (start - end) according to locale
 * 
 * @param startDate - Start date
 * @param endDate - End date (or "present")
 * @param language - Target language
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date | string | number | null | undefined,
  endDate: Date | string | number | null | undefined,
  language: Language
): string {
  const start = formatDateDisplay(startDate, language, dateFormatPresets.monthYear)
  const end = formatDateDisplay(endDate, language, dateFormatPresets.monthYear)
  
  if (!start && !end) return ''
  if (!start) return end
  if (!end) {
    const strings = getUIStrings(language)
    return `${start} – ${strings.education.present}`
  }
  
  return `${start} – ${end}`
}

/**
 * Format a number according to the specified language's locale.
 * 
 * Examples:
 * - EN: "1,234.56"
 * - DE: "1.234,56"
 * - FA: "۱٬۲۳۴٫۵۶" (with Persian numerals)
 * 
 * @param value - Number to format
 * @param language - Target language
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number | null | undefined,
  language: Language,
  options: Intl.NumberFormatOptions = {}
): string {
  if (value === null || value === undefined) return ''
  
  try {
    const locale = localeMap[language]
    
    // For Persian, use Extended Arabic-Indic numerals (۰-۹)
    // 'arabext' = Extended Arabic-Indic numerals used in Persian/Farsi
    const formatOptions: Intl.NumberFormatOptions = {
      ...options,
      numberingSystem: language === 'fa' ? 'arabext' : undefined
    }
    
    return new Intl.NumberFormat(locale, formatOptions).format(value)
  } catch {
    return String(value)
  }
}

/**
 * Format a currency value according to locale
 * 
 * @param value - Numeric value
 * @param language - Target language
 * @param currency - ISO 4217 currency code (default: based on language)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | null | undefined,
  language: Language,
  currency?: string
): string {
  if (value === null || value === undefined) return ''
  
  // Default currency by language
  const defaultCurrencies: Record<Language, string> = {
    en: 'USD',
    de: 'EUR',
    fa: 'IRR'
  }
  
  return formatNumber(value, language, {
    style: 'currency',
    currency: currency || defaultCurrencies[language],
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

/**
 * Format a percentage according to locale
 * 
 * @param value - Decimal value (e.g., 0.85 for 85%)
 * @param language - Target language
 * @returns Formatted percentage string
 */
export function formatPercent(
  value: number | null | undefined,
  language: Language
): string {
  if (value === null || value === undefined) return ''
  
  return formatNumber(value, language, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  })
}

/**
 * Plural forms for supported languages
 */
type PluralForms = {
  zero?: string
  one: string
  two?: string
  few?: string
  many?: string
  other: string
}

/**
 * Get plural form based on count and language rules.
 * 
 * Uses Intl.PluralRules for proper language-specific pluralization.
 * 
 * @param count - The count to pluralize for
 * @param forms - Object with plural forms (one, other, and optionally zero, two, few, many)
 * @param language - Target language
 * @returns The appropriate plural form
 */
export function pluralize(
  count: number,
  forms: PluralForms,
  language: Language
): string {
  const locale = localeMap[language]
  const pluralRules = new Intl.PluralRules(locale)
  const rule = pluralRules.select(count)
  
  // Return the matching form, with fallback to 'other'
  switch (rule) {
    case 'zero':
      return forms.zero ?? forms.other
    case 'one':
      return forms.one
    case 'two':
      return forms.two ?? forms.other
    case 'few':
      return forms.few ?? forms.other
    case 'many':
      return forms.many ?? forms.other
    default:
      return forms.other
  }
}

/**
 * Helper to format a count with its pluralized label.
 * 
 * Example: pluralizeWithCount(5, { one: 'item', other: 'items' }, 'en') => "5 items"
 * 
 * @param count - The count
 * @param forms - Plural forms
 * @param language - Target language
 * @returns Formatted string with count and plural label
 */
export function pluralizeWithCount(
  count: number,
  forms: PluralForms,
  language: Language
): string {
  const formattedCount = formatNumber(count, language)
  const label = pluralize(count, forms, language)
  return `${formattedCount} ${label}`
}

/**
 * Format relative time (e.g., "3 days ago", "in 2 hours")
 * 
 * @param value - Numeric value (negative for past, positive for future)
 * @param unit - Time unit
 * @param language - Target language
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  language: Language
): string {
  const locale = localeMap[language]
  
  try {
    const rtf = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
      style: 'long'
    })
    return rtf.format(value, unit)
  } catch {
    // Fallback for unsupported browsers
    const absValue = Math.abs(value)
    const unitStr = `${unit}${absValue !== 1 ? 's' : ''}`
    if (value < 0) {
      return `${absValue} ${unitStr} ago`
    } else {
      return `in ${absValue} ${unitStr}`
    }
  }
}

/**
 * Get the list display format for the language
 * 
 * Example: formatList(['a', 'b', 'c'], 'en') => "a, b, and c"
 *          formatList(['a', 'b', 'c'], 'de') => "a, b und c"
 * 
 * @param items - Array of strings to format as a list
 * @param language - Target language
 * @param type - List format type
 * @returns Formatted list string
 */
export function formatList(
  items: string[],
  language: Language,
  type: 'conjunction' | 'disjunction' = 'conjunction'
): string {
  if (!items || items.length === 0) return ''
  if (items.length === 1) return items[0] || ''
  
  const locale = localeMap[language]
  
  try {
    // Check if Intl.ListFormat is available (ES2021+)
    if (typeof Intl !== 'undefined' && 'ListFormat' in Intl) {
      // Type assertion for Intl.ListFormat (not in ES2020 lib)
      type ListFormatOptions = { style?: string; type?: string }
      type ListFormatConstructor = new (locale: string, options?: ListFormatOptions) => { format: (items: string[]) => string }
      const ListFormat = (Intl as unknown as { ListFormat: ListFormatConstructor }).ListFormat
      const listFormatter = new ListFormat(locale, {
        style: 'long',
        type
      })
      return listFormatter.format(items)
    }
  } catch {
    // Fallback below will handle this case
  }
  
  // Fallback for unsupported browsers or when Intl.ListFormat is not available
  if (items.length === 2) {
    const conjunction = type === 'conjunction' 
      ? (language === 'de' ? ' und ' : language === 'fa' ? ' و ' : ' and ')
      : (language === 'de' ? ' oder ' : language === 'fa' ? ' یا ' : ' or ')
    return items.join(conjunction)
  }
  
  const lastItem = items[items.length - 1] ?? ''
  return items.slice(0, -1).join(', ') + 
         (type === 'conjunction' 
           ? (language === 'de' ? ' und ' : language === 'fa' ? ' و ' : ', and ')
           : (language === 'de' ? ' oder ' : language === 'fa' ? ' یا ' : ', or ')) + 
         lastItem
}
