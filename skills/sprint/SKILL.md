---
name: sprint
description: >
  Sprint planning for BA Toolkit projects. Use on /sprint command, or when the user asks to "create a sprint plan", "plan sprints", "organise backlog into sprints", "sprint breakdown", "velocity planning", "release plan". Run after /estimate (required) and /risk (recommended). Generates 00_sprint_{slug}.md with sprint goals, story assignments, and capacity summary.
---

# /sprint — Sprint Plan

Utility command. Reads estimated User Stories, applies team capacity and velocity constraints, groups stories into sprints by priority and risk weight, and produces `00_sprint_{slug}.md` with a complete sprint breakdown.

## Syntax

```
/sprint [optional: action]
```

Examples:
- `/sprint` — generate a full sprint plan using defaults or a calibration interview
- `/sprint 2` — re-plan sprint 2 only (e.g., after stories were added or re-estimated)
- `/sprint velocity 40` — override team velocity to 40 SP per sprint
- `/sprint add SP-01 US-007` — move a story to a specific sprint manually

## Context loading

0. If `00_principles_*.md` exists, load it — apply language convention (section 1) and ID naming convention (section 2).
1. Load `00_estimate_{slug}.md` or check `03_stories_{slug}.md` for inline `**Estimate:**` fields. **Required** — sprint planning cannot proceed without estimates.
2. Load `03_stories_{slug}.md` — source of story priority (MoSCoW or custom), epic grouping, and acceptance criteria count.
3. Load `00_risks_{slug}.md` if it exists — use risk scores to elevate priority of stories that mitigate 🔴 Critical or 🟡 High risks.
4. Load `02_srs_{slug}.md` — to extract any sequencing constraints (dependencies, technical prerequisites).
5. Load `00_sprint_{slug}.md` if it exists — merge mode: preserve confirmed sprints, re-plan only future ones.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory.

## Calibration interview

Ask the following before planning (skip questions already answered in context or via syntax flags):

1. **Sprint length:** How many weeks per sprint? _(default: 2 weeks)_
2. **Team velocity:** Estimated Story Points per sprint (or T-shirt / person-days equivalent)? _(if not given, estimate from story count: assume 30–40 SP for a 3–5 developer team)_
3. **Team size:** Number of developers contributing to this project? _(used to sanity-check velocity)_
4. **Sprint 0:** Does the team need a sprint 0 for setup, architecture, or environment? _(yes/no — if yes, add SP-00 with no user stories)_
5. **Hard deadline:** Is there a fixed release date or milestone? _(if yes, flag stories that will not fit before the deadline)_
6. **Parallel tracks:** Are frontend and backend worked on simultaneously, or sequentially? _(affects story ordering within a sprint)_

If the user types `/sprint` without additional input and prior context is sufficient, apply defaults and state assumptions explicitly in the output.

## Planning algorithm

### Step 1 — Priority ordering

Sort stories for assignment using this precedence:

1. **Must** stories first (MoSCoW: Must > Should > Could > Won't).
2. Within the same priority tier, elevate stories that mitigate 🔴 Critical or 🟡 High risks (from `00_risks_{slug}.md`).
3. Within the same priority and risk tier, order by dependencies: stories that are prerequisite to others go first.
4. Within the same tier with no dependencies, order by estimate ascending (smaller stories first — reduces WIP).

### Step 2 — Sprint assignment

Fill sprints greedily from the ordered list:

- Assign stories to the current sprint until adding the next story would exceed velocity.
- If a story alone exceeds velocity, flag it for splitting: `⚠️ US-NNN (N SP) exceeds sprint capacity — consider /split US-NNN`.
- If a story has an explicit prerequisite not yet assigned, defer it to the sprint after its prerequisite completes.
- When a hard deadline is provided, mark the sprint that contains it and flag any Must stories not scheduled before it as 🚨 **At risk**.

### Step 3 — Sprint goal derivation

For each sprint, derive a one-sentence goal that describes the primary user-facing outcome:
- Group stories by epic and pick the dominant epic in the sprint.
- Express the goal as a user outcome, not a task list: "Players can register, deposit, and spin for the first time."

## Generation

Save `00_sprint_{slug}.md` to the output directory.

```markdown
# Sprint Plan: {PROJECT_NAME}

**Domain:** {DOMAIN}
**Date:** {DATE}
**Slug:** {SLUG}
**Sprint length:** {N} weeks
**Team velocity:** {N} SP per sprint
**Sources:** {list of artifacts used}

---

## Summary

| Sprint | Goal | Stories | Points | Capacity |
|--------|------|:-------:|:------:|:--------:|
| SP-00  | Setup and environment | — | — | — |
| SP-01  | [Goal] | N | N SP | N% |
| SP-02  | [Goal] | N | N SP | N% |
| **Total** | | **N** | **N SP** | |

**Planned:** N stories / N SP across N sprints
**Unplanned backlog:** N stories / N SP (scope exceeds capacity or marked Won't)

---

## Sprint Details

### SP-01 — [Sprint Goal]

**Duration:** Week 1–2
**Capacity:** {N} SP

| US | Title | Epic | Priority | Risk | Estimate |
|----|-------|------|---------|------|---------|
| US-001 | [Title] | E-01 | Must | RISK-02 ↑ | 5 SP |
| US-002 | [Title] | E-01 | Must | — | 3 SP |
| US-005 | [Title] | E-02 | Should | — | 8 SP |

**Sprint total:** N SP / {velocity} SP capacity (N%)

**Definition of Done for this sprint:**
- [ ] All stories pass their Acceptance Criteria.
- [ ] API endpoints for this sprint are integrated and tested.
- [ ] No 🔴 Critical open items in `/analyze` for completed stories.

---

### SP-02 — [Sprint Goal]

...

---

## Unplanned Backlog

Stories not assigned to any sprint (capacity exceeded, low priority, or deferred):

| US | Title | Epic | Priority | Estimate | Reason |
|----|-------|------|---------|---------|--------|
| US-018 | [Title] | E-04 | Could | 3 SP | Capacity exceeded |
| US-022 | [Title] | E-05 | Won't | 8 SP | Out of MVP scope |

---

## Assumptions

- Sprint velocity: {N} SP based on {source: user input / estimate from team size}.
- {Any other assumption made during planning.}
```

Sprint IDs are sequential (SP-00, SP-01, SP-02, …). SP-00 is reserved for setup/architecture sprint if requested.

### Merge behaviour

If `00_sprint_{slug}.md` already exists:
- Preserve sprints marked as **Done** or **In Progress** — do not re-plan them.
- Re-plan only **Planned** sprints that are in the future.
- Assign new IDs only to newly created sprints (do not renumber existing ones).
- Update Summary table and Assumptions.

## Closing message

After saving, present the following summary (see `references/closing-message.md` for format):

- Saved file: `00_sprint_{slug}.md`
- Number of sprints planned and total duration in weeks.
- Total stories and Story Points planned vs. unplanned backlog size.
- Any stories flagged 🚨 At risk (won't fit before the hard deadline).
- Any stories that exceed sprint capacity and need splitting (`/split`).

Available commands: `/sprint [SP-NN]` (re-plan a sprint) · `/split [US-NNN]` (split large story) · `/estimate` (re-estimate) · `/risk` (refresh risks) · `/done`

## Style

Be specific about sprint goals — one user-outcome sentence per sprint. Show capacity percentages to make overloading visible at a glance. Flag risks and deadline conflicts explicitly, do not bury them in footnotes. Generate output in the language of the artifact.
