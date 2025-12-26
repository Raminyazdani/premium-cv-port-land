# RTL Support Implementation

## Overview
This implementation adds comprehensive Right-to-Left (RTL) language support for Farsi/Persian to the CV website.

## Features Implemented

### 1. Language Manager (`src/lib/languageManager.ts`)
- Manages language state (English, Farsi, German)
- Persists language preference to localStorage
- Applies appropriate `dir` and `lang` attributes to HTML root
- Exports utility functions for language detection and direction

### 2. Language Selector Component (`src/components/LanguageSelector.tsx`)
- Dropdown menu for language selection
- Shows native labels (e.g., "فارسی" for Farsi)
- Visual indicator for currently selected language
- Accessible with keyboard navigation

### 3. RTL Stylesheet (`src/styles/rtl.css`)
- Comprehensive CSS rules for RTL layout
- Flips margins, paddings, and flex directions
- Mirrors directional icons and arrows
- Adjusts text alignment for all sections
- Preserves accessibility and usability

### 4. Integration
- Language selector added to Header component (desktop and mobile)
- RTL styles imported in `index.css`
- Language initialized on app load in `main.tsx`

## Usage

### Switching Languages
1. Click the language selector icon (🌐) in the header
2. Select desired language from dropdown
3. The page will immediately apply RTL layout for Farsi or LTR for English/German

### Verifying RTL Mode
When Farsi is selected:
- HTML root element has `dir="rtl"` and `lang="fa"`
- Text aligns to the right
- Navigation flows right-to-left
- Profile photo appears on the right side
- Skills chips flow right-to-left
- All directional elements are mirrored

## Technical Details

### Logical Properties
Where possible, the implementation uses CSS logical properties:
- `margin-inline-start` instead of `margin-left`
- `padding-inline-end` instead of `padding-right`
- `border-start-start-radius` instead of `border-top-left-radius`

### Icon Mirroring
Directional icons (arrows, carets) are automatically flipped using `transform: scaleX(-1)` to maintain intuitive navigation.

### Component Support
All major sections are RTL-aware:
- Header navigation
- Hero section
- Education timeline
- Experience cards
- Skills section
- Projects grid
- Publications list
- Footer

## Testing Checklist

✓ Switch to Farsi language - inspect HTML root has `dir="rtl"` and `lang="fa"`
✓ Header navigation aligns right
✓ Profile photo appears on right side in hero
✓ Text alignment is right for all paragraphs
✓ Skills section: categories and chips flow right-to-left
✓ No layout breakage (overlaps, cutoffs, or misalignments)
✓ All buttons and interactive elements remain accessible
✓ Dropdown menus open correctly
✓ Mobile navigation works properly in RTL mode

## Browser Compatibility
Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements
- Add more language options if needed
- Implement full translation system (i18n)
- Add language-specific fonts for better typography
- Consider automatic language detection based on browser settings
