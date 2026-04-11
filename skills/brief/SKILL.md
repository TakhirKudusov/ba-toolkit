---
name: brief
description: >
  Generate a high-level Project Brief for projects in any domain (SaaS, Fintech, E-commerce, Healthcare, Logistics, and others). Use this skill when the user enters /brief, or asks to "create a project brief", "describe the project", "start a new project", "project brief", or mentions the starting stage of the analytical pipeline. Also triggers on requests like "begin with a brief", "describe the product", "form a product description". First step of the BA Toolkit pipeline.
---

# /brief — Project Brief

Starting point of the BA Toolkit pipeline. Generates a structured Project Brief in Markdown. The pipeline is domain-parameterized: the domain is determined at this step and carried through all subsequent skills.

## Loading domain reference

Domain references are located in `references/domains/` relative to the `ba-toolkit` directory. Supported domains: `saas`, `fintech`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`, `igaming`, `edtech`, `govtech`, `ai-ml`. For other domains, work without a reference file.

## Workflow

### 1. Environment detection

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

### 2. Pipeline check

No prior artifacts required. If `01_brief_*.md` already exists, warn the user and offer to overwrite or create a new project.

If `00_discovery_*.md` exists in the output directory, load it as concept context. Extract the problem space (section 1), target audience hypotheses (section 2), recommended domain (section 3), MVP feature hypotheses (section 5), and the scope hint from section 8, and use them to pre-fill the structured interview questions per protocol rule 9. Skip any required topic that the discovery artifact already answers — only ask the user about gaps and open validation questions. Acknowledge the discovery hand-off in one line at the start of the interview so the user knows their concept work was loaded.

If `00_principles_*.md` exists in the output directory, load it and apply its conventions for this and all subsequent pipeline steps (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold).

### 3. Domain selection

Ask the user about the project domain. If a matching `references/domains/{domain}.md` file exists (currently: `saas`, `fintech`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`, `igaming`, `edtech`, `govtech`, `ai-ml`), load it and use its domain-specific interview questions (section `1. /brief`), typical business goals, risks, and glossary.

If the domain does not match any supported one, record it as `custom:{name}` and use general questions only.

The domain is written into the brief metadata and passed to all subsequent pipeline skills.

### 4. Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options (load `references/domains/{domain}.md` for the ones that fit) plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/brief` (e.g., `/brief I want to build an online store for construction materials`), parse that as the lead-in answer, acknowledge it in one line, and skip directly to the first structured question that the inline text doesn't already cover.
>
> **Open-ended lead-in (protocol rule 8):** if there is NO inline text after `/brief`, your very first interview question is open-ended and free-text, not a table — `Tell me about the project in your own words: one or two sentences are enough. What are you building, who is it for, and what problem does it solve?`. After the user answers, switch to the structured table protocol for all subsequent questions and use the lead-in answer to pre-fill what you can.

Cover 3–7 topics per round, 2–4 rounds. Do not generate the artifact until sufficient information is collected.

**Required topics (all domains):**
1. Product type — what exactly is being built?
2. Business goal — what problem does the product solve?
3. Target audience and geography.
4. **Buyer vs. user separation** — who pays for the product vs. who uses it day-to-day? In B2B SaaS, EdTech, healthcare and many other domains these are different people with different priorities. If they coincide, record "buyer = user".
5. Key stakeholders — who is interested, who makes decisions?
6. **Decision-making authority** — who can sign off on the brief now, and who can sign off on changes later? Capture by name and role, not just by team.
7. **Regulatory pre-screening** — which of the following regimes apply: GDPR / UK GDPR, HIPAA, FDA SaMD, SOC 2, PCI DSS, SOX, KYC / AML, FERPA / COPPA, EU AI Act, accessibility (Section 508 / WCAG / EN 301 549)? Single yes/no per regime — gates the rest of the pipeline.
8. Known constraints — deadlines, budget, technology mandates, mandatory integrations.
9. Reference products and analogues — products in this space the user admires (and why), products that failed (and why). Anchors the project to real-world references and surfaces unstated requirements.
10. Success criteria — specific metrics or qualitative goals.
11. **Failure criteria** — what would make us call this project a failure? Asymmetric to success criteria; flushes out red lines that "what's success" never reveals.

If a domain reference is loaded, supplement general questions with domain-specific ones. Formulate questions concretely, with example answers in parentheses.

### 5. Generation

**File:** `01_brief_{slug}.md` (slug — kebab-case, fixed here for the entire pipeline).

```markdown
# Project Brief: {Project Name}

**Version:** 0.1
**Status:** Draft | In Review | Approved | Superseded
**Domain:** {saas | fintech | ecommerce | healthcare | logistics | on-demand | social-media | real-estate | igaming | edtech | govtech | ai-ml | custom:{name}}
**Date:** {date}
**Slug:** {slug}

## 1. Project Summary
## 2. Business Goals and Success Metrics
## 3. Target Audience
   ### 3.1 Buyer
   ### 3.2 User (if different from Buyer)
## 4. High-Level Functionality Overview
   ### 4.1 In Scope
   ### 4.2 Out of Scope
## 5. Stakeholders and Decision-Making Authority
## 6. Constraints
## 7. Assumptions
## 8. Risks
## 9. Success and Failure Criteria
   ### 9.1 Success Criteria
   ### 9.2 Failure Criteria
## 10. Reference Products and Analogues
## 11. Glossary

---

## Approvals

| Name | Role | Approval Date | Notes |
|------|------|---------------|-------|
| {name} | {role} | {date} | {notes} |
```

### 6. AGENTS.md update

`ba-toolkit init` already created `AGENTS.md` at the project root. After saving `01_brief_{slug}.md` to `output/`, find the project's `AGENTS.md` (look in cwd first; if cwd is `output/`, check `../AGENTS.md`).

**Update only the `## Pipeline Status` row for `/brief`** — toggle its status from `⬜ Not started` to `✅ Done` and fill in the artifact filename in the `File` column. **Do not touch the managed block** (`<!-- ba-toolkit:begin managed -->` … `<!-- ba-toolkit:end managed -->`) — that's owned by `ba-toolkit init`.

If you find no `AGENTS.md` at all, warn the user that the project was likely not scaffolded with `ba-toolkit init` and tell them to run it. Do not create one yourself with arbitrary structure.

### 7. Iterative refinement

- `/revise [section]` — rewrite a section.
- `/expand [section]` — add detail.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — check completeness and consistency.
- `/done` — finalize and update `AGENTS.md`. Next step: `/srs`.

### 8. Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Project name, domain, and slug confirmed for the pipeline.
- Count of business goals documented and key constraints captured.
- List of identified risks.

Available commands for this artifact: `/clarify [focus]` · `/revise [section]` · `/expand [section]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (look up the row where `Current` is `/brief`). Do not hardcode `/srs` here — that table is the single source of truth and includes the four `→` lines (what the next skill produces, output file, time estimate, what comes after).

## Style

Formal, neutral. No emoji, slang, or evaluative language. Terms and abbreviations explained in parentheses on first use. Generate the artifact in the language of the user's request. Section headings, table headers, and labels also in the user's language.
