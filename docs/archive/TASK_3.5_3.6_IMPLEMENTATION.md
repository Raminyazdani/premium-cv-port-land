# Task 3.5 & 3.6 Implementation: Contact Form & Booking Widget

## Overview
Implemented placeholder UI components for contact form and call booking functionality with full client-side validation, accessibility features, and future backend integration points.

## Files Created

### 1. `/src/components/ContactForm.tsx`
**Purpose**: Contact form with name, email, subject, and message fields

**Features**:
- ✅ Required field validation (all fields)
- ✅ Email format validation (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- ✅ Minimum length validation:
  - Name: 2 characters
  - Subject: 3 characters
  - Message: 10 characters
- ✅ Real-time validation on blur
- ✅ Error messages displayed below fields
- ✅ Accessible labels with required indicators
- ✅ ARIA attributes for screen readers:
  - `aria-required="true"`
  - `aria-invalid` (when errors present)
  - `aria-describedby` (linking to error messages)
  - `role="alert"` on error messages
- ✅ Submit button with icon (PaperPlaneRight from Phosphor)
- ✅ Toast notification on submit: "Backend not implemented yet"
- ✅ Form data logged to console for testing
- ✅ Comment for future integration: See line 112 console.log

**Validation Logic**:
```typescript
validateField(name, value):
  - name: min 2 chars, required
  - email: valid email format, required  
  - subject: min 3 chars, required
  - message: min 10 chars, required
```

**Backend Integration Point**:
```typescript
// Line 112 in ContactForm.tsx
// TODO: POST to /api/contact endpoint
console.log('Form data (would be sent to backend):', formData)
```

### 2. `/src/components/BookingWidget.tsx`
**Purpose**: Calendar/scheduling UI for booking calls

**Features**:
- ✅ Meeting type selection (Video, Phone, In-Person)
- ✅ Date selection grid (8 mock dates)
- ✅ Time slot selection grid (6 mock slots, 2 unavailable)
- ✅ Disabled state for unavailable slots
- ✅ Selection summary display
- ✅ Clear selection button
- ✅ Toast notification on book: "Booking system not implemented yet"
- ✅ ARIA attributes:
  - `aria-pressed` for toggle buttons
  - `aria-disabled` for unavailable slots
  - `sr-only` text for unavailable indicators
- ✅ Responsive grid layouts (1-col mobile, multi-col desktop)
- ✅ Icons for each meeting type (Phosphor Icons)
- ✅ Comment for future integration: See line 91 console.log

**Backend Integration Point**:
```typescript
// Line 91 in BookingWidget.tsx
// TODO: Integrate Calendly or custom booking backend
console.log('Booking details (would be sent to backend):', {...})
```

### 3. `/src/components/sections/ContactSection.tsx`
**Purpose**: Section wrapper combining both contact form and booking widget

**Features**:
- ✅ Tabbed interface (Send Message / Book a Call)
- ✅ Centered layout with max-width
- ✅ Section title and description
- ✅ Smooth tab transitions
- ✅ Accessible tab controls (shadcn Tabs component)

### 4. `/src/App.tsx`
**Changes**: Added ContactSection before Footer

```typescript
import { ContactSection } from '@/components/sections/ContactSection'
// ...
<ContactSection />
<Footer />
```

## Acceptance Criteria Verification

### Task 3.5: Contact Form
- [x] Created `src/components/ContactForm.tsx`
- [x] Fields: Name, Email, Subject, Message
- [x] Submit button shows alert: "Backend not implemented yet" (via toast)
- [x] Client-side validation:
  - [x] Required fields checked
  - [x] Email format validated
  - [x] Error messages display on invalid input
- [x] Accessible form labels with required indicators (`<span aria-label="required">*</span>`)
- [x] Error messages with `role="alert"` and proper ARIA linking
- [x] Comment for backend integration: Line 112 (console.log with TODO comment)

### Task 3.6: Book a Call
- [x] Created `src/components/BookingWidget.tsx`
- [x] Placeholder calendar/scheduling UI with:
  - [x] Meeting type selector (3 types)
  - [x] Date grid (8 dates)
  - [x] Time slot grid (6 slots, 2 disabled)
- [x] "Book a Call" button shows alert: "Booking system not implemented yet" (via toast)
- [x] Comment for integration: Line 91 (console.log with TODO comment)

## Oversight Checks

### Contact Form Checks
✓ **Fill form and submit** - Toast appears: "Backend not implemented yet"
✓ **Submit with empty required field** - Validation errors show (e.g., "Name is required")
✓ **Enter invalid email** - Error shows: "Please enter a valid email address"
✓ **Tab through form** - All fields keyboard accessible, proper focus order
✓ **Verify comment** - Line 112: `// TODO: POST to /api/contact endpoint`

### Booking Widget Checks
✓ **Click "Book a Call"** - Toast appears: "Booking system not implemented yet"
✓ **Verify comment** - Line 91: `// TODO: Integrate Calendly or custom booking backend`
✓ **Select meeting type** - Visual feedback, aria-pressed updates
✓ **Select unavailable slot** - Button disabled, no interaction
✓ **Tab through widget** - All interactive elements accessible

## Testing Instructions

1. **Navigate to Contact Section**:
   ```
   Scroll to bottom or click "Contact" in header navigation
   ```

2. **Test Contact Form**:
   ```bash
   # Empty submission
   1. Click "Send Message" button without filling form
   2. Verify errors appear for all required fields
   
   # Invalid email
   1. Enter "notanemail" in email field
   2. Tab away or submit
   3. Verify error: "Please enter a valid email address"
   
   # Valid submission
   1. Fill all fields correctly
   2. Click "Send Message"
   3. Verify toast: "Backend not implemented yet"
   4. Open DevTools Console
   5. Verify form data logged
   ```

3. **Test Booking Widget**:
   ```bash
   # Switch to booking tab
   1. Click "Book a Call" tab
   
   # Try booking without selection
   1. Click "Book a Call" button
   2. Verify toast: "Please select a date and time"
   
   # Full booking flow
   1. Select a meeting type (e.g., Video Call)
   2. Select a date
   3. Select an available time slot
   4. Verify selection summary appears
   5. Click "Book a Call" button
   6. Verify toast: "Booking system not implemented yet"
   7. Open DevTools Console
   8. Verify booking details logged
   ```

4. **Test Accessibility**:
   ```bash
   # Keyboard navigation
   1. Tab through entire Contact section
   2. Verify focus indicators visible on all interactive elements
   3. Press Enter on tab triggers to switch tabs
   4. Press Space on radio-button-style meeting types
   
   # Screen reader (if available)
   1. Navigate with screen reader
   2. Verify required fields announced
   3. Verify error messages read aloud
   4. Verify unavailable slots announced
   ```

5. **Test Responsiveness**:
   ```bash
   # Mobile view
   1. Resize browser to < 640px
   2. Verify form stacks vertically
   3. Verify meeting type grid stacks
   4. Verify date/time grids adjust
   5. Verify tabs display correctly
   
   # Desktop view
   1. Resize browser to > 1024px
   2. Verify multi-column layouts
   3. Verify submit button right-aligned
   ```

## Design Decisions

### Form Validation Approach
- **Validation on blur**: Prevents annoying real-time validation while typing
- **Validation on submit**: Ensures all fields checked before submission
- **Touched state**: Only shows errors for fields user has interacted with
- **Clear error messages**: Specific, actionable feedback for each error type

### UI/UX Patterns
- **Tabs component**: Reduces vertical space, groups related functionality
- **Card wrappers**: Provides visual hierarchy and clear boundaries
- **Toast notifications**: Non-intrusive, auto-dismiss feedback
- **Console logging**: Allows testing without backend, shows expected data format

### Accessibility Features
- **Semantic HTML**: Proper form elements, labels, buttons
- **ARIA attributes**: Screen reader support for validation states
- **Focus management**: Logical tab order, visible focus indicators
- **Color independence**: Errors not indicated by color alone (text + icon)
- **Disabled state handling**: Clear visual + ARIA indication

## Future Backend Integration

### Contact Form API
```typescript
// Expected endpoint: POST /api/contact
// Request body:
{
  name: string,      // 2+ chars
  email: string,     // valid email
  subject: string,   // 3+ chars
  message: string    // 10+ chars
}

// Success response: 200
// Error response: 400 with validation errors
```

### Booking API
```typescript
// Expected endpoint: POST /api/booking
// Or integration with Calendly API
// Request body:
{
  type: 'video' | 'phone' | 'in-person',
  date: string,      // ISO date or formatted string
  time: string       // Time slot string
}

// Success response: 200 with confirmation details
// Alternative: Calendly embed/popup for direct integration
```

## Component Dependencies

### Shadcn Components Used
- `Button` - Submit and action buttons
- `Input` - Text and email inputs
- `Label` - Form labels
- `Textarea` - Message field
- `Card` - Container wrappers
- `Tabs` - Contact section tabs

### Icons Used (Phosphor)
- `PaperPlaneRight` - Send message icon
- `Calendar` - Date selection icon
- `Clock` - Time selection icon
- `Video` - Video call icon
- `Phone` - Phone call icon
- `MapPin` - In-person meeting icon

### External Libraries
- `sonner` - Toast notifications
- `react` - State management and event handling

## Code Quality Notes

### Type Safety
- Full TypeScript interfaces for form data and errors
- Proper typing for event handlers
- Type-safe state management

### Code Organization
- Separate validation function for reusability
- Clear function naming (handleChange, handleBlur, validateForm)
- Logical component structure (imports, interfaces, component, helpers)

### Performance
- Minimal re-renders (validation only on blur/submit)
- No expensive operations in render
- Event handlers properly typed and scoped

## Next Steps

1. **Backend API Development**:
   - Create `/api/contact` endpoint
   - Create `/api/booking` endpoint or integrate Calendly
   - Add rate limiting and spam protection
   - Set up email notification service

2. **Enhanced Features** (Optional):
   - Email confirmation after successful submission
   - Calendar integration (Google Calendar, Outlook)
   - Timezone selection for bookings
   - Attachment support in contact form
   - Form persistence (save draft to localStorage)
   - reCAPTCHA integration

3. **Testing** (Optional):
   - Unit tests for validation functions
   - Integration tests for form submission
   - E2E tests with Cypress/Playwright
   - Accessibility audit with axe-core

## Dependencies
- Task 1.1 (Theme system)
- Shadcn UI components
- Phosphor Icons
- Sonner toast library

## Status
✅ **Complete** - Both components fully implemented with all acceptance criteria met
