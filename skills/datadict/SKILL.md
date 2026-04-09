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

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, offer 3–5 domain-appropriate options (load `references/domains/{domain}.md` for the ones that fit), always include a free-text "Other" option as the last choice, and wait for an answer before asking the next question.

3–7 topics per round, 2–4 rounds.

**Required topics:**
1. DBMS — MongoDB, PostgreSQL, MySQL, other?
2. Existing schema — is there one to account for or extend?
3. Audit entities — which require full audit trail?
4. Soft delete — is soft deletion used?
5. Amount storage — in minor units (cents) or major currency units?
6. Versioning — is change history needed for any entities?

Supplement with domain-specific questions and mandatory entities from the reference.

## Generation

**File:** `07_datadict_{slug}.md`

```markdown
# Data Dictionary: {Name}

## General Information
- **DBMS:** {type}
- **Naming Conventions:** {camelCase | snake_case}
- **Common Fields:** {createdAt, updatedAt, deletedAt}

## Entity: {Name} ({English collection/table name})

**Description:** {purpose in the system.}
**Linked FR/US:** {references.}

| Attribute | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| _id / id | ObjectId / UUID | yes | PK | Unique identifier |
| {name} | {type} | {yes/no} | {constraints} | {description} |

**Indexes:**
- {name}: {fields}, {type}

---

## Entity Relationships

| Entity A | Relationship | Entity B | Description |
|----------|-------------|----------|-------------|
```

**Rules:**
- Data types match the chosen DBMS.
- Constraints include: PK, FK, unique, not null, enum, min/max, regex.
- Attribute and entity names in English; descriptions in the user's language.

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

Available commands: `/clarify [focus]` · `/revise [entity]` · `/expand [entity]` · `/split [entity]` · `/validate` · `/done`

Next step: `/apicontract`

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
