---
name: stories
description: >
  Generate User Stories based on the SRS. Format: "As a [role], I want [action], so that [value]". Use on /stories command, or when the user asks for "user stories", "create stories", "write user stories", "story decomposition", "epics and stories", "backlog", "break requirements into stories". Third step of the BA Toolkit pipeline.
---

# /stories — User Stories

Third step of the BA Toolkit pipeline. Generates User Stories from functional requirements in the SRS.

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold).
1. Read `01_brief_*.md` and `02_srs_*.md`. If SRS is missing, warn and suggest `/srs`.
2. Extract: slug, domain, roles, FR list, business rules, priorities.
3. If domain is supported, load `references/domains/{domain}.md`, section `3. /stories`.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, offer 3–5 domain-appropriate options (load `references/domains/{domain}.md` for the ones that fit), always include a free-text "Other" option as the last choice, and wait for an answer before asking the next question.

3–7 topics per round, 2–4 rounds.

**Required topics:**
1. Which user flows are most critical?
2. Are there edge cases requiring separate stories?
3. Is an Epic → Feature → Story hierarchy needed?
4. Are there specific personas for roles?
5. What is the Definition of Ready for a story?

Supplement with domain-specific questions and typical epics from the reference.

## Generation

**File:** `03_stories_{slug}.md`

```markdown
# User Stories: {Name}

## Epic: {Epic Name}
Brief description and business value.

### US-{NNN}: {Short Description}
- **Role:** {role from SRS}
- **Action:** {what they want to do}
- **Value:** {why, business outcome}
- **Priority:** {Must | Should | Could | Won't}
- **Linked FR:** FR-{NNN}
- **Acceptance Criteria:** _(filled at /ac stage)_
- **Notes:** {edge cases, additional context}
```

**Rules:**
- Sequential numbering: US-001, US-002, ...
- One story = one atomic action by one role.
- All Must-priority FR from SRS must have at least one US.
- Story covering > 3 scenarios — suggest `/split`.

## Iterative refinement

- `/revise [US-NNN or section]` — rewrite.
- `/expand [US-NNN]` — add detail.
- `/split [US-NNN]` — split into smaller stories.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all FR covered; no orphan stories; numbering correct; roles consistent.
- `/done` — finalize. Next step: `/usecases`.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Total number of user stories generated, grouped by Epic and MoSCoW priority.
- Count of Must-priority FR covered.
- Any stories flagged for `/split` due to complexity.

Available commands: `/clarify [focus]` · `/revise [US-NNN]` · `/expand [US-NNN]` · `/split [US-NNN]` · `/validate` · `/done`

Next step: `/usecases`

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
