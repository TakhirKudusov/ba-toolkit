# Technology Research & Architecture Decisions: [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**References:** `02_srs_[SLUG].md`, `06_nfr_[SLUG].md`, `07_datadict_[SLUG].md`

---

## Architecture Decision Records (ADRs)

### ADR-001: [Decision Title]

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-[NNN]
**Date:** [DATE]

**Context:**
[What situation or requirement forces us to make this decision? Reference specific NFRs or FRs.]

**Options Considered:**

| Option | Pros | Cons |
|--------|------|------|
| [Option A] | [pros] | [cons] |
| [Option B] | [pros] | [cons] |

**Decision:** [Option A / B / other], because [rationale].

**Consequences:**
- [Positive consequence]
- [Trade-off or risk]

**References:** NFR-[NNN], FR-[NNN]

---

### ADR-002: [Decision Title]

**Status:** Proposed | Accepted
**Date:** [DATE]

**Context:** [Context for this decision.]

**Options Considered:**

| Option | Pros | Cons |
|--------|------|------|
| [Option A] | [pros] | [cons] |
| [Option B] | [pros] | [cons] |

**Decision:** [Chosen option and rationale.]

**Consequences:**
- [Consequence]

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
|---|---------|-------|-------------|
| 1 | [Unresolved technical question] | [Role] | [Date] |
