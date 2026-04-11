---
name: estimate
description: >
  Effort estimation for BA Toolkit User Stories. Use on /estimate command, or when the user asks to "estimate stories", "add story points", "size the backlog", "estimate effort", "T-shirt sizing", "planning poker". Can target all stories or a specific epic/story. Run after /stories or /ac for best accuracy.
---

# /estimate — Effort Estimation

Utility skill. Analyses User Stories, assigns effort estimates using the chosen scale, and produces an estimation table with rationale. Can update the stories artifact in-place or output a standalone estimation report.

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

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended), render variants in the user's language (rule 11), and wait for an answer.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/estimate` (e.g., `/estimate t-shirt, post-srs phase, +20% buffer`), parse it and skip the matching questions.

Before estimating, ask the following (skip questions where the answer is already clear from context):

1. **Scale:** Story Points (Fibonacci: 1 / 2 / 3 / 5 / 8 / 13 / 21), T-shirt sizes (XS / S / M / L / XL), or ideal person-days? **Recommended:** Fibonacci Story Points.
2. **Reference stories:** Do you have known reference stories to anchor the scale? (e.g. "US-003 is a 3" or "login is an S") If yes, calibrate against those.
3. **Team assumptions:** Full-stack developer pair? Or separate frontend/backend? *(affects day estimates only)*
4. **Out of scope for this estimate:** Any stories to skip (e.g., already estimated, on ice)?
5. **Estimation phase (Cone of Uncertainty band)** — what's the maturity of the underlying artifacts? **Recommended:** select the band that matches the latest completed pipeline step.
   - **Discovery / Brief only** — variance ±400% (4× spread); confidence label "Order of magnitude".
   - **Post-SRS** — variance ±100%; confidence label "Rough order of magnitude (ROM)".
   - **Post-AC + Use Cases** — variance ±50%; confidence label "Budget estimate".
   - **Post-Wireframes + Datadict + APIcontract** — variance ±25%; confidence label "Definitive estimate".
   - **Post-Implementation Plan** — variance ±10%; confidence label "Control estimate".
6. **Risk multiplier** — apply a buffer for high-risk stories (those linked to 🔴 Critical or 🟡 High risks in `00_risks_*.md`)? **Recommended:** +20% on Critical-linked stories, +10% on High-linked.
7. **Technical debt allocation** — % of velocity reserved for tech debt, bug-fixes, support? **Recommended:** 20% (industry baseline).

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

## Estimation discipline — what this skill is and is not

This skill produces a **single-estimator analytical pass**. A senior BA running estimation in production would augment this with:

- **Planning poker** — team-based estimation where each developer commits independently and outliers discuss before re-voting. The canonical agile-team estimation technique. `/estimate` cannot do this — it must be run with the dev team after the analytical pass.
- **Wideband Delphi** — multi-round expert estimation with anonymous re-voting. Used when the team is distributed or when politics distort consensus. Same caveat — requires real humans.

**Cone of Uncertainty.** Boehm's classic principle: estimates made early in the lifecycle (post-Brief, post-Discovery) carry up to 4× variance from the eventual reality, narrowing to 1.25× by the time implementation is detailed. This skill **always emits a confidence label** based on the user-selected estimation phase (calibration question 5). A 5 SP estimate at the post-Brief phase is "5 SP ± 400%"; the same estimate at the post-Implementation-Plan phase is "5 SP ± 10%".

**Single-point estimates without a confidence band are dangerous** — they are misread as commitments. Every estimate produced by this skill carries an explicit confidence band tied to the Cone of Uncertainty.

## Output

**Slug:** read the `**Slug:**` line from the managed block of `AGENTS.md` (project root, or `../AGENTS.md` if cwd is `output/`) and use it verbatim. See [`../references/slug-source.md`](../references/slug-source.md).

### If scope ≤ 20 stories — update `03_stories_{slug}.md` in-place

Add a `**Estimate:**` field to each US block and append the Estimation Summary table at the end of the file.

### If scope > 20 stories — create `03_stories_estimates_{slug}.md`

Standalone estimation report with the full table.

---

### Estimation Summary table (always produced in chat as closing output)

```
## Estimation Summary — [PROJECT_NAME]
Scale: [Story Points / T-shirt / Days]
Estimation phase: [Discovery / Brief / SRS / AC / Wireframes / Implementation Plan]
Confidence band: [±400% / ±100% / ±50% / ±25% / ±10%]
Confidence label: [Order of magnitude / ROM / Budget / Definitive / Control]

| US | Title | Epic | Estimate | Confidence | Key drivers |
|----|-------|------|----------|------------|-------------|
| US-001 | [Title] | E-01 | 3 SP ± 25% | Definitive | 2 AC scenarios, simple UI |
| US-002 | [Title] | E-01 | 8 SP ± 25% | Definitive | external payment API, 4 AC scenarios |
| US-003 | [Title] | E-02 | 13 SP ± 50% | Budget | new domain area, complex state machine, RISK-02 +20% |
...

| Metric | Value |
|--------|-------|
| Total stories estimated | [N] |
| Total Story Points (point estimate) | [N] SP |
| Total with confidence band | [N – N] SP ([low] – [high]) |
| Largest story | US-[NNN] ([N] SP) — [reason] |
| Stories ≥ 13 SP (consider splitting) | [N]: US-[NNN], … |
| Average per story | [N] SP |
| Risk-adjusted total (high-risk +20%) | [N] SP |
| Tech debt reservation ([N]%) | [N] SP |
| **Net feature capacity** | [N] SP |
```

> ⚠️ **Single-estimator caveat.** This is an analytical estimation pass by a single estimator. For a real team commitment, run **planning poker** with the dev team using these numbers as the starting anchor and re-vote on any item where the team's estimate differs by more than one Fibonacci step.

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
