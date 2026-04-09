---
name: research
description: >
  Generate a technology and constraints research document before committing to API and data design. Covers integration options, API style choices, data storage alternatives, regulatory constraints, and ADR (Architecture Decision Records) with rationale. Use on /research command, or when the user asks for "technology research", "tech decisions", "architecture options", "integration research", "compare options", "what stack to use", "ADR", "architecture decision", "research constraints". Optional step — run after /datadict and before /apicontract.
---

# /research — Technology Research and Constraints

Optional step between `/datadict` and `/apicontract`. Documents technology decisions, integration options, and architectural constraints before the API contract is committed. Generates Architecture Decision Records (ADR) with rationale for each key choice.

Running this step prevents "beautiful but impractical" API contracts by surfacing constraints early.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions.
1. Read `01_brief_*.md`, `02_srs_*.md`, `07_datadict_*.md`. SRS and Data Dictionary are required.
2. Extract: domain, integrations listed in SRS, regulatory requirements, entities and their relationships from the Data Dictionary, non-functional requirements (if `06_nfr_*.md` exists).
3. If domain is supported, load `references/domains/{domain}.md` for domain-typical integration patterns.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, offer 3–5 domain-appropriate options (load `references/domains/{domain}.md` for the ones that fit), always include a free-text "Other" option as the last choice, and wait for an answer before asking the next question.

1–2 rounds, 4–6 topics.

**Required topics:**
1. Existing infrastructure — is there a current backend, database, or API the new system must integrate with or extend?
2. API style preference — REST, GraphQL, gRPC, or a combination? Any existing API gateway or BFF?
3. Real-time requirements — do any user stories require live updates (WebSocket, SSE, polling)?
4. Third-party integrations — which external services are confirmed (payment gateway, auth provider, analytics, CDN)?
5. Data storage constraints — any vendor lock-in restrictions, cloud provider preferences, on-premise requirements?
6. Compliance constraints — any restrictions on where data can be stored (jurisdiction, residency)?

Supplement with domain-specific typical integrations from the reference.

## Generation

**File:** `07a_research_{slug}.md`

```markdown
# Technology Research: {Project Name}

**Date:** {date}
**Scope:** Decisions informing /apicontract and /datadict

---

## 1. Context Summary

Brief summary of the system from the brief and SRS: what it does, who uses it, key integrations, and non-functional constraints relevant to technical decisions.

## 2. Architecture Decision Records (ADR)

### ADR-001: {Decision Title}

| | |
|--|--|
| **Status** | Accepted |
| **Date** | {date} |
| **Linked FR/NFR** | {references} |

**Context:** {Why this decision is needed — the problem being solved.}

**Options considered:**

| Option | Pros | Cons |
|--------|------|------|
| {Option A} | {pros} | {cons} |
| {Option B} | {pros} | {cons} |

**Decision:** {Chosen option and rationale.}

**Consequences:** {What becomes easier or harder as a result.}

---

_(Repeat ADR block for each key decision.)_

## 3. Integration Map

| System | Type | Direction | Protocol | Auth | Notes |
|--------|------|-----------|----------|------|-------|
| {Name} | {internal/external} | {in/out/bidirectional} | {REST/WS/…} | {JWT/API Key/…} | {notes} |

## 4. Data Storage Decisions

| Entity group | Storage type | Rationale |
|--------------|-------------|-----------|
| {e.g., Transactional data} | {e.g., PostgreSQL} | {reason} |
| {e.g., Session data} | {e.g., Redis} | {reason} |

## 5. Real-time Strategy

{Describe approach for any real-time requirements: WebSocket, SSE, polling interval, or none. Reference the US/FR that require it.}

## 6. Regulatory and Compliance Constraints

{List constraints affecting API design: data residency, PII handling, audit log requirements, encryption standards. Cross-reference NFR where applicable.}

## 7. Open Questions

{Any decisions deferred or requiring external input before /apicontract can proceed.}
```

**Rules:**
- ADR numbering: ADR-001, ADR-002, ...
- Every ADR must include at least two options compared.
- Decisions must reference FR or NFR that drove the choice.
- Open Questions section is mandatory — even if empty (write "None").

## Iterative refinement

- `/revise [ADR-NNN]` — update a decision.
- `/expand [ADR-NNN]` — add more options or consequences.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all integrations from SRS covered; every ADR has a decision; no open questions without an owner.
- `/done` — finalize. Next step: `/apicontract`.

## Closing message

After saving the artifact, present the following summary (see `references/closing-message.md` for format):

- Saved file path.
- Total number of ADRs documented.
- Number of confirmed external integrations.
- Any open questions that must be resolved before `/apicontract`.

Available commands: `/clarify [focus]` · `/revise [ADR-NNN]` · `/expand [ADR-NNN]` · `/validate` · `/done`

Next step: `/apicontract`

## Style

Formal, neutral. No emoji, slang. Generate in the artifact language. Technical terms (ADR, REST, WebSocket, JWT) remain in English. Architecture option names remain in English.
