---
name: sprint
description: >
  Sprint planning for BA Toolkit projects. Use on /sprint command, or when the user asks to "create a sprint plan", "plan sprints", "organise backlog into sprints", "sprint breakdown", "velocity planning", "release plan". Run after /estimate (required) and /risk (recommended). Generates 00_sprint_{slug}.md with sprint goals, story assignments, and capacity summary.
---

# /sprint — Sprint Plan

Utility skill. Reads estimated User Stories, applies team capacity and velocity constraints, groups stories into sprints by priority and risk weight, and produces `00_sprint_{slug}.md` with a complete sprint breakdown.

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

0. If `00_principles_*.md` exists, load it — apply language convention (section 1), ID naming convention (section 2), and any team capacity defaults from section 8 (Project-Specific Notes).
1. Load `00_estimate_{slug}.md` or check `03_stories_{slug}.md` for inline `**Estimate:**` fields. **Required** — sprint planning cannot proceed without estimates.
2. Load `03_stories_{slug}.md` — source of story priority (MoSCoW or custom), persona, business value score, epic grouping, **Depends on** field (per v3.5.0+ template), and acceptance criteria count.
3. Load `00_risks_{slug}.md` if it exists — use risk scores to elevate priority of stories that mitigate 🔴 Critical or 🟡 High risks.
4. Load `02_srs_{slug}.md` — to extract any sequencing constraints (dependencies, technical prerequisites) beyond the explicit `Depends on` fields in stories.
5. Load `00_discovery_{slug}.md` if it exists — for early signals about which features matter most to MVP success.
6. Load `00_sprint_{slug}.md` if it exists — merge mode: preserve confirmed sprints, re-plan only future ones.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory.

## Calibration interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended), render variants in the user's language (rule 11), and wait for an answer.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/sprint` (e.g., `/sprint 2-week sprints, 35 SP velocity, 70% focus factor`), parse it and skip the matching questions.

Ask the following before planning (skip questions already answered in context or via inline flags):

1. **Sprint length:** How many weeks per sprint? **Recommended:** 2 weeks.
2. **Theoretical velocity:** Maximum Story Points per sprint at 100% capacity (or T-shirt / person-days equivalent)? *(If not given, estimate from team size: assume 8–10 SP per developer per 2-week sprint at 100% capacity, before focus factor.)*
3. **Team size:** Number of developers contributing to this project? *(Used to sanity-check velocity.)*
4. **Focus factor** — what percentage of theoretical capacity is actually available for new feature work? **Recommended: 65%**. Industry baseline accounts for: meetings, code review, mentoring, context-switching. A team that runs at 100% theoretical velocity is a team that's burning out.
5. **Buffer / slack** — what percentage of capacity is reserved for bugs, support, and unplanned work? **Recommended: 15%**. Without explicit slack the first production incident derails the whole sprint.
6. **Ceremonies overhead** — planning + review + retro + refinement time per sprint? **Recommended: 1 day per 2-week sprint per developer.**
7. **Holidays / PTO** — any planned absence during the sprint window that should reduce capacity?
8. **Sprint 0:** Does the team need a sprint 0 for setup, architecture, or environment? *(Yes / no — if yes, add SP-00 with no user stories.)*
9. **Hard deadline:** Is there a fixed release date or milestone? *(If yes, flag stories that will not fit before the deadline.)*
10. **Parallel tracks:** Are frontend and backend worked on simultaneously, or sequentially? *(Affects story ordering within a sprint.)*

If the user types `/sprint` without additional input and prior context is sufficient, apply defaults and state assumptions explicitly in the output.

**Net velocity formula:**

```
Net velocity = Theoretical velocity × Focus factor × (1 − Buffer fraction) − Ceremonies cost
```

Example: 50 SP theoretical × 0.65 focus × (1 − 0.15) buffer − 5 SP ceremonies = **22.6 SP net velocity**. The skill assigns stories against **net velocity**, not theoretical. Senior scrum masters never schedule against the theoretical number — that's how teams overcommit and miss sprints.

## Planning algorithm

### Step 1 — Priority ordering

Sort stories for assignment using this precedence:

1. **Must** stories first (MoSCoW: Must > Should > Could > Won't).
2. Within the same priority tier, elevate stories that mitigate 🔴 Critical or 🟡 High risks (from `00_risks_{slug}.md`).
3. Within the same priority and risk tier, sort by **Business Value Score** (per v3.5.0+ stories template) — higher value first.
4. Within the same priority, risk, and value tier, order by dependencies: stories that are prerequisite to others go first. **Read the `Depends on` field per v3.5.0+ stories template** for explicit story-to-story dependencies, plus any sequencing constraints from `02_srs_*.md`.
5. Within the same tier with no dependencies, order by estimate ascending (smaller stories first — reduces WIP).

### Step 2 — Sprint assignment

Fill sprints greedily from the ordered list against **net velocity** (not theoretical):

- Assign stories to the current sprint until adding the next story would exceed net velocity.
- If a story alone exceeds net velocity, flag it for splitting: `⚠️ US-NNN (N SP) exceeds sprint capacity — consider /split US-NNN`.
- If a story has an explicit `Depends on` not yet assigned, defer it to the sprint after its prerequisite completes.
- When a hard deadline is provided, mark the sprint that contains it and flag any Must stories not scheduled before it as 🚨 **At risk**.

### Step 3 — Sprint goal derivation

For each sprint, derive a one-sentence goal that describes the primary user-facing outcome:
- Group stories by epic and pick the dominant epic in the sprint.
- Express the goal as a user outcome, not a task list: "Players can register, deposit, and spin for the first time."

## Generation

Save `00_sprint_{slug}.md` to the output directory. The full layout lives at `references/templates/sprint-template.md` and is the single source of truth — including the per-story Persona column (per v3.5.0+ stories template), the net-velocity header, and the sprint-level Definition of Done.

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
