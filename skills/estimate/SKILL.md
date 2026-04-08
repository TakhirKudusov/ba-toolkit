---
name: estimate
description: >
  Effort estimation for BA Toolkit User Stories. Use on /estimate command, or when the user asks to "estimate stories", "add story points", "size the backlog", "estimate effort", "T-shirt sizing", "planning poker". Can target all stories or a specific epic/story. Run after /stories or /ac for best accuracy.
---

# /estimate — Effort Estimation

Analyses User Stories, assigns effort estimates using the chosen scale, and produces an estimation table with rationale. Can update the stories artifact in-place or output a standalone estimation report.

## Syntax

```
/estimate [optional: scale] [optional: scope]
```

Examples:
- `/estimate` — estimate all stories using Fibonacci Story Points (default)
- `/estimate t-shirt` — use T-shirt sizes (XS / S / M / L / XL)
- `/estimate days` — estimate in ideal person-days
- `/estimate E-01` — estimate only Epic E-01
- `/estimate US-007` — re-estimate a single story

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply any estimation conventions defined in section 8 (Additional Conventions).
1. Load `03_stories_{slug}.md` — primary input. Required.
2. Load `05_ac_{slug}.md` if it exists — AC scenario count per story is a key complexity signal.
3. Load `02_srs_{slug}.md` — to understand integration points and technical constraints.
4. Load `07a_research_{slug}.md` if it exists — for ADR-driven complexity signals.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory.

## Calibration interview

Before estimating, ask the following (skip questions where the answer is already clear from context):

1. **Scale:** Story Points (Fibonacci: 1 / 2 / 3 / 5 / 8 / 13 / 21), T-shirt sizes (XS / S / M / L / XL), or ideal person-days? _(default: Story Points Fibonacci)_
2. **Reference stories:** Do you have known reference stories to anchor the scale? (e.g. "US-003 is a 3" or "login is an S") If yes, calibrate against those.
3. **Team assumptions:** Full-stack developer pair? Or separate frontend/backend? _(affects day estimates only)_
4. **Out of scope for this estimate:** Any stories to skip (e.g., already estimated, on ice)?

If the user types `/estimate` without additional input and prior context is sufficient, proceed with defaults and state assumptions clearly.

## Estimation model

For each User Story, assess the following complexity factors:

| Factor | Signal | Weight |
|--------|--------|--------|
| **Scope** | Number of distinct user interactions described | Medium |
| **AC count** | More scenarios = higher complexity | Medium |
| **Integration** | External API calls, third-party services, webhooks | High |
| **UI complexity** | Multi-state screens, real-time updates, complex forms | Medium |
| **Data complexity** | New entities, complex relationships, migrations | Medium |
| **Newness** | Team has no prior experience with this area | High |
| **Uncertainty** | Requirements are unclear or flagged with open questions | High |

Apply the reference stories as anchors. If no references are given, calibrate internally: the simplest story in the set = 1 SP or XS.

Do not pad estimates — model what a reasonably skilled team would take, not a worst-case scenario.

## Output

### If scope ≤ 20 stories — update `03_stories_{slug}.md` in-place

Add a `**Estimate:**` field to each US block and append the Estimation Summary table at the end of the file.

### If scope > 20 stories — create `03_stories_estimates_{slug}.md`

Standalone estimation report with the full table.

---

### Estimation Summary table (always produced in chat as closing output)

```
## Estimation Summary — [PROJECT_NAME]
Scale: [Story Points / T-shirt / Days]

| US | Title | Epic | Estimate | Key drivers |
|----|-------|------|---------|-------------|
| US-001 | [Title] | E-01 | 3 SP | 2 AC scenarios, simple UI |
| US-002 | [Title] | E-01 | 8 SP | external payment API, 4 AC scenarios |
| US-003 | [Title] | E-02 | 13 SP | new domain area, complex state machine |
...

| Metric | Value |
|--------|-------|
| Total stories estimated | [N] |
| Total Story Points | [N] SP |
| Largest story | US-[NNN] ([N] SP) — [reason] |
| Stories ≥ 13 SP (consider splitting) | [N]: US-[NNN], … |
| Average per story | [N] SP |
```

### Splitting recommendations

For any story estimated at 13 SP or higher (or XL), suggest a concrete split:

```
⚠️ US-[NNN] ([N] SP) is large. Consider splitting:
  → US-[NNN]a: [sub-story suggestion]
  → US-[NNN]b: [sub-story suggestion]
Run /split US-[NNN] to perform the split.
```

## Closing message

After saving, present the following summary (see `references/closing-message.md` for format):

- Saved file path (if stories artifact updated) or new estimate file created.
- Scale used and total estimate.
- Number of stories estimated.
- Stories flagged for splitting (if any).
- Assumptions made (if defaults were applied without a calibration interview).

Available commands: `/estimate [US-NNN]` (re-estimate a story) · `/split [US-NNN]` (split a large story) · `/analyze` · `/done`

## Style

Be explicit about the rationale for each estimate. Use concise bullet drivers, not paragraphs. Generate output in the language of the artifact.
