# Non-functional Requirements: [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** `02_srs_[SLUG].md`, `00_principles_[SLUG].md`

---

## NFR-001: Performance

| Attribute | Requirement | Measurement Method |
|-----------|------------|-------------------|
| [Page / operation] | [Target, e.g. < 2s p95] | [Lighthouse / load test / APM] |

**Rationale:** [Why this target matters for this project.]

---

## NFR-002: Scalability

| Attribute | Requirement | Measurement Method |
|-----------|------------|-------------------|
| Concurrent users | [N at peak] | [Load test scenario] |
| Data volume | [N records, N GB] | [Capacity model] |

**Rationale:** [Expected growth, peak events.]

---

## NFR-003: Availability & Reliability

| Service | SLA | Maintenance Window |
|---------|-----|--------------------|
| [Service name] | 99.9% | [Sun 02:00–04:00 UTC] |

**RTO:** [Recovery Time Objective, e.g. < 4h]
**RPO:** [Recovery Point Objective, e.g. < 1h]

---

## NFR-004: Security

| Control | Requirement |
|---------|-------------|
| Authentication | [e.g. JWT, OAuth 2.0, MFA for admin] |
| Authorisation | [e.g. RBAC, row-level security] |
| Data in transit | [TLS 1.2+] |
| Data at rest | [AES-256] |
| [Other control] | [requirement] |

**Compliance standard:** [PCI DSS / HIPAA / GDPR / none]

---

## NFR-005: Maintainability

| Attribute | Requirement |
|-----------|-------------|
| Code coverage | [≥ 80% unit test coverage] |
| Deployment | [CI/CD, zero-downtime deployments] |
| Logging | [Structured JSON logs, retained N days] |
| Alerting | [P1 alert → on-call within 5 min] |

---

## NFR-006: Usability & Accessibility

| Attribute | Requirement |
|-----------|-------------|
| Accessibility | [WCAG 2.1 AA] |
| Browser support | [Chrome, Safari, Firefox — latest 2 versions] |
| Mobile | [Responsive, iOS 15+, Android 10+] |
| Language | [EN / RU / other] |

---

## NFR-007: [Additional Category]

| Attribute | Requirement | Measurement Method |
|-----------|------------|-------------------|
| [attribute] | [requirement] | [method] |

<!-- Add or remove NFR sections based on project needs. Numbering: NFR-001, NFR-002, ... -->

---

## Priority Summary

| ID | Category | Priority |
|----|----------|---------|
| NFR-001 | Performance | Must |
| NFR-002 | Scalability | Should |
| NFR-003 | Availability | Must |
| NFR-004 | Security | Must |
| NFR-005 | Maintainability | Should |
| NFR-006 | Usability | Should |
