# Technology Research & Architecture Decisions: [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**ADR format:** Michael Nygard format extended with Drivers and Alternatives Considered
**References:** `02_srs_[SLUG].md`, `06_nfr_[SLUG].md`, `07_datadict_[SLUG].md`

> The output of this research is the **primary tech-stack source** for `/implement-plan` (added in v3.4.0). The Tech Stack table at the bottom is read by `/implement-plan` to populate its header without re-asking the calibration interview.

---

## Architecture Decision Records (ADRs)

### ADR-001: [Decision Title]

| Field | Value |
|-------|-------|
| **Status** | Proposed / Accepted / Deprecated / Superseded by ADR-[NNN] |
| **Proposal date** | [YYYY-MM-DD] |
| **Decision date** | [YYYY-MM-DD when the decision was locked in] |
| **Decision owner** | [Name + role] |

**Drivers:** *(what forced this decision — reference specific FRs, NFRs, regulatory constraints, cost or time pressure)*
- NFR-[NNN] — [why this NFR forces the decision]
- FR-[NNN] — [why this FR forces the decision]
- [Regulatory / cost / time-to-market constraint]

**Context:**
[What situation requires us to make this decision now. Background a future maintainer would need to understand the decision.]

**Alternatives Considered:**

| Option | Pros | Cons | Disqualifying factor |
|--------|------|------|----------------------|
| [Option A] | [pros] | [cons] | — |
| [Option B] | [pros] | [cons] | [why ruled out] |
| [Option C] | [pros] | [cons] | [why ruled out] |

**Decision:** [Option A / B / other], because [rationale anchored in the Drivers above].

**Consequences:**

- **Positive:** [what becomes easier]
- **Negative:** [trade-off or risk]
- **Neutral:** [side effect that is neither good nor bad but worth noting]

---

### ADR-002: [Decision Title]

| Field | Value |
|-------|-------|
| **Status** | [status] |
| **Proposal date** | [date] |
| **Decision date** | [date] |
| **Decision owner** | [Name + role] |

**Drivers:**
- [driver]

**Context:** [Context.]

**Alternatives Considered:**

| Option | Pros | Cons | Disqualifying factor |
|--------|------|------|----------------------|
| [Option A] | [pros] | [cons] | — |
| [Option B] | [pros] | [cons] | [why ruled out] |

**Decision:** [Chosen option and rationale.]

**Consequences:**

- **Positive:** [consequence]
- **Negative:** [consequence]

<!-- Repeat ADR block for each major architectural decision. -->

---

## Integration Map

| Integration | Type | Protocol | Auth | Direction | Notes |
|-------------|------|----------|------|-----------|-------|
| [System name] | [REST / GraphQL / gRPC / Webhook / SDK] | [HTTPS / WSS] | [API key / OAuth / JWT] | Inbound / Outbound / Both | [notes] |

---

## Data Storage Decisions

| Data Type | Storage Technology | Rationale |
|-----------|-------------------|-----------|
| [e.g. User profiles] | [e.g. PostgreSQL] | [why] |
| [e.g. Session data] | [e.g. Redis] | [why] |
| [e.g. Media files] | [e.g. S3-compatible] | [why] |

---

## Real-time Strategy

**Requirement:** [What real-time feature needs this — e.g. live notifications, tracking]
**Approach:** [WebSocket / Server-Sent Events / Long-polling / None]
**Technology:** [e.g. Socket.io, native WebSocket, Pusher]
**Rationale:** [Why this approach over alternatives]

---

## Regulatory & Compliance Notes

| Requirement | Impact | Implementation Approach |
|-------------|--------|------------------------|
| [e.g. GDPR] | [what data is affected] | [how it will be addressed] |

---

## Open Questions

| # | Question | Owner | Target Date |
|---|----------|-------|-------------|
| 1 | [Unresolved technical question] | [Role] | [Date] |

---

## Tech Stack Summary *(consumed by `/implement-plan`)*

This table is the primary tech-stack source for `/implement-plan`. Every row should have a concrete value (or `[TBD: <slot>]` if the decision is genuinely deferred). `/implement-plan` skips its own calibration interview when this table is complete.

| Layer | Choice | Source ADR |
|-------|--------|------------|
| Frontend | [framework + language + build tool] | ADR-[NNN] |
| Backend | [framework + language + runtime] | ADR-[NNN] |
| Database | [engine + version + hosting] | ADR-[NNN] |
| Hosting / deployment | [cloud + region + container model] | ADR-[NNN] |
| Auth / identity | [in-house / SSO / managed service] | ADR-[NNN] |
| Observability | [logs + metrics + traces platform] | ADR-[NNN] |
| Mandatory integrations | [list from §Integration Map] | — |

---

## NFR → ADR Traceability

Forward traceability from each Non-functional Requirement in `06_nfr_[SLUG].md` to the ADR(s) that satisfy it. NFRs without a linked ADR are flagged — every Must-priority NFR should drive at least one architectural decision.

| NFR ID | ISO 25010 Characteristic | Linked ADRs | Coverage Status |
|--------|--------------------------|-------------|-----------------|
| NFR-001 | Performance Efficiency | ADR-002, ADR-005 | ✓ |
| NFR-003 | Reliability | ADR-004 | ✓ |
| NFR-005 | Security | (uncovered) | ✗ |
