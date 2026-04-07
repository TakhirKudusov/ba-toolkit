---
name: ba-brief
description: >
  Generate a high-level Project Brief for projects in any domain (iGaming, Fintech, SaaS, and others). Use this skill when the user enters /brief, or asks to "create a project brief", "describe the project", "start a new project", "project brief", or mentions the starting stage of the analytical pipeline. Also triggers on requests like "begin with a brief", "describe the product", "form a product description". First step of the BA Toolkit pipeline.
---

# /brief — Project Brief

Starting point of the BA Toolkit pipeline. Generates a structured Project Brief in Markdown. The pipeline is domain-parameterized: the domain is determined at this step and carried through all subsequent skills.

## Loading domain reference

Domain references are located in `references/domains/` relative to the `ba-toolkit` directory. Supported domains: `igaming`, `fintech`, `saas`. For other domains, work without a reference file.

## Workflow

### 1. Environment detection

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

### 2. Pipeline check

No prior artifacts required. If `01_brief_*.md` already exists, warn the user and offer to overwrite or create a new project.

### 3. Domain selection

Ask the user about the project domain. If the domain matches `igaming`, `fintech`, or `saas`, load the corresponding `references/domains/{domain}.md`. Use domain-specific interview questions (section `1. /brief`), typical business goals, risks, and glossary from that file.

If the domain does not match any supported one, record it as `custom:{name}` and use general questions only.

The domain is written into the brief metadata and passed to all subsequent pipeline skills.

### 4. Interview

3–7 questions per round, 2–4 rounds. Do not generate the artifact until sufficient information is collected.

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

**Domain:** {igaming | fintech | saas | custom:{name}}
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

### 6. Iterative refinement

- `/revise [section]` — rewrite a section.
- `/expand [section]` — add detail.
- `/validate` — check completeness and consistency.
- `/done` — finalize. Next step: `/srs`.

## Style

Formal, neutral. No emoji, slang, or evaluative language. Terms and abbreviations explained in parentheses on first use. Generate the artifact in the language of the user's request. Section headings, table headers, and labels also in the user's language.
