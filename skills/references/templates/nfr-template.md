# Non-functional Requirements: [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** `02_srs_[SLUG].md`, `00_principles_[SLUG].md`
**Standard:** ISO/IEC 25010:2011 Software Quality Model

> Every NFR maps to one of the 8 ISO 25010 characteristics: Functional Suitability, Performance Efficiency, Compatibility, Usability, Reliability, Security, Maintainability, Portability. Project-specific extensions (Compliance, Localisation, Observability) are marked as such and reference the parent ISO characteristic.

---

## Performance Efficiency (ISO 25010)

### NFR-001: [Sub-characteristic — Time behaviour]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Time behaviour |
| **Description** | [Page / operation / endpoint] response time target |
| **Metric** | p95 latency in milliseconds |
| **Acceptance threshold** | < 300ms p95, < 800ms p99 |
| **Verification** | Load test (k6 / Locust) running [scenario], measured by APM (Datadog / New Relic / Grafana) |
| **Source** | NFR-baseline from `00_principles_[SLUG].md` §5 / FR-NNN constraint / regulatory requirement |
| **Rationale** | [Why this target — competitive benchmark, user-perception threshold, contractual SLA] |
| **Priority** | Must |
| **Linked FR** | FR-[NNN] |

---

### NFR-002: [Sub-characteristic — Capacity]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Capacity |
| **Description** | Concurrent users / requests per second the system supports |
| **Metric** | Concurrent users at peak; sustained RPS |
| **Acceptance threshold** | [N concurrent users; N RPS sustained for 30 min without error rate > 0.1%] |
| **Verification** | Load test scenario [name], pass / fail at the threshold |
| **Source** | [Brief goal G-N or stakeholder] |
| **Rationale** | [Expected growth, peak events — Black Friday, end-of-quarter, exam day] |
| **Priority** | Should |
| **Linked FR** | FR-[NNN] |

---

## Reliability (ISO 25010)

### NFR-003: [Sub-characteristic — Availability]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Availability |
| **Description** | Service uptime target |
| **Metric** | Uptime % over rolling 30-day window |
| **Acceptance threshold** | 99.9% (8.76 hours downtime/year) |
| **Verification** | Status page measurement, third-party uptime monitor |
| **Source** | [SLA contract / regulatory requirement] |
| **Rationale** | [Customer-facing SLA, internal commitment] |
| **Priority** | Must |
| **Linked FR** | All customer-facing FRs |

### NFR-004: [Sub-characteristic — Recoverability]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Recoverability |
| **Description** | Disaster-recovery RTO / RPO |
| **Metric** | RTO (Recovery Time Objective) in hours; RPO (Recovery Point Objective) in minutes |
| **Acceptance threshold** | RTO < 4h, RPO < 15min |
| **Verification** | Documented runbook, tested via DR drill quarterly |
| **Source** | [Compliance / business continuity policy] |
| **Rationale** | [Cost of downtime, regulatory requirement] |
| **Priority** | Must |

---

## Security (ISO 25010)

### NFR-005: [Sub-characteristic — Confidentiality]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Confidentiality |
| **Description** | Encryption at rest and in transit |
| **Metric** | Encryption algorithm + key length |
| **Acceptance threshold** | TLS 1.2+ in transit; AES-256 at rest |
| **Verification** | TLS scan, infrastructure config review, pen-test |
| **Source** | [SOC 2 / PCI DSS / HIPAA / GDPR] |
| **Rationale** | Regulatory baseline + customer trust |
| **Priority** | Must |

### NFR-006: [Sub-characteristic — Authenticity / Accountability]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Authenticity, Accountability |
| **Description** | Authentication strength, audit trail per user action |
| **Metric** | MFA coverage, audit log completeness |
| **Acceptance threshold** | MFA mandatory for admin role; every PII access logged with actor + timestamp |
| **Verification** | Audit log inspection, security review |
| **Source** | [SOC 2 CC6.1, regulatory requirement] |
| **Rationale** | Compliance + incident-response capability |
| **Priority** | Must |

---

## Compatibility (ISO 25010)

### NFR-007: [Sub-characteristic — Interoperability]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Interoperability |
| **Description** | Data-exchange formats with external systems |
| **Metric** | Supported formats |
| **Acceptance threshold** | JSON over REST + CSV export + webhook OUT |
| **Verification** | Integration tests with each external system |
| **Source** | [Stakeholder name / partner contract] |
| **Rationale** | [Why these formats — partner constraints] |
| **Priority** | Must |

---

## Usability (ISO 25010)

### NFR-008: [Sub-characteristic — Accessibility]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Accessibility (Usability sub-characteristic in ISO 25010) |
| **Description** | WCAG conformance level |
| **Metric** | WCAG 2.1 conformance level |
| **Acceptance threshold** | WCAG 2.1 AA on all customer-facing surfaces |
| **Verification** | Automated (axe-core) + manual testing with NVDA, JAWS, VoiceOver |
| **Source** | [Section 508 / EN 301 549 / domain reference] |
| **Rationale** | Legal requirement (EU public sector, US federal) + customer base inclusion |
| **Priority** | Must |

---

## Maintainability (ISO 25010)

### NFR-009: [Sub-characteristic — Testability]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Testability |
| **Description** | Automated test coverage target |
| **Metric** | Unit + integration test coverage % |
| **Acceptance threshold** | ≥ 80% line coverage on core domain modules |
| **Verification** | CI report on every PR |
| **Source** | [Internal engineering standard] |
| **Rationale** | Catch regressions, support refactoring |
| **Priority** | Should |

---

## Portability (ISO 25010)

### NFR-010: [Sub-characteristic — Adaptability]

| Field | Value |
|-------|-------|
| **Sub-characteristic** | Adaptability |
| **Description** | Browser / OS / device support matrix |
| **Metric** | Supported browser × OS × device combinations |
| **Acceptance threshold** | Latest 2 major versions of Chrome, Safari, Firefox, Edge; iOS 15+, Android 10+ |
| **Verification** | Cross-browser test suite |
| **Source** | [User analytics on existing audience] |
| **Rationale** | Coverage of 95%+ of expected user base |
| **Priority** | Should |

<!-- Add NFR sections as needed. Every NFR maps to an ISO 25010 characteristic. -->

---

## FR → NFR Coverage Matrix

Forward traceability from each Functional Requirement in `02_srs_[SLUG].md` §3 to the NFRs that govern its quality. A Must-priority FR with no linked NFR is flagged — every customer-facing Must FR should have at least one Performance, Reliability, or Security NFR attached.

| FR ID | FR Title | Linked NFRs | Coverage Status |
|-------|----------|-------------|-----------------|
| FR-001 | [title] | NFR-001, NFR-003, NFR-005 | ✓ |
| FR-002 | [title] | NFR-001, NFR-005 | ✓ |
| FR-003 | [title] | (uncovered) | ✗ |

---

## Priority Summary by ISO 25010 Characteristic

| ISO 25010 Characteristic | NFRs | Must | Should | Could |
|--------------------------|------|------|--------|-------|
| Performance Efficiency | NFR-001, NFR-002 | 1 | 1 | 0 |
| Reliability | NFR-003, NFR-004 | 2 | 0 | 0 |
| Security | NFR-005, NFR-006 | 2 | 0 | 0 |
| Compatibility | NFR-007 | 1 | 0 | 0 |
| Usability | NFR-008 | 1 | 0 | 0 |
| Maintainability | NFR-009 | 0 | 1 | 0 |
| Portability | NFR-010 | 0 | 1 | 0 |
| Functional Suitability | (covered by FRs) | — | — | — |
