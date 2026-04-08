# Domain Reference: Real Estate

Domain-specific knowledge for real estate projects: property listing portals, agency CRM systems, rental management platforms, property management tools (landlord/tenant), mortgage broker and comparison tools, short-term rental platforms (vacation), commercial real estate platforms.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Product type: property listing portal (Zillow/Rightmove model), agency CRM, rental management, property management (long-term), short-term rental (Airbnb model), mortgage comparison, commercial RE?
- Target market: residential sale, residential rental, commercial, or all?
- Geographic scope: city, national, cross-border — impacts currency, legal documents, and property law?
- Primary roles served: buyers/renters, sellers/landlords, agents/brokers, property managers, mortgage advisors?
- Monetisation: agent subscription, listing fee, lead generation (pay-per-enquiry), transaction commission, SaaS for property managers?

### Typical business goals
- Increase enquiry-to-viewing conversion rate.
- Reduce time-to-let or time-to-sale.
- Increase agent productivity (fewer manual tasks, more managed properties per agent).
- Build buyer/renter trust through accurate, up-to-date listings and verified information.
- Generate qualified leads for agents or mortgage brokers.

### Typical risks
- Listing data quality: stale listings, inaccurate prices, incorrect availability.
- Regulatory compliance: property law differs significantly by jurisdiction (deposit caps, eviction process, mandatory disclosures).
- Data privacy: collecting financial details, tenancy references, right-to-rent checks.
- Agent resistance to adopting new CRM if it replaces established tools.
- Fraud: fake listings, fake buyers/tenants.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: buyer/renter, seller/landlord, agent/negotiator, property manager, mortgage advisor, admin?
- Property data: own listings database or data feed from MLS/portals (RETS, RESO Web API)?
- Search and filtering: location (map-based), price range, property type, bedrooms, amenities?
- Enquiry management: contact form, in-app messaging, phone click-to-reveal?
- Viewing management: online booking, calendar sync with agent's calendar, confirmation and reminder flow?
- Tenancy workflow: application, referencing, tenancy agreement (digital signing), inventory, move-in, deposit, maintenance, move-out?
- Financial features: rent collection, maintenance charge management, statement generation?
- Valuation: instant automated valuation (AVM), request for agent valuation?

### Typical functional areas
- Property listing (creation, editing, photos, floor plan, EPC/energy rating, status management).
- Search and discovery (geo-search with map, filters, saved searches, alerts).
- Property detail page.
- Enquiry / lead capture.
- Viewing booking and management.
- Offer management (sale): submission, negotiation history, acceptance.
- Tenancy application and referencing.
- Digital tenancy agreement signing.
- Tenancy management (rent schedule, deposit, maintenance requests).
- Agent CRM: lead pipeline, contact management, property portfolio, task management.
- Mortgage tools: affordability calculator, lender comparison, broker enquiry.
- Notifications (new listing matching saved search, viewing reminders, rent due).
- Admin: user management, listing moderation, reporting.

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical buyer/renter flows: search → save listing → book viewing → submit offer or application?
- Critical agent flows: create listing → manage enquiries → confirm viewing → log offer?
- Tenancy flows: receive application → run reference check → issue agreement → manage rent?

### Typical epics
- Property Search and Discovery.
- Property Listing Management (agent/landlord).
- Enquiry and Lead Management.
- Viewing Booking and Management.
- Offer Management (for sale).
- Tenancy Application and Referencing.
- Tenancy Agreement (Digital Signing).
- Tenancy Management (Rent, Deposit, Maintenance).
- Agent CRM and Pipeline.
- Saved Searches and Alerts.
- Mortgage Calculators and Broker Tools.
- Notifications.
- Admin and Moderation.

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Listing status changes: what triggers a property to be marked "Under Offer" or "Let Agreed" automatically vs. manually?
- Reference failure: applicant fails referencing — what are the next steps (guarantor, deposit top-up, rejection)?
- Gazumping (UK): a higher offer is accepted after a previous offer was agreed — how is this handled?
- Maintenance emergency: tenant reports an emergency (flooding, no heating) — escalation process?

### Typical exceptional flows
- Property listed with incorrect price — agent corrects listing, saved-search alert not sent for correction to avoid spam.
- Viewing no-show (tenant/buyer) — slot marked as no-show, agent notified, rebook offered.
- Applicant fails referencing — system notifies landlord/agent, applicant informed with reason category (not detailed), appeal/alternative route offered.
- Digital signature link expires — resend triggered with new expiry, audit trail retained.
- Rent payment missed — day-1 automatic notification to landlord/property manager, escalation workflow initiated.
- Maintenance request not acknowledged within SLA — escalation to property manager supervisor.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Search freshness: within how many minutes of a listing going live must it appear in search results?
- Saved search alerts: maximum latency from listing match to notification delivered to user?
- Viewing booking: what are the confirmation rules — instant confirm or pending agent approval?
- Deposit protection: must the system record deposit protection scheme registration number and provider?
- Digital signature: what signature standard is required (e-signature legally binding in jurisdiction)?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Listing volume: how many active properties on the platform at launch and at scale?
- Map provider: Google Maps Platform, Mapbox, or OS Maps (UK)? Any cost sensitivity?
- Property photo storage: volume of photos per listing, total storage estimate?
- GDPR / data privacy: are applicant references (financial data) processed on-platform or via third-party referencing provider?

### Mandatory NFR categories for Real Estate
- **Search Performance:** Property search results returned within 1.5s including geo-filter. Map layer with property pins rendered within 2s for ≤500 visible markers.
- **Listing Freshness:** New listings indexed and searchable within 5 minutes of publication. Status changes (let agreed, sold) reflected in search within 2 minutes.
- **Photo and Media:** Property photos served via CDN. Listing page with 20 photos must load full page within 3s on standard broadband. Images auto-compressed and WebP-converted on upload.
- **Availability:** Search and property detail: 99.9% SLA. Tenancy management (rent collection): 99.9%. Agent CRM: 99.5%.
- **Security:** Applicant financial data (referencing) encrypted at rest. Right-to-rent documents stored in private object storage with access log. PII masked in exported reports.
- **Compliance:** Tenancy deposits must record statutory protection scheme details. Mandatory property disclosure fields enforced per jurisdiction (EPC, gas safety, electrical certificate). Consent obtained for marketing communications (GDPR).
- **Accessibility:** WCAG 2.1 AA for search, listing detail, and application forms. Map must have non-map fallback view.
- **Mobile:** Property search and detail pages fully functional on mobile (responsive or native app). Agent CRM must be usable on tablet.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- Property vs. listing: is a property a permanent entity (with history across multiple listings), or does each listing stand alone?
- Offer model: is an offer a separate entity (multiple offers on one property), or a field on the property?
- Tenancy: single entity or split into Application → Agreement → ActiveTenancy → ClosedTenancy?
- Media: are floor plans, EPCs, and virtual tours stored as separate media types from photos?

### Mandatory entities for Real Estate
- **Property** — physical asset: address (structured), type (flat, house, land, commercial), bedrooms, bathrooms, size (m²/sqft), EPC rating, geo-coordinates.
- **Listing** — active marketing record: property reference, type (sale or rental), asking price or rent, status (active, under offer, sold/let, withdrawn), agent, published date, description, features.
- **Media** — asset: type (photo, floor plan, EPC certificate, virtual tour, video), URL, CDN path, display order.
- **Agent** — individual negotiator: name, email, phone, agency, active listing count.
- **Agency** — brokerage: name, address, logo, subscription plan, agents.
- **Enquiry** — lead: prospective buyer/renter, listing, message, channel, status (new, contacted, viewing booked, closed).
- **ViewingSlot** — available viewing time: listing, datetime, duration, booked flag.
- **Viewing** — booked viewing: slot, attendee (prospective buyer/renter), status (confirmed, completed, no-show, cancelled), notes.
- **Offer** _(sale)_ — submitted offer: listing, buyer, amount, conditions, status (submitted, under review, accepted, rejected, withdrawn).
- **TenancyApplication** — rental application: listing, applicant(s), move-in date, tenancy term, status.
- **ReferenceCheck** — referencing result: applicant, type (employment, landlord, credit), provider, status (pending, passed, failed), report URL.
- **TenancyAgreement** — legal document: application, property, parties, term dates, rent amount, deposit amount, signature status, signed document URL.
- **Tenancy** — active tenancy: agreement, status (active, ended), renewal count.
- **RentSchedule** — rent payment plan: tenancy, amount, frequency, next due date.
- **RentPayment** — individual rent transaction: tenancy, amount, due date, paid date, status, payment method.
- **Deposit** — tenancy deposit: tenancy, amount, protection scheme, scheme registration number, release status.
- **MaintenanceRequest** — repair request: tenancy, description, priority (emergency, urgent, routine), photos, status, assigned contractor.
- **SavedSearch** — user's search criteria saved for alerts: user, filters, alert frequency.
- **Mortgage** _(if applicable)_ — mortgage enquiry or saved calculation: applicant, property value, deposit, term, estimated monthly payment.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Data feed integration: does the platform need to ingest listings via RETS or RESO Web API from MLS or other portals?
- Webhooks: new listing matching saved search triggers notification? Rent payment received triggers landlord notification?
- Digital signature: integrated e-signature API (DocuSign, Adobe Sign, HelloSign)?
- Payment processing: rent collection via direct debit (GoCardless) or card?

### Typical endpoint groups
- **Listings** — search (with geo-filter), get detail, create, update, change status.
- **Properties** — create property, get property history, get all listings for property.
- **Media** — get upload URL, confirm upload, reorder, delete.
- **Enquiries** — submit enquiry, get enquiries (agent view), update status.
- **Viewings** — get available slots, book viewing, confirm, cancel, record outcome.
- **Offers** _(sale)_ — submit offer, counter-offer, accept, reject, withdraw.
- **Tenancy Applications** — submit application, get status, upload document.
- **Reference Checks** — initiate check, get status (webhook callback from provider).
- **Tenancy Agreements** — generate draft, send for signature, get signature status, get signed document.
- **Rent** — get schedule, record payment (webhook from payment provider), get arrears.
- **Maintenance** — submit request, update status, assign contractor, upload photo.
- **Saved Searches** — create, list, update, delete.
- **Alerts** — get notification history.
- **Mortgage** — calculate affordability, submit broker enquiry.
- **Admin** — listing moderation, user management, agency management.
- **Webhooks** — listing status change, saved search match, rent payment received, signature completed.

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Search experience: map-first (like Rightmove) or list-first with map toggle?
- Agent CRM: web-only, or must work on mobile tablet for valuations?
- Tenancy management: tenant-facing portal separate from landlord/property manager interface?

### Typical screens
- **Property Search — List View** — filter bar, property cards (photo, price, key details, save), sort, pagination.
- **Property Search — Map View** — interactive map with property pins, price labels, sidebar with results list.
- **Property Detail Page** — photo gallery, key details (price, bedrooms, size, EPC), description, floor plan, virtual tour, agent contact, book viewing button, map.
- **Viewing Booking** — available slot calendar, select slot, confirm details, confirmation screen.
- **Saved Searches** — list of saved searches with alert settings, recent matches preview.
- **Tenancy Application Form** — applicant details, co-applicant, employment information, references, document upload.
- **Tenant Portal — Dashboard** — rent status, next payment date, maintenance requests, tenancy documents.
- **Tenant Portal — Maintenance** — request form (description, priority, photo upload), request history.
- **Landlord / Property Manager Dashboard** — properties overview, rent arrears alerts, maintenance queue, tenancy renewals.
- **Agent CRM — Pipeline** — leads by stage (Kanban or list), follow-up tasks, today's viewings.
- **Agent CRM — Listing Editor** — property details form, photo upload, description, pricing, publish controls.
- **Offer Management** _(sale)_ — offer list for property, amount, status, accept/reject/counter.
- **Tenancy Agreement** — document preview with all fields, sign button, signatory status indicators.
- **Mortgage Calculator** _(if applicable)_ — inputs (price, deposit, term, rate type), monthly payment output, lender comparison table.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| MLS | Multiple Listing Service — database of property listings shared among agents |
| RESO | Real Estate Standards Organisation — defines data standards for property data exchange |
| EPC | Energy Performance Certificate — mandatory energy efficiency rating in many jurisdictions |
| Conveyancing | Legal process of transferring property ownership |
| Gazumping | When a seller accepts a higher offer after already accepting a lower one |
| Under Offer | Property where an offer has been made and accepted (sale not yet complete) |
| Let Agreed | Property where a tenancy has been agreed but not yet started |
| Stamp Duty | UK property purchase tax (equivalent: transfer tax in US) |
| AVM | Automated Valuation Model — algorithm-based property price estimate |
| Yield | Annual rental income as percentage of property value (used by investors) |
| Cap Rate | Capitalisation Rate — net operating income / property value (commercial RE) |
| LTV | Loan-to-Value ratio — mortgage amount as percentage of property value |
| Deposit protection | Legally required scheme to protect tenant deposits (UK: TDS, DPS, myDeposits) |
| Right to rent | UK legal requirement to verify tenant's right to reside in the country |
| Referencing | Background check on prospective tenant (employment, credit, previous landlord) |
| Guarantor | Third party who agrees to cover rent if tenant defaults |
| Leasehold | Property ownership where land is owned by freeholder for a fixed term |
| Freehold | Outright ownership of land and property |
| Service charge | Fee paid by leaseholders for maintenance of shared building areas |
| Ground rent | Annual payment by leaseholder to freeholder |
