# Domain Reference: On-demand / Services Marketplace

Domain-specific knowledge for on-demand and services marketplace projects: ride-hailing, food delivery, home services (cleaning, repairs, plumbing), task marketplace, beauty and wellness, pet care, freelance marketplaces, tutoring platforms.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Service category: ride-hailing, home services, food delivery (logistics layer), freelance tasks, beauty/wellness, tutoring, pet care, other?
- Supply side: vetted professionals (background-checked), open marketplace (self-registration), or employed staff?
- Booking model: instant matching (like Uber), scheduled booking, or request/quote flow (provider proposes price)?
- Pricing model: fixed pricing, dynamic/surge pricing, provider sets own price, auction/bidding?
- Monetisation: commission on transaction, subscription for providers, booking fee, advertising?

### Typical business goals
- Minimise time-to-match between client request and provider acceptance.
- Maximise provider utilisation and income (to retain supply side).
- Build trust on both sides through reviews, verification, and dispute resolution.
- Reduce cancellation rate and no-show incidents.
- Expand to new service categories or cities with minimal operational overhead.

### Typical risks
- Supply-demand imbalance in specific geographies or time slots.
- Provider quality inconsistency — reputational risk.
- Safety incidents: background checks, insurance, liability.
- Payment disputes and fraudulent bookings.
- Regulatory: gig worker classification laws (employee vs. contractor), local licensing for some services (electricians, doctors).

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: client (requester), service provider (executor), admin, support agent?
- Provider onboarding: self-registration with document upload, background check, manual approval?
- Search and matching: geo-based search radius, category/skill filter, availability calendar?
- Booking flow: instant-book or request-and-confirm (provider must accept)?
- Payment timing: pre-authorisation at booking, charge on completion, or subscription?
- Cancellation policy: free cancellation window, cancellation fee after window, provider cancellation penalties?
- Reviews: two-sided (client reviews provider, provider reviews client)?
- Dispute resolution: automated or support-agent workflow?

### Typical functional areas
- Provider discovery (search, filter by category, location, availability, rating).
- Provider profile (bio, services offered, pricing, portfolio, reviews, availability).
- Booking / request flow (service selection, date/time, address, notes, payment).
- Real-time provider tracking (ride-hailing, delivery sub-category).
- In-app messaging between client and provider.
- Payment processing (charge, split, payout to provider).
- Reviews and ratings (two-sided, moderated).
- Provider onboarding (registration, document verification, background check).
- Provider scheduling and availability management.
- Notifications (booking confirmed, provider en-route, service started, completed, payment receipt).
- Cancellation and refund handling.
- Dispute management.
- Admin panel (provider management, booking management, payouts, reports).
- Promotions and referral programmes.

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Critical client flows: search provider, book service, track/await provider, pay, leave review?
- Critical provider flows: receive and accept booking, navigate to client, complete service, receive payout?
- Admin flows: approve provider, handle dispute, issue refund, suspend account?

### Typical epics
- Provider Discovery and Search.
- Provider Profile.
- Booking and Request Flow.
- Real-time Tracking (if applicable).
- In-app Messaging.
- Payment, Pricing, and Payouts.
- Reviews and Ratings.
- Provider Onboarding and Verification.
- Availability and Scheduling.
- Notifications.
- Cancellations and Refunds.
- Dispute Resolution.
- Promotions and Referrals.
- Admin and Operations.

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Matching failure: no provider available in area or time slot — what is the fallback?
- Provider no-show: how is client compensated? How is provider penalised?
- Safety incident: how does the client report a safety concern during a service?
- Payment failure: booking confirmed but payment fails on completion — recovery flow?

### Typical exceptional flows
- No provider available in search radius — widen radius suggestion, notify client when availability opens.
- Provider declines booking — auto-reassign to next match or return booking to pool.
- Provider no-show — client notification, automatic refund or rebooking credit, provider penalty.
- Client cancels after provider en-route — cancellation fee applied, provider compensated.
- Payment fails on service completion — retry flow, provider payout held until resolution.
- Dispute raised post-service — freeze review period, support agent reviews evidence, resolution applied.
- Background check fails during onboarding — provider rejected, notification with appeal option.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Matching SLA: maximum acceptable time from booking to provider assignment?
- Cancellation window: exact duration of free cancellation period?
- Review window: how long after service completion can client and provider leave reviews?
- Payout schedule: when are funds released to provider after service completion?
- Refund rules: full/partial refund — under what conditions?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Geographic scope: city, national, international — impacts map provider and localisation requirements.
- Concurrent bookings at peak: expected simultaneous active bookings?
- Matching latency requirement: how quickly must a match be made (for instant-book models)?
- Offline-first provider app: must the provider app work with intermittent connectivity?

### Mandatory NFR categories for On-demand
- **Matching Performance:** Provider matching must return results within 3s. For instant-match models, provider assignment must complete within 5s of client confirmation.
- **Real-time Tracking:** Location update interval ≤ 10s for active bookings. Client tracking page reflects provider position within 15s.
- **Scalability:** System must handle 5× peak load during demand surges (events, holidays) without degradation.
- **Payment Reliability:** Payment processing failure rate < 0.1%. All payment events idempotent — no double charges on retries.
- **Availability:** Booking and matching service: 99.9% SLA. Provider app backend: 99.9%.
- **Security:** Payment instrument data never stored server-side — tokenised via payment provider. Provider documents stored in private object storage.
- **Trust & Safety:** Review moderation response within 24 hours of report. Suspicious account activity triggers automated review within 1 hour.
- **Regulatory:** Gig worker classification compliance per jurisdiction (inform legal). Service-specific licence verification where legally required (medical, electrical, etc.).

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- User model: are client and provider the same user model (switching roles) or separate entities?
- Booking state machine: what is the full lifecycle of a booking (requested → accepted → in-progress → completed / cancelled)?
- Payout: is payout calculated per booking or batched weekly/monthly?
- Location: is provider location tracked only during active bookings, or continuously while on-duty?

### Mandatory entities for On-demand
- **User** — unified account: name, contact, profile photo, role flags (isClient, isProvider), verification status.
- **ProviderProfile** — professional profile: services offered, bio, hourly rate or price list, portfolio, average rating, onboarding status.
- **ProviderDocument** — verification documents: type (ID, licence, certificate), upload, review status.
- **ServiceCategory** — taxonomy of services offered on the platform.
- **Availability** — provider schedule: recurring rules (Mon–Fri 9–18) and exceptions (holidays, blocked slots).
- **Booking** — service request: client, provider, service, date/time, address, status lifecycle, price breakdown.
- **BookingMessage** — in-booking chat: sender, content, timestamp.
- **Payment** — booking payment: amount, fee breakdown (client charge, platform commission, provider earning), status.
- **Payout** — provider payout: amount, bookings included, payout method, status, scheduled date.
- **Review** — two-sided: reviewer, reviewee, booking reference, rating (1–5), text, response, moderation status.
- **Dispute** — booking dispute: raised by, reason, evidence, status, resolution, support agent.
- **Promotion** — discount or referral: type, value, conditions, usage count, expiry.
- **Notification** — channel (push, SMS, email), event type, status.
- **Location** — provider real-time location: lat, lon, timestamp, accuracy (stored only during active booking unless consented otherwise).

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Webhooks: booking status changes to third-party integrators? Provider payout processing notification?
- Real-time: messaging and tracking via WebSocket or long-polling?
- Maps and geocoding: provider — which map SDK for provider navigation (Google Maps, Apple Maps, Mapbox)?

### Typical endpoint groups
- **Search & Discovery** — search providers by category, location, date/time, rating, price.
- **Provider Profile** — get profile, get reviews, get availability, get pricing.
- **Booking** — create booking (request or instant), confirm, start service, complete service, cancel.
- **Tracking** — get live provider location for active booking.
- **Messaging** — get conversation, send message (REST + WebSocket channel).
- **Payments** — create payment intent, confirm charge, get payment breakdown.
- **Payouts** — get payout history, trigger manual payout (admin), update payout method.
- **Reviews** — submit review, get reviews for provider/client, report review.
- **Provider Onboarding** — submit profile, upload document, get onboarding status.
- **Availability** — get calendar, set recurring schedule, block slots.
- **Disputes** — create dispute, submit evidence, get status, resolve (admin).
- **Promotions** — apply promo code, get referral link, get eligible promotions.
- **Notifications** — get preferences, update preferences, get history.
- **Admin** — provider approval, account suspension, refund override, reports.

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Home screen for client: search-first (like Uber), category browse (like UrbanClapper), or personalised feed?
- Provider view: simple schedule and booking list, or full business management dashboard?
- Mobile-first or web + mobile?

### Typical screens
- **Client Home** — category grid or search bar, nearby providers, recent bookings, promotions.
- **Search Results** — provider cards (photo, rating, price, distance), filters, map toggle.
- **Provider Profile** — hero photo, bio, services and prices, availability, reviews, book button.
- **Booking Flow** — service selection → date/time picker → address → booking summary → payment.
- **Active Booking / Tracking** — provider location on map, ETA, messaging button, status banner.
- **Booking Detail** — service summary, provider info, timeline, payment receipt, review prompt.
- **Review Screen** — star rating, text input, optional photo, submit.
- **Client Bookings History** — upcoming and past bookings, quick rebook action.
- **Provider — Schedule View** — day/week calendar, upcoming bookings, availability blocks.
- **Provider — Booking Request** — client info, service details, accept/decline buttons.
- **Provider — Earnings** — payout history, pending earnings, bank account management.
- **Dispute Screen** — booking reference, reason selection, evidence upload, submit.
- **Admin — Provider Management** — pending approvals, active providers, suspension controls.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| Supply side | Providers, drivers, freelancers — the entities who perform services |
| Demand side | Clients or customers — the entities who request services |
| Matching | Algorithm that connects a demand-side request to a supply-side provider |
| Instant booking | Booking confirmed automatically without provider manual acceptance |
| Request flow | Client submits a request; provider explicitly accepts or declines |
| Surge pricing | Dynamic price increase during periods of high demand |
| Gig worker | Independent contractor who provides services via a platform |
| Utilisation rate | Percentage of provider's available time that is booked |
| Cancellation rate | Percentage of bookings cancelled (by either side) |
| Commission | Platform's fee taken from each transaction (percentage of booking value) |
| Payout | Transfer of earned funds from platform to provider |
| Escrow | Platform holds payment from client until service completion, then releases to provider |
| Two-sided review | Both client and provider can rate each other after a booking |
| Background check | Third-party verification of a provider's criminal record and identity |
| Onboarding | Process for new providers to register, verify documents, and be approved |
| Referral | Incentive programme where existing users recruit new users |
