# Technology Research: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** `02_srs_lumen-goods.md`, `07_datadict_lumen-goods.md`, `06_nfr_lumen-goods.md`

---

## Integration Map

| External System | Protocol | Direction | Purpose |
|-----------------|----------|-----------|---------|
| Stripe | REST API + Webhook + Stripe Elements | Bidirectional | Card / wallet / Klarna / SEPA payment, refunds, subscriptions |
| Managed Tax Service (Stripe Tax) | REST API | Outbound | Destination-based VAT calculation |
| 3PL (UK) | REST API + SFTP | Bidirectional | Stock sync, order dispatch, return intake |
| Email Service (Postmark) | REST API | Outbound | Transactional emails |
| Object Storage (S3) | S3 API | Bidirectional | Product imagery, return labels, DSAR exports |

---

## ADR-001: Frontend Framework — Next.js (App Router)

**Status:** Accepted

**Context:**
The customer storefront must serve product pages with TTFB ≤ 500 ms (NFR-001), be SEO-friendly (organic acquisition is a key channel), be installable as a PWA, and meet WCAG 2.1 AA (NFR-008).

**Options considered:**
| Option | Pros | Cons |
|--------|------|------|
| Next.js (App Router) | SSR/ISR for SEO, RSC reduces bundle, large ecosystem, team familiarity | Newer App Router still maturing |
| Remix | Similar SSR strengths, simpler data flow | Smaller ecosystem, team less familiar |
| SvelteKit | Smaller bundles, fast | Team would need to learn Svelte |

**Decision:** Next.js with the App Router. The team has Next.js experience, ISR fits the catalog (regenerate on product update), and React Server Components reduce the JavaScript shipped to the client — directly helping NFR-001 and NFR-008. The admin panel is a separate React app behind staff SSO; it does not need SSR.

**Consequences:**
- ISR revalidation hooks must be triggered from the admin product-update path so storefront pages refresh within NFR-001 limits.
- Catalog and PDP are statically generated where possible; the cart and checkout flows are client-side.

---

## ADR-002: Inventory Sync — Real-time Webhook vs Polling

**Status:** Accepted

**Context:**
Stock must be accurate across the Netherlands warehouse and the UK 3PL — overselling is unacceptable (RISK-01). The 3PL provides both a webhook stream and a polling endpoint.

**Options considered:**
| Option | Latency | Complexity | Notes |
|--------|---------|------------|-------|
| Webhook stream | < 5 s | Medium | Requires public endpoint, signature verification, retry handling |
| Polling every 5 minutes | 5 min | Low | Simple but stock could drift between polls |
| Hybrid: webhook + 5-min reconciliation | < 5 s | Medium-High | Webhooks for normal flow, polling as a safety net |

**Decision:** Hybrid. Webhook stream is the primary path; a reconciliation job runs every 5 minutes to detect any drift. If a webhook is missed (outage, signature failure), reconciliation catches it within 5 minutes — well below the human reaction time for stock issues during a sale.

**Consequences:**
- The reconciliation job must be idempotent and safe to run concurrently with webhooks.
- Stock changes from the webhook bump a `version` column; the reconciliation only writes if its read version is newer.

---

## ADR-003: Payment Integration — Stripe-Only vs Multi-Provider

**Status:** Accepted

**Context:**
The system must support cards, Apple Pay, Google Pay, Klarna BNPL, and SEPA direct debit. Stripe natively supports all of these via Payment Methods. Direct integration with Klarna would be an alternative.

**Options considered:**
| Option | Pros | Cons |
|--------|------|------|
| Stripe-only (with all methods routed through Stripe) | One integration, unified webhooks, Stripe Tax for VAT | Single point of failure (RISK-03); Stripe fees |
| Stripe for cards + direct Klarna | Lower Klarna fees | Two integrations, two webhook flows, two reconciliation jobs |

**Decision:** Stripe-only. Stripe handles card payments, wallets (Apple Pay, Google Pay), Klarna, and SEPA via a unified Payment Methods API. Stripe Tax also covers destination-based VAT (NFR-007). To mitigate single-point-of-failure risk (RISK-03), a fallback Stripe account in a different region will be configured before launch and toggled via a feature flag.

**Consequences:**
- All payment-related code goes through a `PaymentService` interface to keep the future fallback transparent.
- Webhook signature verification is the only auth on `POST /webhooks/stripe`.
- SLA terms with Stripe are reviewed annually.

---

## ADR-004: Data Storage — PostgreSQL + Redis

**Status:** Accepted

**Context:**
The data model (see `07_datadict_lumen-goods.md`) is strongly relational: Customer → Order → OrderLine → Variant, with foreign-key integrity and ACID requirements for financial records.

**Options considered:**
| Option | Pros | Cons |
|--------|------|------|
| PostgreSQL + Redis | ACID, FK constraints, JSONB for flexible fields, Redis for sessions/cart | Two systems to operate |
| MongoDB | Flexible schema | Weaker transactional guarantees; FK enforcement at app layer only |
| MySQL | Mature, ACID | Weaker JSONB story |

**Decision:** PostgreSQL for primary storage and Redis for sessions, guest carts, and stock-reservation locks. ACID transactions are non-negotiable for cart-to-order conversion (no double-charging, no overselling). Redis provides millisecond-latency reads for guest carts and supports atomic stock reservation via Lua scripts.

**Consequences:**
- Database migrations use Flyway to maintain a versioned schema history.
- Stock reservation logic uses a Redis Lua script for atomicity across multiple cart lines.
- Backup and PITR (point-in-time recovery) are configured for PostgreSQL with a 7-day retention.

---

## ADR-005: Tax Calculation — Stripe Tax vs In-house

**Status:** Accepted

**Context:**
NFR-007 requires destination-based VAT to be calculated correctly per country and product category. Building this in-house requires maintaining EU/UK VAT rates and rules indefinitely.

**Options considered:**
| Option | Pros | Cons |
|--------|------|------|
| Stripe Tax | Maintained by Stripe, handles EU + UK rates, integrated with Payment Intent | Per-transaction fee |
| Avalara | Most comprehensive | Higher cost, separate integration |
| In-house VAT engine | No fee | Ongoing maintenance burden, regulatory risk |

**Decision:** Stripe Tax. It is integrated with Stripe's Payment Intent API, covers all EU member states and the UK, and Stripe maintains the rate tables. The per-transaction cost is acceptable given the avoided maintenance burden and regulatory risk.

**Consequences:**
- VAT is calculated at the moment of order creation and snapshotted on every OrderLine for audit.
- A daily reconciliation job exports VAT collected per country into the accounting tool.
- If Stripe Tax becomes unavailable, the checkout flow blocks new orders (rather than risk incorrect VAT). This is documented in the runbook.

---

## Compliance Notes

| Topic | Requirement | Implementation |
|-------|-------------|----------------|
| GDPR | Customer PII encrypted at rest (NFR-005) | AES-256 column-level encryption for `Customer`, `Address`; no PII in logs |
| GDPR — DSAR | Export and deletion within 30 days | Asynchronous job triggered from account settings; archive stored in S3 with one-time URL (FR-013) |
| PCI DSS | Minimal scope (SAQ-A) | Stripe Elements collects card data in an iframe served by Stripe; backend never sees a PAN |
| EU Consumer Protection | 14-day return minimum | Lumen Goods extends to 30 days (FR-007) |
| EU VAT (One Stop Shop) | Destination-based VAT, quarterly OSS return | Stripe Tax + monthly export job to the accounting tool |
| Cookie consent | No analytics before consent (NFR-006) | Tag manager initialised only after consent banner accepted (FR-012) |
| Accessibility | WCAG 2.1 AA on storefront (NFR-008) | axe-core in CI; manual screen-reader audit before launch |
