---
name: clarify
description: >
  Targeted ambiguity-resolution pass over a BA Toolkit artifact. Use on /clarify command, or when the user asks to "clarify requirements", "find ambiguities", "what is unclear", "check vague terms", "resolve ambiguities", "what needs clarification". Can be focused on a specific area: /clarify security, /clarify FR-012. Cross-cutting command available at any pipeline stage after the first artifact exists.
---

# /clarify — Targeted Ambiguity Resolution

Cross-cutting command. Performs a post-generation scan of the target artifact, surfaces specific ambiguities as questions, collects answers from the user, and updates the artifact.

## Syntax

```
/clarify [optional: focus area or element ID]
```

Examples:
- `/clarify` — scan the most recent artifact entirely
- `/clarify security` — focus on security-related requirements
- `/clarify FR-012` — focus on a single requirement
- `/clarify NFR` — focus on non-functional requirements

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it. Use its Definition of Ready (section 4) to identify missing mandatory fields, and its ID conventions (section 2) to validate references.
1. Identify the target artifact:
   - If the user specifies an element ID (FR-NNN, US-NNN, etc.) or a section keyword, use the artifact that contains it.
   - Otherwise, use the most recently generated artifact in the output directory.
2. Read the target artifact fully.
3. Read prior artifacts for cross-reference checks (roles, terms, IDs).

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Analysis pass

Scan the target artifact (or the specified section) for the following ambiguity categories:

### A. Metrics-free adjectives
Requirements containing words like "fast", "reliable", "scalable", "secure", "user-friendly", "simple", "efficient", "high performance", "low latency" without a measurable criterion.

### B. Undefined terms
Terms, abbreviations, or roles used in the artifact but not defined in the glossary or SRS roles section.

### C. Conflicting rules
Business rules or constraints that contradict each other or contradict rules in prior artifacts.

### D. Missing mandatory fields
Elements that lack required fields per the artifact's own template (e.g., a FR without Priority, a US without Linked FR, an AC without a Then clause).

### E. Ambiguous actors or scope
Actions assigned to "the system", "the user", or "admin" where the specific role or external system is unclear.

### F. Duplicate or overlapping requirements
Functionally equivalent or near-duplicate elements within the artifact or across artifacts.

## Output to the user

Present findings as a numbered list of targeted questions. Each item references the exact location (section, element ID, line summary):

```
Ambiguities found in {artifact_file}:

1. [FR-003] "The system must respond quickly" — what is the acceptable response time in milliseconds under normal load?
2. [US-007] Role "Manager" is used here but not defined in the SRS Roles section — is this equivalent to "Admin", or a separate role?
3. [NFR-002 vs FR-015] NFR-002 requires TLS 1.3 only, but FR-015 mentions "standard encryption" — should FR-015 explicitly reference NFR-002?
4. [AC-005-02] The "Then" clause states "the system handles the error correctly" — what is the specific expected behavior (message shown, state reset, redirect)?
```

If no ambiguities are found, state that clearly and suggest `/analyze` for a broader cross-artifact check.

## Resolution

After presenting the list, wait for the user to answer. Accept answers inline (user can reply to all questions in one message or answer one by one). After all answers are received:

1. Apply the answers to update the artifact (rewrite affected elements).
2. If an answer affects a prior artifact (e.g., a role definition belongs in the SRS), flag it and offer to update that artifact as well.
3. Save the updated artifact.

## Closing message

After saving the updated artifact, present the following summary (see `references/closing-message.md` for format):

- Saved file path.
- Number of ambiguities found and resolved.
- Any items deferred (user did not answer or flagged for later).
- If prior artifacts were also updated, list them.

Available commands: `/clarify [focus]` (run again) · `/validate` · `/done`

No pipeline advancement — return to the current artifact's workflow.

## Style

Formal, neutral. Questions must be specific and reference exact element IDs. Generate output in the language of the artifact.
