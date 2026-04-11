---
name: datadict
description: >
  Generate a Data Dictionary: entities, attributes, types, constraints, relationships. Use on /datadict command, or when the user asks for "data dictionary", "data model", "data schema", "describe entities", "ER model", "database structure", "describe tables", "entity attributes", "entity relationships", "domain model". Seventh step of the BA Toolkit pipeline.
---

# /datadict — Data Dictionary

Seventh step of the BA Toolkit pipeline. Generates a data dictionary: entities, attributes, data types, constraints, and relationships.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions (artifact language, ID format, entity naming convention, Definition of Ready, quality gate threshold).
1. Read `01_brief_*.md`, `02_srs_*.md`, `03_stories_*.md`. SRS is the minimum requirement.
2. Extract: slug, domain, entities (mentioned in FR and US), business rules, roles.
3. If domain supported, load `references/domains/{domain}.md`, section `7. /datadict`. Use mandatory entities and domain-specific questions.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/datadict` (e.g., `/datadict the user and order entities are critical`), use it as a hint for which entities to model first.

3–7 topics per round, 2–4 rounds.

**Scope boundary:** `/datadict` describes the **logical** data model — entities, attributes, conceptual types, relationships, state transitions. It does **not** prescribe the physical model (specific DBMS, indexes, sharding, partitioning). Physical-model decisions (PostgreSQL vs MongoDB, schema-per-tenant vs shared, index strategy) belong in `/research` (step 7a) as ADRs. If the user mentions a specific DBMS, note it as an existing constraint or as input to `/research`, not as a mandatory topic here.

**Required topics:**
1. **Existing schema or system of record** — is there a legacy schema to account for or extend? Migration path?
2. **PII inventory** — which fields are PII / PCI / PHI / financial? What is the retention policy per class? Which fields must be encrypted at rest? Which masked in UI?
3. **Audit and history** — which entities require a full audit trail (every change logged with actor + timestamp)? Which need temporal / bitemporal storage (point-in-time queries)?
4. **Soft delete** — which entities support soft deletion (`deleted_at`) vs hard delete? Cascade rules on parent deletion?
5. **State machines** — which entities are stateful (Order, Subscription, Application, Case)? List the states and the legal transitions for each. **Mandatory question for any entity that has more than two distinct lifecycle states.**
6. **Referential integrity** — cascade rules on parent deletion (cascade / restrict / set null / prevent). Required for every FK.
7. **Time-zone handling** — are timestamps stored in UTC and converted at the presentation layer, or stored in local time with a TZ field?
8. **Amount storage** — financial amounts in minor units (cents) or major units? Currency code stored alongside?
9. **Versioning** — is change history needed for any entities (e.g. price history, terms-of-service version)?
10. **Data ownership** — which team / role owns each entity for ongoing curation, schema changes, and incident response?

Supplement with domain-specific questions and mandatory entities from the reference.

## Generation

**Slug:** read the `**Slug:**` line from the managed block of `AGENTS.md` (project root, or `../AGENTS.md` if cwd is `output/`) and use it verbatim. See [`../references/slug-source.md`](../references/slug-source.md).

**File:** `07_datadict_{slug}.md`

The full per-entity field set lives at `references/templates/datadict-template.md` and is the single source of truth. Each entity carries: name, **Source** (which FR/US introduced this entity), **Owner** (which team / role curates it), **Sensitivity** (Public / Internal / Confidential / PII / PCI / PHI), description, attribute table (with logical types, not DBMS-specific), relationships with cascade rules, **state machine** (if applicable), indexes (logical, not physical), retention policy, and notes. The artifact carries an FR → Entity coverage matrix at the bottom.

**Rules:**
- Data types are **logical** (String, Integer, Decimal, Boolean, Timestamp, UUID, Enum, FK, JSON, Binary), not DBMS-specific. Physical type mapping happens in `/research` ADRs.
- Constraints include: PK, FK with cascade rule, unique, not null, enum, min/max, regex, default.
- Attribute and entity names in English (or per the project ID convention from `00_principles_*.md`); descriptions in the user's language.
- Every entity has a **Source** field (FR-NNN or US-NNN) — no entity without provenance.
- Every entity has an **Owner** field — accountability for schema changes and data quality.
- Every entity has a **Sensitivity** classification — feeds /nfr Security NFRs and GDPR compliance.
- Stateful entities (Order, Subscription, Application, Case, Account, …) **must** include a state machine section listing states and legal transitions.

## Iterative refinement

- `/revise [entity]` — rewrite.
- `/expand [entity]` — add attributes, indexes.
- `/split [entity]` — separate an entity.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all entities from SRS/stories described; FK references correct; types match DBMS.
- `/done` — finalize. Next step: `/apicontract`.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Total number of entities documented and total attribute count.
- DBMS chosen and naming convention confirmed.
- Entities flagged for audit trail or versioning.

Available commands for this artifact: `/clarify [focus]` · `/revise [entity]` · `/expand [entity]` · `/split [entity]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (row `Current = /datadict`). Do not hardcode `/research` (or `/apicontract` if research is skipped) here — the lookup table is the canonical source.

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
