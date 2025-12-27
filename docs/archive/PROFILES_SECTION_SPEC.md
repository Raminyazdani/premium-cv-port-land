# Profiles Section - Design Specification

## Information Architecture

The profiles section displays social and professional network profiles in a horizontal icon row with the following order of priority:

1. **Professional Networks** (highest priority)
   - LinkedIn
   - GitHub

2. **Academic/Research Networks**
   - Google Scholar
   - ORCID

3. **Other Networks**
   - Any additional profiles (displayed after academic networks)

Each profile entry consists of:
- Network name (e.g., "GitHub", "LinkedIn")
- Username (optional display)
- Profile URL (required for rendering)
- Unique identifier (optional, e.g., ORCID ID, Scholar ID)

## Components

### Primary Components

1. **ProfilesSection** (Main Container)
   - Full-width section with background color to separate from hero
   - Centered content container (max-w-6xl)
   - Section heading: "Connect With Me"
   - Flexbox grid of profile links

2. **ProfileLink** (Individual Profile Card)
   - Icon button with network-specific icon
   - Tooltip showing network name and username
   - Dropdown menu with additional actions (copy link)
   - Hover effects: scale, border color change, background tint

3. **Icon Mapping System**
   - GitHub → GithubLogo (filled)
   - LinkedIn → LinkedinLogo (filled)
   - Google Scholar / Scholar → GraduationCap (filled)
   - ORCID / ORCHID → IdentificationBadge (filled)
   - Default/Unknown → Globe (filled)

### Supporting Components

1. **Tooltip** (Shadcn)
   - Shows on hover/focus
   - Displays: "{Network} @{username}"
   - 300ms delay before showing
   - Dark background with white text

2. **DropdownMenu** (Shadcn)
   - Triggered by three-dot icon button
   - Single menu item: "Copy link"
   - Visual feedback when copied (checkmark icon)
   - Aligned to the right edge

3. **Button** (Shadcn)
   - Variant: "outline" for profile icons
   - Variant: "ghost" for dropdown trigger
   - Size: "icon" (40x40px minimum for touch targets)

## Responsive Behavior

### Desktop (≥1024px)
- Profiles displayed in a single horizontal row
- Icon buttons: 40x40px
- Gap between items: 12px
- All profiles visible at once
- Hover states: Scale to 105%, border color shifts to primary

### Tablet (768px - 1023px)
- Same as desktop but may wrap to two rows if many profiles
- Centered alignment maintained
- Slightly reduced gaps: 10px

### Mobile (<768px)
- Profiles wrap to multiple rows as needed
- Icon buttons remain 40x40px (touch-friendly)
- Centered alignment
- Tooltips still functional on long-press
- Dropdown menu accessible on tap

## Accessibility Checklist

- ✅ **Semantic HTML**: Section uses `<section>` with `aria-labelledby`
- ✅ **Heading hierarchy**: H2 for section title
- ✅ **ARIA labels**: Each profile link has descriptive `aria-label`
- ✅ **rel attributes**: Links include `rel="me noopener noreferrer"`
- ✅ **Keyboard navigation**: 
  - Tab through profile links
  - Enter/Space to activate
  - Escape to close dropdown
- ✅ **Focus indicators**: Visible focus ring on all interactive elements
- ✅ **Touch targets**: Minimum 44x44px for mobile
- ✅ **Screen reader support**: 
  - Tooltips announced on focus
  - Menu items properly labeled
  - Copy action provides feedback via toast
- ✅ **Color contrast**: 
  - Icon buttons meet WCAG AA (4.5:1 minimum)
  - Hover states maintain contrast
- ✅ **Motion sensitivity**: No auto-playing animations; all transitions under 400ms

## Edge Cases & Empty States

### No Profiles Available
```
Display:
┌────────────────────────────────────────┐
│  Professional Profiles                 │
│  No profiles available                 │
└────────────────────────────────────────┘
```
- Section renders with empty state message
- No error thrown
- Maintains consistent spacing

### Missing URL
- Profile entry is silently omitted from rendering
- No broken links displayed
- Validates `profile.url` before rendering

### Unknown Network
- Uses Globe icon as fallback
- Network name displayed as-is in tooltip
- Still functional as a link

### Network Name Normalization
- "ORCHID" → normalized to "ORCID" (common misspelling)
- "Google Scholar" and "Scholar" → both use GraduationCap icon
- Case-insensitive matching

### Copy Action Failures
- If clipboard API unavailable, uses fallback (document.execCommand)
- If both fail, shows error toast
- Never crashes the component

### Invalid/Malformed URLs
- Validated by `profile.url` existence check
- Malformed URLs handled by browser (may fail to load)
- Component remains stable

## Privacy Considerations

### Public by Default
- All profiles shown in JSON are displayed publicly
- No sensitive data stored in profiles (only public profile URLs)

### Optional Control (Future Enhancement)
- Could add toggle to show/hide individual networks
- Could gate certain profiles behind "Show all" button
- Would use component state to manage visibility

### Data Handling
- Profile URLs treated as public information
- No authentication required to view
- No analytics or tracking added by default
- `rel="noopener noreferrer"` prevents referrer leakage

### SEO Benefits
- `rel="me"` enables identity verification (IndieAuth, Mastodon)
- Supports schema.org `sameAs` for Person structured data
- Helps search engines consolidate identity across platforms

## SEO & Structured Data

### Recommended Implementation
Add to page `<head>` or structured data script:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ramin Yazdani",
  "sameAs": [
    "https://github.com/Raminyazdani",
    "https://linkedin.com/in/ramin-yz/",
    "https://scholar.google.com/citations?user=PIKk-q0AAAAJ",
    "https://orcid.org/0000-0002-7996-5475"
  ]
}
```

This enables:
- Google Knowledge Panel consolidation
- Profile verification on social platforms
- Enhanced search result snippets

## Normalized JSON Output

```json
[
  {
    "network": "GitHub",
    "network_normalized": "github",
    "username": "Raminyazdani",
    "url": "https://github.com/Raminyazdani",
    "uuid": null
  },
  {
    "network": "Google Scholar",
    "network_normalized": "google scholar",
    "username": "Ramin Yazdani",
    "url": "https://scholar.google.com/citations?user=PIKk-q0AAAAJ&hl=en",
    "uuid": "PIKk-q0AAAAJ"
  },
  {
    "network": "LinkedIn",
    "network_normalized": "linkedin",
    "username": "ramin-yz",
    "url": "https://linkedin.com/in/ramin-yz/",
    "uuid": null
  },
  {
    "network": "ORCHID",
    "network_normalized": "orcid",
    "username": "Ramin Yazdani",
    "url": "https://orcid.org/0000-0002-7996-5475",
    "uuid": null
  }
]
```

### Data Normalization Rules Applied

1. **Preserved original network names** in `network` field
2. **Added `network_normalized`** field with lowercased, trimmed values
3. **Corrected spelling variants**: "ORCHID" → "orcid" (normalized only)
4. **Ensured required fields**: All entries have `network`, `username`, `url`
5. **Set null for missing fields**: `uuid` is null when not provided
6. **No invented data**: All values from source JSON preserved faithfully

## Implementation Notes

- Component is **stateless** except for copy button feedback
- Profile data loaded from centralized CV JSON via `getCVData()`
- Icons imported from `@phosphor-icons/react` (already installed)
- Sorting done at render time (pure function)
- No network requests or external dependencies
- Fully SSR-compatible if needed in future
