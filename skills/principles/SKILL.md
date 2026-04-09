---
name: principles
description: >
  Define project-level principles that govern the entire BA Toolkit pipeline: artifact language, ID conventions, traceability requirements, Definition of Ready per artifact type, mandatory NFR categories, and quality gates. Use on /principles command, or when the user asks to "set project standards", "define conventions", "establish principles", "set up pipeline rules", "configure traceability requirements", "define definition of ready". Optional step — run before /brief or immediately after it. All subsequent skills load and apply these principles automatically.
---

# /principles — Project Principles

Optional first step of the BA Toolkit pipeline. Defines project-level conventions used by all subsequent skills to generate, validate, and analyze artifacts. If this step is skipped, all skills use built-in defaults.

The generated file acts as the project's analytical constitution: a single source of truth for what "correct" and "complete" means across the pipeline.

## Workflow

### 1. Environment detection

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

### 2. Pipeline check

If `00_principles_*.md` already exists, load it and offer to:
- View current principles.
- Amend a specific section (`/revise [section]`).
- Regenerate from scratch.

If `01_brief_*.md` already exists, extract the slug and domain from it. Otherwise, ask the user for the project name (to derive the slug) and domain.

### 3. Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row **Recommended** based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/principles`, parse it as the lead-in answer and skip directly to the first structured question it doesn't already cover.
>
> **Open-ended lead-in (protocol rule 8):** if there is NO inline text and no prior `01_brief_*.md` exists, your very first interview question is open-ended free-text — `What kind of project is this and what conventions matter most to you?`. Otherwise jump straight to the structured questions.

1–2 rounds, 3–5 topics each. Do not ask about topics the user can accept as defaults.

**Required topics:**
1. Artifact language — which language should all artifacts be generated in? (default: the language of the user's first message)
2. Traceability strictness — should every Must-priority US require a Use Case, or only US with complex flows? (default: only complex flows)
3. NFR baseline — which **ISO/IEC 25010** quality characteristics are mandatory beyond the domain defaults? (Performance Efficiency / Reliability / Security / Compatibility / Usability / Maintainability / Portability / Functional Suitability — `/nfr` reads this list verbatim and treats it as a checklist).
4. Definition of Ready — any project-specific acceptance criteria for finalizing an artifact beyond the `v3.7.0+` baseline DoR per artifact type listed in §4 below? (e.g., stakeholder sign-off, specific review steps).
5. Quality gate — at what severity level should `/analyze` findings block `/done`? (default: CRITICAL only)
6. Output folder structure — save all artifacts flat in the output directory (default), or inside a `{slug}/` subfolder? (useful when managing multiple projects side by side)
7. **Testing strategy** — TDD (tests before implementation), tests-after, integration-only, manual-only, none? Drives whether `/implement-plan` task templates embed "Tests to write first" blocks. **Recommended:** TDD for production-grade systems; tests-after for prototypes; manual-only or none for spike work. *(This is the principles-based approach to the testing-discipline question that batch 6 item 2 surfaced — the right place to declare a testing strategy is here, not as a separate skill.)*
8. **Stakeholder decision authority** — who has sign-off authority on changes to these principles? Captured by name and role. Without this, principle changes become contentious mid-project.
9. **Code review and branching policy** — trunk-based / GitFlow / GitHub flow? Required reviewers per PR? `/implement-plan` and downstream skills assume one of these defaults but the principles file is the source of truth.

### 4. Generation

**File:** `00_principles_{slug}.md`

```markdown
# Project Principles: {Project Name}

**Version:** 1.0
**Date:** {date}
**Domain:** {domain}

## 1. Artifact Language

All artifacts are generated in: {language}

## 2. ID Conventions

| Artifact | Format | Example |
|----------|--------|---------|
| Functional Requirements | FR-NNN | FR-001 |
| User Stories | US-NNN | US-001 |
| Use Cases | UC-NNN | UC-001 |
| Acceptance Criteria | AC-NNN-NN | AC-001-01 |
| Non-functional Requirements | NFR-NNN | NFR-001 |
| Data Entities | PascalCase (English) | UserAccount |
| API Endpoints | REST path | POST /users |
| Wireframes | WF-NNN | WF-001 |

## 3. Traceability Requirements

Mandatory links — violations flagged as **CRITICAL** by `/analyze` and `/trace`:

- Every FR must have at least one linked US (after `/stories`).
- Every Must-priority US must have at least one AC (after `/ac`).
- Every NFR must have a measurable metric.
- Every WF must link to at least one US.

Recommended links — violations flagged as **HIGH**:

- Must-priority US should have a linked UC (or documented exception).
- Every Data Entity should link to at least one FR or US.
- Every API endpoint should link to at least one FR or US.

Optional links — violations flagged as **MEDIUM**:

- Should-priority US may skip UC.
- Could/Won't items may be undocumented in later artifacts.

## 4. Definition of Ready

An artifact is ready to `/done` when all of the following are true:

### Functional Requirement (FR)
- [ ] Description present and unambiguous.
- [ ] Actor identified (not "the system" or "the user" without role).
- [ ] Priority assigned (MoSCoW).
- [ ] Input/Output specified.

### User Story (US)
- [ ] Role, Action, and Value filled.
- [ ] Priority assigned.
- [ ] Linked FR reference present.

### Use Case (UC)
- [ ] Actor, Preconditions, Main Flow, and at least one Exceptional Flow present.
- [ ] Linked US reference present.

### Acceptance Criterion (AC)
- [ ] Given / When / Then all present and specific.
- [ ] Type specified (positive / negative / boundary).
- [ ] Linked US reference present.

### NFR
- [ ] Category specified.
- [ ] Measurable metric present (numeric target, not adjective).
- [ ] Verification method specified.

### Data Entity
- [ ] All attributes have types and constraints.
- [ ] FK references point to existing entities.

### API Endpoint
- [ ] Request and Response schemas present.
- [ ] At least one error code documented.
- [ ] Linked FR/US present.

### Wireframe (WF)
- [ ] All four states present: default, loading, empty, error.
- [ ] Navigation links (from / to) specified.
- [ ] Linked US present.

## 5. NFR Baseline

The following NFR categories are required regardless of domain. They must appear in `06_nfr_{slug}.md`:

- **Security:** authentication method, data encryption at rest and in transit.
- **Availability:** uptime SLA with a numeric target.
- **Compliance:** applicable laws and data retention policy.

{additional_categories_if_specified}

## 6. Quality Gates

For `/analyze` findings — action required before `/done` at the current step:

- **CRITICAL:** must be resolved. `/done` is blocked.
- **HIGH:** {block | warn only} — {project decision}.
- **MEDIUM:** documented and may be deferred.
- **LOW:** informational only.

## 7. Output Folder Structure

**Mode:** {flat | subfolder}

_(flat = all artifacts in the output directory root; subfolder = all artifacts under `{output_dir}/{slug}/`)_

## 8. Project-Specific Notes

{any_additional_conventions_from_interview}
```

### 5. Iterative refinement

- `/revise [section]` — rewrite a section.
- `/expand [section]` — add detail.

### 6. Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Language confirmed for all artifacts.
- Traceability strictness level set.
- Quality gate threshold confirmed (which severity blocks `/done`).
- NFR baseline categories listed.

Available commands for this artifact: `/revise [section]` · `/expand [section]`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (row `Current = /principles`). The lookup table points at `/brief` as the typical next step. If the user has already started `/brief` for this project, instead suggest continuing from wherever the pipeline left off — all skills now load `00_principles_{slug}.md` automatically.

## Style

Formal, neutral. No emoji, slang. The principles file itself is generated in the artifact language defined in section 1. Section headings and table column headers remain in that language.
