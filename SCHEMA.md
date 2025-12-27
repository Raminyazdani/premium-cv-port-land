# CV JSON Schema Documentation

This document describes the complete JSON structure used for CV data in this application. The schema is designed to be flexible, internationalization-ready, and supports advanced filtering through `type_key` arrays.

## Table of Contents

- [Overview](#overview)
- [Top-Level Structure](#top-level-structure)
- [Section Schemas](#section-schemas)
  - [Basics](#basics)
  - [Profiles](#profiles)
  - [Education](#education)
  - [Languages](#languages)
  - [Workshop and Certifications](#workshop-and-certifications)
  - [Skills](#skills)
  - [Experiences](#experiences)
  - [Projects](#projects)
  - [Publications](#publications)
  - [References](#references)
- [Common Patterns](#common-patterns)
- [Type Key System](#type-key-system)
- [Pictures Structure](#pictures-structure)
- [Media URL Handling](#media-url-handling)
- [Date Formats](#date-formats)
- [Validation Rules](#validation-rules)

---

## Overview

The CV data is stored as a single JSON object with multiple top-level keys, each representing a section of the CV. All fields are **optional** to ensure robustness when data is incomplete or missing.

### Design Principles

1. **Flexibility**: All fields are nullable to handle incomplete data gracefully
2. **Internationalization**: Support for multiple languages via separate JSON files with identical structure
3. **Filtering**: `type_key` arrays enable dynamic content filtering (Academic, Programming, Biotechnology, etc.)
4. **Media-rich**: Support for images, PDFs, and other media URLs throughout
5. **Type-safe**: Mapped to TypeScript interfaces for compile-time safety

---

## Top-Level Structure

```json
{
  "basics": [...],                        // Personal information (Array)
  "profiles": [...],                      // Social media profiles (Array)
  "education": [...],                     // Educational background (Array)
  "languages": [...],                     // Language proficiency (Array)
  "workshop_and_certifications": [...],   // Certifications grouped by issuer (Array)
  "skills": {...},                        // Nested skills structure (Object)
  "experiences": [...],                   // Work experience (Array)
  "projects": [...],                      // Projects/Portfolio (Array)
  "publications": [...],                  // Academic publications (Array)
  "references": [...]                     // Professional references (Array)
}
```

**Note**: Most sections are arrays except `skills`, which is a nested object structure.

---

## Section Schemas

### Basics

**Description**: Personal identity, contact information, location, and profile/cover pictures.

**Structure**: Array containing one object (designed as array for consistency, but typically contains a single entry)

#### Schema

```typescript
{
  fname?: string | null                   // First name
  lname?: string | null                   // Last name
  name?: string | null                    // Full name (alternative to fname/lname)
  label?: string | string[] | null        // Professional titles/roles
  email?: string | null                   // Primary email address
  phone?: {                               // Phone number object
    countryCode?: string | null           // e.g., "+49"
    number?: string | null                // e.g., "17666652181"
    formatted?: string | null             // e.g., "+49 (0) 176 666 52181"
  } | null
  birthDate?: string | null               // ISO date format: "YYYY-MM-DD"
  summary?: string | null                 // Professional summary paragraph
  location?: Array<{                      // Location information (array)
    address?: string | null               // Full street address (usually null for privacy)
    postalCode?: string | null            // Postal/ZIP code
    city?: string | null                  // City name
    region?: string | null                // State/Region
    country?: string | null               // Country name
  }> | null
  Pictures?: Array<{                      // Profile and cover images
    type_of: string                       // "profile" | "cover"
    URL: string                           // Full image URL (e.g., Cloudinary)
  }> | null
}
```

#### Example

```json
{
  "basics": [
    {
      "fname": "Ramin",
      "lname": "Yazdani",
      "label": [
        "Biotechnologist",
        "Developer",
        "Data Scientist",
        "Bioinformatician"
      ],
      "email": "raya00001@stud.uni-saarland.de",
      "phone": {
        "countryCode": "+49",
        "number": "17666652181",
        "formatted": "+49 (0) 176 666 52181"
      },
      "birthDate": "1997-09-07",
      "summary": "I'm Ramin Yazdani, a data science enthusiast...",
      "location": [
        {
          "address": null,
          "postalCode": "66121",
          "city": "Saarbrücken",
          "region": "Saarland",
          "country": "Germany"
        }
      ],
      "Pictures": [
        {
          "type_of": "profile",
          "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1748294454/IMG_9262_wioxcp_c_pad_w_720_jjmvxi.jpg"
        },
        {
          "type_of": "cover",
          "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/c_crop,w_1200,h_900,ar_4:3,g_auto/v1748294940/IMG_5283_1200x1800_a2wxn9_c_pad_b_gen_fill_w_1600_h_400_1_lnwatm.jpg"
        }
      ]
    }
  ]
}
```

#### Field Notes

- **label**: Can be a single string or an array. Array is preferred for multiple roles
- **phone.formatted**: Human-readable format for display; `number` is the raw digits
- **location**: Array structure allows for multiple locations (current/permanent addresses)
- **Pictures**: See [Pictures Structure](#pictures-structure) for details
- **birthDate**: Not typically displayed publicly; kept for age calculation if needed

---

### Profiles

**Description**: Social media and professional network profiles (GitHub, LinkedIn, ORCID, Google Scholar, etc.)

**Structure**: Array of profile objects

#### Schema

```typescript
{
  network?: string | null      // Network name: "GitHub", "LinkedIn", "Google Scholar", "ORCID"
  username?: string | null     // Username or profile name
  url?: string | null          // Full profile URL
  uuid?: string | null         // Optional: unique identifier for the network (e.g., ORCID ID, Scholar ID)
}
```

#### Example

```json
{
  "profiles": [
    {
      "network": "GitHub",
      "username": "Raminyazdani",
      "url": "https://github.com/Raminyazdani"
    },
    {
      "network": "Google Scholar",
      "username": "Ramin Yazdani",
      "url": "https://scholar.google.com/citations?user=PIKk-q0AAAAJ&hl=en",
      "uuid": "PIKk-q0AAAAJ"
    },
    {
      "network": "LinkedIn",
      "username": "ramin-yz",
      "url": "https://linkedin.com/in/ramin-yz/"
    },
    {
      "network": "ORCHID",
      "username": "Ramin Yazdani",
      "url": "https://orcid.org/0000-0002-7996-5475"
    }
  ]
}
```

#### Field Notes

- **network**: Common values include "GitHub", "LinkedIn", "Google Scholar", "ORCID" (note: "ORCHID" is a typo variant that should be normalized to "ORCID" in the UI)
- **uuid**: Used for networks that have unique IDs (Google Scholar user ID, ORCID identifier)
- Links should open in new tabs with `rel="noopener noreferrer"` for security

---

### Education

**Description**: Educational history including degrees, institutions, dates, and GPAs

**Structure**: Array of education entries, typically sorted newest-first

#### Schema

```typescript
{
  institution?: string | null    // University/School name
  location?: string | null       // "City, Country"
  url?: string | null            // Institution website URL
  area?: string | null           // Field of study
  studyType?: string | null      // "Bachelor's", "Master's", "PhD", "High School", etc.
  startDate?: string | null      // ISO date: "YYYY-MM-DD"
  endDate?: string | null        // ISO date: "YYYY-MM-DD" or "present"
  gpa?: string | null            // GPA as string (e.g., "17.29 / 20.00", "3.8 / 4.0")
  score?: string | null          // Alternative to GPA
  logo_url?: string | null       // Institution logo URL
  courses?: string[] | null      // List of relevant courses
  type_key?: string[] | null     // Filter tags (see Type Key System)
}
```

#### Example

```json
{
  "education": [
    {
      "institution": "Saarland University",
      "location": "Saarbrücken, Germany",
      "area": "Bioinformatics",
      "studyType": "Master's",
      "startDate": "2024-10-20",
      "endDate": "present",
      "gpa": "",
      "logo_url": "",
      "type_key": [
        "Full CV",
        "Biotechnology",
        "Academic",
        "Bioinformatics",
        "Programming"
      ]
    },
    {
      "institution": "University of Tehran",
      "location": "Tehran, Iran",
      "area": "Biotechnology (Industrial and Environmental)",
      "studyType": "Master's",
      "startDate": "2021-09-22",
      "endDate": "2024-09-15",
      "gpa": "17.29 / 20.00",
      "logo_url": "",
      "type_key": [
        "Full CV",
        "Biotechnology",
        "Academic",
        "Bioinformatics",
        "Programming"
      ]
    }
  ]
}
```

#### Field Notes

- **endDate**: Use literal string `"present"` for ongoing education (display as "Present" in UI)
- **gpa**: Keep as string to support different scales (e.g., "17.29 / 20.00" vs "3.8 / 4.0")
- **type_key**: Enables filtering by focus area (see [Type Key System](#type-key-system))

---

### Languages

**Description**: Language proficiency with optional certification details

**Structure**: Array of language objects

#### Schema

```typescript
{
  language?: string | null         // Language name: "English", "Farsi", "German", etc.
  fluency?: string | null          // Legacy field, prefer proficiency object
  proficiency?: {                  // Detailed proficiency information
    level?: string | null          // "Native", "Professional", "Beginner", etc.
    CEFR?: string | null           // European standard: "A1", "A2", "B1", "B2", "C1", "C2"
    status?: string | null         // "Mother tongue", "Fluent", "Studying", etc.
  } | null
  certifications?: Array<{         // Optional language test results
    test?: string | null           // Test name: "IELTS Academic", "TOEFL", "TestDaF", etc.
    organization?: string | null   // Testing organization: "British Council", etc.
    overall?: number | null        // Overall score (numeric)
    reading?: number | null        // Reading score
    writing?: number | null        // Writing score
    listening?: number | null      // Listening score
    speaking?: number | null       // Speaking score
    maxScore?: number | null       // Maximum possible score (e.g., 9.0 for IELTS)
    minScore?: number | null       // Minimum possible score (e.g., 0.0)
    examDate?: string | null       // ISO date: "YYYY-MM-DD"
    URL?: string | null            // URL to certificate PDF
  }> | null
}
```

#### Example

```json
{
  "languages": [
    {
      "language": "Farsi",
      "proficiency": {
        "level": "Native",
        "CEFR": null,
        "status": "Mother tongue"
      },
      "certifications": [
        {
          "test": "Mother Tongue",
          "organization": null,
          "overall": null,
          "reading": null,
          "writing": null,
          "listening": null,
          "speaking": null,
          "examDate": null,
          "URL": null
        }
      ]
    },
    {
      "language": "English",
      "proficiency": {
        "level": "Professional",
        "CEFR": "C1",
        "status": "Fluent"
      },
      "certifications": [
        {
          "test": "IELTS Academic",
          "organization": "British Council",
          "overall": 8.0,
          "reading": 9.0,
          "listening": 8.5,
          "writing": 6.5,
          "speaking": 7.0,
          "maxScore": 9.0,
          "minScore": 0.0,
          "examDate": "2023-12-28",
          "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530886/certificate_ielts_jw47oo.pdf"
        }
      ]
    }
  ]
}
```

#### Field Notes

- **proficiency.CEFR**: Common European Framework of Reference levels (A1-C2)
- **certifications**: Scores are stored as numbers for accurate display and comparison
- **URL**: Link to certificate PDF for verification

---

### Workshop and Certifications

**Description**: Professional certifications, workshops, and training courses grouped by issuing organization

**Structure**: Array of issuer objects, each containing multiple certifications

#### Schema

```typescript
{
  issuer?: string | null              // Organization/Academy name
  certifications?: Array<{            // Array of certifications from this issuer
    name?: string | null              // Certification/workshop name
    date?: string | null              // Completion date: "YYYY-MM-DD"
    duration?: string | null          // Duration as string: "18 hours", "400 hours", "20 weeks"
    certificate?: boolean | null      // Whether formal certificate was issued
    URL?: string | null               // URL to certificate PDF
    type_key?: string[] | null        // Filter tags
    date_parse_error?: boolean | null // Flag for invalid dates (e.g., "2020-9-31")
  }> | null
}
```

#### Example

```json
{
  "workshop_and_certifications": [
    {
      "issuer": "Tuf North Academy",
      "certifications": [
        {
          "name": "Microarray Data Analysis in R Software and Systems Biology",
          "date": "2020-09-31",
          "duration": "18 hours",
          "certificate": true,
          "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530886/certificate_TUV_north_Academy_MicroArray_dspdq4.pdf",
          "type_key": [
            "Full CV",
            "Biotechnology",
            "Academic",
            "Bioinformatics"
          ]
        }
      ]
    },
    {
      "issuer": "Maktab Sharif Academy",
      "certifications": [
        {
          "name": "Python & Django",
          "date": "2023-01-18",
          "duration": "400 hours",
          "certificate": true,
          "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530890/certificate_maktabsharif_python_django_qi5tcd.pdf",
          "type_key": [
            "Full CV",
            "Biotechnology",
            "Academic",
            "Bioinformatics",
            "Programming"
          ]
        }
      ]
    }
  ]
}
```

#### Field Notes

- **date**: May contain invalid dates (e.g., "2020-9-31"). Use `date_parse_error` flag when normalizing
- **duration**: Free-form string; can be hours, weeks, or months
- **certificate**: Boolean indicating whether a formal certificate was issued
- **Grouped structure**: Certifications are grouped by issuer for better organization in UI

---

### Skills

**Description**: Hierarchical skills taxonomy with three levels: Top Category → Subcategory → Skill Items

**Structure**: Nested object (not array)

#### Schema

```typescript
{
  "Top Category Name": {                  // e.g., "Programming & Scripting"
    "Subcategory Name": [                 // e.g., "Programming Languages"
      {
        long_name: string                 // Full skill name
        short_name: string                // Abbreviated name for display
        type_key: string[]                // Filter tags
      }
    ]
  }
}
```

#### Example

```json
{
  "skills": {
    "Programming & Scripting": {
      "Programming Languages": [
        {
          "long_name": "Python",
          "short_name": "Python",
          "type_key": [
            "Full CV",
            "Programming",
            "Bioinformatics",
            "Academic"
          ]
        },
        {
          "long_name": "JavaScript",
          "short_name": "JS",
          "type_key": [
            "Full CV",
            "Programming",
            "Bioinformatics",
            "Academic"
          ]
        }
      ],
      "Machine Learning & Data Science": [
        {
          "long_name": "Supervised & Unsupervised Learning",
          "short_name": "Supervised/Unsupervised",
          "type_key": [
            "Full CV",
            "Programming",
            "Bioinformatics",
            "Academic"
          ]
        }
      ]
    },
    "Bioinformatics Domains": {
      "Genomics & Genome Assembly": [
        {
          "long_name": "FASTQC",
          "short_name": "FASTQC",
          "type_key": [
            "Full CV",
            "Bioinformatics",
            "Academic"
          ]
        }
      ]
    }
  }
}
```

#### Field Notes

- **Three-level hierarchy**: Unlike other sections, skills use a nested object structure
- **long_name**: Use for tooltips, modals, or detailed views
- **short_name**: Use for chip/badge display to save space
- **Navigation**: Top categories can serve as tabs/sections; subcategories as headers

---

### Experiences

**Description**: Professional work experience and roles

**Structure**: Array of experience entries

#### Schema

```typescript
{
  role?: string | null              // Job title/role
  institution?: string | null       // Company/Organization name
  location?: string | null          // Work location
  duration?: string | null          // Free-form duration string (e.g., "2018-02-11 - Recent")
  primaryFocus?: string | null      // Main area of focus/responsibility
  description?: string | null       // Detailed description of role
  startDate?: string | null         // ISO date (if parsed from duration)
  endDate?: string | null           // ISO date or "present"
  type_key?: string[] | null        // Filter tags
}
```

#### Example

```json
{
  "experiences": [
    {
      "role": "Full-stack Developer",
      "institution": "Freelance",
      "duration": "2018-02-11 - Recent",
      "description": "Developed and maintained diverse web applications, backend & frontend components, and automated data workflows."
    },
    {
      "role": "Bioinformatics Researcher - Master's Thesis",
      "institution": "University of Tehran",
      "duration": "2023-10-23 - 2024-09-15",
      "primaryFocus": "Omics-Based Analysis of Microbial Genomes/Fermentation and Bioprocessing",
      "description": "Performed bioinformatics analyses, gene expression profiling, functional annotation, and bioprocess optimization."
    }
  ]
}
```

#### Field Notes

- **duration**: Stored as free-form string; may need parsing for sorting/filtering
- **primaryFocus**: Optional one-line summary of main responsibilities
- **description**: Can be multi-sentence or bullet-point formatted

---

### Projects

**Description**: Portfolio projects, research work, and side projects

**Structure**: Array of project objects

#### Schema

```typescript
{
  title?: string | null              // Project title
  name?: string | null               // Alternative to title
  description?: string | null        // Project description
  highlights?: string[] | null       // Key achievements/features
  keywords?: string[] | null         // Technology tags
  startDate?: string | null          // Start date
  endDate?: string | null            // End date
  url?: string | null                // Project URL (GitHub, demo, etc.)
  roles?: string[] | null            // Roles in the project
  entity?: string | null             // Associated organization
  type?: string | null               // Project type
  type_key?: string[] | null         // Filter tags
}
```

#### Example

```json
{
  "projects": [
    {
      "title": "Integrated Omics Pipeline for Microbial Genomics",
      "description": "Developed a comprehensive pipeline integrating metagenomic, transcriptomic, and proteomic data for functional gene analysis and microbial community profiling.",
      "url": null,
      "type_key": [
        "Full CV",
        "Bioinformatics",
        "Academic"
      ]
    },
    {
      "title": "Policy Compliance Checker (Flask + React + SQLite)",
      "description": "Built a FReMP stack web application to upload dynamic security policies and user datasets (JSON/CSV), evaluate per-user compliance server-side, and present filterable/exportable pass/fail results with explanations in a React UI.",
      "url": "https://github.com/Raminyazdani/policy-compliance-checker",
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    }
  ]
}
```

#### Field Notes

- **url**: GitHub repository, live demo, or project website
- **Deduplication**: Check for duplicate entries with same title + url combination

---

### Publications

**Description**: Academic publications, papers, theses, book chapters, and conference presentations

**Structure**: Array of publication objects with comprehensive metadata

#### Schema

```typescript
{
  title?: string | null                      // Publication title
  authors?: string[] | null                  // Simple author list
  authors_structured?: Array<{               // Structured author information
    literal?: string | null                  // Full name or "et al."
    given?: string | null                    // First name
    family?: string | null                   // Last name
  }> | null
  type?: string | null                       // "Research Paper", "Book Chapter", "Master Thesis", "Review Article", etc.
  status?: string | null                     // "Published", "Submitted", "Waiting for Submission", "In Review"
  year?: number | null                       // Publication year
  month?: number | null                      // Publication month
  day?: number | null                        // Publication day
  date?: string | null                       // ISO date: "YYYY-MM-DD"
  journal?: string | null                    // Journal name
  volume?: string | null                     // Volume number
  issue?: string | null                      // Issue number
  pages?: string | null                      // Page range
  article_number?: string | null             // Article number (for online journals)
  doi?: string | null                        // Digital Object Identifier
  issn?: string | null                       // International Standard Serial Number
  isbn?: string | null                       // International Standard Book Number
  url?: string | null                        // Publication URL
  URL?: string | null                        // Alternative URL field
  publisher?: string | null                  // Publisher name
  conference?: string | null                 // Conference name
  degree_type?: string | null                // For theses: "Master's thesis", "PhD dissertation"
  institution?: string | null                // For theses: University name
  faculty?: string | null                    // Faculty/School name
  school?: string | null                     // Alternative to faculty
  correspondent?: string | null              // Corresponding author/supervisor
  supervisors?: string[] | null              // Thesis supervisors
  identifiers?: {                            // Collection of identifiers
    doi?: string | null
    isbn?: string | null
    issn?: string | null
    pmid?: string | null                     // PubMed ID
    pmcid?: string | null                    // PubMed Central ID
    arxiv?: string | null                    // ArXiv ID
  } | null
  type_key?: string[] | null                 // Filter tags
}
```

#### Example

```json
{
  "publications": [
    {
      "title": "Recent Advances in Conventional and Modern Waste Treatment Approaches",
      "authors": [
        "Ramin Yazdani",
        "et al."
      ],
      "authors_structured": [
        {
          "literal": "Ramin Yazdani"
        },
        {
          "literal": "et al."
        }
      ],
      "type": "Book Chapter",
      "status": "Published",
      "publisher": "Taylor & Francis",
      "isbn": "9781032528595",
      "url": "https://www.taylorfrancis.com/chapters/edit/10.1201/9781003441069-5/recent-advances-conventional-modern-wastewater-treatment-approaches-ramin-yazdani-sharareh-harirchi-mandana-lak-mojdeh-mirshafiei-seyed-ali-nojoumi-mohadasseh-ramezani-behnam-rasekh-fatemeh-yazdian",
      "correspondent": "Dr. Fatemeh Yazdian",
      "type_key": [
        "Full CV",
        "Biotechnology",
        "Academic",
        "Bioinformatics"
      ]
    },
    {
      "title": "Omics-Based Analysis and Gene Profiling to Identify Lactobacillus Strains for Modulating HDL/LDL Ratios in Pharmaceutical Applications",
      "authors": [
        "Ramin Yazdani"
      ],
      "type": "Master Thesis",
      "status": "Submitted",
      "year": 2024,
      "month": 9,
      "day": 15,
      "date": "2024-09-15",
      "degree_type": "Master's thesis",
      "institution": "University of Tehran",
      "faculty": "Faculty of New Sciences and Technologies",
      "school": "School of Life Science Engineering",
      "correspondent": "Dr. Mohammad Barshan Tashnizi",
      "supervisors": [
        "Dr. Mohammad Barshan Tashnizi",
        "Dr. Najaf Allahyari Fard"
      ],
      "type_key": [
        "Full CV",
        "Biotechnology",
        "Academic",
        "Bioinformatics"
      ]
    }
  ]
}
```

#### Field Notes

- **status**: Distinguish between published work and work-in-progress
- **authors vs authors_structured**: Both fields supported; structured format preferred
- **identifiers**: Consolidated object for all publication identifiers
- **type**: Determines citation format and display style

---

### References

**Description**: Professional references with contact information

**Structure**: Array of reference objects

#### Schema

```typescript
{
  name?: string | null                // Full name
  position?: string | null            // Job title
  department?: string | null          // Department name
  institution?: string | null         // Organization name
  location?: string | null            // Location
  email?: string[] | null             // Email addresses (array)
  phone?: Array<{                     // Phone numbers (array of objects)
    formatted?: string | null
    countryCode?: string | null
    number?: string | null
  }> | string | null
  URL?: string | null                 // URL to reference letter PDF
  type_key?: string[] | null          // Filter tags
}
```

#### Example

```json
{
  "references": [
    {
      "name": "Prof. Babak Khalili Hadad",
      "position": "Assistant Professor, Biochemist, Member of AAUP",
      "department": "Department of Biotechnology",
      "institution": "Islamic Azad University, Roudehen Branch",
      "location": "Roudehen, Iran",
      "email": [
        "Babakkhalili.hadad@ciu.edu.ge",
        "Ba.khalili@iau.ac.ir"
      ],
      "phone": null,
      "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530886/Reference_Babak__Khalili_Hadad_lb2rxf.pdf",
      "type_key": [
        "Full CV",
        "Biotechnology",
        "Academic",
        "Bioinformatics"
      ]
    },
    {
      "name": "Prof. Simin Nabizadeh",
      "position": "Assistant Professor, Faculty of Agriculture & Science",
      "department": "Department of Biotechnology",
      "institution": "Islamic Azad University, Roudehen Branch",
      "location": "Roudehen, Iran",
      "email": [
        "Nabizadeh_simin@gmail.com"
      ],
      "phone": [
        {
          "formatted": "+98 912 396 1780",
          "countryCode": "+98",
          "number": "9123961780"
        }
      ],
      "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530887/Reference_Simin_Nabizadeh_sf74hi.pdf",
      "type_key": [
        "Full CV",
        "Biotechnology",
        "Academic",
        "Bioinformatics"
      ]
    }
  ]
}
```

#### Field Notes

- **email**: Array to support multiple email addresses
- **phone**: Array of phone objects OR string (legacy support)
- **URL**: Link to reference letter PDF (optional)
- **Privacy**: Consider hiding contact details behind user interaction in public view

---

## Common Patterns

### Optional Fields

All fields in all schemas are **optional** (marked with `?` in TypeScript). This ensures:
- Application doesn't crash on missing data
- Partial CVs can be rendered
- Easy to add new fields without breaking existing data

### Arrays vs Single Values

Some fields accept both arrays and single values for flexibility:
- `basics.label`: `string | string[]`
- `basics.location`: Can be single object or array
- `reference.phone`: Can be array of objects or string (legacy)

### URL Fields

Various sections include URL fields for external resources:
- Profile links
- Institution websites
- Project demos/repositories
- Certificate PDFs
- Reference letter PDFs
- Publication DOIs

Always validate URLs and open in new tabs with security attributes.

---

## Type Key System

### Purpose

The `type_key` array enables **dynamic content filtering** to create different CV views:
- **Full CV**: Show everything
- **Academic**: Research, publications, academic projects
- **Programming**: Software development projects, programming skills
- **Biotechnology**: Lab techniques, biotechnology projects
- **Bioinformatics**: Computational biology, genomics

### Structure

`type_key` is an array of strings:

```typescript
type_key?: string[] | null
```

### Common Values

- `"Full CV"` — Appears in most entries (baseline)
- `"Academic"` — Academic achievements, research, publications
- `"Programming"` — Software development, coding projects
- `"Biotechnology"` — Lab work, bioprocess engineering
- `"Bioinformatics"` — Computational biology, data analysis
- `"Student Projects"` — Educational/learning projects

### Filter Logic

```typescript
// Pseudo-code for filtering
function shouldDisplay(entry, selectedFilter) {
  if (selectedFilter === "Full CV") {
    return true; // Show all entries
  }
  return entry.type_key?.includes(selectedFilter) ?? true;
}
```

### Example Usage

```json
{
  "education": [
    {
      "institution": "University of Tehran",
      "area": "Biotechnology",
      "type_key": [
        "Full CV",
        "Biotechnology",
        "Academic",
        "Bioinformatics",
        "Programming"
      ]
    }
  ]
}
```

This education entry appears in:
- Full CV view
- Biotechnology-focused CV
- Academic CV
- Bioinformatics CV
- Programming CV

### Sections with type_key

- ✅ Education
- ✅ Workshop and Certifications (nested in certification items)
- ✅ Skills (nested in skill items)
- ✅ Experiences
- ✅ Projects
- ✅ Publications
- ✅ References

**Note**: `basics`, `profiles`, and `languages` typically don't use `type_key` as they appear in all CV versions.

---

## Pictures Structure

### Purpose

The `Pictures` array in the `basics` section supports **profile photos** and **cover/banner images**.

### Schema

```typescript
Pictures?: Array<{
  type_of: string    // "profile" | "cover"
  URL: string        // Full image URL
}> | null
```

### Expected Types

1. **profile**: Circular/square profile photo
   - Displayed prominently in hero section
   - Used as avatar throughout application
   - Recommended: Square aspect ratio (1:1), minimum 400×400px

2. **cover**: Wide banner/cover image
   - Displayed as background in hero section
   - Recommended: Wide aspect ratio (16:9 or 4:1), minimum 1600×400px

### Example

```json
{
  "Pictures": [
    {
      "type_of": "profile",
      "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1748294454/IMG_9262_wioxcp_c_pad_w_720_jjmvxi.jpg"
    },
    {
      "type_of": "cover",
      "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/c_crop,w_1200,h_900,ar_4:3,g_auto/v1748294940/IMG_5283_1200x1800_a2wxn9_c_pad_b_gen_fill_w_1600_h_400_1_lnwatm.jpg"
    }
  ]
}
```

### Handling Missing Pictures

```typescript
// Robust rendering
const profilePic = basics.Pictures?.find(p => p.type_of === "profile")?.URL;
const coverPic = basics.Pictures?.find(p => p.type_of === "cover")?.URL;

if (!profilePic) {
  // Use default avatar or initials
}
if (!coverPic) {
  // Use default gradient background
}
```

---

## Media URL Handling

### Media Types

The application handles various media types throughout the JSON:

1. **Images**
   - Profile pictures (`.jpg`, `.png`, `.webp`)
   - Cover images
   - Project screenshots (future)

2. **PDFs**
   - Certificate PDFs (`workshop_and_certifications[].certifications[].URL`)
   - Language test certificates (`languages[].certifications[].URL`)
   - Reference letters (`references[].URL`)
   - Publication PDFs

3. **External Links**
   - GitHub repositories
   - Live project demos
   - Publication DOIs

### URL Patterns

#### Cloudinary URLs (Primary)

Most media is hosted on Cloudinary CDN:

```
https://res.cloudinary.com/dgflx4rum/image/upload/v1748294454/filename.jpg
https://res.cloudinary.com/dgflx4rum/image/upload/v1749530886/certificate_name.pdf
```

**Features**:
- Automatic format conversion (WebP for browsers that support it)
- On-the-fly transformations (resize, crop, optimize)
- Fast global CDN delivery

#### Cloudinary Transformations

Example transformations in URLs:
- `/c_crop,w_1200,h_900/` — Crop to 1200×900
- `/c_pad,w_720/` — Pad to 720px width
- `/ar_4:3,g_auto/` — Aspect ratio 4:3, auto-gravity crop

### Thumbnail Generation

For PDFs and large images, generate thumbnails:

```typescript
function getThumbnailUrl(url: string, width = 200): string {
  if (url.includes('cloudinary.com')) {
    // Insert transformation before version
    return url.replace('/upload/', `/upload/w_${width},c_fit/`);
  }
  return url; // Return original for non-Cloudinary URLs
}
```

### Security

- All external URLs should be sanitized
- Open in new tab: `target="_blank" rel="noopener noreferrer"`
- Validate URL format before rendering

### Fallbacks

```typescript
function getMediaType(url: string): 'image' | 'pdf' | 'link' {
  const ext = url.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) return 'image';
  if (ext === 'pdf') return 'pdf';
  return 'link';
}
```

---

## Date Formats

### Standard Format

**ISO 8601**: `YYYY-MM-DD`

```json
{
  "startDate": "2021-09-22",
  "endDate": "2024-09-15"
}
```

### Special Values

1. **"present"** — For ongoing items
   ```json
   {
     "endDate": "present"
   }
   ```
   Display as: "Present" or "Current"

2. **null** — For unknown/not applicable dates
   ```json
   {
     "endDate": null
   }
   ```

### Date-like Strings

Some sections use free-form duration strings:

```json
{
  "duration": "2018-02-11 - Recent"
}
```

These should be displayed as-is or parsed if possible.

### Invalid Dates

**Problem**: JSON may contain invalid dates like `"2020-9-31"` (September has only 30 days)

**Solution**:
1. Attempt to parse date
2. If parse fails, display original string or "Invalid Date"
3. Set `date_parse_error: true` flag when normalizing data
4. Never crash on invalid dates

```typescript
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  if (dateStr === 'present') return 'Present';
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // Invalid date
    return dateStr; // Return original string
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```

### Date Components

Publications support separate year/month/day fields:

```json
{
  "year": 2024,
  "month": 9,
  "day": 15,
  "date": "2024-09-15"
}
```

Prefer using the composite `date` field when available.

---

## Validation Rules

### Required vs Optional

**All fields are optional** at the schema level, but certain fields are **practically required** for meaningful display:

#### Basics
- At least one of: `fname + lname` OR `name`
- `email` (for contact)

#### Education
- `institution`
- `studyType` or `area`

#### Projects
- `title` OR `name`

#### Publications
- `title`
- `authors` OR `authors_structured`

### Type Validation

```typescript
// Example validation for a publication
function validatePublication(pub: Publication): string[] {
  const errors: string[] = [];
  
  if (!pub.title) {
    errors.push('Missing title');
  }
  
  if (!pub.authors && !pub.authors_structured) {
    errors.push('Missing authors');
  }
  
  if (pub.year && (pub.year < 1900 || pub.year > new Date().getFullYear() + 1)) {
    errors.push('Invalid year');
  }
  
  return errors;
}
```

### URL Validation

```typescript
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

### Email Validation

```typescript
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## Best Practices

### 1. Always Check for Null/Undefined

```typescript
// ✅ Good
const city = basics.location?.[0]?.city ?? 'Unknown';

// ❌ Bad
const city = basics.location[0].city; // Will crash if location is null
```

### 2. Provide Fallbacks

```typescript
// Display logic with fallbacks
const displayName = basics.name ?? `${basics.fname} ${basics.lname}`;
const email = basics.email ?? 'No email provided';
```

### 3. Handle Arrays Gracefully

```typescript
// Skills can be array or object
if (Array.isArray(cvData.skills)) {
  // Legacy format
} else if (typeof cvData.skills === 'object') {
  // Current nested format
}
```

### 4. Sanitize User Input

Even though this is a static JSON, sanitize data when rendering:

```typescript
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(basics.summary || '');
```

### 5. Optimize Images

Use responsive images with Cloudinary transformations:

```typescript
function getResponsiveImageUrl(url: string): string {
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_auto/');
}
```

### 6. Type Safety

Always use TypeScript interfaces from `src/types/cv.ts` when working with CV data:

```typescript
import { Education, Basics, Project } from '@/types/cv';

function EducationCard({ edu }: { edu: Education }) {
  // TypeScript ensures you only access valid fields
}
```

---

## Migration Notes

### From Legacy Format

If migrating from older CV JSON formats:

1. **Nested Basics**: Old format may have `basics` as object; new format uses array
   ```typescript
   const basicsArray = Array.isArray(cvData.basics) 
     ? cvData.basics 
     : [cvData.basics];
   ```

2. **Skills Structure**: Old format may use flat skill arrays; new format uses nested objects
   ```typescript
   if (Array.isArray(cvData.skills)) {
     // Convert to nested format
   }
   ```

3. **ORCHID vs ORCID**: Normalize typo variants
   ```typescript
   const normalized = profile.network === 'ORCHID' ? 'ORCID' : profile.network;
   ```

---

## Future Enhancements

Planned additions to the schema:

1. **Volunteering Section**
   ```json
   {
     "volunteering": [
       {
         "organization": "...",
         "role": "...",
         "startDate": "...",
         "endDate": "...",
         "description": "...",
         "type_key": [...]
       }
     ]
   }
   ```

2. **Awards Section**
   ```json
   {
     "awards": [
       {
         "title": "...",
         "issuer": "...",
         "date": "...",
         "description": "...",
         "type_key": [...]
       }
     ]
   }
   ```

3. **Patents**
4. **Conference Presentations**
5. **Teaching Experience**

---

## Conclusion

This schema provides a comprehensive, flexible structure for CV data that:
- ✅ Supports multiple languages (same structure, different content)
- ✅ Enables dynamic filtering via `type_key`
- ✅ Handles incomplete/missing data gracefully
- ✅ Supports rich media (images, PDFs)
- ✅ Maps cleanly to TypeScript interfaces
- ✅ Scales from minimal to comprehensive CVs

For implementation details, see the TypeScript interfaces in `src/types/cv.ts` and the React components in `src/components/sections/`.
