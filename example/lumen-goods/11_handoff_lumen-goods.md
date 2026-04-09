# Development Handoff: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**References:** All pipeline artifacts

---

## 1. Artifact Inventory

| # | Artifact | File | Status |
|---|---------|------|--------|
| 0 | Project Principles | `00_principles_lumen-goods.md` | ✅ Final |
| 1 | Project Brief | `01_brief_lumen-goods.md` | ✅ Final |
| 2 | Requirements (SRS) | `02_srs_lumen-goods.md` | ✅ Final |
| 3 | User Stories | `03_stories_lumen-goods.md` | ✅ Final |
| 4 | Use Cases | `04_usecases_lumen-goods.md` | ✅ Final |
| 5 | Acceptance Criteria | `05_ac_lumen-goods.md` | ✅ Final |
| 6 | Non-functional Requirements | `06_nfr_lumen-goods.md` | ✅ Final |
| 7 | Data Dictionary | `07_datadict_lumen-goods.md` | ✅ Final |
| 7a | Technology Research | `07a_research_lumen-goods.md` | ✅ Final |
| 8 | API Contract | `08_apicontract_lumen-goods.md` | ✅ Final |
| 9 | Wireframes | `09_wireframes_lumen-goods.md` | ✅ Final |
| 10 | Validation Scenarios | `10_scenarios_lumen-goods.md` | ✅ Final |
| — | Risk Register | `00_risks_lumen-goods.md` | ✅ Final |
| — | Sprint Plan | `00_sprint_lumen-goods.md` | ✅ Final |

---

## 2. MVP Scope

**In MVP (20 User Stories across 4 sprints, 8 weeks):**

| Epic | Stories | Sprint |
|------|---------|--------|
| E-01 Account & Auth | US-001 | SP-02 |
| E-02 Catalog | US-002, US-003, US-006 | SP-01 |
| E-03 Cart & Checkout | US-004, US-007, US-008, US-009, US-010 | SP-01–SP-02 |
| E-04 Orders & Returns | US-011 | SP-02 |
| E-05 Privacy & Consent | US-005, US-015, US-016 | SP-01, SP-03 |
| E-06 Loyalty & Reviews | US-012, US-013, US-014 | SP-03 |
| E-07 Admin | US-017, US-018, US-019, US-020 | SP-04 |

**Out of MVP (post-launch):**
- US-021: Multi-currency display (GBP)
- US-022: Multi-language storefront (DE / FR)
- US-023: Live chat support
- US-024: B2B / wholesale pricing tier

---

## 3. Traceability Coverage

| Chain | Coverage | Uncovered |
|-------|---------|-----------|
| FR → US | 15/15 (100%) | — |
| Must US → AC | 13/13 (100%) | — |
| US → UC | 10/13 Must (77%) | US-004, US-005, US-011 (no UC needed — simple CRUD) |
| NFR → metric | 10/10 (100%) | — |
| Entity → FR | 12/12 (100%) | — |
| API endpoint → FR | 26/26 (100%) | — |
| WF → US | 6/6 screens → all Must US covered | — |
| Scenario FR coverage | 7/15 FRs (47%) | FR-001, FR-006, FR-008, FR-009, FR-010, FR-012, FR-013, FR-014 (covered by AC + unit tests) |

---

## 4. Recommended Development Sequence

1. **SP-00 (Setup):** CI/CD, DB schema (Flyway), Next.js scaffold, Stripe sandbox, 3PL sandbox, Stripe Tax sign-up.
2. **SP-01:** Catalog and checkout flow first — most of the storefront depends on PDP and cart. Stock reservation (US-003 / RISK-01) is the riskiest piece — tackle it early with the chaos test.
3. **SP-02:** Account, Klarna/SEPA, returns. Validate the 3PL return flow with the sandbox.
4. **SP-03:** Privacy and DSAR (RISK-04 mitigation). Lumen Circle subscription and reviews.
5. **SP-04:** Admin panel — can be developed in parallel with SP-03 once the Order and Product entities are stable.

---

## 5. Integration Prerequisites

Before sprint 1 begins, the following must be confirmed:

| Dependency | Owner | Required by |
|------------|-------|-------------|
| Stripe sandbox account + webhook URL registered | Tech Lead | SP-01 |
| Stripe Tax enabled with EU + UK rate coverage | Tech Lead | SP-01 |
| 3PL sandbox API credentials | Operations Manager | SP-02 |
| Postmark (or equivalent) transactional email API key | Tech Lead | SP-01 |
| Object storage bucket for product imagery and DSAR exports | Tech Lead | SP-01 |
| Privacy review with external consultant (RISK-04 mitigation) | Founder / CEO | Pre-launch |
| Accessibility audit booking with consultant (NFR-008) | Founder / CEO | Pre-launch |
| Final product photography and category copy | Marketing Lead | SP-02 |

---

## 6. Open Items

| # | Item | Severity | Owner | Target |
|---|------|---------|-------|--------|
| OI-001 | FR-014 (machine-readable JSON DSAR export) demoted to Won't for v1; promote to Must before any B2B contract with portability commitments | HIGH | Founder / CEO | Pre-B2B launch |
| OI-002 | Fallback Stripe account (RISK-03 mitigation) not yet provisioned | HIGH | Tech Lead | SP-02 start |
| OI-003 | Accessibility audit not yet scheduled | HIGH | Founder / CEO | SP-03 |
| OI-004 | Abandoned-cart email reminder flow deferred to v1.1 (RISK-02 contingency) | MEDIUM | Marketing Lead | v1.1 |
| OI-005 | Scenario coverage for FR-001, FR-006, FR-008–FR-010, FR-012–FR-014 is AC-only; add E2E tests before v1.1 | MEDIUM | QA | v1.1 |

---

## 7. Key Decisions Carried Forward

| Decision | Rationale | Artifact |
|----------|-----------|---------|
| Next.js App Router for the storefront | SSR/ISR for SEO; RSC for performance budget | ADR-001 |
| Hybrid stock sync (webhook + 5-min reconciliation) | Real-time accuracy with safety net against missed events | ADR-002 |
| Stripe-only for all payment methods | Single integration; Stripe Tax also covers VAT | ADR-003 |
| PostgreSQL + Redis | ACID + atomic stock reservation via Lua | ADR-004 |
| Stripe Tax for VAT | Avoids in-house VAT engine maintenance | ADR-005 |

---

## 8. Definition of Done — Project Level

The MVP is ready for production launch when:

- [ ] All 20 planned User Stories have passed acceptance testing.
- [ ] No CRITICAL or HIGH open `/analyze` findings.
- [ ] NFR-001 (PDP TTFB ≤ 500 ms p95) and NFR-002 (5,000 concurrent shoppers) validated by load test.
- [ ] NFR-003 (99.9% uptime) monitoring in place with alerting configured.
- [ ] Accessibility audit completed with no Critical or Serious findings open (NFR-008).
- [ ] Privacy review completed; cookie banner, DSAR, and consent log verified (NFR-006).
- [ ] PCI SAQ-A self-assessment completed (NFR-005).
- [ ] Security penetration test completed; no Critical or High findings open.
- [ ] Stripe Tax validated against accountant test cases for top 5 destination countries.
- [ ] Return flow tested end-to-end with the 3PL sandbox.
- [ ] Stock reservation chaos test passes with zero overselling.
