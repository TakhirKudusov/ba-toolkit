---
name: clarify
description: >
  Targeted ambiguity-resolution pass over a BA Toolkit artifact. Use on /clarify command, or when the user asks to "clarify requirements", "find ambiguities", "what is unclear", "check vague terms", "resolve ambiguities", "what needs clarification". Can be focused on a specific area: /clarify security, /clarify FR-012. Utility skill available at any pipeline stage after the first artifact exists.
---

# /clarify — Targeted Ambiguity Resolution

Utility skill. Performs a post-generation scan of the target artifact, surfaces specific ambiguities as questions, collects answers from the user, and updates the artifact.

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

Scan the target artifact (or the specified section) for the following 11 ambiguity categories. Categories A–F are the original set; G–K are post-v3.5.0 additions that catch the gaps a senior BA would notice on a regulated or international project.

### A. Metrics-free adjectives
Requirements containing words like "fast", "reliable", "scalable", "secure", "user-friendly", "simple", "efficient", "high performance", "low latency" without a measurable criterion.

### B. Undefined terms
Terms, abbreviations, or roles used in the artifact but not defined in the glossary or SRS roles section.

### C. Conflicting rules
Business rules or constraints that contradict each other or contradict rules in prior artifacts.

### D. Missing mandatory fields
Elements that lack required fields per the artifact's own template (e.g., a FR without Priority, a US without Linked FR, an AC without a Then clause, an FR without `Source` per the v3.5.0+ template).

### E. Ambiguous actors or scope
Actions assigned to "the system", "the user", or "admin" where the specific role or external system is unclear.

### F. Duplicate or overlapping requirements
Functionally equivalent or near-duplicate elements within the artifact or across artifacts.

### G. Quantification gaps
Numbers without units, frequency claims without a window ("every 5 minutes" vs "5 minutes p95"), thresholds without a measurement method, percentages without a base.

### H. Time-zone gaps
Timestamps without a stated time zone, "midnight" without specifying which time zone's midnight, business-hour rules without a region.

### I. Currency gaps
Monetary amounts without a currency code, multi-region pricing without a per-region table, conversion rules without a rate source.

### J. Scale gaps
"Users" without specifying which population (concurrent / registered / monthly active / daily active), "data" without volume, "requests" without rate.

### K. Modal verb confusion
Inconsistent use of must / shall / should / may. IEEE 830 expects strict modal discipline: "shall" = mandatory contractual obligation, "should" = recommended, "may" = permitted, "must" = required by external constraint. Mixed modals across the same artifact undermine acceptance.

## Output to the user

Present findings as a structured table the user can answer in-place rather than as a numbered list of free-text questions. Each row references the exact location (section + element ID), the category, the question, and an empty answer cell:

```
Ambiguities found in {artifact_file} ({N} questions):

| # | Location | Category | Question | Answer |
|---|----------|----------|----------|--------|
| 1 | FR-003 | A — Metrics-free | "The system must respond quickly" — what is the acceptable response time in ms under normal load? | _(awaiting answer)_ |
| 2 | US-007 | B — Undefined term | Role "Manager" used here but not defined in `02_srs_*.md` Roles. Equivalent to "Admin"? Separate role? | _(awaiting answer)_ |
| 3 | FR-015 vs NFR-002 | C — Conflicting | NFR-002 requires TLS 1.3 only; FR-015 mentions "standard encryption". Reference NFR-002 explicitly? | _(awaiting answer)_ |
| 4 | AC-005-02 | A — Metrics-free | "Then" clause says "system handles the error correctly" — specific expected behaviour? | _(awaiting answer)_ |
| 5 | FR-022 | I — Currency gap | "User charged a fee" — currency? per region? | _(awaiting answer)_ |
```

The table format lets the user fill in answers in the rightmost column and copy-paste the table back. It also lets the user defer specific questions explicitly by writing `(deferred)` instead of an answer.

If no ambiguities are found, state that clearly and suggest `/analyze` for a broader cross-artifact check.

## Resolution

After presenting the table, wait for the user to answer. Accept answers inline (the user can reply with the table filled in, or answer free-form by row number). After all answers are received:

1. Apply the answers to update the artifact (rewrite affected elements).
2. **Ripple-effect check.** Before saving, identify any answer that affects a prior or downstream artifact (a role definition affects `/srs` Roles section AND `/stories` personas AND `/usecases` actors AND `/scenarios` personas; a new business rule affects `/srs` business rules AND `/ac` Given/When/Then conditions AND `/datadict` constraints AND `/apicontract` validation rules). For each ripple, list the affected files and offer to update them with `/revise`. Do not auto-modify unrelated artifacts without confirmation.
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
