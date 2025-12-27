# Education Section - Design Specification

## Information Architecture

The Education section displays academic credentials in reverse chronological order (newest first) with filtering capabilities by domain tags.

**Visual Hierarchy:**
1. Section header with icon + title + description
2. Filter controls (chips with counts)
3. Timeline visualization (desktop) / stacked cards (mobile)
4. Individual education cards containing:
   - Institution name (prominent)
   - Degree type + field of study
   - Location
   - Date range
   - GPA (if available)
   - Domain tags (type_key)
   - Optional: Institution logo

## Components

### Layout Components
- **Section Container**: Full-width section with centered content (max-w-6xl)
- **Header Block**: Centered title with decorative icon badge
- **Filter Bar**: Horizontal chip group with active state
- **Timeline Decorator**: Vertical line with dots (desktop only)

### Card Components
- **Education Card** (shadcn Card):
  - Hover state: lift + shadow expansion
  - Logo placeholder: 64x64 rounded square
  - Responsive grid: icon + content on desktop, stack on mobile
  
### Interactive Elements
- **Filter Chips** (shadcn Button):
  - Default state: outline variant
  - Active state: default (filled) variant
  - Count badges on each chip
  - Keyboard navigable
  
### Typography
- Section title: text-4xl font-bold
- Institution name: text-xl (CardTitle)
- Degree/field: text-sm font-medium
- Meta info: text-sm text-muted-foreground
- Tags: text-xs (Badge)

### Icons (Phosphor)
- Section icon: GraduationCap (duotone, 32px in badge)
- Location: MapPin (fill, 14px)
- Date: Calendar (fill, 14px)
- GPA: TrendUp (bold, 16px, primary color)

## Responsive Behavior

### Desktop (≥768px)
- Timeline visible: vertical line on left with connector dots
- Cards positioned with left padding (pl-20)
- Filter chips wrap naturally
- Logo displays beside content

### Tablet (640px–767px)
- Timeline hidden
- Cards full width, no left padding
- Logo remains visible
- Filter chips may scroll horizontally

### Mobile (<640px)
- Simplified single-column layout
- Logo optional or smaller
- Section padding reduced
- Filter chips scroll with snap points (overflow-x-auto)
- Typography scales down slightly
- Touch targets remain 44px minimum

## Accessibility Checklist

- [x] Semantic HTML: `<section>` with `aria-labelledby`
- [x] Heading hierarchy: H2 for section, H3 for cards (CardTitle)
- [x] Keyboard navigation: All filter chips focusable and operable
- [x] Focus indicators: Visible outline on filter buttons
- [x] Screen reader labels: Image alt text for logos
- [x] Color contrast: All text meets WCAG AA (4.5:1 minimum)
- [x] Descriptive text: Empty states explain why no content appears
- [x] Interactive feedback: Active filter visually distinct
- [x] No info conveyed by color alone: Active state uses fill + border change

## Edge Cases & Empty States

### Missing Data
- **No education entries**: Show centered icon + message "No education history available"
- **No institution name**: Display "Unknown Institution"
- **No dates**: Omit date line entirely
- **No GPA**: Hide GPA row
- **No location**: Hide location line
- **No logo_url**: Hide logo container (no placeholder)
- **No type_key**: Hide tag row

### Filter States
- **No matches**: Show "No education entries match the selected filter" + clear button
- **Single tag**: Hide filter bar entirely if only "Full CV" or <2 unique tags exist
- **"Full CV" tag**: Always excluded from display (internal use)

### Date Handling
- **"present" string**: Display as "Present"
- **Invalid date format**: Display raw string as fallback
- **Missing end date**: Default to "Present"
- **Missing start date**: Display end date only or omit date line

### Responsive Edge Cases
- **Long institution names**: Wrap naturally with break-words
- **Many tags**: Wrap into multiple rows
- **Very long degree titles**: Wrap naturally within card
- **Missing filter interaction**: Default to "All" always shown

## Privacy Considerations

### Public by Default
- Education history is typically public on CVs
- No sensitive data expected in this section
- Institution names, dates, GPAs are standard resume content

### Optional Gating
- Could add toggle to hide GPA scores if user prefers
- Could filter entries by type_key to show only certain credentials
- Logo URLs are external (Cloudinary) - no privacy concern

### Recommendations
- Do not display birthDate in this section
- If adding thesis titles, provide expand/collapse to avoid verbosity
- References to advisors should go in References section, not here

---

## JSON Output

```json
[
  {
    "institution": "Saarland University",
    "location": "Saarbrücken, Germany",
    "area": "Bioinformatics",
    "studyType": "Master's",
    "startDate": "2024-10-20",
    "endDate": "present",
    "gpa": null,
    "logo_url": null,
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
    "logo_url": null,
    "type_key": [
      "Full CV",
      "Biotechnology",
      "Academic",
      "Bioinformatics",
      "Programming"
    ]
  },
  {
    "institution": "Islamic Azad University, Roudehen Branch",
    "location": "Roudehen, Iran",
    "area": "Biotechnology",
    "studyType": "Bachelor's",
    "startDate": "2017-09-23",
    "endDate": "2021-07-22",
    "gpa": "17.13 / 20.00",
    "logo_url": null,
    "type_key": [
      "Full CV",
      "Biotechnology",
      "Academic",
      "Bioinformatics",
      "Programming"
    ]
  },
  {
    "institution": "Karaj Soltani 1 School",
    "location": "Karaj, Iran",
    "area": "Natural Sciences",
    "studyType": "Pre-University",
    "startDate": "2014-09-23",
    "endDate": "2015-09-22",
    "gpa": "13.36 / 20.00",
    "logo_url": null,
    "type_key": [
      "Full CV",
      "Biotechnology",
      "Academic",
      "Bioinformatics"
    ]
  },
  {
    "institution": "Karaj Soltani 1 School",
    "location": "Karaj, Iran",
    "area": "Natural Sciences",
    "studyType": "High School",
    "startDate": "2011-09-23",
    "endDate": "2014-06-22",
    "gpa": "18.50 / 20.00",
    "logo_url": null,
    "type_key": [
      "Full CV",
      "Biotechnology",
      "Academic",
      "Bioinformatics"
    ]
  }
]
```
