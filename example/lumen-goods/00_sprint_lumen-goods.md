# Sprint Plan: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**Sprint length:** 2 weeks
**Team velocity:** 35 SP per sprint
**Sources:** `03_stories_lumen-goods.md`, `00_risks_lumen-goods.md`, `02_srs_lumen-goods.md`

---

## Summary

| Sprint | Goal | Stories | Points | Capacity |
|--------|------|:-------:|:------:|:--------:|
| SP-00 | Setup: environment, CI/CD, Next.js scaffold, Stripe sandbox | — | — | — |
| SP-01 | Visitors can browse the catalog and complete a card checkout | 6 | 34 SP | 97% |
| SP-02 | Customers can register, manage addresses, return orders, view history | 5 | 29 SP | 83% |
| SP-03 | Privacy and consent, wishlist, reviews, Lumen Circle | 5 | 30 SP | 86% |
| SP-04 | Admin panel: products, orders, returns, reports | 4 | 28 SP | 80% |
| **Total** | | **20** | **121 SP** | |

**Planned:** 20 stories / 121 SP across 4 sprints (8 weeks)
**Unplanned backlog:** 4 stories / 18 SP

---

## Sprint Details

### SP-00 — Setup and environment

**Duration:** Week 0 (pre-sprint)
**Capacity:** Setup only — no Story Points assigned

**Tasks:**
- Configure CI/CD pipeline (GitHub Actions): lint, test, Lighthouse perf check, Docker build on every PR.
- Provision PostgreSQL + Redis on staging.
- Scaffold the Next.js storefront with the App Router (ADR-001).
- Establish baseline DB schema (Flyway migration v1) from `07_datadict_lumen-goods.md`.
- Confirm Stripe sandbox account, register webhook endpoint, sign up for Stripe Tax.
- Confirm 3PL sandbox API access for stock and order events.
- Domain onboarding session: team reviews the e-commerce domain reference and project glossary.

**Definition of Done for SP-00:**
- [ ] All developers can run the project locally with `docker-compose up`.
- [ ] Staging storefront accessible via HTTPS with a "hello world" PDP route.
- [ ] CI pipeline passes on a "hello world" endpoint.
- [ ] Stripe webhook successfully receives a test event in staging.

---

### SP-01 — Visitors can browse the catalog and complete a card checkout

**Duration:** Weeks 1–2
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-002 | Browse the catalog by category and filters | E-02 Catalog | Must | — | 3 SP |
| US-003 | View product detail and add to cart | E-02 Catalog | Must | RISK-01 ↑ | 13 SP |
| US-004 | View the cart | E-03 Cart & Checkout | Must | — | 3 SP |
| US-007 | Pay with card via Stripe | E-03 Cart & Checkout | Must | RISK-03 ↑ | 8 SP |
| US-005 | Manage cookie and tracking consent | E-05 Privacy | Must | RISK-04 ↑ | 5 SP |
| US-006 | Search the catalog | E-02 Catalog | Should | — | 5 SP (cut to 2 if velocity tight) |

**Sprint total:** 34 SP (with US-006 reduced) / 35 SP capacity (97%)

**Definition of Done for SP-01:**
- [ ] All stories pass their Acceptance Criteria (`05_ac_lumen-goods.md`).
- [ ] PDP TTFB ≤ 500 ms p95 verified in load test (k6, 200 concurrent users).
- [ ] Stripe webhook idempotency confirmed (duplicate webhooks do not double-process).
- [ ] Stock reservation atomicity proved with concurrent-checkout chaos test.
- [ ] Cookie banner blocks analytics and marketing scripts before consent.

---

### SP-02 — Customers can register, manage addresses, return orders, view history

**Duration:** Weeks 3–4
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-001 | Register and log in to a customer account | E-01 Account & Auth | Must | — | 5 SP |
| US-008 | Pay with Klarna or SEPA | E-03 Cart & Checkout | Must | RISK-03 ↑ | 8 SP |
| US-009 | Track an order and request a return | E-03 Cart & Checkout | Must | — | 8 SP |
| US-010 | View order history | E-03 Cart & Checkout | Should | — | 5 SP |
| US-011 | Manage addresses and marketing consent | E-04 Orders & Returns | Must | — | 3 SP |

**Sprint total:** 29 SP / 35 SP capacity (83%) — slack reserved for Stripe edge-case fixes from SP-01.

**Definition of Done for SP-02:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Klarna eligibility check verified for NL, DE, FR, UK destinations.
- [ ] SEPA mandate captured and funds-cleared webhook handled.
- [ ] Return flow tested end-to-end with the 3PL sandbox.
- [ ] Return window and item-not-returnable rules verified.

---

### SP-03 — Privacy and consent, wishlist, reviews, Lumen Circle

**Duration:** Weeks 5–6
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-012 | Submit a product review | E-06 Loyalty & Reviews | Must | — | 8 SP |
| US-013 | Save a product to my wishlist | E-06 Loyalty & Reviews | Must | — | 5 SP |
| US-014 | Subscribe to Lumen Circle | E-06 Loyalty & Reviews | Should | — | 5 SP |
| US-015 | Request a personal data export | E-05 Privacy | Should | RISK-04 ↑ | 5 SP |
| US-016 | Request account deletion | E-05 Privacy | Should | RISK-04 ↑ | 7 SP |

**Sprint total:** 30 SP / 35 SP capacity (86%)

**Definition of Done for SP-03:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Review submission only allowed from verified buyers.
- [ ] Wishlist limit of 200 items enforced.
- [ ] Lumen Circle subscription created via Stripe and benefits applied at checkout.
- [ ] DSAR export and deletion flows complete within 30 days; deletion anonymises rather than removes order records.

---

### SP-04 — Admin panel: products, orders, returns, reports

**Duration:** Weeks 7–8
**Capacity:** 35 SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-017 | Search and view customer orders | E-07 Admin | Must | — | 5 SP |
| US-018 | Manage products and stock | E-07 Admin | Must | — | 8 SP |
| US-019 | View revenue and order report | E-07 Admin | Should | — | 8 SP |
| US-020 | Approve a return and issue a refund | E-07 Admin | Should | — | 7 SP |

**Sprint total:** 28 SP / 35 SP capacity (80%)

**Definition of Done for SP-04:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] Product price changes restricted to Admin role; Operations Manager can edit stock only.
- [ ] Bulk CSV stock adjustment is atomic — partial failures roll back.
- [ ] Refunds via the original payment method tested for card, Klarna, and SEPA.
- [ ] All admin actions logged in the immutable audit trail.

---

## Unplanned Backlog

| US | Title | Epic | Priority | Estimate | Reason |
|----|-------|------|---------|---------|--------|
| US-021 | Multi-currency display (GBP) | E-02 Catalog | Could | 5 SP | Capacity exceeded — defer to v1.1 |
| US-022 | Multi-language storefront (DE / FR) | E-02 Catalog | Could | 8 SP | Deferred — requires i18n infrastructure |
| US-023 | Live chat support widget | — | Could | 3 SP | Deferred — third-party integration |
| US-024 | B2B / wholesale pricing tier | E-03 Cart & Checkout | Won't | 2 SP | Out of MVP scope |

---

## Assumptions

- Team velocity: 35 SP per sprint based on 4 full-stack developers (SP values calibrated using US-001 as 5 SP reference anchor).
- SP-00 is a setup week; its effort is not tracked in Story Points.
- Frontend and backend are developed in parallel within each sprint.
- No hard release deadline; plan targets 8-week MVP window from SP-01 start.
- RISK-01 and RISK-03 elevated stories (US-003, US-007, US-008) placed in earliest possible sprints to validate mitigations before mid-project.
