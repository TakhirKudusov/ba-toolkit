---
name: discovery
description: >
  Brain-storm an initial product concept when the user does not yet know what to build, which domain to choose, or which features matter. Use on /discovery command, or when the user asks to "brainstorm an idea", "explore a concept", "validate a project hypothesis", "I'm not sure what to build", "discovery phase", "concept exploration", "shape an idea before the brief". Optional first step of the BA Toolkit pipeline — runs before /brief and /principles. Produces a written concept artifact and recommends a domain, project name, slug, and scope hint to carry into /brief.
---

# /discovery — Concept Discovery

Optional entry point of the BA Toolkit pipeline. Runs **before** `/brief` for users who arrive with only a vague hunch — no fixed domain, no committed feature list, no clear audience. Generates a structured concept artifact and ends with a concrete recommendation (domain, project name, slug, scope hint) that flows into `/brief` as inline context.

The discovery artifact is a hypothesis document, not a commitment. Its sole job is to converge "I have an idea" into "I have a domain, an audience, and a candidate MVP scope" so the brief is productive instead of paralysing.

## Workflow

### 1. Environment detection

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

### 2. Pipeline check

If `00_discovery_*.md` already exists, load it and offer to:
- View the current concept.
- Amend a specific section (`/revise [section]`).
- Regenerate from scratch.

If `01_brief_*.md` already exists in the same output directory, the project has already moved past discovery. Warn the user that discovery is normally the first step and ask whether they really want to backfill a concept document (valid for retrospective concept docs, but uncommon).

### 3. Domain catalog

The 12 supported domain references live in `references/domains/` (`saas`, `fintech`, `ecommerce`, `healthcare`, `logistics`, `on-demand`, `social-media`, `real-estate`, `igaming`, `edtech`, `govtech`, `ai-ml`). Discovery does **not** load a single domain reference up front — instead, it offers a shortlist of candidate domains during the interview and lets the user pick one. The chosen domain is recorded in section 8 of the artifact and becomes the working domain for `/brief`.

If none of the 12 fits, record the recommended domain as `custom:{name}` and let `/brief` continue with general questions only.

### 4. Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/discovery` (e.g., `/discovery I think there's a need for a tool that helps freelance designers track invoices and chase late payments`), parse it as the lead-in answer, acknowledge it in one line, and skip directly to the first structured question that the inline text doesn't already cover.
>
> **Open-ended lead-in (protocol rule 8):** if there is NO inline text after `/discovery`, your very first interview question is open-ended and free-text, not a table — `What problem or opportunity are you exploring? Even a vague hunch is fine — one or two sentences about what you've noticed and who it bothers.`. After the user answers, switch to the structured table protocol for all subsequent questions and use the lead-in answer to pre-fill what you can.

Cover 5–7 topics in 2 rounds. Do not generate the artifact until you can recommend a single domain with a defensible rationale.

**Required topics:**
1. Problem space — what pain point, gap, or opportunity is being explored.
2. Target audience hypothesis — 1–2 candidate user segments, as concrete as possible.
3. Domain shortlist — narrow to 1 of the 12 supported domains (or `custom`) with a one-line rationale; mark one row (recommended) based on the problem/audience answers so far.
4. Reference products and analogues — what already exists in this space (3–5 examples), and what's missing or done badly.
5. MVP feature hypotheses — 5–10 candidate features for a first version. Bullet list, not committed scope.
6. Differentiation angle — why this idea would beat the existing analogues (one or two sentences).
7. Open validation questions — what we still don't know and would need to learn before committing (target users, willingness to pay, technical feasibility, etc.).

If a topic was already covered by inline context or the lead-in answer, skip it — do not re-ask. Record any topic the user genuinely cannot answer as "unknown — to validate" and move on.

### 5. Generation

**File:** `00_discovery_{slug}.md` (slug — kebab-case, derived from the project name; if the user has not yet picked a name, propose 2–3 candidates and let them choose).

```markdown
# Discovery: {Project Name}

**Slug:** {slug}
**Date:** {date}
**Status:** Concept (pre-brief)

## 1. Problem Space

{One or two paragraphs describing the pain point, gap, or opportunity.
Focus on what's broken today, who feels the pain, and how often.}

## 2. Target Audience Hypotheses

- **Primary:** {concrete segment, e.g. "freelance UX designers in EU billing 5–20 clients/month"}
- **Secondary:** {optional second segment if the interview surfaced one}

## 3. Candidate Domains

| Domain | Rationale | Fit |
|--------|-----------|-----|
| {domain-1} | {one line} | {High / Medium / Low} |
| {domain-2} | {one line} | {High / Medium / Low} |
| {domain-3} | {one line} | {High / Medium / Low} |

**Recommended domain:** `{chosen-domain}` — {one-line justification anchored in the problem space and audience}.

## 4. Reference Products and Analogues

| Product | What it does well | What it does badly / misses |
|---------|-------------------|------------------------------|
| {name-1} | {one line} | {one line} |
| {name-2} | {one line} | {one line} |
| {name-3} | {one line} | {one line} |

## 5. MVP Feature Hypotheses

Candidate features for a first version. Not committed scope — `/brief` and `/srs` will refine and prioritise.

- {feature 1}
- {feature 2}
- {feature 3}
- {feature 4}
- {feature 5}
- {…}

## 6. Differentiation Angle

{One or two sentences on why this idea is worth pursuing given the analogues in section 4. Concrete, not "better UX" or "cheaper".}

## 7. Open Validation Questions

Things we don't yet know and need to learn before committing real resources.

- {question 1 — e.g. "Will the primary segment pay $X/month?"}
- {question 2}
- {question 3}

## 8. Recommended Next Step

- **Project name:** {final name}
- **Slug:** {final slug}
- **Domain:** {chosen domain}
- **Scope hint for `/brief`:** {one-sentence summary that the user can paste as inline context: `/brief {scope hint}`}
- **Suggested first interview focus in `/brief`:** {1–2 topics from the discovery artifact that are now firm enough to anchor the brief}
```

### 6. AGENTS.md update

`ba-toolkit init` already created `AGENTS.md` at the project root. After saving `00_discovery_{slug}.md` to `output/`, find the project's `AGENTS.md` (look in cwd first; if cwd is `output/`, check `../AGENTS.md`).

**Update only the `## Pipeline Status` row for `/discovery`** — toggle its status from `⬜ Not started` to `✅ Done` and fill in the artifact filename in the `File` column. **Do not recreate the file at the repo root.** **Do not add `## Artifacts` / `## Key context` sections** — those are not part of the v3.1+ template and would be ignored by future runs.

**Domain field exception (managed block).** `/discovery` is the canonical source of truth for the project domain after `ba-toolkit init`. After saving `00_discovery_{slug}.md`, compare the recommended domain in §8 of the discovery artifact against the `**Domain:**` line inside the managed block of `AGENTS.md`. **If they differ, surgically update only that single line** to the new value — do not modify any other managed-block field (`**Project:**`, `**Slug:**`, `**Language:**`, `**Output folder:**`, the auto-generated date comment). Mention the change in the user-facing reply: "Updated the project domain in AGENTS.md from `<old>` to `<new>` based on the discovery recommendation." This is the only managed-block field `/discovery` may touch; everything else inside `<!-- ba-toolkit:begin managed -->` … `<!-- ba-toolkit:end managed -->` remains owned by `ba-toolkit init`.

If you find no `AGENTS.md` at all (neither in cwd nor up the tree), warn the user that the project was likely set up before v3.2 and tell them to run `ba-toolkit init --name "..." --slug {slug}` to scaffold the per-project `AGENTS.md`. Do not create one yourself with arbitrary structure.

If the existing `AGENTS.md` predates v3.2 and has no `/discovery` row in its Pipeline Status table, prepend a new row at stage `0` (and renumber the existing `/principles` row to `0a`) — same convention used by `/research` at stage `7a`. Mention the migration in your reply so the user knows their AGENTS.md was updated.

### 7. Iterative refinement

- `/revise [section]` — rewrite a section.
- `/expand [section]` — add detail.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — check completeness and consistency.
- `/done` — finalize and update `AGENTS.md`. Next step: `/brief`.

### 8. Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Recommended domain, project name, and slug — confirmed for the pipeline.
- Count of MVP feature hypotheses captured.
- List of open validation questions.

Available commands for this artifact: `/clarify [focus]` · `/revise [section]` · `/expand [section]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (look up the row where `Current` is `/discovery`). Do not hardcode `/brief` here — the table is the single source of truth. If the user wants stricter conventions before the brief (e.g. specific traceability rules or definition-of-ready policies), suggest running `/principles` between `/discovery` and `/brief`.

## Style

Formal, neutral, hypothesis-driven. No emoji, slang, or evaluative language ("amazing", "game-changing"). Frame every claim as a hypothesis to validate, not a fact. Generate the artifact in the language of the user's request. Section headings, table headers, and labels also in the user's language.
