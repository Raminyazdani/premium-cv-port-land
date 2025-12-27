# Accessibility Testing Checklist

## Overview
This checklist validates all user interactions meet accessibility standards across the CV website.

---

## 1. Visual Feedback Testing

### Dropdowns (Theme, Language, Filter)
- [ ] **Hover State**: Icon buttons show background color change on hover
- [ ] **Active State**: Button shows pressed appearance when clicked
- [ ] **Focus State**: Visible outline/ring appears when tabbed to
- [ ] **Loading State**: Spinner replaces icon during theme/language switch
- [ ] **Disabled State**: Button appears grayed out and cursor shows not-allowed
- [ ] **Selected Item**: Check mark visible next to current selection
- [ ] **Transition**: Smooth animation when dropdown opens/closes

**Test Method**: 
```
1. Hover over each dropdown button → verify background changes
2. Click button → verify pressed state briefly shows
3. Tab to button → verify focus ring visible
4. Select new theme/language → verify spinner appears
5. Observe dropdown items → verify selected has check mark
```

### Forms (Contact, Booking)
- [ ] **Field Focus**: Input fields show border/glow when focused
- [ ] **Field Hover**: Subtle hover effect on input fields
- [ ] **Error State**: Red border and error message on invalid field
- [ ] **Success State**: Green confirmation after successful submission
- [ ] **Submit Button Hover**: Color change on hover
- [ ] **Submit Button Loading**: Spinner + "Sending..." text during submission
- [ ] **Submit Button Disabled**: Grayed out when form invalid or submitting
- [ ] **Required Field Indicator**: Red asterisk visible on required fields

**Test Method**:
```
1. Click each form field → verify focus indicators
2. Enter invalid email → verify red border + error message
3. Submit valid form → verify button shows loading state
4. Watch for success toast → verify green confirmation
```

### Modal (Media Viewer)
- [ ] **Image Loading**: Spinner shows while image loads
- [ ] **Image Error**: Error message + retry button if image fails
- [ ] **Navigation Buttons Hover**: Arrows highlight on hover
- [ ] **Navigation Buttons Disabled**: Prev/Next grayed at start/end
- [ ] **Close Button Hover**: X button highlights on hover
- [ ] **Backdrop Hover**: Cursor indicates clickable background

**Test Method**:
```
1. Open modal with large image → verify spinner shows
2. Test with broken URL → verify error state
3. Hover navigation arrows → verify highlight
4. Navigate to last image → verify "Next" disabled
```

### Buttons & Links
- [ ] **Primary Button Hover**: Background darkens
- [ ] **Primary Button Active**: Press effect visible
- [ ] **Secondary Button Hover**: Border/background changes
- [ ] **Link Hover**: Color change and/or underline
- [ ] **Icon Button Hover**: Background circle appears
- [ ] **Disabled Button**: Grayed + not clickable

---

## 2. Keyboard Navigation Testing

### Global Navigation
- [ ] **Tab Order**: Logical flow (header → content → footer)
- [ ] **Skip Link**: "Skip to content" appears on first Tab
- [ ] **Focus Visible**: All interactive elements show focus ring
- [ ] **No Keyboard Traps**: Can Tab out of all components
- [ ] **Shift+Tab**: Backwards navigation works

**Test Method**:
```
1. Press Tab repeatedly → verify order makes sense
2. Press Tab once → verify skip link appears
3. Tab through entire page → verify every interactive element reachable
4. Get stuck? → verify ESC or Shift+Tab escapes
```

### Dropdowns
- [ ] **Tab**: Reaches dropdown trigger button
- [ ] **Enter/Space**: Opens dropdown menu
- [ ] **Arrow Down/Up**: Navigates menu items (if implemented)
- [ ] **Enter**: Selects highlighted item
- [ ] **Escape**: Closes dropdown
- [ ] **Tab in Menu**: Navigates items
- [ ] **Shift+Tab**: Backwards through items

**Test Method**:
```
1. Tab to theme selector
2. Press Enter → verify dropdown opens
3. Press Arrow keys → verify selection moves
4. Press Enter → verify selection applied
5. Press ESC → verify dropdown closes
```

### Forms
- [ ] **Tab**: Moves through fields in order
- [ ] **Enter in Input**: Submits form (if appropriate)
- [ ] **Enter on Button**: Activates button
- [ ] **Space on Checkbox**: Toggles checkbox
- [ ] **Escape**: Clears focused field (optional)

**Test Method**:
```
1. Tab through all form fields
2. Fill out contact form using only keyboard
3. Press Enter on submit button
4. Verify form submits without mouse
```

### Modal
- [ ] **Focus Trap**: Tab only cycles within modal
- [ ] **First Focus**: Close button receives focus on open
- [ ] **Escape**: Closes modal
- [ ] **Arrow Left/Right**: Navigate gallery (if applicable)
- [ ] **Tab to Close**: Can Tab to X button
- [ ] **Focus Return**: Focus returns to trigger after close

**Test Method**:
```
1. Open modal via keyboard
2. Press Tab repeatedly → verify stays in modal
3. Press ESC → verify modal closes
4. Verify focus returns to button that opened modal
```

### Booking Widget
- [ ] **Tab**: Through meeting type buttons
- [ ] **Enter/Space**: Selects meeting type
- [ ] **Tab**: Through date buttons
- [ ] **Enter/Space**: Selects date
- [ ] **Tab**: Through time slots
- [ ] **Enter/Space**: Selects time
- [ ] **Tab to Book Button**: Reaches submit
- [ ] **Enter**: Books call

---

## 3. Screen Reader Testing

### Setup
- **Windows**: NVDA (free) or JAWS
- **Mac**: VoiceOver (built-in, Cmd+F5)
- **Linux**: Orca

### Landmarks & Structure
- [ ] **Main Landmark**: `<main>` announced
- [ ] **Navigation Landmark**: `<nav>` announced  
- [ ] **Section Headings**: H2/H3 hierarchy correct
- [ ] **List Structures**: Lists announced with item counts
- [ ] **Forms**: Form landmark detected

**Test Method (VoiceOver)**:
```
1. Cmd+F5 to start VoiceOver
2. VO+U → open Web Rotor
3. Select "Landmarks" → verify all present
4. Select "Headings" → verify hierarchy
```

### Interactive Elements
- [ ] **Buttons**: Announced as "Button, [label]"
- [ ] **Links**: Announced as "Link, [text]"
- [ ] **Dropdowns**: Announced as "Menu, [label]"
- [ ] **Form Fields**: Label + field type announced
- [ ] **Required Fields**: "Required" announced
- [ ] **Error Messages**: "Error, [message]" announced

**Test Method**:
```
1. Navigate to theme selector
2. Verify announces "Button, Select theme"
3. Activate → verify announces "Menu, Theme Presets"
4. Navigate items → verify each announced with state
```

### Dynamic Content
- [ ] **Form Errors**: Announced when field invalid
- [ ] **Form Success**: "Message sent" announced
- [ ] **Theme Change**: "Theme changed to..." announced
- [ ] **Language Change**: "Language changed to..." announced
- [ ] **Filter Change**: "Content filter changed..." announced
- [ ] **Loading States**: "Loading" announced
- [ ] **Modal Open**: "Media viewer opened" announced
- [ ] **Modal Close**: "Media viewer closed" announced

**Test Method**:
```
1. Submit invalid form
2. Verify error announced without navigating
3. Change theme
4. Verify "Theme changed to..." spoken
5. Open modal
6. Verify modal description announced
```

### Images & Media
- [ ] **Profile Photo**: Alt text announced
- [ ] **Cover Image**: Decorative (aria-hidden) or descriptive alt
- [ ] **Project Images**: Meaningful alt text
- [ ] **Certificate PDFs**: "PDF Document, [name]" announced
- [ ] **Icons**: Aria-labels on icon-only buttons

---

## 4. Error Handling Testing

### Form Validation
- [ ] **Real-time Validation**: Errors appear as user types (after blur)
- [ ] **Clear Messages**: "Email is required" not "Invalid input"
- [ ] **Field-Specific**: Error appears below specific field
- [ ] **Color + Text**: Not color-only (red text says "Error:")
- [ ] **Recovery**: Can fix error and resubmit

**Test Method**:
```
1. Leave name blank, Tab away → verify error
2. Enter invalid email → verify specific message
3. Fix error → verify error clears
4. Submit form → verify submission works
```

### Network Errors
- [ ] **Submit Failure**: Toast shows "Failed to send"
- [ ] **Retry Option**: User can try again
- [ ] **Image Load Fail**: Placeholder or error message
- [ ] **PDF Load Fail**: Descriptive error + open link option

**Test Method**:
```
1. Simulate slow network (DevTools: Network → Slow 3G)
2. Submit contact form → verify loading state
3. Test with broken image URL → verify error state
4. Click retry → verify attempt to reload
```

### Edge Cases
- [ ] **Empty Data**: Sections handle missing JSON gracefully
- [ ] **Invalid Dates**: Shows "Invalid Date", doesn't crash
- [ ] **Missing Images**: Placeholder or skip rendering
- [ ] **Long Text**: Truncates or scrolls, no overflow
- [ ] **XSS Protection**: User input sanitized

**Test Method**:
```
1. Remove education array from JSON → verify no crash
2. Set date to "2099-99-99" → verify fallback
3. Enter <script> in form → verify sanitized
```

---

## 5. Mobile/Touch Testing

### Touch Targets
- [ ] **Minimum Size**: All buttons ≥44x44px
- [ ] **Spacing**: No crowded tap targets
- [ ] **Thumb Reach**: Important actions in easy reach zones

**Test Method**:
```
1. Use iPhone SE (smallest) or enable touch simulation in DevTools
2. Tap all buttons → verify no mis-taps
3. Measure targets → verify 44px min (DevTools)
```

### Mobile Navigation
- [ ] **Hamburger Menu**: Opens/closes smoothly
- [ ] **Drawer Swipe**: Can swipe to close (if implemented)
- [ ] **Dropdown Touch**: Opens on tap
- [ ] **Form Scrolling**: Keyboard doesn't hide focused field

### Gestures
- [ ] **Swipe Gallery**: Left/right swipe in modal gallery
- [ ] **Pinch Zoom**: Works on images (if enabled)
- [ ] **Double Tap**: Zoom (optional)

---

## 6. Browser/AT Compatibility Matrix

### Desktop Browsers + Screen Readers

| Feature | Chrome + NVDA | Firefox + NVDA | Safari + VoiceOver | Edge + Narrator |
|---------|---------------|----------------|-------------------|-----------------|
| Forms | ✓ | ✓ | ✓ | ⚠️ |
| Dropdowns | ✓ | ✓ | ✓ | ✓ |
| Modal | ✓ | ✓ | ✓ | ⚠️ |
| Navigation | ✓ | ✓ | ✓ | ✓ |
| Live Regions | ✓ | ⚠️ | ✓ | ⚠️ |

### Mobile Testing

| Feature | iOS Safari + VoiceOver | Android Chrome + TalkBack |
|---------|----------------------|--------------------------|
| Forms | ✓ | ✓ |
| Dropdowns | ✓ | ⚠️ |
| Touch Targets | ✓ | ✓ |
| Swipe Nav | ✓ | ✓ |

**Legend**:
- ✓ = Fully accessible
- ⚠️ = Minor issues (document in notes)
- ✗ = Major issues (must fix)

---

## 7. Automated Testing

### Tools to Run
1. **axe DevTools** (browser extension)
2. **Lighthouse Accessibility** (Chrome DevTools)
3. **WAVE** (WebAIM extension)

### Run Checklist
- [ ] **axe**: 0 critical issues
- [ ] **Lighthouse**: Accessibility score ≥95
- [ ] **WAVE**: 0 errors, <5 alerts
- [ ] **ESLint jsx-a11y**: No violations

**Command**:
```bash
# If using axe-core via npm
npm run test:a11y

# Lighthouse CLI
lighthouse https://your-site.com --only-categories=accessibility

# Manual: Open DevTools → Lighthouse → Run Accessibility Audit
```

---

## 8. Contrast Ratio Testing

### Required Ratios (WCAG AA)
- **Normal Text** (< 18px): ≥4.5:1
- **Large Text** (≥18px or ≥14px bold): ≥3:1
- **UI Components**: ≥3:1

### Areas to Check
- [ ] **Body Text on Background**: ___:1 (≥4.5:1)
- [ ] **Button Text on Primary**: ___:1 (≥4.5:1)
- [ ] **Link Text on Background**: ___:1 (≥4.5:1)
- [ ] **Muted Text on Background**: ___:1 (≥4.5:1)
- [ ] **Error Text on Background**: ___:1 (≥4.5:1)
- [ ] **Border on Background**: ___:1 (≥3:1)

**Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 9. Reduced Motion Testing

### Test Setup
```css
/* In DevTools, emulate prefers-reduced-motion */
Rendering Tab → Enable "Emulate CSS media feature prefers-reduced-motion"
```

### Expected Behavior
- [ ] **No Animations**: Smooth scrolls, fade-ins disabled
- [ ] **Instant Transitions**: State changes immediate
- [ ] **No Parallax**: Background images static
- [ ] **Loading Spinners**: Still visible (functional, not decorative)

---

## 10. Real User Testing

### Test Scenarios
1. **Power User (Keyboard Only)**
   - Complete contact form
   - Browse all sections
   - Open modal gallery
   - Change theme/language
   - Time: ~5 minutes

2. **Screen Reader User**
   - Navigate page structure
   - Fill out form
   - Understand content order
   - Time: ~10 minutes

3. **Mobile User (Touch)**
   - Browse on small phone
   - Submit booking form
   - Use hamburger menu
   - View modal images
   - Time: ~5 minutes

### Recording Results
```markdown
**Tester**: [Name/Role]
**Date**: [Date]
**Device**: [Device + Browser + AT]
**Scenario**: [Which scenario]

**Issues Found**:
1. [Description]
   - Severity: Critical / Major / Minor
   - Location: [Component]
   - Workaround: [If any]

**Overall Experience**: [Rating 1-5, comments]
```

---

## 11. Issue Severity Guide

### Critical (Fix immediately)
- Keyboard trap preventing navigation
- Form submission impossible via keyboard
- Screen reader cannot access main content
- WCAG AA contrast failures on body text

### Major (Fix before launch)
- Missing focus indicators
- Unlabeled icon buttons
- Modal doesn't trap focus
- Loading state not announced

### Minor (Fix in next iteration)
- Overly verbose announcements
- Sub-optimal tab order
- Missing hover states
- Inconsistent button sizes

---

## 12. Sign-Off Checklist

Before considering accessibility "complete":

- [ ] **All dropdowns**: ✓ Visual feedback, ✓ Keyboard nav, ✓ Screen reader
- [ ] **All forms**: ✓ Validation, ✓ Error messages, ✓ Loading states
- [ ] **All modals**: ✓ Focus trap, ✓ ESC key, ✓ Announcements
- [ ] **All buttons/links**: ✓ Focus visible, ✓ Hover states, ✓ Labels
- [ ] **All images**: ✓ Alt text or aria-hidden
- [ ] **Color contrast**: ✓ All ratios ≥4.5:1 (normal text)
- [ ] **Automated tools**: ✓ 0 critical issues
- [ ] **Screen reader test**: ✓ Main flows tested
- [ ] **Keyboard test**: ✓ Complete navigation tested
- [ ] **Mobile test**: ✓ Touch targets verified

**Tested By**: _______________  
**Date**: _______________  
**Approved By**: _______________  
**Notes**: _______________

---

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Document Version**: 1.0  
**Last Updated**: [Date]
