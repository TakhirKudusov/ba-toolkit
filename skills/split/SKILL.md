---
name: split
description: >
  Break a large element (FR, User Story, Use Case, etc.) into smaller, more manageable pieces. Use on /split command, or when the user asks to "split this story", "break down", "decompose", "this is too big", "split requirement", "make smaller". References INVEST criteria for User Stories and Mike Cohn's nine story-splitting patterns. Utility skill available at any pipeline stage after the first artifact exists.
---

# /split — Element Decomposition

Utility skill. Breaks a large element (FR, US, UC, AC, NFR) into smaller, well-scoped pieces. Updates the artifact in place; does not generate a new file.

## Syntax

```
/split [element ID] [optional: split strategy hint]
```

Examples:
- `/split US-014` — split User Story 014
- `/split FR-003` — split Functional Requirement 003
- `/split US-014 by user role` — split by role (one of Cohn's patterns)
- `/split UC-005 by happy path vs error paths` — split by flow
- `/split FR-012 into CRUD operations` — split by operation

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it. Use its ID conventions (section 2) to assign new IDs and its Definition of Ready (section 4) to validate the resulting elements.
1. Identify the target artifact by finding the element ID in the output directory.
2. Read the target artifact fully.
3. Read prior artifacts for context (the element's linked FRs, upstream brief goals, etc.).

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory. If unavailable, apply the default rule.

## Slug source

Read `references/slug-source.md` from the `ba-toolkit` directory. Follow its rules to resolve the project slug from `AGENTS.md`.

## Split strategies

Use the appropriate strategy based on the element type and the user's hint. If no hint is provided, choose the best strategy automatically.

### For User Stories — INVEST + Cohn's nine patterns

A story should be split when it violates the **S** (Small) or **I** (Independent) criteria of INVEST. Apply one of Mike Cohn's nine story-splitting patterns:

1. **By workflow step.** "As a buyer, I can purchase an item" → separate stories for browse, add-to-cart, checkout, payment, confirmation.
2. **By business rule variation.** "As a master, I can set pricing" → separate stories for fixed price, auction, bulk discount.
3. **By data variation.** "As a buyer, I can search" → separate stories for search by keyword, by category, by price range, by material.
4. **By interface.** "As a user, I can pay" → separate stories for card payment, SBP, e-wallet.
5. **By user role.** "As a user, I can manage profile" → separate stories for buyer profile vs. master profile.
6. **By CRUD operation.** "As an admin, I can manage masters" → create, read, update, delete/suspend.
7. **By happy path vs. exceptions.** "As a buyer, I can place an order" → happy path, out-of-stock, payment failure, address validation error.
8. **By effort (spike + implementation).** "As a developer, I can integrate payment gateway" → research/spike story + implementation story.
9. **By platform/channel.** "As a user, I can receive notifications" → email, push, in-app.

### For Functional Requirements

Split by:
- **Sub-function.** A compound FR ("The system shall manage orders") → separate FRs for order creation, status tracking, cancellation, refund.
- **Actor.** An FR that serves multiple roles → one FR per role.
- **Trigger condition.** An FR with multiple triggers → one FR per trigger.

### For Use Cases

Split by:
- **Goal level.** A summary-level UC → multiple user-goal-level UCs.
- **Main flow vs. extensions.** A UC with 5+ extensions → promote major extensions to separate UCs.

## Split workflow

### Step 1 — Analyze the element

Read the element and determine:
- Why it is too large (too many acceptance criteria, too many business rules, too many actors, compound action).
- Which split strategy fits best.
- How many pieces it should become (typically 2–4; never more than 6).

### Step 2 — Propose the split

Present the proposed split for user review:

```
Splitting {element_ID}: "{element title}"

Strategy: {strategy name} (e.g., "by workflow step")
Reason: {why this element is too large}

| New ID | Title | Priority | Key difference |
|--------|-------|----------|----------------|
| US-014a | ... | Must | ... |
| US-014b | ... | Must | ... |
| US-014c | ... | Should | ... |

The original {element_ID} will be replaced by these {N} elements.

Cross-references that currently point to {element_ID}:
- AC-021, AC-022 → will be reassigned to the appropriate new element
- UC-005 step 3 → will reference US-014a

Apply? (yes / adjust — describe what to change)
```

### Step 3 — Assign new IDs

Follow the project's ID convention:

- **If the project uses sequential IDs** (FR-001, FR-002, …), assign the next available IDs.
- **Suffix convention.** If the user prefers, use suffix IDs (US-014a, US-014b, US-014c) to preserve traceability to the original element.
- **Ask if ambiguous.** If the convention is unclear, ask the user.

### Step 4 — Apply and update references

1. Replace the original element with the new elements in the artifact.
2. Update all internal cross-references within the artifact (e.g., MoSCoW summary table, forward traceability matrix).
3. Check for references in other artifacts. List affected files and offer to update:

```
The following artifacts reference {element_ID}:
- `05_ac_*.md` — AC-021, AC-022 linked to the original story
- `04_usecases_*.md` — UC-005 step 3

Update them? (yes / no / pick files)
```

### Step 5 — Validate result

After applying, run a quick INVEST check on each new User Story (if applicable) and report:

```
INVEST check:
- US-014a: ✓ all criteria pass
- US-014b: ✓ all criteria pass
- US-014c: ⚠ Testable — no AC linked yet (will be created in /ac step)
```

## Closing message

After saving, present the following summary (see `references/closing-message.md` for format):

- Saved file path(s).
- Original element replaced by {N} new elements.
- Cross-reference updates applied or deferred.

Available commands: `/split [element]` (split another element) · `/validate` · `/revise [section]` · `/done`

No pipeline advancement — return to the current artifact's workflow.

## Style

Formal, neutral. Generate output in the language of the artifact.
