# Backend Decision

**Date:** December 29, 2024  
**Decision:** Option 2 - Serverless Functions  
**Rationale:** Balances full control over functionality with minimal infrastructure overhead and cost-effectiveness for a personal CV/portfolio website.

---

## Executive Summary

After analyzing the backend requirements for the Premium CV Portfolio Website, we have decided to implement **Serverless Functions** (Option 2) for the contact form and booking features. This approach provides full control over the user experience while leveraging free-tier hosting on Vercel/Netlify.

---

## Chosen Approach

### Serverless Functions Architecture

```
Frontend (Netlify/Vercel)
    ↓ HTTPS
API Routes (same domain)
    /api/contact     → Serverless Function → SendGrid
    /api/bookings    → Serverless Function → Supabase
    /api/availability → Serverless Function → Supabase
    /api/generate-pdf → Serverless Function (optional)
    ↓
Database (Supabase PostgreSQL)
Email Service (SendGrid)
```

**Stack:**
- **Functions:** Netlify/Vercel Serverless Functions (TypeScript)
- **Database:** Supabase (PostgreSQL with real-time capabilities)
- **Email:** SendGrid (free tier: 100 emails/day)
- **Error Tracking:** Sentry (free tier)

### Why Option 2?

| Consideration | Answer |
|---------------|--------|
| Expected traffic | Low to moderate (personal CV site) |
| Real-time booking required? | No (email-based confirmation is acceptable) |
| Calendar integration essential? | No (manual availability management works) |
| Maintenance budget | Minimal (free tier preferred) |
| Third-party branding acceptable? | Prefer custom branding |

Based on these answers, Option 2 (Serverless Functions) is the optimal choice:

**Pros:**
- ✅ Full control over functionality and branding
- ✅ Same domain (no CORS issues)
- ✅ Free tier covers low volume
- ✅ Good developer experience
- ✅ Message and booking history in database
- ✅ Can build simple admin dashboard later

**Cons:**
- ⚠️ Cold starts (acceptable for personal site)
- ⚠️ 10s function timeout on Vercel (manageable)

### Rejected Alternatives

**Option 1 (Third-Party Services):** Rejected because:
- Limited customization
- Third-party branding (Formspree, Calendly logos)
- Data stored in external services
- No message/booking history

**Option 3 (Full Backend):** Rejected because:
- Over-engineered for a personal CV site
- Higher maintenance burden
- Monthly hosting costs
- Complex OAuth/calendar setup not needed

---

## Implementation Plan

### Phase 1: Contact Form Backend (Week 1)

**Goal:** Enable real message delivery to owner's email

**Tasks:**
1. Set up Vercel/Netlify project with serverless functions
2. Create `/api/contact` endpoint
3. Integrate SendGrid for email delivery
4. Add input validation and sanitization
5. Implement honeypot spam protection
6. Add rate limiting (5 requests/hour/IP)
7. Update frontend `ContactForm.tsx` to call real API

**API Specification:**
```typescript
// POST /api/contact
interface ContactRequest {
  name: string       // 2-100 chars
  email: string      // valid email format
  subject: string    // 3-200 chars
  message: string    // 10-5000 chars
  honeypot?: string  // must be empty (spam check)
}

interface ContactResponse {
  success: boolean
  message: string
  id?: string
}
```

### Phase 2: Database Setup (Week 1-2)

**Goal:** Set up Supabase for booking persistence

**Tasks:**
1. Create Supabase project
2. Define database schema:
   - `contact_messages` table
   - `bookings` table
   - `availability` table
3. Set up Row Level Security (RLS) policies
4. Create database indexes for performance
5. Configure connection pooling

**Schema:**
```sql
-- Contact messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  ip_address INET,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_type VARCHAR(20) NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  meeting_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Availability slots
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER, -- 0=Sunday, 6=Saturday
  specific_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  meeting_type VARCHAR(20),
  active BOOLEAN DEFAULT TRUE
);
```

### Phase 3: Booking Backend (Week 2-3)

**Goal:** Enable real booking functionality

**Tasks:**
1. Create `/api/availability` endpoint (GET)
2. Create `/api/bookings` endpoint (POST)
3. Implement booking conflict detection
4. Send confirmation emails to both parties
5. Update frontend `BookingWidget.tsx` to use real API
6. Add booking confirmation page/modal

**API Specifications:**
```typescript
// GET /api/availability?month=2025-01&type=video
interface AvailabilityResponse {
  slots: Array<{
    date: string
    times: Array<{ time: string; available: boolean }>
  }>
}

// POST /api/bookings
interface BookingRequest {
  type: 'video' | 'phone' | 'in-person'
  date: string      // YYYY-MM-DD
  time: string      // HH:MM
  timezone: string  // IANA timezone
  name: string
  email: string
  notes?: string
}

interface BookingResponse {
  success: boolean
  booking?: {
    id: string
    type: string
    dateTime: string
    confirmationSent: boolean
  }
}
```

### Phase 4: Admin Interface (Week 3 - Optional)

**Goal:** Simple admin UI for managing messages and bookings

**Tasks:**
1. Create password-protected `/admin` route
2. Build message list view with read/archive actions
3. Build booking list with status management
4. Add availability slot management
5. Use simple environment variable for password

**Admin Routes:**
- `/admin` - Login page
- `/admin/messages` - Contact message list
- `/admin/bookings` - Booking list
- `/admin/availability` - Manage time slots

---

## Environment Variables Needed

### Required (Phase 1)

```bash
# Email Service (SendGrid)
SENDGRID_API_KEY=SG.xxxx          # SendGrid API key
EMAIL_FROM=noreply@yourdomain.com  # Sender email address
EMAIL_TO=owner@yourdomain.com      # Recipient for contact form

# Rate Limiting (in-memory is fine for serverless)
RATE_LIMIT_MAX=5                   # Max requests per window
RATE_LIMIT_WINDOW_MS=3600000       # Window in ms (1 hour)
```

### Required (Phase 2-3)

```bash
# Database (Supabase)
DATABASE_URL=postgres://...        # Supabase connection string
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxx...         # Supabase anonymous key
SUPABASE_SERVICE_KEY=eyJxx...      # Supabase service role key (for admin)
```

### Optional (Phase 4)

```bash
# Admin Authentication
ADMIN_PASSWORD=xxx                  # Simple password for admin access

# Optional Spam Protection
RECAPTCHA_SITE_KEY=xxx             # reCAPTCHA v3 site key (frontend)
RECAPTCHA_SECRET_KEY=xxx           # reCAPTCHA v3 secret key (backend)
```

### Optional (Future Enhancements)

```bash
# Error Tracking
SENTRY_DSN=https://xxx@sentry.io/xxx

# Calendar Integration (if needed later)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REFRESH_TOKEN=xxx

# Video Meetings (if needed later)
ZOOM_API_KEY=xxx
ZOOM_API_SECRET=xxx
```

---

## Timeline

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1 | Contact Form + Database Setup | Working `/api/contact` endpoint, SendGrid integration, Supabase setup |
| 2 | Booking System | Working `/api/bookings` and `/api/availability`, frontend integration |
| 3 | Admin (Optional) | Password-protected admin dashboard |

**Note:** Phases may overlap or run in parallel. Total estimated effort is 2-3 weeks.

---

## Security Considerations

### Input Validation
- Validate all fields on both client and server
- Sanitize input to prevent XSS
- Use parameterized queries to prevent SQL injection

### Rate Limiting
- Contact form: 5 requests/hour/IP
- Booking: 10 requests/hour/IP
- Availability: 60 requests/hour/IP

### Spam Prevention
- Honeypot field (hidden input)
- Optional: reCAPTCHA v3 (invisible)
- Email domain blacklist for known spam domains

### Data Protection (GDPR)
- Privacy policy required
- Data retention policy (e.g., delete after 1 year)
- Encryption at rest (Supabase default)
- User data export/deletion capability

---

## Open Questions

1. **Email Domain:** Should we set up a custom domain for sending emails (e.g., `noreply@yourdomain.com`) or use a personal email?

2. **Meeting Links:** For video meetings, should we:
   - Provide a static meeting link (owner's Zoom/Google Meet room)?
   - Let owner manually send meeting links after booking?
   - Integrate with Zoom/Google Meet API later?

3. **Availability Management:** How will the owner manage available time slots?
   - Admin UI (requires building)?
   - Direct database editing (simpler but less user-friendly)?
   - Calendar integration (future enhancement)?

4. **Confirmation Emails:** Should we send emails in multiple languages based on the site language used during booking?

5. **PDF Generation:** Should we include server-side PDF generation in this phase, or keep using browser print for now?

---

## References

- [Backend Requirements Audit (MD)](../qa/reports/BACKEND_REQUIREMENTS_AUDIT.md)
- [Backend Requirements Audit (JSON)](../qa/reports/BACKEND_REQUIREMENTS_AUDIT.json)
- [Plan 17: Backend Decision](../new_plans/plan_17_backend_decision.md)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

---

## Appendix: Feature Status

| Feature | Current Status | After Implementation |
|---------|---------------|---------------------|
| Contact Form | Simulated (console.log) | Real email delivery |
| Booking Widget | Mock data | Database-backed with email notifications |
| PDF Generation | Browser print | No change (future enhancement) |
| Analytics | Client-side + GA4 | No change |
| Testimonials | Static mock data | No change |
| Articles | Static/embedded | No change |

---

*Document created as part of FE-17: Backend Decision task*
