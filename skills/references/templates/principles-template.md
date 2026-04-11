# Project Principles: [PROJECT_NAME]

**Version:** 1.0
**Status:** Draft | In Review | Approved
**Date:** [DATE]
**Domain:** [DOMAIN]
**Slug:** [SLUG]

## 1. Artifact Language

All artifacts are generated in: [LANGUAGE]

## 2. ID Conventions

| Artifact | Format | Example |
|----------|--------|---------|
| Functional Requirements | FR-NNN | FR-001 |
| User Stories | US-NNN | US-001 |
| Use Cases | UC-NNN | UC-001 |
| Acceptance Criteria | AC-NNN-NN | AC-001-01 |
| Non-functional Requirements | NFR-NNN | NFR-001 |
| Architecture Decisions | ADR-NNN | ADR-001 |
| Data Entities | PascalCase (English) | UserAccount |
| API Endpoints | REST path | POST /users |
| Wireframes | WF-NNN | WF-001 |
| Validation Scenarios | SC-NNN | SC-001 |
| Risks | RISK-NN | RISK-01 |
| Sprints | SP-NN | SP-01 |
| Implementation Tasks | T-NN-NNN | T-04-007 |
| Analyse findings | A-NN | A-01 |
| Brief Goals | G-N | G-1 |

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

An artifact is ready to `/done` when all of the following are true. The baseline below mirrors the v3.7.0+ artifact-template field set; project-specific additions go in §8.

### Functional Requirement (FR)
- [ ] Description present and unambiguous.
- [ ] Actor identified (not "the system" or "the user" without role).
- [ ] Priority assigned (MoSCoW).
- [ ] Input/Output specified.
- [ ] **Source** field present (which stakeholder, brief goal G-N, regulatory requirement, or parent FR drove this).
- [ ] **Verification method** specified (Test / Demo / Inspection / Analysis per IEEE 830 §7).
- [ ] **Rationale** documented (why this requirement exists, not just what).
- [ ] FR is grouped under a feature area (`### 3.N` in `02_srs_*.md`).

### User Story (US)
- [ ] Persona named (named persona with role and one-line context, not bare job title).
- [ ] Action and Value filled.
- [ ] Priority assigned (MoSCoW).
- [ ] **Business Value Score** assigned (1–5 or H/M/L).
- [ ] **Size** estimate present (XS / S / M / L / XL or Story Points).
- [ ] Linked FR reference present.
- [ ] **Depends on** field set (other story IDs or `—`).
- [ ] **Definition of Ready** checklist or reference to this principles section.
- [ ] **INVEST self-check** confirms Independent · Negotiable · Valuable · Estimable · Small · Testable.

### Use Case (UC)
- [ ] **Goal in Context** present (which Brief goal G-N this UC serves).
- [ ] **Scope** specified (System / Subsystem / Component) and **Level** specified (User-goal / Summary / Subfunction).
- [ ] Primary Actor and Supporting Actors listed.
- [ ] **Stakeholders and Interests** table present (Cockburn discipline — at least 2 stakeholders).
- [ ] Pre-conditions and Trigger present.
- [ ] Main Success Scenario as a numbered table.
- [ ] At least one Exception Flow present.
- [ ] **Success Guarantees** and **Minimal Guarantees** distinguished in post-conditions.
- [ ] **Source** field present (linked US/FR).

### Acceptance Criterion (AC)
- [ ] Given / When / Then all present, specific, and verifiable (no "the system handles correctly").
- [ ] **Type** specified (Positive / Negative / Boundary / Performance / Security).
- [ ] **Source** present (which business rule from `02_srs_*.md` drove this AC).
- [ ] **Verification** method specified (Automated test / Manual test / Observed in production).
- [ ] Linked US reference present.
- [ ] Linked NFR present for performance and security ACs.

### NFR
- [ ] **ISO/IEC 25010 characteristic** specified (one of the 8: Functional Suitability / Performance Efficiency / Compatibility / Usability / Reliability / Security / Maintainability / Portability).
- [ ] Measurable metric present (numeric target, not adjective).
- [ ] **Acceptance threshold** present separately from the metric.
- [ ] Verification method specified.
- [ ] **Source** present.
- [ ] **Rationale** present.
- [ ] Linked FR or US present.

### Data Entity
- [ ] **Source** field present (which FR/US introduced this entity).
- [ ] **Owner** field present (which team curates this data).
- [ ] **Sensitivity classification** present (Public / Internal / Confidential / PII / PCI / PHI / Financial).
- [ ] All attributes have **logical types** (not DBMS-specific) and constraints.
- [ ] FK references point to existing entities, with cascade rule specified.
- [ ] **State machine** documented for entities with more than two distinct lifecycle states.

### API Endpoint
- [ ] **Source** present (FR-NNN that drove this endpoint).
- [ ] Request and Response schemas present.
- [ ] At least one error code documented.
- [ ] Linked FR/US present.
- [ ] **Idempotency** marker present (Idempotent / Not idempotent / Idempotent via `Idempotency-Key` header).
- [ ] **Required scope** specified (or "public" for unauthenticated paths).
- [ ] **SLO** linked to an NFR.
- [ ] **Verification** method specified (contract test / consumer-driven contract test / integration test).

### Wireframe (WF)
- [ ] **Source** present (US-NNN this screen serves).
- [ ] All **8 canonical states** described that apply: Default / Loading / Empty / Loaded / Partial / Success / Error / Disabled.
- [ ] Navigation links (from / to) specified.
- [ ] Linked US present.
- [ ] **Linked AC** present (scenarios this screen verifies).
- [ ] **Linked NFR** present for performance- and accessibility-sensitive screens.

### Risk
- [ ] **Probability**, **Impact**, **Velocity** scored (per ISO 31000 + PMBOK 7).
- [ ] **Treatment strategy** classified (Avoid / Reduce / Transfer / Accept).
- [ ] **Owner** assigned.
- [ ] **Review cadence** set.

### Implementation Task (T-NN-NNN, from `/implement-plan`)
- [ ] At least one `references` id present (FR / US / AC / Entity / Endpoint / WF / SC).
- [ ] `dependsOn` list points only at task ids that exist in the same plan.
- [ ] `definitionOfDone` checklist present, with at least one hook tied to a linked AC.
- [ ] Phase assignment matches the canonical 9-phase ladder.

## 5. NFR Baseline (ISO/IEC 25010)

NFR categories follow **ISO/IEC 25010:2011** Software Quality Model. The following ISO 25010 characteristics are required for this project regardless of domain — `/nfr` reads this list verbatim and treats it as a mandatory checklist:

- **Security** — confidentiality (encryption at rest and in transit), authentication strength, audit trail.
- **Reliability** — availability SLA with a numeric target, RTO / RPO for disaster recovery.
- **Compatibility** — applicable laws and data retention policy *(historically labelled "Compliance" but maps to ISO 25010 Compatibility + Functional Suitability sub-characteristics)*.

[ADDITIONAL_NFR_CATEGORIES — list other ISO 25010 characteristics that are mandatory for this project, e.g.:
- **Performance Efficiency** — required if the project has user-facing latency or throughput targets.
- **Usability** — required if WCAG 2.1 AA accessibility is mandated.
- **Maintainability** — required if the project must hand off to a different team post-launch.
- **Portability** — required if multi-cloud or vendor-neutral hosting is a constraint.
]

## 6. Quality Gates

For `/analyze` findings:

- **CRITICAL:** must be resolved. `/done` is blocked.
- **HIGH:** [BLOCK_OR_WARN] — [PROJECT_DECISION].
- **MEDIUM:** documented and may be deferred.
- **LOW:** informational only.

## 7. Testing Strategy

**Strategy:** TDD | Tests-after | Integration-only | Manual-only | None

| Strategy | Means | When `/implement-plan` task templates embed "Tests to write first" |
|----------|-------|--------------------------------------------------------------------|
| TDD | Tests written before implementation; red → green → refactor | Yes — every task with linked AC gets a "Tests to write first" sub-block |
| Tests-after | Implementation first, tests immediately after | No — task DoD just lists the AC scenarios that must pass |
| Integration-only | No unit tests; integration tests at the API or UI layer | No — integration test harness is set up in Phase 1 |
| Manual-only | Tests are manual QA scripts run before release | No — task DoD references manual scenario IDs from `/scenarios` |
| None | Prototype / spike — no automated tests at all | No — explicit `// no test` marker on every task |

`/implement-plan` reads this section to decide whether to embed test specifications in each task. Default is **TDD** for production-grade systems.

## 8. Code Review and Branching

**Branching model:** trunk-based | GitHub flow | GitFlow | other
**Required reviewers per PR:** [N]
**Merge gate:** [CI green + N reviews / CODEOWNERS approval / specific reviewer]

## 9. Stakeholder Decision Authority

Who can approve a change to these principles, and to which sections.

| Section | Decision authority | Notes |
|---------|--------------------|-------|
| §1 Language | [Role] | |
| §2 ID Conventions | [Role] | |
| §3 Traceability | [Role] | |
| §4 Definition of Ready | [Role] | |
| §5 NFR Baseline | [Role] | |
| §6 Quality Gates | [Role] | |
| §7 Testing Strategy | [Role] | |
| §8 Branching | [Role] | |

## 10. Project-Specific Notes

[ADDITIONAL_CONVENTIONS]

---

## Approvals

| Name | Role | Approval Date | Notes |
|------|------|---------------|-------|
| [name] | [role] | [YYYY-MM-DD] | [optional notes] |
