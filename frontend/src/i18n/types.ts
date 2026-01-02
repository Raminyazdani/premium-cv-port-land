/**
 * i18n Type Definitions
 * 
 * Provides type-safe translation keys for the entire application.
 * All translation keys are defined here to prevent drift between languages.
 */

import type { Language } from '@/utils/dataNormalizer'

/**
 * All UI string translations organized by category
 */
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

  // Section Subtitles/Descriptions
  sectionSubtitles: {
    education: string
    experiences: string
    projects: string
    references: string
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
    show_more: string
    show_contact: string
    hide_contact: string
    timeline: string
    by_category: string
    has_link: string
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
    focus: string
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
    privacy_notice: string
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

  // Domain/Category labels
  domains: {
    programming: string
    bioinformatics: string
    biotechnology: string
    academic: string
    industry: string
    robotics: string
    embedded_systems: string
    student_projects: string
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
    no_experiences_added: string
    no_experiences_filter: string
  }

  // Fallback strings (for missing data)
  fallbacks: {
    untitled_role: string
    untitled_project: string
    untitled_publication: string
    unknown_institution: string
  }

  // Count displays
  counts: {
    showing_x_of_y_projects: string
    showing_x_of_y_publications: string
  }

  // Toast messages
  toasts: {
    copied_to_clipboard: string
    link_copied: string
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

/**
 * Type for all translation keys as a union type
 * This helps with type safety when accessing translation keys
 */
export type TranslationKey = 
  | `nav.${keyof UIStrings['nav']}`
  | `sections.${keyof UIStrings['sections']}`
  | `sectionSubtitles.${keyof UIStrings['sectionSubtitles']}`
  | `actions.${keyof UIStrings['actions']}`
  | `forms.${keyof UIStrings['forms']}`
  | `education.${keyof UIStrings['education']}`
  | `experience.${keyof UIStrings['experience']}`
  | `projects.${keyof UIStrings['projects']}`
  | `publications.${keyof UIStrings['publications']}`
  | `skills.${keyof UIStrings['skills']}`
  | `languages_section.${keyof UIStrings['languages_section']}`
  | `references.${keyof UIStrings['references']}`
  | `footer.${keyof UIStrings['footer']}`
  | `contact.${keyof UIStrings['contact']}`
  | `errors.${keyof UIStrings['errors']}`
  | `filters.${keyof UIStrings['filters']}`
  | `domains.${keyof UIStrings['domains']}`
  | `empty.${keyof UIStrings['empty']}`
  | `fallbacks.${keyof UIStrings['fallbacks']}`
  | `counts.${keyof UIStrings['counts']}`
  | `toasts.${keyof UIStrings['toasts']}`
  | `a11y.${keyof UIStrings['a11y']}`
  | `media.${keyof UIStrings['media']}`
  | `profiles.${keyof UIStrings['profiles']}`
  | `booking.${keyof UIStrings['booking']}`
  | `validation.${keyof UIStrings['validation']}`
  | `loading.${keyof UIStrings['loading']}`

/**
 * All translations organized by language
 */
export type Translations = Record<Language, UIStrings>
