# User Stories: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** `01_brief_lumen-goods.md`, `02_srs_lumen-goods.md`

## Epic Index

| # | Epic | User Stories |
|---|------|-------------|
| E-01 | Account & Auth | US-001 |
| E-02 | Catalog | US-002, US-003, US-006 |
| E-03 | Cart & Checkout | US-004, US-007, US-008, US-009, US-010 |
| E-04 | Orders & Returns | US-011 |
| E-05 | Privacy & Consent | US-005, US-015, US-016 |
| E-06 | Loyalty & Reviews | US-012, US-013, US-014 |
| E-07 | Admin | US-017, US-018, US-019, US-020 |

---

## E-01: Account & Auth

> Visitors can register, log in, and recover their account.

### US-001: Register and log in to a customer account

**As a** new or returning visitor,
**I want to** create an account or log in with my email and password,
**so that** I can save addresses, track orders, and manage my Lumen Circle membership.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-001
**FR Reference:** FR-001
**Priority:** Must
**Estimate:** 5 SP
**Notes:** Guest checkout is supported separately and does not require this story.

---

## E-02: Catalog

> Visitors can browse the catalog, find products, and view product details.

### US-002: Browse the catalog by category and filters

**As a** visitor,
**I want to** browse products by category and refine the list with filters (price, colour, material),
**so that** I can quickly find products that match my interests.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-002
**FR Reference:** FR-002
**Priority:** Must
**Estimate:** 3 SP
**Notes:** Filter values come from the Category and Product attribute schema.

---

### US-003: View product detail and add to cart

**As a** visitor,
**I want to** open a product detail page, choose a variant, and add it to my cart,
**so that** I can build up my order before checking out.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-003
**FR Reference:** FR-002, FR-003
**Priority:** Must
**Estimate:** 13 SP
**Notes:** Largest story in the backlog — covers PDP rendering, variant selection, stock check, cart line creation, and price recalculation. Consider splitting if team velocity is below 35 SP.

---

### US-006: Search the catalog

**As a** visitor,
**I want to** search products by keyword,
**so that** I can find what I want without browsing every category.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-006
**FR Reference:** FR-002
**Priority:** Should
**Estimate:** 5 SP

---

## E-03: Cart & Checkout

> Visitors can manage their cart and complete a purchase.

### US-004: View the cart

**As a** visitor,
**I want to** see the current contents of my cart with prices and totals at any time,
**so that** I know what I am about to buy.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-004
**FR Reference:** FR-004
**Priority:** Must
**Estimate:** 3 SP
**Notes:** Cart is persisted across sessions for logged-in customers and merged on login.

---

### US-007: Pay with card via Stripe

**As a** customer,
**I want to** pay for my order with my credit or debit card (or Apple Pay / Google Pay),
**so that** I can complete the purchase quickly with the payment method I already use.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-007
**FR Reference:** FR-005
**Priority:** Must
**Estimate:** 8 SP
**Notes:** Card data is collected by Stripe Elements and never reaches the backend. SCA is handled by Stripe.

---

### US-008: Pay with Klarna or SEPA

**As a** customer,
**I want to** pay with Klarna BNPL or SEPA direct debit,
**so that** I can use the payment method I prefer for larger purchases.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-008
**FR Reference:** FR-006
**Priority:** Must
**Estimate:** 8 SP

---

### US-009: Track an order and request a return

**As a** customer,
**I want to** see the live status of my order and request a return within 30 days,
**so that** I know when my order will arrive and can return items I don't want.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-009
**FR Reference:** FR-007
**Priority:** Must
**Estimate:** 8 SP
**Notes:** Return window is 30 days; legal minimum is 14. Refund within 14 days of return arrival.

---

### US-010: View order history

**As a** customer,
**I want to** see a paginated list of all my past orders,
**so that** I can review what I bought and reorder favourites.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-010
**FR Reference:** FR-008
**Priority:** Should
**Estimate:** 5 SP

---

## E-04: Orders & Returns

> Customers can manage their address book and consent state.

### US-011: Manage addresses and marketing consent

**As a** customer,
**I want to** save and edit shipping and billing addresses and choose whether I receive marketing emails,
**so that** checkout is faster and I only receive communications I want.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-011
**FR Reference:** FR-009
**Priority:** Must
**Estimate:** 3 SP
**Notes:** Marketing consent is opt-in only and timestamped for audit.

---

## E-05: Privacy & Consent

> Visitors and customers control how their data is used.

### US-005: Manage cookie and tracking consent

**As a** visitor,
**I want to** see a cookie consent banner on my first visit and to be able to change my consent later,
**so that** I control which trackers run on the site.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-005
**FR Reference:** FR-012
**Priority:** Must
**Estimate:** 5 SP

---

### US-015: Request a personal data export

**As a** customer,
**I want to** download all the personal data the store holds about me,
**so that** I can review it and exercise my GDPR rights.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-015
**FR Reference:** FR-013
**Priority:** Should
**Estimate:** 5 SP

---

### US-016: Request account deletion

**As a** customer,
**I want to** request deletion of my account and personal data,
**so that** the store no longer holds my information after I am done using it.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-016
**FR Reference:** FR-013
**Priority:** Should
**Estimate:** 7 SP
**Notes:** Order records required for accounting are anonymised, not removed.

---

## E-06: Loyalty & Reviews

> Customers earn benefits and contribute social proof.

### US-012: Submit a product review

**As a** customer who received a product,
**I want to** leave a star rating and review,
**so that** I can share my experience with future buyers.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-012
**FR Reference:** FR-010
**Priority:** Must
**Estimate:** 8 SP

---

### US-013: Save a product to my wishlist

**As a** customer,
**I want to** save products to a wishlist,
**so that** I can come back and buy them later.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-013
**FR Reference:** FR-010
**Priority:** Must
**Estimate:** 5 SP

---

### US-014: Subscribe to Lumen Circle

**As a** frequent customer,
**I want to** subscribe to Lumen Circle for €4.99/month,
**so that** I get free shipping and member-only pricing on every order.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-014
**FR Reference:** FR-011
**Priority:** Should
**Estimate:** 5 SP

---

## E-07: Admin

> Admins manage the catalog and process orders.

### US-017: Search and view customer orders

**As an** admin,
**I want to** search for an order by ID, customer email, or status and view its details,
**so that** I can answer support questions quickly.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-017
**FR Reference:** FR-015
**Priority:** Must
**Estimate:** 5 SP

---

### US-018: Manage products and stock

**As an** admin,
**I want to** create, update, and archive products, variants, and stock levels,
**so that** the catalog reflects what we actually sell.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-018
**FR Reference:** FR-015
**Priority:** Must
**Estimate:** 8 SP
**Notes:** Includes bulk stock adjustment for warehouse reconciliation.

---

### US-019: View revenue and order report

**As an** admin,
**I want to** see a revenue summary by day, week, or month with order count and average order value,
**so that** I can monitor business performance.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-019
**FR Reference:** FR-015
**Priority:** Should
**Estimate:** 8 SP

---

### US-020: Approve a return and issue a refund

**As an** admin or operations manager,
**I want to** approve a return, mark items as received, and issue a refund,
**so that** customers receive their money back promptly.

**Acceptance Criteria:** → `05_ac_lumen-goods.md` → US-020
**FR Reference:** FR-015
**Priority:** Should
**Estimate:** 7 SP

---

## Unplanned Backlog (post-MVP)

| US | Title | Epic | Priority | Estimate | Reason |
|----|-------|------|---------|---------|--------|
| US-021 | Multi-currency display (GBP) | E-02 Catalog | Could | 5 SP | Capacity exceeded — defer to v1.1 |
| US-022 | Multi-language storefront (DE / FR) | E-02 Catalog | Could | 8 SP | Deferred — requires i18n infrastructure |
| US-023 | Live chat support widget | — | Could | 3 SP | Deferred — third-party integration |
| US-024 | B2B / wholesale pricing tier | E-03 Checkout | Won't | 2 SP | Out of MVP scope |

---

## Coverage Summary

| Priority | Story Count | Story IDs |
|----------|------------|-----------|
| Must | 12 | US-001 – US-005, US-007 – US-009, US-011 – US-013, US-017, US-018 |
| Should | 8 | US-006, US-010, US-014 – US-016, US-019, US-020 |
| Could | 3 | US-021, US-022, US-023 |
| Won't | 1 | US-024 |

**Total stories:** 24
**Total epics:** 7
