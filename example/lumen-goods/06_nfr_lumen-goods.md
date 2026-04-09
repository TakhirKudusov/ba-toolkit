# Non-functional Requirements: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** `01_brief_lumen-goods.md`, `02_srs_lumen-goods.md`, `03_stories_lumen-goods.md`

---

## NFR-001: Storefront Page Performance

**Category:** Performance
**Metric:** Product detail and category pages must serve a TTFB ≤ 500 ms at the 95th percentile (p95) under normal load. The cart and checkout APIs (`POST /cart/items`, `POST /orders/:id/confirm`) must respond in ≤ 300 ms p95.
**Rationale:** Slow product pages directly correlate with bounce and cart abandonment. The Google Core Web Vitals "Good" threshold for TTFB is 800 ms; Lumen Goods targets faster.
**Verification:** Load test with k6 at 500 concurrent users; synthetic monitoring on key pages every 5 minutes; Lighthouse perf score ≥ 90 in CI.
**FR Reference:** FR-002, FR-003
**Priority:** Must

---

## NFR-002: Concurrent Shopper Capacity

**Category:** Scalability
**Metric:** The system must support 5,000 concurrent shoppers (active sessions) without degrading NFR-001. Sale events typically peak at 3× the daily average.
**Rationale:** Year-1 GMV target of €1.5M, divided by an average order value of €60, gives ~25,000 orders. With a 2% conversion rate, peak sale-event traffic can reach 5,000 concurrent shoppers.
**Verification:** Load test at 5,000 concurrent sessions; monitor p95 and error rate (must remain < 0.1%).
**FR Reference:** FR-002, FR-003
**Priority:** Must

---

## NFR-003: Platform Availability

**Category:** Availability
**Metric:** 99.9% uptime measured monthly (≤ 43.8 minutes of unplanned downtime per month). Planned maintenance windows excluded.
**Rationale:** Downtime during a sale event causes direct revenue loss and erodes trust.
**Verification:** Uptime monitoring via external probe (e.g., Pingdom) with 1-minute check interval. Reported monthly.
**FR Reference:** FR-002, FR-003, FR-005, FR-006, FR-007
**Priority:** Must

---

## NFR-004: Authentication and Session Security

**Category:** Security
**Metric:** Customer sessions must use cookies with `HttpOnly`, `Secure`, and `SameSite=Strict`. CSRF protection on all state-changing endpoints. Failed login attempts rate-limited to 10 per IP per minute. Password hashing uses bcrypt cost 12.
**Rationale:** Prevents session hijacking, CSRF, credential stuffing, and offline brute-force attacks.
**Verification:** Penetration test; automated CSRF test in CI; rate-limit test.
**FR Reference:** FR-001
**Priority:** Must

---

## NFR-005: Data Encryption and PCI Scope

**Category:** Security
**Metric:** All customer PII (name, email, address, phone) must be encrypted at rest using AES-256. All client–server communication must use TLS 1.2 or higher. Raw card data must never reach the Lumen Goods backend — all card collection happens via Stripe Elements; the backend stores only Stripe identifiers.
**Rationale:** GDPR mandates protection of personal data at rest. PCI DSS scope minimisation reduces audit cost and breach impact.
**Verification:** Infrastructure audit; TLS scan (SSL Labs grade ≥ A); database encryption configuration review; PCI SAQ-A self-assessment annually.
**FR Reference:** FR-001, FR-005, FR-009
**Priority:** Must

---

## NFR-006: GDPR and UK GDPR Compliance

**Category:** Compliance
**Metric:**
- Marketing consent must be opt-in (FR-009).
- DSAR (export and deletion) requests must complete within 30 days (FR-013).
- Cookie consent banner must block analytics and marketing scripts before consent (FR-012).
- A consent log entry must be written for every consent change.
**Rationale:** Mandatory under GDPR (EU) and UK GDPR. Non-compliance carries fines up to 4% of global turnover.
**Verification:** Manual acceptance testing per privacy checklist; automated regression test for the cookie banner; quarterly DSAR drill.
**FR Reference:** FR-009, FR-012, FR-013
**Priority:** Must

---

## NFR-007: EU Consumer Protection

**Category:** Compliance
**Metric:**
- Returns accepted for at least 14 days (Lumen Goods extends to 30 — FR-007).
- Prices displayed must include VAT for the destination country.
- Refunds processed within 14 days of return arrival.
- Order confirmation email sent within 5 minutes of payment success.
**Rationale:** EU Consumer Rights Directive (2011/83/EU) and UK equivalent.
**Verification:** Acceptance testing per checklist; automated regression for the VAT-inclusive price display.
**FR Reference:** FR-002, FR-003, FR-007
**Priority:** Must

---

## NFR-008: Storefront Accessibility

**Category:** Accessibility
**Metric:** The customer-facing storefront must meet WCAG 2.1 AA on all pages: home, category, product detail, cart, checkout, account.
**Rationale:** EU Accessibility Act (EAA) applies to e-commerce from June 2025. Beyond legal compliance, accessibility broadens the customer base.
**Verification:** Automated axe-core scans in CI; manual screen-reader audit on key pages by an accessibility consultant before launch.
**FR Reference:** FR-002, FR-003
**Priority:** Must

---

## NFR-009: Test Coverage

**Category:** Maintainability
**Metric:** Unit + integration test coverage ≥ 80% on the following modules: cart, checkout, payment integration, stock reservation, refund processing, and Lumen Circle subscription.
**Rationale:** High-risk financial and inventory logic must have automated regression coverage to prevent silent regressions.
**Verification:** Coverage report generated by CI on every PR merge; coverage gate blocks merge if below threshold.
**FR Reference:** FR-003, FR-005, FR-006, FR-007, FR-011
**Priority:** Must

---

## NFR-010: Stock Reservation Latency

**Category:** Performance
**Metric:** Stock reservation at the cart-to-checkout transition must complete in ≤ 100 ms p95 and must be atomic across all cart lines.
**Rationale:** Slow or non-atomic reservation causes overselling, which is unacceptable for inventory accuracy.
**Verification:** Integration test that simulates concurrent checkouts on the same SKU; chaos test that kills the reservation worker mid-transaction.
**FR Reference:** FR-003
**Priority:** Should
