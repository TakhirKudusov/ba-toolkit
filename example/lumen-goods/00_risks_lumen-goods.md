# Risk Register: Lumen Goods

**Domain:** ecommerce
**Date:** 2026-04-09
**Slug:** lumen-goods
**Sources:** `01_brief_lumen-goods.md`, `02_srs_lumen-goods.md`, `06_nfr_lumen-goods.md`, `07a_research_lumen-goods.md`, `08_apicontract_lumen-goods.md`

---

## Summary

| Priority | Count |
|---------|-------|
| 🔴 Critical | 1 |
| 🟡 High | 2 |
| 🟢 Medium | 3 |
| ⚪ Low | 1 |
| **Total** | **7** |

---

## Risk Register

| ID | Title | Category | Probability | Impact | Score | Priority | Status |
|----|-------|----------|:-----------:|:------:|:-----:|---------|--------|
| RISK-01 | Inventory drift between warehouse and 3PL causes overselling | Technical | 4 | 5 | 20 | 🔴 Critical | Open |
| RISK-02 | Cart abandonment exceeds the 55% target | Business | 3 | 4 | 12 | 🟡 High | Open |
| RISK-03 | Stripe payment downtime during a sale event | External | 3 | 3 | 9 | 🟡 High | Open |
| RISK-04 | GDPR compliance gaps surface late | Compliance | 3 | 2 | 6 | 🟢 Medium | Open |
| RISK-05 | VAT calculation errors cause customer disputes | Compliance | 2 | 3 | 6 | 🟢 Medium | Open |
| RISK-06 | Scope creep from new category requests mid-sprint | Business | 2 | 3 | 6 | 🟢 Medium | Open |
| RISK-07 | Engineering team unfamiliar with e-commerce edge cases | Business | 2 | 1 | 2 | ⚪ Low | Open |

---

## Risk Details

### RISK-01 — Inventory drift between warehouse and 3PL causes overselling

**Category:** Technical
**Probability:** 4 / 5 — Likely
**Impact:** 5 / 5 — Critical
**Score:** 20 🔴 Critical
**Status:** Open
**Source:** `07a_research_lumen-goods.md` (ADR-002), `02_srs_lumen-goods.md` (constraint)

**Description:**
Stock is split between the Netherlands warehouse and the UK 3PL. Webhook delays, missed reconciliations, or concurrent checkouts on the same SKU can cause two customers to buy the last unit. Overselling damages trust, requires refunds, and creates manual operations work — the highest-impact risk in the project.

**Mitigation:**
Implement the hybrid sync model from ADR-002: 3PL webhook stream as the primary path plus a 5-minute reconciliation job. Use Redis with a Lua script for atomic stock reservation across cart lines (NFR-010). Reservation TTL of 15 minutes guarantees stale reservations are released. Run a chaos test that fires concurrent checkouts on the same SKU before launch.

**Contingency:**
If oversell happens, the system flags the order for manual review and emails the customer immediately with an offer (refund + 15% discount on the next order). Operations follows up within one business day.

**Owner:** Tech Lead

---

### RISK-02 — Cart abandonment exceeds the 55% target

**Category:** Business
**Probability:** 3 / 5 — Possible
**Impact:** 4 / 5 — Major
**Score:** 12 🟡 High
**Status:** Open
**Source:** `01_brief_lumen-goods.md` (Goal #3)

**Description:**
The success metric of cart abandonment ≤ 55% is below industry average. Common causes — slow page loads, mandatory account creation, surprise shipping costs, limited payment methods — would push the rate higher and undermine GMV.

**Mitigation:**
- Guest checkout supported from day 1 (FR-001 / FR-003).
- One-page checkout (WF-003) instead of multi-step.
- Multiple payment methods including Apple/Google Pay and Klarna BNPL (FR-005, FR-006).
- Shipping cost shown in the cart drawer before checkout starts (WF-002).
- Storefront performance budget (NFR-001) protects perceived speed.

**Contingency:**
If abandonment exceeds 60% in the first month, trigger an abandoned-cart email reminder flow (deferred from MVP). Assess at the first post-launch retro.

**Owner:** Marketing Lead / Product

---

### RISK-03 — Stripe payment downtime during a sale event

**Category:** External
**Probability:** 3 / 5 — Possible
**Impact:** 3 / 5 — Moderate
**Score:** 9 🟡 High
**Status:** Open
**Source:** `07a_research_lumen-goods.md` (ADR-003)

**Description:**
All payment methods route through Stripe (ADR-003). A Stripe outage during a sale event would block all new orders. Stripe's own SLA is 99.99%, but outages have happened in the past.

**Mitigation:**
Configure a fallback Stripe account in a different region before launch and toggle via a feature flag (`PaymentService` interface). Subscribe to Stripe status alerts. Surface a friendly "Payments are temporarily unavailable" page with an email-capture form when a circuit breaker trips.

**Contingency:**
If the primary Stripe account is unreachable for more than 5 minutes during a sale, manually flip the feature flag to the fallback account. The Tech Lead and Operations Manager are paged.

**Owner:** Tech Lead

---

### RISK-04 — GDPR compliance gaps surface late

**Category:** Compliance
**Probability:** 3 / 5 — Possible
**Impact:** 2 / 5 — Minor
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `01_brief_lumen-goods.md`, `06_nfr_lumen-goods.md` (NFR-006)

**Description:**
GDPR fines are significant (up to 4% of global turnover), and ICO/AP enforcement against e-commerce sites has been increasing. Gaps that typically surface late: missing cookie banner, marketing consent buried in T&Cs, no DSAR flow, marketing scripts loading before consent.

**Mitigation:**
Privacy review in sprint 0 with an external consultant. Cookie banner (FR-012) and DSAR flow (FR-013) built before the launch sprint. Privacy regression tests in CI to ensure analytics scripts cannot fire before consent.

**Contingency:**
If a gap is found post-launch, immediately disable the offending tracker via the tag manager and patch within 24 hours. Document and report any breach as required.

**Owner:** Founder / CEO (DPO)

---

### RISK-05 — VAT calculation errors cause customer disputes

**Category:** Compliance
**Probability:** 2 / 5 — Unlikely
**Impact:** 3 / 5 — Moderate
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `07a_research_lumen-goods.md` (ADR-005)

**Description:**
Destination-based VAT is complex: rates vary by country and by product category, the One Stop Shop returns must reconcile, and customers will dispute incorrect totals. A wrong VAT rate is also a legal issue.

**Mitigation:**
Use Stripe Tax (ADR-005) for all VAT calculation. Snapshot the VAT rate on every OrderLine for audit. Validate against accountant test cases for the top 5 destination countries before launch.

**Contingency:**
If a customer disputes a VAT calculation, refund the VAT difference immediately and patch the rule in Stripe Tax. Quarterly reconciliation with the accountant catches systemic drift.

**Owner:** Founder / CEO

---

### RISK-06 — Scope creep from new category requests mid-sprint

**Category:** Business
**Probability:** 2 / 5 — Unlikely
**Impact:** 3 / 5 — Moderate
**Score:** 6 🟢 Medium
**Status:** Open
**Source:** `01_brief_lumen-goods.md`

**Description:**
The Marketing Lead has expressed interest in "maybe" launching with subscription boxes or B2B wholesale tiers in addition to the D2C MVP. Without a formal change control process, these can be re-introduced mid-sprint and inflate scope.

**Mitigation:**
Establish a formal change request process documented in `11_handoff_lumen-goods.md`. Scope is frozen at sprint planning. New features go through `/stories` and `/estimate` before sprint assignment.

**Contingency:**
Defer mid-sprint additions to the next sprint. Any business case for launch-blocking scope must be raised at the sprint planning meeting with a documented trade-off.

**Owner:** Founder / CEO

---

### RISK-07 — Engineering team unfamiliar with e-commerce edge cases

**Category:** Business
**Probability:** 2 / 5 — Unlikely
**Impact:** 1 / 5 — Negligible
**Score:** 2 ⚪ Low
**Status:** Open
**Source:** `01_brief_lumen-goods.md`

**Description:**
The team has limited prior e-commerce experience. Concepts like partial shipment, refund accounting, abandoned cart, stock reservation, and SCA flows may be misunderstood and lead to edge-case defects.

**Mitigation:**
Domain onboarding session in SP-00. The Business Analyst presents the e-commerce domain reference and walks through the project glossary. Pair-programming on the first checkout integration.

**Contingency:**
Schedule a BA review checkpoint after the first end-to-end checkout flow is implemented. Review AC against actual behaviour before sprint 1 closes.

**Owner:** Business Analyst
