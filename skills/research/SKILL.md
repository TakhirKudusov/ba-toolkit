---
name: research
description: >
  Generate a technology and constraints research document before committing to API and data design. Covers integration options, API style choices, data storage alternatives, regulatory constraints, and ADR (Architecture Decision Records) with rationale. Use on /research command, or when the user asks for "technology research", "tech decisions", "architecture options", "integration research", "compare options", "what stack to use", "ADR", "architecture decision", "research constraints". Optional step — run after /datadict and before /apicontract.
---

# /research — Technology Research and Constraints

Optional step between `/datadict` and `/apicontract`. Documents technology decisions, integration options, and architectural constraints before the API contract is committed. Generates Architecture Decision Records (ADR) with rationale for each key choice.

Running this step prevents "beautiful but impractical" API contracts by surfacing constraints early.

**Standard alignment:** ADRs follow the **Michael Nygard format** (the de facto industry standard since 2011) extended with explicit Drivers, Alternatives Considered, and Decision Date fields.

**Downstream consumers.** The output of `/research` is the **primary tech-stack source** for `/implement-plan` (added in v3.4.0). When `/research` is run, `/implement-plan` parses its ADRs and Integration Map to populate the Tech Stack header without asking the calibration interview. Make sure each tech-stack ADR (frontend, backend, database, hosting, auth, observability) has a clear winning decision so `/implement-plan` doesn't fall back to its own interview.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions.
1. Read `01_brief_*.md`, `02_srs_*.md`, `07_datadict_*.md`. SRS and Data Dictionary are required.
2. Extract: domain, integrations listed in SRS, regulatory requirements, entities and their relationships from the Data Dictionary, non-functional requirements (if `06_nfr_*.md` exists).
3. If domain is supported, load `references/domains/{domain}.md` for domain-typical integration patterns.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/research` (e.g., `/research compare PostgreSQL vs DynamoDB for our event store`), use it as the focus question to research instead of asking for one.

1–2 rounds, 4–6 topics.

**Required topics:**
1. Existing infrastructure — is there a current backend, database, or API the new system must integrate with or extend?
2. **Frontend stack** — framework, language, build tool? *(consumed by `/implement-plan` Tech Stack header)*
3. **Backend stack** — framework, language, runtime? *(consumed by `/implement-plan`)*
4. **Database** — engine, version, hosting model? *(consumed by `/implement-plan`)*
5. **Hosting / deployment target** — which cloud, which region, container vs serverless? *(consumed by `/implement-plan`)*
6. **Auth / identity** — in-house vs SSO vs managed service (Auth0, Clerk, Cognito)? *(consumed by `/implement-plan`)*
7. **Observability platform** — logging, metrics, traces (Datadog, New Relic, Grafana, OpenTelemetry self-hosted)? *(consumed by `/implement-plan` Phase 8)*
8. API style preference — REST, GraphQL, gRPC, or a combination? Any existing API gateway or BFF?
9. Real-time requirements — do any user stories require live updates (WebSocket, SSE, polling)?
10. Third-party integrations — which external services are confirmed (payment gateway, auth provider, analytics, CDN)?
11. Data storage constraints — any vendor lock-in restrictions, cloud provider preferences, on-premise requirements?
12. Compliance constraints — any restrictions on where data can be stored (jurisdiction, residency)?
13. **Build vs buy** — for each major capability, is custom code worth it or is a vendor / open-source library sufficient?
14. **Open-source vs proprietary tolerance** — any blanket policy (e.g. "no AGPL", "preferred Apache 2.0 / MIT", "vendor SLAs required")?

Supplement with domain-specific typical integrations from the reference.

## Generation

**Slug:** read the `**Slug:**` line from the managed block of `AGENTS.md` (project root, or `../AGENTS.md` if cwd is `output/`) and use it verbatim. See [`../references/slug-source.md`](../references/slug-source.md).

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
- Every ADR must include **Drivers** (FR / NFR / regulatory / cost / time-to-market — what forced the decision), **Alternatives Considered** (at least two), **Decision** (chosen option + rationale), and **Consequences** (positive and negative). This is the Nygard format extended.
- Decisions must reference FR or NFR that drove the choice in the Drivers field.
- Open Questions section is mandatory — even if empty (write "None").
- The artifact carries an **NFR → ADR** traceability matrix at the bottom so a senior reviewer can verify which NFRs drove which architectural decisions.

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

Available commands for this artifact: `/clarify [focus]` · `/revise [ADR-NNN]` · `/expand [ADR-NNN]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (row `Current = /research`). Do not hardcode `/apicontract` here.

## Style

Formal, neutral. No emoji, slang. Generate the artifact in the language of the user's request — see `references/language-rule.md` for what to translate and what stays in English. Architecture option names remain in English.
