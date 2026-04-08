---
name: ba-glossary
description: >
  Unified project glossary extraction and maintenance for BA Toolkit projects. Use on /glossary command, or when the user asks to "build a glossary", "extract terms", "create a glossary", "consolidate terminology", "find terminology drift", "what terms are defined". Cross-cutting command — can run at any pipeline stage once at least one artifact exists.
---

# /glossary — Unified Project Glossary

Cross-cutting command. Scans all existing artifacts and the domain reference file, extracts defined and used terms, detects terminology drift (same concept, different names), and produces or updates a single `00_glossary_{slug}.md` file.

## Syntax

```
/glossary [optional: action]
```

Examples:
- `/glossary` — build or refresh the full project glossary
- `/glossary drift` — only show terminology drift findings, do not regenerate
- `/glossary add [Term]: [Definition]` — manually add a term to the glossary

## Context loading

0. If `00_principles_*.md` exists, load it — apply language convention (section 1) and ID naming convention (section 2).
1. Scan the output directory for all existing artifacts. Load each one found:
   - `01_brief_{slug}.md` — Brief Glossary section
   - `02_srs_{slug}.md` — Definitions and Abbreviations section, User Roles
   - `03_stories_{slug}.md` — actor names used in "As a..." statements
   - `04_usecases_{slug}.md` — actor names, system names
   - `05_ac_{slug}.md` — state names, condition terms
   - `06_nfr_{slug}.md` — category names, compliance standard names
   - `07_datadict_{slug}.md` — entity names, field names, enum values
   - `07a_research_{slug}.md` — technology names, ADR decisions
   - `08_apicontract_{slug}.md` — error codes, resource names
   - `09_wireframes_{slug}.md` — screen names, UI component names
   - `10_scenarios_{slug}.md` — persona names, scenario types
   - `11_handoff_{slug}.md` — any additional terms
2. Load `skills/references/domains/{domain}.md` — Domain Glossary section.
3. If `00_glossary_{slug}.md` already exists, load it to merge rather than replace.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory.

## Analysis pass

### Step 1 — Term extraction

Extract terms from:
- Explicit glossary sections in artifacts (Brief § Glossary, SRS § Definitions).
- Entity names from the Data Dictionary.
- Actor / role names used across all artifacts.
- Domain Glossary from the domain reference file.
- Enum values that represent domain states.

For each term, record:
- The term itself (canonical form).
- Its definition.
- Source artifact(s).
- All variant names found across artifacts (e.g., "User", "Customer", "Account").

### Step 2 — Terminology drift detection

Identify cases where the same concept appears under different names in different artifacts:

```
⚠️ Drift: "Customer" (Brief), "User" (SRS), "Account" (Data Dictionary) — all refer to the registered buyer entity.
→ Recommend canonical name: "Customer"
```

Flag drift as:
- 🔴 **Critical** — core entity or actor name differs across more than 2 artifacts (impairs traceability).
- 🟡 **Medium** — synonym used in 1 artifact (easy to harmonise).
- 🟢 **Low** — informal variation in a description field only.

### Step 3 — Undefined term detection

Identify terms used in requirements but not defined anywhere in the glossary or domain reference:
```
⚠️ Undefined: "Vesting schedule" used in FR-007 — not defined in glossary or domain reference.
```

## Generation

Save `00_glossary_{slug}.md` to the output directory.

```markdown
# Project Glossary: {PROJECT_NAME}

**Domain:** {DOMAIN}
**Date:** {DATE}
**Slug:** {SLUG}
**Sources:** {list of artifacts scanned}

---

## Terms

| Term | Definition | Source | Variants |
|------|-----------|--------|---------|
| [Term] | [Definition] | [artifact file] | [synonym1, synonym2 or —] |

---

## Terminology Drift Report

| Severity | Concept | Variants found | Canonical recommendation |
|---------|---------|---------------|------------------------|
| 🔴 Critical | [concept] | [list] | [recommended term] |
| 🟡 Medium | [concept] | [list] | [recommended term] |

---

## Undefined Terms

| Term | Used in | Recommended action |
|------|---------|-------------------|
| [term] | [FR-NNN / US-NNN / etc.] | Define in glossary or remove |
```

Glossary terms are sorted alphabetically. Domain glossary terms are included but labelled with their source (`domain reference`).

### Merge behaviour

If `00_glossary_{slug}.md` already exists:
- Preserve manually added definitions (do not overwrite if definition is more detailed than the extracted one).
- Add new terms found since last run.
- Update the Sources and Date fields.
- Re-run drift detection across all artifacts.

## Closing message

After saving, present the following summary (see `references/closing-message.md` for format):

- Saved file: `00_glossary_{slug}.md`
- Total terms in glossary.
- Drift findings: N critical, N medium, N low.
- Undefined terms found: N.
- If critical drift found: recommend `/clarify` on affected artifacts to harmonise terminology, or offer to apply the canonical names automatically.

Available commands: `/glossary drift` (drift report only) · `/glossary add [Term]: [Def]` · `/clarify [artifact]` · `/analyze`

## Style

Neutral, precise. Term definitions should be one sentence, domain-specific, and consistent with the artifact language set in `00_principles_{slug}.md`. Do not invent definitions — only use what is stated or clearly implied in the artifacts.
