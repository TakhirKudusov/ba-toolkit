---
name: wireframes
description: >
  Generate textual wireframe descriptions: screen structure, element placement, navigation, states (loading, empty, error). Use on /wireframes command, or when the user asks for "wireframe descriptions", "wireframes", "screen descriptions", "interface structure", "screen layouts", "UI description", "screen specification", "describe screens", "text prototype", "designer specification", "page descriptions". Ninth and final step of the BA Toolkit pipeline.
---

# /wireframes — Wireframe Descriptions

Ninth and final step of the BA Toolkit pipeline. Generates textual screen specifications for handoff to designers (not graphical mockups).

## Context loading

0. If `00_principles_*.md` exists in the output directory, load it and apply its conventions (artifact language, ID format, traceability requirements, Definition of Ready, quality gate threshold).
1. Read `01_brief_*.md`, `02_srs_*.md`, `03_stories_*.md`, `08_apicontract_*.md` (if exists).
2. Extract: slug, domain, US list, API endpoints, roles, platforms.
3. If domain supported, load `references/domains/{domain}.md`, section `9. /wireframes`. Use typical screens and domain-specific states.

## Environment

Read `references/environment.md` from the `ba-toolkit` directory to determine the output directory for the current platform. If the file is unavailable, apply the default rule: if `/mnt/user-data/outputs/` exists and is writable, save there (Claude.ai); otherwise save to the current working directory.

## Interview

> **Follow the [Interview Protocol](../references/interview-protocol.md):** ask one question at a time, present a 2-column `| ID | Variant |` markdown table of up to 4 domain-appropriate options plus a free-text "Other" row last (5 rows max), mark exactly one row (recommended) based on the loaded domain reference and prior answers, render variants in the user's language (rule 11), and wait for an answer before asking the next question.
>
> **Inline context (protocol rule 9):** if the user wrote text after `/wireframes` (e.g., `/wireframes mobile-first, focus on the checkout flow`), use it as a layout and scope hint for which screens to draft first.

3–7 topics per round, 2–4 rounds.

**Required topics:**
1. Platform — web (desktop, mobile responsive), native app, Telegram Mini App?
2. Design system — existing UI Kit or brand book?
3. Key screens — which to describe first?
4. Responsiveness — specific breakpoints (px) or fluid? Mobile-first or desktop-first?
5. Navigation model — tab bar, sidebar, burger menu?
6. **Accessibility level** — WCAG 2.1 A / AA / AAA? Affects design decisions (contrast, focus rings, hit targets, screen-reader semantics) at the wireframe stage, not just NFR time.
7. **Internationalisation** — multi-language at launch? RTL languages (Arabic, Hebrew)? Long-string accommodation (German labels can be 30%+ longer than English)? Locale-aware date / number / currency formatting?
8. **Specific states beyond the canonical 8** — see Rules below for the canonical state list. Are there feature-specific states (e.g. "trial expired", "plan limit reached", "account suspended", "offline mode")?

Supplement with domain-specific questions and typical screens from the reference.

## Generation

**File:** `09_wireframes_{slug}.md`

```markdown
# Wireframe Descriptions: {Name}

## Navigation Map
Overall navigation structure: sections, hierarchy, transitions.

---

## Screen: {Name} (WF-{NNN})
- **Linked US:** US-{NNN}
- **Platform:** {web | mobile | telegram mini app}
- **URL / Route:** {path}
- **Role:** {which role sees this screen}
- **Description:** {purpose}

### Structure
- **Header:** {elements}
- **Body:**
  - Block 1: {description}
  - Block 2: {description}
- **Footer:** {elements}

### Interface Elements
| Element | Type | Behavior | States | API Link |
|---------|------|----------|--------|----------|

### Screen States
- **Default:** ...
- **Loading:** ...
- **Empty:** ...
- **Error:** ...

### Navigation
- **From:** {source screens}
- **To:** {destination screens}
```

**Rules:**
- Numbering: WF-001, WF-002, ...
- Each WF linked to at least one US (in **Source**), at least one AC (in **Linked AC**), and — for performance- or accessibility-sensitive screens — at least one NFR (in **Linked NFR**).
- **Mandatory states (canonical 8):** loading (skeleton or spinner), empty (no data yet), loaded (data shown), partial (some data, more coming), success (after action completion), error (failure with recovery action), disabled (action not available with reason), and default (initial state if different from any of the above). Four-state minimum from earlier versions was insufficient.
- If API contract available, link interface elements to specific endpoints from `08_apicontract_*.md`.
- The artifact carries a US → WF coverage matrix at the bottom.

## Iterative refinement

- `/revise [WF-NNN]` — rewrite.
- `/expand [WF-NNN]` — add elements, states.
- `/split [WF-NNN]` — extract modals etc.
- `/clarify [focus]` — targeted ambiguity pass.
- `/validate` — all Must-US have a screen; API links correct; 4 states described; navigation connected.
- `/done` — finalize and move to the next pipeline step.

## Closing message

After saving the artifact, present the following summary to the user (see `references/closing-message.md` for format):

- Saved file path.
- Total number of screens (WF-NNN) documented and platform(s) covered.
- Navigation model confirmed (tab bar / sidebar / other).
- Count of screens with API endpoint links.

Available commands: `/clarify [focus]` · `/revise [WF-NNN]` · `/expand [WF-NNN]` · `/split [WF-NNN]` · `/validate` · `/done`

Build the `Next step:` block from the pipeline lookup table in `references/closing-message.md` (look up the row where `Current` is `/wireframes`). Do not hardcode the next step here — that table is the single source of truth.

## Style

Formal, neutral. No emoji, slang. Terms explained on first use. Generate the artifact in the language of the user's request.
