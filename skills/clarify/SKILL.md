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

Present findings **one at a time**, following the same conversational flow as the interview protocol (see `references/interview-protocol.md` rule 1). After the analysis pass, count the total ambiguities found and present them sequentially with `(N/M)` numbering.

Each question shows the location, category, and the specific ambiguity:

```
Found {M} ambiguities in {artifact_file}. Resolving one at a time.

(1/5) **FR-003** · Category A — Metrics-free
"The system must respond quickly" — what is the acceptable response time in ms under normal load?
```

Wait for the user to answer before showing the next question.

For **binary or constrained questions** (e.g., "Is Manager the same as Admin?" or "Which currency?"), present a short options table following the interview protocol format:

```
(2/5) **US-007** · Category B — Undefined term
Role "Manager" used here but not defined in Roles. What is it?

| ID | Variant                                          |
|----|--------------------------------------------------|
| a  | Same as "Admin" — merge into one role             |
| b  | Separate role with its own permissions             |
| c  | Other — type your own answer                       |
```

For **open-ended questions** (e.g., "What is the response time target?"), ask directly without a table — the user types a free-form answer.

The user can reply `skip` or `defer` to any question to leave it unresolved. Acknowledge each answer in one line before moving to the next question.

If no ambiguities are found, state that clearly and suggest `/analyze` for a broader cross-artifact check.

## Resolution

After all questions are answered (or deferred):

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

Formal, neutral. Questions must be specific and reference exact element IDs. Generate output in the language of the artifact — see `references/language-rule.md` for what to translate and what stays in English.
