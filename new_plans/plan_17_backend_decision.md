# Plan 17: Backend Scope Decision

## Title
Decide Backend Architecture for Contact Form and Booking

---

## Scope

### In Scope
- Document decision on backend approach
- Choose between third-party services or custom backend
- Document required environment variables
- Create implementation roadmap (if custom backend chosen)

### Out of Scope
- Actually implementing the backend
- Setting up infrastructure
- Creating the admin dashboard

---

## Symptoms

**What users see:**
- Contact form submits but nothing happens
- Booking widget shows mock data
- No real scheduling functionality

---

## Evidence

### Report References
- [BACKEND_REQUIREMENTS_AUDIT.md](../qa/reports/BACKEND_REQUIREMENTS_AUDIT.md)
- [BACKEND_REQUIREMENTS_AUDIT.json](../qa/reports/BACKEND_REQUIREMENTS_AUDIT.json)

### Current Status
| Feature | Status | Backend Needed |
|---------|--------|----------------|
| Contact Form | Simulated | Yes |
| Booking Widget | Mock data | Yes |
| PDF Generation | Browser print | Optional |

---

## Decision Framework

### Option 1: Third-Party Services (Minimal Effort)

**Contact Form:** Formspree or Netlify Forms
- Effort: 1-2 hours
- Cost: Free tier (50 submissions/month)
- Pros: Quick, no maintenance
- Cons: Limited customization, third-party branding

**Booking:** Calendly embed
- Effort: 1 hour
- Cost: Free tier available
- Pros: Professional, full-featured
- Cons: External redirect, branding

**Recommended if:** Quick MVP, low traffic, no custom requirements

### Option 2: Serverless Functions (Moderate Effort)

**Stack:**
- Vercel/Netlify Functions
- Supabase (database)
- SendGrid (email)

**Effort:** 2-3 weeks
**Cost:** Free tier covers low volume

**Pros:**
- Full control
- Same domain (no CORS)
- Customizable

**Cons:**
- Cold starts
- Function timeouts

**Recommended if:** Need custom flow, moderate traffic, want control

### Option 3: Full Backend Service (High Effort)

**Stack:**
- Hono/Express on Fly.io
- PostgreSQL
- Redis
- Google Calendar API
- Zoom API

**Effort:** 4-6 weeks
**Cost:** $5-15/month

**Pros:**
- Full flexibility
- Calendar integration
- WebSocket support

**Cons:**
- Complex setup
- Higher maintenance

**Recommended if:** High volume, need calendar sync, consulting business

---

## Recommended Decision Process

### Step 1: Answer these questions
1. How many contact submissions expected per month?
2. Is real-time booking required?
3. Is calendar integration essential?
4. What's the maintenance budget (time/money)?
5. Is third-party branding acceptable?

### Step 2: Choose based on answers
```
Low traffic + minimal needs → Option 1 (Third-party)
Moderate needs + some control → Option 2 (Serverless)
High volume + complex needs → Option 3 (Full backend)
```

### Step 3: Document the decision
Create `docs/BACKEND_DECISION.md` with:
- Chosen option
- Rationale
- Implementation timeline
- Required environment variables
- Next steps

---

## Implementation Notes (if custom backend)

### Required Environment Variables
```bash
# Email (all options)
SENDGRID_API_KEY=xxx
EMAIL_FROM=noreply@example.com
EMAIL_TO=owner@example.com

# Database (options 2 & 3)
DATABASE_URL=postgres://...

# Spam protection
RECAPTCHA_SECRET_KEY=xxx

# Calendar (option 3 only)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### API Endpoints
```
POST /api/contact     - Submit contact form
POST /api/bookings    - Create booking
GET  /api/availability - Get available slots
POST /api/generate-pdf - Generate CV PDF (optional)
```

---

## Acceptance Criteria

- [ ] Decision documented in `docs/BACKEND_DECISION.md`
- [ ] Chosen approach clearly stated
- [ ] Rationale explained
- [ ] Required steps listed
- [ ] No code changes made (this is planning only)

---

## Deliverable

Create `docs/BACKEND_DECISION.md`:

```markdown
# Backend Decision

**Date:** [Date]
**Decision:** [Option 1/2/3]
**Rationale:** [Why this option]

## Chosen Approach

[Description]

## Implementation Plan

1. [Step 1]
2. [Step 2]
...

## Environment Variables Needed

- `VARIABLE_NAME` - Description

## Timeline

- Week 1: [Tasks]
- Week 2: [Tasks]
...

## Open Questions

- [Any remaining questions]
```

---

## Risk & Rollback

### Risk Level: NONE (Documentation only)

This plan creates documentation, not code changes.

---

## Dependencies

**Blocks:** Backend implementation (future work)

**Blocked by:** Milestone 4 (Architecture cleanup complete)

---

## Commit Message Guidance

### Short
```
docs: document backend architecture decision

Created BACKEND_DECISION.md documenting the chosen approach
for contact form and booking functionality.

Addresses: Contact Form Backend, Booking Backend
```

---

*Plan ready for implementation*
