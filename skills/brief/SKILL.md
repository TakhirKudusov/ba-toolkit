---
name: brief
description: >
  Generate a high-level Project Brief for projects in any domain (SaaS, Fintech, E-commerce, Healthcare, Logistics, and others). Use this skill when the user enters /brief, or asks to "create a project brief", "describe the project", "start a new project", "project brief", or mentions the starting stage of the analytical pipeline. Also triggers on requests like "begin with a brief", "describe the product", "form a product description". First step of the BA Toolkit pipeline.
---

# /brief — Project Brief

Starting point of the BA Toolkit pipeline. Generates a structured Project Brief in Markdown. The pipeline is domain-parameterized: the domain is determined at this step and carried through all subsequent skills.

## Loading domain reference

Domain references are located in `references/domains/` relative to the `ba-toolkit` directory. Supported domains: `saas`, `fintech`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`, `igaming`. For other domains, work without a reference file.

## Workflow

### 1. Environment detection

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

### 2. Pipeline check

No prior artifacts required. If `01_brief_*.md` already exists, warn the user and offer to overwrite or create a new project.

If `00_principles_*.md` exists in the output directory, load it and apply its conventions for this and all subsequent pipeline steps (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold).

### 3. Domain selection

Ask the user about the project domain. If a matching `references/domains/{domain}.md` file exists (currently: `saas`, `fintech`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`, `igaming`), load it and use its domain-specific interview questions (section `1. /brief`), typical business goals, risks, and glossary.

If the domain does not match any supported one, record it as `custom:{name}` and use general questions only.

The domain is written into the brief metadata and passed to all subsequent pipeline skills.

### 4. Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, offer 3–5 domain-appropriate options (load `references/domains/{domain}.md` for the ones that fit), always include a free-text "Other" option as the last choice, and wait for an answer before asking the next question.

Cover 3–7 topics per round, 2–4 rounds. Do not generate the artifact until sufficient information is collected.

**Required topics (all domains):**
1. Product type — what exactly is being built?
2. Business goal — what problem does the product solve?
3. Target audience and geography.
4. Key stakeholders — who is interested, who makes decisions?
5. Known constraints — deadlines, budget, regulatory requirements, mandatory integrations.
6. Competitive products or references.
7. Success criteria — specific metrics or qualitative goals.

If a domain reference is loaded, supplement general questions with domain-specific ones. Formulate questions concretely, with example answers in parentheses.

### 5. Generation

**File:** `01_brief_{slug}.md` (slug — kebab-case, fixed here for the entire pipeline).

```markdown
# Project Brief: {Project Name}

**Domain:** {saas | fintech | ecommerce | healthcare | logistics | on-demand | social-media | real-estate | igaming | custom:{name}}
**Date:** {date}

## 1. Project Summary
## 2. Business Goals and Success Metrics
## 3. Target Audience
## 4. High-Level Functionality Overview
## 5. Stakeholders and Roles
## 6. Constraints and Assumptions
## 7. Risks
## 8. Glossary
```

### 6. AGENTS.md update

After saving `01_brief_{slug}.md`, create or update `AGENTS.md` in the current working directory (project root). This file helps AI agents in future sessions quickly understand the project context without re-reading all artifacts.

```markdown
# BA Toolkit — Project Context

**Project:** {Project Name}
**Slug:** {slug}
**Domain:** {domain}
**Language:** {artifact language}
**Pipeline stage:** Brief complete

## Artifacts
- `{output_dir}/01_brief_{slug}.md` — Project Brief

## Key context
- **Business goal:** {one-line summary}
- **Target audience:** {one-line summary}
- **Key constraints:** {comma-separated list}

## Next step
Run `/srs` to generate the Requirements Specification.
```

If `AGENTS.md` already exists and was created by BA Toolkit, update only the "Pipeline stage" and "Artifacts" sections — do not overwrite custom content added by the user.

### 8. Iterative refinement

- `/revise [section]` — rewrite a section.
- `/expand [section]` — add detail.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — check completeness and consistency.
- `/done` — finalize and update `AGENTS.md`. Next step: `/srs`.

### 9. Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Project name, domain, and slug confirmed for the pipeline.
- Count of business goals documented and key constraints captured.
- List of identified risks.

Available commands: `/clarify [focus]` · `/revise [section]` · `/expand [section]` · `/validate` · `/done`

Next step: `/srs`

## Style

Formal, neutral. No emoji, slang, or evaluative language. Terms and abbreviations explained in parentheses on first use. Generate the artifact in the language of the user's request. Section headings, table headers, and labels also in the user's language.
