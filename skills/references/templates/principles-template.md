# Project Principles: [PROJECT_NAME]

**Version:** 1.0
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

The following NFR categories are required regardless of domain:

- **Security:** authentication method, data encryption at rest and in transit.
- **Availability:** uptime SLA with a numeric target.
- **Compliance:** applicable laws and data retention policy.

[ADDITIONAL_NFR_CATEGORIES]

## 6. Quality Gates

For `/analyze` findings:

- **CRITICAL:** must be resolved. `/done` is blocked.
- **HIGH:** [BLOCK_OR_WARN] — [PROJECT_DECISION].
- **MEDIUM:** documented and may be deferred.
- **LOW:** informational only.

## 7. Output Folder Structure

**Mode:** [flat | subfolder]

- `flat` (default) — all artifacts saved directly in the output directory.
- `subfolder` — all artifacts saved under `{output_dir}/[SLUG]/`.

## 8. Project-Specific Notes

[ADDITIONAL_CONVENTIONS]
