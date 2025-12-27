# QA Testing Checklist - CV Portfolio Website

## Document Information
- **Project**: Ramin Yazdani - Portfolio & CV Website
- **Version**: 1.0
- **Last Updated**: 2025-01-20
- **Test Environment**: Chrome, Firefox, Safari, Edge (latest versions)

---

## 1. FEATURE TESTING

### 1.1 Language Switching
- [ ] **EN → DE**: Switch from English to German
  - [ ] Header navigation labels change to German
  - [ ] All section headings translate correctly
  - [ ] Hero section content (name, labels, summary) displays German text
  - [ ] Education/Experience descriptions are in German
  - [ ] Footer text translates
  - [ ] **Expected**: All text content changes, URLs remain same
  
- [ ] **EN → FA**: Switch from English to Farsi
  - [ ] HTML root gets `dir="rtl"` attribute
  - [ ] HTML root gets `lang="fa"` attribute
  - [ ] Layout mirrors (profile photo moves to right)
  - [ ] Text alignment becomes right-aligned
  - [ ] Navigation aligns to right side
  - [ ] All content in Farsi/Persian script
  - [ ] **Expected**: Complete RTL layout transformation
  
- [ ] **FA → EN**: Return from Farsi to English
  - [ ] HTML root `dir` changes back to `ltr`
  - [ ] Layout returns to LTR orientation
  - [ ] All content back in English
  - [ ] **Expected**: No visual artifacts from RTL mode

- [ ] **Persistence**: Refresh page after language change
  - [ ] Selected language persists from localStorage
  - [ ] **Expected**: Same language on reload

- [ ] **All sections render**: Verify each section displays in all 3 languages
  - [ ] Basics/Hero
  - [ ] Profiles
  - [ ] Education
  - [ ] Languages
  - [ ] Certifications
  - [ ] Skills
  - [ ] Experience
  - [ ] Projects
  - [ ] Publications
  - [ ] References

---

### 1.2 Theme Switching
- [ ] **Theme Selector Visible**: Dropdown/selector in header works
  - [ ] Click opens dropdown with 6 options
  - [ ] Keyboard navigation works (Arrow keys, Enter to select)
  
- [ ] **Normal Theme**:
  - [ ] Professional, neutral color scheme
  - [ ] Good contrast ratios
  - [ ] Clean, readable typography

- [ ] **Academic Theme**:
  - [ ] Serif fonts applied (Georgia, serif)
  - [ ] Traditional academic styling
  - [ ] Muted, scholarly colors

- [ ] **Apple-like Theme**:
  - [ ] Modern, minimalist aesthetic
  - [ ] Clean whites/grays
  - [ ] San Francisco-style fonts (if available)

- [ ] **Dark Theme**:
  - [ ] Dark background (near black)
  - [ ] Light text (near white)
  - [ ] Sufficient contrast (4.5:1 minimum)
  - [ ] All sections readable

- [ ] **Bright Theme**:
  - [ ] High-energy, vibrant colors
  - [ ] Maintains readability
  - [ ] Appropriate for portfolio showcase

- [ ] **Futuristic Theme**:
  - [ ] Modern, tech-forward styling
  - [ ] Unique color palette
  - [ ] Distinctive visual identity

- [ ] **Theme Persistence**:
  - [ ] Refresh page - theme persists
  - [ ] Check localStorage has theme value
  - [ ] **Expected**: Same theme on reload

- [ ] **Theme Transitions**:
  - [ ] Smooth color transitions (CSS transitions)
  - [ ] No flash of unstyled content
  - [ ] All UI elements update immediately

---

### 1.3 Focus Filtering (type_key)
- [ ] **Filter Dropdown Visible**: In header, shows current focus
  
- [ ] **"Full CV" Selected**:
  - [ ] All education entries visible
  - [ ] All skills categories visible
  - [ ] All projects visible
  - [ ] All certifications visible
  - [ ] All publications visible
  - [ ] Count matches total JSON entries

- [ ] **"Programming" Selected**:
  - [ ] Only entries with "Programming" in type_key show
  - [ ] Education: filters correctly
  - [ ] Skills: only Programming-related skills
  - [ ] Projects: only Programming projects
  - [ ] Certifications: only Programming certs
  - [ ] Publications: only Programming pubs
  - [ ] References: filters if applicable

- [ ] **"Biotechnology" Selected**:
  - [ ] Only Biotechnology-tagged entries show
  - [ ] Verify across all sections

- [ ] **"Academic" Selected**:
  - [ ] Only Academic-tagged entries show
  - [ ] Verify across all sections

- [ ] **"Bioinformatics" Selected**:
  - [ ] Only Bioinformatics-tagged entries show
  - [ ] Verify across all sections

- [ ] **Filter Persistence**:
  - [ ] Refresh page - filter persists
  - [ ] Check localStorage
  - [ ] **Expected**: Same filter on reload

- [ ] **Empty States**:
  - [ ] Select filter with no matching entries in a section
  - [ ] Section shows "No items match this filter" or hides gracefully
  - [ ] **Expected**: No crash, graceful handling

---

### 1.4 Modal Interactions (Media Gallery)
- [ ] **Open Modal**:
  - [ ] Click image thumbnail - modal opens
  - [ ] Click PDF thumbnail - modal opens with PDF viewer/link
  - [ ] Modal has overlay (semi-transparent)
  - [ ] Modal content centered on screen

- [ ] **Close Modal**:
  - [ ] Click X button - modal closes
  - [ ] Press ESC key - modal closes
  - [ ] Click outside modal content (on overlay) - modal closes
  - [ ] **Expected**: Modal disappears, focus returns to trigger element

- [ ] **Focus Trap**:
  - [ ] Tab key cycles through modal elements only
  - [ ] Cannot tab to background page elements
  - [ ] Shift+Tab reverse cycles
  - [ ] **Expected**: Focus stays in modal

- [ ] **Image Display**:
  - [ ] Profile photo opens in modal at full size
  - [ ] Cover image opens in modal at full size
  - [ ] Publication images (if any) open correctly
  - [ ] **Expected**: Clear, full-resolution images

- [ ] **PDF Display**:
  - [ ] Certificate PDFs open in modal iframe OR new tab
  - [ ] Reference letter PDFs open correctly
  - [ ] Download/View buttons work
  - [ ] **Expected**: PDFs viewable or downloadable

- [ ] **Keyboard Navigation in Modal**:
  - [ ] Tab to all interactive elements
  - [ ] Enter/Space activate buttons
  - [ ] Arrow keys (if gallery) navigate images
  - [ ] **Expected**: Full keyboard accessibility

- [ ] **Multiple Media**:
  - [ ] If modal shows multiple items, navigation works
  - [ ] Next/Previous buttons function
  - [ ] **Expected**: Smooth navigation between items

---

### 1.5 Form Submissions (Contact Form)
- [ ] **Form Visible**: Contact form renders on page

- [ ] **Field Validation**:
  - [ ] Leave Name empty - submit shows error
  - [ ] Leave Email empty - submit shows error
  - [ ] Enter invalid email (no @) - shows error
  - [ ] Leave Message empty - submit shows error
  - [ ] **Expected**: Client-side validation prevents submission

- [ ] **Submit Placeholder**:
  - [ ] Fill all fields correctly
  - [ ] Click Submit
  - [ ] Alert/Message shows: "Backend not implemented yet"
  - [ ] Form does NOT actually send email (no backend)
  - [ ] **Expected**: User informed gracefully

- [ ] **Accessibility**:
  - [ ] All fields have visible labels
  - [ ] Error messages are associated with fields (aria-describedby)
  - [ ] Tab through form - logical order
  - [ ] **Expected**: Screen reader friendly

---

### 1.6 PDF Export (Print)
- [ ] **Export Button Visible**: In footer, labeled clearly

- [ ] **Click Export**:
  - [ ] Browser print dialog opens
  - [ ] **Expected**: Native print UI appears

- [ ] **Print Preview**:
  - [ ] Header hidden in preview
  - [ ] Footer hidden in preview
  - [ ] Theme switcher hidden
  - [ ] Language switcher hidden
  - [ ] Focus filter hidden
  - [ ] Content formatted for A4/Letter page
  - [ ] No awkward page breaks mid-section
  - [ ] **Expected**: Clean, print-optimized layout

- [ ] **Save as PDF**:
  - [ ] Use print dialog "Save as PDF"
  - [ ] Download PDF
  - [ ] Open PDF - content readable
  - [ ] All sections present
  - [ ] **Expected**: Usable PDF CV

- [ ] **Print Stylesheet**:
  - [ ] Check `print.css` or `@media print` rules exist
  - [ ] Verify color contrast sufficient for B&W printing
  - [ ] **Expected**: Professional printed output

---

## 2. DEVICE & PLATFORM TESTING

### 2.1 Mobile (< 640px)
- [ ] **iPhone SE (375×667)**:
  - [ ] Header: Hamburger menu appears
  - [ ] Navigation: Tap hamburger - menu opens
  - [ ] Hero: Content stacks vertically
  - [ ] Profile photo: Appropriate size, not cut off
  - [ ] Text readable (min 14px)
  - [ ] Touch targets ≥ 44×44px
  - [ ] No horizontal scroll
  - [ ] All sections accessible via scroll
  - [ ] **Expected**: Fully functional mobile experience

- [ ] **iPhone 12 Pro (390×844)**:
  - [ ] Same tests as iPhone SE
  - [ ] Notch area: No content obscured
  - [ ] Safe area insets respected

- [ ] **Samsung Galaxy S21 (360×800)**:
  - [ ] Same tests as above
  - [ ] Android Chrome rendering correct

- [ ] **Mobile Interactions**:
  - [ ] Tap language switcher - dropdown works
  - [ ] Tap theme switcher - dropdown works
  - [ ] Tap filter - dropdown works
  - [ ] Swipe to scroll - smooth, no jank
  - [ ] Pinch to zoom - works (if not disabled)

---

### 2.2 Tablet (640px - 1024px)
- [ ] **iPad (768×1024)**:
  - [ ] Layout adjusts between mobile and desktop
  - [ ] Skills grid: 2 columns (or adaptive)
  - [ ] Navigation: Full nav or condensed
  - [ ] Content readable, well-spaced
  - [ ] Touch targets appropriate
  - [ ] **Expected**: Optimized tablet layout

- [ ] **iPad Pro (834×1194)**:
  - [ ] Similar tests to iPad
  - [ ] Utilizes extra screen space

- [ ] **Landscape Orientation**:
  - [ ] Rotate to landscape
  - [ ] Layout adapts (if needed)
  - [ ] No layout breaks
  - [ ] **Expected**: Responsive to orientation

---

### 2.3 Desktop (> 1024px)
- [ ] **1920×1080 (Full HD)**:
  - [ ] Full navigation visible (no hamburger)
  - [ ] Content well-centered, not stretched
  - [ ] Skills grid: 3+ columns
  - [ ] Images high-quality
  - [ ] Hover states on interactive elements
  - [ ] **Expected**: Optimal desktop experience

- [ ] **1366×768 (Common Laptop)**:
  - [ ] Similar tests to Full HD
  - [ ] Content fits without excessive scrolling

- [ ] **4K/Retina Displays**:
  - [ ] Images sharp, not pixelated
  - [ ] Text crisp (high DPI rendering)
  - [ ] Layout scales appropriately

---

## 3. KEYBOARD-ONLY TESTING

### 3.1 Navigation
- [ ] **Tab Through Header**:
  - [ ] Logo/Home link receives focus
  - [ ] Navigation links receive focus in order
  - [ ] Language switcher receives focus
  - [ ] Theme switcher receives focus
  - [ ] Focus filter receives focus
  - [ ] Focus indicators visible (outline, highlight)
  - [ ] **Expected**: Logical tab order

- [ ] **Tab Through Sections**:
  - [ ] All interactive elements focusable
  - [ ] Skip links work (if present)
  - [ ] Section headings navigable (screen reader)
  - [ ] **Expected**: Can navigate entire page

- [ ] **Tab Through Footer**:
  - [ ] PDF Export button focusable
  - [ ] Social links focusable
  - [ ] **Expected**: Complete keyboard navigation

---

### 3.2 Dropdowns & Selectors
- [ ] **Language Switcher**:
  - [ ] Tab to language dropdown
  - [ ] Press Enter/Space - dropdown opens
  - [ ] Arrow keys navigate options
  - [ ] Enter selects option
  - [ ] ESC closes dropdown without selection
  - [ ] **Expected**: Full keyboard control

- [ ] **Theme Switcher**:
  - [ ] Same keyboard tests as language switcher

- [ ] **Focus Filter**:
  - [ ] Same keyboard tests as above

---

### 3.3 Modals
- [ ] **Open Modal via Keyboard**:
  - [ ] Tab to image thumbnail
  - [ ] Press Enter - modal opens
  - [ ] Focus moves to modal close button
  - [ ] **Expected**: Keyboard can open modal

- [ ] **Navigate Modal**:
  - [ ] Tab cycles through modal elements
  - [ ] Cannot tab to background page
  - [ ] ESC closes modal
  - [ ] Focus returns to thumbnail that opened modal
  - [ ] **Expected**: Focus trap and proper return

---

### 3.4 Forms
- [ ] **Contact Form Keyboard**:
  - [ ] Tab through all form fields
  - [ ] Type in fields without mouse
  - [ ] Submit with Enter key
  - [ ] Error messages announced (ARIA)
  - [ ] **Expected**: Form fully keyboard-accessible

---

## 4. SCREEN READER TESTING

### 4.1 VoiceOver (macOS Safari)
- [ ] **Page Structure**:
  - [ ] Cmd+U opens rotor
  - [ ] Headings list shows all sections
  - [ ] Landmarks list shows nav, main, sections, footer
  - [ ] Links list shows all links
  - [ ] **Expected**: Logical document structure

- [ ] **Content Reading**:
  - [ ] Navigate with VO+Right Arrow through page
  - [ ] All text read aloud
  - [ ] Images have alt text (or filename if missing)
  - [ ] Links announce purpose
  - [ ] Buttons announce role and state
  - [ ] **Expected**: All content accessible

- [ ] **Interactive Elements**:
  - [ ] Dropdowns announce expanded/collapsed state
  - [ ] Modal announces "dialog" role
  - [ ] Form fields announce labels and errors
  - [ ] **Expected**: Proper ARIA attributes

---

### 4.2 NVDA (Windows Chrome/Firefox)
- [ ] **Heading Navigation**:
  - [ ] Press H key - cycles through headings
  - [ ] Hierarchy logical (H1 > H2 > H3)
  - [ ] **Expected**: Can navigate by headings

- [ ] **Link Navigation**:
  - [ ] Press K key - cycles through links
  - [ ] Links announce destination/purpose
  - [ ] **Expected**: Clear link context

- [ ] **Form Navigation**:
  - [ ] Press F key - cycles through form fields
  - [ ] Fields announce labels
  - [ ] Errors announced when triggered
  - [ ] **Expected**: Form accessible

---

### 4.3 JAWS (Windows)
- [ ] **Quick Key Navigation**:
  - [ ] H for headings
  - [ ] K for links
  - [ ] F for forms
  - [ ] R for regions/landmarks
  - [ ] **Expected**: Standard screen reader shortcuts work

---

## 5. EDGE CASES & ERROR HANDLING

### 5.1 Empty Data
- [ ] **Remove `education` key from JSON**:
  - [ ] App does not crash
  - [ ] Education section shows "No education data" or hides
  - [ ] **Expected**: Graceful degradation

- [ ] **Remove `profiles` key**:
  - [ ] Profiles section hidden or shows message
  - [ ] **Expected**: No error

- [ ] **Empty `skills` object `{}`**:
  - [ ] Skills section hidden or shows empty state
  - [ ] **Expected**: No crash

- [ ] **Empty array `projects: []`**:
  - [ ] Projects section shows "No projects" or hides
  - [ ] **Expected**: Handles empty arrays

---

### 5.2 Invalid Dates
- [ ] **Date "2020-9-31"** (invalid day):
  - [ ] App does not crash
  - [ ] Displays raw string or "Invalid Date"
  - [ ] **Expected**: Fallback for invalid dates

- [ ] **Date "2024-13-01"** (invalid month):
  - [ ] Same as above

- [ ] **Date `null` or missing**:
  - [ ] Shows "Present" or skips date display
  - [ ] **Expected**: Handles null gracefully

---

### 5.3 Missing Images
- [ ] **Remove `Pictures` array from basics**:
  - [ ] Hero section renders without photos
  - [ ] No broken image icons
  - [ ] **Expected**: No visual errors

- [ ] **Invalid image URL** (404):
  - [ ] Placeholder image or no image shown
  - [ ] Alt text displayed (if available)
  - [ ] **Expected**: Fallback for broken images

- [ ] **Missing profile photo**:
  - [ ] Initials or default avatar shown
  - [ ] **Expected**: Graceful fallback

---

### 5.4 Duplicate Entries
- [ ] **Duplicate project** (same title + URL):
  - [ ] Only one instance rendered
  - [ ] Deduplication logic works
  - [ ] **Expected**: No duplicate cards

- [ ] **Check JSON for "Cosmetic Shop Marketplace"**:
  - [ ] Appears twice in raw JSON
  - [ ] Only one shown in UI
  - [ ] **Expected**: Dedupe by title+URL

---

### 5.5 Null/Undefined Fields
- [ ] **Education entry with `gpa: null`**:
  - [ ] GPA line not rendered or shows "N/A"
  - [ ] **Expected**: Optional fields handled

- [ ] **Project with `url: null`**:
  - [ ] Project card renders without link button
  - [ ] **Expected**: No broken links

- [ ] **Reference with `phone: null`**:
  - [ ] Phone line not displayed
  - [ ] **Expected**: Handles missing contact info

---

### 5.6 Malformed Data
- [ ] **`type_key` is `null` instead of array**:
  - [ ] Entry still renders
  - [ ] Filter treats as untagged (show in "Full CV" only)
  - [ ] **Expected**: Defensive coding prevents crash

- [ ] **String instead of object**:
  - [ ] TypeScript should catch in dev
  - [ ] Runtime: skip entry or show error boundary
  - [ ] **Expected**: App remains stable

---

## 6. BROWSER COMPATIBILITY

### 6.1 Chrome (Latest)
- [ ] All features work
- [ ] No console errors
- [ ] CSS renders correctly
- [ ] Animations smooth
- [ ] **Expected**: Full functionality

### 6.2 Firefox (Latest)
- [ ] Same tests as Chrome
- [ ] Check for CSS differences
- [ ] Test print preview

### 6.3 Safari (Latest)
- [ ] Same tests as Chrome
- [ ] Check iOS Safari (mobile)
- [ ] Verify webkit-specific issues

### 6.4 Edge (Latest)
- [ ] Same tests as Chrome
- [ ] Test on Windows 11

### 6.5 Cross-Browser Issues
- [ ] CSS Grid support
- [ ] CSS Custom Properties support
- [ ] Flexbox rendering
- [ ] JavaScript ES6+ features
- [ ] **Expected**: Consistent experience

---

## 7. PERFORMANCE TESTING

### 7.1 Lighthouse Audit
- [ ] **Performance Score**: > 90
- [ ] **Accessibility Score**: > 95
- [ ] **Best Practices Score**: > 90
- [ ] **SEO Score**: > 90
- [ ] **Expected**: Green scores across board

### 7.2 Load Time
- [ ] **First Contentful Paint (FCP)**: < 1.5s
- [ ] **Largest Contentful Paint (LCP)**: < 2.5s
- [ ] **Time to Interactive (TTI)**: < 3.5s
- [ ] **Expected**: Fast initial load

### 7.3 Bundle Size
- [ ] Run `npm run build`
- [ ] Check `dist/` folder size
- [ ] Initial bundle: < 500KB (gzipped)
- [ ] **Expected**: Minimal bundle size

### 7.4 Image Optimization
- [ ] Images use `loading="lazy"` attribute
- [ ] Images progressively load as user scrolls
- [ ] Check Network tab: images load on demand
- [ ] **Expected**: Deferred image loading

### 7.5 Code Splitting
- [ ] Check build output for separate chunks
- [ ] Lazy-loaded sections show separate JS files
- [ ] **Expected**: Route-based splitting

---

## 8. SECURITY & PRIVACY

### 8.1 XSS Protection
- [ ] User input (contact form) sanitized
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] **Expected**: No XSS vulnerabilities

### 8.2 External Links
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] **Expected**: Prevents tabnabbing

### 8.3 Contact Information Privacy
- [ ] Email displayed but obfuscated (if implemented)
- [ ] Phone number hidden by default (if implemented)
- [ ] Reference contacts appropriately gated
- [ ] **Expected**: Privacy-conscious design

---

## 9. REGRESSION TESTING (After Fixes)

### 9.1 Previously Reported Issues
- [ ] **Issue #1**: [Description] - Fixed and tested
- [ ] **Issue #2**: [Description] - Fixed and tested
- [ ] **Issue #3**: [Description] - Fixed and tested

### 9.2 Re-Test Critical Paths
- [ ] Language switch end-to-end
- [ ] Theme switch end-to-end
- [ ] Filter change end-to-end
- [ ] Modal open/close end-to-end
- [ ] **Expected**: All workflows still function

---

## 10. ADDITIONAL CHECKS

### 10.1 Console Errors
- [ ] Open DevTools Console
- [ ] Navigate entire site
- [ ] **Expected**: Zero errors, minimal warnings

### 10.2 Network Errors
- [ ] Open Network tab
- [ ] Check for failed requests (404, 500)
- [ ] **Expected**: All resources load successfully

### 10.3 Memory Leaks
- [ ] Open Performance/Memory tab
- [ ] Navigate between sections multiple times
- [ ] Check heap size does not grow indefinitely
- [ ] **Expected**: Stable memory usage

### 10.4 Accessibility Tree
- [ ] Open Accessibility inspector in DevTools
- [ ] Verify tree structure logical
- [ ] All elements have proper roles
- [ ] **Expected**: Clean accessibility tree

---

## 11. DOCUMENTATION REVIEW

### 11.1 README.md
- [ ] Accurate setup instructions
- [ ] Features list matches implemented features
- [ ] Screenshots/GIFs up to date
- [ ] **Expected**: Clear, current documentation

### 11.2 SCHEMA.md (or equivalent)
- [ ] JSON schema documented
- [ ] Examples valid
- [ ] `type_key` usage explained
- [ ] **Expected**: Accurate schema docs

### 11.3 Code Comments
- [ ] Future TODO comments in place (backend seams)
- [ ] Complex logic explained
- [ ] **Expected**: Maintainable codebase

---

## FINAL SIGN-OFF

### All Tests Passed
- [ ] All critical tests passed
- [ ] All edge cases handled
- [ ] No known bugs or issues
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] Cross-browser compatible

### Known Issues (Document if any)
1. _Issue description_: Workaround/status
2. _Issue description_: Workaround/status

### Tester Sign-Off
- **Tester Name**: ___________________
- **Date**: ___________________
- **Signature**: ___________________

---

## NOTES

### Testing Environment Details
- **Operating System**: 
- **Browser Versions**: 
- **Screen Resolutions Tested**: 
- **Testing Tools Used**: 

### Issues Found & Fixed During Testing
| Issue # | Description | Severity | Status | Notes |
|---------|-------------|----------|--------|-------|
| 1       |             |          |        |       |
| 2       |             |          |        |       |
| 3       |             |          |        |       |

---

**End of QA Checklist**
