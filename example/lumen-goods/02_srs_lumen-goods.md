# Software Requirements Specification (SRS): Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**Reference:** `01_brief_lumen-goods.md`

## 1. Introduction

### 1.1 Purpose

This document specifies the functional requirements for Lumen Goods — a direct-to-consumer e-commerce storefront for sustainable home goods serving the EU and UK markets. It serves as the primary reference for the engineering team, QA, and Operations during design, development, and acceptance testing.

### 1.2 Scope

**In scope:**
- Customer registration, login, and guest checkout.
- Catalog browsing: search, category navigation, filtering, product detail page.
- Cart, checkout, payment via Stripe (cards, Apple Pay, Google Pay), Klarna, SEPA.
- Order management: tracking, history, returns and refunds.
- Address book and saved payment methods.
- Wishlist and product reviews.
- Lumen Circle paid loyalty tier.
- GDPR data subject access requests and right to erasure.
- Cookie and tracking consent.
- Admin panel: catalog, orders, returns, customers, promotions, basic reports.

**Out of scope (post-MVP):**
- Native mobile apps (iOS / Android).
- Multi-language storefront (EN-only at launch).
- Multi-currency display (EUR-only at launch; GBP added in v1.1).
- B2B / wholesale pricing tiers.
- Subscription-box product type.

### 1.3 Definitions and Abbreviations

| Term | Definition |
|------|-----------|
| GMV | Gross Merchandise Value |
| SKU | Stock Keeping Unit — uniquely identifiable product variant |
| 3PL | Third-Party Logistics provider |
| BNPL | Buy Now, Pay Later |
| DSAR | Data Subject Access Request (GDPR) |
| PCI DSS | Payment Card Industry Data Security Standard |
| SCA | Strong Customer Authentication (PSD2) |
| Lumen Circle | Lumen Goods' paid monthly loyalty tier |

### 1.4 Document References

- Project Brief: `01_brief_lumen-goods.md`
- Project Principles: `00_principles_lumen-goods.md`

---

## 2. General Description

### 2.1 Product Context

Lumen Goods runs as a responsive web application served from a Node.js backend with a Postgres database. The system consists of:
- A customer-facing storefront (Next.js, also installable as a PWA).
- An admin panel (separate React app behind staff SSO).
- A REST API consumed by both frontends.
- Stripe and Klarna integration for payments.
- A managed tax service for destination-based VAT calculation.
- A 3PL integration (REST/SFTP) for UK fulfilment.

### 2.2 User Roles

| Role | Description | Permissions |
|------|-------------|------------|
| Guest | Unauthenticated visitor | Browse, add to cart, guest checkout |
| Customer | Registered shopper | All Guest actions plus address book, order history, wishlist, reviews, Lumen Circle |
| Lumen Circle Member | Customer with active loyalty subscription | All Customer actions plus free shipping and member pricing |
| Admin | Internal staff managing the store | Catalog, orders, returns, customers, promotions, reports |
| Operations Manager | Internal staff managing fulfilment | Order processing, returns, inventory adjustments |
| Payment Provider | External system (API) | Process payments and refunds, return webhook events |

### 2.3 Constraints

- **PCI DSS scope minimisation:** raw card data must never touch the Lumen Goods backend. Stripe Elements collects and tokenises cards in the browser; the backend stores only Stripe identifiers.
- **GDPR / UK GDPR:** lawful basis for marketing must be opt-in. Customers can request data export and erasure at any time. Processing must complete within 30 days.
- **EU consumer protection:** 14-day right of return on all physical products. Pricing must include VAT for the destination country.
- **Stock accuracy:** the system must reserve stock at the moment of cart-to-checkout transition. Overselling is unacceptable.
- **Accessibility:** the customer storefront must meet WCAG 2.1 AA.

### 2.4 Assumptions and Dependencies

- Stripe and Klarna sandbox environments are available throughout development.
- The 3PL provides a stable REST endpoint for stock and order events.
- A managed tax service (Stripe Tax or Avalara) is procured before sprint 2.
- Product photography and copy are delivered before sprint 2.
- The team consists of 4 full-stack developers and 1 QA engineer.

---

## 3. Functional Requirements

### FR-001: Customer Registration and Login

- **Description:** The system must allow visitors to create an account with email + password, log in, and reset a forgotten password. Guest checkout is also supported and does not require an account.
- **Actor:** Guest, Customer
- **Input:** Email, password (registration); email + password (login); email (password reset).
- **Output / Result:** Customer record created or session established; password reset email sent.
- **Business Rules:** Passwords must be at least 12 characters with one number and one symbol. Email confirmation is required before the first login. Failed login attempts are rate-limited to 10 per IP per minute. Password reset tokens expire in 1 hour.
- **Priority:** Must

---

### FR-002: Catalog Browsing and Product Detail

- **Description:** The system must present a browsable catalog with categories, filters, and a product detail page for each SKU.
- **Actor:** Guest, Customer
- **Input:** Visitor opens the storefront, navigates by category, search query, or product link.
- **Output / Result:** Listing pages with product cards, paginated; product detail pages with images, variants, stock status, price (incl. VAT), description, sustainability metadata, and reviews.
- **Business Rules:** Out-of-stock variants are visible but cannot be added to the cart. Price always displays incl. VAT for the visitor's destination country (defaulting to NL until selected). Search returns results from product title, description, and tags.
- **Priority:** Must

---

### FR-003: Add to Cart and Checkout

- **Description:** The system must let a visitor add product variants to a cart, modify quantities, and complete a checkout flow that captures address, shipping method, and payment.
- **Actor:** Guest, Customer
- **Input:** Selected variant, quantity, shipping address, shipping method, payment method.
- **Output / Result:** Order created with status "Pending payment" → "Paid" once the payment provider confirms; stock reserved at checkout transition; email confirmation sent.
- **Business Rules:** Stock is reserved when the customer enters checkout step 1 (reservation TTL = 15 minutes). If the reservation expires, the cart is reloaded and stock is re-validated. The order is created in the database only after the customer reaches the payment step. Orders without a confirmed payment within 30 minutes are cancelled and stock released.
- **Priority:** Must

---

### FR-004: View Cart Contents

- **Description:** The system must display the current cart with line items, prices incl. VAT, shipping estimate, and total.
- **Actor:** Guest, Customer
- **Input:** Visitor opens the cart icon.
- **Output / Result:** Cart page with line items, calculated subtotal, VAT, shipping estimate, and total.
- **Business Rules:** Cart contents are persisted in browser storage for guests and in the database for logged-in customers. Cart is merged on login. Prices recalculate when the destination country changes.
- **Priority:** Must

---

### FR-005: Stripe Card Payment

- **Description:** The system must accept payment via card (Visa, Mastercard, Amex), Apple Pay, and Google Pay through Stripe Elements.
- **Actor:** Customer, Payment Provider
- **Input:** Customer enters card details in the Stripe Elements iframe; Stripe returns a paymentIntentId.
- **Output / Result:** Order moves to "Paid" status when the Stripe webhook confirms payment_intent.succeeded.
- **Business Rules:** Card data never touches the Lumen Goods backend. SCA (3D Secure) is triggered automatically by Stripe when required. The order remains "Pending payment" until the webhook arrives — never on the client-side return.
- **Priority:** Must

---

### FR-006: Klarna BNPL and SEPA Payment

- **Description:** The system must accept payment via Klarna Pay Later (BNPL) and SEPA direct debit through Stripe's payment method APIs.
- **Actor:** Customer, Payment Provider
- **Input:** Customer selects Klarna or SEPA at checkout and is redirected to the provider's flow.
- **Output / Result:** Order moves to "Paid" (SEPA: "Awaiting payment confirmation") on webhook confirmation.
- **Business Rules:** Klarna availability is checked per destination country before showing the option. SEPA mandates are stored at the provider; the system records only the mandate reference. SEPA orders move to "Paid" only after the funds-cleared webhook (typically 1–3 days after authorisation).
- **Priority:** Must

---

### FR-007: Order Tracking and Returns

- **Description:** The system must let customers view order status, see tracking information once shipped, and request a return within 30 days of delivery.
- **Actor:** Customer
- **Input:** Customer opens order details; for return, selects items and reason.
- **Output / Result:** Order detail page with status timeline and tracking link; return request created with status "Awaiting drop-off"; return label generated.
- **Business Rules:** Returns are accepted for 30 days from the delivery date (legal minimum: 14 days; Lumen Goods extends voluntarily). Refund is processed within 14 days of return arrival at the warehouse. Customer is notified of each status change via email.
- **Priority:** Must

---

### FR-008: Order History

- **Description:** The system must display a paginated list of all orders for the authenticated customer.
- **Actor:** Customer
- **Input:** Authenticated session; optional filters (date range, status).
- **Output / Result:** Paginated list of orders (date, total, status, item count); link to detail page per order.
- **Business Rules:** Orders are displayed newest-first. All orders are retained for at least 7 years per accounting / tax requirements. Page size: 20 records.
- **Priority:** Should

---

### FR-009: Address Book and GDPR Consent

- **Description:** The system must allow customers to manage saved addresses and to record marketing consent (opt-in only).
- **Actor:** Customer
- **Input:** Address details (street, city, postcode, country); marketing consent toggles.
- **Output / Result:** Address saved with type (shipping / billing); consent recorded with timestamp and source.
- **Business Rules:** Default shipping and billing addresses are flagged. Marketing consent is opt-in with separate toggles for email and SMS. Consent changes are timestamped for audit.
- **Priority:** Must

---

### FR-010: Wishlist and Product Reviews

- **Description:** The system must allow authenticated customers to save products to a wishlist and submit reviews for products they have purchased.
- **Actor:** Customer
- **Input:** Add/remove product from wishlist; submit review (rating 1–5, title, body, optional photo).
- **Output / Result:** Wishlist updated; review submitted with status "Pending moderation" → "Published" after admin approval.
- **Business Rules:** Reviews are only accepted from customers who have a "Delivered" order containing the product. All reviews go through manual moderation before publication. Reviews can include one optional photo (max 5 MB).
- **Priority:** Must

---

### FR-011: Lumen Circle Loyalty Subscription

- **Description:** The system must allow customers to subscribe to the Lumen Circle paid loyalty tier and apply its benefits at checkout.
- **Actor:** Customer, Payment Provider
- **Input:** Customer selects "Join Lumen Circle"; agrees to monthly recurring fee.
- **Output / Result:** Stripe subscription created at €4.99/month; member status active; benefits applied at next checkout (free shipping, member pricing).
- **Business Rules:** Membership is monthly, cancellable at any time, and ends at the end of the billing cycle. Free shipping applies to orders ≥ €30. Member pricing is shown as a strike-through delta on product pages and in the cart. A failed renewal payment triggers a 7-day grace period before deactivation.
- **Priority:** Must

---

### FR-012: Cookie and Tracking Consent

- **Description:** The system must display a cookie consent banner on the first visit and let customers manage consent at any time.
- **Actor:** Guest, Customer
- **Input:** Visitor opens the site for the first time, or opens "Cookie preferences" from the footer.
- **Output / Result:** Consent banner with category toggles (necessary, analytics, marketing); selection persisted for 12 months; analytics and marketing scripts loaded only after explicit consent.
- **Business Rules:** Necessary cookies are always on. No analytics or marketing scripts may load before the visitor confirms consent. Consent is re-requested annually or when the cookie policy changes.
- **Priority:** Must

---

### FR-013: GDPR Data Subject Access Request

- **Description:** The system must let customers request a download of all personal data and request account deletion.
- **Actor:** Customer
- **Input:** Customer opens "Privacy" in account settings and selects "Export my data" or "Delete my account".
- **Output / Result:** Data export generated as a downloadable JSON archive within 24 hours; deletion request created and processed within 30 days.
- **Business Rules:** Data export includes profile, addresses, orders, reviews, wishlist, and consent log. Deletion anonymises (not removes) order records that are still required for accounting; PII is replaced with hash placeholders. Customer is notified by email when each request completes.
- **Priority:** Should

---

### FR-014: Personal Data Export Format

- **Description:** The system must produce DSAR exports in a machine-readable JSON archive that can be re-imported by the customer into another service if needed.
- **Actor:** Customer
- **Input:** Customer triggers FR-013 export.
- **Output / Result:** Downloadable `.zip` containing one JSON file per data category and a `manifest.json` describing the schema.
- **Business Rules:** The download link is a one-time, time-limited URL (valid for 7 days). The archive is encrypted at rest in object storage and deleted after 30 days.
- **Priority:** Should

---

### FR-015: Admin — Catalog and Order Management

- **Description:** The Admin must be able to manage the product catalog, process orders and returns, and view basic reports.
- **Actor:** Admin, Operations Manager
- **Input (catalog):** Create / update / archive product, variant, category, image, sustainability metadata, price; bulk stock adjustment.
- **Input (orders):** Search by order ID, customer email, status; mark as shipped; trigger refund; approve return.
- **Output / Result (catalog):** Product saved; changes published immediately; audit log entry written.
- **Output / Result (orders):** Order updated; customer notified by email; refund processed via Stripe.
- **Business Rules:** Price changes require Admin role (Operations Manager is read-only on price). All admin actions are logged in an immutable audit trail. Refunds are issued via the original payment method.
- **Priority:** Must

---

## 4. Interface Requirements

### 4.1 User Interfaces

The customer-facing storefront is a Next.js web application that doubles as an installable PWA. It must:
- Function on the latest 2 major versions of Chrome, Safari, Firefox, and Edge.
- Render the product detail page in ≤ 1 second TTFB on a 4G connection.
- Meet WCAG 2.1 AA accessibility on all customer pages.

The admin panel is a separate React application served behind staff SSO; it is not customer-accessible.

### 4.2 Software Interfaces (API)

The system exposes a REST API consumed by both the storefront and the admin panel. Customer endpoints use session cookies; admin endpoints use staff JWT. API versioning: `/api/v1/`.

### 4.3 External System Interfaces

| System | Interface type | Purpose |
|--------|---------------|---------|
| Stripe | REST API + Webhook + Stripe Elements | Card / Apple Pay / Google Pay / Klarna / SEPA payment, refunds, subscriptions |
| Managed Tax Service | REST API | Destination-based VAT calculation |
| 3PL (UK) | REST API + SFTP | Stock sync, order dispatch, return intake |
| Email service | SMTP / REST | Transactional emails (order confirmation, shipping, returns, password reset) |
| Object storage | S3-compatible | Product imagery, DSAR exports, return labels |

---

## 5. Non-functional Requirements

_(Detailed in `06_nfr_lumen-goods.md`)_

| Category | Summary | NFR Reference |
|----------|---------|---------------|
| Performance | Product page TTFB ≤ 500 ms p95; checkout API ≤ 300 ms p95 | NFR-001 |
| Scalability | Support 5,000 concurrent shoppers during a sale event | NFR-002 |
| Availability | 99.9% uptime monthly | NFR-003 |
| Security | Session cookies with SameSite=Strict, CSRF protection, rate limiting | NFR-004, NFR-005 |
| Compliance | GDPR / UK GDPR, PCI DSS scope, EU consumer protection | NFR-006, NFR-007 |
| Accessibility | WCAG 2.1 AA on the storefront | NFR-008 |
| Maintainability | Test coverage ≥ 80% on cart, checkout, payment, and stock-reservation logic | NFR-009 |

---

## 6. Priority Matrix (MoSCoW)

| Priority | FR Count | FR IDs |
|----------|---------|--------|
| Must | 11 | FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-009, FR-010, FR-011, FR-015 |
| Should | 3 | FR-008, FR-012, FR-013 |
| Could | 0 | — |
| Won't | 1 | FR-014 (machine-readable DSAR export deferred to v1.1 — initial export will be a human-readable PDF) |

> **Note:** FR-014 (machine-readable DSAR export) was reclassified from Must to Won't after legal review confirmed that the GDPR right to data portability is satisfied by a human-readable PDF for v1. JSON export will be promoted to Must before any future B2B contracts that include data portability commitments.
