# Closing Message Template

After saving an artifact, every BA Toolkit skill presents a closing summary block to the user in the chat (not inside the saved file). The block ends the current step on a clear note: what was generated, what's available next, and why the next pipeline step matters.

## Format

Present the block in the same language as the artifact.

```
Artifact saved: `{file_path}`

{Brief summary — 2–4 sentences or bullets covering:
 total count of key elements generated (e.g., "18 FRs across 3 roles"),
 main decisions captured during the interview,
 any back-references updated in prior artifacts.}

Available commands for the current artifact:

| Command            | When to use it                                              |
|--------------------|-------------------------------------------------------------|
| /clarify [focus]   | Pick up vague terms, missing metrics, conflicting rules     |
| /revise [section]  | Rewrite a specific section with new feedback                |
| /expand [section]  | Add more depth to an under-developed section                |
| /validate          | Check completeness and consistency across this artifact     |
| /done              | Lock this artifact and move on (skill marks it ✅ in AGENTS.md) |

Next step: /{next_command}

  → What it produces: {one-line description, e.g. "IEEE 830 SRS — scope, FRs, constraints"}
  → Output file:      {NN}_{name}_{slug}.md
  → Time estimate:    {min}–{max} minutes
  → After that:       /{step_after_next} ({one-line of what it does})

If you're stuck on the next step:
  - Run `/clarify` here first to surface ambiguities while context is fresh.
  - Run `/validate` to confirm this artifact is internally consistent.
  - The next skill reads this artifact automatically, so you don't need to paste anything.
```

## Pipeline next-step lookup table

Skills use this table as the single source of truth for the `Next step:` block. When a skill closes, look up its row by the `Current` column and copy the four `→` lines verbatim (substituting the slug). **Do not hardcode next-step text in individual SKILL.md files** — always reference this table so future pipeline reorganisations stay consistent.

| Current      | Next            | What it produces                                                | Time         | After that                                          |
|--------------|-----------------|-----------------------------------------------------------------|--------------|-----------------------------------------------------|
| /discovery   | /brief          | Project Brief — goals, audience, stakeholders, constraints      | 20–35 min    | /srs — Requirements Specification (IEEE 830)        |
| /principles  | /brief          | Project Brief — goals, audience, stakeholders, constraints      | 20–35 min    | /srs — Requirements Specification (IEEE 830)        |
| /brief       | /srs            | Requirements Specification (IEEE 830) — scope, FRs, MoSCoW      | 25–40 min    | /stories — User Stories grouped by Epics            |
| /srs         | /stories        | User Stories grouped by Epics, with priority and FR refs        | 20–30 min    | /usecases — Use Cases with main/alt/exception flows |
| /stories     | /usecases       | Use Cases with main, alternative, and exception flows           | 20–35 min    | /ac — Acceptance Criteria (Given / When / Then)     |
| /usecases    | /ac             | Acceptance Criteria (Given / When / Then) linked to stories     | 20–35 min    | /nfr — Non-functional Requirements with metrics     |
| /ac          | /nfr            | Non-functional Requirements with measurable metrics             | 15–25 min    | /datadict — Data Dictionary (entities, fields)      |
| /nfr         | /datadict       | Data Dictionary — entities, fields, types, relationships        | 15–30 min    | /research — Technology Research (ADRs, integrations)|
| /datadict    | /research       | Technology Research — ADRs, integration map, storage decisions  | 15–25 min    | /apicontract — API Contract (endpoints, schemas)    |
| /research    | /apicontract    | API Contract — endpoints, request/response schemas, errors      | 20–35 min    | /wireframes — Textual Wireframe Descriptions        |
| /apicontract | /wireframes     | Textual Wireframe Descriptions — screens, components, nav       | 25–40 min    | /scenarios — End-to-end Validation Scenarios        |
| /wireframes  | /scenarios      | End-to-end Validation Scenarios linking US, AC, WF, API         | 15–25 min    | /trace + /analyze — coverage + cross-artifact QA    |
| /scenarios   | /handoff        | Development Handoff Package — inventory, MVP scope, open items  | 5–10 min     | (pipeline complete)                                 |
| /handoff     | (none)          | Pipeline complete                                               | —            | Run /trace and /analyze for final coverage check    |

## Cross-cutting commands (no Next step line)

These skills do not advance the pipeline — they update or report on existing artifacts. Their closing block omits the `Next step:` block entirely (omit it cleanly — don't write "Next step: none"):

- `/trace` — coverage report (FR → US → UC → AC → NFR → API)
- `/clarify` — targeted ambiguity resolution; updates the artifact in place
- `/analyze` — cross-artifact quality report
- `/estimate` — effort estimation
- `/glossary` — glossary maintenance
- `/export` — export to Jira / GitHub Issues / Linear / CSV
- `/publish` — bundle artifacts for Notion (Markdown) or Confluence (HTML) import
- `/risk` — risk register
- `/sprint` — sprint plan

Their closing block ends after the "Available commands" table. Optionally, they can add a one-line "Re-run after fixes" hint (e.g., `/analyze` says "Re-run /analyze after each fix to track progress").

## Rules

- `{file_path}` is the full path where the artifact was saved (typically `output/<slug>/{NN}_{name}_{slug}.md`).
- The summary line is generated dynamically — do not repeat boilerplate; mention actual numbers and decisions ("18 FRs across 3 roles, 4 risks captured", not "the artifact was generated").
- The "Available commands" table is fixed (5 rows for pipeline skills). Cross-cutting skills omit `/done` from the table since they don't have a "finalize" state.
- The "Next step" block is built from the lookup table above. Do not hardcode it in individual SKILL.md files.
- The "If you're stuck" section is a 2–3-line nudge for users who don't know what to do next. Keep it short.
- The block is a chat message, not part of the saved Markdown file.
