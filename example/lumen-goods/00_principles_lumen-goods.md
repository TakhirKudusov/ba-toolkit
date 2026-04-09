# Project Principles: Lumen Goods

**Version:** 1.0
**Date:** 2026-04-09
**Domain:** ecommerce
**Slug:** lumen-goods

## 1. Artifact Language

All artifacts are generated in: **English**

## 2. ID Conventions

| Artifact | Format | Example |
|----------|--------|---------|
| Functional Requirements | FR-NNN | FR-001 |
| User Stories | US-NNN | US-001 |
| Use Cases | UC-NNN | UC-001 |
| Acceptance Criteria | AC-NNN-NN | AC-001-01 |
| Non-functional Requirements | NFR-NNN | NFR-001 |
| Architecture Decisions | ADR-NNN | ADR-001 |
| Data Entities | PascalCase (English) | OrderLine |
| API Endpoints | REST path | POST /orders |
| Wireframes | WF-NNN | WF-001 |
| Validation Scenarios | SC-NNN | SC-001 |
| Risks | RISK-NN | RISK-01 |
| Sprints | SP-NN | SP-01 |

## 3. Traceability Requirements

Mandatory links — violations flagged as **CRITICAL** by `/analyze` and `/trace`:

- Every FR must have at least one linked US (after `/stories`).
- Every Must-priority US must have at least one AC (after `/ac`).
- Every NFR must have a measurable metric.
- Every WF must link to at least one US.

Recommended links — violations flagged as **HIGH**:

- Must-priority US should have a linked UC (or documented exception).
- Every Data Entity should link to at least one FR or US.
- Every API endpoint should link to at least one FR or US.

Optional links — violations flagged as **MEDIUM**:

- Should-priority US may skip UC.
- Could/Won't items may be undocumented in later artifacts.

## 4. Definition of Ready

An artifact is ready to `/done` when all of the following are true:

### Functional Requirement (FR)
- [ ] Description present and unambiguous.
- [ ] Actor identified (not "the system" or "the user" without role).
- [ ] Priority assigned (MoSCoW).
- [ ] Input/Output specified.

### User Story (US)
- [ ] Role, Action, and Value filled.
- [ ] Priority assigned.
- [ ] Linked FR reference present.

### Use Case (UC)
- [ ] Actor, Preconditions, Main Flow, and at least one Exceptional Flow present.
- [ ] Linked US reference present.

### Acceptance Criterion (AC)
- [ ] Given / When / Then all present and specific.
- [ ] Type specified (positive / negative / boundary).
- [ ] Linked US reference present.

### NFR
- [ ] Category specified.
- [ ] Measurable metric present (numeric target, not adjective).
- [ ] Verification method specified.

### Data Entity
- [ ] All attributes have types and constraints.
- [ ] FK references point to existing entities.

### API Endpoint
- [ ] Request and Response schemas present.
- [ ] At least one error code documented.
- [ ] Linked FR/US present.

### Wireframe (WF)
- [ ] All four states present: default, loading, empty, error.
- [ ] Navigation links (from / to) specified.
- [ ] Linked US present.

## 5. NFR Baseline

The following NFR categories are required for this project:

- **Performance:** product page TTFB, checkout API latency targets.
- **Scalability:** concurrent shopper capacity during sale peaks.
- **Availability:** uptime SLA with numeric target.
- **Security:** authentication, payment data isolation, fraud detection.
- **Compliance:** GDPR / UK GDPR, PCI DSS scope minimisation, EU consumer protection law.
- **Accessibility:** WCAG 2.1 AA on the customer storefront.

## 6. Quality Gates

For `/analyze` findings:

- **CRITICAL:** must be resolved. `/done` is blocked.
- **HIGH:** must be documented with a resolution plan before `/handoff`.
- **MEDIUM:** documented and may be deferred to post-MVP.
- **LOW:** informational only.

## 7. Output Folder Structure

**Mode:** subfolder

All artifacts are saved under `example/lumen-goods/`.

## 8. Project-Specific Notes

- The platform must never store raw card data — Stripe handles all card collection via Stripe Elements; only the Stripe `paymentIntentId` is persisted.
- All monetary values are stored in the smallest currency unit (cents) and displayed with formatting applied at the presentation layer.
- VAT is destination-based and calculated by a managed tax service; the calculated VAT is stored on every OrderLine for audit.
- Stock reservation must be atomic at checkout — overselling is unacceptable and is treated as a CRITICAL bug.
- All customer PII (name, email, address) is encrypted at rest. The audit log captures who accessed which customer record from the admin panel.
